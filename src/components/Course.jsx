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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <div className="h-16 bg-gray-200 rounded-2xl mb-6 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-xl w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface rounded-2xl shadow-xl p-8 animate-fade-in border border-theme" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-surface rounded-full mr-6 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-surface rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-surface rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-surface rounded animate-pulse"></div>
                  <div className="h-4 bg-surface rounded w-2/3 animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-surface rounded-full animate-pulse"></div>
                  <div className="h-8 w-16 bg-surface rounded-full animate-pulse"></div>
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
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-theme">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-[var(--color-primary)] text-6xl mb-6 animate-bounce" />
          <div className="text-primary text-xl font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="bg-surface rounded-2xl shadow-xl p-12 text-center border border-theme">
          <FontAwesomeIcon icon={faBookOpen} className="text-secondary text-6xl mb-6 animate-pulse" />
          <h3 className="text-2xl font-semibold text-primary mb-3">No courses available</h3>
          <p className="text-secondary text-lg">No courses have been assigned to this faculty yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="page-container">
        {/* Faculty Information Header */}
        {facultyData && (
          <div className="bg-surface border border-theme rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-[var(--color-primary)]">
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-primary mb-1">{facultyData.name}</h2>
                <p className="text-secondary mb-2">{facultyData.designation} • {facultyData.department}</p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary">
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

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-primary">My Courses</h1>
            <p className="text-xs text-secondary hidden sm:block">Here is the list of courses you are teaching</p>
          </div>
          <div className="compact-card py-2 px-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-[var(--color-primary)] text-sm"/>
              <span className="text-sm text-primary">Total Courses:</span>
              <span className="text-base font-semibold text-primary">{courses.length}</span>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-surface rounded-lg border border-theme p-4 hover:shadow-sm animate-fade-in cursor-pointer"
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
                <div className="w-10 h-10 rounded-md bg-surface text-[var(--color-primary)] flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-[var(--color-secondary)] text-sm"/>
                </div>
              </div>
              
              <h3 className="text-base font-semibold text-primary mb-2">
                {course.courseName || course.courseCode || `Course ${course.id}`}
              </h3>
              
              <p className="text-secondary mb-4 line-clamp-2 text-sm">
                {course.description || course.courseDescription || `Course ${course.id} - ${course.instructorName || facultyData?.name || 'Faculty'}`}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {course.year && course.section && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface text-primary border border-theme">
                    <FontAwesomeIcon icon={faGraduationCap} className="mr-2"/>
                    {course.year}-{course.section}
                  </span>
                )}
                {course.semester && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface text-primary border border-theme">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2"/>
                    {course.semester?.toUpperCase()}
                  </span>
                )}
                {course.credits && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface text-primary border border-theme">
                    <FontAwesomeIcon icon={faClock} className="mr-2"/>
                    {course.credits} Credits
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-secondary">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-[var(--color-primary)]"/>
                  <span className="font-medium">{course.students?.length || course.enrolledStudents || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="text-[var(--color-primary)]"/>
                  <span className="font-medium">{course.instructorName || course.instructor || facultyData?.name || "Assigned"}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {course.year && course.section && course.semester && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); navigate(`/attendance/${course.year}/${course.section}/${course.semester}/${course.id}`); }}
                    className="btn-secondary px-3 py-2 rounded-md text-sm"
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
                  className="px-3 py-2 rounded-md border border-theme hover:bg-surface text-sm"
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

