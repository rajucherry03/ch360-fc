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
  faBookOpen
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-600 text-6xl mb-6 animate-bounce" />
          <div className="text-gray-800 text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm text-gray-700 hover:bg-gray-100">
              <span className="rotate-180">←</span>
              Back
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Attendance Management</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Track and manage student attendance for your courses</p>
          </div>
          <div className="compact-card py-2 px-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-sm"/>
              <span className="text-sm text-gray-700">Today's Classes:</span>
              <span className="text-base font-semibold text-gray-900">{classSchedules.length}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="compact-card mb-6">
          <div className="flex flex-wrap gap-2">
            {[{key:'schedule',label:'Schedule'},{key:'take',label:'Take Attendance'},{key:'reports',label:'Reports'}].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab===tab.key?'bg-blue-600 text-white':'text-gray-700 hover:bg-gray-100'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="compact-card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Select Date</h2>
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
            dateFormat="MMMM dd, yyyy"
            className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 text-sm"
            placeholderText="Select date for attendance"
          />
        </div>

        {/* Today's Schedule */}
        {activeTab==='schedule' && (
        <div className="bg-white border rounded-md p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Today's Class Schedule ({todayDay})</h2>
          </div>
          
          {classSchedules.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faBookOpen} className="text-gray-300 text-4xl mb-4" />
              <p className="text-gray-500">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {classSchedules.map((schedule, index) => (
                <div 
                  key={schedule.id} 
                  className="bg-white border rounded-md p-4 hover:shadow cursor-pointer transition"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCourseSelect(schedule)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-xs" />
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400"/>
                  </div>
                  
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {schedule.courseName || "Unnamed Course"}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                    <span>{schedule.startTime || "N/A"} - {schedule.endTime || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <FontAwesomeIcon icon={faUsers} className="text-indigo-400"/>
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
          <div className="bg-white border rounded-md p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-white text-xs" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Attendance {selectedCourse?`for ${selectedCourse.courseName}`:''}</h2>
              </div>
              <button
                onClick={saveAttendance}
                disabled={savingAttendance}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={savingAttendance ? faClock : faSave} className={savingAttendance ? "animate-spin" : ""} />
                {savingAttendance ? "Saving..." : "Save Attendance"}
              </button>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-gray-600">Mark all as:</span>
              <button onClick={() => setBulkStatus('present')} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200">Present</button>
              <button onClick={() => setBulkStatus('late')} className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium hover:bg-yellow-200">Late</button>
              <button onClick={() => setBulkStatus('excused')} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200">Excused</button>
              <button onClick={() => setBulkStatus('absent')} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200">Absent</button>
            </div>

            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-white/50 rounded-md p-3 text-center">
                <div className="text-lg font-semibold text-indigo-600">{attendanceStats.total || 0}</div>
                <div className="text-xs text-gray-600">Total Students</div>
              </div>
              <div className="bg-green-50 rounded-md p-3 text-center border border-green-200">
                <div className="text-lg font-semibold text-green-600">{attendanceStats.present || 0}</div>
                <div className="text-xs text-gray-600">Present ({attendanceStats.presentPercentage || 0}%)</div>
              </div>
              <div className="bg-yellow-50 rounded-md p-3 text-center border border-yellow-200">
                <div className="text-lg font-semibold text-yellow-600">{attendanceStats.late || 0}</div>
                <div className="text-xs text-gray-600">Late ({attendanceStats.latePercentage || 0}%)</div>
              </div>
              <div className="bg-red-50 rounded-md p-3 text-center border border-red-200">
                <div className="text-lg font-semibold text-red-600">{attendanceStats.absent || 0}</div>
                <div className="text-xs text-gray-600">Absent ({attendanceStats.absentPercentage || 0}%)</div>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {enrolledStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  className="bg-white rounded-md border p-3 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={student.profilePicture || "https://via.placeholder.com/40"} 
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{student.name}</h4>
                        <p className="text-xs text-gray-600">{student.rollNo || student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Attendance Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            attendanceData[student.id]?.present
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'late')}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            attendanceData[student.id]?.late
                              ? 'bg-yellow-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          Late
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'excused')}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            attendanceData[student.id]?.excused
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                          }`}
                        >
                          Excused
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            attendanceData[student.id]?.absent
                              ? 'bg-red-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
                          Absent
                        </button>
                      </div>
                      
                      {/* Note Input */}
                      <input
                        type="text"
                        placeholder="Add note..."
                        value={attendanceData[student.id]?.note || ""}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded-md text-xs focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports/Actions */}
        {activeTab==='reports' && (
        <div className="bg-white border rounded-md p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600"/>
                <DatePicker
                  selected={reportDate}
                  onChange={(d) => setReportDate(d)}
                  dateFormat="MMMM dd, yyyy"
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button onClick={fetchAttendanceForDate} className="btn-campus-primary px-6 py-2 rounded-xl">Load Records</button>
              <button onClick={() => exportReportCSV(reportRecords)} className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-100">Export CSV</button>
            </div>
          </div>

          {reportRecords.length === 0 ? (
            <div className="text-center text-gray-600">No records for the selected date.</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-white rounded-xl overflow-hidden">
                <thead className="bg-gray-50 text-left text-sm text-gray-600">
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
                    <tr key={r.id} className="border-t border-gray-100 text-sm">
                      <td className="px-4 py-3">{r.courseName || r.courseId}</td>
                      <td className="px-4 py-3">{new Date(r.date).toLocaleString()}</td>
                      <td className="px-4 py-3">{r.presentCount ?? 0}</td>
                      <td className="px-4 py-3">{r.lateCount ?? 0}</td>
                      <td className="px-4 py-3">{r.absentCount ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Link 
              to="/attendance-reports" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">View Reports</h3>
              <p className="text-gray-600">Generate attendance reports</p>
            </Link>
            
            <Link 
              to="/courses" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">My Courses</h3>
              <p className="text-gray-600">Manage your courses</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Dashboard</h3>
              <p className="text-gray-600">Return to dashboard</p>
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;

