import React from "react";

import Graphs from "graphs";
import SideBar from "components/SideBar";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.root}>
      <SideBar />
      <Graphs />
    </div>
  );
}

export default App;
