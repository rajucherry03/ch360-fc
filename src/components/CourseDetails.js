import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const coursesData = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    description: 'Learn the basics of computer science and programming.',
    credits: 3,
    schedule: 'Mon-Wed-Fri 10:00 AM - 11:00 AM',
    materials: [{ name: 'Lecture Notes', file: null }, { name: 'Assignments', file: null }, { name: 'Lab Exercises', file: null }],
  },
  {
    id: 2,
    name: 'Advanced Mathematics',
    description: 'Explore advanced topics in mathematics.',
    credits: 4,
    schedule: 'Tue-Thu 1:00 PM - 3:00 PM',
    materials: [{ name: 'Textbook', file: null }, { name: 'Practice Problems', file: null }, { name: 'Solutions', file: null }],
  },
  // Add more course objects here
];

const CourseDetails = () => {
  const { id } = useParams();
  const course = coursesData.find(course => course.id === parseInt(id));

  const [materials, setMaterials] = useState(course.materials);
  const [newMaterial, setNewMaterial] = useState({ name: '', file: null });

  const addMaterial = () => {
    if (newMaterial.name.trim()) {
      setMaterials([...materials, newMaterial]);
      setNewMaterial({ name: '', file: null });
    }
  };

  const deleteMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  const editMaterial = (index, newName, newFile) => {
    const updatedMaterials = materials.map((material, i) => (i === index ? { name: newName, file: newFile } : material));
    setMaterials(updatedMaterials);
  };

  const handleFileChange = (e) => {
    setNewMaterial({ ...newMaterial, file: e.target.files[0] });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">{course.name}</h2>
        <p className="text-lg text-gray-700 mb-4">{course.description}</p>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Materials</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {materials.map((material, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{material.name}</span>
                <div className="flex space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                      const newName = prompt('Edit Material Name', material.name);
                      const newFile = material.file; // You can add a file input if needed
                      if (newName) editMaterial(index, newName, newFile);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteMaterial(index)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <input
              type="text"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              className="border border-gray-300 rounded p-2 w-full mb-2"
              placeholder="Add new material name"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="border border-gray-300 rounded p-2 w-full mb-2"
            />
            <button
              onClick={addMaterial}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
