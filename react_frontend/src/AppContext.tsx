// AppContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  user: string;
  repo_name: string;
  uid:string;
  setUserInfo: (user: string, repo_name: string, uid:string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string>('');
  const [repo_name, setRepoName] = useState<string>('');
  const [uid, setUid] = useState<string>('');

  const setUserInfo = (newUser: string, newRepoName: string, newUid: string) => {
    setUser(newUser);
    setRepoName(newRepoName);
    setUid(newUid);
  };

  return (
    <AppContext.Provider value={{ user, repo_name, uid, setUserInfo }}>
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
