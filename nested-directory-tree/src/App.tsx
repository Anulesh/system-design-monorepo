import React from "react";
import "./App.css";
import { folderList } from "./data/Api";
import { FolderListingComponent } from "./pages/FolderListingComponent";

function App() {
  return (
    <div className="App">
      <FolderListingComponent {...folderList} />
    </div>
  );
}

export default App;
