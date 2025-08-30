import React, { useEffect, useState } from "react";
import { collection, collectionGroup, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Firebase configuration
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChalkboardTeacher, 
  faBookOpen, 
  faUsers, 
  faCalendarAlt, 
  faClock, 
  faExclamationTriangle,
  faGraduationCap,
  faArrowRight,
  faUser,
  faIdCard,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

const FacultyCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    useEffect(() => {
    const fetchFacultyCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          try {
            console.log("🔍 Starting course fetch for user:", user.uid);
            
            // Step 1: Fetch faculty data
            const facultyRef = doc(db, 'faculty', 'CSE_DS', 'members', user.uid);
            const facultySnap = await getDoc(facultyRef);
            
            if (!facultySnap.exists()) {
              setError("Faculty profile not found.");
              setCourses([]);
              setLoading(false);
              return;
            }

            const facultyData = facultySnap.data();
            setFacultyData(facultyData);
            console.log("✅ Faculty data fetched:", facultyData.name);

            // Step 2: Get course IDs from faculty data
            const allCourseIds = [];
            
            if (facultyData.courses && Array.isArray(facultyData.courses)) {
              allCourseIds.push(...facultyData.courses);
            }
            
            if (facultyData.teaching) {
              Object.keys(facultyData.teaching).forEach(section => {
                if (Array.isArray(facultyData.teaching[section])) {
                  allCourseIds.push(...facultyData.teaching[section]);
                }
              });
            }
            
            const uniqueCourseIds = [...new Set(allCourseIds)];
            console.log("📚 Course IDs from faculty data:", uniqueCourseIds);

                         // DYNAMIC UNIVERSAL FETCH - Works with any Firestore structure
             let foundCourses = [];

             if (uniqueCourseIds.length > 0) {
               console.log("🚀 Dynamic course fetch using course IDs:", uniqueCourseIds);
               
               // Dynamic course fetching function
               const fetchCourseDynamically = async (courseId) => {
                 // Strategy 1: Try exact path first (your current structure)
                 try {
                   const coursePath = doc(db, 'courses', 'CSE_DS', 'year_sem', 'III_5', 'courseDetails', courseId);
                   const courseSnap = await getDoc(coursePath);
                   if (courseSnap.exists()) {
                     const courseData = courseSnap.data();
                     console.log("✅ Found course via exact path:", courseData.courseName);
                     return {
                       id: courseId,
                       year: courseData.displayYear || "III",
                       section: courseData.displaySection || "A",
                       semester: courseData.displaySemester || "5",
                       courseName: courseData.courseName || `Course ${courseId}`,
                       courseCode: courseData.courseCode || courseId,
                       instructorName: facultyData.name,
                       instructor: courseData.instructor,
                       department: courseData.displayDepartment || "Computer Science & Engineering (Data Science)",
                       credits: courseData.credits || 3,
                       description: courseData.description || `Course ${courseId} - ${facultyData.name}`,
                       studentsBySection: courseData.studentsBySection || {},
                       masterCoursePath: courseData.masterCoursePath,
                       semesterKey: courseData.semesterKey || "III_5",
                       students: courseData.students || []
                     };
                   }
                 } catch (error) {
                   console.log("❌ Exact path failed for course:", courseId);
                 }

                 // Strategy 2: Try collectionGroup query (universal)
                 try {
                   const cg = collectionGroup(db, "courseDetails");
                   const q = query(cg, where("__name__", "==", courseId));
                   const snap = await getDocs(q);
                   if (!snap.empty) {
                     const courseData = snap.docs[0].data();
                     console.log("✅ Found course via collectionGroup:", courseData.courseName);
                     return {
                       id: courseId,
                       year: courseData.displayYear || "III",
                       section: courseData.displaySection || "A",
                       semester: courseData.displaySemester || "5",
                       courseName: courseData.courseName || `Course ${courseId}`,
                       courseCode: courseData.courseCode || courseId,
                       instructorName: facultyData.name,
                       instructor: courseData.instructor,
                       department: courseData.displayDepartment || "Computer Science & Engineering (Data Science)",
                       credits: courseData.credits || 3,
                       description: courseData.description || `Course ${courseId} - ${facultyData.name}`,
                       studentsBySection: courseData.studentsBySection || {},
                       masterCoursePath: courseData.masterCoursePath,
                       semesterKey: courseData.semesterKey || "III_5",
                       students: courseData.students || []
                     };
                   }
                 } catch (error) {
                   console.log("❌ CollectionGroup failed for course:", courseId);
                 }

                 // Strategy 3: Try multiple path variations dynamically
                 const pathVariations = [
                   // Your exact structure variations
                   ['courses', 'CSE_DS', 'year_sem', 'III_5', 'courseDetails', courseId],
                   ['courses', 'CSE_DS', 'year_sem', 'III_6', 'courseDetails', courseId],
                   ['courses', 'CSE_DS', 'year_sem', 'III_7', 'courseDetails', courseId],
                   ['courses', 'CSE_DS', 'year_sem', 'III_8', 'courseDetails', courseId],
                   // Alternative structures
                   ['courses', 'III', 'A', '5', 'courseDetails', courseId],
                   ['courses', 'III', 'B', '5', 'courseDetails', courseId],
                   ['courses', 'III', 'C', '5', 'courseDetails', courseId],
                   // Direct course structure
                   ['courses', courseId],
                   ['courseDetails', courseId],
                   // Department variations
                   ['courses', 'CSE', 'year_sem', 'III_5', 'courseDetails', courseId],
                   ['courses', 'CSEDS', 'year_sem', 'III_5', 'courseDetails', courseId],
                 ];

                 for (const pathSegments of pathVariations) {
                   try {
                     const coursePath = doc(db, ...pathSegments);
                     const courseSnap = await getDoc(coursePath);
                     if (courseSnap.exists()) {
                       const courseData = courseSnap.data();
                       console.log("✅ Found course via path variation:", pathSegments.join('/'));
                       return {
                         id: courseId,
                         year: courseData.displayYear || "III",
                         section: courseData.displaySection || "A",
                         semester: courseData.displaySemester || "5",
                         courseName: courseData.courseName || `Course ${courseId}`,
                         courseCode: courseData.courseCode || courseId,
                         instructorName: facultyData.name,
                         instructor: courseData.instructor,
                         department: courseData.displayDepartment || "Computer Science & Engineering (Data Science)",
                         credits: courseData.credits || 3,
                         description: courseData.description || `Course ${courseId} - ${facultyData.name}`,
                         studentsBySection: courseData.studentsBySection || {},
                         masterCoursePath: courseData.masterCoursePath,
                         semesterKey: courseData.semesterKey || "III_5",
                         students: courseData.students || []
                       };
                     }
                   } catch (error) {
                     // Continue to next variation
                   }
                 }

                 console.log("❌ No course found for ID:", courseId);
                 return null;
               };

               // Fetch all courses dynamically
               const coursePromises = uniqueCourseIds.map(courseId => fetchCourseDynamically(courseId));
               const results = await Promise.all(coursePromises);
               foundCourses = results.filter(course => course !== null);
               console.log("✅ Dynamic fetch found:", foundCourses.length, "courses");
             }

            // Set the final result
            console.log("🎉 Final courses to display:", foundCourses.length);
            setCourses(foundCourses);
            setError(null);

          } catch (error) {
            console.error("❌ Error in course fetching:", error);
            setError("Error fetching faculty courses.");
            setCourses([]);
          }

          setLoading(false);
        });
      } catch (err) {
        console.error("❌ Fatal error:", err);
        setError("Error fetching faculty courses.");
        setLoading(false);
      }
    };

    fetchFacultyCourses();
  }, []);

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

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 dark:text-blue-400 text-6xl mb-6 animate-pulse" />
          <h3 className="text-2xl font-semibold text-gray-950 dark:text-white mb-3">No courses available</h3>
          <p className="text-gray-800 dark:text-gray-200 text-lg">No courses have been assigned to this faculty yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Faculty Information Header */}
        {facultyData && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-1">{facultyData.name}</h2>
                <p className="text-gray-800 dark:text-gray-200 mb-2">{facultyData.designation} • {facultyData.department}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-800 dark:text-gray-200">
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faIdCard} />
                    {facultyData.empID}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faBuilding} />
                    {facultyData.departmentKey}
                  </span>
                  <span className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faClock} />
                    {facultyData.experience}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faBookOpen} className="text-white text-lg"/>
                </div>
                My Courses
              </h1>
              <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-gray-800 dark:text-gray-200"/>
                Here is the list of courses you are teaching • {courses.length} Total Courses
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                // Always try to navigate with the full path structure
                const courseYear = course.year || "III";
                const courseSection = course.section || "A";
                const courseSemester = course.semester || "5";
                navigate(`/courses/${courseYear}/${courseSection}/${courseSemester}/courseDetails/${course.id}`);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-gray-800 dark:text-gray-200 text-sm group-hover:text-primary transition-colors"/>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-3 group-hover:text-secondary transition-colors">
                  {course.courseName || course.courseCode || `Course ${course.id}`}
                </h3>
                
                <p className="text-gray-800 dark:text-gray-200 mb-4 line-clamp-2 text-sm leading-relaxed">
                  {course.description || course.courseDescription || `Course ${course.id} - ${course.instructorName || facultyData?.name || 'Faculty'}`}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {course.year && course.section && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2"/>
                    {course.year}-{course.section}
                  </span>
                )}
                {course.semester && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2"/>
                    {course.semester?.toUpperCase()}
                  </span>
                )}
                {course.credits && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                    <FontAwesomeIcon icon={faClock} className="mr-2"/>
                    {course.credits} Credits
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-800 dark:text-gray-200 mb-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-primary"/>
                  <span className="font-medium">{course.students?.length || course.enrolledStudents || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-primary"/>
                  <span className="font-medium">{course.instructorName || course.instructor || facultyData?.name || "Assigned"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                {course.year && course.section && course.semester && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(`/attendance/${course.year}/${course.section}/${course.semester}/${course.id}`); }}
                    className="flex-1 bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:shadow-md"
                  >
                    Mark Attendance
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const courseYear = course.year || "III";
                    const courseSection = course.section || "A";
                    const courseSemester = course.semester || "5";
                    navigate(`/courses/${courseYear}/${courseSection}/${courseSemester}/courseDetails/${course.id}`);
                  }}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-300 border border-gray-200 dark:border-gray-600"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default FacultyCourseList;

