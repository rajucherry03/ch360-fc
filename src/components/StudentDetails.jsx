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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-gray-600 text-lg">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="text-blue-600 text-xl font-semibold mb-2">{error}</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="text-gray-700 text-xl font-semibold">Student not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700">
              <FontAwesomeIcon icon={faArrowLeft} />
              Back
            </button>
            <div className="w-16 h-16 card-blue rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faUserGraduate} className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">{student.name || 'Student'}</h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                <FontAwesomeIcon icon={faIdCard} className="text-blue-600" />
                {student.rollNo || 'Roll No —'} • {year}-{section}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 text-center">
              <div className="text-sm text-gray-500">Attendance</div>
              <div className="text-2xl font-bold text-blue-600">{student.attendancePercentage ?? '—'}%</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 text-center">
              <div className="text-sm text-gray-500">CGPA</div>
              <div className="text-2xl font-bold text-blue-600">{student.cgpa ?? '—'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 text-center">
              <div className="text-sm text-gray-500">Year-Section</div>
              <div className="text-2xl font-bold text-blue-600">{student.year || '—'}-{student.section || '—'}</div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {[{key:'overview',label:'Overview'},{key:'attendance',label:'Attendance'},{key:'grades',label:'Grades'},{key:'courses',label:'Courses'},{key:'contacts',label:'Contacts'}].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab===tab.key?'bg-blue-600 text-white':'text-gray-700 hover:bg-gray-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {activeTab==='overview' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-6 mb-6">
                <img src={student.profilePicture || 'https://via.placeholder.com/150'} alt="Profile" className="w-24 h-24 rounded-full border border-gray-200" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-700"><FontAwesomeIcon icon={faEnvelope} className="text-blue-600" /> {student.email || '—'}</div>
                  <div className="flex items-center gap-3 text-gray-700"><FontAwesomeIcon icon={faPhone} className="text-blue-600" /> {student.studentMobile || '—'}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Father's Name</div>
                  <div className="text-gray-800 font-medium">{student.fatherName || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mother's Name</div>
                  <div className="text-gray-800 font-medium">{student.motherName || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Father's Mobile</div>
                  <div className="text-gray-800 font-medium">{student.fatherMobile || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="text-gray-800">{student.address || '—'}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="btn-campus-primary px-4 py-3 rounded-xl">Message Student</button>
                <button className="btn-campus-primary px-4 py-3 rounded-xl">View Attendance</button>
                <button className="btn-campus-primary px-4 py-3 rounded-xl">View Grades</button>
              </div>
            </div>
          </section>
        )}

        {/* Attendance */}
        {activeTab==='attendance' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600"/> Attendance</h2>
            <div className="text-gray-600">No detailed attendance data available.</div>
          </section>
        )}

        {/* Grades */}
        {activeTab==='grades' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FontAwesomeIcon icon={faChartBar} className="text-blue-600"/> Grades</h2>
            <div className="text-gray-600">No grade records available.</div>
          </section>
        )}

        {/* Courses */}
        {activeTab==='courses' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><FontAwesomeIcon icon={faBookOpen} className="text-blue-600"/> Courses</h2>
            {enrolledCourses.length === 0 ? (
              <div className="text-gray-600">No enrolled courses found.</div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((c, i) => (
                  <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 card-blue rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faBookOpen} className="text-white" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">{c.courseName || c.id}</div>
                    <div className="text-sm text-gray-600 mb-2">{c.courseCode || '—'}</div>
                    <div className="text-sm text-gray-600">{c.year}-{c.section} • {c.semester?.toUpperCase?.() || c.semester || '—'}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Contacts */}
        {activeTab==='contacts' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-gray-800 font-medium">{student.email || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Student Mobile</div>
                <div className="text-gray-800 font-medium">{student.studentMobile || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Father Mobile</div>
                <div className="text-gray-800 font-medium">{student.fatherMobile || '—'}</div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;
