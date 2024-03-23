import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import SaveToJournalModal from './SaveToJournalModal';
import CapTapApi from '../../../api';

function JournalEntryCard({ entry, onDelete }) {
    const { username } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [updatedEntry, setUpdatedEntry] = useState(entry);


    useEffect(() => {
        setUpdatedEntry(entry);
    }, [entry]);

    const handleDelete = async () => {
        try {
            await onDelete(entry.id, username);
            setIsOpen(false); 
        } catch (error) {
            console.error('Error deleting journal entry:', error);
        }
    };

     const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const updateDescription = (newDescription) => {
        const updatedEntry = { ...entry, description: newDescription };
        setUpdatedEntry(updatedEntry);
    };


    
    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">{updatedEntry.description}</h2>
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
            <div className=''>
                <div className="">
                    <SaveToJournalModal entry={entry} updateDescription={ updateDescription} />
                </div>
                <div className="">
                    <button className="flex rounded-sm p-4 bg-red border-2 border-gray-400 text-gray-900 text-lg shadow-md hover:bg-gray-400 hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        onClick={() => setIsOpen(true)}>
                        Delete
                    </button>
                    <Dialog open={isOpen} onClose={handleClose}>
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Are you sure you want to delete?
                        </h2>
                        <div className="flex justify-end">
                            <button onClick={handleClose} className="mr-4">Cancel</button>
                            <button onClick={handleDelete} className="bg-blue-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default JournalEntryCard;
