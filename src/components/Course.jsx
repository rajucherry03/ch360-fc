import React, { useEffect, useState } from "react";
import { collection, collectionGroup, getDocs, query, where } from "firebase/firestore";
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
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const FacultyCourseList = () => {
  const [courses, setCourses] = useState([]);
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

          // Fast: collection group query across all courseDetails
          const foundCourses = [];
          try {
            const cg = collectionGroup(db, "courseDetails");
            const qy = query(cg, where("instructor", "==", user.uid));
            const snap = await getDocs(qy);
            snap.forEach((docSnap) => {
              const segments = docSnap.ref.path.split("/");
              const year = segments[1];
              const section = segments[2];
              const semester = segments[3];
              foundCourses.push({ id: docSnap.id, year, section, semester, ...docSnap.data() });
            });
          } catch (e) {
            // Fallback without index: fire all queries in parallel across a constrained set (I–IV, A–F, sem1/sem2)
            const years = ["I","II","III","IV"];
            const sections = ["A","B","C","D","E","F"];
            const semesters = ["sem1","sem2"];
            const tasks = [];
            years.forEach((y) => {
              sections.forEach((sec) => {
                semesters.forEach((sem) => {
                  const col = collection(db, "courses", y, sec, sem, "courseDetails");
                  tasks.push(getDocs(query(col, where("instructor", "==", user.uid))));
                });
              });
            });
            const results = await Promise.all(tasks);
            results.forEach((snap2) => {
              snap2.forEach((d) => {
                const seg = d.ref.path.split("/");
                foundCourses.push({ id: d.id, year: seg[1], section: seg[2], semester: seg[3], ...d.data() });
              });
            });
          }

          if (foundCourses.length === 0) {
            setError("No courses assigned to this faculty.");
            setCourses([]);
          } else {
            setCourses(foundCourses);
            setError(null);
          }

          setLoading(false);
        });
      } catch (err) {
        setError("Error fetching faculty courses.");
        setLoading(false);
      }
    };

    fetchFacultyCourses();
  }, []);

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

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <FontAwesomeIcon icon={faBookOpen} className="text-gray-400 text-6xl mb-6 animate-pulse" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">No courses available</h3>
          <p className="text-gray-600 text-lg">No courses have been assigned to this faculty yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">My Courses</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Here is the list of courses you are teaching</p>
          </div>
          <div className="compact-card py-2 px-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 text-sm"/>
              <span className="text-sm text-gray-700">Total Courses:</span>
              <span className="text-base font-semibold text-gray-900">{courses.length}</span>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-white rounded-lg border p-4 hover:shadow-sm animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/courses/${course.year}/${course.section}/${course.semester}/courseDetails/${course.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faArrowRight} className="text-blue-600 text-sm"/>
                </div>
              </div>
              
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {course.courseName || course.id}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                {course.description || "Course description not available"}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                  <FontAwesomeIcon icon={faGraduationCap} className="mr-2"/>
                  {course.year}-{course.section}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2"/>
                  {course.semester?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-600"/>
                  <span className="font-medium">{course.students?.length || 0} Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-blue-600"/>
                  <span className="font-medium">{course.credits || 3} Credits</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(`/attendance/${course.year}/${course.section}/${course.semester}/${course.id}`); }}
                  className="btn-campus-primary px-3 py-2 rounded-md text-sm"
                >
                  Mark Attendance
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(`/courses/${course.year}/${course.section}/${course.semester}/courseDetails/${course.id}`); }}
                  className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
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

