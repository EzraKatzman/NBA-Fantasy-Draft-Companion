import React, { useState } from "react";

interface WelcomeModalProps {
  onClose: (dontShowAgain: boolean) => void;
}

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const tutorialContent = [
    {
      title: "Welcome to the Draft Board!",
      content:
        "Browse all NBA players and their fantasy stats. Use column sorting and the search bar to quickly find players.",
    },
    {
      title: "What is PAA?",
      content:
        "The PAA (Points Above Average) score shows how much better a player performs compared to the league average.",
    },
    {
      title: "Pick Your Draft Strategy",
      content:
        "Your draft strategy affects how PAA is calculated. Each strategy weighs stats differently, tailoring rankings to your approach.",
    },
    {
      title: "Manage Your Team",
      content:
        'Click the player icon next to a player to add them to your team. Click the trash icon next to a player to delete them from the list.',
    },
    {
      title: "View Your Team",
      content:
        'Click the "My Team" tab to view the players drafted to your team. Return to the draft board by pressing the "All Players" tab.',
    },
  ];

  const changePage = (forward: boolean) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + (forward ? 1 : -1));
      setFade(true);
    }, 200);
  };

  const handleNext = () => {
    if (currentIndex < tutorialContent.length - 1) changePage(true);
    else onClose(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) changePage(false);
  };

  const { title, content } = tutorialContent[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-md rounded-lg bg-white px-6 py-5 shadow-xl">
        <div
          className={`transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="mb-5 text-xl font-semibold text-stone-900">{title}</h2>
          <p className="mb-6 text-regular text-stone-800">{content}</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-18 rounded px-4 py-2 ${
              currentIndex === 0
                ? "cursor-not-allowed bg-stone-200 text-stone-400"
                : "bg-amber-500 text-stone-900 hover:bg-amber-600"
            }`}
          >
            Back
          </button>

          <div className="flex flex-1 items-center justify-center space-x-1">
            {tutorialContent.map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-colors duration-300 ${
                  i === currentIndex ? "bg-amber-500" : "bg-stone-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-18 rounded bg-amber-500 px-4 py-2 text-stone-900 hover:bg-amber-600"
          >
            {currentIndex === tutorialContent.length - 1 ? "Done" : "Next"}
          </button>
        </div>

        <button
          onClick={() => onClose(false)}
          className="absolute right-5 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl text-stone-400 duration-200 hover:bg-stone-100 hover:text-black"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
