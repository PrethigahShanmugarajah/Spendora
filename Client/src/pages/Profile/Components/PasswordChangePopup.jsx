import { Eye, EyeOff, X } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { InputField } from "../../../components/FormField/InputField";

const PasswordChangePopup = ({
  onClose,
  onSubmit,
  loading = false,
  passwordData,
  passwordErrors,
  showPassword,
  onPasswordChange,
  onTogglePassword,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-xl border border-gray-300 bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-black hover:text-gray-700 disabled:opacity-60"
        >
          <X size={20} />
        </button>

        <h4 className="mb-5 text-center text-lg font-semibold text-purple-600">
          Change Password
        </h4>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <InputField
              label="Current Password"
              labelPosition="top"
              name="current"
              type={showPassword.current ? "text" : "password"}
              value={passwordData.current}
              onChange={(_, e) => onPasswordChange(e)}
              placeholder="Enter current password"
              disabled={loading}
              size="s"
              required
              error={passwordErrors.current}
            />

            <button
              type="button"
              onClick={() => onTogglePassword("current")}
              disabled={loading}
              className="absolute top-8.5 right-0 pr-4 h-11 flex items-center text-gray-500 hover:text-gray-800"
            >
              {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <InputField
              label="New Password"
              labelPosition="top"
              name="new"
              type={showPassword.new ? "text" : "password"}
              value={passwordData.new}
              onChange={(_, e) => onPasswordChange(e)}
              placeholder="Enter new password"
              disabled={loading}
              size="s"
              required
              error={passwordErrors.new}
            />

            <button
              type="button"
              onClick={() => onTogglePassword("new")}
              disabled={loading}
              className="absolute top-8.5 right-0 pr-4 h-11 flex items-center text-gray-500 hover:text-gray-800"
            >
              {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <InputField
              label="Confirm New Password"
              labelPosition="top"
              name="confirm"
              type={showPassword.confirm ? "text" : "password"}
              value={passwordData.confirm}
              onChange={(_, e) => onPasswordChange(e)}
              placeholder="Confirm new password"
              disabled={loading}
              size="s"
              required
              error={passwordErrors.confirm}
            />

            <button
              type="button"
              onClick={() => onTogglePassword("confirm")}
              disabled={loading}
              className="absolute top-8.5 right-0 pr-4 h-11 flex items-center text-gray-500 hover:text-gray-800"
            >
              {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
            >
              {loading ? (
                <ClipLoader size={18} color="#FFFFFF" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangePopup;
