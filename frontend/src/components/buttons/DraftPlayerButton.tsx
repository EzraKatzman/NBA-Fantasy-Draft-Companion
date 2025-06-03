import React from "react";
import Draft from "../../../public/icons/addPlayer";

interface DraftPlayerButtonProps {
    onDraft: () => void;
}

export default function DraftPlayerButton({
    onDraft,
}: DraftPlayerButtonProps) {
    return (
        <div>
            <button
                type="button"
                aria-label="Draft Player"
                className="cursor-pointer duration-150 p-1 transition-color"
                onClick={onDraft}
            >
                <Draft/>
            </button>
        </div>
    );
}
