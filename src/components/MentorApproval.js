import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore configuration
import { useAuth } from "../auth"; // Authentication hook to get logged-in mentor

const MentorApproval = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const loggedInMentorId = user?.uid; // Mentor ID from authentication

  useEffect(() => {
    if (loggedInMentorId) {
      console.log("Logged in Mentor ID:", loggedInMentorId);
    } else {
      console.error("No logged-in Mentor ID found!");
    }
  }, [loggedInMentorId]);

  const fetchData = async () => {
    if (!loggedInMentorId) {
      console.error("Mentor ID is required.");
      return;
    }
  
    setLoading(true);
    try {
      // Fetch the noDues document
      const noDuesDocRef = doc(db, "noDues", "III", "A", "tDgqwVLD6u4h5LYStOFD"); // Adjust path as needed
      const noDuesSnap = await getDoc(noDuesDocRef);
  
      if (!noDuesSnap.exists()) {
        console.error("No data found in Firestore for mentors.");
        setMentors([]);
        setLoading(false);
        return;
      }
  
      const noDuesData = noDuesSnap.data();
      console.log("Fetched NoDues Data:", noDuesData);
  
      if (!noDuesData.students || noDuesData.students.length === 0) {
        console.log("No students found.");
        setMentors([]);
        setLoading(false);
        return;
      }
  
      const fetchedMentors = await Promise.all(
        noDuesData.students.map(async (student) => {
          if (student.mentors) {
            const matchedMentor = student.mentors.find(
              (mentor) => mentor.id === loggedInMentorId
            );
  
            if (matchedMentor) {
              const studentRef = doc(db, "students", "III", "A", student.id); // Adjust path
              const studentSnap = await getDoc(studentRef);
  
              let mentorName = "Unknown";
              if (matchedMentor.id) {
                const mentorRef = doc(db, "faculty", matchedMentor.id); // Fetch mentor details
                const mentorSnap = await getDoc(mentorRef);
                mentorName = mentorSnap.exists()
                  ? mentorSnap.data().name || "Unknown"
                  : "Unknown";
              }
  
              if (studentSnap.exists()) {
                const studentData = studentSnap.data();
  
                return {
                  rollNo: studentData.rollNo || "N/A",
                  studentName: studentData.name || "N/A",
                  mentorName,
                  status: matchedMentor.status || "Pending",
                  studentId: student.id,
                  mentorIndex: student.mentors.indexOf(matchedMentor),
                };
              }
            }
          }
          return null;
        })
      );
  
      setMentors(fetchedMentors.filter(Boolean)); // Filter out null values
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };
  

  const updateStatus = async (studentId, mentorIndex, newStatus) => {
    try {
      const noDuesDocRef = doc(db, "noDues", "III", "A", "tDgqwVLD6u4h5LYStOFD"); // Adjust path
      const noDuesSnap = await getDoc(noDuesDocRef);

      if (noDuesSnap.exists()) {
        const noDuesData = noDuesSnap.data();

        const updatedStudents = noDuesData.students.map((student) => {
          if (student.id === studentId) {
            const updatedMentors = student.mentors.map((mentor, index) => {
              if (index === mentorIndex) {
                return { ...mentor, status: newStatus };
              }
              return mentor;
            });
            return { ...student, mentors: updatedMentors };
          }
          return student;
        });

        await updateDoc(noDuesDocRef, { students: updatedStudents });
        console.log("Mentor status updated successfully!");
        fetchData(); // Refresh the data
      }
    } catch (error) {
      console.error("Error updating mentor status:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [loggedInMentorId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Mentor Approval
      </h1>
      {loading ? (
        <p className="text-center text-blue-600 font-medium">Loading...</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border border-gray-300 text-left">Roll No</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Student Name</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Mentor</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {mentors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                mentors.map((mentor, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-all">
                    <td className="px-4 py-2 border border-gray-300">{mentor.rollNo}</td>
                    <td className="px-4 py-2 border border-gray-300">{mentor.studentName}</td>
                    <td className="px-4 py-2 border border-gray-300">{mentor.mentorName}</td>
                    <td className="px-4 py-2 border border-gray-300">{mentor.status}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                        onClick={() => updateStatus(mentor.studentId, mentor.mentorIndex, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                        onClick={() => updateStatus(mentor.studentId, mentor.mentorIndex, "Rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorApproval;
