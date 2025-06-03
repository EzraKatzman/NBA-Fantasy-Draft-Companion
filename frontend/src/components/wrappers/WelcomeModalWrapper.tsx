'use client';

import { useEffect, useState } from 'react';
import WelcomeModal from '../modals/WelcomeModal';

const STORAGE_KEY = 'hasSeenTutorial';

export default function WelcomeModalWrapper() {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setShowModal(true);
    }
  }, []);

  const handleClose = (dontShowAgain: boolean) => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setShowModal(false);
  };

  if (!showModal) return null;

  return <WelcomeModal onClose={handleClose} />;
}
