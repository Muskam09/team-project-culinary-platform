import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeCard.module.scss";
import flagIcon from "../assets/icon-park-outline_tag.svg";
import type { Recipe } from "../data/recipes";

interface RecipeCardProps extends Recipe {}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  author,
  complexity,
  time,
  rating = 0,
  image, 
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const navigate = useNavigate();

  const handleStarClick = () => {
    // просто демонстрация обновления рейтинга
    setCurrentRating((prev) => (prev + 5) / 2);
  };

  const handleFlagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) navigate(`/product/${id}`);
  };

  return (
    <div className={styles.recipeCard}>
      <div
        className={styles.image}
        style={{
          backgroundImage: image ? `url(${image})` : "none",
        }}
      >
        <div className={styles.complexity}>{complexity}</div>
        <button onClick={handleFlagClick} className={styles.flag}>
          <img src={flagIcon} alt="flag" />
        </button>
      </div>

      <h2 className={styles.title}>{title}</h2>

      <div className={styles.cardInfo}>
        {time && <p className={styles.time}>⏱ {time}</p>}

        <div className={styles.rating} onClick={handleStarClick}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingValue}>{currentRating.toFixed(1)}</span>
        </div>
      </div>
      <hr />
      <div className={styles.authorBlock}>
        <div className={styles.avatar}></div>
        <p className={styles.author}>{author}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
