// src/components/StudentGrades.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit } from '@fortawesome/free-solid-svg-icons';

const mockStudents = [
  { id: 1, name: 'Alice Johnson', mid1: 0, mid2: 0, assignment: 0, labInternal: 0, labExternal: 0 },
  { id: 2, name: 'Bob Smith', mid1: 0, mid2: 0, assignment: 0, labInternal: 0, labExternal: 0 },
  // Add more students here
];

const StudentGrades = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [marks, setMarks] = useState({ mid1: 0, mid2: 0, assignment: 0, labInternal: 0, labExternal: 0 });

  useEffect(() => {
    // Fetch students for the selected course from an API or mock data
    // setStudents(fetchedStudents);
  }, [courseId]);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setMarks({ mid1: student.mid1, mid2: student.mid2, assignment: student.assignment, labInternal: student.labInternal, labExternal: student.labExternal });
    setEditMode(true);
  };

  const handleSave = () => {
    setStudents(prevStudents =>
      prevStudents.map(student => (student.id === selectedStudent.id ? { ...student, ...marks } : student))
    );
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-light p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Student Grades</h2>
        <table className="w-full bg-white shadow-md rounded my-6">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm"><FontAwesomeIcon icon={faUser} /> Student</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Mid 1</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Mid 2</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Assignment</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Lab Internal</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Lab External</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">{student.mid1}</td>
                <td className="py-3 px-4">{student.mid2}</td>
                <td className="py-3 px-4">{student.assignment}</td>
                <td className="py-3 px-4">{student.labInternal}</td>
                <td className="py-3 px-4">{student.labExternal}</td>
                <td className="py-3 px-4">
                  <button onClick={() => handleEdit(student)} className="text-blue-500 hover:text-blue-700">
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editMode && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Marks for {selectedStudent.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Mid 1</label>
                <input
                  type="number"
                  value={marks.mid1}
                  onChange={e => setMarks({ ...marks, mid1: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Mid 2</label>
                <input
                  type="number"
                  value={marks.mid2}
                  onChange={e => setMarks({ ...marks, mid2: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Assignment</label>
                <input
                  type="number"
                  value={marks.assignment}
                  onChange={e => setMarks({ ...marks, assignment: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Lab Internal</label>
                <input
                  type="number"
                  value={marks.labInternal}
                  onChange={e => setMarks({ ...marks, labInternal: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Lab External</label>
                <input
                  type="number"
                  value={marks.labExternal}
                  onChange={e => setMarks({ ...marks, labExternal: e.target.value })}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
            </div>
            <div className="mt-4 text-right">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                Save Marks
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGrades;
