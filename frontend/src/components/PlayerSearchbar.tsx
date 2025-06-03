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
    <div className="flex w-[616px] flex-col">
      <label
        htmlFor="player-search"
        className="mb-1 text-base font-semibold text-stone-900"
      >
        Player Search:
      </label>
      <input
        id="player-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-900 bg-amber-50 px-4 shadow-sm focus:placeholder:text-stone-900"
      />
    </div>
  );
}
