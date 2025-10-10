import React, {
  useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent,
} from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/icon-park-outline_search.svg';
import styles from './Header.module.scss';
import type { Recipe, Author } from '../../data/recipes';
import { getAllRecipes, getAllAuthors } from '../../data/recipes';
import iconBell from '../../assets/iconBellDufault.svg';
import avatar from '../../assets/avatar.webp';
import type { Message } from '../../data/messagesService';
import { getMessages } from '../../data/messagesService';

interface HeaderProps {
  showSearch?: boolean;
  customSearch?: (props: {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  }) => React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
  backButtonLabel?: string;
}

const Header: React.FC<HeaderProps> = ({
  showSearch = true,
  customSearch,
  showBackButton = false,
  onBackClick,
  backButtonLabel = 'Назад',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeSuggestions, setRecipeSuggestions] = useState<Recipe[]>([]);
  const [authorSuggestions, setAuthorSuggestions] = useState<Author[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hasUnread, setHasUnread] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Проверка непрочитанных сообщений
  useEffect(() => {
    const checkUnread = () => {
      const messages: Message[] = getMessages();
      const activeIdsStr = localStorage.getItem('activeMessages');
      const activeIds = activeIdsStr ? new Set(JSON.parse(activeIdsStr)) : new Set<string>();
      const unread = messages.some((msg) => !activeIds.has(msg.id));
      setHasUnread(unread);
    };

    checkUnread();
    window.addEventListener('messagesUpdated', checkUnread);
    return () => window.removeEventListener('messagesUpdated', checkUnread);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);

    if (!value.trim()) {
      setRecipeSuggestions([]);
      setAuthorSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    setRecipeSuggestions(
      getAllRecipes().filter((r) => r.title.toLowerCase().includes(value.toLowerCase())),
    );
    setAuthorSuggestions(
      getAllAuthors().filter((a) => a.name.toLowerCase().includes(value.toLowerCase())),
    );
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (item: Recipe | Author) => {
    setSearchQuery('');
    setRecipeSuggestions([]);
    setAuthorSuggestions([]);
    setActiveIndex(-1);

    if ('title' in item) {
      navigate(`/product/${item.id}`);
    } else {
      navigate('/authors');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const total = recipeSuggestions.length + authorSuggestions.length;
    if (!total) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % total);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + total) % total);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        const allSuggestions = [...recipeSuggestions, ...authorSuggestions];
        handleSuggestionClick(allSuggestions[activeIndex]);
      }
    }
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, idx) => (regex.test(part) ? <span key={idx} className={styles.highlight}>{part}</span> : part));
  };

  const renderSuggestions = () => {
    if (recipeSuggestions.length === 0 && authorSuggestions.length === 0) return null;

    return (
      <div className={styles.suggestions}>
        {recipeSuggestions.length > 0 && (
          <div className={styles.suggestionBlock}>
            <div className={styles.suggestionHeader}>Рецепти</div>
            {recipeSuggestions.map((r, idx) => (
              <div
                key={r.id}
                className={`${styles.suggestionItem} ${activeIndex === idx ? styles.active : ''}`}
                onMouseDown={() => handleSuggestionClick(r)}
              >
                {highlightMatch(r.title)}
              </div>
            ))}
          </div>
        )}

        {authorSuggestions.length > 0 && (
          <div className={styles.suggestionBlock}>
            <div className={styles.suggestionHeader}>Автори</div>
            {authorSuggestions.map((a, idx) => {
              const index = recipeSuggestions.length + idx;
              return (
                <div
                  key={a.id}
                  className={`${styles.suggestionItem} ${activeIndex === index ? styles.active : ''}`}
                  onMouseDown={() => handleSuggestionClick(a)}
                >
                  {highlightMatch(a.name)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setRecipeSuggestions([]);
        setAuthorSuggestions([]);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header} data-testid="header">
      {showBackButton && (
        <button className={styles.backButton} onClick={onBackClick}>
          <ArrowLeft />
          {' '}
          {backButtonLabel}
        </button>
      )}

      <div className={styles.searchWrapper} ref={wrapperRef}>
        {customSearch ? (
          customSearch({ value: searchQuery, onChange: handleChange, onKeyDown: handleKeyDown })
        ) : (
          showSearch && (
            <>
              <img className={styles.searchIcon} src={searchIcon} alt="searchIcon" />
              <input
                type="text"
                placeholder="Пошук рецептів, кухарів, інгредієнтів…"
                value={searchQuery}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </>
          )
        )}

        {renderSuggestions()}
      </div>

      <div className={styles.rightSection}>
        <button
          className={styles.bellButton}
          onClick={() => navigate('/mesage')}
          style={{ position: 'relative' }}
        >
          <img className={styles.bellImage} src={iconBell} alt="iconBell" />
          {hasUnread && <span className={styles.redDot} data-testid="redDot" />}
        </button>
        <div
          data-testid="avatar"
          className={styles.avatar}
          style={{ backgroundImage: `url(${avatar})` }}
          onClick={() => navigate('/profile')}
        />
      </div>
    </header>
  );
};

export default Header;
