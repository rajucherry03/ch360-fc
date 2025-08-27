import React, { useState } from 'react';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Department Meeting',
            details: 'A meeting will be held in Room 101 at 10:00 AM on 20th Nov.',
            date: '2024-11-15',
        },
        {
            id: 2,
            title: 'Exam Schedule Update',
            details: 'The midterm exam schedule has been updated. Check the notice board.',
            date: '2024-11-12',
        },
    ]);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        details: '',
    });

    const handleAddAnnouncement = () => {
        if (newAnnouncement.title && newAnnouncement.details) {
            const newEntry = {
                id: announcements.length + 1,
                title: newAnnouncement.title,
                details: newAnnouncement.details,
                date: new Date().toISOString().split('T')[0], // current date
            };
            setAnnouncements([...announcements, newEntry]);
            setNewAnnouncement({ title: '', details: '' }); // Reset the form
        } else {
            alert('Please fill out all fields.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="page-container">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Announcements</h1>

            {/* Add Announcement Section */}
            <div className="compact-card mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Add Announcement</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">Title</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="Enter the title"
                        value={newAnnouncement.title}
                        onChange={(e) =>
                            setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                        }
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">Details</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="Enter the details"
                        rows="4"
                        value={newAnnouncement.details}
                        onChange={(e) =>
                            setNewAnnouncement({
                                ...newAnnouncement,
                                details: e.target.value,
                            })
                        }
                    ></textarea>
                </div>
                <button
                    onClick={handleAddAnnouncement}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                >
                    Add Announcement
                </button>
            </div>

            {/* View Announcements Section */}
            <div className="compact-card">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">All Announcements</h2>
                {announcements.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-200 text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="border border-gray-300 p-2">Title</th>
                            <th className="border border-gray-300 p-2">Details</th>
                            <th className="border border-gray-300 p-2">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {announcements.map((announcement) => (
                            <tr key={announcement.id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">
                                    {announcement.title}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {announcement.details}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {announcement.date}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No announcements to display.</p>
                )}
            </div>
            </div>
        </div>
    );
};

export default Announcements;
