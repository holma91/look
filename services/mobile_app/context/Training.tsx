import React, { ReactNode, useState } from 'react';

interface TrainingContextProps {
  isTraining: boolean;
  setIsTraining: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TrainingContext = React.createContext<TrainingContextProps>({
  isTraining: false,
  setIsTraining: () => {},
});

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [isTraining, setIsTraining] = useState(false);

  return (
    <TrainingContext.Provider value={{ isTraining, setIsTraining }}>
      {children}
    </TrainingContext.Provider>
  );
};
