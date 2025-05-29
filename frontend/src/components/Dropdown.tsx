import React, { useState, useRef, useEffect } from "react";
import ChevronDown from "../../public/icons/chevronDown";

interface DropdownProps{
    label?: React.ReactNode;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    onSelectClick?: (value: string) => void | Promise<void>;
}

export default function Dropdown({ label, options, value, onChange, onSelectClick }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const dropdownref = useRef<HTMLDivElement>(null);
    
    const handleSelect = (option: string): void => {
      onChange(option);
      setOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownref.current && !dropdownref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, []);

    return (
        <div className="flex flex-col w-[300px]" ref={dropdownref}>
            {label && <label className="mb-1 text-base font-bold text-stone-900">{label}</label>}
            <div className="relative w-full">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full h-12 px-4 cursor-pointer text-center font-bold border bg-teal-200 rounded-2xl shadow-sm flex items-center justify-center relative"
                >
                {value}
                    <span className="absolute right-3 pointer-events-none">
                        <ChevronDown/>
                    </span>
                </button>

                {open && (
                    <div className="absolute z-10 w-full mt-2 bg-teal-100 border rounded-2xl shadow-lg">
                        {options.map((option: string) => 
                        <div
                            key={option}
                            onClick={() => {
                                handleSelect(option);
                                onSelectClick?.(option);
                            }}
                            className="px-4 py-2 text-center cursor-pointer hover:bg-teal-200 rounded-2xl"
                        >
                            {option}
                        </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
