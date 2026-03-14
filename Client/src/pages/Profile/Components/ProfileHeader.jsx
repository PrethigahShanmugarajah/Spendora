import { User } from "lucide-react";
import { PulseLoader } from "react-spinners";

const ProfileHeader = ({ user }) => {
  return (
    <div className="bg-linear-to-r from-purple-500 to-violet-600 p-8 text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4">
        <User className="w-12 h-12 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-white">
        {user?.name || <PulseLoader size={8} color="#FFFFFF" />}
      </h1>
      <p className="text-purple-100 mt-2">
        {user?.email || <PulseLoader size={6} color="#FFFFFF" />}
      </p>
    </div>
  );
};

export default ProfileHeader;
