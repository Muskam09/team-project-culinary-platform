// src/pages/ProfilePage/ProfilePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Plus, FilePen, Files } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import CreateRecipeModal from '../../components/CreateRecipeModal/CreateRecipeModal';
import styles from './ProfilePage.module.scss';
import iconEdit from '../../assets/icon-park-outline_edit.svg';
import type { Recipe } from '../../data/recipes';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'recipes'>('recipes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drafts, setDrafts] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('userDrafts');
    return saved ? JSON.parse(saved) : [];
  });
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('userRecipes');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const savedProfile = localStorage.getItem('profileData');
  const profile = savedProfile ? JSON.parse(savedProfile) : null;

  const [isDraftMenuOpen, setIsDraftMenuOpen] = useState(false);
  const [isRecipeMenuOpen, setIsRecipeMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const userStats = {
    recipes: recipes.length,
    followers: 120,
    following: 45,
  };

  type NewRecipeInput = {
    title: string;
    description: string;
    ingredients: string[];
    image?: string | null;
    complexity?: string;
    time?: string;
    rating?: number;
  };

  const handleCreateRecipe = (newRecipe: NewRecipeInput) => {
    const recipeWithId: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      author: profile?.firstName || 'User',
      authorImage: profile?.avatar || '',
      complexity: newRecipe.complexity || 'Легко',
      time: newRecipe.time || '30 хв',
      rating: newRecipe.rating ?? 0,
    };

    if (activeTab === 'drafts') {
      const updatedDrafts = [...drafts, recipeWithId];
      setDrafts(updatedDrafts);
      localStorage.setItem('userDrafts', JSON.stringify(updatedDrafts));
    } else {
      const updatedRecipes = [...recipes, recipeWithId];
      setRecipes(updatedRecipes);
      localStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
    }

    setIsModalOpen(false);
  };

  // Перенос одного черновика в рецепты
  const handleMoveDraftToRecipes = (id: string) => {
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;
    setDrafts(prev => prev.filter(d => d.id !== id));
    setRecipes(prev => [...prev, draft]);
    localStorage.setItem('userDrafts', JSON.stringify(drafts.filter(d => d.id !== id)));
    localStorage.setItem('userRecipes', JSON.stringify([...recipes, draft]));
  };

  // Перенос одного рецепта в черновики
  const handleMoveRecipeToDrafts = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    setRecipes(prev => prev.filter(r => r.id !== id));
    setDrafts(prev => [...prev, recipe]);
    localStorage.setItem('userRecipes', JSON.stringify(recipes.filter(r => r.id !== id)));
    localStorage.setItem('userDrafts', JSON.stringify([...drafts, recipe]));
  };

  // Удаление
  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
    localStorage.setItem('userDrafts', JSON.stringify(drafts.filter(d => d.id !== id)));
  };
  const handleDeleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    localStorage.setItem('userRecipes', JSON.stringify(recipes.filter(r => r.id !== id)));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDraftMenuOpen(false);
        setIsRecipeMenuOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock1}>
        <div className={styles.mainBlock}>
          {/* --- Профиль --- */}
          <div className={styles.headerBlock}>
            <div className={styles.profileImage} style={{ backgroundImage: `url(${profile?.avatar || ''})` }} />
            <div className={styles.headerInfo}>
              <div className={styles.profileNameBlock}>
                <h1 className={styles.profileName}>{profile?.firstName || 'My name'}</h1>
                <p className={styles.userName}>{profile?.username || '_user.name'}</p>
              </div>
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{userStats.recipes}</span>
                  <span className={styles.statLabel}>Рецепти</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{userStats.followers}</span>
                  <span className={styles.statLabel}>Підписники</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{userStats.following}</span>
                  <span className={styles.statLabel}>Підписок</span>
                </div>
              </div>
              <div className={styles.biography}>{profile?.bio || 'my_biography'}</div>
            </div>

            <div className={styles.headerButtons}>
              <button className={styles.editButton} onClick={() => navigate('/edit-profile')}>
                Редагувати
                <img className={styles.iconEdit} src={iconEdit} alt="edit" />
              </button>
              <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                Додати рецепт
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* --- Навигация --- */}
          <div className={styles.navTabsBlock}>
            <div className={styles.navTabs} ref={dropdownRef}>
              {/* Чернетки */}
              <div className={styles.navTabWrapper}>
                <button
                  className={`${styles.navTab} ${activeTab === 'drafts' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('drafts')}
                >
                  Чернетки
                  <FilePen
                    size={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDraftMenuOpen(prev => !prev);
                    }}
                  />
                </button>
                {isDraftMenuOpen && (
                  <div className={styles.popupMenu}>
                    {drafts.map(d => (
                      <div key={d.id} className={styles.menuItem}>
                        <span className={styles.menuTitle}>{d.title}</span>
                        <button onClick={() => handleMoveDraftToRecipes(d.id)}>Перенести</button>
                        <button onClick={() => handleDeleteDraft(d.id)}>Видалити</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Мої рецепти */}
              <div className={styles.navTabWrapper}>
                <button
                  className={`${styles.navTab} ${activeTab === 'recipes' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('recipes')}
                >
                  Мої рецепти
                  <Files
                    size={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRecipeMenuOpen(prev => !prev);
                    }}
                  />
                </button>
                {isRecipeMenuOpen && (
                  <div className={styles.popupMenu}>
                    {recipes.map(r => (
                      <div key={r.id} className={styles.menuItem}>
                        <span className={styles.menuTitle}>{r.title}</span>
                        <button onClick={() => handleMoveRecipeToDrafts(r.id)}>Перенести</button>
                        <button onClick={() => handleDeleteRecipe(r.id)}>Видалити</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Контент */}
            <div className={styles.tabContent}>
              {activeTab === 'drafts' ? (
                drafts.length > 0 ? (
                  <div className={styles.recipeGrid}>
                    {drafts.map(recipe => <RecipeCard key={recipe.id} {...recipe} />)}
                  </div>
                ) : (
                  <p>Чернеток поки немає</p>
                )
              ) : recipes.length > 0 ? (
                <div className={styles.recipeGrid}>
                  {recipes.map(recipe => <RecipeCard key={recipe.id} {...recipe} />)}
                </div>
              ) : (
                <p>Поки що немає рецептів</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Модалка --- */}
      {isModalOpen && <CreateRecipeModal onClose={() => setIsModalOpen(false)} onCreate={handleCreateRecipe} />}
    </main>
  );
};

export default ProfilePage;
