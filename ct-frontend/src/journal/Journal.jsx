import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


import CapTapApi from '../../../api';
import JournalEntryCard from './JournalEntryCard'; 

function Journal() {
    const { username } = useParams();

    const [journalEntries, setJournalEntries] = useState([]);

    useEffect(() => {
        async function getJournalEntries() {
            const entriesResult = await CapTapApi.getJournalEntries(username);
            setJournalEntries(entriesResult);
            console.log(journalEntries);
        };
        getJournalEntries();
    }, []);

    const handleDelete = async (entryId) => {
        try {
            await CapTapApi.deleteJournalEntry(entryId, username);
            setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
            console.log('Journal entry deleted successfully');
        } catch (error) {
            console.error('Error deleting journal entry:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 overflow-x-auto shadow-lg">
        {journalEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
        ))}
        </div>
    );
}

export default Journal;
