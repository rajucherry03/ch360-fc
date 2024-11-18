import React, { useState } from 'react';

const ApprovalWorkflow = () => {
    const [requests, setRequests] = useState([
        {
            id: 1,
            type: 'Leave Request',
            requestedBy: 'Alice Johnson',
            details: 'Leave from 15th Nov to 20th Nov due to personal reasons.',
            status: 'Pending',
        },
        {
            id: 2,
            type: 'Project Approval',
            requestedBy: 'Bob Smith',
            details: 'Final Year Project Proposal: AI-Based Chat Application',
            status: 'Pending',
        },
    ]);

    const [noDuesRequests, setNoDuesRequests] = useState([
        {
            id: 1,
            studentName: 'Alice Johnson',
            rollNumber: 'CSE21A001',
            department: 'CSE',
            year: '4th Year',
            semester: '1st Semester',
            section: 'A',
            status: 'Pending',
        },
        {
            id: 2,
            studentName: 'Bob Smith',
            rollNumber: 'CSE21A002',
            department: 'CSE',
            year: '4th Year',
            semester: '1st Semester',
            section: 'A',
            status: 'Approved',
        },
    ]);

    const [filter, setFilter] = useState({
        year: '',
        semester: '',
        section: '',
    });

    const handleApproval = (id, type) => {
        if (type === 'request') {
            setRequests((prev) =>
                prev.map((req) => (req.id === id ? { ...req, status: 'Approved' } : req))
            );
        } else if (type === 'noDues') {
            setNoDuesRequests((prev) =>
                prev.map((req) => (req.id === id ? { ...req, status: 'Approved' } : req))
            );
        }
    };

    const handleRejection = (id, type) => {
        if (type === 'request') {
            setRequests((prev) =>
                prev.map((req) => (req.id === id ? { ...req, status: 'Rejected' } : req))
            );
        } else if (type === 'noDues') {
            setNoDuesRequests((prev) =>
                prev.map((req) => (req.id === id ? { ...req, status: 'Rejected' } : req))
            );
        }
    };

    const handleBatchAction = (action) => {
        setNoDuesRequests((prev) =>
            prev.map((req) =>
                req.year === filter.year &&
                req.semester === filter.semester &&
                req.section === filter.section &&
                req.status === 'Pending'
                    ? { ...req, status: action }
                    : req
            )
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Approval Workflow</h1>

            {/* No Dues Requests Section */}
            <div className="bg-white shadow rounded-lg p-5">
                <h2 className="text-2xl font-bold mb-4">No Dues Clearance</h2>

                {/* Filter Options */}
                <div className="mb-4">
                    <label className="mr-2">Year:</label>
                    <select
                        value={filter.year}
                        onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                        className="border p-2 rounded"
                    >
                        <option value="">All</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>

                    <label className="mx-2">Semester:</label>
                    <select
                        value={filter.semester}
                        onChange={(e) => setFilter({ ...filter, semester: e.target.value })}
                        className="border p-2 rounded"
                    >
                        <option value="">All</option>
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                    </select>

                    <label className="mx-2">Section:</label>
                    <select
                        value={filter.section}
                        onChange={(e) => setFilter({ ...filter, section: e.target.value })}
                        className="border p-2 rounded"
                    >
                        <option value="">All</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                    </select>

                    <button
                        onClick={() => handleBatchAction('Approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg ml-4"
                    >
                        Approve All
                    </button>
                    <button
                        onClick={() => handleBatchAction('Rejected')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
                    >
                        Reject All
                    </button>
                </div>

                {/* Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 p-2">Student Name</th>
                        <th className="border border-gray-300 p-2">Roll Number</th>
                        <th className="border border-gray-300 p-2">Department</th>
                        <th className="border border-gray-300 p-2">Year</th>
                        <th className="border border-gray-300 p-2">Semester</th>
                        <th className="border border-gray-300 p-2">Section</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {noDuesRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{req.studentName}</td>
                            <td className="border border-gray-300 p-2">{req.rollNumber}</td>
                            <td className="border border-gray-300 p-2">{req.department}</td>
                            <td className="border border-gray-300 p-2">{req.year}</td>
                            <td className="border border-gray-300 p-2">{req.semester}</td>
                            <td className="border border-gray-300 p-2">{req.section}</td>
                            <td className="border border-gray-300 p-2">{req.status}</td>
                            <td className="border border-gray-300 p-2">
                                {req.status === 'Pending' && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleApproval(req.id, 'noDues')}
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejection(req.id, 'noDues')}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalWorkflow;
