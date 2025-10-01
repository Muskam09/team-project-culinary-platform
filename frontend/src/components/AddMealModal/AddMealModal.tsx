import React, { useState } from 'react';
import {
  ChevronRight, X, ChevronDown, Trash,
} from 'lucide-react';
import styles from './AddMealModal.module.scss';
import type { Recipe } from '../../data/recipes';
import SelectRecipeModal from '../SelectRecipeModal/SelectRecipeModal';

const months = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня',
];

function formatDateToUA(day: number, month: string, year: number) {
  return `${day} ${month}, ${year}`;
}

function parseDateInput(input: string) {
  const parts = input.replace(',', '').split(' ');
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const monthIndex = months.findIndex((m) => m === parts[1]);
  const year = Number(parts[2]);
  if (isNaN(day) || monthIndex === -1 || isNaN(year)) return null;
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    recipeObj: Recipe;
    category: string;
    date: string;
    portions: number;
  }) => void;
  defaultCategory?: string;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultCategory,
}) => {
  const today = new Date();
  const todayStr = formatDateToUA(today.getDate(), months[today.getMonth()], today.getFullYear());

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [category, setCategory] = useState(defaultCategory || 'Сніданок');
  const [portions, setPortions] = useState(1);
  const [isSelectRecipeOpen, setIsSelectRecipeOpen] = useState(false);

  const [dateInput, setDateInput] = useState<string>(todayStr);
  const [monthSuggestions, setMonthSuggestions] = useState<string[]>([]);
  const [daySuggestions, setDaySuggestions] = useState<number[]>([]);
  const [isDateSuggestionsOpen, setIsDateSuggestionsOpen] = useState(false);

  if (!isOpen) return null;

  const handleAddMeal = () => {
    if (!selectedRecipe) {
      alert('Оберіть рецепт ✅');
      return;
    }

    const formattedDate = parseDateInput(dateInput);
    if (!formattedDate) {
      alert('Невірний формат дати');
      return;
    }

    onSave({
      recipeObj: selectedRecipe,
      category,
      date: formattedDate,
      portions,
    });

    setSelectedRecipe(null);
    setCategory(defaultCategory || 'Сніданок');
    setDateInput(todayStr);
    setPortions(1);
    setIsDateSuggestionsOpen(false);
    onClose();
  };

  const handleDateChange = (value: string) => {
    setDateInput(value);
    const parts = value.split(' ');
    const dayPart = parts[0];
    const monthPart = parts[1]?.replace(',', '');

    // Подсказки месяца (не более 5)
    if (monthPart) {
      const matchedMonths = months
        .filter((m) => m.toLowerCase().startsWith(monthPart.toLowerCase()))
        .slice(0, 5);
      setMonthSuggestions(matchedMonths);
    } else {
      setMonthSuggestions([]);
    }

    // Подсказки дня (1-31, максимум 5)
    if (!dayPart || isNaN(Number(dayPart))) {
      setDaySuggestions(Array.from({ length: 31 }, (_, i) => i + 1).slice(0, 5));
    } else {
      setDaySuggestions([]);
    }
  };

  const selectMonth = (m: string) => {
    const parts = dateInput.split(' ');
    const dayPart = Number(parts[0]) || today.getDate();
    const yearPart = Number(parts[2]) || today.getFullYear();
    setDateInput(formatDateToUA(dayPart, m, yearPart));
    setMonthSuggestions([]);
    setIsDateSuggestionsOpen(false);
  };

  const selectDay = (d: number) => {
    const parts = dateInput.split(' ');
    const monthPart = parts[1] || months[today.getMonth()];
    const yearPart = Number(parts[2]) || today.getFullYear();
    setDateInput(formatDateToUA(d, monthPart, yearPart));
    setDaySuggestions([]);
    setIsDateSuggestionsOpen(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.headerText}>Додати страву</h2>
          <button className={styles.closeBtn} onClick={onClose} data-testid="close-button">
            <X size={20} />
          </button>
        </div>

        {/* Рецепт */}
        {/* Рецепт */}
        <div className={styles.formRow}>
          <label>Рецепт</label>

          {/* Если выбран рецепт, показываем его название и картинку */}
          {selectedRecipe && (
          <div className={styles.selectedRecipeInfo}>
            <div className={styles.selectedBlock}>
              <div
                className={styles.selectedRecipeImage}
                style={{ backgroundImage: `url(${selectedRecipe.image})` }}
              />
              <span className={styles.selectedRecipeName}>
                {selectedRecipe.title}
              </span>
            </div>
            <button
              className={styles.deleteRecipeBtn}
              onClick={() => setSelectedRecipe(null)}
            >
              <Trash size={18} />
            </button>
          </div>
          )}

          <div
            className={`${styles.pseudoInput}`}
            onClick={() => setIsSelectRecipeOpen(true)}
          >
            <span className={styles.pseudoText}>
              {!selectedRecipe ? 'Оберіть рецепт...' : 'Змінити рецепт'}
            </span>
            <ChevronRight
              className={styles.pseudoChevron}
              size={18}
              onClick={() => setIsSelectRecipeOpen(true)}
            />
          </div>
        </div>

        {/* Категорія */}
        <div className={styles.formRow}>
          <label>Категорія</label>
          <div className={styles.selectWrapper}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.categorySelect}
            >
              {['Сніданок', 'Обід', 'Вечеря', 'Перекус', 'Десерт', 'Напої'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className={styles.chevronIcon}>
              <ChevronDown size={18} />
            </span>
          </div>
        </div>

        {/* Дата */}
        <div className={styles.formRow}>
          <label>Дата</label>
          <div className={styles.dateWrapper}>
            <input
              type="text"
              value={dateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder="11 жовтня, 2025"
              className={styles.dateInput}
              onFocus={() => setIsDateSuggestionsOpen(true)}
            />
            <ChevronRight
              size={18}
              style={{
                position: 'absolute',
                right: '12px',
                top: '55%',
                transform: 'translateY(-50%)',
                color: '#666',
                cursor: 'pointer',
              }}
              onClick={() => setIsDateSuggestionsOpen((prev) => !prev)}
            />
            {isDateSuggestionsOpen && monthSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                background: '#fff',
                border: '1px solid #ddd',
                zIndex: 10,
              }}
              >
                {monthSuggestions.map((m) => (
                  <div key={m} onClick={() => selectMonth(m)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
                    {m}
                  </div>
                ))}
              </div>
            )}
            {isDateSuggestionsOpen && daySuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                background: '#fff',
                border: '1px solid #ddd',
                zIndex: 10,
              }}
              >
                {daySuggestions.map((d) => (
                  <div key={d} onClick={() => selectDay(d)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Порції */}
        <div className={styles.formRow}>
          <label>Порції</label>
          <div className={styles.pseudoInput}>
            <input
              type="number"
              min={1}
              value={portions === 0 ? '' : portions} // если 0 — показываем пустое поле
              placeholder="Укажіть кількість порцій"
              onChange={(e) => {
                const val = e.target.value; // берём строку из инпута
                // Если пустая строка — оставляем 0, иначе парсим число
                setPortions(val === '' ? 0 : Math.max(Number(val), 1));
              }}
              className={styles.numberInput}
            />
          </div>
        </div>

        {/* Кнопка сохранить */}
        <button
          className={`${styles.saveBtn} ${selectedRecipe ? styles.active : ''}`}
          onClick={handleAddMeal}
          disabled={!selectedRecipe}
          data-testid="save-button"
        >
          Додати страву
        </button>

        {/* Модалка выбора рецепта */}
        {isSelectRecipeOpen && (
          <SelectRecipeModal
            isOpen={isSelectRecipeOpen}
            onClose={() => setIsSelectRecipeOpen(false)}
            onSelectRecipe={(recipe: Recipe) => {
              setSelectedRecipe(recipe);
              setIsSelectRecipeOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AddMealModal;
