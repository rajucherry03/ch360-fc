import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication
import { db } from "../firebase"; // Firebase configuration

const ApprovalWorkflow = ({ role }) => {
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const years = ["I", "II", "III", "IV"];
  const sections = ["A", "B", "C", "D"];

  // Get the logged-in faculty's details
  const auth = getAuth();
  const loggedInUser = auth.currentUser;
  const facultyId = loggedInUser?.uid; // Assuming `facultyId` is the UID of the logged-in user

  useEffect(() => {
    if (!facultyId) {
      setError("User is not authenticated.");
    }
  }, [facultyId]);

  const fetchData = async () => {
    if (!year || !section) {
      setError("Please select both year and section.");
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      const docPath = `/noDues/${year}/${section}/tDgqwVLD6u4h5LYStOFD`;
      const docRef = doc(db, docPath);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const noDuesData = docSnap.data();
        let students = noDuesData.students || [];
  
        if (students.length === 0) {
          setError("No students data found.");
          setData([]);
          setIsLoading(false);
          return;
        }
  
        // Filter students based on role and facultyId
        if (role === "coordinator") {
          students = students.filter((student) =>
            student.coordinators.some((coord) => coord.id === facultyId)
          );
        } else if (role === "mentor") {
          students = students.filter((student) =>
            student.mentors.some((mentor) => mentor.id === facultyId)
          );
        } else if (role === "courses_faculty") {
          students = students.filter((student) =>
            student.courses_faculty.some(
              (course) => course.facultyId === facultyId
            )
          );
        }
  
        // Update the state with filtered students
        setData(students);
      } else {
        setError("No data found for the selected year and section.");
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    }
  
    setIsLoading(false);
  };
  
  const handleApproval = async (rollNo, type) => {
    try {
      const docPath = `/noDues/${year}/${section}/tDgqwVLD6u4h5LYStOFD`;
      const docRef = doc(db, docPath);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const noDuesData = docSnap.data();

        // Update only the student linked to the logged-in faculty
        const updatedStudents = noDuesData.students.map((student) => {
          if (student.id === rollNo) {
            if (role === "coordinator") {
              return {
                ...student,
                coordinators: student.coordinators.map((coord) =>
                  coord.id === facultyId
                    ? { ...coord, status: type === "approve" ? "Approved" : "Rejected" }
                    : coord
                ),
              };
            }
            if (role === "mentor") {
              return {
                ...student,
                mentors: student.mentors.map((mentor) =>
                  mentor.id === facultyId
                    ? { ...mentor, status: type === "approve" ? "Approved" : "Rejected" }
                    : mentor
                ),
              };
            }
            if (role === "courses_faculty") {
              return {
                ...student,
                courses_faculty: student.courses_faculty.map((course) =>
                  course.facultyId === facultyId
                    ? { ...course, status: type === "approve" ? "Approved" : "Rejected" }
                    : course
                ),
              };
            }
          }
          return student;
        });

        // Update Firestore
        await updateDoc(docRef, { students: updatedStudents });

        // Update local state
        setData((prevData) =>
          prevData.map((student) =>
            student.id === rollNo
              ? {
                  ...student,
                  ...(role === "coordinator" && {
                    coordinators: student.coordinators.map((coord) =>
                      coord.id === facultyId
                        ? { ...coord, status: type === "approve" ? "Approved" : "Rejected" }
                        : coord
                    ),
                  }),
                  ...(role === "mentor" && {
                    mentors: student.mentors.map((mentor) =>
                      mentor.id === facultyId
                        ? { ...mentor, status: type === "approve" ? "Approved" : "Rejected" }
                        : mentor
                    ),
                  }),
                  ...(role === "courses_faculty" && {
                    courses_faculty: student.courses_faculty.map((course) =>
                      course.facultyId === facultyId
                        ? { ...course, status: type === "approve" ? "Approved" : "Rejected" }
                        : course
                    ),
                  }),
                }
              : student
          )
        );
      }
    } catch (err) {
      console.error("Error updating data:", err);
      setError("Failed to update student status.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Approval Workflow</h1>

      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-4">No Dues Clearance</h2>

        <div className="mb-4 flex items-center gap-4">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Section</option>
            {sections.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isLoading ? "Fetching..." : "Fetch Data"}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {data.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Roll No</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((student, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="border border-gray-300 p-2">{student.id}</td>
                  <td className="border border-gray-300 p-2">{student.name}</td>
                  <td className="border border-gray-300 p-2">{student.status}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleApproval(student.id, "approve")}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(student.id, "reject")}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-4">No data to display.</p>
        )}
      </div>
    </div>
  );
};

export default ApprovalWorkflow;
