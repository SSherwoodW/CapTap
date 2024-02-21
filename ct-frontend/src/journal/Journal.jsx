import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';


import CapTapApi from '../../../api';
import JournalEntryCard from './JournalEntryCard'; 

function Journal({ entries }) {
    const { username } = useParams();
    console.log('journal username', username)

    const [journalEntries, setJournalEntries] = useState([]);

    useEffect(() => {
        async function getJournalEntries() {
            const entriesResult = await CapTapApi.getJournalEntries(username);
            setJournalEntries(entriesResult);
            console.log(journalEntries);
        };
        getJournalEntries();
    }, []);


    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 overflow-x-auto shadow-lg">
        {journalEntries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
        ))}
        </div>
    );
}

export default Journal;
