import { useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocation } from "react-router-dom";

import { useAuth } from "../auth/authContext";
import LoggedInNav from "./LoggedInNav";
import LoggedOutNav from "./LoggedOutNav";



function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

/** Navigation bar for site. Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. When not,
 * shows link to Login and Signup forms.
 *
 * Rendered by App.
 */

function Navigation() {
    const { currentUser } = useAuth();
    
    const location = useLocation();
    const [currentLink, setCurrentLink] = useState(getCurrentLink(location.pathname));

    console.log('navigation mount');
    useEffect(() => {
        // Update currentLink when the location changes
        setCurrentLink(getCurrentLink(location.pathname));
    }, [location.pathname]);

    function getCurrentLink(pathname) {
        // Map the pathname to the corresponding link name
        const linkNameMap = {
        '/': 'Home',
        '/teams': 'Teams',
        '/players': 'Players',
        '/parlayer': 'Parlayer',
        '/journal': 'Journal',
        '/login': 'Login',
        '/signup': 'Signup'
        };

        return linkNameMap[pathname] || 'Home';
    };

    const loggedInNavigation = [
        { name: 'Home', href: '/', current: currentLink === 'Home' },
        { name: 'Parlayer', href: '/parlayer', current: currentLink === 'Parlayer' },
        currentUser && { name: 'Journal', href: `/journal/${currentUser.username}`, current: currentLink === 'Journal' },
        { name: 'Search Teams', href: '#', current: currentLink === 'Teams' },
        { name: 'Search Players', href: '#', current: currentLink === 'Players' },
    ];

    const loggedOutNavigation = [
        { name: 'Home', href: '/', current: currentLink === 'Home' },
        { name: 'Login', href: '/login', current: currentLink === 'Login' },
        { name: 'Signup', href: '/signup', current: currentLink === 'Signup' },
    ];
    
    const handleLinkClick = (name) => {
        setCurrentLink(name);
    };

    return (
        <>
            {currentUser ? <LoggedInNav loggedInNavigation={loggedInNavigation} handleLinkClick={handleLinkClick} /> : <LoggedOutNav loggedOutNavigation={loggedOutNavigation} handleClick={handleLinkClick}/>}
        </>
    );
}

export default Navigation;
