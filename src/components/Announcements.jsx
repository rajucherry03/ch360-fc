import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullhorn, 
  faPlus, 
  faCalendarAlt, 
  faUser,
  faEdit,
  faTrash,
  faBell
} from '@fortawesome/free-solid-svg-icons';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([
        {
            id: 1,
            title: 'Department Meeting',
            details: 'A meeting will be held in Room 101 at 10:00 AM on 20th Nov.',
            date: '2024-11-15',
            author: 'Dr. Smith',
            priority: 'High'
        },
        {
            id: 2,
            title: 'Exam Schedule Update',
            details: 'The midterm exam schedule has been updated. Check the notice board.',
            date: '2024-11-12',
            author: 'Academic Office',
            priority: 'Medium'
        },
        {
            id: 3,
            title: 'Faculty Development Workshop',
            details: 'Join us for a workshop on modern teaching methodologies this Friday.',
            date: '2024-11-10',
            author: 'Training Department',
            priority: 'Low'
        }
    ]);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        details: '',
        priority: 'Medium'
    });

    const handleAddAnnouncement = () => {
        if (newAnnouncement.title && newAnnouncement.details) {
            const newEntry = {
                id: announcements.length + 1,
                title: newAnnouncement.title,
                details: newAnnouncement.details,
                date: new Date().toISOString().split('T')[0],
                author: 'You',
                priority: newAnnouncement.priority
            };
            setAnnouncements([newEntry, ...announcements]);
            setNewAnnouncement({ title: '', details: '', priority: 'Medium' });
        } else {
            alert('Please fill out all fields.');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
            case 'Medium':
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700';
            case 'Low':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-8 px-6">
                
                {/* Professional Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-950 dark:text-white flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                                    <FontAwesomeIcon icon={faBullhorn} className="text-white text-lg"/>
                                </div>
                                Announcements
                            </h1>
                            <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-gray-800 dark:text-gray-200"/>
                                Manage and view important announcements for faculty and students
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-gray-800 dark:text-gray-200">Total Announcements</p>
                                <p className="text-lg font-semibold text-gray-950 dark:text-white">{announcements.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Announcement Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Add New Announcement</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                placeholder="Enter announcement title"
                                value={newAnnouncement.title}
                                onChange={(e) =>
                                    setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                                }
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Priority</label>
                            <select
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                value={newAnnouncement.priority}
                                onChange={(e) =>
                                    setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })
                                }
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>
                        
                        <div className="flex items-end">
                            <button
                                onClick={handleAddAnnouncement}
                                className="w-full px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Add Announcement
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Details</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                            placeholder="Enter announcement details"
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
                </div>

                {/* Announcements List Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faBell} className="text-white text-sm" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">All Announcements</h2>
                    </div>
                    
                    {announcements.length > 0 ? (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-950 dark:text-white">{announcement.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}>
                                                    {announcement.priority} Priority
                                                </span>
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-3">
                                                {announcement.details}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-800 dark:text-gray-200">
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faUser} className="text-primary"/>
                                                    {announcement.author}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary"/>
                                                    {announcement.date}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-800 dark:text-gray-200 hover:text-primary transition-colors">
                                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                            </button>
                                            <button className="p-2 text-gray-800 dark:text-gray-200 hover:text-red-600 transition-colors">
                                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faBell} className="text-gray-800 dark:text-gray-200 text-xl" />
                            </div>
                            <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">No announcements to display</p>
                            <p className="text-gray-800 dark:text-gray-200 text-sm">Create your first announcement using the form above</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Announcements;
