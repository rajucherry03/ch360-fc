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
      <div className="compact-ui min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 shimmer rounded-full" />
              <div className="flex-1">
                <div className="h-6 shimmer rounded w-1/3 mb-2" />
                <div className="h-4 shimmer rounded w-1/4 mb-1" />
                <div className="h-4 shimmer rounded w-1/5" />
              </div>
            </div>
          </div>
          
          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border-theme rounded-lg p-4">
                <div className="w-10 h-10 shimmer rounded-full mx-auto mb-3" />
                <div className="h-4 shimmer rounded w-1/2 mx-auto mb-2" />
                <div className="h-6 shimmer rounded w-1/3 mx-auto" />
              </div>
            ))}
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border-theme rounded-lg p-6">
                <div className="h-5 shimmer rounded w-1/4 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-4 shimmer rounded w-1/3" />
                      <div className="h-10 shimmer rounded" />
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
      <div className="compact-ui min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-surface border border-border-theme rounded-lg p-6 text-center">
            <FontAwesomeIcon icon={faUser} className="text-secondary text-6xl mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">Profile Not Found</h2>
            <p className="text-secondary">No faculty profile found for this user.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="compact-ui min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-surface border border-border-theme rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-primary mb-2">{facultyData.name}</h1>
              <p className="text-secondary mb-1">{facultyData.designation}</p>
              <p className="text-secondary mb-3">{facultyData.department}</p>
              <div className="flex flex-wrap gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faEnvelope} />
                  {facultyData.emailID}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faPhone} />
                  {facultyData.contactNo}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faIdCard} />
                  {facultyData.empID}
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2"
            >
              <FontAwesomeIcon icon={editMode ? faSave : faEdit} />
              {editMode ? 'Save' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border-theme rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faChalkboardTeacher} />
            </div>
            <div className="text-2xl font-bold text-primary">{coursesData.length}</div>
            <div className="text-sm text-secondary">Courses Teaching</div>
          </div>
          
          <div className="bg-surface border border-border-theme rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="text-2xl font-bold text-primary">{facultyData.experience}</div>
            <div className="text-sm text-secondary">Experience</div>
          </div>
          
          <div className="bg-surface border border-border-theme rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faAward} />
            </div>
            <div className="text-2xl font-bold text-primary">{facultyData.qualifications}</div>
            <div className="text-sm text-secondary">Qualification</div>
          </div>
          
          <div className="bg-surface border border-border-theme rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <div className="text-2xl font-bold text-primary">{facultyData.acadExperience}</div>
            <div className="text-sm text-secondary">Academic Exp.</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-accent" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Date of Birth</label>
                  <p className="text-primary">{facultyData.dob}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Blood Group</label>
                  <p className="text-primary">{facultyData.bloodGroup}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Religion</label>
                  <p className="text-primary">{facultyData.religion}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Caste</label>
                  <p className="text-primary">{facultyData.caste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Sub Caste</label>
                  <p className="text-primary">{facultyData.subCaste}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Origin</label>
                  <p className="text-primary">{facultyData.origin}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Local Address</label>
                <p className="text-primary">{facultyData.localAddress}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Permanent Address</label>
                <p className="text-primary">{facultyData.permAddress}</p>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-secondary" />
              Family Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Father's Name</label>
                <p className="text-primary">{facultyData.fatherName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Mother's Name</label>
                <p className="text-primary">{facultyData.motherName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Spouse Name</label>
                <p className="text-primary">{facultyData.spouseName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Relationship with Spouse</label>
                <p className="text-primary">{facultyData.relationshipWithSpouse}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faBriefcase} className="text-primary" />
              Professional Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Employee ID</label>
                  <p className="text-primary">{facultyData.empID}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Date of Joining</label>
                  <p className="text-primary">{facultyData.dateOfJoining}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Department</label>
                  <p className="text-primary">{facultyData.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Designation</label>
                  <p className="text-primary">{facultyData.designation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Department Role</label>
                  <p className="text-primary">{facultyData.depRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1">Role Level</label>
                  <p className="text-primary">{facultyData.roleLevel}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Area of Specialization</label>
                <p className="text-primary">{facultyData.areaOfSpecialization}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Specialization</label>
                <p className="text-primary">{facultyData.specialization}</p>
              </div>
            </div>
          </div>

          {/* Educational Information */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faGraduationCap} className="text-accent" />
              Educational Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Qualification</label>
                <p className="text-primary">{facultyData.qualifications}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Degree</label>
                <p className="text-primary">{facultyData.degr}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Degree Date</label>
                <p className="text-primary">{facultyData.degrDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Academic Experience</label>
                <p className="text-primary">{facultyData.acadExperience}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Industry Experience</label>
                <p className="text-primary">{facultyData.industryExperience} years</p>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faBank} className="text-secondary" />
              Banking Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Bank Name</label>
                <p className="text-primary">{facultyData.bankName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Branch</label>
                <p className="text-primary">{facultyData.branch}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Account Number</label>
                <p className="text-primary">{facultyData.bankAccountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">IFSC Code</label>
                <p className="text-primary">{facultyData.ifsc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Bank Address</label>
                <p className="text-primary text-sm">{facultyData.bankAddr}</p>
              </div>
            </div>
          </div>

          {/* Government Documents */}
          <div className="bg-surface border border-border-theme rounded-lg p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faIdCard} className="text-accent" />
              Government Documents
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Aadhaar Number</label>
                <p className="text-primary">{facultyData.aadhaar}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">PAN Number</label>
                <p className="text-primary">{facultyData.pan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Teaching */}
        <div className="bg-surface border border-border-theme rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faChalkboardTeacher} className="text-accent" />
            Courses Currently Teaching
          </h2>
          {coursesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesData.map((course, index) => (
                <div key={course.id} className="border border-border-theme rounded-lg p-4 hover:shadow-md transition-shadow bg-background">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faBookOpen} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{course.courseName || `Course ${index + 1}`}</h3>
                      <p className="text-sm text-secondary">{course.courseCode || course.id}</p>
                    </div>
                  </div>
                  {course.description && (
                    <p className="text-sm text-secondary mb-2">{course.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {course.credits && (
                      <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded">
                        {course.credits} Credits
                      </span>
                    )}
                    {course.semester && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        Semester {course.semester}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faBookOpen} className="text-secondary text-4xl mb-4" />
              <p className="text-secondary">No courses assigned yet.</p>
            </div>
          )}
        </div>

        {/* System Information */}
        <div className="bg-surface border border-border-theme rounded-lg p-6">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-secondary" />
            System Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Status</label>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                facultyData.status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
              }`}>
                {facultyData.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Profile Complete</label>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                facultyData.profileComplete ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
              }`}>
                {facultyData.profileComplete ? 'Complete' : 'Incomplete'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Department Key</label>
              <p className="text-primary">{facultyData.departmentKey}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
  