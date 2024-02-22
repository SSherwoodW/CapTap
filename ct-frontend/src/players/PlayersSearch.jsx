import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

import CapTapApi from '../../../api';

export default function PlayersSearch({ handlePlayerClick }) {
    const [selected, setSelected] = useState({ player: { name: 'Devin Booker' } });
    const [query, setQuery] = useState('');
    const [players, setPlayers] = useState(null);
    
    // Get all players on component mount.
    useEffect( () => {
        const fetchPlayers = async () => {
            try {
                const players = await CapTapApi.getPlayers();
                setPlayers(players);
                console.log(players);
            } catch (err) {
                console.error('Error fetching players:', err);
            }
        }; 
        fetchPlayers();
    }, []);

    const filteredPlayers =
        query === ''
            ? players
            : players.filter((player) =>
                player.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            );

    return (
        <div className="fixed top-16 w-72">
            {players && (
                <Combobox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                            <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={(player) => player.name}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                        >
                                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {filteredPlayers.length === 0 && query !== '' ? (
                                        <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                            No players found.
                                        </div>
                                    ) : (
                                        filteredPlayers.map((player) => (
                                            <Link
                                                key={player.id}
                                                to={`/players/${player.id}`}
                                                onClick={handlePlayerClick}
                                                onKeyDown={handlePlayerClick}
                                            >
                                                <Combobox.Option
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={player}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                                    }`}
                                                            >
                                                                {player.name}
                                                            </span>
                                                            {selected ? (
                                                                <span
                                                                    className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                                        }`}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Combobox.Option>
                                            </Link>
                                        ))
                                    )}
                                </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            )}
        </div>
    );
}
