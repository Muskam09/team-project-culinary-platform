import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./RecipeCard.module.scss";
import flagIcon from "../assets/icon-park-outline_tag.svg";

interface RecipeCardProps {
  id?: string;
  title: string;
  author: string;
  complexity: string;
  time?: string;
  rating?: number;      // средний рейтинг
  votes?: number;       // общее количество голосов
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  author,
  complexity,
  time,
  rating = 0,
  votes = 0,
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const [totalVotes, setTotalVotes] = useState(votes);

  const handleStarClick = () => {
    // обновляем средний рейтинг (условно +1 за каждый клик)
    const newVotes = totalVotes + 1;
    const newRating = ((currentRating * totalVotes + 5) / newVotes); // добавляем "5" за клик
    setCurrentRating(newRating);
    setTotalVotes(newVotes);
  };

  return (
    <div className={styles.recipeCard}>
      <div className={styles.image}>
        <div className={styles.complexity}>{complexity}</div>
        <a href="https://www.facebook.com/" className={styles.flag}>
          <img src={flagIcon} alt="flag" />
        </a>
      </div>

      <Link to={`/recipe/${id}`} className={styles.titleLink}>
        <h2 className={styles.title}>{title}</h2>
      </Link>

      <div className={styles.cardInfo}>
        {time && <p className={styles.time}>⏱ {time}</p>}

        <div className={styles.rating} onClick={handleStarClick}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingValue}>
            {currentRating.toFixed(1)} ({totalVotes})
          </span>
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
