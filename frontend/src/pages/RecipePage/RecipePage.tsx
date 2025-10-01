// src/pages/RecipesPage.tsx
import React, {
  useState, useMemo, useRef, useEffect,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowDown } from 'lucide-react';
import Header from '../../components/Header/Header';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import styles from './RecipesPage.module.scss';
import { sections, summerOffers } from '../../data/recipes';
import type { Recipe } from '../../data/recipes';
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

const getAllRecipes = (): Recipe[] => {
  const sectionRecipes = sections
    .filter((s) => s.type === 'recipes')
    .flatMap((s) => s.items as Recipe[]);
  return [...sectionRecipes, ...summerOffers];
};

interface Collection {
  id: string;
  name: string;
  recipes: { id: string; dateSaved: string }[];
}

const RecipesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collectionId = location.state?.collectionId;

  const allRecipes = getAllRecipes();

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

  const sortedRecipes = useMemo(() => [...allRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      case 'time':
        return parseTime(a.time) - parseTime(b.time);
      case 'complexity':
        return (
          (complexityOrder[a.complexity] ?? 99)
            - (complexityOrder[b.complexity] ?? 99)
        );
      case 'newest':
        return (
          parseInt(b.id.replace(/\D/g, ''), 10)
            - parseInt(a.id.replace(/\D/g, ''), 10)
        );
      case 'popularity':
      default:
        return (b.rating ?? 0) - (a.rating ?? 0);
    }
  }), [sortBy, allRecipes]);

  const filteredRecipes = useMemo(() => sortedRecipes.filter((r) => {
    if (filters.cuisines && filters.cuisines.length > 0) {
      if (!r.cuisine || !filters.cuisines.includes(r.cuisine)) return false;
    }
    if (filters.category) {
      if (!r.category || !r.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    }
    if (filters.time) {
      const match = filters.time.match(/до\s*(\d+)\s*хв/);
      if (match) {
        const maxMinutes = parseInt(match[1], 10);
        if (parseTime(r.time) > maxMinutes) return false;
      }
    }
    if (filters.complexity) {
      if (!r.complexity || r.complexity !== filters.complexity) return false;
    }
    if (filters.diet) {
      if (!r.diet || !r.diet.includes(filters.diet)) return false;
    }
    return true;
  }), [sortedRecipes, filters]);

  const displayedRecipes = showAll
    ? filteredRecipes
    : filteredRecipes.slice(0, 9);

  const handleSelectRecipe = (recipe: Recipe) => {
    if (collectionId) {
      const savedCollections: Collection[] = JSON.parse(localStorage.getItem('savedCollections') || '[]');
      const updatedCollections = savedCollections.map((col) => {
        if (col.id === collectionId) {
          if (!col.recipes.some((r) => r.id === recipe.id)) {
            col.recipes.push({ id: recipe.id, dateSaved: new Date().toISOString() });
          }
        }
        return col;
      });
      localStorage.setItem('savedCollections', JSON.stringify(updatedCollections));
      navigate(`/collection/${collectionId}`);
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <div className={styles.headerBlock}>
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
                      onClick={() => {
                        setSortBy(option);
                        setDropdownOpen(false);
                      }}
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

        {/* Под кнопкой фильтра */}
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

            {filters.cuisines?.map((c) => (
              <span key={c} className={styles.filterTag}>{c}</span>
            ))}
            {filters.category && <span className={styles.filterTag}>{filters.category}</span>}
            {filters.time && <span className={styles.filterTag}>{filters.time}</span>}
            {filters.complexity && <span className={styles.filterTag}>{filters.complexity}</span>}
            {filters.diet && <span className={styles.filterTag}>{filters.diet}</span>}
          </div>
        ) : null}

        <div className={styles.grid}>
          {displayedRecipes.map((recipe) => (
            <div key={recipe.id} onClick={() => handleSelectRecipe(recipe)} style={{ cursor: 'pointer' }}>
              <RecipeCard {...recipe} />
            </div>
          ))}
        </div>

        {!showAll && filteredRecipes.length > 9 && (
          <button className={styles.allButton} onClick={() => setShowAll(true)}>
            Показати більше
            {' '}
            <ArrowDown size={24} />
          </button>
        )}

        <FilterModal
          isOpen={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          onApply={(f) => {
            setFilters(f);
            setFilterModalOpen(false);
          }}
        />
      </div>
    </main>
  );
};

export default RecipesPage;
