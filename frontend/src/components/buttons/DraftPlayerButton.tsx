import React from 'react';
import Draft from '../../../public/icons/addPlayer';

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
        className="transition-color cursor-pointer p-1 duration-150"
        onClick={onDraft}
      >
        <Draft />
      </button>
    </div>
  );
}
