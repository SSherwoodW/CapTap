import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import Navigation from "../routes-nav/Navigation";
import { AuthContext } from "../auth/authContext";


function Home() {
    const { currentUser } = useContext(AuthContext);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div>
            <Navigation />
            {isHomePage && (
                <div className="">
                    <p>Home Page Content</p>
                    <Link to="/parlayer">Go to Other Page</Link>
                </div>
            )}
            <div id="detail">
                <Outlet />
            </div>
        </div>
    );
}

export default Home;