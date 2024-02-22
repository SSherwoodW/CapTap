import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import Navigation from "../routes-nav/Navigation";
import { AuthContext } from "../auth/authContext";


function Home() {
    const { currentUser } = useContext(AuthContext);

    const location = useLocation();
    const isHomePage = location.pathname === '/';

    console.log('home mount');
    return (
        <div>
            <Navigation />
            {isHomePage && (
                <div>
                    {currentUser ? (
                        <div className="flex justify-center items-center">
                            <div className="flex-grow md:ml-4 mt-4 text-gray-300">
                                <h4 className="text-5xl font-thin mb-8">Welcome back.</h4>
                                <div className="mb-8 font-bold">
                                    <div className="mt-4">
                                        <span className="text-indigo-300"><Link to={`/journal/${currentUser.username}`}>View your journal.</Link></span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-indigo-300"><Link to="/parlayer">Test a parlay.</Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="flex-grow md:ml-4 mt-4 text-gray-300">
                                <h4 className="text-5xl font-thin uppercase mb-8">Welcome to captap.</h4>
                                <div className="mb-8 font-bold">
                                    <div>
                                        <div>CapTap is the premier destination to check your straights, develop your parlays, and test your knowledge.</div> 
                                    </div>
                                    <div className="mt-4">
                                        Interested? <span className="text-indigo-300"><Link to="/signup">Sign up here.</Link></span>
                                    </div>
                                    <div className="mt-4">
                                        Have an account? <span className="text-indigo-300"><Link to="/login">Log back in.</Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div id="detail">
                <Outlet />
            </div>
        </div>
    );
}

export default Home;