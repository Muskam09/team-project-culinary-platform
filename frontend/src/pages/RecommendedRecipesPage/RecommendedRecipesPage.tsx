// src/pages/RecommendedRecipesPage.tsx
import React, {
  useState, useMemo, useRef, useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowDown, ChevronLeft } from 'lucide-react';
import Header from '../../components/Header/Header';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { recommendedRecipes } from '../../data/recipes';
import styles from './RecommendedRecipesPage.module.scss';
import iconFilter from '../../assets/icon-park-outline_center-alignment.svg';
import FilterModal from '../../components/FilterModal/FilterModal';

type SortOption = 'popularity' | 'rating' | 'time' | 'complexity' | 'newest';

const sortLabels: Record<SortOption, string> = {
  popularity: 'За популярністю',
  rating: 'За рейтингом',
  time: 'За часом приготування',
  complexity: 'За складністю',
  newest: 'За новизною',
};

const complexityOrder: Record<string, number> = {
  Легко: 1,
  Помірно: 2,
  Складно: 3,
};

function parseTime(time?: string): number {
  if (!time) return Infinity;
  const hoursMatch = time.match(/(\d+)\s*год/);
  const minutesMatch = time.match(/(\d+)\s*хв/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  return hours * 60 + minutes;
}

const RecommendedRecipesPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    cuisines?: string[];
    category?: string;
    time?: string;
    complexity?: string;
    diet?: string;
  }>({});

  // --- Новый код для клика вне дропдауна ---
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownOpen
        && menuRef.current
        && !menuRef.current.contains(event.target as Node)
        && buttonRef.current
        && !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  // -----------------------------------------

  const sortedRecipes = useMemo(() => [...recommendedRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      case 'time':
        return parseTime(a.time) - parseTime(b.time);
      case 'complexity':
        return (complexityOrder[a.complexity] ?? 99) - (complexityOrder[b.complexity] ?? 99);
      case 'newest':
        return parseInt(b.id.replace(/\D/g, ''), 10) - parseInt(a.id.replace(/\D/g, ''), 10);
      case 'popularity':
      default:
        return (b.rating ?? 0) - (a.rating ?? 0);
    }
  }), [sortBy]);

  const filteredRecipes = useMemo(() => sortedRecipes.filter((r) => {
    if (filters.cuisines?.length && !filters.cuisines.includes(r.cuisine || '')) return false;
    if (filters.category && r.category?.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.time) {
      const match = filters.time.match(/(\d+)/);
      if (match && parseTime(r.time) > parseInt(match[1])) return false;
    }
    if (filters.complexity && r.complexity !== filters.complexity) return false;
    if (filters.diet && !r.diet?.includes(filters.diet)) return false;
    return true;
  }), [sortedRecipes, filters]);

  const displayedRecipes = showAll ? filteredRecipes : filteredRecipes.slice(0, 12);

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ChevronLeft />
          {' '}
          До рецептів
        </button>
        <div className={styles.headerBlock}>
          <h1>Рекомендовано для тебе</h1>
          <div className={styles.headerButtonBlock}>
            <div className={styles.sortWrapper}>
              <button
                ref={buttonRef}
                className={styles.SortButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Сортувати за
                {' '}
                <ChevronDown size={24} />
              </button>
              {dropdownOpen && (
                <div ref={menuRef} className={styles.dropdownMenu}>
                  {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                    <div
                      key={option}
                      className={`${styles.dropdownItem} ${sortBy === option ? styles.activeItem : ''}`}
                      onClick={() => { setSortBy(option); setDropdownOpen(false); }}
                    >
                      {sortLabels[option]}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={styles.filterButton} onClick={() => setFilterModalOpen(true)}>
              Фільтр
              <img src={iconFilter} alt="filter" />
            </button>
          </div>
        </div>

        {filters.cuisines?.length || filters.category || filters.time || filters.complexity || filters.diet ? (
          <div className={styles.selectedFilters}>
            <button
              className={styles.clearFiltersButton}
              onClick={() => setFilters({
                cuisines: [], category: '', time: '', complexity: '', diet: '',
              })}
            >
              Очистити
            </button>

            {filters.cuisines?.map((c) => <span key={c} className={styles.filterTag}>{c}</span>)}
            {filters.category && <span className={styles.filterTag}>{filters.category}</span>}
            {filters.time && <span className={styles.filterTag}>{filters.time}</span>}
            {filters.complexity && <span className={styles.filterTag}>{filters.complexity}</span>}
            {filters.diet && <span className={styles.filterTag}>{filters.diet}</span>}
          </div>
        ) : null}

        <div className={styles.grid}>
          {displayedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>

        {!showAll && filteredRecipes.length > 12 && (
          <button className={styles.allButton} onClick={() => setShowAll(true)}>
            Показати більше
            {' '}
            <ArrowDown size={24} />
          </button>
        )}

        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={(f) => { setFilters(f); setFilterModalOpen(false); }}
        />
      </div>
    </main>
  );
};

export default RecommendedRecipesPage;
