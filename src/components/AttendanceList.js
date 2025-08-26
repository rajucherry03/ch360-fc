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
import { collection, doc, getDoc, getDocs, addDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AttendanceList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classSchedules, setClassSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({});

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

          const facultyDocRef = doc(db, "faculty", user.uid);
          const facultyDocSnap = await getDoc(facultyDocRef);

          if (!facultyDocSnap.exists()) {
            throw new Error("Faculty document not found.");
          }

          // Fetch courses taught by this faculty (for future use)
          const coursesRef = collection(db, "courses");
          const coursesQuery = query(coursesRef, where("instructor", "==", user.uid));
          await getDocs(coursesQuery);

          // Fetch timetable for today's classes
          const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
          const timetablePath = `timetables/III/A`;
          const timetableCollectionRef = collection(db, timetablePath);
          const timetableDocsSnap = await getDocs(timetableCollectionRef);

          const schedules = timetableDocsSnap.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter(schedule => schedule.day === today);

          setClassSchedules(schedules);
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

  const fetchEnrolledStudents = async (courseId) => {
    try {
      // Fetch students enrolled in the selected course
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      
      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        const studentIds = courseData.enrolledStudents || [];
        
        // Fetch student details
        const students = [];
        for (const studentId of studentIds) {
          const studentRef = doc(db, "students", studentId);
          const studentSnap = await getDoc(studentRef);
          if (studentSnap.exists()) {
            students.push({
              id: studentSnap.id,
              ...studentSnap.data()
            });
          }
        }
        
        setEnrolledStudents(students);
        
        // Initialize attendance data
        const initialAttendance = {};
        students.forEach(student => {
          initialAttendance[student.id] = {
            present: false,
            late: false,
            absent: true,
            note: ""
          };
        });
        setAttendanceData(initialAttendance);
      }
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
        absent: status === 'absent'
      }
    }));
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 shimmer rounded-lg mb-4"></div>
            <div className="h-6 shimmer rounded w-1/3"></div>
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-xl shadow-lg p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center">
                  <div className="w-16 h-16 shimmer rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 shimmer rounded w-3/4 mb-2"></div>
                    <div className="h-3 shimmer rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-16 shimmer rounded-full"></div>
                  <div className="h-5 w-16 shimmer rounded-full"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4 animate-bounce" />
          <div className="text-red-600 text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FontAwesomeIcon icon={faClipboardList} className="text-indigo-600 animate-pulse"/>
              Attendance Management
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-400"/>
              Track and manage student attendance for your courses
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg px-6 py-4 text-gray-700 border border-white/20">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-indigo-500"/>
              <span className="font-medium">Today's Classes:</span>
              <span className="font-bold text-indigo-600 text-xl">{classSchedules.length}</span>
            </div>
          </div>
        </header>

        {/* Date Selection */}
        <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Select Date</h2>
          </div>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM dd, yyyy"
            className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            placeholderText="Select date for attendance"
          />
        </div>

        {/* Today's Schedule */}
        <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Today's Class Schedule ({todayDay})</h2>
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
                  className="group glass rounded-xl shadow-lg p-6 hover-lift animate-fade-in cursor-pointer border-2 border-transparent hover:border-indigo-200 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleCourseSelect(schedule)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-xl" />
                    </div>
                    <FontAwesomeIcon icon={faArrowRight} className="text-indigo-400 group-hover:translate-x-1 transition-transform duration-300"/>
                  </div>
                  
                  <h3 className="text-lg font-bold gradient-text group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 mb-2">
                    {schedule.courseName || "Unnamed Course"}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FontAwesomeIcon icon={faClock} className="text-indigo-400"/>
                    <span>{schedule.startTime || "N/A"} - {schedule.endTime || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <FontAwesomeIcon icon={faUsers} className="text-indigo-400"/>
                    <span>{schedule.enrolledStudents?.length || 0} Students</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance Taking Section */}
        {selectedCourse && (
          <div className="glass rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">Attendance for {selectedCourse.courseName}</h2>
              </div>
              <button
                onClick={saveAttendance}
                disabled={savingAttendance}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={savingAttendance ? faClock : faSave} className={savingAttendance ? "animate-spin" : ""} />
                {savingAttendance ? "Saving..." : "Save Attendance"}
              </button>
            </div>

            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{attendanceStats.total || 0}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">{attendanceStats.present || 0}</div>
                <div className="text-sm text-gray-600">Present ({attendanceStats.presentPercentage || 0}%)</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late || 0}</div>
                <div className="text-sm text-gray-600">Late ({attendanceStats.latePercentage || 0}%)</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                <div className="text-2xl font-bold text-red-600">{attendanceStats.absent || 0}</div>
                <div className="text-sm text-gray-600">Absent ({attendanceStats.absentPercentage || 0}%)</div>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-4">
              {enrolledStudents.map((student, index) => (
                <div 
                  key={student.id} 
                  className="bg-white/50 rounded-lg p-4 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={student.profilePicture || "https://via.placeholder.com/40"} 
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.rollNo || student.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Attendance Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'present')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
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
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            attendanceData[student.id]?.late
                              ? 'bg-yellow-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                          }`}
                        >
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          Late
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student.id, 'absent')}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
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
                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="glass rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-white" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default AttendanceList;
