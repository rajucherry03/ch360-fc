import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase configuration
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faEnvelope,
  faPhone,
  faUsers,
  faCheckCircle,
  faCalendarAlt,
  faBookOpen,
  faIdCard,
  faArrowLeft,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';

const StudentDetails = () => {
  const { year, section, id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Nested path students/{year}/{section}/{id}; fallback to root-level students/{id}
        let studentDocSnap = await getDoc(doc(db, `students/${year}/${section}/${id}`));
        if (!studentDocSnap.exists()) {
          studentDocSnap = await getDoc(doc(db, `students/${id}`));
        }

        if (studentDocSnap.exists()) {
          const s = studentDocSnap.data();
          setStudent(s);

          // Fetch enrolled courses by IDs in student's `courses` array (chunked by 10)
          if (Array.isArray(s.courses) && s.courses.length > 0) {
            try {
              const ids = s.courses.filter(Boolean);
              const chunks = [];
              for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
              const all = [];
              for (const chunk of chunks) {
                const cg = collectionGroup(db, 'courseDetails');
                const qs = await getDocs(query(cg, where(documentId(), 'in', chunk)));
                qs.forEach(d => {
                  const seg = d.ref.path.split('/');
                  all.push({
                    id: d.id,
                    year: seg[1],
                    section: seg[2],
                    semester: seg[3],
                    ...d.data(),
                  });
                });
              }
              setEnrolledCourses(all);
            } catch (_) {
              // fallback: ignore if index missing
              setEnrolledCourses([]);
            }
          } else {
            setEnrolledCourses([]);
          }
        } else {
          setError('Student not found.');
        }
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError('Failed to fetch student details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-theme">
          <div className="w-16 h-16 bg-surface rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-secondary text-lg">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-theme">
          <div className="text-primary text-xl font-semibold mb-2">{error}</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-theme">
          <div className="text-primary text-xl font-semibold">Student not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-theme hover:bg-surface text-primary">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </button>
            <div className="w-16 h-16 card-blue rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faUserGraduate} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-2">{student.name || 'Student'}</h1>
              <p className="text-secondary text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-blue-600" />
                {student.rollNo || 'Roll No —'} • {year}-{section}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface rounded-2xl shadow-xl px-6 py-4 border border-theme text-center">
              <div className="text-sm text-secondary">Attendance</div>
              <div className="text-2xl font-bold text-primary">{student.attendancePercentage ?? '—'}%</div>
            </div>
            <div className="bg-surface rounded-2xl shadow-xl px-6 py-4 border border-theme text-center">
              <div className="text-sm text-secondary">CGPA</div>
              <div className="text-2xl font-bold text-primary">{student.cgpa ?? '—'}</div>
            </div>
            <div className="bg-surface rounded-2xl shadow-xl px-6 py-4 border border-theme text-center">
              <div className="text-sm text-secondary">Year-Section</div>
              <div className="text-2xl font-bold text-primary">{student.year || '—'}-{student.section || '—'}</div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-surface rounded-2xl shadow-xl p-2 mb-8 border border-theme">
          <div className="flex flex-wrap gap-2">
            {[{key:'overview',label:'Overview'},{key:'attendance',label:'Attendance'},{key:'grades',label:'Grades'},{key:'courses',label:'Courses'},{key:'contacts',label:'Contacts'}].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab===tab.key?'btn-secondary text-white':'text-primary hover:bg-surface'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {activeTab==='overview' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface rounded-2xl shadow-xl p-8 border border-theme">
              <div className="flex items-center gap-6 mb-6">
                <img src={student.profilePicture || 'https://via.placeholder.com/150'} alt="Profile" className="w-24 h-24 rounded-full border border-theme" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-primary"><FontAwesomeIcon icon={faEnvelope} className="text-[var(--color-primary)]" /> {student.email || '—'}</div>
                  <div className="flex items-center gap-3 text-primary"><FontAwesomeIcon icon={faPhone} className="text-[var(--color-primary)]" /> {student.studentMobile || '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-secondary">Father's Name</div>
                  <div className="text-primary font-medium">{student.fatherName || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Mother's Name</div>
                  <div className="text-primary font-medium">{student.motherName || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Father's Mobile</div>
                  <div className="text-primary font-medium">{student.fatherMobile || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-secondary">Address</div>
                  <div className="text-primary">{student.address || '—'}</div>
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-2xl shadow-xl p-8 border border-theme">
              <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="btn-primary px-4 py-3 rounded-xl">Message Student</button>
                <button className="btn-primary px-4 py-3 rounded-xl">View Attendance</button>
                <button className="btn-primary px-4 py-3 rounded-xl">View Grades</button>
              </div>
            </div>
          </section>
        )}

        {/* Attendance */}
        {activeTab==='attendance' && (
          <section className="bg-surface rounded-2xl shadow-xl p-8 border border-theme">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><FontAwesomeIcon icon={faCalendarAlt} className="text-[var(--color-primary)]"/> Attendance</h2>
            <div className="text-secondary">No detailed attendance data available.</div>
          </section>
        )}

        {/* Grades */}
        {activeTab==='grades' && (
          <section className="bg-surface rounded-2xl shadow-xl p-8 border border-theme">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><FontAwesomeIcon icon={faChartBar} className="text-[var(--color-primary)]"/> Grades</h2>
            <div className="text-secondary">No grade records available.</div>
          </section>
        )}

        {/* Courses */}
        {activeTab==='courses' && (
          <section className="bg-surface rounded-2xl shadow-xl p-8 border border-theme">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2"><FontAwesomeIcon icon={faBookOpen} className="text-[var(--color-primary)]"/> Courses</h2>
            {enrolledCourses.length === 0 ? (
              <div className="text-secondary">No enrolled courses found.</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((c, i) => (
                  <div key={c.id} className="bg-background border border-theme rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 card-blue rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faBookOpen} className="text-white" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-primary mb-1">{c.courseName || c.id}</div>
                    <div className="text-sm text-secondary mb-2">{c.courseCode || '—'}</div>
                    <div className="text-sm text-secondary">{c.year}-{c.section} • {c.semester?.toUpperCase?.() || c.semester || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Contacts */}
        {activeTab==='contacts' && (
          <section className="bg-surface rounded-2xl shadow-xl p-8 border border-theme">
            <h2 className="text-xl font-bold text-primary mb-6">Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-secondary">Email</div>
                <div className="text-primary font-medium">{student.email || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-secondary">Student Mobile</div>
                <div className="text-primary font-medium">{student.studentMobile || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-secondary">Father Mobile</div>
                <div className="text-primary font-medium">{student.fatherMobile || '—'}</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
