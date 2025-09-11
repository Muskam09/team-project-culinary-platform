import React from "react";
import Header from "../components/Header";
import RecipeCard from "../components/RecipeCard";
import AuthorCard from "../components/AuthorCard";
import FreshProductsBanner from "../components/FreshProductsBanner";
import styles from "./Home.module.scss";
import { ChevronRight } from "lucide-react";
import { sections, summerOffers } from "../data/recipes";
import type { Recipe, Author } from "../data/recipes";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.main}>
      <Header />
      <FreshProductsBanner />

      {sections.map((section, index) => (
  <React.Fragment key={index}>
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>{section.title}</h2>
        <button className={styles.allButton} onClick={() => navigate("/recipes")}>
          Всі <ChevronRight size={18} />
        </button>
      </div>

      <div
        className={
          section.type === "recipes"
            ? styles["grid-recipes"]
            : styles["grid-authors"]
        }
      >
        {section.type === "recipes"
          ? (section.items as Recipe[]).map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))
          : (section.items as Author[]).slice(0, 4).map((author) => (
              <AuthorCard
                key={author.id}
                name={author.name}
                profession={author.profession}
                recipesCount={author.recipesCount}
                followers={author.followers}
              />
            ))}
      </div>
    </section>

    {section.title === "Популярне зараз" && (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Літні сезонні пропозиції</h2>
          <button className={styles.allButton}>
            Всі <ChevronRight size={18} />
          </button>
        </div>
        <div className={styles["grid-recipes"]}>
          {summerOffers.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </section>
    )}
  </React.Fragment>
))}
    </main>
  );
};

export default Home;
