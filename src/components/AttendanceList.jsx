import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faClock, 
  faChalkboardTeacher, 
  faCalendarAlt,
  faUsers,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faSave,
  faChartBar,
  faUserGraduate,
  faClipboardList,
  faArrowRight,
  faHome,
  faBookOpen,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, addDoc, query, where, orderBy, startAt, endAt, collectionGroup, documentId } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AttendanceList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classSchedules, setClassSchedules] = useState([]);
  const [facultyCourses, setFacultyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({});
  const [activeTab, setActiveTab] = useState('schedule');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportDate, setReportDate] = useState(new Date());
  const [reportRecords, setReportRecords] = useState([]);
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [courseSummary, setCourseSummary] = useState({ sessions: 0, perStudent: {} });

  useEffect(() => {
    const fetchTimetableAndCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          const facultyDocRef = doc(db, "faculty", "CSE_DS", "members", user.uid);
          const facultyDocSnap = await getDoc(facultyDocRef);

          if (!facultyDocSnap.exists()) {
            throw new Error("Faculty document not found.");
          }

          // Fetch courses taught by this faculty using collectionGroup
          let taughtCourses = [];
          try {
            const cg = collectionGroup(db, 'courseDetails');
            const qs = await getDocs(query(cg, where('instructor', '==', user.uid)));
            taughtCourses = qs.docs.map(d => {
              const seg = d.ref.path.split('/');
              return { id: d.id, year: seg[1], section: seg[2], semester: seg[3], ...d.data() };
            });
          } catch (_) {}
          setTaughtCourses(taughtCourses);
          setFacultyCourses(taughtCourses);

          // Fetch timetable for today's classes
          const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
          // Replace timetable view with direct course list for attendance
          // Build pseudo-schedule cards from taught courses
          const enriched = taughtCourses.map((c, i) => ({
            id: c.id,
            courseId: c.id,
            courseName: c.courseName || c.id,
            startTime: '—',
            endTime: '—',
            day: today,
            enrolledStudents: Array.isArray(c.students) ? c.students : [],
          }));
          setClassSchedules(enriched);
        });
      } catch (err) {
        console.error("Error fetching timetable and courses:", err.message);
        setError(err.message || "Error fetching timetable and courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableAndCourses();
  }, []);

  const fetchEnrolledStudents = async (courseLike) => {
    try {
      const courseId = courseLike?.id || courseLike?.courseId || selectedCourse?.id || selectedCourse?.courseId;
      // Prefer using timetable's enrolledStudents if present, otherwise resolve from courseDetails
      let studentIds = Array.isArray(courseLike?.enrolledStudents) ? courseLike.enrolledStudents : (Array.isArray(selectedCourse?.enrolledStudents) ? selectedCourse.enrolledStudents : []);
      if (studentIds.length === 0) {
        try {
          const cg = collectionGroup(db, 'courseDetails');
          // look up exact course by its documentId across the group
          const ids = [courseId];
          const qs = await getDocs(query(cg, where(documentId(), 'in', ids)));
          qs.forEach(d => {
            const data = d.data();
            if (Array.isArray(data.students)) studentIds = data.students;
          });
        } catch (_) {}
      }

      let students = [];
      if (studentIds.length > 0) {
        // Direct by IDs
        for (const sid of studentIds) {
          const tryPaths = [
            doc(db, `students/III/A/${sid}`),
            doc(db, `students/${sid}`),
          ];
          let snap = null;
          for (const p of tryPaths) {
            const s = await getDoc(p);
            if (s.exists()) { snap = s; break; }
          }
          if (snap && snap.exists()) students.push({ id: snap.id, ...snap.data() });
        }
      } else {
        // Fallback: derive year/section for the course, load that group and filter by courses array contains courseId
        const meta = taughtCourses.find(c => c.id === courseId) || {};
        const y = meta.year || 'III';
        const sec = meta.section || 'A';
        const groupRef = collection(db, `students/${y}/${sec}`);
        const groupSnap = await getDocs(groupRef);
        groupSnap.forEach(s => {
          const data = s.data();
          const courseArr = Array.isArray(data.courses) ? data.courses : [];
          if (courseArr.includes(courseId)) {
            students.push({ id: s.id, ...data, year: y, section: sec });
          }
        });
      }

      setEnrolledStudents(students);

      const initialAttendance = {};
      students.forEach(student => {
        initialAttendance[student.id] = {
          present: false,
          late: false,
          absent: true,
          excused: false,
          note: ""
        };
      });
      setAttendanceData(initialAttendance);
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchEnrolledStudents(course.id);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        present: status === 'present',
        late: status === 'late',
        absent: status === 'absent',
        excused: status === 'excused'
      }
    }));
  };

  const setBulkStatus = (status) => {
    setAttendanceData(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        next[id] = {
          ...next[id],
          present: status === 'present',
          late: status === 'late',
          absent: status === 'absent',
          excused: status === 'excused'
        };
      });
      return next;
    });
  };

  const handleNoteChange = (studentId, note) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const saveAttendance = async () => {
    if (!selectedCourse) return;
    
    setSavingAttendance(true);
    try {
      const attendanceRecord = {
        courseId: selectedCourse.id,
        courseName: selectedCourse.courseName,
        date: selectedDate.toISOString(),
        facultyId: auth.currentUser.uid,
        attendance: attendanceData,
        totalStudents: enrolledStudents.length,
        presentCount: Object.values(attendanceData).filter(a => a.present).length,
        lateCount: Object.values(attendanceData).filter(a => a.late).length,
        absentCount: Object.values(attendanceData).filter(a => a.absent).length,
        excusedCount: Object.values(attendanceData).filter(a => a.excused).length,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "attendance"), attendanceRecord);
      
      // Update attendance statistics
      updateAttendanceStats();
      
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance. Please try again.");
    } finally {
      setSavingAttendance(false);
    }
  };

  // Fetch attendance records for a selected date (Reports tab)
  const fetchAttendanceForDate = useCallback(async () => {
    try {
      const start = new Date(reportDate);
      start.setHours(0,0,0,0);
      const end = new Date(reportDate);
      end.setHours(23,59,59,999);
      const col = collection(db, 'attendance');
      const qs = await getDocs(query(col, orderBy('date'), startAt(start.toISOString()), endAt(end.toISOString())));
      const list = qs.docs.map(d => ({ id: d.id, ...d.data() }));
      setReportRecords(list);
    } catch (e) {
      console.error('Attendance report fetch failed:', e);
      setReportRecords([]);
    }
  }, [reportDate]);

  const exportReportCSV = (records) => {
    const header = ['courseId','courseName','date','total','present','late','absent'];
    const rows = records.map(r => [
      r.courseId || '',
      r.courseName || '',
      r.date || '',
      r.totalStudents ?? '',
      r.presentCount ?? '',
      r.lateCount ?? '',
      r.absentCount ?? ''
    ]);
    const csv = [header, ...rows].map(cols => cols.map(x => `"${String(x).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date(reportDate).toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateAttendanceStats = useCallback(() => {
    const total = enrolledStudents.length;
    const present = Object.values(attendanceData).filter(a => a.present).length;
    const late = Object.values(attendanceData).filter(a => a.late).length;
    const absent = Object.values(attendanceData).filter(a => a.absent).length;
    
    setAttendanceStats({
      total,
      present,
      late,
      absent,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((late / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0
    });
  }, [enrolledStudents.length, attendanceData]);

  useEffect(() => {
    if (enrolledStudents.length > 0) {
      updateAttendanceStats();
    }
  }, [updateAttendanceStats, enrolledStudents.length]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in border border-gray-100" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mr-6 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-border-theme">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-accent text-6xl mb-6 animate-bounce" />
          <div className="text-primary text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-primary">Attendance Management</h1>
            <p className="text-xs text-secondary hidden sm:block">Track and manage student attendance for your courses</p>
          </div>
          <div className="compact-card py-2 px-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-accent text-sm"/>
              <span className="text-sm text-secondary">Today's Classes:</span>
              <span className="text-base font-semibold text-primary">{classSchedules.length}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="compact-card mb-6">
          <div className="flex flex-wrap gap-2">
            {[{key:'schedule',label:'Schedule'},{key:'take',label:'Take Attendance'},{key:'reports',label:'Reports'}].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab===tab.key?'bg-accent text-white':'text-secondary hover:bg-surface'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="compact-card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-md bg-accent/10 text-accent flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-primary">Select Date</h2>
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
            dateFormat="MMMM dd, yyyy"
            className="w-full p-2 border border-border-theme rounded-md focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-background text-primary text-sm"
            placeholderText="Select date for attendance"
          />
        </div>

        {/* Today's Schedule */}
        {activeTab==='schedule' && (
        <div className="bg-surface border border-border-theme rounded-md p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Today's Class Schedule ({todayDay})</h2>
          </div>
          
          {classSchedules.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faBookOpen} className="text-secondary text-4xl mb-4" />
              <p className="text-secondary">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {classSchedules.map((schedule, index) => (
                <div 
                  key={schedule.id} 
                  className="bg-surface border border-border-theme rounded-md p-4 hover:shadow cursor-pointer transition"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCourseSelect(schedule)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-xs" />
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-accent"/>
                  </div>
                  
                  <h3 className="text-base font-semibold text-primary mb-2">
                    {schedule.courseName || "Unnamed Course"}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-secondary text-sm mb-2">
                    <FontAwesomeIcon icon={faClock} className="text-accent"/>
                    <span>{schedule.startTime || "N/A"} - {schedule.endTime || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-secondary text-sm">
                    <FontAwesomeIcon icon={faUsers} className="text-accent"/>
                    <span>{schedule.enrolledStudents?.length || 0} Students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Attendance Taking Section */}
        {(activeTab==='take') && (
          <div className="bg-surface border border-border-theme rounded-md p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-white text-xs" />
                </div>
                <h2 className="text-lg font-semibold text-primary">Attendance {selectedCourse?`for ${selectedCourse.courseName}`:''}</h2>
              </div>
              <button
                onClick={saveAttendance}
                disabled={savingAttendance}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faSave} />
                {savingAttendance ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-secondary">Mark all as:</span>
              <button onClick={() => setBulkStatus('present')} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium hover:bg-secondary/20">Present</button>
              <button onClick={() => setBulkStatus('late')} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20">Late</button>
              <button onClick={() => setBulkStatus('absent')} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20">Absent</button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-background rounded-md p-3 text-center">
                <div className="text-lg font-semibold text-accent">{attendanceStats.total || 0}</div>
                <div className="text-xs text-secondary">Total Students</div>
              </div>
              <div className="bg-background rounded-md p-3 text-center border border-border-theme">
                <div className="text-lg font-semibold text-secondary">{attendanceStats.present || 0}</div>
                <div className="text-xs text-secondary">Present ({attendanceStats.presentPercentage || 0}%)</div>
              </div>
              <div className="bg-background rounded-md p-3 text-center border border-border-theme">
                <div className="text-lg font-semibold text-accent">{attendanceStats.late || 0}</div>
                <div className="text-xs text-secondary">Late ({attendanceStats.latePercentage || 0}%)</div>
              </div>
              <div className="bg-background rounded-md p-3 text-center border border-border-theme">
                <div className="text-lg font-semibold text-accent">{attendanceStats.absent || 0}</div>
                <div className="text-xs text-secondary">Absent ({attendanceStats.absentPercentage || 0}%)</div>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {enrolledStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  className="bg-background rounded-md border border-border-theme p-3 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-accent text-sm" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary text-sm">{student.name}</h4>
                        <p className="text-xs text-secondary">{student.rollNo || student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          attendanceData[student.id]?.present
                            ? 'bg-secondary text-white shadow-lg'
                            : 'bg-surface text-secondary hover:bg-secondary/10'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'late')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          attendanceData[student.id]?.late
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-surface text-secondary hover:bg-accent/10'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          attendanceData[student.id]?.absent
                            ? 'bg-accent text-white shadow-lg'
                            : 'bg-surface text-secondary hover:bg-accent/10'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports/Actions */}
        {activeTab==='reports' && (
        <div className="bg-surface border border-border-theme rounded-md p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Quick Actions</h2>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border-theme mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-accent"/>
                <DatePicker
                  selected={reportDate}
                  onChange={(d) => setReportDate(d)}
                  dateFormat="MMMM dd, yyyy"
                  className="px-4 py-2 rounded-lg border border-border-theme focus:ring-2 focus:ring-accent focus:border-accent bg-background text-primary"
                />
              </div>
              <button onClick={fetchAttendanceForDate} className="btn-primary px-6 py-2 rounded-xl">Load Records</button>
              <button onClick={() => exportReportCSV(reportRecords)} className="btn-surface px-6 py-2 rounded-xl">Export CSV</button>
            </div>
          </div>

          {reportRecords.length === 0 ? (
            <div className="text-center text-secondary">No records for the selected date.</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-surface rounded-xl overflow-hidden border border-border-theme">
                <thead className="bg-background text-left text-sm text-secondary border-b border-border-theme">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Present</th>
                    <th className="px-4 py-3">Late</th>
                    <th className="px-4 py-3">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRecords.map(r => (
                    <tr key={r.id} className="border-t border-border-theme text-sm">
                      <td className="px-4 py-3 text-primary">{r.courseName || r.courseId}</td>
                      <td className="px-4 py-3 text-primary">{new Date(r.date).toLocaleString()}</td>
                      <td className="px-4 py-3 text-primary">{r.presentCount ?? 0}</td>
                      <td className="px-4 py-3 text-primary">{r.lateCount ?? 0}</td>
                      <td className="px-4 py-3 text-primary">{r.absentCount ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link 
              to="/attendance-reports" 
              className="group compact-card rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-primary">View Reports</h3>
              <p className="text-secondary">Generate attendance reports</p>
            </Link>
            
            <Link 
              to="/courses" 
              className="group compact-card rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-primary">My Courses</h3>
              <p className="text-secondary">Manage your courses</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group compact-card rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-primary">Dashboard</h3>
              <p className="text-secondary">Return to dashboard</p>
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;

