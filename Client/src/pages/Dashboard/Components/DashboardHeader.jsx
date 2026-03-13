// Client / src / pages / Dashboard / Components / DashboardHeader.jsx
import { Plus } from "lucide-react";

const DashboardHeader = ({ setShowModal, timeFrame, setTimeFrame }) => {
  return (
    <div className="bg-linear-to-r from-purple-500/10 to-violet-500/10 backdrop-blur-lg rounded-3xl p-6 mb-8 shadow-lg border border-white/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent">
            Finance Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your income and expenses</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-xl transition-all shadow hover:shadow-md font-medium"
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      <div className="flex justify-end mt-4">
        <div className="flex gap-0 bg-white p-1 -mx-5 rounded-xl border border-gray-200">
          {["daily", "weekly", "monthly"].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-2.5 py-2 text-sm rounded-lg transition-all ${
                timeFrame === frame
                  ? "bg-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
