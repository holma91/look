import React, { ReactNode, useState } from 'react';

interface TrainingContextProps {
  isTraining: boolean;
  setIsTraining: React.Dispatch<React.SetStateAction<boolean>>;
  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  trainedModels: number;
  setTrainedModels: React.Dispatch<React.SetStateAction<number>>;
}

export const TrainingContext = React.createContext<TrainingContextProps>({
  isTraining: false,
  setIsTraining: () => {},
  remainingTime: 0,
  setRemainingTime: () => {},
  trainedModels: 0,
  setTrainedModels: () => {},
});

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [trainedModels, setTrainedModels] = useState(0);

  return (
    <TrainingContext.Provider
      value={{
        isTraining,
        setIsTraining,
        remainingTime,
        setRemainingTime,
        trainedModels,
        setTrainedModels,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
