import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllRecipes } from "../data/recipes";
import type { Recipe } from "../data/recipes";
import RecipeCard from "../components/RecipeCard";
import Header from "../components/Header";
import { FaSearch } from "react-icons/fa";
import styles from "./CollectionPage.module.scss";
import iconBook from "../assets/menu_icon/icon-park-outline_notebook-one.svg"
import {ChevronDown} from "lucide-react";
import iconFilter from "../assets/icon-park-outline_center-alignment.svg"

interface Collection {
  id: string;
  name: string;
  recipes: { id: string; dateSaved: string }[];
}

const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const collections: Collection[] = JSON.parse(localStorage.getItem("savedCollections") || "[]");
  const collection = collections.find(c => c.id === id);

  if (!collection) return <p>Колекція не знайдена</p>;

  const savedRecipes: Recipe[] = collection.recipes
    .map(item => getAllRecipes().find(r => r.id === item.id))
    .filter((r): r is Recipe => r !== undefined);

  return (
    <main className={styles.main}>
<Header
  showSearch={false}
  customSearch={
    <div className={styles.customSearchWrapper}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        className={styles.customSearch}
        placeholder="Пошук…"
      />
    </div>
  }
  showBackButton
  backButtonLabel="До колекцій"   // 👈 свой текст
  onBackClick={() => navigate(-1)}
/>

      {/* Информация о коллекции: название + количество рецептов */}
      <div className={styles.collectionInfoLine}>
        <div className={styles.collectionNameBlock}>
        <h1 className={styles.collectionName}>{collection.name}</h1>
        <div className={styles.recipeCountBlock}>
          <img src={iconBook} alt="book"/>
        <p className={styles.recipeCount}>
          {savedRecipes.length} {savedRecipes.length === 1 ? "рецепт" : "рецептів"}
        </p>
        </div>
        </div>
             <div className={styles.SortButtonBlock}>
            <button className={styles.SortButton}>
          Сортувати за <ChevronDown size={16} />
        </button>
              <button className={styles.filterButton}>
          Фільтр
          <img src={iconFilter} alt="filter" />
        </button>
         </div>
      </div>

      {/* Сетка с рецептами */}
      {savedRecipes.length === 0 ? (
        <p className={styles.empty}>Колекція порожня</p>
      ) : (
        <div className={styles.recipesGrid}>
          {savedRecipes.map(recipe => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </main>
  );
};

export default CollectionPage;
