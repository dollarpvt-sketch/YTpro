import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import CustomGoogleSignInButton from './CustomGoogleSignInButton';
import { YouTubeIcon, LayoutGridIcon, DocumentTextIcon, StarIcon, PlusIcon, InformationCircleIcon } from './IconComponents';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onFooterLinkClick: (pageId: string) => void;
}

const NavLink: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean; onClick?: () => void;}> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-secondary/50 hover:text-text-main'
    }`}>
        {icon}
        <span>{label}</span>
    </button>
);


const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onFooterLinkClick }) => {
    const { user } = useAuth();

    // In a real app, this state would be managed by a routing library
    const [activePage, setActivePage] = useState('home'); 

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-card border-r border-secondary flex flex-col">
                <div className="flex items-center gap-2 h-16 border-b border-secondary px-4">
                    <YouTubeIcon className="w-7 h-7 text-primary" />
                    <span className="text-lg font-bold text-text-main">YT Pro Tools</span>
                </div>

                <div className="p-4 flex-grow">
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm transition-transform hover:scale-105">
                        <PlusIcon className="w-5 h-5"/>
                        Tạo mới
                    </button>
                    
                    <nav className="mt-6 space-y-2">
                        <NavLink 
                            icon={<LayoutGridIcon className="w-5 h-5"/>} 
                            label="Bảng điều khiển" 
                            isActive={activePage === 'home'}
                            onClick={() => setActivePage('home')}
                        />
                         <NavLink 
                            icon={<DocumentTextIcon className="w-5 h-5"/>} 
                            label="Dự án của tôi" 
                            isActive={activePage === 'projects'}
                            onClick={() => setActivePage('projects')}
                        />
                         <NavLink 
                            icon={<StarIcon className="w-5 h-5"/>} 
                            label="Nâng cấp Pro" 
                            isActive={activePage === 'pro'}
                            onClick={() => setActivePage('pro')}
                        />
                    </nav>
                </div>
                
                 <div className="p-4 border-t border-secondary">
                     <NavLink 
                        icon={<InformationCircleIcon className="w-5 h-5"/>} 
                        label="Về chúng tôi" 
                        onClick={() => onFooterLinkClick('about')}
                    />
                 </div>

            </aside>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                 {/* Header */}
                 <header className="flex items-center justify-end h-16 border-b border-secondary px-6 flex-shrink-0">
                    {user ? (
                        <ProfileDropdown />
                    ) : (
                        <CustomGoogleSignInButton>
                            Đăng nhập / Đăng ký
                        </CustomGoogleSignInButton>
                    )}
                 </header>

                 {/* Scrollable Content Area */}
                 <main className="flex-1 overflow-y-auto">
                    {children}
                 </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
