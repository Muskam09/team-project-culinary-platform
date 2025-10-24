/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
// Home.tsx
import React, { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import AuthorCard from '../../components/AuthorCard/AuthorCard';
import FreshProductsBanner from '../../components/FreshProductsBanner/FreshProductsBanner';
import styles from './Home.module.scss';
import { sections, summerOffers } from '../../data/recipes';
import type { Recipe, Author } from '../../data/recipes';

// eslint-disable-next-line react/function-component-definition
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery] = useState('');

  // Фильтрация секций по поисковому запросу
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    return sections.map((section) => {
      if (section.type === 'recipes') {
        const filteredItems = (section.items as Recipe[]).filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return { ...section, items: filteredItems };
      }
      const filteredItems = (section.items as Author[]).filter((author) => author.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return { ...section, items: filteredItems };
    });
  }, [searchQuery]);

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <FreshProductsBanner />

        {filteredSections.map((section, index) => (
          <React.Fragment key={index}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>{section.title}</h2>
                <button
                  className={styles.allButton}
                  onClick={() => section.link && navigate(section.link)}
                >
                  Всі
                  {' '}
                  <ChevronRight size={18} />
                </button>
              </div>

              <div
                className={
                section.type === 'recipes'
                  ? styles['grid-recipes']
                  : styles['grid-authors']
              }
              >
                {section.type === 'recipes'
                  ? (section.items as Recipe[]).slice(0, 3).map((recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))
                  : (section.items as Author[]).slice(0, 4).map((author) => (
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
            </section>

            {section.title === 'Популярне зараз' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Літні сезонні пропозиції</h2>
                <button
                  className={styles.allButton}
                  onClick={() => navigate('/recipes/summer-offers')}
                >
                  Всі
                  {' '}
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className={styles['grid-recipes']}>
                {summerOffers
                  .filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 3)
                  .map((recipe) => (
                    <RecipeCard key={recipe.id} {...recipe} />
                  ))}
              </div>
            </section>
            )}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
};

export default Home;
