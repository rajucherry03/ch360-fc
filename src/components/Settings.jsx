import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faUser, 
  faBell, 
  faShieldAlt, 
  faPalette, 
  faLanguage, 
  faDownload, 
  faUpload, 
  faTrash, 
  faSave, 
  faEye, 
  faEyeSlash, 
  faCheckCircle, 
  faExclamationTriangle, 
  faMoon, 
  faSun, 
  faDesktop, 
  faMobile, 
  faTablet, 
  faGlobe, 
  faLock, 
  faUnlock, 
  faKey, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faGraduationCap, 
  faUniversity, 
  faCalendarAlt, 
  faClock,
  faEdit,
  faCamera,
  faImage,
  faFileAlt,
  faDatabase,
  faCloud,
  faSync,
  faHistory,
  faArchive,
  faSignOutAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { auth, db } from "../firebase";
import { onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    profile: {
      displayName: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      officeLocation: '',
      profilePicture: null
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: true,
        showPhone: false
      }
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    }
  });

  // Fetch user data and settings from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
          }

          setUser(user);

          // Fetch user settings from Firestore
          const userSettingsRef = doc(db, 'userSettings', user.uid);
          const userSettingsDoc = await getDoc(userSettingsRef);

          if (userSettingsDoc.exists()) {
            // Load existing settings
            const existingSettings = userSettingsDoc.data();
            setSettings(prev => ({
              ...prev,
              ...existingSettings,
              profile: {
                ...prev.profile,
                ...existingSettings.profile,
                displayName: existingSettings.profile?.displayName || user.displayName || 'Faculty Member',
                email: existingSettings.profile?.email || user.email || 'faculty@university.edu',
              }
            }));
          } else {
            // Create default settings for new user
            const defaultSettings = {
              profile: {
                displayName: user.displayName || 'Faculty Member',
                email: user.email || 'faculty@university.edu',
                phone: '+1 (555) 123-4567',
                department: 'Computer Science & Engineering',
                designation: 'Assistant Professor',
                officeLocation: 'Room 205, Block A',
                profilePicture: null
              },
              preferences: {
                theme: 'light',
                language: 'en',
                notifications: {
                  email: true,
                  push: true,
                  sms: false
                },
                privacy: {
                  profileVisibility: 'public',
                  showEmail: true,
                  showPhone: false
                }
              },
              security: {
                twoFactorAuth: false,
                sessionTimeout: 30,
                passwordExpiry: 90
              }
            };

            // Save default settings to Firestore
            await setDoc(userSettingsRef, defaultSettings);
            setSettings(defaultSettings);
          }

          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError(err.message || "Error fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section, subsection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) {
      toast.error('No user logged in');
      return;
    }

    try {
      setSaving(true);
      
      // Update settings in Firestore
      const userSettingsRef = doc(db, 'userSettings', user.uid);
      await updateDoc(userSettingsRef, settings);

      // Update user profile in Firebase Auth if display name changed
      if (settings.profile.displayName !== user.displayName) {
        await user.updateProfile({
          displayName: settings.profile.displayName
        });
      }

      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user) {
      toast.error('No user logged in');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // Change password
      await updatePassword(user, passwordData.newPassword);

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else if (err.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!user) {
      toast.error('No user logged in');
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setSaving(true);

      // Upload image to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update settings with new profile picture URL
      const updatedSettings = {
        ...settings,
        profile: {
          ...settings.profile,
          profilePicture: downloadURL
        }
      };

      setSettings(updatedSettings);

      // Save to Firestore
      const userSettingsRef = doc(db, 'userSettings', user.uid);
      await updateDoc(userSettingsRef, {
        'profile.profilePicture': downloadURL
      });

      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (theme) => {
    try {
      handleInputChange('preferences', 'theme', theme);
      
      // Apply theme immediately
      document.documentElement.classList.remove('light', 'dark');
      if (theme === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.classList.add(theme);
      }

      // Save to database
      if (user) {
        const userSettingsRef = doc(db, 'userSettings', user.uid);
        await updateDoc(userSettingsRef, {
          'preferences.theme': theme
        });
      }
    } catch (err) {
      console.error('Error updating theme:', err);
      toast.error('Failed to update theme');
    }
  };

  const handleLanguageChange = async (language) => {
    try {
      handleInputChange('preferences', 'language', language);
      
      // Save to database
      if (user) {
        const userSettingsRef = doc(db, 'userSettings', user.uid);
        await updateDoc(userSettingsRef, {
          'preferences.language': language
        });
      }
      
      toast.success('Language updated successfully!');
    } catch (err) {
      console.error('Error updating language:', err);
      toast.error('Failed to update language');
    }
  };

  const handleNotificationToggle = async (type, value) => {
    try {
      handleNestedChange('preferences', 'notifications', type, value);
      
      // Save to database
      if (user) {
        const userSettingsRef = doc(db, 'userSettings', user.uid);
        await updateDoc(userSettingsRef, {
          [`preferences.notifications.${type}`]: value
        });
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error('Error updating notifications:', err);
      toast.error('Failed to update notification settings');
    }
  };

  const handlePrivacyToggle = async (field, value) => {
    try {
      handleNestedChange('preferences', 'privacy', field, value);
      
      // Save to database
      if (user) {
        const userSettingsRef = doc(db, 'userSettings', user.uid);
        await updateDoc(userSettingsRef, {
          [`preferences.privacy.${field}`]: value
        });
      }
      
      toast.success('Privacy settings updated');
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      toast.error('Failed to update privacy settings');
    }
  };

  const handleSecurityToggle = async (field, value) => {
    try {
      handleInputChange('security', field, value);
      
      // Save to database
      if (user) {
        const userSettingsRef = doc(db, 'userSettings', user.uid);
        await updateDoc(userSettingsRef, {
          [`security.${field}`]: value
        });
      }
      
      if (field === 'twoFactorAuth') {
        toast.success(`Two-factor authentication ${value ? 'enabled' : 'disabled'}`);
      }
    } catch (err) {
      console.error('Error updating security settings:', err);
      toast.error('Failed to update security settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 animate-fade-in">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 animate-fade-in">
                <div className="space-y-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 dark:text-red-400 text-6xl mb-4 animate-bounce" />
          <div className="text-gray-950 dark:text-white text-xl font-bold">{error}</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: faUser },
    { id: 'preferences', name: 'Preferences', icon: faPalette },
    { id: 'security', name: 'Security', icon: faShieldAlt },
    { id: 'notifications', name: 'Notifications', icon: faBell }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCog} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-950 dark:text-white">
                  Settings
                </h1>
                <p className="text-gray-800 dark:text-gray-200 text-sm">Manage your account preferences and settings</p>
              </div>
            </div>
            <Link 
              to="/home"
              className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faHome} />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">Profile Settings</h2>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                        {settings.profile.profilePicture ? (
                          <img 
                            src={settings.profile.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg">
                        <FontAwesomeIcon icon={faCamera} className="text-white text-sm" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                          disabled={saving}
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-950 dark:text-white">Profile Picture</h3>
                      <p className="text-gray-800 dark:text-gray-200 text-xs">Upload a new profile picture</p>
                      {saving && <p className="text-blue-600 dark:text-blue-400 text-xs">Uploading...</p>}
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Display Name</label>
                      <input
                        type="text"
                        value={settings.profile.displayName}
                        onChange={(e) => handleInputChange('profile', 'displayName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your display name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Email Address</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Phone Number</label>
                      <input
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Department</label>
                      <input
                        type="text"
                        value={settings.profile.department}
                        onChange={(e) => handleInputChange('profile', 'department', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your department"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Designation</label>
                      <input
                        type="text"
                        value={settings.profile.designation}
                        onChange={(e) => handleInputChange('profile', 'designation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your designation"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Office Location</label>
                      <input
                        type="text"
                        value={settings.profile.officeLocation}
                        onChange={(e) => handleInputChange('profile', 'officeLocation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your office location"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={faPalette} className="text-white text-sm" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">Preferences</h2>
                  </div>

                  {/* Theme Settings */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">Theme Settings</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { id: 'light', name: 'Light', icon: faSun, color: 'from-yellow-500 to-orange-500' },
                        { id: 'dark', name: 'Dark', icon: faMoon, color: 'from-gray-600 to-gray-800' },
                        { id: 'auto', name: 'Auto', icon: faDesktop, color: 'from-blue-500 to-purple-500' }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className={`p-4 rounded-xl border text-sm transition-all duration-300 hover:shadow-md ${
                            settings.preferences.theme === theme.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-gray-200 dark:border-gray-600 hover:border-primary'
                          }`}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${theme.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                            <FontAwesomeIcon icon={theme.icon} className="text-white text-xl" />
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-gray-950 dark:text-white">{theme.name}</div>
                            {settings.preferences.theme === theme.id && (
                              <FontAwesomeIcon icon={faCheckCircle} className="text-primary mt-1" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Settings */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">Language Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        { id: 'en', name: 'English', flag: '🇺🇸' },
                        { id: 'es', name: 'Spanish', flag: '🇪🇸' },
                        { id: 'fr', name: 'French', flag: '🇫🇷' },
                        { id: 'de', name: 'German', flag: '🇩🇪' }
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => handleLanguageChange(lang.id)}
                          className={`p-4 rounded-xl border text-sm transition-all duration-300 hover:shadow-md ${
                            settings.preferences.language === lang.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-gray-200 dark:border-gray-600 hover:border-primary'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-bold text-gray-950 dark:text-white">{lang.name}</span>
                            {settings.preferences.language === lang.id && (
                              <FontAwesomeIcon icon={faCheckCircle} className="text-primary ml-auto" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Profile Visibility</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Control who can see your profile</div>
                        </div>
                        <select
                          value={settings.preferences.privacy.profileVisibility}
                          onChange={(e) => handlePrivacyToggle('profileVisibility', e.target.value)}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="faculty">Faculty Only</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Show Email Address</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Display email in your profile</div>
                        </div>
                        <button
                          onClick={() => handlePrivacyToggle('showEmail', !settings.preferences.privacy.showEmail)}
                          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                            settings.preferences.privacy.showEmail ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            settings.preferences.privacy.showEmail ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Show Phone Number</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Display phone in your profile</div>
                        </div>
                        <button
                          onClick={() => handlePrivacyToggle('showPhone', !settings.preferences.privacy.showPhone)}
                          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                            settings.preferences.privacy.showPhone ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            settings.preferences.privacy.showPhone ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-white text-sm" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">Security Settings</h2>
                  </div>

                  {/* Password Settings */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">Password Settings</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                            className="w-full px-4 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                            placeholder="Enter current password"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
                          >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <button 
                        onClick={handleChangePassword}
                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                        className="px-6 py-3 bg-primary hover:bg-secondary text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faKey} />
                        {saving ? 'Changing Password...' : 'Change Password'}
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-950 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-800 dark:text-gray-200">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => handleSecurityToggle('twoFactorAuth', !settings.security.twoFactorAuth)}
                        className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                          settings.security.twoFactorAuth ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                          settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Session Settings */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">Session Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Session Timeout</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Auto-logout after inactivity</div>
                        </div>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSecurityToggle('sessionTimeout', parseInt(e.target.value))}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Password Expiry</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Days until password expires</div>
                        </div>
                        <select
                          value={settings.security.passwordExpiry}
                          onChange={(e) => handleSecurityToggle('passwordExpiry', parseInt(e.target.value))}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        >
                          <option value={30}>30 days</option>
                          <option value={60}>60 days</option>
                          <option value={90}>90 days</option>
                          <option value={180}>180 days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={faBell} className="text-white text-sm" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-950 dark:text-white">Notification Settings</h2>
                  </div>

                  {/* Notification Channels */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl">
                    <h3 className="text-sm font-bold text-gray-950 dark:text-white mb-4">Notification Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Email Notifications</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Receive notifications via email</div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle('email', !settings.preferences.notifications.email)}
                          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                            settings.preferences.notifications.email ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            settings.preferences.notifications.email ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">Push Notifications</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Receive push notifications</div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle('push', !settings.preferences.notifications.push)}
                          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                            settings.preferences.notifications.push ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            settings.preferences.notifications.push ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-950 dark:text-white">SMS Notifications</div>
                          <div className="text-sm text-gray-800 dark:text-gray-200">Receive SMS notifications</div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle('sms', !settings.preferences.notifications.sms)}
                          className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                            settings.preferences.notifications.sms ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            settings.preferences.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={saving ? faSync : faSave} className={saving ? 'animate-spin' : ''} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;


