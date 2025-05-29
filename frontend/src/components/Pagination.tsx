import React, { useState } from "react";
import ChevronRight from "../../public/icons/chevronRight";
import ChevronLeft from "../../public/icons/chevronLeft";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

export default function Pagination({
    currentPage, 
    totalPages, 
    goToPage
}: PaginationProps) {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);
    const closeDropdown = () => setShowDropdown(false);

    return (
        <div className="relative flex justify-center items-center mt-4 space-x-2">
            {/* Prev button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded-lg border ${
                currentPage === 1
                  ? "cursor-not-allowed text-gray-400 border-gray-300"
                  : "cursor-pointer hover:bg-teal-200 text-stone-900 border-gray-400"
              }`}
            >
              <ChevronLeft/>
            </button>
            {/* Current Page Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="px-4 py-1 cursor-pointer border border-gray-400 rounded-lg hover:bg-teal-200 text-stone-900"
              >
                {String(currentPage).padStart(2, '0')} / <span className="text-gray-600">{totalPages}</span>
              </button>
                {showDropdown && (
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 max-h-60 overflow-y-auto border rounded-xl bg-[#F7F3E3] shadow z-10"
                  onMouseLeave={closeDropdown}
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <div
                      key={i + 1}
                      onClick={() => {
                        goToPage(i + 1);
                        closeDropdown();
                      }}
                      className={`px-4 py-2 cursor-pointer text-center hover:bg-teal-100 ${
                        i + 1 === currentPage ? "bg-teal-200 font-semibold" : ""
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
                       {/* Next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded-lg border ${
                currentPage === totalPages
                  ? "cursor-not-allowed text-gray-400 border-gray-300"
                  : "cursor-pointer hover:bg-teal-200 text-stone-900 border-gray-400"
              }`}
            >
              <ChevronRight/>
            </button>
        </div>
    )
}