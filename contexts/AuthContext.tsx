import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Extend the global window interface to include google accounts
declare global {
  interface Window {
    google: any;
    process: {
      env: {
        GOOGLE_CLIENT_ID: string;
        API_KEY: string;
      }
    }
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  affiliateId: string | null;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT
const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error("Error decoding JWT", e);
    return null;
  }
};


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // On component mount, check for referral code and saved user session
  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('yt-pro-tools-ref', refCode);
      console.log(`Referral code detected and saved: ${refCode}`);
    }

    // Check localStorage for a saved user session
    try {
      const savedUser = localStorage.getItem('yt-pro-tools-user');
      if (savedUser) {
        const parsedUser: User = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('yt-pro-tools-user'); // Clear corrupted data
    }
  }, []);


  const handleCredentialResponse = (response: any) => {
    const idToken = response.credential;
    const decodedToken = decodeJwt(idToken);
    
    if (decodedToken) {
      const newUser: User = {
        id: decodedToken.sub, // Google's unique ID for the user
        name: decodedToken.name,
        email: decodedToken.email,
        avatar: decodedToken.picture,
      };
      
      // Persist user data in the browser to keep them logged in
      localStorage.setItem('yt-pro-tools-user', JSON.stringify(newUser));
      setUser(newUser);

      // --- REAL AFFILIATE ATTRIBUTION ---
      // Check if there's a referral code stored
      const refCode = localStorage.getItem('yt-pro-tools-ref');
      if (refCode) {
        console.log(`New user signup: ${newUser.email}. Attributed to referrer ID: ${refCode}.`);
        console.log('SENDING THIS INFO TO BACKEND TO CREDIT AFFILIATE');
        // Example API call to credit the affiliate:
        // fetch('https://your-backend.com/api/affiliate/credit', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ newUserId: newUser.id, referrerId: refCode }),
        // });
        
        // It's good practice to clear the referral code after it's used
        localStorage.removeItem('yt-pro-tools-ref');
      } else {
         console.log('New user signup:', newUser.email);
      }
    }
  };

  useEffect(() => {
    // Polling function to check for dependencies
    const scriptLoadCheck = setInterval(() => {
      const clientId = window.process?.env?.GOOGLE_CLIENT_ID;

      if (window.google?.accounts?.id && clientId) {
        clearInterval(scriptLoadCheck);

        if (clientId === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
          console.warn("Google Client ID is not set. Please update env.js");
          return;
        }

        // Initialize Google Sign-In, which is needed for the button rendering and callback handling
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });
        
        // This is important for the one-tap sign-in experience on subsequent visits
        window.google.accounts.id.prompt();

      }
    }, 100);

    return () => clearInterval(scriptLoadCheck);
  }, []);
  
  const signIn = () => {
    if (window.google?.accounts?.id) {
       window.google.accounts.id.prompt();
    } else {
        console.error("Google Sign-In not ready.");
    }
  };

  const signOut = () => {
    if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('yt-pro-tools-user');
    setUser(null);
  };

  const affiliateId = user ? btoa(user.email) : null;

  return (
    <AuthContext.Provider value={{ user, affiliateId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
