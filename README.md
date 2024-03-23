# CapTap: A Sportsbettor's Guide

## Description

CapTap is designed to provide statistical analysis for NBA sports bettors. The main feature of the application is how it analyzes potential player parlay bets. A parlay bet is a bet on multiple outcomes, in this case in the same game. For example, how does Devin Booker's scoring affect Kevin Durant's assist numbers? Using graphic visualizations and correlation percentages, a user can easily understand how players' statlines affect those of their teammates.

## Features

These features were selected to provide users with a simple but powerful way to search through NBA players and provide data and graphs of their statistical outputs.

- **Player and Team Search:** Easily search through all NBA players/teams from the Navigation bar.
- **Player pages:** View a player's season averages, game logs, and select from teammates to build a parlay with.
- **Parlayer:** The core feature. Select multiple players from the same team and view their statistical outputs concurrently.
  - Select game range: last 5, last 10, last 20, or the whole season.
  - Select stat category: points, rebounds, assists, turnovers, three-pointers-made, steals, blocks.
  - Select over/under: decide if you want to view games where a player went over or under a stat (e.g. 'Points over 20 in last 5 games').
- **Journal:** Save interesting research from the Parlayer to your Journal.

## Tests

- **Backend:** tests are located adjacent to the files they are testing. I used the jest testing library for the backend. All tests can be run with the command 'npm test [selectedfile (optional)]'.
- **Frontend:** tests are located adjacent to the files they are testing. I used vitest and react-testing-library for the frontend. All tests can be run with 'npm test [selectedfile (optional)]'.

## User flow example and explanation

1. Signup/login. Full authorization/authentication is required to search for players or use the Journal/Parlayer features.
2. Once authenticated, search for players/teams in the Nav bar, or go straight to the Parlayer to select a team whose players you want to view.
3. Select the players you want to view graphs for, and for each one, input a) statistical category, b) Over/Under, and c) the value (i.e. 20).
4. Select a game range at the top of the page(Last 5, Last 10, etc...).
5. If you find a Parlay you want to remember in the future, save it to your Journal by clicking "Save To Journal". You will be asked to write a description, but that's optional. All the data currently displayed on your Parlayer page will be stored to the Journal.
6. Check out your journal! All of your Journal Entries will be displayed chronologically from most recent to least. If you want to update the description or delete the journal entry altogether, do it easily.
7. Just want to view a player's game log? find them using the 'Search Players' tab in the Nav bar and check out their profile page.

## API

I used the SportRadar NBA API, available at [SportRadar Developer Portal](https://developer.sportradar.com/). This is the API the NBA uses for their data, so you can be confident the data is accurate.

**Internal API:** To interface between the frontend and backend, I have a middleman API to communicate between them. The frontend has no knowledge of the backend except by communicating via the API, and vice versa.

## Tech Stack

- **Frontend:** React(Vite), JavaScript, Tailwind CSS, Victory Charts.
- **Backend:** ExpressJS, Node.js, PostgreSQL database.

Thanks for viewing, and let me know what you think of CapTap! Parlay On!!!
