import React, { ReactNode, useState } from 'react';

type Model = {
  id: string;
  name: string;
  imageUrl: string;
};

const startingModel: Model = {
  id: '1',
  name: 'White man',
  imageUrl: require('../assets/models/whiteman/1.png'),
};

interface TrainingContextProps {
  isTraining: boolean;
  setIsTraining: React.Dispatch<React.SetStateAction<boolean>>;
  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;
  trainedModels: number;
  setTrainedModels: React.Dispatch<React.SetStateAction<number>>;
  activeModel: Model;
  setActiveModel: React.Dispatch<React.SetStateAction<Model>>;
}

export const TrainingContext = React.createContext<TrainingContextProps>({
  isTraining: false,
  setIsTraining: () => {},
  remainingTime: 0,
  setRemainingTime: () => {},
  trainedModels: 0,
  setTrainedModels: () => {},
  activeModel: startingModel,
  setActiveModel: () => {},
});

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [trainedModels, setTrainedModels] = useState(0);
  const [activeModel, setActiveModel] = useState(startingModel);

  return (
    <TrainingContext.Provider
      value={{
        isTraining,
        setIsTraining,
        remainingTime,
        setRemainingTime,
        trainedModels,
        setTrainedModels,
        activeModel,
        setActiveModel,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
