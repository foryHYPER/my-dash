import List02 from "@/components/layout/list-02"
import { ArrowRight, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { CSCSBanner } from "@/components/dashboard/cscs-banner"

export default function Content() {
  return (
    <div className="space-y-4">
      <CSCSBanner />

      {/* Portfolio and Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700">
          <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Portfolio Value</h2>
          <div className="text-2xl font-bold mb-4">****</div>
          <button className="text-sm text-gray-900 dark:text-white flex items-center gap-2 transition-all duration-200 hover:gap-3">
            View portfolio
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700">
          <h2 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Wallet Value</h2>
          <div className="text-2xl font-bold mb-4">****</div>
          <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-md active:scale-95">
            <Plus className="w-4 h-4" />
            Fund wallet
          </button>
        </div>
      </div>

      {/* Biggest Daily Movers */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Biggest daily movers</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stocks that have gained or lost the most in the last 24 hours
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <List02 />
      </div>
    </div>
  )
}

