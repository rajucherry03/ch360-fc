import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collectionGroup, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Firebase configuration

const CourseDetails = () => {
  const { year, section, semester, id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // Toggle edit mode
  const [instructorName, setInstructorName] = useState("");
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: "", file: null });
  const [newAssignment, setNewAssignment] = useState({ name: "", file: null });
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    actualHours: "",
    cls: "",
    courseCode: "",
    courseName: "",
    coveragePercentage: "",
    deviationReasons: "",
    instructor: "",
    ods: "",
    permissions: "",
    syllabusCoverage: "",
    unitsCompleted: "",
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const coursePath = `courses/${year}/${section}/${semester}/courseDetails/${id}`;
        const courseRef = doc(db, coursePath);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const fetchedCourse = { id, ...courseSnap.data() };
          setCourse(fetchedCourse);
          setFormData(fetchedCourse); // Pre-fill form data for editing
          setStudyMaterials(fetchedCourse.studyMaterials || []);
          setAssignments(fetchedCourse.assignments || []);

          // Fetch instructor's name
          const instructorRef = doc(db, "faculty", fetchedCourse.instructor);
          const instructorSnap = await getDoc(instructorRef);
          if (instructorSnap.exists()) {
            setInstructorName(instructorSnap.data().name || "Unknown");
          } else {
            setInstructorName("Unknown");
          }
          // Fetch enrolled students from the course document if it contains an array of student IDs
          if (Array.isArray(fetchedCourse.students) && fetchedCourse.students.length > 0) {
            const details = await Promise.all(
              fetchedCourse.students.map(async (s) => {
                const studentId = typeof s === 'string' ? s : (s?.id || s?.studentId || s);
                const sRef = doc(db, `students/${year}/${section}/${studentId}`);
                const sSnap = await getDoc(sRef);
                const base = sSnap.exists() ? { id: studentId, ...sSnap.data() } : { id: studentId };

                // Also enrolled courses (best-effort; skip if index missing)
                let enrolledCourses = [];
                try {
                  const cg = collectionGroup(db, "courseDetails");
                  const qy = query(cg, where("students", "array-contains", studentId));
                  const qs = await getDocs(qy);
                  enrolledCourses = [];
                  qs.forEach((d) => {
                    const seg = d.ref.path.split("/");
                    const y = seg[1], sec = seg[2], sem = seg[3];
                    const isCurrent = (y === year && sec === section && sem === semester && d.id === id);
                    if (!isCurrent) {
                      enrolledCourses.push({ id: d.id, name: d.data().courseName, year: y, section: sec, semester: sem });
                    }
                  });
                } catch (_) {
                  // ignore if index missing
                }
                return { ...base, enrolledCourses };
              })
            );
            setStudents(details);
          } else {
            setStudents([]);
          }
        } else {
          setError("Course not found.");
        }
      } catch (err) {
        setError("Error fetching course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, year, section, semester]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      const coursePath = `courses/${year}/${section}/${semester}/courseDetails/${id}`;
      const courseRef = doc(db, coursePath);
      await updateDoc(courseRef, { ...formData, studyMaterials, assignments });
      setCourse({ ...course, ...formData, studyMaterials, assignments });
      setEditMode(false); // Exit edit mode
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course details.");
    }
  };

  const handleDelete = async () => {
    try {
      const coursePath = `courses/${year}/${section}/${semester}/courseDetails/${id}`;
      const courseRef = doc(db, coursePath);
      await deleteDoc(courseRef);
      setCourse(null); // Clear course data
      setError("Course deleted successfully."); // Notify user
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course.");
    }
  };

  const addMaterial = () => {
    if (newMaterial.name.trim()) {
      setStudyMaterials([...studyMaterials, newMaterial]);
      setNewMaterial({ name: "", file: null });
    }
  };

  const addAssignment = () => {
    if (newAssignment.name.trim()) {
      setAssignments([...assignments, newAssignment]);
      setNewAssignment({ name: "", file: null });
    }
  };

  const handleMaterialFileChange = (e) => {
    setNewMaterial({ ...newMaterial, file: e.target.files[0] });
  };

  const handleAssignmentFileChange = (e) => {
    setNewAssignment({ ...newAssignment, file: e.target.files[0] });
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading course details...</div>;
  }

  if (error && !course) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!course) {
    return <div className="text-center text-gray-600">Course not found or deleted.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          {editMode ? "Edit Course" : course.courseName}
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {!editMode ? (
          <div>
            <p><strong>Course Code:</strong> {course.courseCode}</p>
            <p><strong>Instructor:</strong> {instructorName}</p>
            <p><strong>Actual Hours:</strong> {course.actualHours}</p>
            <p><strong>Class:</strong> {course.cls}</p>
            <p><strong>Coverage Percentage:</strong> {course.coveragePercentage}</p>
            <p><strong>Deviation Reasons:</strong> {course.deviationReasons}</p>
            <p><strong>ODS:</strong> {course.ods}</p>
            <p><strong>Permissions:</strong> {course.permissions}</p>
            <p><strong>Syllabus Coverage:</strong> {course.syllabusCoverage}</p>
            <p><strong>Units Completed:</strong> {course.unitsCompleted}</p>
            <h3 className="text-2xl font-bold mt-6 mb-2">Enrolled Students</h3>
            {students.length === 0 ? (
              <p className="text-gray-600">No students enrolled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((s) => (
                  <div key={s.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-800">{s.name || s.id}</h4>
                    <p className="text-sm text-gray-600">{s.email || '—'}</p>
                    <p className="text-sm text-gray-600 mb-2">Roll No: {s.rollNo || '—'}</p>
                    {Array.isArray(s.enrolledCourses) && s.enrolledCourses.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Also enrolled in:</p>
                        <div className="flex flex-wrap gap-2">
                          {s.enrolledCourses.map((c) => (
                            <span key={`${c.year}-${c.section}-${c.semester}-${c.id}`} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                              {c.name || c.id} • {c.year}-{c.section} {c.semester.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <h3 className="text-xl font-bold mt-4">Study Materials</h3>
            <ul>
              {studyMaterials.map((material, index) => (
                <li key={index}>{material.name}</li>
              ))}
            </ul>
            <h3 className="text-xl font-bold mt-4">Assignments</h3>
            <ul>
              {assignments.map((assignment, index) => (
                <li key={index}>{assignment.name}</li>
              ))}
            </ul>
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form className="grid gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-gray-700 font-bold">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            ))}
            <h3 className="text-xl font-bold mt-4">Add Study Material</h3>
            <input
              type="text"
              placeholder="Material Name"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <input
              type="file"
              onChange={handleMaterialFileChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={addMaterial}
            >
              Add Material
            </button>
            <h3 className="text-xl font-bold mt-4">Add Assignment</h3>
            <input
              type="text"
              placeholder="Assignment Name"
              value={newAssignment.name}
              onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <input
              type="file"
              onChange={handleAssignmentFileChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              onClick={addAssignment}
            >
              Add Assignment
            </button>
            <div className="flex space-x-4 mt-4">
              <button
                type="button"
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
