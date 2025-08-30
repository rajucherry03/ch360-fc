import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faUser, 
  faCalendarAlt, 
  faClipboardList,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

const RequestPage = () => {
    const [formData, setFormData] = useState({
        requestType: '',
        details: '',
        requestedBy: '',
    });

    const [submittedRequests, setSubmittedRequests] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.requestType || !formData.details || !formData.requestedBy) {
            alert('Please fill out all fields.');
            return;
        }

        const newRequest = {
            id: submittedRequests.length + 1,
            ...formData,
            status: 'Pending',
            date: new Date().toLocaleDateString(),
        };

        setSubmittedRequests((prev) => [...prev, newRequest]);
        setFormData({
            requestType: '',
            details: '',
            requestedBy: '',
        });
        alert('Request submitted successfully!');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
            case 'Rejected':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
            case 'Pending':
            default:
                return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700';
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
                                    <FontAwesomeIcon icon={faFileAlt} className="text-white text-lg"/>
                                </div>
                                Submit a Request to HOD
                            </h1>
                            <p className="text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-gray-800 dark:text-gray-200"/>
                                Submit and track your requests to the Head of Department efficiently
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-sm text-gray-800 dark:text-gray-200">Total Requests</p>
                                <p className="text-lg font-semibold text-gray-950 dark:text-white">{submittedRequests.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faClipboardList} className="text-white text-sm" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-950 dark:text-white">New Request Form</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Request Type</label>
                            <select
                                name="requestType"
                                value={formData.requestType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                            >
                                <option value="">Select a request type</option>
                                <option value="Leave Request">Leave Request</option>
                                <option value="Permission Request">Permission Request</option>
                                <option value="Resource Request">Resource Request</option>
                                <option value="General Help">General Help</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Details</label>
                            <textarea
                                name="details"
                                value={formData.details}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                placeholder="Enter the details of your request"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Requested By</label>
                            <input
                                type="text"
                                name="requestedBy"
                                value={formData.requestedBy}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                                placeholder="Enter your name"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            Submit Request
                        </button>
                    </form>
                </div>

                {/* Submitted Requests Card */}
                {submittedRequests.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faClipboardList} className="text-white text-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Submitted Requests</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">Request ID</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">Type</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">Details</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">Requested By</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">Date</th>
                                        <th className="text-left p-4 text-sm font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submittedRequests.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                                            <td className="p-4 text-sm text-gray-950 dark:text-white border-b border-gray-200 dark:border-gray-600">#{req.id}</td>
                                            <td className="p-4 text-sm text-gray-950 dark:text-white border-b border-gray-200 dark:border-gray-600">{req.requestType}</td>
                                            <td className="p-4 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 max-w-xs truncate">{req.details}</td>
                                            <td className="p-4 text-sm text-gray-950 dark:text-white border-b border-gray-200 dark:border-gray-600">{req.requestedBy}</td>
                                            <td className="p-4 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">{req.date}</td>
                                            <td className="p-4 border-b border-gray-200 dark:border-gray-600">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                                    {req.status === 'Pending' && <FontAwesomeIcon icon={faClock} className="mr-1" />}
                                                    {req.status === 'Approved' && <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />}
                                                    {req.status === 'Rejected' && <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />}
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Quick Stats Card */}
                {submittedRequests.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-950 dark:text-white">Request Statistics</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                                <div className="text-2xl font-bold text-gray-950 dark:text-white">{submittedRequests.length}</div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">Total Requests</div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center border border-orange-200 dark:border-orange-700">
                                <div className="text-2xl font-bold text-orange-800 dark:text-orange-300">
                                    {submittedRequests.filter(req => req.status === 'Pending').length}
                                </div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">Pending</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-700">
                                <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                                    {submittedRequests.filter(req => req.status === 'Approved').length}
                                </div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">Approved</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center border border-red-200 dark:border-red-700">
                                <div className="text-2xl font-bold text-red-800 dark:text-red-300">
                                    {submittedRequests.filter(req => req.status === 'Rejected').length}
                                </div>
                                <div className="text-sm text-gray-800 dark:text-gray-200">Rejected</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestPage;
