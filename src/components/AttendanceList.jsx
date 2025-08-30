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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 animate-fade-in border border-gray-200 dark:border-gray-700" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mr-6 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 dark:text-red-400 text-6xl mb-6 animate-bounce" />
          <div className="text-gray-950 dark:text-white text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Attendance Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faClipboardList} className="text-white text-lg"/>
                </div>
                Attendance Management
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-gray-800 dark:text-gray-200"/>
                Track and manage student attendance for your courses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-800 dark:text-gray-200">Today's Classes</p>
                <p className="text-lg font-semibold text-gray-950 dark:text-white">{classSchedules.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex flex-wrap gap-3">
            {[{key:'schedule',label:'Schedule'},{key:'take',label:'Take Attendance'},{key:'reports',label:'Reports'}].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab===tab.key
                  ?'bg-primary text-white shadow-lg'
                  :'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Select Date</h2>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM dd, yyyy"
            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white text-sm"
            placeholderText="Select date for attendance"
          />
        </div>

        {/* Today's Schedule */}
        {activeTab==='schedule' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Today's Class Schedule ({todayDay})</h2>
          </div>
          
          {classSchedules.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
              <p className="text-gray-800 dark:text-gray-200">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {classSchedules.map((schedule, index) => (
                <div 
                  key={schedule.id} 
                  className="group bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCourseSelect(schedule)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-lg" />
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                      {schedule.courseName || "Unnamed Course"}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                        <FontAwesomeIcon icon={faClock} className="text-primary"/>
                        <span>{schedule.startTime || "N/A"} - {schedule.endTime || "N/A"}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
                        <FontAwesomeIcon icon={faUsers} className="text-primary"/>
                        <span>{schedule.enrolledStudents?.length || 0} Students</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Attendance Taking Section */}
        {(activeTab==='take') && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-white text-sm" />
                </div>
                <h2 className="text-xl font-bold text-gray-950 dark:text-white">Attendance {selectedCourse?`for ${selectedCourse.courseName}`:''}</h2>
              </div>
              <button
                onClick={saveAttendance}
                disabled={savingAttendance}
                className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-md disabled:opacity-50 inline-flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faSave} />
                {savingAttendance ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-sm text-gray-800 dark:text-gray-200">Mark all as:</span>
              <button onClick={() => setBulkStatus('present')} className="px-4 py-2 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-700 transition-all duration-300">Present</button>
              <button onClick={() => setBulkStatus('late')} className="px-4 py-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-700 transition-all duration-300">Late</button>
              <button onClick={() => setBulkStatus('absent')} className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-700 transition-all duration-300">Absent</button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">{attendanceStats.total || 0}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200">Total Students</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
                <div className="text-2xl font-bold text-green-800 dark:text-green-300">{attendanceStats.present || 0}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200">Present ({attendanceStats.presentPercentage || 0}%)</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center border border-orange-200 dark:border-orange-700">
                <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">{attendanceStats.late || 0}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200">Late ({attendanceStats.latePercentage || 0}%)</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border border-red-200 dark:border-red-700">
                <div className="text-2xl font-bold text-red-800 dark:text-red-300">{attendanceStats.absent || 0}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200">Absent ({attendanceStats.absentPercentage || 0}%)</div>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-4">
              {enrolledStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-4 animate-fade-in hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-950 dark:text-white text-sm">{student.name}</h4>
                        <p className="text-xs text-gray-800 dark:text-gray-200">{student.rollNo || student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          attendanceData[student.id]?.present
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900/30 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'late')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          attendanceData[student.id]?.late
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          attendanceData[student.id]?.absent
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-600'
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Quick Actions</h2>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-primary"/>
                <DatePicker
                  selected={reportDate}
                  onChange={(d) => setReportDate(d)}
                  dateFormat="MMMM dd, yyyy"
                  className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white"
                />
              </div>
              <button onClick={fetchAttendanceForDate} className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-md">Load Records</button>
              <button onClick={() => exportReportCSV(reportRecords)} className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-gray-200 dark:border-gray-600">Export CSV</button>
            </div>
          </div>

          {reportRecords.length === 0 ? (
            <div className="text-center text-gray-800 dark:text-gray-200">No records for the selected date.</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-600 text-left text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Present</th>
                    <th className="px-6 py-4">Late</th>
                    <th className="px-6 py-4">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRecords.map(r => (
                    <tr key={r.id} className="border-t border-gray-200 dark:border-gray-600 text-sm">
                      <td className="px-6 py-4 text-gray-950 dark:text-white">{r.courseName || r.courseId}</td>
                      <td className="px-6 py-4 text-gray-950 dark:text-white">{new Date(r.date).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-950 dark:text-white">{r.presentCount ?? 0}</td>
                      <td className="px-6 py-4 text-gray-950 dark:text-white">{r.lateCount ?? 0}</td>
                      <td className="px-6 py-4 text-gray-950 dark:text-white">{r.absentCount ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Link 
              to="/attendance-reports" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faChartBar} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">View Reports</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Generate attendance reports</p>
            </Link>
            
            <Link 
              to="/courses" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faBookOpen} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">My Courses</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Manage your courses</p>
            </Link>
            
            <Link 
              to="/home" 
              className="group bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border border-gray-200 dark:border-gray-600"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FontAwesomeIcon icon={faHome} className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2">Dashboard</h3>
              <p className="text-gray-800 dark:text-gray-200 text-sm">Return to dashboard</p>
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;

