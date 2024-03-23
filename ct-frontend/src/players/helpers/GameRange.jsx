import React from 'react';

function GameRange({ selectedOption, handleClick }) {
    const ranges = ['L5', 'L10', 'L20', 'Season'];

    return (
        <div className="bg-gray-400 border-2 border-gray-300 p-2">
            <h2 className="bg-indigo-400 rounded-sm border-gray-400 border-0 shadow-md text-gray-800 text-lg mb-2 text-center uppercase">Game Range</h2>
            <div className="flex grid-cols-4 divide-indigo-400 divide-x">
                {ranges.map((range) => (
                    <button
                        key={range}
                        className={`px-4 py-2 rounded-sm text-gray-900 hover:bg-indigo-200 focus:outline-none ${
                            selectedOption === range ? 'bg-indigo-400' : ''
                        }`}
                        onClick={() => handleClick(range)}
                    >
                        {range}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameRange;
