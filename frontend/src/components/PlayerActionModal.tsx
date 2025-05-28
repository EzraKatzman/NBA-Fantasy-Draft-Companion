import React, { useEffect, useState } from "react";

interface PlayerActionModalProps {
    player: any;
    onDraft: () => void;
    onExclude: () => void;
    onClose: () => void;
}

export default function PlayerActionModal({
    player, 
    onDraft,
    onExclude,
    onClose,
}: PlayerActionModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    return (
      <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 
                  bg-white rounded-xl p-6 shadow-xl 
                  transition-transform duration-300 ease-out
                  ${show ? "translate-y-20 opacity-100" : "-translate-y-96 opacity-0"}`}>
            <h2 className="text-xl font-bold mb-4">{player.PLAYER_NAME}</h2>
            <div className="flex justify-between space-x-4">
                <button
                    onClick={onDraft}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                    Draft
                </button>
                <button
                    onClick={onExclude}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Remove
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
      </div>
    );
}