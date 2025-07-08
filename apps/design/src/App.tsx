import "./index.css";
import "./App.css";
import { Designer } from "./components/designer";
import { LeftPanel } from "./components/left-panel";
import { RightPanel } from "./components/right-panel";
import { AppContextProvider } from "./contexts/app-context";

function App() {
  return (
    <AppContextProvider>
      <div className="w-full h-full flex">
        <LeftPanel />
        <Designer />
        <RightPanel />
      </div>
    </AppContextProvider>
  );
}

export default App;
