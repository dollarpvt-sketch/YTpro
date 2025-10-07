import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, SpinnerIcon } from './IconComponents';

interface CustomGoogleSignInButtonProps {
    children: React.ReactNode;
    className?: string;
}

const CustomGoogleSignInButton: React.FC<CustomGoogleSignInButtonProps> = ({ children, className }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth();

    const handleClick = () => {
        setIsLoading(true);
        // We call the signIn function from the context which will trigger the Google prompt.
        // The loading state is mostly for immediate feedback. 
        // The actual user state change will be handled by the context upon successful login.
        signIn();
        // It's possible the user closes the prompt, we can handle that if needed,
        // but for now, we'll let the loading state persist until a login happens or the page reloads.
    };

    const baseClasses = "inline-flex items-center justify-center gap-3 px-4 py-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
    const defaultClasses = "bg-secondary border border-secondary text-text-main hover:bg-gray-700";

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`${baseClasses} ${className || defaultClasses}`}
        >
            {isLoading ? (
                <SpinnerIcon className="w-5 h-5 animate-spin" />
            ) : (
                <GoogleIcon className="w-5 h-5" />
            )}
            <span>{children}</span>
        </button>
    );
};

export default CustomGoogleSignInButton;