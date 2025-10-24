import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecipeCard.module.scss';
import { Bookmark } from 'lucide-react';
import type { Recipe } from '../../data/recipes';
import iconTime from '../../assets/icon-park-outline_time.svg';
import iconStar from '../../assets/icon-park-outline_star.svg';

interface RecipeCardProps extends Recipe {
  highlightedTitle?: React.ReactNode;
  isModalView?: boolean;
}

interface SavedItem {
  id: string;
  title: string;
  category?: string;
  dateSaved: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  author,
  complexity,
  time,
  rating = 0,
  authorImage,
  image,
  highlightedTitle,
  isModalView,
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const navigate = useNavigate();

  const complexityColors: Record<string, string> = {
    Легко: 'rgba(46, 204, 113, 0.9)',
    Помірно: '#FFA500',
    Складно: '#FF4500',
  };

  const handleCardClick = () => {
    if (id) navigate(`/product/${id}`);
  };

  /** 🔖 Сохранение рецепта и переход на /saved (как в ProductInfoPage) */
  const handleSaveRecipe = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!id || !title) return;

    // читаем список сохранённых
    const saved: SavedItem[] = JSON.parse(localStorage.getItem('savedRecipes') || '[]');

    // проверяем, нет ли уже
    const alreadySaved = saved.some((item) => item.id === id);
    if (alreadySaved) {
      navigate('/saved');
      return;
    }

    // создаём новый объект
    const newItem: SavedItem = {
      id,
      title,
      dateSaved: new Date().toLocaleDateString(),
    };

    // сохраняем в localStorage
    localStorage.setItem('savedRecipes', JSON.stringify([...saved, newItem]));

    // переходим на страницу сохранённых
    navigate('/saved', { state: { addedRecipeId: id } });
  };

  return (
    <div
      className={`${styles.recipeCard} ${isModalView ? styles.modalCard : ''}`}
      data-testid="recipe-card"
      onClick={handleCardClick}
    >
      <div
        className={styles.image}
        style={{ backgroundImage: image ? `url(${image})` : 'none' }}
      >
        <div
          className={styles.complexity}
          style={{ backgroundColor: complexityColors[complexity] || '#ccc' }}
        >
          {complexity}
        </div>

        {/* 🔖 Флажок — сохраняет и переходит на /saved */}
        <button className={styles.flagButton} onClick={handleSaveRecipe}>
          <Bookmark size={20} className={styles.icon} />
        </button>
      </div>

      <h2 className={styles.title}>{highlightedTitle ?? title}</h2>

      <div className={styles.cardInfo}>
        {time && (
          <p className={styles.time}>
            <img src={iconTime} alt="time" /> {time}
          </p>
        )}

        <div
          className={styles.rating}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentRating((prev) => (prev + 5) / 2);
          }}
        >
          <span className={styles.star}>
            <img src={iconStar} alt="star" />
          </span>
          <span className={styles.ratingValue}>{currentRating.toFixed(1)}</span>
        </div>
      </div>

      <div className={styles.authorBlock}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: authorImage ? `url(${authorImage})` : 'none',
          }}
        />
        <p className={styles.author}>{author}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
