import { useState } from 'react';

function JournalEntryCard({ entry }) {
    const [players, setPlayers] = useState();

    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">{entry.description}</h2>
            <p className="text-sm mb-2">Range: {entry.range}</p>
            <div className="flex bg-gray-400 p-2 text-center rounded-t-sm justify-between items-center overflow-x-auto">
                {entry.journalPlayersData.length > 0 ? (
                <ul className="list-disc ml-6">
                    {entry.journalPlayersData.map((playerData, index) => (
                    <li key={index}>
                        Player ID: {playerData.playerId},{' '}
                        Stat Category: {playerData.statCategory},{' '}
                        Over/Under: {playerData.overUnder},{' '}
                        Value: {playerData.value}
                    </li>
                    ))}
                </ul>
                ) : (
                <p>No player data available</p>
                )}
            </div>
        </div>
  );
}

export default JournalEntryCard;
