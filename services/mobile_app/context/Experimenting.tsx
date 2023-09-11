import React, { ReactNode, useState } from 'react';

interface ExperimentingContextProps {
  isExperimenting: boolean;
  setIsExperimenting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ExperimentingContext =
  React.createContext<ExperimentingContextProps>({
    isExperimenting: false,
    setIsExperimenting: () => {},
  });

export const ExperimentingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isExperimenting, setIsExperimenting] = useState(true);

  return (
    <ExperimentingContext.Provider
      value={{ isExperimenting, setIsExperimenting }}
    >
      {children}
    </ExperimentingContext.Provider>
  );
};
