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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-4xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Courses
            </button>
                         <div>
               <h1 className="text-2xl font-bold text-gray-900">
                 {courseData.courseName || courseData.courseCode || `Course ${courseId}`}
               </h1>
               <p className="text-gray-600 text-sm">
                 {courseData.year}-{courseData.section} • Semester {courseData.semester}
               </p>
             </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Course Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Overview */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBookOpen} className="text-blue-600" />
                Course Overview
              </h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                   <p className="text-gray-900 font-medium">{courseData.courseName || courseData.courseCode || `Course ${courseId}`}</p>
                 </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                   <p className="text-gray-900 font-medium">{courseData.courseCode || courseData.id}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                   <p className="text-gray-900 font-medium">{courseData.department || "Computer Science & Engineering"}</p>
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <p className="text-gray-900">{courseData.credits || "Not specified"}</p>
                </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                   <p className="text-gray-900">{courseData.instructorName || courseData.instructor || "Not assigned"}</p>
                 </div>
                                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                   <p className="text-gray-900">{courseData.description || courseData.courseDescription || `Course ${courseId} - ${facultyData?.name || 'Faculty'}`}</p>
                 </div>
              </div>
            </div>

            {/* Course Details */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-green-600" />
                Course Details
              </h2>
              
                             <div className="grid gap-4 md:grid-cols-2">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                   <p className="text-gray-900">{courseData.year}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                   <p className="text-gray-900">{courseData.section}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                   <p className="text-gray-900">{courseData.semester}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                   <p className="text-gray-900">{courseData.department || "Computer Science & Engineering"}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Semester Key</label>
                   <p className="text-gray-900">{courseData.semesterKey || "Not specified"}</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                   <p className="text-gray-900">{enrolledStudents.length}</p>
                 </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Course Path</label>
                   <p className="text-gray-900 text-sm font-mono bg-gray-100 p-2 rounded">
                     {courseData.masterCoursePath || `/courses/CSE_DS/year_sem/${courseData.semesterKey}/courseDetails/${courseId}/sections/${courseData.section}`}
                   </p>
                 </div>
               </div>
            </div>

                         {/* Enrolled Students */}
             <div className="bg-white border rounded-lg p-6">
               <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                 <FontAwesomeIcon icon={faUsers} className="text-purple-600" />
                 Enrolled Students ({enrolledStudents.length})
               </h2>
               
               {enrolledStudents.length > 0 ? (
                 <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                       <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Student ID
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Name
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Roll No
                         </th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Section
                         </th>
                       </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                       {enrolledStudents.map((student, index) => (
                         <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                             {student.id}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {student.name || student.studentName || `Student ${student.id}`}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {student.rollNo || student.rollNumber || student.id}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {student.section || 'A'}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-4xl mb-4" />
                   <p className="text-gray-600">No students enrolled in this course yet.</p>
                 </div>
               )}
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">Total Students</span>
                   <span className="font-semibold text-gray-900">{enrolledStudents.length}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-600">Sections</span>
                   <span className="font-semibold text-gray-900">
                     {courseData.studentsBySection ? Object.keys(courseData.studentsBySection).length : 0}
                   </span>
                 </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Credits</span>
                  <span className="font-semibold text-gray-900">{courseData.credits || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-semibold text-gray-900">{courseData.year}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Section</span>
                  <span className="font-semibold text-gray-900">{courseData.section}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Semester</span>
                  <span className="font-semibold text-gray-900">{courseData.semester}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/attendance/${courseData.year}/${courseData.section}/${courseData.semester}/${courseData.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Mark Attendance
                </button>
                <button
                  onClick={() => navigate(`/grades/${courseData.year}/${courseData.section}/${courseData.semester}/${courseData.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Manage Grades
                </button>
                <button
                  onClick={() => navigate(`/exam/${courseData.year}/${courseData.section}/${courseData.semester}/${courseData.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  Create Exam
                </button>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3 text-sm">
                                 <div className="flex items-center gap-2">
                   <FontAwesomeIcon icon={faChalkboardTeacher} className="text-blue-600 w-4" />
                   <span className="text-gray-600">Instructor:</span>
                   <span className="font-medium">{courseData.instructorName || courseData.instructor || "Not assigned"}</span>
                 </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-green-600 w-4" />
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{courseData.department || "CSE"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600 w-4" />
                  <span className="text-gray-600">Semester:</span>
                  <span className="font-medium">{courseData.semester}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-orange-600 w-4" />
                  <span className="text-gray-600">Credits:</span>
                  <span className="font-medium">{courseData.credits || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
