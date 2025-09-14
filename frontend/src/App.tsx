// App.tsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import RecipesPage from "./pages/RecipePage";
import RecipePage from "./pages/RecipePage";
import ProductInfoPage from "./pages/ProductInfoPage";
import MealPlannerPage from "./pages/MealPlannerPage";
import SavedPage from "./pages/SavedPage";
import CollectionPage from "./pages/CollectionPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import ShoppingListDetailPage from "./pages/ShoppingListDetailPage";
import SettingsPage from "./pages/SettingsPage"; 
import styles from "./App.module.scss";
import HelpPage from "./pages/HelpPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Sidebar />
        <div className={styles.content}>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/product/:id" element={<ProductInfoPage />} />
              <Route path="/planner" element={<MealPlannerPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/collection/:id" element={<CollectionPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/shopping-list/:id" element={<ShoppingListDetailPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
