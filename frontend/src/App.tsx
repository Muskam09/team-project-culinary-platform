/* eslint-disable react/function-component-definition */
/* eslint-disable import/no-duplicates */
// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import RecipesPage from './pages/RecipePage/RecipePage';
import RecipePage from './pages/RecipePage/RecipePage';
import ProductInfoPage from './pages/ProductInfoPage/ProductInfoPage';
import MealPlannerPage from './pages/MealPlannerPage/MealPlannerPage';
import SavedPage from './pages/SavedPage/SavedPage';
import CollectionPage from './pages/CollectionPage/CollectionPage';
import ShoppingListPage from './pages/ShoppingListPage/ShoppingListPage';
import ShoppingListDetailPage from './pages/ShoppingListDetailPage/ShoppingListDetailPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import styles from './App.module.scss';
import HelpPage from './pages/HelpPage/HelpPage';
import RecommendedRecipesPage from './pages/RecommendedRecipesPage/RecommendedRecipesPage';
import PopularRecipesPage from './pages/PopularRecipesPage/PopularRecipesPage';
import SummerOffersPage from './pages/SummerOffersPage/SummerOffersPage';
import AuthorsPage from './pages/AuthorsPage/AuthorsPage';
import PremiumPage from './pages/PremiumPage/PremiumPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EditProfilePage from './pages/EditProfilePage/EditProfilePage';
import AccountPage from './pages/AccountPage/AccountPage';
import MesagePage from './pages/MessagesPage/MessagesPage';
import CollectionsPage from './pages/SavedPage/SavedPage';

const App: React.FC = () => (
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
          <Route path="/recipes/recommended" element={<RecommendedRecipesPage />} />
          <Route path="/recipes/popular" element={<PopularRecipesPage />} />
          <Route path="/recipes/summer-offers" element={<SummerOffersPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/mesage" element={<MesagePage />} />
          <Route path="/collection" element={<CollectionsPage />} />
        </Routes>
      </main>
    </div>
  </div>
);

export default App;
