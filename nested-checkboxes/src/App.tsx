import React from "react";
import "./App.css";
import { CheckBoxProvider } from "./CheckboxContext";
import { CheckBoxUI } from "./CheckBoxUI";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CheckBoxProvider>
        <CheckBoxUI />
        </CheckBoxProvider>
      </header>
    </div>
  );
}

export default App;
