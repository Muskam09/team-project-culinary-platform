// src/pages/AuthorsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import AuthorCard from '../../components/AuthorCard/AuthorCard';
import { popularAuthors, getAllRecipes } from '../../data/recipes';
import styles from './AuthorsPage.module.scss';
import iconFilter from '../../assets/icon-park-outline_center-alignment.svg';
import AuthorFilterModal from '../../components/AuthorFilterModal/AuthorFilterModal';

const AuthorsPage: React.FC = () => {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<{ cuisines?: string[]; specialization?: string[] }>({});

  const allRecipes = getAllRecipes();

  const getCuisinesByAuthor = (authorName: string) => {
    const authorRecipes = allRecipes.filter((r) => r.author === authorName);
    const cuisines = authorRecipes.map((r) => r.cuisine).filter(Boolean) as string[];
    return Array.from(new Set(cuisines));
  };

  const filteredAuthors = popularAuthors
    .filter((author) => {
      if (filters.specialization && filters.specialization.length > 0) {
        if (!filters.specialization.includes(author.profession)) return false;
      }
      if (filters.cuisines && filters.cuisines.length > 0) {
        const authorCuisines = getCuisinesByAuthor(author.name);
        if (!authorCuisines.some((c) => filters.cuisines!.includes(c))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.followers || 0) - (a.followers || 0);
        case 'recipes':
          return (b.recipesCount || 0) - (a.recipesCount || 0);
        case 'newness':
        case 'engagement':
        default:
          return 0;
      }
    });

  const sortLabels: Record<string, string> = {
    popularity: 'Популярністю',
    recipes: 'Кількістю рецептів',
    newness: 'Новизною',
    engagement: 'Залученістю',
  };

  // Проверка, есть ли активные фильтры
  const hasActiveFilters = (filters.cuisines && filters.cuisines.length > 0)
    || (filters.specialization && filters.specialization.length > 0);

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ChevronLeft />
          {' '}
          До головної
        </button>
        <div className={styles.header}>
          <h1>Популярні автори</h1>
          <div className={styles.headerButtons}>
            {/* Сортування */}
            <div className={styles.sortWrapper}>
              <button className={styles.SortButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                Сортувати за
                {' '}
                <ChevronDown size={24} />
              </button>
              {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                {Object.entries(sortLabels).map(([key, label]) => (
                  <div
                    key={key}
                    className={`${styles.dropdownItem} ${sortBy === key ? styles.activeItem : ''}`}
                    onClick={() => {
                      setSortBy(key);
                      setDropdownOpen(false);
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              )}
            </div>

            {/* Фільтр */}
            <button className={styles.filterButton} onClick={() => setIsFilterOpen(true)}>
              Фільтр
              <img src={iconFilter} alt="filter" />
            </button>
          </div>
        </div>

        {/* Блок активных фильтров */}
        {hasActiveFilters && (
        <div className={styles.selectedFilters}>
          {filters.cuisines?.map((c) => (
            <span key={c} className={styles.filterTag} data-testid="active-filter-tag">{c}</span>
          ))}
          {filters.specialization?.map((s) => (
            <span key={s} className={styles.filterTag} data-testid="active-filter-tag">{s}</span>
          ))}
          <button
            className={styles.clearFiltersButton}
            onClick={() => setFilters({ cuisines: [], specialization: [] })}
          >
            Очистити
          </button>
        </div>
        )}

        <div className={styles.grid}>
          {filteredAuthors.map((author) => (
            <AuthorCard
              key={author.id}
              name={author.name}
              profession={author.profession}
              recipesCount={author.recipesCount}
              followers={author.followers}
              image={author.image}
            />
          ))}
        </div>

        {/* Модалка фільтра */}
        <AuthorFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(appliedFilters) => {
            setFilters(appliedFilters);
            setIsFilterOpen(false);
          }}
          availableCuisines={Array.from(
            new Set(
              getAllRecipes()
                .map((r) => r.cuisine)
                .filter((c): c is string => !!c),
            ),
          )}
        />
      </div>
    </main>
  );
};

export default AuthorsPage;
