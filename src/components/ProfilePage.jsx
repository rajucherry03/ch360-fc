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
        const ref = doc(db, 'faculty', 'CSE_DS', 'members', user.uid);
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
      <div className="compact-ui min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="bg-white border rounded-md p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shimmer rounded-full" />
              <div className="flex-1">
                <div className="h-4 shimmer rounded w-1/3 mb-2" />
                <div className="h-3 shimmer rounded w-1/4" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border rounded-md p-4">
                <div className="w-8 h-8 shimmer rounded-full mx-auto mb-3" />
                <div className="h-4 shimmer rounded w-1/3 mx-auto mb-2" />
                <div className="h-3 shimmer rounded w-1/4 mx-auto" />
              </div>
            ))}
          </div>
          <div className="bg-white border rounded-md p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 shimmer rounded-full" />
              <div className="h-4 shimmer rounded w-1/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 shimmer rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user?.uid) return;
    const ref = doc(db, 'faculty', 'CSE_DS', 'members', user.uid);
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
    <div className="compact-ui min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-6 px-4">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3 mb-1">
              <FontAwesomeIcon icon={faUser} className="text-blue-600"/>
              {userInfo.personalDetails.name || 'Faculty Profile'}
            </h1>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-600"/>
              {userInfo.personalDetails.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onToggleEdit} 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-white hover:bg-gray-50 text-sm"
            >
              <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
              {editMode ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-md p-4 text-center">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faBookOpen} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Courses</h3>
            <p className="text-2xl font-semibold text-blue-600">{userInfo.currentCourses.length}</p>
          </div>
          <div className="bg-white border rounded-md p-4 text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faCode} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Skills</h3>
            <p className="text-2xl font-semibold text-green-600">{userInfo.skills.length}</p>
          </div>
          <div className="bg-white border rounded-md p-4 text-center">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faProjectDiagram} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Projects</h3>
            <p className="text-2xl font-semibold text-pink-600">{userInfo.projects.length}</p>
          </div>
        </section>

        <div className="bg-white border rounded-md p-4 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
          </div>
        {editMode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-indigo-500 w-4" />
                <input 
                  type="text" 
                  value={userInfo.personalDetails.name} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-indigo-500 text-sm" 
                  placeholder="Full Name"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, name: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-500 w-4" />
                <input 
                  type="email" 
                  value={userInfo.personalDetails.email} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-indigo-500 text-sm" 
                  placeholder="Email Address"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, email: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="text-indigo-500 w-4" />
                <input 
                  type="tel" 
                  value={userInfo.personalDetails.phone} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-indigo-500 text-sm" 
                  placeholder="Phone Number"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, phone: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-500 w-4" />
                <input 
                  type="text" 
                  value={userInfo.personalDetails.address} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-indigo-500 text-sm" 
                  placeholder="Address"
                  onChange={(e) => setUserInfo({ ...userInfo, personalDetails: { ...userInfo.personalDetails, address: e.target.value } })} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.personalDetails.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faEnvelope} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.personalDetails.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faPhone} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.personalDetails.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.personalDetails.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
        )}
      </div>

        <div className="bg-white border rounded-md p-4 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-white text-xs" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Family Details</h2>
          </div>
        {editMode ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-emerald-600 w-4" />
                <input 
                  type="text" 
                  value={userInfo.familyDetails.fatherName} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-emerald-500 text-sm" 
                  placeholder="Father's Name"
                  onChange={(e) => setUserInfo({ ...userInfo, familyDetails: { ...userInfo.familyDetails, fatherName: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-emerald-600 w-4" />
                <input 
                  type="text" 
                  value={userInfo.familyDetails.motherName} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-emerald-500 text-sm" 
                  placeholder="Mother's Name"
                  onChange={(e) => setUserInfo({ ...userInfo, familyDetails: { ...userInfo.familyDetails, motherName: e.target.value } })} 
                />
              </div>
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-emerald-600 w-4" />
                <input 
                  type="text" 
                  value={userInfo.familyDetails.siblings} 
                  className="flex-1 py-2 px-3 rounded-md border focus:ring-2 focus:ring-emerald-500 text-sm" 
                  placeholder="Siblings"
                  onChange={(e) => setUserInfo({ ...userInfo, familyDetails: { ...userInfo.familyDetails, siblings: e.target.value } })} 
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Father's Name</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.familyDetails.fatherName || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Mother's Name</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.familyDetails.motherName || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-md border">
                <FontAwesomeIcon icon={faUsers} className="text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Siblings</p>
                  <p className="font-medium text-gray-700 text-sm">{userInfo.familyDetails.siblings || 'Not provided'}</p>
                </div>
              </div>
            </div>
        )}
      </div>

      <div className="bg-white border rounded-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Current Courses</h2>
        {userInfo.currentCourses.map(course => (
          <div key={course.id} className="mb-4">
            <h3 className="text-sm font-medium text-gray-800">{course.name}</h3>
            <p className="text-gray-600 text-sm">Progress: {course.progress}%</p>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Professional Experience</h2>
        {userInfo.professionalExperience.map(experience => (
          <div key={experience.id} className="mb-4">
            {editMode ? (
              <>
                <input type="text" value={experience.jobTitle} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, jobTitle: e.target.value } : exp)
                })} />
                <input type="text" value={experience.company} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, company: e.target.value } : exp)
                })} />
                <input type="text" value={experience.duration} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, duration: e.target.value } : exp)
                })} />
                <textarea value={experience.description} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                  ...userInfo,
                  professionalExperience: userInfo.professionalExperience.map(exp => exp.id === experience.id ? { ...exp, description: e.target.value } : exp)
                })}></textarea>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-gray-800">{experience.jobTitle}</h3>
                  <p className="text-gray-600 text-sm"><strong>Company:</strong> {experience.company}</p>
                  <p className="text-gray-600 text-sm"><strong>Duration:</strong> {experience.duration}</p>
                  <p className="text-gray-600 text-sm"><strong>Description:</strong> {experience.description}</p>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex flex-col space-y-2">
              <input type="text" placeholder="Job Title" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <input type="text" placeholder="Company" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <input type="text" placeholder="Duration" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <textarea placeholder="Description" className="w-full py-2 px-3 rounded border mb-2 text-sm"></textarea>
              <button className="bg-green-600 text-white py-2 px-3 rounded-md text-sm">Add Experience</button>
            </div>
          )}
        </div>
  
        <div className="bg-white border rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Skills</h2>
          <ul className="list-disc list-inside">
            {userInfo.skills.map((skill, index) => (
              <li key={index} className="text-gray-600 text-sm">{skill}</li>
            ))}
          </ul>
          {editMode && (
            <div className="flex items-center space-x-2 mt-4">
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="w-full py-2 px-3 rounded border mb-2 text-sm" placeholder="Add new skill" />
              <button onClick={handleAddSkill} className="bg-blue-600 text-white py-2 px-3 rounded-md text-sm">Add</button>
            </div>
          )}
        </div>
  
        <div className="bg-white border rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Projects</h2>
          {userInfo.projects.map(project => (
            <div key={project.id} className="mb-4">
              {editMode ? (
                <>
                  <input type="text" value={project.title} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                    ...userInfo,
                    projects: userInfo.projects.map(proj => proj.id === project.id ? { ...proj, title: e.target.value } : proj)
                  })} />
                  <textarea value={project.description} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                    ...userInfo,
                    projects: userInfo.projects.map(proj => proj.id === project.id ? { ...proj, description: e.target.value } : proj)
                  })}></textarea>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-gray-800">{project.title}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex flex-col space-y-2">
              <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} placeholder="Project Title" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} placeholder="Project Description" className="w-full py-2 px-3 rounded border mb-2 text-sm"></textarea>
              <button onClick={handleAddProject} className="bg-green-600 text-white py-2 px-3 rounded-md text-sm">Add Project</button>
            </div>
          )}
        </div>
  
        <div className="bg-white border rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Education</h2>
          {userInfo.education.map(edu => (
            <div key={edu.id} className="mb-4">
              {editMode ? (
                <>
                  <input type="text" value={edu.degree} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                    ...userInfo,
                    education: userInfo.education.map(education => education.id === edu.id ? { ...education, degree: e.target.value } : education)
                  })} />
                  <input type="text" value={edu.university} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                    ...userInfo,
                    education: userInfo.education.map(education => education.id === edu.id ? { ...education, university: e.target.value } : education)
                  })} />
                  <input type="text" value={edu.year} className="w-full py-2 px-3 rounded border mb-2 text-sm" onChange={(e) => setUserInfo({
                    ...userInfo,
                    education: userInfo.education.map(education => education.id === edu.id ? { ...education, year: e.target.value } : education)
                  })} />
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600 text-sm"><strong>University:</strong> {edu.university}</p>
                  <p className="text-gray-600 text-sm"><strong>Year:</strong> {edu.year}</p>
                </>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex flex-col space-y-2">
              <input type="text" value={newEducation.degree} onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })} placeholder="Degree" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <input type="text" value={newEducation.university} onChange={(e) => setNewEducation({ ...newEducation, university: e.target.value })} placeholder="University" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <input type="text" value={newEducation.year} onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })} placeholder="Year" className="w-full py-2 px-3 rounded border mb-2 text-sm" />
              <button onClick={handleAddEducation} className="bg-green-600 text-white py-2 px-3 rounded-md text-sm">Add Education</button>
            </div>
          )}
        </div>
  
        <div className="bg-white border rounded-md p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Mentor Details</h2>
          <p className="text-gray-600 text-sm"><strong>Mentor Name:</strong> {userInfo.mentor?.name || '—'}</p>
          <p className="text-gray-600 text-sm"><strong>Email:</strong> {userInfo.mentor?.email || '—'}</p>
          <p className="text-gray-600 text-sm"><strong>Phone:</strong> {userInfo.mentor?.phone || '—'}</p>
        </div>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;
  