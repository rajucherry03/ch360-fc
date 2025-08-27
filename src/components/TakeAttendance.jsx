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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-1/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="text-blue-600 text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-container">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm text-gray-700 hover:bg-gray-100">
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Take Attendance</h1>
          <p className="text-xs text-gray-500">
            {course ? `${course?.courseName || courseId} • ${course?.year}-${course?.section} • ${course?.semester?.toUpperCase?.() || course?.semester}` : 'Select a course to begin'}
          </p>
        </div>

        {!course && (
          facultyCourses.length === 0 ? (
            <div className="text-center text-gray-700 bg-white rounded-2xl shadow-xl p-12 border border-gray-100">No courses found for your account.</div>
          ) : (
            <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {facultyCourses.map((c, i) => (
                <div key={c.id} className="group bg-white rounded-lg border p-4 hover:shadow-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
                      <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{c.courseName || c.id}</h3>
                  <p className="text-sm text-gray-600 mb-2">{c.year}-{c.section} • {c.semester?.toUpperCase?.() || c.semester}</p>
                  <div className="text-xs text-gray-600 mb-3">
                    Enrolled Students: {coursePreview[c.id]?.count ?? 0}
                    {coursePreview[c.id]?.items?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {coursePreview[c.id].items.map((it, idx) => (
                          <li key={idx} className="text-gray-700">• {it.name}{it.rollNo ? ` (${it.rollNo})` : ''}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button onClick={() => setCourse(c)} className="btn-campus-primary px-3 py-2 rounded-md text-sm">Start</button>
                </div>
              ))}
            </section>
          )
        )}

        {course && (
          <section className="compact-card">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-xs text-gray-600">Mark all as:</span>
              <button onClick={() => bulk('present')} className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200">Present</button>
              <button onClick={() => bulk('late')} className="px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium hover:bg-yellow-200">Late</button>
              <button onClick={() => bulk('excused')} className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200">Excused</button>
              <button onClick={() => bulk('absent')} className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200">Absent</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {students.map((s) => (
                <div key={s.id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-xs" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{s.name || s.id}</div>
                        <div className="text-xs text-gray-600">{s.rollNo || s.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => mark(s.id, 'present')} className={`px-2.5 py-1 rounded-full text-xs font-medium ${attendance[s.id]?.present ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}><FontAwesomeIcon icon={faCheckCircle} className="mr-1"/>Present</button>
                      <button onClick={() => mark(s.id, 'late')} className={`px-2.5 py-1 rounded-full text-xs font-medium ${attendance[s.id]?.late ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}><FontAwesomeIcon icon={faClock} className="mr-1"/>Late</button>
                      <button onClick={() => mark(s.id, 'excused')} className={`px-2.5 py-1 rounded-full text-xs font-medium ${attendance[s.id]?.excused ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-blue-100'}`}>Excused</button>
                      <button onClick={() => mark(s.id, 'absent')} className={`px-2.5 py-1 rounded-full text-xs font-medium ${attendance[s.id]?.absent ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100'}`}><FontAwesomeIcon icon={faTimesCircle} className="mr-1"/>Absent</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={save} disabled={saving} className="btn-campus-primary px-4 py-2 rounded-md text-sm disabled:opacity-50">
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
