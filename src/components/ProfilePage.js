import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faBookOpen, faCode, faProjectDiagram, faUsers, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    personalDetails: { name: '', email: '', phone: '', address: '' },
    familyDetails: { fatherName: '', motherName: '', siblings: '' },
    currentCourses: [],
    professionalExperience: [],
    skills: [],
    projects: [],
    education: [],
    mentor: { name: '', email: '', phone: '' },
  });

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, 'faculty', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setUserInfo({
            personalDetails: {
              name: data.name || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              address: data.address || '',
            },
            familyDetails: data.familyDetails || { fatherName: '', motherName: '', siblings: '' },
            currentCourses: Array.isArray(data.currentCourses) ? data.currentCourses : [],
            professionalExperience: Array.isArray(data.professionalExperience) ? data.professionalExperience : [],
            skills: Array.isArray(data.skills) ? data.skills : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            education: Array.isArray(data.education) ? data.education : [],
            mentor: data.mentor || { name: '', email: '', phone: '' },
          });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [newEducation, setNewEducation] = useState({ degree: '', university: '', year: '' });

  const handleAddSkill = () => {
    setUserInfo({ ...userInfo, skills: [...userInfo.skills, newSkill] });
    setNewSkill('');
  };

  const handleAddProject = () => {
    const newProjectEntry = { ...newProject, id: userInfo.projects.length + 1 };
    setUserInfo({ ...userInfo, projects: [...userInfo.projects, newProjectEntry] });
    setNewProject({ title: '', description: '' });
  };

  const handleAddEducation = () => {
    const newEducationEntry = { ...newEducation, id: userInfo.education.length + 1 };
    setUserInfo({ ...userInfo, education: [...userInfo.education, newEducationEntry] });
    setNewEducation({ degree: '', university: '', year: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user?.uid) return;
    const ref = doc(db, 'faculty', user.uid);
    const payload = {
      name: userInfo.personalDetails.name,
      email: userInfo.personalDetails.email,
      phone: userInfo.personalDetails.phone,
      address: userInfo.personalDetails.address,
      familyDetails: userInfo.familyDetails,
      currentCourses: userInfo.currentCourses,
      professionalExperience: userInfo.professionalExperience,
      skills: userInfo.skills,
      projects: userInfo.projects,
      education: userInfo.education,
      mentor: userInfo.mentor,
    };
    await updateDoc(ref, payload);
  };

  const onToggleEdit = async () => {
    if (editMode) {
      await handleSave();
    }
    setEditMode(!editMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto py-6 px-4 md:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-indigo-600 animate-pulse"/>
              {userInfo.personalDetails.name || 'Faculty Profile'}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400"/>
              {userInfo.personalDetails.email}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onToggleEdit} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
              {editMode ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </header>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl shadow-lg p-6 text-center hover-lift animate-fade-in stagger-1">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faBookOpen} className="text-white text-xl" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Courses</h3>
            <p className="mt-2 text-3xl font-bold gradient-text">{userInfo.currentCourses.length}</p>
          </div>
          <div className="glass rounded-xl shadow-lg p-6 text-center hover-lift animate-fade-in stagger-2">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCode} className="text-white text-xl" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Skills</h3>
            <p className="mt-2 text-3xl font-bold gradient-text">{userInfo.skills.length}</p>
          </div>
          <div className="glass rounded-xl shadow-lg p-6 text-center hover-lift animate-fade-in stagger-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faProjectDiagram} className="text-white text-xl" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Projects</h3>
            <p className="mt-2 text-3xl font-bold gradient-text">{userInfo.projects.length}</p>
          </div>
        </section>

        <div className="glass rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">Personal Details</h2>
          </div>
          {editMode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-indigo-400 w-5" />
                <input 
                  type="text" 
                  value={userInfo.personalDetails.name} 
                  className="flex-1 py-3 px-4 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Full Name"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, name: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400 w-5" />
                <input 
                  type="email" 
                  value={userInfo.personalDetails.email} 
                  className="flex-1 py-3 px-4 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Email Address"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, email: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-indigo-400 w-5" />
                <input 
                  type="tel" 
                  value={userInfo.personalDetails.phone} 
                  className="flex-1 py-3 px-4 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Phone Number"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, phone: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-400 w-5" />
                <input 
                  type="text" 
                  value={userInfo.personalDetails.address} 
                  className="flex-1 py-3 px-4 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Address"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, address: e.target.value } })} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faUser} className="text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-700">{userInfo.personalDetails.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-700">{userInfo.personalDetails.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faPhone} className="text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-700">{userInfo.personalDetails.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-semibold text-gray-700">{userInfo.personalDetails.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold gradient-text">Family Details</h2>
          </div>
          {editMode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-green-400 w-5" />
                <input 
                  type="text" 
                  value={userInfo.familyDetails.fatherName} 
                  className="flex-1 py-3 px-4 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Father's Name"
                  onChange={(e) => setUserInfo({ ...userInfo, familyDetails: { ...userInfo.familyDetails, fatherName: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-green-400 w-5" />
                <input 
                  type="text" 
                  value={userInfo.familyDetails.motherName} 
                  className="flex-1 py-3 px-4 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Mother's Name"
                  onChange={(e) => setUserInfo({ ...userInfo, familyDetails: { ...userInfo.familyDetails, motherName: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-green-400 w-5" />
                <input 
                  type="text" 
                  value={userInfo.familyDetails.siblings} 
                  className="flex-1 py-3 px-4 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" 
                  placeholder="Siblings"
                  onChange={(e) => setUserInfo({ ...userInfo, familyDetails: { ...userInfo.familyDetails, siblings: e.target.value } })} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faUser} className="text-green-400" />
                <div>
                  <p className="text-sm text-gray-500">Father's Name</p>
                  <p className="font-semibold text-gray-700">{userInfo.familyDetails.fatherName || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faUser} className="text-green-400" />
                <div>
                  <p className="text-sm text-gray-500">Mother's Name</p>
                  <p className="font-semibold text-gray-700">{userInfo.familyDetails.motherName || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <FontAwesomeIcon icon={faUsers} className="text-green-400" />
                <div>
                  <p className="text-sm text-gray-500">Siblings</p>
                  <p className="font-semibold text-gray-700">{userInfo.familyDetails.siblings || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Current Courses</h2>
        {userInfo.currentCourses.map(course => (
          <div key={course.id} className="mb-4">
            <h3 className="text-xl font-bold">{course.name}</h3>
            <p className="text-gray-600">Progress: {course.progress}%</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Professional Experience</h2>
        {userInfo.professionalExperience.map(experience => (
          <div key={experience.id} className="mb-4">
            {editMode ? (
              <>
                <input type="text" value={experience.jobTitle} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, jobTitle: e.target.value } : exp)
                })} />
                <input type="text" value={experience.company} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, company: e.target.value } : exp)
                })} />
                <input type="text" value={experience.duration} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, duration: e.target.value } : exp)
                })} />
                <textarea value={experience.description} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, description: e.target.value } : exp)
                })}></textarea>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{experience.jobTitle}</h3>
                  <p className="text-gray-600"><strong>Company:</strong> {experience.company}</p>
                  <p className="text-gray-600"><strong>Duration:</strong> {experience.duration}</p>
                  <p className="text-gray-600"><strong>Description:</strong> {experience.description}</p>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex flex-col space-y-2">
              <input type="text" placeholder="Job Title" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <input type="text" placeholder="Company" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <input type="text" placeholder="Duration" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <textarea placeholder="Description" className="w-full py-2 px-4 rounded bg-gray-200 mb-2"></textarea>
              <button className="bg-green-600 text-white py-2 px-4 rounded shadow-md hover:bg-green-700">Add Experience</button>
            </div>
          )}
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <ul className="list-disc list-inside">
            {userInfo.skills.map((skill, index) => (
              <li key={index} className="text-gray-600">{skill}</li>
            ))}
          </ul>
          {editMode && (
            <div className="flex items-center space-x-2 mt-4">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" placeholder="Add new skill" />
              <button onClick={handleAddSkill} className="bg-blue-600 text-white py-2 px-4 rounded shadow-md hover:bg-blue-700">Add</button>
            </div>
          )}
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {userInfo.projects.map(project => (
            <div key={project.id} className="mb-4">
              {editMode ? (
                <>
                  <input type="text" value={project.title} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                    ...userInfo,
                    projects: userInfo.projects.map(proj => proj.id === project.id ? { ...proj, title: e.target.value } : proj)
                  })} />
                  <textarea value={project.description} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                    ...userInfo,
                    projects: userInfo.projects.map(proj => proj.id === project.id ? { ...proj, description: e.target.value } : proj)
                  })}></textarea>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex flex-col space-y-2">
              <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project Title" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Project Description" className="w-full py-2 px-4 rounded bg-gray-200 mb-2"></textarea>
              <button onClick={handleAddProject} className="bg-green-600 text-white py-2 px-4 rounded shadow-md hover:bg-green-700">Add Project</button>
            </div>
          )}
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          {userInfo.education.map(edu => (
            <div key={edu.id} className="mb-4">
              {editMode ? (
                <>
                  <input type="text" value={edu.degree} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                    ...userInfo,
                    education: userInfo.education.map(education => education.id === edu.id ? { ...education, degree: e.target.value } : education)
                  })} />
                  <input type="text" value={edu.university} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                    ...userInfo,
                    education: userInfo.education.map(education => education.id === edu.id ? { ...education, university: e.target.value } : education)
                  })} />
                  <input type="text" value={edu.year} className="w-full py-2 px-4 rounded bg-gray-200 mb-2" onChange={(e) => setUserInfo({
                    ...userInfo,
                    education: userInfo.education.map(education => education.id === edu.id ? { ...education, year: e.target.value } : education)
                  })} />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <p className="text-gray-600"><strong>University:</strong> {edu.university}</p>
                  <p className="text-gray-600"><strong>Year:</strong> {edu.year}</p>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex flex-col space-y-2">
              <input type="text" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Degree" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <input type="text" value={newEducation.university} onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })} placeholder="University" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <input type="text" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} placeholder="Year" className="w-full py-2 px-4 rounded bg-gray-200 mb-2" />
              <button onClick={handleAddEducation} className="bg-green-600 text-white py-2 px-4 rounded shadow-md hover:bg-green-700">Add Education</button>
            </div>
          )}
        </div>
  
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Mentor Details</h2>
          <p className="text-gray-600"><strong>Mentor Name:</strong> {userInfo.mentor?.name || '—'}</p>
          <p className="text-gray-600"><strong>Email:</strong> {userInfo.mentor?.email || '—'}</p>
          <p className="text-gray-600"><strong>Phone:</strong> {userInfo.mentor?.phone || '—'}</p>
        </div>
      </div>
    </div>
    );
  };
  
  export default ProfilePage;
  