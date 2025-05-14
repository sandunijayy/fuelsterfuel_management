"use client"

import { X, FileText, Filter, Database } from "lucide-react"

const ReportModal = ({ onClose, onGenerateFiltered, onGenerateAll, filteredCount, totalCount, isGenerating }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Generate Reservation Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Generate a CSV report of reservation data that you can open in Excel or other spreadsheet software.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Report Options</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <Filter size={20} className="text-indigo-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Filtered Reservations</h4>
                  <p className="text-sm text-gray-500">
                    Export only the {filteredCount} reservation{filteredCount !== 1 ? "s" : ""} currently displayed in
                    your filtered view.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <Database size={20} className="text-indigo-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">All Reservations</h4>
                  <p className="text-sm text-gray-500">
                    Export all {totalCount} reservation{totalCount !== 1 ? "s" : ""} in the system, regardless of
                    filters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The report will include customer details, reservation information, status, and payment details.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onGenerateFiltered}
            disabled={isGenerating || filteredCount === 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : `Export Filtered (${filteredCount})`}
          </button>
          <button
            onClick={onGenerateAll}
            disabled={isGenerating || totalCount === 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : `Export All (${totalCount})`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
