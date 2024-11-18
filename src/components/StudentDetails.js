import React from 'react';
import { useParams, Link } from 'react-router-dom';

const studentsData = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    course: 'Computer Science',
    profilePicture: 'https://via.placeholder.com/150',
    details: {
      age: 20,
      address: '123 Main St, Springfield',
      guardian: 'John Johnson',
      phone: '123-456-7890',
    },
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    course: 'Mathematics',
    profilePicture: 'https://via.placeholder.com/150',
    details: {
      age: 22,
      address: '456 Elm St, Springfield',
      guardian: 'Jane Smith',
      phone: '098-765-4321',
    },
  },
  // Add more student objects here
];

const StudentDetails = () => {
  const { id } = useParams();
  const student = studentsData.find(student => student.id === parseInt(id));

  if (!student) {
    return <div className="p-6 bg-white rounded-lg shadow-md">Student not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <img src={student.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mr-6" />
          <div>
            <h2 className="text-4xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-lg text-gray-700 mb-4">{student.email}</p>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Course</h3>
          <p className="text-gray-600">{student.course}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Details</h3>
          <ul className="list-disc pl-5 text-gray-600">
            <li><strong>Age:</strong> {student.details.age}</li>
            <li><strong>Address:</strong> {student.details.address}</li>
            <li><strong>Guardian:</strong> {student.details.guardian}</li>
            <li><strong>Phone:</strong> {student.details.phone}</li>
          </ul>
        </div>
        <div className="mt-6 text-center">
          <Link to="/students" className="text-blue-500 hover:underline">
            Back to Student List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
