import React from "react";
import Draft from "../../../public/icons/addPlayer";

interface DraftPlayerButtonProps {
    onDraft: () => void;
    ariaLabel?: string;
    title?: string;
}

export default function DraftPlayerButton({
    onDraft,
    ariaLabel,
    title,
}: DraftPlayerButtonProps) {
    return (
        <div>
            <button
                type="button"
                aria-label={ariaLabel}
                title={title}
                className="cursor-pointer duration-150 p-1 transition-color"
                onClick={onDraft}
            >
                <Draft/>
            </button>
        </div>
    );
}
