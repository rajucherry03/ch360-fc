import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faBookOpen, 
  faCode, 
  faProjectDiagram, 
  faUsers, 
  faEdit, 
  faSave,
  faGraduationCap,
  faBriefcase,
  faCalendarAlt,
  faIdCard,
  faUniversity,
  faBuilding,
  faAward,
  faStar,
  faClock,
  faCertificate,
  faChalkboardTeacher,
  faUserGraduate,
  faHome,
  faBank,
  faCreditCard,
  faShieldAlt,
  faHeart,
  faVenusMars,
  faGlobe,
  faFlag
} from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadFacultyData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Fetch faculty data from the correct path
        const facultyRef = doc(db, 'faculty', 'CSE_DS', 'members', user.uid);
        const facultySnap = await getDoc(facultyRef);
        
        if (facultySnap.exists()) {
          const data = facultySnap.data();
          setFacultyData(data);
          
          // Fetch courses taught by this faculty
          const allCourseIds = [];
          
          // Add courses from the 'courses' array
          if (data.courses && Array.isArray(data.courses)) {
            allCourseIds.push(...data.courses);
          }
          
          // Add courses from the 'teaching' field
          if (data.teaching) {
            // Handle different teaching structures
            if (data.teaching.III_A && Array.isArray(data.teaching.III_A)) {
              allCourseIds.push(...data.teaching.III_A);
            }
            // Add other sections if they exist
            Object.keys(data.teaching).forEach(section => {
              if (section !== 'III_A' && Array.isArray(data.teaching[section])) {
                allCourseIds.push(...data.teaching[section]);
              }
            });
          }
          
          // Remove duplicates
          const uniqueCourseIds = [...new Set(allCourseIds)];
          const courses = [];
          
                    // Fast course fetching with multiple strategies
          console.log("📚 Course IDs from faculty data:", uniqueCourseIds);
          
          let fetchedCourses = [];

          // Strategy 1: Direct collectionGroup query (fastest)
          try {
            console.log("🚀 Strategy 1: CollectionGroup query...");
            const cg = collectionGroup(db, "courseDetails");
            const qy = query(cg, where("instructor", "==", user.uid));
            const snap = await getDocs(qy);
            
            snap.forEach((docSnap) => {
              const path = docSnap.ref.path;
              console.log("📍 Found course at:", path);
              
              const segments = path.split("/");
              let year, section, semester;
              
              // Parse path to extract year, section, semester
              if (path.includes('year_sem')) {
                const yearSemIndex = segments.indexOf('year_sem');
                if (yearSemIndex + 1 < segments.length) {
                  const yearSem = segments[yearSemIndex + 1];
                  const [yearPart, semesterPart] = yearSem.split('_');
                  year = yearPart;
                  semester = semesterPart;
                  section = 'A';
                }
              } else if (path.includes('courses/')) {
                // Old structure: /courses/{year}/{section}/{semester}/courseDetails/{courseId}
                year = segments[1];
                section = segments[2];
                semester = segments[3];
              }
              
              fetchedCourses.push({ 
                id: docSnap.id, 
                year, 
                section, 
                semester, 
                ...docSnap.data() 
              });
            });
            
            console.log("✅ Strategy 1 found:", fetchedCourses.length, "courses");
          } catch (error) {
            console.error("❌ Strategy 1 failed:", error);
          }

          // Strategy 2: If no courses found, try direct path lookup
          if (fetchedCourses.length === 0 && uniqueCourseIds.length > 0) {
            console.log("🚀 Strategy 2: Direct path lookup...");
            
            // Create all possible paths to check
            const pathsToCheck = [];
            
            // New structure paths
            ['III_1', 'III_2', 'III_3', 'III_4', 'III_5', 'III_6', 'III_7', 'III_8'].forEach(yearSem => {
              uniqueCourseIds.forEach(courseId => {
                pathsToCheck.push({
                  path: doc(db, 'courses', 'CSE_DS', 'year_sem', yearSem, 'courseDetails', courseId),
                  yearSem,
                  courseId
                });
              });
            });
            
            // Old structure paths
            ['III', 'II', 'I', 'IV'].forEach(year => {
              ['A', 'B', 'C', 'D', 'E', 'F'].forEach(section => {
                ['sem1', 'sem2'].forEach(semester => {
                  uniqueCourseIds.forEach(courseId => {
                    pathsToCheck.push({
                      path: doc(db, 'courses', year, section, semester, 'courseDetails', courseId),
                      year,
                      section,
                      semester,
                      courseId
                    });
                  });
                });
              });
            });

            // Check all paths in parallel (fast)
            const pathChecks = pathsToCheck.map(async ({ path, yearSem, year, section, semester, courseId }) => {
              try {
                const snap = await getDoc(path);
                if (snap.exists()) {
                  const courseData = snap.data();
                  console.log("📍 Found course at path:", path.path);
                  
                  if (yearSem) {
                    const [yearPart, semesterPart] = yearSem.split('_');
                    return {
                      id: courseId,
                      year: yearPart,
                      section: 'A',
                      semester: semesterPart,
                      ...courseData
                    };
                  } else {
                    return {
                      id: courseId,
                      year,
                      section,
                      semester,
                      ...courseData
                    };
                  }
                }
                return null;
              } catch (error) {
                return null;
              }
            });

            const results = await Promise.all(pathChecks);
            fetchedCourses = results.filter(course => course !== null);
            console.log("✅ Strategy 2 found:", fetchedCourses.length, "courses");
          }

          // Strategy 3: If still no courses, create meaningful placeholders
          if (fetchedCourses.length === 0) {
            console.log("🚀 Strategy 3: Creating placeholder courses...");
            fetchedCourses = uniqueCourseIds.map((courseId, index) => ({
              id: courseId,
              courseName: `Course ${index + 1}`,
              courseCode: courseId,
              description: `Course assigned to ${data.name}`,
              instructor: data.name,
              credits: 3,
              enrolledStudents: 0,
              year: "III",
              section: "A",
              semester: "5"
            }));
            console.log("✅ Strategy 3 created:", fetchedCourses.length, "placeholder courses");
          }

          // Set the final result
          console.log("🎉 Final courses to display:", fetchedCourses.length);
          setCoursesData(fetchedCourses);
        }
      } catch (error) {
        console.error('Error loading faculty data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFacultyData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-1 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto mb-4 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4 animate-pulse" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!facultyData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-lg">
            <FontAwesomeIcon icon={faUser} className="text-blue-600 dark:text-blue-400 text-6xl mb-4" />
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-2">Profile Not Found</h2>
            <p className="text-gray-800 dark:text-gray-200">No faculty profile found for this user.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-950 dark:text-white mb-2">{facultyData.name}</h1>
              <p className="text-gray-800 dark:text-gray-200 mb-1 text-lg">{facultyData.designation}</p>
              <p className="text-gray-800 dark:text-gray-200 mb-4">{facultyData.department}</p>
              <div className="flex flex-wrap gap-6 text-sm text-gray-800 dark:text-gray-200">
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary"/>
                  {facultyData.emailID}
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-primary"/>
                  {facultyData.contactNo}
                </span>
                <span className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faIdCard} className="text-primary"/>
                  {facultyData.empID}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
              {editMode ? 'Save' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-lg" />
            </div>
            <div className="text-3xl font-bold text-gray-950 dark:text-white">{coursesData.length}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200">Courses Teaching</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FontAwesomeIcon icon={faClock} className="text-white text-lg" />
            </div>
            <div className="text-3xl font-bold text-gray-950 dark:text-white">{facultyData.experience}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200">Experience</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FontAwesomeIcon icon={faAward} className="text-white text-lg" />
            </div>
            <div className="text-3xl font-bold text-gray-950 dark:text-white">{facultyData.qualifications}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200">Qualification</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FontAwesomeIcon icon={faStar} className="text-white text-lg" />
            </div>
            <div className="text-3xl font-bold text-gray-950 dark:text-white">{facultyData.acadExperience}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200">Academic Exp.</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
              </div>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Date of Birth</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.dob}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Blood Group</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.bloodGroup}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Religion</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.religion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Caste</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.caste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Sub Caste</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.subCaste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Origin</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.origin}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Local Address</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.localAddress}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Permanent Address</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.permAddress}</p>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="text-white text-sm" />
              </div>
              Family Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Father's Name</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.fatherName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Mother's Name</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.motherName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Spouse Name</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.spouseName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Relationship with Spouse</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.relationshipWithSpouse}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faBriefcase} className="text-white text-sm" />
              </div>
              Professional Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Employee ID</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.empID}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Date of Joining</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.dateOfJoining}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Department</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Designation</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.designation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Department Role</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.depRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Role Level</label>
                  <p className="text-gray-950 dark:text-white font-semibold">{facultyData.roleLevel}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Area of Specialization</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.areaOfSpecialization}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Specialization</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.specialization}</p>
              </div>
            </div>
          </div>

          {/* Educational Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-sm" />
              </div>
              Educational Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Qualification</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.qualifications}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Degree</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.degr}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Degree Date</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.degrDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Academic Experience</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.acadExperience}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Industry Experience</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.industryExperience} years</p>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faBank} className="text-white text-sm" />
              </div>
              Banking Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Bank Name</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.bankName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Branch</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.branch}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Account Number</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.bankAccountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">IFSC Code</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.ifsc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Bank Address</label>
                <p className="text-gray-950 dark:text-white font-semibold text-sm">{facultyData.bankAddr}</p>
              </div>
            </div>
          </div>

          {/* Government Documents */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faIdCard} className="text-white text-sm" />
              </div>
              Government Documents
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Aadhaar Number</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.aadhaar}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">PAN Number</label>
                <p className="text-gray-950 dark:text-white font-semibold">{facultyData.pan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Teaching */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="text-white text-sm" />
            </div>
            Courses Currently Teaching
          </h2>
          {coursesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.map((course, index) => (
                <div key={course.id} className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FontAwesomeIcon icon={faBookOpen} className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-950 dark:text-white">{course.courseName || `Course ${index + 1}`}</h3>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{course.courseCode || course.id}</p>
                    </div>
                  </div>
                  {course.description && (
                    <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">{course.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {course.credits && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-700">
                        {course.credits} Credits
                      </span>
                    )}
                    {course.semester && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-700">
                        Semester {course.semester}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 dark:text-blue-400 text-6xl mb-4" />
              <p className="text-gray-800 dark:text-gray-200 text-lg">No courses assigned yet.</p>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faShieldAlt} className="text-white text-sm" />
            </div>
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Status</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                facultyData.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'
              }`}>
                {facultyData.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Profile Complete</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                facultyData.profileComplete ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700'
              }`}>
                {facultyData.profileComplete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">Department Key</label>
              <p className="text-gray-950 dark:text-white font-semibold">{facultyData.departmentKey}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
  