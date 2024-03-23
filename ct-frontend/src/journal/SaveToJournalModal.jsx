import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { AuthContext } from "../auth/authContext";
import CapTapApi from '../../../api';

function SaveToJournalModal({ entry, saveJournalEntry, updateDescription, playerIds, selectedStats, values, overUnders, selectedRange }) {
    const { currentUser } = useContext(AuthContext);
    const { username } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [existingJournalEntry, setExistingJournalEntry] = useState(null);
    const [description, setDescription] = useState(entry?.description || '');

    useEffect(() => {
        if (!entry) return;
        console.log('in savetojournalmodal useEffect')
        const fetchExistingJournalEntry = async () => {
        try {
            const journalEntry = await CapTapApi.getJournalEntry(username, entry.id);
            setExistingJournalEntry(journalEntry);
        } catch (error) {
            console.error('Error fetching existing journal entry:', error);
        }
        };

        fetchExistingJournalEntry();
    }, [isOpen]);
    
    const handleSave = async () => {
        if (!description.trim()) {
            handleClose();
            return;
        }
        if (existingJournalEntry) {
            await CapTapApi.updateJournalEntry(existingJournalEntry.id, username, { description });
        } else {
            const data = {
                data: {
                    playerIds: playerIds,
                    statCats: selectedStats,
                    values: values, 
                    overUnders: overUnders,
                },
                range: selectedRange,
                description: description,
                userId: currentUser.id
            };
            saveJournalEntry(data);
        }
        updateDescription(description);
        setDescription('');
        setIsOpen(false);
    };

    const handleClose = () => {
            setIsOpen(false);
    };
        
    const handleChange = (event) => {
        const value = event.target.value;
        setDescription(value);
    };

    return (
        <>
            <button className="flex rounded-sm p-4 bg-gray-500 border-2 border-gray-400 text-gray-900 text-lg shadow-md hover:bg-gray-400 hover:ring-2 hover:ring-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={() => setIsOpen(true)}>
                {existingJournalEntry ? "Update Description" : "Save to Journal"}
            </button>
            <Dialog open={isOpen} onClose={handleClose}>
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">
                    {existingJournalEntry ? "Update Description" : "Save to Journal"}
                </h2>
                <textarea
                    value={description}
                    onChange={handleChange}
                    placeholder="Enter description..."
                    className="w-full h-32 border rounded p-2 mb-4"
                />
                <div className="flex justify-end">
                    <button onClick={handleClose} className="mr-4">Cancel</button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                </div>
                </div>
            </Dialog>
        </>
    );
}

export default SaveToJournalModal;