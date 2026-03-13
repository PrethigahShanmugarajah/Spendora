// Client / src / pages / Income / Components / IncomeHeader.jsx
import { Plus } from "lucide-react";
import TimeFrame from "../../../components/TimeFrame";
import { ClipLoader } from "react-spinners";

const IncomeHeader = ({ setShowModal, loading, timeFrame, setTimeFrame }) => {
  return (
    <div className="bg-white rounded-lg md:rounded-xl p-4 -mx-7 lg:-mx-7 overflow-x-hidden md:p-6 mb-6 md:mb-8 shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
            Income Overview
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Track and manage your income sources
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm md:text-base"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <ClipLoader size={18} color="#FFFFFF" />
            </div>
          ) : (
            <>
              <Plus size={18} className="md:size-5" />
              <span>Add Income</span>
            </>
          )}
        </button>
      </div>

      <div className="flex px-10 -mx-14 justify-center lg:mx-0 md:mx-0 lg:justify-end md:justify-end mt-4">
        <TimeFrame
          timeFrame={timeFrame}
          setTimeFrame={setTimeFrame}
          options={["daily", "weekly", "monthly", "yearly"]}
          color="purple"
        />
      </div>
    </div>
  );
};

export default IncomeHeader;
