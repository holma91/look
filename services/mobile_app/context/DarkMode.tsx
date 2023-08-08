import React from 'react';

interface DarkModeContextProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DarkModeContext = React.createContext<DarkModeContextProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},
});
