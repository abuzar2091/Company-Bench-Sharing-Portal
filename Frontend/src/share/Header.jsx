import { INITIAL_USER, useUserContext } from '@/context/AuthContext';
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

function Header() {
    const {
        setUser,
        setIsAuthenticated,
        isAuthenticated,
        checkAuthUser,
        isLoading: isUserLoading,
    } = useUserContext();
    const navigate = useNavigate();

    const [authStatus, setAuthStatus] = useState(isAuthenticated);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignOut = async (e) => {
        e.preventDefault();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        await axios.post(`/api/v1/users/logout`)
            .then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log("error ", err);
            });
    };

    let navItems = [
        { name: "Home", redirection: "/", active: true },
        { name: "Company-Id", redirection: "/company-id", active: true },
        { name: "Sign-In", redirection: "/login", active: !isAuthenticated },
        { name: "Sign-Up", redirection: "/signup", active: !isAuthenticated },
    ];

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
            <div className="flex justify-between items-center p-4">
                <Link to="/">
                    <img className="h-16 ml-4" src="/images/logo4.png" alt="logo" />
                </Link>
                <div className="xs:hidden flex items-center mr-4">
                    <button onClick={toggleMenu} className="text-gray-900">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
                <ul className="hidden xs:flex sm:gap-8 xs:gap-3 mr-4">
                    {navItems.map((item) =>
                        item.active ? (
                            <li key={item.name}>
                                <NavLink
                                    to={item.redirection}
                                    className={({ isActive }) =>
                                        `inline-block lg:px-6 md:px-2 py-2 duration-200 hover:bg-blue-100
                                            rounded-full ${isActive ? "text-blue-700" : "text-gray-700"}`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ) : null
                    )}
                    {isAuthenticated && (
                        <div className="flex items-start gap-4">
                            <button onClick={handleSignOut} className="px-2 py-[6px]">
                                Sign out
                            </button>
                            <Link to="/my-profile">
                                <div className="flex justify-center items-start gap-2 cursor-pointer">
                                    <button>
                                        <p className="small-medium lg:base-medium py-1">My Account</p>
                                    </button>
                                    <img
                                        src="/assets/icons/img_profile_24_outline.svg"
                                        alt="profiletwentyfo"
                                        className="h-[30px] w-[30px] mt-1"
                                    />
                                </div>
                            </Link>
                        </div>
                    )}
                </ul>
            </div>
            <div className={`fixed top-0 left-0 h-full min-w-[180px] bg-white shadow-lg z-50 transform ${menuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex justify-between p-4">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={toggleMenu} className="text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <ul className="flex flex-col gap-4 p-4">
                    {navItems.map((item) =>
                        item.active ? (
                            <li key={item.name}>
                                <NavLink
                                    to={item.redirection}
                                    className={({ isActive }) =>
                                        `inline-block px-4 py-2 duration-200 hover:bg-blue-100
                                            rounded-full ${isActive ? "text-blue-700" : "text-gray-700"}`
                                    }
                                    onClick={toggleMenu}
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ) : null
                    )}
                    {isAuthenticated && (
                        <div className="flex flex-col gap-4 items-start">
                            <button onClick={(e) => { handleSignOut(e); toggleMenu(); }} className="ml-4 py-2">
                                Sign out
                            </button>
                            <Link to="/my-profile" onClick={toggleMenu}>
                                <div className="flex justify-start items-center gap-2 cursor-pointer px-4 py-2">
                                    <button>
                                        <p className="small-medium lg:base-medium">My Account</p>
                                    </button>
                                    <img
                                        src="/assets/icons/img_profile_24_outline.svg"
                                        alt="profiletwentyfo"
                                        className="h-[30px] w-[30px]"
                                    />
                                </div>
                            </Link>
                        </div>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;

