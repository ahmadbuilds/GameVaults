'use client'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React, { ReactNode, useState } from "react";
import Link from "next/link";
interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-[#121212] text-white overflow-hidden">
            {/* Mobile Overlay */}
            <div 
                className={`
                    fixed inset-0 z-40 lg:hidden transition-all duration-300 ease-in-out
                    ${isSidebarOpen 
                        ? 'bg-trasnparent backdrop-blur-0 visible' 
                        : 'bg-transparent backdrop-blur-0 invisible'
                    }
                `}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Left Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-60 bg-[#202020] h-full flex flex-col
                transform transition-all duration-300 ease-out
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'}
                lg:translate-x-0 lg:shadow-none
                md:w-48 lg:w-60
            `}>
                {/* Logo area */}
                <div className="p-4 mb-6">
                    <Link href="/Dashboard">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="bg-[#6B46C1] p-2 rounded flex items-center justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                </svg>
                            </div>
                            <div className="font-bold text-lg tracking-tight">
                                <span className="text-[#A78BFA]">Game</span>
                                <span className="text-white">Vault</span>
                            </div>
                        </div>
                    </Link>
                </div>
                
                {/* Sidebar Navigation */}
                <nav className="flex-1">
                    <Link 
                        href="/Dashboard/backlog" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#303030] transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        <span className="md:block">Backlog</span>
                    </Link>
                    
                    <Link 
                        href="/Dashboard/library" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#303030] transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                        </svg>
                        <span className="md:block">Library</span>
                    </Link>
                    
                    <Link 
                        href="/Dashboard/list" 
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#303030] transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                        </svg>
                        <span className="md:block">List</span>
                    </Link>
                </nav>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-0">
                {/* Top Navigation */}
                <div className="h-16 bg-[#202020] border-b border-[#303030] flex items-center px-6 justify-between">
                    {/* Left side - Mobile menu button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className={`
                                lg:hidden p-2 rounded-md transition-all duration-200 ease-in-out
                                ${isSidebarOpen 
                                    ? 'bg-[#6B46C1] text-white transform rotate-90' 
                                    : 'hover:bg-[#303030] text-gray-300 hover:text-white'
                                }
                            `}
                            aria-label="Toggle sidebar"
                        >
                            <svg 
                                className={`w-6 h-6 transition-transform duration-200 ease-in-out ${
                                    isSidebarOpen ? 'rotate-180' : 'rotate-0'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                {isSidebarOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                        
                        {/* Logo for mobile when sidebar is closed */}
                        <div className={`
                            lg:hidden transition-all duration-300 ease-in-out
                            ${isSidebarOpen 
                                ? 'opacity-0 transform scale-95 pointer-events-none' 
                                : 'opacity-100 transform scale-100'
                            }
                        `}>
                            <Link href="/Dashboard">
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <div className="bg-[#6B46C1] p-2 rounded flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                        </svg>
                                    </div>
                                    <div className="font-bold text-base tracking-tight">
                                        <span className="text-[#A78BFA]">Game</span>
                                        <span className="text-white">Vault</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Right side navigation */}
                    <div className="flex items-center gap-6">
                        {/* User profile button */}
                        <SignedIn>
                            <UserButton 
                                afterSignOutUrl="/" 
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10"
                                    }
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <button className="bg-[#6B46C1] text-white px-4 py-2 rounded">Sign In</button>
                        </SignedOut>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className={`
                    flex-1 overflow-auto bg-[#121212] p-6 transition-all duration-300 ease-in-out
                    ${isSidebarOpen && 'lg:filter-none filter brightness-75 pointer-events-none lg:pointer-events-auto'}
                `}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;