import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase"; // Firebase configuration
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const fetchFacultyData = async (userId) => {
      try {
        console.log("Fetching faculty document...");
        const facultyDocRef = doc(db, "faculty", userId);
        const facultyDocSnap = await getDoc(facultyDocRef);

        if (!facultyDocSnap.exists()) {
          throw new Error("Faculty document not found.");
        }

        const facultyData = facultyDocSnap.data();
        console.log("Faculty data:", facultyData);

        if (!facultyData.courses || facultyData.courses.length === 0) {
          throw new Error("No courses assigned to this faculty.");
        }

        setCourses(facultyData.courses);
        return facultyData.courses;
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    };

    const fetchStudentsForCourses = async (courseIds) => {
      try {
        const studentDetails = [];

        for (const courseId of courseIds) {
          const coursePath = `/courses/Computer Science & Engineering (Data Science)/years/III/sections/A/courseDetails/${courseId}`;
          const courseDocRef = doc(db, coursePath);
          const courseDocSnap = await getDoc(courseDocRef);

          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();
            console.log(`Course data for ${courseId}:`, courseData);

            if (courseData.students && courseData.students.length > 0) {
              for (const studentId of courseData.students) {
                const studentDocPath = `/students/III/A/${studentId}`;
                const studentDocRef = doc(db, studentDocPath);
                const studentDocSnap = await getDoc(studentDocRef);

                if (studentDocSnap.exists()) {
                  studentDetails.push({
                    id: studentId,
                    ...studentDocSnap.data(),
                  });
                } else {
                  console.warn(`Student document not found for ID: ${studentId}`);
                }
              }
            }
          } else {
            console.warn(`Course document not found for ID: ${courseId}`);
          }
        }

        if (studentDetails.length === 0) {
          throw new Error("No students found for the courses taught by this faculty.");
        }

        return studentDetails;
      } catch (err) {
        console.error(err.message);
        throw err;
      }
    };

    const fetchStudentsByFaculty = async () => {
      try {
        setLoading(true);
        setError(null);

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          try {
            const courseIds = await fetchFacultyData(user.uid);
            const studentsData = await fetchStudentsForCourses(courseIds);
            console.log("Students fetched:", studentsData);
            setStudents(studentsData);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Error initializing student fetching:", err);
        setError("Error initializing student fetching.");
        setLoading(false);
      }
    };

    fetchStudentsByFaculty();

    // Cleanup
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredStudents = students
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Student List</h1>
        <p className="text-gray-600">
          Here is the list of students enrolled in the courses you are teaching.
        </p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="p-2 border rounded w-full md:w-1/3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded ml-4"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <section className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center">
              <img
                src={student.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                <p className="text-gray-700 mt-2">{student.email}</p>
                <div className="mt-4 text-center">
                  <Link
                    to={`/students/${student.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default StudentList;
