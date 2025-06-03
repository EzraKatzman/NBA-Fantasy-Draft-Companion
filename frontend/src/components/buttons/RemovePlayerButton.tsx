import React from "react";
import Trash from "../../../public/icons/trash";

interface RemovePlayerButtonProps {
    onExclude: () => void;
}

export default function RemovePlayerButton({
    onExclude,
}: RemovePlayerButtonProps) {
    return (
        <div>
            <button
                type="button"
                aria-label="Exclude Player"
                className="cursor-pointer duration-150 p-1 transition-colors"
                onClick={onExclude}
            >
                <Trash/>
            </button>
        </div>
    );
}
