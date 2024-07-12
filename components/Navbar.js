import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../authentication/AuthContext';
import axios from 'axios';

const Navbar = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQuerySpaced, setSearchQuerySpaced] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchQuerySpaced(encodeURIComponent(query));
        setIsDropdownOpen(true);
        setSearchResults([{ name: searchQuery, type: 'username', id: 1 }, { name: searchQuery, type: 'activity', id: 1 }]);

        if (query.length > 2) {
        } else {
            setIsDropdownOpen(false);
        }
    };

    return (
        <header className='flex border-b py-4 px-4 sm:px-10 bg-white font-[sans-serif] min-h-[70px] tracking-wide relative z-50'>
            <div className="container mx-auto">
                <div className='flex flex-wrap items-center gap-5 w-full justify-between'>
                    <a href="#"><img src="https://is3.cloudhost.id/gotong-garuda-hack/gotong-garuda-hack/images/go-tong.svg" alt="logo" className='w-10' /></a>

                    <div className={`lg:flex lg:items-center ${isMenuOpen ? 'block' : 'hidden'}`}>
                        <ul className='lg:flex lg:space-x-5 max-lg:space-y-3'>
                            <li className='max-lg:border-b max-lg:py-3 px-3'>
                                <a href='/'
                                    className='lg:hover:text-[#526D82] text-black block font-semibold text-[15px]'>Home</a>
                            </li>
                            <li className='max-lg:border-b max-lg:py-3 px-3'>
                                <a href='/activity/add'
                                    className='lg:hover:text-[#526D82] text-black block font-semibold text-[15px]'>Request Gotong</a>
                            </li>
                            <li className='max-lg:border-b max-lg:py-3 px-3'>
                                <a href='/model-citizen'
                                    className='lg:hover:text-[#526D82] text-black block font-semibold text-[15px]'>Gotong Leaderboard</a>
                            </li>
                            {user && (
                                <li className='max-lg:border-b max-lg:py-3 px-3'>
                                    <a href='/contribution'
                                        className='lg:hover:text-[#526D82] text-black block font-semibold text-[15px]'>View Contribution</a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className='flex lg:ml-auto max-lg:w-full relative'>
                        <div className='flex xl:w-80 max-xl:w-full bg-gray-100 px-6 py-3 rounded-full outline outline-transparent focus-within:outline-[#526D82] focus-within:bg-transparent'>
                            <input
                                type='text'
                                placeholder='Search'
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className='w-full text-sm text-black bg-transparent rounded outline-none pr-2'
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px"
                                className="cursor-pointer fill-gray-400">
                                <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                                </path>
                            </svg>
                        </div>
                        {isDropdownOpen && (
                            <div className='absolute top-full mt-2 w-full bg-white border rounded shadow-lg z-10'>
                                <ul>
                                    {searchResults.map((result, index) => (
                                        <li key={index} onClick={
                                            result.type === 'username' ? () => window.location.href = `/search/user?query=${encodeURIComponent(searchQuerySpaced)}` : () => window.location.href = `/search/activity?query=${encodeURIComponent(searchQuerySpaced)}`
                                        } className='px-4 py-2 hover:bg-gray-200 text-black cursor-pointer'>
                                            {result.type === 'username' ? (
                                                <a href={`/search/user?query=${encodeURIComponent(searchQuerySpaced)}`}>{result.name} in User</a>
                                            ) : (
                                                <a href={`/search/activity?query=${encodeURIComponent(searchQuerySpaced)}`}>{result.name} in Activity</a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className='flex items-center max-sm:ml-auto space-x-6'>
                        <ul>
                            <li className="relative px-1">
                                <button onClick={toggleProfileDropdown}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" className="cursor-pointer hover:fill-black"
                                        viewBox="0 0 512 512">
                                        <path d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                                            data-original="#000000" />
                                    </svg>
                                </button>
                                <div className={`bg-white z-20 shadow-md py-6 px-6 sm:min-w-[320px] max-sm:min-w-[250px] absolute right-0 top-10 text-black ${isProfileDropdownOpen ? 'block' : 'hidden'}`}>
                                    {user ? (
                                        <div>
                                            <h6 className="font-semibold text-[15px] text-black">{user.name}</h6>
                                            <p className="text-sm text-gray-500 mt-1">{user.tier}</p>
                                            <p className="text-sm text-gray-500 mt-1">To access and manage account</p>
                                            <button type='button'
                                                className="bg-transparent border-2 border-gray-300 hover:border-black rounded px-4 py-3 mt-4 text-sm text-black font-semibold">My Account</button>
                                            <button type='button' onClick={logout}
                                                className="bg-transparent ml-2 border-2 z-50 border-gray-300 hover:border-black rounded px-4 py-3 mt-4 text-sm text-black font-semibold">Logout</button>
                                            <hr className="border-b-0 my-4" />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Link href="/login" className='block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition duration-300'>
                                                <p>Login</p>
                                            </Link>
                                            <Link href="/register" className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded hover:bg-gray-300 transition duration-300">
                                                <p>Register</p>
                                            </Link>

                                        </div>
                                    )}
                                </div>
                            </li>
                        </ul>

                        <button onClick={toggleMenu} className='lg:hidden ml-7'>
                            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </header >
    );
}

export default Navbar;
