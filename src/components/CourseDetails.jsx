import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collectionGroup, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, documentId } from "firebase/firestore";
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
  // Tabs state must be declared before any conditional returns to satisfy hooks rules
  const [activeTab, setActiveTab] = useState("overview");

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
          const instructorRef = doc(db, "faculty", "CSE_DS", "members", fetchedCourse.instructor);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse"></div>
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="text-blue-600 text-xl font-semibold mb-2">{error}</div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <div className="text-center text-gray-600">Course not found or deleted.</div>;
  }

  const enrolledCount = Array.isArray(course.students) ? course.students.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3">{course.courseName}</h1>
            <p className="text-gray-600 text-lg">{course.courseCode} • {year}-{section} • {semester?.toUpperCase()}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 text-center">
              <div className="text-sm text-gray-500">Students</div>
              <div className="text-2xl font-bold text-blue-600">{enrolledCount}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 text-center">
              <div className="text-sm text-gray-500">Coverage</div>
              <div className="text-2xl font-bold text-blue-600">{course.coveragePercentage || '—'}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-gray-100 text-center">
              <div className="text-sm text-gray-500">Units Completed</div>
              <div className="text-2xl font-bold text-blue-600">{course.unitsCompleted || '—'}</div>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'students', label: 'Students' },
              { key: 'materials', label: 'Materials' },
              { key: 'schedule', label: 'Schedule' },
              { key: 'edit', label: 'Edit' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Course Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Instructor</div>
                  <div className="text-gray-800 font-medium">{instructorName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Class</div>
                  <div className="text-gray-800 font-medium">{course.cls || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Actual Hours</div>
                  <div className="text-gray-800 font-medium">{course.actualHours || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Permissions</div>
                  <div className="text-gray-800 font-medium">{course.permissions || '—'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Syllabus Coverage</div>
                  <div className="text-gray-800 font-medium">{course.syllabusCoverage || '—'}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">Deviation Reasons</div>
                  <div className="text-gray-800">{course.deviationReasons || '—'}</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="btn-campus-primary px-4 py-3 rounded-xl">Mark Attendance</button>
                <button className="btn-campus-primary px-4 py-3 rounded-xl">Create Assignment</button>
                <button onClick={() => setEditMode(true) || setActiveTab('edit')} className="btn-campus-primary px-4 py-3 rounded-xl">Edit Course</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'students' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Enrolled Students</h2>
            {students.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-600">No students enrolled.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((s) => (
                  <div key={s.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="text-lg font-semibold text-gray-800">{s.name || s.id}</div>
                    <div className="text-sm text-gray-600">{s.email || '—'}</div>
                    <div className="text-sm text-gray-600 mb-3">Roll No: {s.rollNo || '—'}</div>
                    {Array.isArray(s.enrolledCourses) && s.enrolledCourses.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Also enrolled in:</div>
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
          </section>
        )}

        {activeTab === 'materials' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Study Materials</h2>
            <ul className="space-y-2">
              {studyMaterials.length === 0 && (<li className="text-gray-600">No materials added.</li>)}
              {studyMaterials.map((material, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <span className="text-gray-800">{material.name}</span>
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                </li>
              ))}
            </ul>
            {editMode && (
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Material Name"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input type="file" onChange={handleMaterialFileChange} className="w-full px-4 py-3 rounded-xl border border-gray-300" />
                <button type="button" onClick={addMaterial} className="btn-campus-primary rounded-xl px-4 py-3">Add Material</button>
              </div>
            )}
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Schedule</h2>
            <div className="text-gray-600">No schedule data available.</div>
          </section>
        )}

        {activeTab === 'edit' && (
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Course</h2>
            <form className="grid gap-4 md:grid-cols-2">
              {Object.keys(formData).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-sm text-gray-600 font-medium">{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="button" className="btn-campus-primary rounded-xl px-6 py-3" onClick={handleUpdate}>Update</button>
                <button type="button" className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100" onClick={() => setEditMode(false) || setActiveTab('overview')}>Cancel</button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
