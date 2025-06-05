'use client';

import React from 'react';

interface DraftedPlayersTableProps {
  draftedPlayers: any[];
}

export default function DraftedPlayersTable({
  draftedPlayers,
}: DraftedPlayersTableProps) {
  const rowsPerPage = 10;
  const columns =
    draftedPlayers.length > 0
      ? Object.keys(draftedPlayers[0])
      : ['PLAYER_NAME'];

  const rowsToPad =
    draftedPlayers.length === 0
      ? rowsPerPage - 1
      : Math.max(0, rowsPerPage - draftedPlayers.length);

  return (
    <div className="overflow-x-auto rounded-lg border shadow">
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="h-12 border-b bg-amber-500">
            {columns.map((col, index) => (
              <th
                key={col}
                className={`px-2 py-2 font-semibold tracking-wide text-stone-900 uppercase ${
                  index === 0 ? 'w-[20%]' : 'w-[7.3%]'
                }`}
              >
                {col === 'PLAYER_NAME' ? 'Player Name' : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {draftedPlayers.length === 0 ? (
            <>
              <tr className="h-12 bg-amber-50">
                <td
                  colSpan={columns.length}
                  className="px-2 py-4 text-center text-stone-500 italic"
                >
                  No players available.
                </td>
              </tr>
              {Array.from({ length: rowsToPad }).map((_, i) => (
                <tr
                  key={`empty-row-${i}`}
                  className={`h-12 ${
                    (i + 1) % 2 === 1
                      ? 'bg-amber-100'
                      : 'bg-amber-50'
                  }`}
                >
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-2">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ) : (
            <>
              {draftedPlayers.map((row, i) => (
                <tr
                  key={`${row.PLAYER_NAME}-${i}`}
                  className={`h-12 ${
                    i % 2 === 1
                      ? 'bg-amber-100'
                      : 'bg-amber-50'
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col} className="truncate px-2">
                      {col === 'PAA' && typeof row[col] === 'number'
                        ? row[col].toFixed(2)
                        : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
              {Array.from({ length: rowsToPad }).map((_, i) => (
                <tr
                  key={`empty-row-${i}`}
                  className={`h-12 ${
                    (draftedPlayers.length + i) % 2 === 1
                      ? 'bg-amber-100'
                      : 'bg-amber-50'
                  }`}
                >
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-2">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
