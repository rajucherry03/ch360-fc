import React, { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; // Firestore configuration
import { useAuth } from "../auth"; // Authentication hook to get logged-in mentor


const MentorApproval = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState(""); // New state for semester


  const loggedInMentorId = user?.uid; // Mentor ID from authentication


  const years = [
    { label: "I", value: "I" },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
  ];
  const sections = ["A", "B", "C", "D", "E", "F"];
  const semesters = [
    { label: "Semester 1", value: "sem1" },
    { label: "Semester 2", value: "sem2" },
  ];


  useEffect(() => {
    if (loggedInMentorId) {
      console.log("Logged in Mentor ID:", loggedInMentorId);
    } else {
      console.error("No logged-in Mentor ID found!");
    }
  }, [loggedInMentorId]);


  const fetchNameById = async (collectionName, id) => {
    // If fetching from faculty, use nested path faculty/CSE_DS/members/{id}
    const docRef = collectionName === 'faculty'
      ? doc(db, 'faculty', 'CSE_DS', 'members', id)
      : doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().name || "Unknown" : "Unknown";
  };


  const fetchData = useCallback(async () => {
    if (!loggedInMentorId || !year || !section || !semester) {
      console.error("Mentor ID, year, section, or semester is required.");
      return;
    }
 
    setLoading(true);
    try {
      // Define the path dynamically for the noDues document
      const noDuesPath = `noDues/${year}/${section}/${semester}`;
      const noDuesDocRef = doc(db, noDuesPath);
 
      // Get the noDues document snapshot
      const docSnap = await getDoc(noDuesDocRef);
      if (!docSnap.exists()) {
        console.error("No noDues document found.");
        setMentors([]);
        setLoading(false);
        return;
      }
 
      // Retrieve data from the document
      const noDuesData = docSnap.data();
      console.log("Fetched NoDues Data:", noDuesData);
 
      // Check if students exist
      if (!noDuesData.students || noDuesData.students.length === 0) {
        console.log("No students found.");
        setMentors([]);
        setLoading(false);
        return;
      }
 
      // Process each student to fetch additional details
      const fetchedMentors = await Promise.all(
        noDuesData.students.map(async (student) => {
          try {
            const mentors = student?.mentors || [];
            const matchedMentor = mentors.find((mentor) => mentor?.id === loggedInMentorId);
 
            if (matchedMentor) {
              // Fetch student document safely
              const studentRef = doc(db, `students/${year}/${section}`, student.id);
              const studentSnap = await getDoc(studentRef);
 
              // Fetch mentor name safely
              const mentorName = matchedMentor.id
                ? await fetchNameById("faculty", matchedMentor.id)
                : "Unknown";
 
              // Check if the student document exists
              if (studentSnap.exists()) {
                const studentData = studentSnap.data();
 
                // Safely process coordinators
                const coordinators = Array.isArray(student.coordinators)
                  ? await Promise.all(
                      student.coordinators.map(async (coordinator) => ({
                        ...coordinator,
                        name: coordinator?.id
                          ? await fetchNameById("faculty", coordinator.id)
                          : "Unknown",
                      }))
                    )
                  : [];
 
                // Safely process courses_faculty
                const coursesFaculty = Array.isArray(student.courses_faculty)
                  ? await Promise.all(
                      student.courses_faculty.map(async (courseFaculty) => ({
                        ...courseFaculty,
                        courseName: courseFaculty?.courseId
                          ? await fetchNameById(
                              `courses/${year}/${section}/${semester}/courseDetails`,
                              courseFaculty.courseId
                            )
                          : "Unknown",
                        facultyName: courseFaculty?.facultyId
                          ? await fetchNameById("faculty", courseFaculty.facultyId)
                          : "Unknown",
                      }))
                    )
                  : [];
 
                return {
                  rollNo: studentData?.rollNo || "N/A",
                  studentName: studentData?.name || "N/A",
                  mentorName,
                  status: matchedMentor?.status || "Pending",
                  studentId: student.id,
                  mentorIndex: mentors.indexOf(matchedMentor),
                  coordinators,
                  coursesFaculty,
                };
              } else {
                console.warn(`Student document not found for ID: ${student.id}`);
              }
            }
          } catch (err) {
            console.error(`Error processing student ${student.id}:`, err);
          }
          return null;
        })
      );
 
      // Update the state with fetched data
      setMentors(fetchedMentors.filter(Boolean)); // Remove null values
    } catch (error) {
      console.error("Error fetching NoDues data:", error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [loggedInMentorId, year, section, semester]);

  const updateStatus = async (studentId, mentorIndex, newStatus) => {
      try {
        // Define the path dynamically for the latest noDues document
        const noDuesPath = `noDues/${year}/${section}/${semester}`;
        const noDuesDocRef = doc(db, noDuesPath);
   
        // Get the latest noDues document snapshot
        const docSnap = await getDoc(noDuesDocRef);
        if (!docSnap.exists()) {
          console.error("No noDues document found for updating.");
          return;
        }
   
        // Retrieve data from the document
        const noDuesData = docSnap.data();
   
        // Update the specific student's mentor status
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
   
        // Update the document in Firestore
        await updateDoc(noDuesDocRef, { students: updatedStudents });
        console.log("Mentor status updated successfully!");
   
        // Refresh the data
        fetchData();
      } catch (error) {
        console.error("Error updating mentor status:", error);
      }
    };
   


  useEffect(() => {
    if (loggedInMentorId && year && section && semester) {
      fetchData();
    }
  }, [loggedInMentorId, year, section, semester, fetchData]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Mentor Approval</h1>


      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-semibold mb-2">Section:</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-semibold mb-2">Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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


      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          <p className="ml-4 text-blue-600 font-medium">Loading...</p>
        </div>
      ) : (
        /* Table Section */
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2 border text-left font-semibold">Roll No</th>
                <th className="px-2 py-2 border text-left font-semibold">Student Name</th>
                <th className="px-2 py-2 border text-left font-semibold">Mentor</th>
                <th className="px-2 py-2 border text-left font-semibold">Status</th>
                <th className="px-2 py-2 border text-left font-semibold">Coordinators</th>
                <th className="px-2 py-2 border text-left font-semibold">Courses Faculty</th>
                <th className="px-2 py-2 border text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                mentors.map((mentor, index) => {
                  const allAccepted = mentor.coordinators.every((c) => c.status === "Accepted") &&
                                      mentor.coursesFaculty.every((cf) => cf.status === "Accepted");
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-2 py-2 border">{mentor.rollNo}</td>
                      <td className="px-2 py-2 border">{mentor.studentName}</td>
                      <td className="px-2 py-2 border">{mentor.mentorName}</td>
                      <td className="px-2 py-2 border border-gray-300">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            mentor.status === "Approved"
                              ? "bg-secondary text-white"
                              : mentor.status === "Rejected"
                              ? "bg-accent text-white"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {mentor.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 border">
                        {mentor.coordinators?.length > 0 ? (
                          mentor.coordinators.map((coordinator, i) => (
                            <span
                              key={i}
                              className={`inline-block px-2 py-1 rounded-full text-[11px] font-medium text-white ${
                                coordinator.status === "Accepted"
                                  ? "bg-secondary"
                                  : coordinator.status === "Rejected"
                                  ? "bg-accent"
                                  : "bg-accent/80"
                              } mr-1`}
                            >
                              {coordinator.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No Coordinators</span>
                        )}
                      </td>
                      <td className="px-2 py-2 border">
                        {mentor.coursesFaculty?.length > 0 ? (
                          mentor.coursesFaculty.map((courseFaculty, i) => (
                            <span
                              key={i}
                              className={`inline-block px-2 py-1 rounded-full text-[11px] font-medium text-white ${
                                courseFaculty.status === "Accepted"
                                  ? "bg-secondary"
                                  : courseFaculty.status === "Rejected"
                                  ? "bg-accent"
                                  : "bg-accent/80"
                              } mr-1`}
                            >
                              {courseFaculty.facultyName}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No Courses</span>
                        )}
                      </td>
                      <td className="px-2 py-2 border">
                        <button
                          className={`bg-secondary text-white px-3 py-1 rounded-md mr-2 text-sm ${
                            !allAccepted ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() =>
                            updateStatus(mentor.studentId, mentor.mentorIndex, "Accepted")
                          }
                          disabled={!allAccepted}
                        >
                          Accept
                        </button>
                        <button
                          className={`bg-accent text-white px-3 py-1 rounded-md text-sm ${
                            !allAccepted ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() =>
                            updateStatus(mentor.studentId, mentor.mentorIndex, "Rejected")
                          }
                          disabled={!allAccepted}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default MentorApproval;






























