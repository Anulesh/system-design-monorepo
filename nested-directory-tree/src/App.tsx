import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { FolderComponent } from "./components/FolderComponent";
import { folderList } from "./data/Api";

function App() {
  return (
    <div className="App">
      <FolderComponent {...folderList} />
    </div>
  );
}

export default App;
