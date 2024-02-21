import { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { useAuth } from "../auth/authContext";
import { NavLink, useLocation } from "react-router-dom";



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
    const { currentUser, handleLogout } = useAuth();
    
        console.debug("Navigation currentUser", currentUser);

    const location = useLocation();
    const [currentLink, setCurrentLink] = useState(getCurrentLink(location.pathname));

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

    const loggedOutNavigation = [
        { name: 'Home', href: '/', current: currentLink === 'Home' },
        { name: 'Login', href: '/login', current: currentLink === 'Login' },
        { name: 'Signup', href: '/signup', current: currentLink === 'Signup' },
    ];
    
    const handleLinkClick = (name) => {
        setCurrentLink(name);
    }
    
    const loggedInNavigation = [
        { name: 'Home', href: '/', current: currentLink === 'Home' },
        { name: 'Teams', href: '/teams', current: currentLink === 'Teams' },
        { name: 'Players', href: '/players', current: currentLink === 'Players' },
        { name: 'Parlayer', href: '/parlayer', current: currentLink === 'Parlayer' },
        currentUser && { name: 'Journal', href: `/journal/${currentUser.username}`, current: currentLink === 'Journal' },
     ];

    function loggedInNav() {
        return (
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-8xl px-1 sm:px-6 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                               <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                               </div>
                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex flex-shrink-0 items-center">
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="CapTap Logo"
                                        />
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {loggedInNavigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => handleLinkClick(item.name)}    
                                                className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.current ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                 <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                className="h-8 w-8 rounded-full"
                                                src=""
                                                alt="user profile photo"
                                            />
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                >
                                                    Your Profile
                                                </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                <a
                                                    href="#"
                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                >
                                                    Settings
                                                </a>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                <a
                                                    href="/login"
                                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                                    onClick={() => handleLogout()}
                                                >
                                                    Sign out
                                                </a>
                                                )}
                                            </Menu.Item>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                            {loggedInNavigation.map((item) => (
                                <Disclosure.Button
                                key={item.name}
                                as="a"
                                href={item.href}
                                onClick={() => handleLinkClick(item.name)}     
                                className={classNames(
                                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                                aria-current={item.current ? 'page' : undefined}
                                >
                                {item.name}
                                </Disclosure.Button>
                            ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        )
    }

    function loggedOutNav() {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-8xl px-1 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                           <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                           </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                        alt="CapTap Logo"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        {loggedOutNavigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => handleLinkClick(item.name)}    
                                            className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}



    return (
        <>
            {currentUser ? loggedInNav() : loggedOutNav()}
        </>
    );
}

// {currentUser ? loggedInNav() : loggedOutNav()}

export default Navigation;
