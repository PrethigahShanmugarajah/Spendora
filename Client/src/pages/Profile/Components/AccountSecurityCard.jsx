import { Lock } from "lucide-react";
import { ClipLoader } from "react-spinners";

const AccountSecurityCard = ({ loading, onOpenPasswordModal, onLogout }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold pb-3 text-gray-800 flex items-center">
        <Lock className="w-5 h-5 mr-2 text-purple-600" />
        Account Security
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
          <div>
            <p className="font-medium lg:text-sm text-gray-400">Password</p>
          </div>

          <button
            onClick={onOpenPasswordModal}
            className="text-purple-600 hover:text-purple-700 font-medium lg:text-sm"
            disabled={loading}
          >
            Change
          </button>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex-1 bg-linear-to-r from-purple-500 to-violet-600 text-white py-2.5 rounded-xl font-medium shadow-md mt-6 w-full hover:opacity-90 transition-opacity"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <ClipLoader size={18} color="#FFFFFF" />
          </div>
        ) : (
          <span>Logout</span>
        )}
      </button>
    </div>
  );
};

export default AccountSecurityCard;
