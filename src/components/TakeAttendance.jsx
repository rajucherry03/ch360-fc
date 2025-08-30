import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, collectionGroup, doc, getDoc, getDocs, addDoc, query, where, documentId } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClipboardList, faCheckCircle, faClock, faTimesCircle, faUserGraduate, faCalendarAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';

const TakeAttendance = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { year, section, semester, courseId } = useParams();

  const [course, setCourse] = useState(state?.course || null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [coursePreview, setCoursePreview] = useState({}); // { [courseId]: { count, items: [{name, rollNo}] } }

  // Resolve course if not passed via state
  useEffect(() => {
    let unsub;
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => {
          unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
              setError('Not authenticated');
              setLoading(false);
              resolve();
              return;
            }
            // If course not present, load from collectionGroup by documentId or list all faculty courses
            try {
              if (!course && courseId) {
                const cg = collectionGroup(db, 'courseDetails');
                const qs = await getDocs(query(cg, where(documentId(), 'in', [courseId])));
                qs.forEach((d) => {
                  const seg = d.ref.path.split('/');
                  setCourse({ id: d.id, year: seg[1], section: seg[2], semester: seg[3], ...d.data() });
                });
              }
              if (!course && !courseId) {
                let list = [];
                try {
                  const cg = collectionGroup(db, 'courseDetails');
                  const qs = await getDocs(query(cg, where('instructor', '==', user.uid)));
                  list = qs.docs.map(d => {
                    const seg = d.ref.path.split('/');
                    return { id: d.id, year: seg[1], section: seg[2], semester: seg[3], ...d.data() };
                  });
                } catch (_) {
                  // Fallback without index: enumerate common year/section/semester
                  const years = ['I','II','III','IV'];
                  const sections = ['A','B','C','D','E','F'];
                  const semesters = ['sem1','sem2'];
                  const tasks = [];
                  years.forEach((y) => {
                    sections.forEach((sec) => {
                      semesters.forEach((sem) => {
                        tasks.push(getDocs(query(collection(db, 'courses', y, sec, sem, 'courseDetails'), where('instructor', '==', user.uid))));
                      });
                    });
                  });
                  const results = await Promise.all(tasks);
                  results.forEach(snap => {
                    snap.forEach(d => {
                      const seg = d.ref.path.split('/');
                      list.push({ id: d.id, year: seg[1], section: seg[2], semester: seg[3], ...d.data() });
                    });
                  });
                }
                setFacultyCourses(list);
              }
            } catch (e) {
              // non-fatal; user can navigate back
            }
            setLoading(false);
            resolve();
          });
        });
      } catch (e) {
        setError('Failed to initialize');
        setLoading(false);
      }
    };
    init();
    return () => unsub && unsub();
  }, [course, courseId]);

  // Build course previews (limited student list) when we have facultyCourses
  useEffect(() => {
    const buildPreview = async () => {
      if (!facultyCourses || facultyCourses.length === 0) return;
      const preview = {};
      for (const c of facultyCourses) {
        const ids = Array.isArray(c.students) ? c.students : [];
        const items = [];
        let count = ids.length;
        for (let i = 0; i < Math.min(ids.length, 5); i++) {
          const sid = ids[i];
          const tries = [
            doc(db, `students/${c.year}/${c.section}/${sid}`),
            doc(db, `students/${sid}`),
          ];
          let snap = null;
          for (const p of tries) {
            const s = await getDoc(p);
            if (s.exists()) { snap = s; break; }
          }
          if (snap && snap.exists()) {
            const data = snap.data();
            items.push({ name: data.name || sid, rollNo: data.rollNo || '' });
          }
        }
        preview[c.id] = { count, items };
      }
      setCoursePreview(preview);
    };
    buildPreview();
  }, [facultyCourses]);

  // Load students
  useEffect(() => {
    const loadStudents = async () => {
      if (!course) return;
      setLoading(true);
      try {
        let ids = Array.isArray(course.students) ? course.students : [];
        if (ids.length === 0) {
          ids = [];
        }
        const list = [];
        if (ids.length > 0) {
          for (const sid of ids) {
            const tries = [
              doc(db, `students/${course.year}/${course.section}/${sid}`),
              doc(db, `students/${sid}`),
            ];
            let snap = null;
            for (const p of tries) {
              const s = await getDoc(p);
              if (s.exists()) { snap = s; break; }
            }
            if (snap && snap.exists()) list.push({ id: snap.id, ...snap.data(), year: course.year, section: course.section });
          }
        }
        setStudents(list);
        const init = {};
        list.forEach(s => {
          init[s.id] = { present: false, late: false, excused: false, absent: true, note: '' };
        });
        setAttendance(init);
      } catch (e) {
        setError('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [course]);

  const mark = (id, status) => {
    setAttendance(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        present: status === 'present',
        late: status === 'late',
        excused: status === 'excused',
        absent: status === 'absent'
      }
    }));
  };

  const bulk = (status) => {
    setAttendance(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        next[id] = { ...next[id], present: status === 'present', late: status === 'late', excused: status === 'excused', absent: status === 'absent' };
      });
      return next;
    });
  };

  const totals = useMemo(() => {
    const vals = Object.values(attendance);
    const present = vals.filter(v => v.present).length;
    const late = vals.filter(v => v.late).length;
    const excused = vals.filter(v => v.excused).length;
    const absent = vals.filter(v => v.absent).length;
    return { total: students.length, present, late, excused, absent };
  }, [attendance, students.length]);

  const save = useCallback(async () => {
    if (!course) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'attendance'), {
        courseId: course.id,
        courseName: course.courseName || course.id,
        date: selectedDate.toISOString(),
        facultyId: auth.currentUser?.uid || '',
        attendance,
        totalStudents: totals.total,
        presentCount: totals.present,
        lateCount: totals.late,
        excusedCount: totals.excused,
        absentCount: totals.absent,
        createdAt: new Date().toISOString(),
      });
      navigate(-1);
    } catch (e) {
      setError('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  }, [course, selectedDate, attendance, totals, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <div className="text-gray-950 dark:text-white text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Take Attendance Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faClipboardList} className="text-white text-lg"/>
                </div>
                Take Attendance
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-800 dark:text-gray-200"/>
                {course ? `${course?.courseName || courseId} • ${course?.year}-${course?.section} • ${course?.semester?.toUpperCase?.() || course?.semester}` : 'Select a course to begin'}
              </p>
            </div>
          </div>
        </div>

        {!course && (
          facultyCourses.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-950 dark:text-white mb-2">No courses found</h3>
              <p className="text-gray-800 dark:text-gray-200">No courses found for your account.</p>
            </div>
          ) : (
            <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {facultyCourses.map((c, i) => (
                <div key={c.id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">{c.courseName || c.id}</h3>
                    <p className="text-gray-800 dark:text-gray-200 mb-4 text-sm leading-relaxed">{c.year}-{c.section} • {c.semester?.toUpperCase?.() || c.semester}</p>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                      <FontAwesomeIcon icon={faUserGraduate} className="text-primary"/>
                      <span>Enrolled Students: {coursePreview[c.id]?.count ?? 0}</span>
                    </div>
                    {coursePreview[c.id]?.items?.length > 0 && (
                      <div className="space-y-1">
                        {coursePreview[c.id].items.map((it, idx) => (
                          <div key={idx} className="text-xs text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                            • {it.name}{it.rollNo ? ` (${it.rollNo})` : ''}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => setCourse(c)} className="bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:shadow-md">Start</button>
                </div>
              ))}
            </section>
          )
        )}

        {course && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-gray-800 dark:text-gray-200">Mark all as:</span>
              <button onClick={() => bulk('present')} className="px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-700 transition-all duration-300">
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2"/>Present
              </button>
              <button onClick={() => bulk('late')} className="px-4 py-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-700 transition-all duration-300">
                <FontAwesomeIcon icon={faClock} className="mr-2"/>Late
              </button>
              <button onClick={() => bulk('excused')} className="px-4 py-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 transition-all duration-300">
                Excused
              </button>
              <button onClick={() => bulk('absent')} className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-700 transition-all duration-300">
                <FontAwesomeIcon icon={faTimesCircle} className="mr-2"/>Absent
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {students.map((s) => (
                <div key={s.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-950 dark:text-white">{s.name || s.id}</div>
                        <div className="text-xs text-gray-800 dark:text-gray-200">{s.rollNo || s.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => mark(s.id, 'present')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        attendance[s.id]?.present 
                          ? 'bg-green-600 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900/30 border border-gray-200 dark:border-gray-600'
                      }`}>
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2"/>Present
                      </button>
                      <button onClick={() => mark(s.id, 'late')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        attendance[s.id]?.late 
                          ? 'bg-orange-600 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-gray-200 dark:border-gray-600'
                      }`}>
                        <FontAwesomeIcon icon={faClock} className="mr-2"/>Late
                      </button>
                      <button onClick={() => mark(s.id, 'excused')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        attendance[s.id]?.excused 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600'
                      }`}>
                        Excused
                      </button>
                      <button onClick={() => mark(s.id, 'absent')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        attendance[s.id]?.absent 
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-600'
                      }`}>
                        <FontAwesomeIcon icon={faTimesCircle} className="mr-2"/>Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={save} disabled={saving} className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-md disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TakeAttendance;
