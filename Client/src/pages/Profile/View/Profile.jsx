import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordChangePopup from "../Components/PasswordChangePopup";
import {
  getInitialPasswordData,
  getInitialShowPassword,
  getUpdatedProfileUser,
  validatePasswordData,
} from "../../../utils/profileUtils";
import {
  changePasswordApi,
  fetchProfileApi,
  updateProfileApi,
} from "../Service/ProfileService";
import ProfileHeader from "../Components/ProfileHeader";
import PersonalInfoCard from "../Components/PersonalInfoCard";
import AccountSecurityCard from "../Components/AccountSecurityCard";

const Profile = ({ onUpdateProfile, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    joinDate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState(getInitialPasswordData());
  const [showPassword, setShowPassword] = useState(getInitialShowPassword());
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setProfileLoading(true);
      try {
        const data = await fetchProfileApi();
        if (data) {
          setUser(data);
          setTempUser(data);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleInputChange = useCallback((value, e) => {
    const { name } = e.target;
    setTempUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const togglePasswordVisibility = useCallback((field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const data = await updateProfileApi(tempUser);
      if (data) {
        const updatedUser = getUpdatedProfileUser(data);
        setUser(updatedUser);
        setTempUser(updatedUser);
        setEditMode(false);
        onUpdateProfile?.(updatedUser);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = useCallback(() => {
    setTempUser(user);
    setEditMode(false);
  }, [user]);

  const validatePassword = useCallback(() => {
    const errors = validatePasswordData(passwordData);
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }, [passwordData]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setPasswordLoading(true);
    try {
      await changePasswordApi(passwordData);
      setShowPasswordModal(false);
      setPasswordData(getInitialPasswordData());
      setPasswordErrors({});
      setShowPassword(getInitialShowPassword());
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    onLogout?.();
    navigate("/signup");
  }, [onLogout, navigate]);

  const closePasswordModal = useCallback(() => {
    if (!passwordLoading) {
      setShowPasswordModal(false);
      setPasswordData(getInitialPasswordData());
      setPasswordErrors({});
      setShowPassword(getInitialShowPassword());
    }
  }, [passwordLoading]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white -mx-7 rounded-2xl shadow-sm overflow-hidden">
        <ProfileHeader user={user} />

        <div className="p-8 -mx-6.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PersonalInfoCard
              user={user}
              tempUser={tempUser}
              editMode={editMode}
              loading={profileLoading || saveLoading}
              onEdit={() => setEditMode(true)}
              onInputChange={handleInputChange}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
            />

            <AccountSecurityCard
              loading={false}
              onOpenPasswordModal={() => setShowPasswordModal(true)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangePopup
          onClose={closePasswordModal}
          onSubmit={handlePasswordSubmit}
          loading={passwordLoading}
          passwordData={passwordData}
          passwordErrors={passwordErrors}
          showPassword={showPassword}
          onPasswordChange={handlePasswordChange}
          onTogglePassword={togglePasswordVisibility}
        />
      )}
    </div>
  );
};

export default Profile;
