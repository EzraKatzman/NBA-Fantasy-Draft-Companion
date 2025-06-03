"use client";

import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import InfoIcon from "../../public/icons/info_icon";
import PlayerSearchInput from "./PlayerSearchbar";
import Pagination from "./Pagination";
import DraftPlayerButton from "./buttons/DraftPlayerButton";
import RemovePlayerButton from "./buttons/RemovePlayerButton";
import { draftPlayer, excludePlayer, viewPlayers, updateStrategy } from "@/api";

export default function PlayerSelectionTable() {
    const [playerData, setPlayerData] = useState<any[]>([]);
    const [hiddenPlayers, setHiddenPlayers] = useState<Set<string>>(new Set());

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [searchTerm, setSearchTerm] = useState("");

    const filterOptions = ["All Positions", "G", "F", "C", "G/F", "F/C"];
    const [selectedFilterOption, setSelectedFilterOption] = useState(filterOptions[0]);

    const strategyOptions = ["Balanced", "Ignore FG% FT%", "Ignore Turnovers", "Big Heavy", "Guard Heavy"]
    const STRATEGY_LABEL_TO_KEY: Record<string, string> = {
      "Balanced": "balanced",
      "Ignore FG% FT%": "punt_fg",
      "Ignore Turnovers": "punt_tov",
      "Big Heavy": "big_man_focus",
      "Guard Heavy": "guard_focus",
    };
    const [selectedStrategyOption, setSelectedStrategyOption] = useState(strategyOptions[0]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async() => {
        const players = await viewPlayers();
        setPlayerData(players);
    }

    const handleDraft = async(selectedPlayer: any) => {
        if (!selectedPlayer) return;
        try {
            await draftPlayer(selectedPlayer.PLAYER_NAME);
            setHiddenPlayers(prev => new Set(prev).add(selectedPlayer.PLAYER_NAME));
            // await fetchPlayers();
            // Add visual feedback for player drafted
            alert(`${selectedPlayer.PLAYER_NAME} drafted!`);
        } catch (error) {
            console.error(error);
            alert("Failed to draft player");
        }
    };

    const handleExclude = async(selectedPlayer: any) => {
        if (!selectedPlayer) return;
        try {
            await excludePlayer(selectedPlayer.PLAYER_NAME);
            setHiddenPlayers(prev => new Set(prev).add(selectedPlayer.PLAYER_NAME));
            // await fetchPlayers();
            alert(`${selectedPlayer.PLAYER_NAME} removed from pool!`);
        } catch (err) {
            console.error(err);
            alert("Failed to remove player.");
        } 
    }

    const handleStrategyChange = async(strategyLabel: string) => {
        const strategyKey = STRATEGY_LABEL_TO_KEY[strategyLabel] ?? strategyLabel.toLowerCase();
        try {
          const response = await updateStrategy(strategyKey);
          if (response.players) {
            setPlayerData(response.players);
            setCurrentPage(1);
          } else {
            await fetchPlayers();
          }
        } catch (err) {
          console.error(err);
        }
    }

    const filteredPlayerData = playerData
      .filter(player => player.PLAYER_NAME.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(player => !hiddenPlayers.has(player.PLAYER_NAME));

    if (playerData.length === 0) return <div>Loading...</div>

    const totalPages = Math.ceil(playerData.length / rowsPerPage);
    const currentRows = filteredPlayerData.slice((currentPage - 1) * rowsPerPage, (currentPage - 1) * rowsPerPage + rowsPerPage);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const columns = playerData.length > 0 ? Object.keys(playerData[0]) : [];

    return (
        <div className="w-full max-w-[1250px] mx-auto">
          <div className="flex flex-row gap-4">
            <PlayerSearchInput
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
            />
            <Dropdown
              label="Filter by Position:"
              options={filterOptions}
              value={selectedFilterOption}
              onChange={setSelectedFilterOption}
            />
            <Dropdown
              label={
                <span className="flex items-center gap-1">
                  <div className="relative group -ml-1.5">
                    <InfoIcon className="cursor-pointer"/>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap rounded bg-amber-500 px-2 py-1 text-xs text-stone-900 shadow-lg z-10">
                      The draft strategy will determine how each stat is weighed when calculating the PAA score 
                    </div>
                  </div>
                  Draft Strategy:
                </span>
              }
              options={strategyOptions}
              value={selectedStrategyOption}
              onChange={setSelectedStrategyOption}
              onSelectAction={(selectedStrategyOption) => {
                handleStrategyChange(selectedStrategyOption)
              }}
            />
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border shadow">
            <table className="w-full table-fixed text-sm text-left">
              <thead className="bg-stone-100">
                <tr className="h-12 border-b bg-amber-500">
                    {columns.map((col, index) => (
                      <th
                        key={col}
                        className={`px-2 py-2 font-semibold uppercase tracking-wide text-stone-900 ${
                            index === 0 ? 'w-[20%]' : 'w-[7.3%]'
                        }`}
                      >
                        {col === "PLAYER_NAME" ? "Player Name" : col}
                      </th>
                    ))}
                    <th className="px-2 py-2 font-semibold uppercase tracking-wide text-stone-900 text-center w-[7%]">
                      Actions
                    </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, i) => (
                  <tr
                    key={`${row.PLAYER_NAME}-${i}`}
                    className={`h-12 ${i % 2 === 1 ? "bg-amber-100" : "bg-amber-50"}`}
                  >
                    {columns.map((col) => (
                    <td key={col} className="px-2 truncate">
                      {col === "PAA" && typeof row[col] === "number"
                      ? row[col].toFixed(2)
                      : row[col]}
                    </td>
                    ))}
                    <td className="px-2">
                    <div className="flex gap-1">
                      <DraftPlayerButton onDraft={() => handleDraft(row)}/>
                      <RemovePlayerButton onExclude={() => handleExclude(row)}/>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Pagination Rendering */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        </div>
    );
}