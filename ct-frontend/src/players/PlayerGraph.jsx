import React from 'react';
import * as V from 'victory';


import chartTheme from "./helpers/victoryChartHelpers";

function PlayerGraph({ playerGraphData, player }) {
  return (
    <>
      {playerGraphData
        .filter((playerData) => playerData.playerId === player.id)
        .map((playerData) => (
          <div key={playerData.playerId}>
            {playerData.data && playerData.data.length > 0 && (
                <div>
                    <div>
                        <V.VictoryChart
                            theme={chartTheme}
                            height={250}
                            width={1200}
                            style={{
                                parent: {
                                    background: "#111827", 
                                    borderRadius: "5px",
                                    border: "2px solid #374151"
                                }
                            }}
                            domainPadding={{ x: 48 }}
                        >
                            <V.VictoryLine
                                style={{
                                    data: {
                                        stroke: "white",
                                        strokeDasharray: 4 // Adjust the dash length as needed
                                    }
                                }}
                                data={[
                                    { x: 0, y: playerData.value }, // Use playerData.value as y value
                                    { x: playerData.data.length + 1, y: playerData.value } // Use the length of playerData.data to position the line
                                ]}
                            />
                            <V.VictoryBar
                                barWidth={() =>
                                    playerData.range === 5 ? 48 : 
                                    playerData.range === 10 ? 32 : 
                                    playerData.range === 20 ? 16 : 8
                                }
                                style={{
                                    data: {
                                        fill: ({ datum }) =>
                                            playerData.overUnder === "Over"
                                                ? datum.y >= playerData.value
                                                    ? "#4caf50"
                                                    : "#C21807"
                                                : datum.y < playerData.value
                                                    ? "#4caf50"
                                                    : "#C21807",
                                        cursor: "pointer"
                                    },
                                    labels: { fontSize: 16, fill: "#111827" },
                                }}
                                alignment="middle"
                                data={playerData.data}
                                labels={({ datum }) => `${datum.y !== null ? `${datum.y} ${playerData.selectedStat}` : 'DNP'} \n Opponent: ${datum.opponent}`}
                                labelComponent={
                                    <V.VictoryTooltip
                                        center={{ x: 500, y: 30 }}
                                        pointerOrientation="top"
                                        flyoutWidth={280}
                                        flyoutHeight={50}
                                        renderInPortal={false}
                                        pointerWidth={50}
                                        cornerRadius={0}
                                    />}
                            />
                            <V.VictoryAxis
                                dependentAxis
                                tickFormat={(tick) => `${tick}`}
                                label={playerData.selectedStat}
                            />
                            <V.VictoryAxis
                                tickFormat={(tick) => `${tick}`}
                                label="Games"
                            />
                        </V.VictoryChart>
                    </div>
                </div>
            )}
          </div>
        ))}
    </>
  );
}

export default PlayerGraph;