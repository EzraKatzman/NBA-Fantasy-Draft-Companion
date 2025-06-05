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

  const [sortColumn, setSortColumn] = useState('PAA');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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
    setSortColumn('PAA');
    setSortDirection('desc');
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

  const sortedPlayers = [...(activeTab === 'All Players' ? filteredAvailablePlayers : draftedPlayers)].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    // For float columns (stats, PAA)
    if (!isNaN(aVal) && !isNaN(bVal)) {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    // For string collumns
    return String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase()) * (sortDirection === 'asc' ? 1 : -1);
  });

  if (playerData.length === 0) return <div>Loading...</div>;

  const totalPages =
    activeTab === 'All Players'
      ? Math.ceil(filteredAvailablePlayers.length / rowsPerPage)
      : Math.ceil(draftedPlayers.length / rowsPerPage);
  const currentRows = sortedPlayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const rowsToPad = Math.max(0, rowsPerPage - currentRows.length);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const columns = playerData.length > 0 ? Object.keys(playerData[0]) : [];

  return (
    <div className="mx-auto w-full max-w-[1250px]">
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
                    ? 'border-amber-500 bg-amber-100 text-amber-600'
                    : 'border-stone-500 bg-stone-200 text-stone-600 hover:text-stone-800'
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
              setSortColumn('PAA');
              setSortDirection('desc');
            }}
            className="ml-auto cursor-pointer rounded-t-md border-b-2 bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-600 hover:text-stone-200"
            aria-label="Reset drafted and excluded players"
            title="Reset drafted and excluded players"
          >
            Reset
          </button>
        </div>
      </div>
      <div className="-mt-2 rounded-tr-lg rounded-b-lg bg-stone-100 p-4 shadow">
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
                  <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded bg-amber-500 px-2 py-1 text-xs whitespace-nowrap text-stone-900 shadow-lg group-hover:block">
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
                  <tr className="h-12 border-b bg-amber-500">
                    {columns.map((col, index) => (
                      <th
                        key={col}
                        onClick={() => {
                          if (sortColumn === col) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                          } else {
                            setSortColumn(col)
                            setSortDirection('asc')
                          }
                        }}
                        className={`cursor-pointer px-2 py-2 font-semibold tracking-wide text-stone-900 uppercase ${
                          index === 0 ? 'w-[20%]' : 'w-[7.3%]'
                        }`}
                      >
                        {col === 'PLAYER_NAME' ? 'Player Name' : col}
                        {sortColumn === col && (
                          <span className="text-sm">
                            {sortDirection === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </th>
                    ))}
                    <th className="w-[7%] px-2 py-2 text-center font-semibold tracking-wide text-stone-900 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((row, i) => (
                    <tr
                      key={`${row.PLAYER_NAME}-${i}`}
                      className={`h-12 ${i % 2 === 1 ? 'bg-amber-100' : 'bg-amber-50'}`}
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
                      className={`h-12 ${(currentRows.length + i) % 2 === 1 ? 'bg-amber-100' : 'bg-amber-50'}`}
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
