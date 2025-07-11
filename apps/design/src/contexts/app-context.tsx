import { Pigma } from "@pigma/engine";
import { createContext, FC, ReactNode, useContext, useState } from "react";

interface AppContextType {
  engine: Pigma;
  updateEngine: (engine: Pigma) => void;
}

export const AppContext = createContext<AppContextType>(null!);

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [engine, setEngine] = useState<Pigma>(null!);

  const updateEngine = (engine: Pigma) => {
    setEngine(engine);
  };

  return (
    <AppContext.Provider value={{ engine, updateEngine }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
