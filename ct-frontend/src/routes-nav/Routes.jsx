import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { useAuth } from "../auth/authContext";

import Layout from "./Layout";
import Home from "../homepage/Home";
import Login from "../auth/Login";
import Signup from "../auth/Signup";
import ErrorPage from "../error/error-page";
import ProfileForm from "../profile/ProfileForm";
import TeamsList from "../teams/TeamsList";
import TeamDetail from "../teams/TeamDetail";
import PlayersList from "../players/PlayersList";
import PlayerDetail from "../players/PlayerDetail";
import Parlayer from "../players/Parlayer";
import Journal from "../journal/Journal";
import JournalEntryCard from "../journal/JournalEntryCard";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
                {
                path: "login",
                element: <Login />,
            },
                {
                path: "signup",
                    element: <Signup />,
            },
                {
                path: "profile",
                element: <ProfileForm />
            },
                {
                path: "teams",
                element: <TeamsList />,
            },
                {
                path: "teams/:code",
                element: <TeamDetail />,
            },
                {
                path: "players",
                element: <PlayersList />,
            },
                {
                path: "players/:id",
                element: <PlayerDetail />,
            }, 
                {
                path: "parlayer",
                element: <Parlayer/>,
                    children: [
                        {
                        path: ":code",
                        element: <Parlayer/>,
                    }
                ]   
            },
                {
                path: "journal",
                element: <Journal />,
                    children: [
                        {
                        path: ":username",
                        element: <Journal />,
                    }
                ]      
                }
    ],
},
]);

export default router;