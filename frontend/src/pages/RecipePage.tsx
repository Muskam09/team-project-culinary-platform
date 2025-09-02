import React from "react";
import styles from "../components/RecipeCard.module.scss";

interface RecipeCardProps {
  title: string;
  author: string;
  tag: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ title, author, tag }) => {
  return (
    <div className={styles.recipeCard}>
      <div className={styles.image}></div>
      <span className={styles.tag}>{tag}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.author}>{author}</p>
    </div>
  );
};

export default RecipeCard;
