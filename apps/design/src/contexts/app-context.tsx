import { Application } from "@pigma/engine";
import { createContext, FC, ReactNode, useContext, useState } from "react";

interface AppContextType {
  engine: Application;
  updateEngine: (engine: Application) => void;
}

export const AppContext = createContext<AppContextType>(null!);

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [engine, setEngine] = useState<Application>(null!);

  const updateEngine = (engine: Application) => {
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
