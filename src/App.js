import "./App.css";
import Reports from "./components/Reports/Reports";
import Dashboard from "./components/Reports/Dashboard"
import './index.css';

function App() {
  return (
    <div className="App">
      <Dashboard userId="user123" />
      {/* <Reports /> */}
    </div>
  );
}

export default App;
