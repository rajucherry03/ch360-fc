import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditAttendance = () => {
  const { id } = useParams(); // Timetable ID or class ID
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch timetable details based on ID
        const classDocRef = doc(db, `timetables/III/A/${id}`);
        const classDocSnap = await getDoc(classDocRef);

        if (!classDocSnap.exists()) {
          throw new Error("Class details not found.");
        }

        const classData = classDocSnap.data();
        setClassDetails(classData);

        // Fetch student details based on IDs in the timetable
        if (classData.studentIds && Array.isArray(classData.studentIds)) {
          const studentDetails = await Promise.all(
            classData.studentIds.map(async (studentId) => {
              const studentDocRef = doc(db, `students/III/A/${studentId}`);
              const studentDocSnap = await getDoc(studentDocRef);

              if (studentDocSnap.exists()) {
                return { id: studentDocSnap.id, ...studentDocSnap.data() };
              } else {
                console.warn(`Student not found for ID: ${studentId}`);
                return null;
              }
            })
          );

          setAttendance(
            studentDetails
              .filter((student) => student !== null)
              .map((student) => ({
                ...student,
                status: "Absent", // Default status
              }))
          );
        } else {
          console.warn("No student IDs found in the class.");
          setAttendance([]);
        }
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prevAttendance) =>
      prevAttendance.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const year = classDetails?.year || "UnknownYear";
      const section = classDetails?.section || "UnknownSection";

      // Create a subcollection for timetables under attendance/{year}/{section}/{date}
      const attendanceDocPath = `attendance/${year}/${section}/${formattedDate}/timetables/${id}`;
      const attendanceRef = doc(db, attendanceDocPath);

      // Save the attendance data
      await setDoc(attendanceRef, {
        date: formattedDate,
        classId: id,
        year: year,
        section: section,
        timetableId: id, // Save the timetable ID in the document for easy reference
        attendance, // Array of student attendance
      });

      alert("Attendance updated successfully!");
      console.log("Attendance saved at path:", attendanceDocPath);
    } catch (err) {
      console.error("Error saving attendance:", err);
      alert("Failed to update attendance. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-light p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          Edit Attendance for {classDetails?.courseName || "Unknown Course"}
        </h2>
        <div className="mb-4">
          <label className="text-lg font-bold text-gray-800">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="ml-2 border rounded-lg p-2"
          />
        </div>
        <table className="w-full bg-white shadow-md rounded my-6">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Roll No</th>
              <th className="py-3 px-4">Present</th>
              <th className="py-3 px-4">Absent</th>
              <th className="py-3 px-4">Permission</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((student) => (
              <tr key={student.id}>
                <td className="py-3 px-4">{student.name || "Unnamed"}</td>
                <td className="py-3 px-4">{student.rollNo || "Unnamed"}</td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === "Present"}
                    onChange={() => handleStatusChange(student.id, "Present")}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === "Absent"}
                    onChange={() => handleStatusChange(student.id, "Absent")}
                  />
                </td>
                <td className="py-3 px-4">
                  <input
                    type="radio"
                    name={`status-${student.id}`}
                    checked={student.status === "Permission"}
                    onChange={() => handleStatusChange(student.id, "Permission")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Update Attendance
        </button>
      </div>
    </div>
  );
};

export default EditAttendance;
