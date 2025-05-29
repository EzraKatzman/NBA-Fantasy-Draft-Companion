import React from "react";

interface PlayerSearchInputProps {
    value: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
}

export default function PlayerSearchInput({
    value,
    onChange,
    placeholder = "Type player name here...",
}: PlayerSearchInputProps) {
    return (
        <div className="flex flex-col w-[616px]">
            <label className="mb-1 text-base font-bold text-stone-900">Player Search:</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="px-4 h-12 bg-[#F7F3E3] border border-stone-900 rounded-2xl shadow-sm focus:placeholder:text-stone-900"
            />
        </div>
    );
}
