import React, { useEffect, useState } from "react";

interface PlayerActionModalProps {
    player: any;
    onDraft: () => void;
    onExclude: () => void;
    onClose: () => void;
    isOpen: boolean;
}

export default function PlayerActionModal({
    player, 
    onDraft,
    onExclude,
    onClose,
    isOpen
}: PlayerActionModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(isOpen)
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    })

    if (!isOpen) return null;

    return (
      <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 border border-stone-900
                bg-[#F7F3E3] rounded-xl p-6 shadow-xl 
                transition-transform duration-300 ease-out
                ${visible ? "translate-y-60 opacity-100" : "-translate-y-96 opacity-0"}`}>
            <h2 className="text-xl text-center font-bold mb-4">{player.PLAYER_NAME}</h2>
            <div className="flex justify-between space-x-4">
                <button
                    onClick={onDraft}
                    className="cursor-pointer bg-teal-400 hover:bg-teal-500 text-stone-900 px-4 py-2 rounded"
                >
                    Draft
                </button>
                <button
                    onClick={onExclude}
                    className="cursor-pointer bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                >
                    Remove
                </button>
                <button
                    onClick={onClose}
                    className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-stone-900 px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
      </div>
    );
}