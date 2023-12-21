// AppContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  user: string;
  repoName: string;
  uid:string;
  setUserInfo: (user: string, repoName: string, uid:string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('');
  const [uid, setUid] = useState<string>('');

  const setUserInfo = (newUser: string, newRepoName: string, newUid: string) => {
    setUser(newUser);
    setRepoName(newRepoName);
    setUid(newUid);
  };

  return (
    <AppContext.Provider value={{ user, repoName: repoName, uid, setUserInfo }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export { AppProvider, useAppContext };
