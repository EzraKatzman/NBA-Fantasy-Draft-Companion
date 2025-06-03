'use client';

import React, { useEffect, useState } from 'react';
import Dropdown from '../dropdowns/Dropdown';
import InfoIcon from '../../../public/icons/infoIcon';
import PlayerSearchInput from '../searchBar/PlayerSearchbar';
import Pagination from '../miscellaneous/Pagination';
import DraftPlayerButton from '../buttons/DraftPlayerButton';
import RemovePlayerButton from '../buttons/RemovePlayerButton';
import DraftedPlayersTable from './DraftedPlayersTable';
import { draftPlayer, excludePlayer, viewPlayers, updateStrategy } from '@/api';

export default function PlayerSelectionTable() {
  const [playerData, setPlayerData] = useState<any[]>([]);
  const [draftedPlayersSet, setDraftedPlayersSet] = useState<Set<string>>(
    new Set()
  );
  const [excludedPlayersSet, setExcludedPlayersSet] = useState<Set<string>>(
    new Set()
  );

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');

  const filterOptions = ['All Positions', 'G', 'F', 'C', 'G/F', 'F/C'];
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    filterOptions[0]
  );

  const strategyOptions = [
    'Balanced',
    'Ignore FG% FT%',
    'Ignore Turnovers',
    'Big Heavy',
    'Guard Heavy',
  ];
  const STRATEGY_LABEL_TO_KEY: Record<string, string> = {
    Balanced: 'balanced',
    'Ignore FG% FT%': 'punt_fg',
    'Ignore Turnovers': 'punt_tov',
    'Big Heavy': 'big_man_focus',
    'Guard Heavy': 'guard_focus',
  };
  const [selectedStrategyOption, setSelectedStrategyOption] = useState(
    strategyOptions[0]
  );

  const [activeTab, setActiveTab] = useState<'All Players' | 'My Team'>(
    'All Players'
  );

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, selectedFilterOption]);

  const fetchPlayers = async () => {
    const players = await viewPlayers();
    setPlayerData(players);
  };

  const handleDraft = async (selectedPlayer: any) => {
    if (!selectedPlayer) return;
    try {
      await draftPlayer(selectedPlayer.PLAYER_NAME);
      setDraftedPlayersSet((prev) =>
        new Set(prev).add(selectedPlayer.PLAYER_NAME)
      );
    } catch (error) {
      console.error(error);
      alert('Failed to draft player');
    }
  };

  const handleExclude = async (selectedPlayer: any) => {
    if (!selectedPlayer) return;
    try {
      await excludePlayer(selectedPlayer.PLAYER_NAME);
      setExcludedPlayersSet((prev) =>
        new Set(prev).add(selectedPlayer.PLAYER_NAME)
      );
      alert(`${selectedPlayer.PLAYER_NAME} removed from pool!`);
    } catch (err) {
      console.error(err);
      alert('Failed to remove player.');
    }
  };

  const handleStrategyChange = async (strategyLabel: string) => {
    const strategyKey =
      STRATEGY_LABEL_TO_KEY[strategyLabel] ?? strategyLabel.toLowerCase();
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
  };

  const filteredAvailablePlayers = playerData
    .filter((player) =>
      player.PLAYER_NAME.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (player) =>
        !draftedPlayersSet.has(player.PLAYER_NAME) &&
        !excludedPlayersSet.has(player.PLAYER_NAME)
    )
    .filter(
      (player) =>
        selectedFilterOption === 'All Positions' ||
        player.POSITION === selectedFilterOption
    );

  const draftedPlayers = playerData
    .filter((player) => draftedPlayersSet.has(player.PLAYER_NAME))
    .filter((player) =>
      player.PLAYER_NAME.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (playerData.length === 0) return <div>Loading...</div>;

  const totalPages =
    activeTab === 'All Players'
      ? Math.ceil(filteredAvailablePlayers.length / rowsPerPage)
      : Math.ceil(draftedPlayers.length / rowsPerPage);
  const currentRows =
    activeTab === 'All Players'
      ? filteredAvailablePlayers.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        )
      : draftedPlayers.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );
  const rowsToPad = Math.max(0, rowsPerPage - currentRows.length);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const columns = playerData.length > 0 ? Object.keys(playerData[0]) : [];

  return (
    <div className="mx-auto w-full max-w-[1250px] dark:text-stone-300">
      <div className="">
        <div className="mb-2 flex space-x-2">
          {['All Players', 'My Team'].map((tab) => {
            const isMyTeamTab = tab === 'My Team';
            const showBadge = isMyTeamTab && draftedPlayersSet.size > 0;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'All Players' | 'My Team')}
                className={`relative cursor-pointer rounded-t-md border-b-2 px-4 py-2 text-sm font-semibold ${
                  activeTab === tab
                    ? 'border-amber-500 bg-amber-100 text-amber-600 dark:bg-stone-800 dark:text-amber-400'
                    : 'border-stone-500 bg-stone-200 text-stone-600 hover:text-stone-800 dark:border-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:text-stone-200'
                }`}
              >
                {tab}
                {showBadge && (
                  <span className="absolute top-1 left-[85%] inline-flex items-center justify-center rounded-full bg-amber-500 px-2 py-0.5 text-xs leading-none font-bold text-stone-900">
                    {draftedPlayersSet.size}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => {
              setDraftedPlayersSet(new Set());
              setExcludedPlayersSet(new Set());
              fetchPlayers(); // optionally refetch players from API to reset any server-side state
              setCurrentPage(1);
              setSearchTerm('');
              setSelectedFilterOption(filterOptions[0]);
              setSelectedStrategyOption(strategyOptions[0]);
              setActiveTab('All Players');
            }}
            className="ml-auto cursor-pointer rounded-t-md border-b-2 bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-600 hover:text-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600 dark:hover:text-stone-100"
            aria-label="Reset drafted and excluded players"
            title="Reset drafted and excluded players"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="-mt-2 rounded-tr-lg rounded-b-lg bg-stone-warm p-4 shadow dark:bg-stone-800">
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
            disabled={true}
          />
          <Dropdown
            label={
              <span className="flex items-center gap-1">
                <div className="group relative -ml-1.5">
                  <InfoIcon className="cursor-pointer" />
                  <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded bg-amber-500 px-2 py-1 text-xs whitespace-nowrap text-stone-900 shadow-lg group-hover:block dark:bg-stone-700 dark:text-stone-100">
                    The draft strategy will determine how each stat is weighed
                    when calculating the PAA score
                  </div>
                </div>
                Draft Strategy:
              </span>
            }
            options={strategyOptions}
            value={selectedStrategyOption}
            onChange={setSelectedStrategyOption}
            onSelectAction={(selectedStrategyOption) => {
              handleStrategyChange(selectedStrategyOption);
            }}
          />
        </div>
        {activeTab === 'All Players' && (
          <div>
            <div className="mt-4 overflow-x-auto rounded-lg border shadow">
              <table className="w-full table-fixed text-left text-sm">
                <thead>
                  <tr className="h-12 border-b bg-amber-500 dark:bg-amber-700">
                    {columns.map((col, index) => (
                      <th
                        key={col}
                        className={`px-2 py-2 font-semibold tracking-wide text-stone-900 uppercase dark:text-stone-200 ${
                          index === 0 ? 'w-[20%]' : 'w-[7.3%]'
                        }`}
                      >
                        {col === 'PLAYER_NAME' ? 'Player Name' : col}
                      </th>
                    ))}
                    <th className="w-[7%] px-2 py-2 text-center font-semibold tracking-wide text-stone-900 uppercase dark:text-stone-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, i) => (
                    <tr
                      key={`${row.PLAYER_NAME}-${i}`}
                      className={`h-12 ${i % 2 === 1 ? 'bg-amber-100 dark:bg-stone-700' : 'bg-amber-50 dark:bg-stone-800'}`}
                    >
                      {columns.map((col) => (
                        <td key={col} className="truncate px-2">
                          {col === 'PAA' && typeof row[col] === 'number'
                            ? row[col].toFixed(2)
                            : row[col]}
                        </td>
                      ))}
                      <td className="px-2">
                        <div className="flex gap-1">
                          <DraftPlayerButton
                            onDraft={() => handleDraft(row)}
                            title="Draft Player"
                            aria-label="Draft Player"
                          />
                          <RemovePlayerButton
                            onExclude={() => handleExclude(row)}
                            title="Remove Player"
                            aria-label="Remove Player"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {Array.from({ length: rowsToPad }).map((_, i) => (
                    <tr
                      key={`empty-row-${i}`}
                      className={`h-12 ${(currentRows.length + i) % 2 === 1 ? 'bg-amber-100 dark:bg-stone-700' : 'bg-amber-50 dark:bg-stone-800'}`}
                    >
                      {columns.map((_, colIndex) => (
                        <td key={colIndex} className="px-2">
                          &nbsp;
                        </td>
                      ))}
                      <td className="px-2">{'\u00A0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            )}
          </div>
        )}

        {activeTab === 'My Team' && (
          <div className="mt-4">
            <DraftedPlayersTable draftedPlayers={draftedPlayers} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
