import React, { ReactNode, useState } from 'react';

interface DarkModeContextProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DarkModeContext = React.createContext<DarkModeContextProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
