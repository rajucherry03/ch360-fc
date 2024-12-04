import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faClock, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AttendanceList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [classSchedules, setClassSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetableAndCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          const facultyDocRef = doc(db, "faculty", user.uid);
          const facultyDocSnap = await getDoc(facultyDocRef);

          if (!facultyDocSnap.exists()) {
            throw new Error("Faculty document not found.");
          }

          const timetablePath = `timetables/III/A`; // Match your Firestore path
          const timetableCollectionRef = collection(db, timetablePath);
          const timetableDocsSnap = await getDocs(timetableCollectionRef);

          const schedules = timetableDocsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setClassSchedules(schedules);
        });
      } catch (err) {
        console.error("Error fetching timetable and courses:", err.message);
        setError(err.message || "Error fetching timetable and courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetableAndCourses();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const filteredSchedules = classSchedules.filter(
    (schedule) => schedule.day === todayDay
  );

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Today's Class Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="border p-4 rounded shadow-sm bg-white hover:bg-gray-100">
              <div>
                <div className="text-gray-800 font-bold flex items-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="mr-2" /> {schedule.courseName || "Unnamed Course"}
                </div>
                <div className="text-gray-600 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2" /> {schedule.startTime || "N/A"} - {schedule.endTime || "N/A"}
                </div>
              </div>
              <Link to={`/edit-attendance/${schedule.id}`} className="text-blue-500 hover:underline">
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit Attendance
              </Link>
            </div>
          ))}
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
          className="w-full p-2 border rounded bg-white"
        />
      </div>
    </div>
  );
};

export default AttendanceList;
