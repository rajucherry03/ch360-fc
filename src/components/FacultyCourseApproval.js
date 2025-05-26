import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../auth";


const FacultyCourseApproval = () => {
  const { user } = useAuth();
  const [facultyLoginId, setFacultyLoginId] = useState(null);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");  // New state for search term


  const years = [
    { label: "I", value: "I" },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
  ];
  const sections = ["A", "B", "C", "D"];
  const semesters = [
    { label: "Semester 1", value: "sem1" },
    { label: "Semester 2", value: "sem2" },
  ];


  // Update the facultyLoginId when user logs in
  useEffect(() => {
    if (user) {
      setFacultyLoginId(user.uid);
      console.log("Logged in Faculty ID:", user.uid);
    } else {
      console.error("No user logged in!");
    }
  }, [user]);


  // Fetch course data based on year, section, semester, and facultyLoginId
  const fetchData = async () => {
    if (!year || !section || !semester || !facultyLoginId) {
      console.log("Year, section, semester, or facultyLoginId is missing.");
      return;
    }


    setLoading(true);
    try {
      const noDuesDocRef = doc(db, "noDues", year, section, semester);
      const noDuesDocSnap = await getDoc(noDuesDocRef);


      if (!noDuesDocSnap.exists()) {
        console.log("NoDues document not found for the given year, section, and semester.");
        setCourses([]);
        return;
      }


      const noDuesData = noDuesDocSnap.data();
      console.log("Fetched noDues data:", noDuesData);


      if (!noDuesData.students || noDuesData.students.length === 0) {
        console.log("No students found for this section.");
        setCourses([]);
        return;
      }


      const studentsData = await Promise.all(
        noDuesData.students.map(async (student) => {
          const courseEntry = student.courses_faculty?.find(
            (cf) => cf.facultyId === facultyLoginId
          );


          if (!courseEntry) return null;


          let courseName = "N/A";
          if (courseEntry.courseId) {
            console.log("Fetching course with courseId:", courseEntry.courseId);

            const courseRef = doc(
              db,
              "courses",
              year,     // Use selected year instead of hardcoded "III"
              section,  // Use selected section instead of hardcoded "A"
              semester, // Use selected semester instead of hardcoded "sem1"
              "courseDetails",
              courseEntry.courseId
            );

            const courseSnap = await getDoc(courseRef);

            if (courseSnap.exists()) {
              courseName = courseSnap.data()?.courseName || "N/A";
              console.log("Course fetched:", courseName);
            } else {
              console.error("Course not found for ID:", courseEntry.courseId);
              console.log("Courses Collection Path:", "courses", year, section, semester, "courseDetails", courseEntry.courseId);
            }
          }


          const studentRef = doc(db, "students", year, section, student.id);
          const studentSnap = await getDoc(studentRef);
          const studentData = studentSnap.exists() ? studentSnap.data() : {};


          return {
            rollNo: studentData?.rollNo || "N/A",
            studentName: studentData?.name || "N/A",
            courseName, // Now we have the correct course name
            status: courseEntry.status || "Pending",
            studentId: student.id,
            courseEntry,
          };
        })
      );


      const filteredData = studentsData.filter((student) => student !== null);
      setCourses(filteredData.sort((a, b) => a.rollNo.localeCompare(b.rollNo)));
    } catch (error) {
      console.error("Error fetching data:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };


  const updateStatus = async (studentIds, newStatus) => {
    if (!facultyLoginId) {
      console.error("Faculty login ID is missing.");
      return;
    }


    try {
      const noDuesDocRef = doc(db, "noDues", year, section, semester);
      const noDuesDocSnap = await getDoc(noDuesDocRef);


      if (!noDuesDocSnap.exists()) {
        console.log("NoDues document not found.");
        return;
      }


      const noDuesData = noDuesDocSnap.data();


      if (!noDuesData.students) {
        console.log("No students data found.");
        return;
      }


      const updatedStudents = noDuesData.students.map((student) => {
        if (studentIds.includes(student.id)) {
          const updatedCoursesFaculty = student.courses_faculty.map((cf) => {
            if (cf.facultyId === facultyLoginId && cf.courseId) {
              return { ...cf, status: newStatus }; // Update status
            }
            return cf;
          });


          return { ...student, courses_faculty: updatedCoursesFaculty };
        }
        return student;
      });


      await updateDoc(noDuesDocRef, { students: updatedStudents });
      console.log("Status updated successfully!");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };


  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };


  const handleAction = (newStatus) => {
    if (selectedStudents.length > 0) {
      updateStatus(selectedStudents, newStatus);
      setSelectedStudents([]); // Clear selected students after the action
    } else {
      console.log("No students selected!");
    }
  };


  // Filter courses based on status and search term
  const filteredCourses = courses
    .filter(
      (student) =>
        (statusFilter === "All" || student.status === statusFilter) &&
        (student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
    );


  useEffect(() => {
    if (year && section && semester && facultyLoginId) {
      fetchData();
    }
  }, [year, section, semester, facultyLoginId]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Faculty Courses Dashboard
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Year:</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              {years.map((yr) => (
                <option key={yr.value} value={yr.value}>
                  {yr.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Section:</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Semester:</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.value} value={sem.value}>
                  {sem.label}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Search input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Roll No or Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Status Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>


        {/* Table Display */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Action</th>
                <th className="py-2 px-4 text-left">Roll No</th>
                <th className="py-2 px-4 text-left">Student Name</th>
                <th className="py-2 px-4 text-left">Course Name</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((student, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.studentId)}
                      onChange={() => handleCheckboxChange(student.studentId)}
                    />
                  </td>
                  <td className="py-2 px-4">{student.rollNo}</td>
                  <td className="py-2 px-4">{student.studentName}</td>
                  <td className="py-2 px-4">{student.courseName}</td>
                  <td className="py-2 px-4">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


        {/* Accept/Reject buttons */}
        <div className="mt-4">
          <button
            onClick={() => handleAction("Accepted")}
            className="px-6 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction("Rejected")}
            className="ml-4 px-6 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};


export default FacultyCourseApproval;
