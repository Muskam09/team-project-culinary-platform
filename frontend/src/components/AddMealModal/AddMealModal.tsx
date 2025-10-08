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

const categories = ['Сніданок', 'Обід', 'Вечеря', 'Перекус', 'Десерт', 'Напої'];

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
  const [portions, setPortions] = useState(1);
  const [isSelectRecipeOpen, setIsSelectRecipeOpen] = useState(false);
  const [category, setCategory] = useState(defaultCategory || '');
  const [open, setOpen] = useState(false);

  const [dateInput, setDateInput] = useState<string>(todayStr);
  const [monthSuggestions, setMonthSuggestions] = useState<string[]>([]);
  const [daySuggestions, setDaySuggestions] = useState<number[]>([]);
  const [isDateSuggestionsOpen, setIsDateSuggestionsOpen] = useState(false);

  if (!isOpen) return null;

  const onOpenSelect = () => {
    setIsSelectRecipeOpen(true);
  };

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
    setCategory(defaultCategory || '');
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

    if (monthPart) {
      const matchedMonths = months
        .filter((m) => m.toLowerCase().startsWith(monthPart.toLowerCase()))
        .slice(0, 5);
      setMonthSuggestions(matchedMonths);
    } else {
      setMonthSuggestions([]);
    }

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

  const handleSelectCategory = (cat: string) => {
    setCategory(cat);
    setOpen(false);
  };

  return (
   <div className={`${styles.overlay} ${isSelectRecipeOpen ? styles.hiddenOverlay : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.headerText}>Додати страву</h2>
          <button className={styles.closeBtn} onClick={onClose} data-testid="close-button">
            <X size={20} />
          </button>
        </div>

        {/* === РЕЦЕПТ === */}
        <div className={styles.formRow}>
          <label>Рецепт</label>
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
            className={styles.pseudoInput}
             onClick={onOpenSelect}
          >
            <span className={styles.pseudoText}>
              {!selectedRecipe ? 'Оберіть рецепт...' : 'Змінити рецепт'}
            </span>
            <ChevronRight className={styles.pseudoChevron} size={18} />
          </div>
        </div>

        {/* === КАТЕГОРІЯ === */}
        <div className={styles.formRow}>
          <label>Категорія</label>
          <div className={styles.selectWrapper}>
            <button
              type="button"
              className={styles.customSelect}
              onClick={() => setOpen(!open)}
            >
               Оберіть категорію страви
              <ChevronDown
                size={18}
                className={`${styles.chevronIcon} ${open ? styles.open : ''}`}
              />
            </button>

            {open && (
              <div className={styles.dropdown}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={styles.option}
                    onClick={() => handleSelectCategory(cat)}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* === ДАТА === */}
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
              <div className={styles.dropdown}>
                {monthSuggestions.map((m) => (
                  <div key={m} onClick={() => selectMonth(m)} className={styles.option}>
                    {m}
                  </div>
                ))}
              </div>
            )}
            {isDateSuggestionsOpen && daySuggestions.length > 0 && (
              <div className={styles.dropdown}>
                {daySuggestions.map((d) => (
                  <div key={d} onClick={() => selectDay(d)} className={styles.option}>
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* === ПОРЦІЇ === */}
        <div className={styles.formRow}>
          <label>Порції</label>
          <div className={styles.pseudoInput}>
            <input
              type="number"
              min={1}
              value={portions === 0 ? '' : portions}
              placeholder="Укажіть кількість порцій"
              onChange={(e) => {
                const val = e.target.value;
                setPortions(val === '' ? 0 : Math.max(Number(val), 1));
              }}
              className={styles.numberInput}
            />
          </div>
        </div>

        {/* === КНОПКА ЗБЕРЕЖЕННЯ === */}
        <button
          className={`${styles.saveBtn} ${selectedRecipe ? styles.active : ''}`}
          onClick={handleAddMeal}
          disabled={!selectedRecipe}
          data-testid="save-button"
        >
          Додати страву
        </button>

        {/* === МОДАЛКА ВИБОРУ РЕЦЕПТУ === */}
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
