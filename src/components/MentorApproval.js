import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Firestore configuration
import { useAuth } from "../auth"; // Authentication hook to get logged-in mentor

const MentorApproval = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");

  const loggedInMentorId = user?.uid; // Mentor ID from authentication

  const years = [
    { label: "I", value: "I" },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
  ];
  const sections = ["A", "B", "C", "D"];

  useEffect(() => {
    if (loggedInMentorId) {
      console.log("Logged in Mentor ID:", loggedInMentorId);
    } else {
      console.error("No logged-in Mentor ID found!");
    }
  }, [loggedInMentorId]);

  const fetchData = async () => {
    if (!loggedInMentorId || !year || !section) {
      console.error("Mentor ID, year, or section is required.");
      return;
    }

    setLoading(true);
    try {
      // Query to get the latest `noDues` document based on year and section
      const noDuesCollectionRef = collection(db, "noDues", year, section);
      const latestNoDuesQuery = query(noDuesCollectionRef, orderBy("generatedAt", "desc"), limit(1));
      const querySnapshot = await getDocs(latestNoDuesQuery);

      if (querySnapshot.empty) {
        console.error("No noDues document found.");
        setMentors([]);
        setLoading(false);
        return;
      }

      const latestNoDuesDoc = querySnapshot.docs[0];
      const noDuesData = latestNoDuesDoc.data();
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
            const matchedMentor = student.mentors.find((mentor) => mentor.id === loggedInMentorId);

            if (matchedMentor) {
              const studentRef = doc(db, "students", year, section, student.id);
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
      // Query the latest noDues document path dynamically
      const noDuesCollectionRef = collection(db, "noDues", year, section);
      const latestNoDuesQuery = query(noDuesCollectionRef, orderBy("generatedAt", "desc"), limit(1));
      const querySnapshot = await getDocs(latestNoDuesQuery);

      if (querySnapshot.empty) {
        console.error("No noDues document found for updating.");
        return;
      }

      const latestNoDuesDoc = querySnapshot.docs[0];
      const noDuesDocRef = latestNoDuesDoc.ref;

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
    if (loggedInMentorId && year && section) {
      fetchData();
    }
  }, [loggedInMentorId, year, section]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Mentor Approval
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full max-w-4xl">
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
      </div>
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
                mentors
                  .sort((a, b) => a.rollNo.localeCompare(b.rollNo)) // Sort by roll number
                  .map((mentor, index) => (
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
