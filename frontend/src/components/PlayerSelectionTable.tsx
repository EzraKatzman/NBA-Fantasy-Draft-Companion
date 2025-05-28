"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PlayerActionModal from "./PlayerActionModal";
import { draftPlayer, excludePlayer, viewPlayers } from "@/api";

export default function PlayerSelectionTable() {
    const [playerData, setPlayerData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
    const rowsPerPage = 10;

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async() => {
        const players = await viewPlayers();
        setPlayerData(players);
    }

    const openModal = (player: any) => {
        setSelectedPlayer(player);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPlayer(null);
    };

    const handleDraft = async() => {
        if (!selectedPlayer) return;
        try {
            await draftPlayer(selectedPlayer.PLAYER_NAME);
            await fetchPlayers();
            // Add visual feedback for player drafted
            alert(`${selectedPlayer.PLAYER_NAME} drafted!`);
            closeModal();
        } catch (error) {
            console.error(error);
            alert("Failed to draft player");
        }
    };

    const handleExclude = async() => {
        if (!selectedPlayer) return;
        try {
            await excludePlayer(selectedPlayer.PLAYER_NAME);
            await fetchPlayers();
            alert(`${selectedPlayer.PLAYER_NAME} removed from pool!`);
            closeModal();
            // Optionally refresh player data here
        } catch (err) {
            console.error(err);
            alert("Failed to remove player.");
        } 
    }

    if (playerData.length === 0) return <div>Loading...</div>

    const totalPages = Math.ceil(playerData.length / rowsPerPage);
    const currentRows = playerData.slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage);

    const goToPage = (page: number) => {
        if (page < 1) page = 1;
        else if (page > totalPages) page = totalPages;
        setCurrentPage(page);
    };

    const columns = playerData.length > 0 ? Object.keys(playerData[0]) : [];

    return (
        <div className="w-full max-w-[1250px] mx-auto">
          <div className={`overflow-x-auto mt-4 border rounded-lg shadow ${modalOpen ? "opacity-50 pointer-events-none" : ""}`}>
            <table className="w-full table-fixed text-sm text-left">
              <thead className="bg-gray-100">
                <tr className="h-12 border-b bg-amber-500">
                    {columns.map((col, index) => (
                      <th
                        key={col}
                        className={`px-2 py-2 font-bold text-stone-900 uppercase tracking-wide ${
                            index === 0 ? 'w-[20%]' : 'w-[8%]'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, i) => (
                  <tr
                    key={`${row.playerName}-${i}`}
                    onClick={() => openModal(row)}
                    className={`h-12 hover:bg-teal-200 ${i % 2 === 1 ? "bg-[#F7F3E3]" : ""}`}
                  >
                    {columns.map((col) => (
                    <td key={col} className="px-2 truncate">
                      {row[col]}
                    </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Pagination Rendering */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
                onClick={() => goToPage(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                    currentPage === 1
                    ? "cursor-not-allowed text-gray-400 border-gray-300"
                    : "hover:bg-[#F7F3E3] text-black border-gray-400"
                }`}
            >
                Prev
            </button>

            {/* Always show first page */}
            <button
                onClick={() => goToPage(1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1 ? "bg-amber-500 text-stone-900" : "hover:bg-[#F7F3E3]"
                }`}
            >
                1
            </button>
            {/* Left ellipsis */}
            {currentPage > 3 && <span className="px-2">...</span>}

            {/* Pages around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                    (page) =>
                        page !== 1 &&
                        page !== totalPages &&
                        page >= currentPage - 2 &&
                        page <= currentPage + 2
                )
                .map((page) => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded border ${
                            page === currentPage
                              ? "bg-amber-500 text-stone-900"
                              : "hover:bg-[#F7F3E3]"
                        }`}
                    >
                        {page}
                    </button>
                ))}

            {/* Right ellipsis */}
            {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            
            {/* Always show last page */}
            {totalPages > 1 && (
                <button
                    onClick={() => goToPage(totalPages)}
                    className={`px-3 py-1 rounded border ${
                        currentPage === totalPages
                        ? "bg-amber-500 text-stone-900"
                        : "hover:bg-[#F7F3E3]"
                    }`}
                >
                    {totalPages}
                </button>
            )}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                    currentPage === totalPages
                    ? "cursor-not-allowed text-gray-400 border-gray-300"
                    : "hover:bg-[#F7F3E3] text-black border-gray-400"
                }`}
            >
                Next
            </button>
          </div>
          {modalOpen && selectedPlayer && (
            <PlayerActionModal
            player={selectedPlayer}
            onDraft={handleDraft}
            onExclude={handleExclude}
            onClose={closeModal}
          />
          )}
        </div>
    );
}