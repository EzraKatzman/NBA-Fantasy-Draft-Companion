import React from 'react';
import Trash from '../../../public/icons/trash';

interface RemovePlayerButtonProps {
  onExclude: () => void;
  ariaLabel?: string;
  title?: string;
}

export default function RemovePlayerButton({
  onExclude,
  ariaLabel,
  title,
}: RemovePlayerButtonProps) {
  return (
    <div>
      <button
        type="button"
        aria-label={ariaLabel}
        title={title}
        className="cursor-pointer p-1 transition-colors duration-150"
        onClick={onExclude}
      >
        <Trash />
      </button>
    </div>
  );
}
