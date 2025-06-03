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
      <div className={`fixed left-1/2 top-0 z-50 transform -translate-x-1/2
            rounded-xl border border-stone-900 bg-stone-100 p-6 shadow-xl
            transition-transform duration-300 ease-out
            ${visible ? "translate-y-60 opacity-100" : "-translate-y-96 opacity-0"}`}>
            <h2 className="mb-4 text-center text-xl font-semibold">{player.PLAYER_NAME}</h2>
            <div className="flex justify-between space-x-4">
                <button
                    onClick={onDraft}
                    className="cursor-pointer rounded bg-lime-500 px-4 py-2 text-stone-900 hover:bg-lime-600"
                >
                    Draft
                </button>
                <button
                    onClick={onExclude}
                    className="cursor-pointer rounded bg-red-600 px-4 py-2 text-stone-900 hover:bg-red-700"
                >
                    Remove
                </button>
                <button
                    onClick={onClose}
                    className="cursor-pointer rounded bg-gray-300 px-4 py-2 text-stone-900 hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
      </div>
    );
}