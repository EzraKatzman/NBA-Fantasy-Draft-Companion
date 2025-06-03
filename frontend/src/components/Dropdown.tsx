import React, { useState, useRef, useEffect } from "react";
import ChevronDown from "../../public/icons/chevronDown";

interface DropdownProps {
  label?: React.ReactNode;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onSelectAction?: (value: string) => void | Promise<void>;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  onSelectAction,
  disabled,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
    onSelectAction?.(option);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="flex w-[300px] flex-col">
      {label && (
        <label className="mb-1 text-base font-semibold text-stone-900">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          type="button"
          onClick={() => {
            if (!disabled) setOpen((prev) => !prev);
          }}
          className={`relative flex h-12 w-full items-center justify-center rounded-2xl border px-4 text-center font-medium shadow-sm bg-amber-100 text-stone-700 ${
            disabled
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {value}
          <span className="pointer-events-none absolute right-3">
            <ChevronDown />
          </span>
        </button>

        {open && !disabled && (
          <ul
            role="listbox"
            className="absolute z-10 mt-2 w-full rounded-2xl border bg-amber-50 shadow-lg"
          >
            {options.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                onClick={() => handleSelect(option)}
                className="cursor-pointer rounded-2xl px-4 py-2 text-center text-stone-700 hover:bg-amber-100"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}