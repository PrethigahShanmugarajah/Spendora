// Client / src / pages / Profile / Components / PersonalInfoCard.jsx
import { User } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { InputField } from "../../../components/FormField/InputField";

const PersonalInfoCard = ({
  user,
  tempUser,
  editMode,
  loading,
  onEdit,
  onInputChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold pb-3 text-gray-800 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          Personal Information
        </h2>

        {!editMode && (
          <button
            onClick={onEdit}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={18} color="#FFFFFF" />
              </div>
            ) : (
              <span>Edit</span>
            )}
          </button>
        )}
      </div>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <InputField
              label="Full Name"
              labelPosition="top"
              name="name"
              type="text"
              value={tempUser.name}
              onChange={onInputChange}
              disabled={loading}
              size="m"
              required
            />
          </div>

          <div>
            <InputField
              label="Email Address"
              labelPosition="top"
              name="email"
              type="email"
              value={tempUser.email}
              onChange={onInputChange}
              disabled={loading}
              size="m"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSave}
              className="flex-1 bg-linear-to-r from-purple-500 to-violet-600 text-white py-2.5 rounded-xl font-medium shadow-md"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <ClipLoader size={18} color="#FFFFFF" />
                </div>
              ) : (
                <span>Save Changes</span>
              )}
            </button>

            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500  block mb-1">Full Name</p>
            <p className="font-medium text-gray-800">{user?.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500  block mb-1">Email Address</p>
            <p className="font-medium text-gray-800">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoCard;
