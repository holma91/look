import React, { ReactNode, useState } from 'react';

interface DemoContextProps {
  isDemo: boolean;
  setIsDemo: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DemoContext = React.createContext<DemoContextProps>({
  isDemo: false,
  setIsDemo: () => {},
});

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemo, setIsDemo] = useState(false);

  return (
    <DemoContext.Provider value={{ isDemo, setIsDemo }}>
      {children}
    </DemoContext.Provider>
  );
};
