import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faBookOpen,
  faUsers,
  faCalendarAlt,
  faClock,
  faGraduationCap,
  faChalkboardTeacher,
  faUser,
  faExclamationTriangle,
  faSpinner,
  faBuilding,
  faFileAlt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const CourseDetails = () => {
  const { year, section, semester, courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyData, setFacultyData] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Fetching course details for:", { year, section, semester, courseId });

        // First, try to get faculty data to improve course information
        let facultyData = null;
        try {
          const { auth } = await import("../firebase");
          const { onAuthStateChanged } = await import("firebase/auth");
          
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const facultyRef = doc(db, 'faculty', 'CSE_DS', 'members', user.uid);
              const facultySnap = await getDoc(facultyRef);
              if (facultySnap.exists()) {
                facultyData = facultySnap.data();
                setFacultyData(facultyData);
                console.log("✅ Faculty data fetched:", facultyData.name);
              }
            }
          });
        } catch (error) {
          console.log("❌ Could not fetch faculty data:", error);
        }

                 let foundCourseData = null;

         // DYNAMIC UNIVERSAL FETCH - Works with any Firestore structure
         const fetchCourseData = async () => {
           console.log("🚀 Dynamic course fetch starting...");
           
           // Strategy 1: Try exact path first (your current structure)
           try {
             const coursePath = doc(db, 'courses', 'CSE_DS', 'year_sem', `${year}_${semester}`, 'courseDetails', courseId);
             const courseSnap = await getDoc(coursePath);
             if (courseSnap.exists()) {
               foundCourseData = courseSnap.data();
               console.log("✅ Course found via exact path");
               return foundCourseData;
             }
           } catch (error) {
             console.log("❌ Exact path failed, trying alternatives...");
           }

           // Strategy 2: Try collectionGroup query (universal)
           try {
             const cg = collectionGroup(db, "courseDetails");
             const q = query(cg, where("__name__", "==", courseId));
             const snap = await getDocs(q);
             if (!snap.empty) {
               foundCourseData = snap.docs[0].data();
               console.log("✅ Course found via collectionGroup");
               return foundCourseData;
             }
           } catch (error) {
             console.log("❌ CollectionGroup failed, trying path variations...");
           }

           // Strategy 3: Try multiple path variations dynamically
           const pathVariations = [
             // Your exact structure
             ['courses', 'CSE_DS', 'year_sem', `${year}_${semester}`, 'courseDetails', courseId],
             // Alternative structures
             ['courses', 'CSE_DS', 'year_sem', 'III_5', 'courseDetails', courseId],
             ['courses', 'CSE_DS', 'year_sem', 'III_6', 'courseDetails', courseId],
             ['courses', 'CSE_DS', 'year_sem', 'III_7', 'courseDetails', courseId],
             ['courses', 'CSE_DS', 'year_sem', 'III_8', 'courseDetails', courseId],
             // Old structure variations
             ['courses', year, section, semester, 'courseDetails', courseId],
             ['courses', 'III', 'A', '5', 'courseDetails', courseId],
             ['courses', 'III', 'B', '5', 'courseDetails', courseId],
             ['courses', 'III', 'C', '5', 'courseDetails', courseId],
             // Direct course structure
             ['courses', courseId],
             ['courseDetails', courseId],
             // Department variations
             ['courses', 'CSE', 'year_sem', `${year}_${semester}`, 'courseDetails', courseId],
             ['courses', 'CSEDS', 'year_sem', `${year}_${semester}`, 'courseDetails', courseId],
           ];

           for (const pathSegments of pathVariations) {
             try {
               const coursePath = doc(db, ...pathSegments);
               const courseSnap = await getDoc(coursePath);
               if (courseSnap.exists()) {
                 foundCourseData = courseSnap.data();
                 console.log("✅ Course found via path variation:", pathSegments.join('/'));
                 return foundCourseData;
               }
             } catch (error) {
               // Continue to next variation
             }
           }

           console.log("❌ No course found in any path variation");
           return null;
         };

         // Execute dynamic fetch
         foundCourseData = await fetchCourseData();

         // If no course data found, create a fallback
         if (!foundCourseData) {
           console.log("⚠️ No course data found, creating fallback data");
           foundCourseData = {
             courseName: `Course ${courseId}`,
             courseCode: courseId,
             description: `Course ${courseId} - ${facultyData?.name || 'Faculty'}`,
             displayYear: year || "III",
             displaySection: section || "A", 
             displaySemester: semester || "5",
             displayDepartment: "Computer Science & Engineering (Data Science)",
             credits: 3,
             studentsBySection: {},
             students: []
           };
         }

         // Dynamic student fetching
         const fetchStudents = async (courseData) => {
           if (!courseData) return [];

           console.log("📚 Dynamic student fetch starting...");
           const allStudents = [];

           // Strategy 1: studentsBySection (your structure)
           if (courseData.studentsBySection && typeof courseData.studentsBySection === 'object') {
             console.log("📚 Found studentsBySection structure");
             Object.keys(courseData.studentsBySection).forEach(sectionKey => {
               if (Array.isArray(courseData.studentsBySection[sectionKey])) {
                 courseData.studentsBySection[sectionKey].forEach(studentId => {
                   allStudents.push({ id: studentId, section: sectionKey });
                 });
               }
             });
           }

           // Strategy 2: students array (alternative structure)
           if (courseData.students && Array.isArray(courseData.students)) {
             console.log("📚 Found students array structure");
             courseData.students.forEach(studentId => {
               allStudents.push({ id: studentId, section: 'A' });
             });
           }

           // Strategy 3: enrolledStudents array
           if (courseData.enrolledStudents && Array.isArray(courseData.enrolledStudents)) {
             console.log("📚 Found enrolledStudents array structure");
             courseData.enrolledStudents.forEach(studentId => {
               allStudents.push({ id: studentId, section: 'A' });
             });
           }

           console.log("📚 Total student IDs found:", allStudents.length);

           // Dynamic student detail fetching
           const studentPromises = allStudents.map(async ({ id: studentId, section: sectionKey }) => {
             const studentPathVariations = [
               // Your exact structure
               ['students', 'CSEDS', `${year}-${sectionKey}`, studentId],
               ['students', 'CSE_DS', `${year}_${sectionKey}`, studentId],
               // Alternative structures
               ['students', 'CSEDS', 'III-A', studentId],
               ['students', 'CSE_DS', 'III_A', studentId],
               ['students', 'CSE', 'III-A', studentId],
               ['students', 'CSEDS', 'III-B', studentId],
               ['students', 'CSE_DS', 'III_B', studentId],
               ['students', 'CSEDS', 'III-C', studentId],
               ['students', 'CSE_DS', 'III_C', studentId],
               // Direct student structure
               ['students', studentId],
               ['studentDetails', studentId],
               // Department variations
               ['students', 'CSE', `${year}-${sectionKey}`, studentId],
               ['students', 'CSEDS', `${year}_${sectionKey}`, studentId],
             ];

             for (const pathSegments of studentPathVariations) {
               try {
                 const studentPath = doc(db, ...pathSegments);
                 const studentSnap = await getDoc(studentPath);
                 if (studentSnap.exists()) {
                   return { 
                     id: studentId, 
                     section: sectionKey,
                     ...studentSnap.data() 
                   };
                 }
               } catch (error) {
                 // Continue to next variation
               }
             }

             // Fallback student data
             return { 
               id: studentId, 
               name: `Student ${studentId}`, 
               rollNo: studentId,
               section: sectionKey
             };
           });

           const students = await Promise.all(studentPromises);
           console.log("✅ Students fetched dynamically:", students.length);
           return students;
         };

         // Execute dynamic student fetch
         if (foundCourseData) {
           const students = await fetchStudents(foundCourseData);
           setEnrolledStudents(students);
         } else {
           console.log("⚠️ No course data available for student fetch");
           setEnrolledStudents([]);
         }

                 // ONLY DIRECT FETCH - No fallbacks needed with your exact schema

                 // Set course data with exact schema mapping - Handle null foundCourseData
         setCourseData({
           id: courseId,
           year: foundCourseData?.displayYear || year || "III",
           section: foundCourseData?.displaySection || section || "A",
           semester: foundCourseData?.displaySemester || semester || "5",
           courseName: foundCourseData?.courseName || `Course ${courseId}`,
           courseCode: foundCourseData?.courseCode || courseId,
           description: foundCourseData?.description || `Course ${courseId} - ${facultyData?.name || 'Faculty'}`,
           instructor: foundCourseData?.instructor,
           instructorName: facultyData?.name || foundCourseData?.instructor || "Faculty Member",
           credits: foundCourseData?.credits || 3,
           department: foundCourseData?.displayDepartment || "Computer Science & Engineering (Data Science)",
           studentsBySection: foundCourseData?.studentsBySection || {},
           masterCoursePath: foundCourseData?.masterCoursePath,
           semesterKey: foundCourseData?.semesterKey || `${year}_${semester}`,
           students: foundCourseData?.students || []
         });

        // Fetch students (simplified)
        setEnrolledStudents([]);

             } catch (error) {
         console.error("❌ Error:", error);
         console.log("🔍 Debug info:", { year, section, semester, courseId, foundCourseData });
         setError(`Error fetching course details: ${error.message}`);
       } finally {
         setLoading(false);
       }
    };

    fetchCourseDetails();
  }, [year, section, semester, courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-blue-600 text-4xl animate-spin mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-accent text-4xl mb-4" />
          <div className="text-primary text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border-theme">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
                <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">Course Details</h1>
                <p className="text-secondary text-xs">Welcome back, {facultyData?.name || 'Faculty'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/logout')}
              className="btn-primary inline-flex items-center gap-2 px-3 py-2 text-sm"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Course Information */}
        <div className="bg-surface border border-border-theme rounded-md p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Course Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Course Name</label>
                <p className="text-primary">{courseData?.courseName || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Course Code</label>
                <p className="text-primary">{courseData?.courseCode || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Credits</label>
                <p className="text-primary">{courseData?.credits || 'Loading...'} credits</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                <p className="text-primary">{courseData?.description || 'No description available'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Instructor</label>
                <p className="text-primary">{courseData?.instructorName || courseData?.instructor || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Semester</label>
                <p className="text-primary">{courseData?.semester || 'Loading...'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Enrolled Students</label>
                <p className="text-primary">{enrolledStudents.length || 0} students</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary`}>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link
            to={`/attendance/${courseData.year}/${courseData.section}/${courseData.semester}/${courseData.id}`}
            className="bg-surface border border-border-theme rounded-md p-6 hover:shadow transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Take Attendance</h3>
            </div>
            <p className="text-secondary mb-4">
              Mark attendance for students enrolled in this course.
            </p>
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90">
              <FontAwesomeIcon icon={faClipboardCheck} />
              Take Attendance
            </div>
          </Link>

          <Link
            to={`/grades/${courseData.year}/${courseData.section}/${courseData.semester}/${courseData.id}`}
            className="bg-surface border border-border-theme rounded-md p-6 hover:shadow transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Manage Grades</h3>
            </div>
            <p className="text-secondary mb-4">
              Update and manage student grades for this course.
            </p>
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              <FontAwesomeIcon icon={faEdit} />
              Manage Grades
            </div>
          </Link>
        </div>

        {/* Course Statistics */}
        <div className="bg-surface border border-border-theme rounded-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Course Statistics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-accent">{enrolledStudents.length || 0}</div>
              <div className="text-sm text-secondary">Enrolled Students</div>
            </div>
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-secondary">85%</div>
              <div className="text-sm text-secondary">Average Attendance</div>
            </div>
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-primary">78%</div>
              <div className="text-sm text-secondary">Average Grade</div>
            </div>
            <div className="bg-background rounded-md p-4 text-center border border-border-theme">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-sm text-secondary">Assignments</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface border border-border-theme rounded-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-accent/10 text-accent rounded-md flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-primary">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-background rounded-md border border-border-theme">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faBuilding} className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">Attendance marked for today</h4>
                <p className="text-xs text-secondary">32 students present, 3 absent</p>
              </div>
              <div className="text-xs text-secondary">2 hours ago</div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-background rounded-md border border-border-theme">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">Assignment deadline updated</h4>
                <p className="text-xs text-secondary">Project submission due next week</p>
              </div>
              <div className="text-xs text-secondary">1 day ago</div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-background rounded-md border border-border-theme">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-xs" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-primary text-sm">Grades updated</h4>
                <p className="text-xs text-secondary">Mid-term exam grades posted</p>
              </div>
              <div className="text-xs text-secondary">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
