import React, { useState, useRef, useEffect } from "react";
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
  goToPage,
}: PaginationProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showDropdown && dropdownRef.current && currentPageRef.current) {
      const dropdown = dropdownRef.current;
      const currentItem = currentPageRef.current;

      const dropdownHeight = dropdown.offsetHeight;
      const itemOffsetTop = currentItem.offsetTop;
      const itemHeight = currentItem.offsetHeight;

      // Center the selected page in the dropdown
      dropdown.scrollTop = itemOffsetTop - dropdownHeight / 2 + itemHeight / 2;
    }
  }, [showDropdown]);

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const navButtonClasses = (disabled: boolean) =>
    `px-2 py-1 rounded-lg border ${
      disabled
        ? "cursor-not-allowed border-stone-300 text-stone-400"
        : "cursor-pointer border-stone-400 text-stone-900 hover:bg-amber-100"
    }`;

  return (
    <div className="mt-4 flex items-center justify-center space-x-2 relative">
      {/* Prev */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={isFirst}
        className={navButtonClasses(isFirst)}
      >
        <ChevronLeft />
      </button>

      {/* Current Page / Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="px-4 py-1 rounded-lg border border-stone-400 text-stone-900 hover:bg-amber-100 cursor-pointer"
        >
          <span className="font-semibold">{String(currentPage).padStart(2, "0")}</span>
          <span className="text-stone-600"> / {totalPages}</span>
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            onMouseLeave={() => setShowDropdown(false)}
            className="absolute left-1/2 z-10 mt-2 w-48 max-h-60 -translate-x-1/2 overflow-y-auto rounded-xl border bg-amber-50 shadow"
          >
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNum = i + 1;
              return (
                <div
                  key={pageNum}
                  ref={pageNum === currentPage ? currentPageRef : null}
                  onClick={() => {
                    goToPage(pageNum);
                    setShowDropdown(false);
                  }}
                  className={`px-4 py-2 text-center cursor-pointer hover:bg-amber-100 ${
                    pageNum === currentPage ? "bg-amber-200 font-semibold" : ""
                  }`}
                >
                  {pageNum}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={isLast}
        className={navButtonClasses(isLast)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
