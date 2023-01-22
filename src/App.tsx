import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import CustomTable from "./components/table";
import { columns, rows } from "./data";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <CustomTable rows={rows} columns={columns} />
    </div>
  );
}

export default App;
