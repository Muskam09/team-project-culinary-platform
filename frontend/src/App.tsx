import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import RecipePage from "./pages/RecipePage";
import styles from "./App.module.scss";

const App: React.FC = () => {
  return (
<Router>
  <div className={styles.app}>
    <Sidebar />
    <div className={styles.content}>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipePage title="" author="" tag="" />} />
        </Routes>
      </main>
    </div>
  </div>
</Router>

  );
};

export default App;
