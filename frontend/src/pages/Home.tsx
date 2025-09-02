import React from "react";
import Header from "../components/Header";
import RecipeCard from "../components/RecipeCard";
import AuthorCard from "../components/AuthorCard";
import FreshProductsBanner from "../components/FreshProductsBanner";
import styles from "./Home.module.scss";
import { ChevronRight } from "lucide-react";

interface Recipe {
  id?: string;
  title: string;
  author: string;
  complexity: string;
  time?: string; 
  rating?: number;
}

interface Author {
  name: string;
  profession: string;
   recipesCount?: number;
  followers?: number;
}

interface Section {
  title: string;
  type: "recipes" | "authors";
  items: Recipe[] | Author[];
}

// Генерация уникального id
const generateId = () => Math.random().toString(36).substring(2, 9);

const sections: Section[] = [
  {
    title: "Рекомендовано для тебе",
    type: "recipes",
    items: [
      { title: "Молода капуста з хрумким томатом", author: "Юлія Романенко", complexity: "Легко", time: "45 хв", rating: 4.7 },
      { title: "Сирна шарлотка з яблуками", author: "Марія Шевченко", complexity: "Складно", time: "1 год 30 хв", rating: 4.3 },
      { title: "Перець з куркою у духовці", author: "Юлія Романенко", complexity: "Помірно", time: "1 год 15 хв", rating: 4.9 },
    ],
  },
  {
    title: "Популярне зараз",
    type: "recipes",
    items: [
      { title: "Лазанья з овочами для всієї родини", author: "Дмитро Савченко", complexity: "Легко", time: "45 хв", rating: 4.7 },
      { title: "Суп-пюре з броколі та сиром ", author: "Юлія Мельник", complexity: "Складно", time: "1 год 30 хв", rating: 4.3 },
      { title: "Швидка паста з куркою та овочами", author: "Софія Дорошенко", complexity: "Помірно", time: "1 год 15 хв", rating: 4.9 },
    ],
  },
  {
    title: "Популярні автори",
    type: "authors",
    items: [
      { name: "Юлія Романенко", profession: "Веган-шеф",  recipesCount: 356, followers: 32500 },
      { name: "Марія Левченко", profession: "Шеф-кухар",  recipesCount: 278, followers: 22400 },
      { name: "Катерина Бондар", profession: "Експерт з випічки", recipesCount: 230, followers: 22100 },
      { name: "Юлія Романенко", profession: "Фітнес-нутриціолог", recipesCount: 189, followers: 12500 },
    ],
  },
];

const summerOffers: Recipe[] = [
  { title: "Фруктовий салат із полуницею та персиками", author: "Лілія Климчук", complexity: "Легко", time: "45 хв", rating: 4.7 },
  { title: "Печені персики з медом і горіхами", author: "Марія Шевченко", complexity: "Складно", time: "1 год 30 хв", rating: 4.3 },
  { title: "Кабачкові оладки з зеленню", author: "Юлія Романенко", complexity: "Помірно", time: "1 год 15 хв", rating: 4.9 },
];

const Home: React.FC = () => {
  return (
    <main className={styles.main}>
      <Header />
      <FreshProductsBanner />

      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
      <h2>{section.title}</h2>
      <button className={styles.allButton}>Всі <ChevronRight size={18} /></button>
    </div>
            <div className={section.type === "recipes" ? styles["grid-recipes"] : styles["grid-authors"]}>
              {section.type === "recipes"
                ? (section.items as Recipe[]).map((recipe) => {
                    const id = recipe.id || generateId();
                    return <RecipeCard key={id} {...recipe} />;
                  })
                : (section.items as Author[]).map((author, idx) => (
                     <AuthorCard
                     key={idx}
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
      <button className={styles.allButton}>Всі <ChevronRight size={18} /></button>
    </div>
              <div className={styles["grid-recipes"]}>
                {summerOffers.map((recipe) => {
                  const id = generateId();
                  return <RecipeCard key={id} {...recipe} />;
                })}
              </div>
            </section>
          )}
        </React.Fragment>
      ))}
    </main>
  );
};

export default Home;
