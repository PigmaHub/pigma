import "./index.css";
import "./App.css";
import { Designer } from "./components/designer";
import { LeftPanel } from "./components/left-panel";
import { RightPanel } from "./components/right-panel";

function App() {
  return (
    <div className="w-full h-full flex">
      <LeftPanel />
      <Designer />
      <RightPanel />
    </div>
  );
}

export default App;
