import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, ChevronLeft, Plus, MoreVertical, ChevronDown,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MealPlannerPage.module.scss';
import Header from '../../components/Header/Header';
import BreakfastIcon from '../../assets/menu_icon/icon-park-outline_snacks.svg';
import LunchIcon from '../../assets/menu_icon/icon-park-outline_bowl.svg';
import DinnerIcon from '../../assets/menu_icon/icon-park-outline_rice.svg';
import SnackIcon from '../../assets/menu_icon/icon-park-outline_apple-one.svg';
import DessertIcon from '../../assets/menu_icon/icon-park-outline_cake-five.svg';
import DrinksIcon from '../../assets/menu_icon/icon-park-outline_tea-drink.svg';
import { recipeDetails } from '../../data/recipeDetails';
import type { Recipe } from '../../data/recipes';
import { getAllRecipes } from '../../data/recipes';
import FireIcon from '../../assets/menu_icon/icon-park-outline_fire.svg';
import TimeIcon from '../../assets/menu_icon/icon-park-outline_time.svg';
import personIcon from '../../assets/menu_icon/icon-park-outline_user.svg';
import emptyPlan from '../../assets/Empty_state.png';
import iconRedact from '../../assets/icon-park-outline_edit.svg';
import AddMealModal from '../../components/AddMealModal/AddMealModal';
import { addMessage } from '../../data/messagesService';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];

const categoryIcons: Record<string, string> = {
  Сніданок: BreakfastIcon,
  Обід: LunchIcon,
  Вечеря: DinnerIcon,
  Перекус: SnackIcon,
  Десерт: DessertIcon,
  Напої: DrinksIcon,
};

const categoryColors: Record<string, string> = {
  Сніданок: '#FF4646',
  Обід: '#FE8700',
  Вечеря: '#3328FF',
  Перекус: '#FFBB07',
  Десерт: '#FF4FA3',
  Напої: '#00C2A8',
};

const mealCategories = ['Все', 'Сніданок', 'Обід', 'Вечеря', 'Перекус', 'Десерт', 'Напої'];

interface MealCard {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  calories?: number;
  servings?: number;
  image?: string;
  time?: string;
}

const MealPlannerPage: React.FC = () => {
  const today = new Date();
  const cardDropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const recipes = getAllRecipes();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [mealCardsList, setMealCardsList] = useState<MealCard[]>([]);
  const [sortMode, setSortMode] = useState<'all' | 'category' | 'recipe' | 'status'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sortLabels: Record<typeof sortMode, string> = {
    all: 'Усі разом',
    category: 'За категоріями',
    recipe: 'За рецептом',
    status: 'За статусом',
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatDateKey = (d: Date) => d.toLocaleDateString('en-CA');

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mealPlanner');
    if (saved) setMealCardsList(JSON.parse(saved));
  }, []);

  // Добавление рецепта после возврата со страницы /recipes
  // ⬇️ сохраняем выбранную дату между рендерами
  const restoredDateRef = useRef<Date | null>(null);

  useEffect(() => {
    const addedRecipe: Recipe = location.state?.addedRecipe;
    if (!addedRecipe) return;

    const category: string = location.state.category || 'Сніданок';
    const { date } = location.state;

    const newCard: MealCard = {
      id: `${addedRecipe.id}_${Date.now()}`,
      title: addedRecipe.title,
      category,
      date,
      time: addedRecipe.time,
      calories: recipeDetails.find((d) => d.id === addedRecipe.id)
        ?.nutrition?.find((n) => n.name === 'Калорії')?.amount,
      image: addedRecipe.image,
    };

    setMealCardsList((prev) => {
      const updated = [...prev, newCard];
      localStorage.setItem('mealPlanner', JSON.stringify(updated));
      return updated;
    });

    // ✅ сохраняем дату в ref
    if (location.state?.selectedDateFromPlanner) {
      restoredDateRef.current = new Date(location.state.selectedDateFromPlanner);
    }

    // ✅ очищаем только после того, как сохранили
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.state, navigate, location.pathname]);

  // второй useEffect — применяем дату из ref
  useEffect(() => {
    if (restoredDateRef.current) {
      setSelectedDate(restoredDateRef.current);
      restoredDateRef.current = null; // очистка после применения
    }
  }, []);

  const cardsForSelectedDate = mealCardsList.filter(
    (c) => c.date === formatDateKey(selectedDate),
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else setCurrentMonth(currentMonth + 1);
  };

  const getMonthDays = (year: number, month: number): Date[] => {
    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const lastDate = new Date(year, month + 1, 0).getDate();
    const days: Date[] = [];

    for (let i = startDay; i > 0; i--) days.push(new Date(year, month, 1 - i));
    for (let i = 1; i <= lastDate; i++) days.push(new Date(year, month, i));
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1];
      days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }
    return days;
  };

  const getCurrentWeek = (): Date[] => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - ((startOfWeek.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const isSameDate = (d1: Date, d2: Date) => d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  const isToday = (d: Date) => isSameDate(today, d);

  const handleSelectDate = (d: Date) => setSelectedDate(d);

  // Подсчёт количества блюд на дату
  const mealsCountOnDate = (d: Date) => mealCardsList.filter((c) => c.date === formatDateKey(d)).length;

  const handleIncreasePortions = (id: string) => {
    setMealCardsList((prev) => prev.map((c) => (c.id === id
      ? {
        ...c,
        servings: (c.servings ?? 1) + 1,
      }
      : c)));
  };

  const dailyTotals = cardsForSelectedDate.reduce(
    (totals, card) => {
      // ✅ Extract the base recipe ID from the unique card ID
      const recipeId = card.id.split('_')[0];

      // ✅ Use the correct recipe ID to find the details
      const recipe = recipeDetails.find((r) => r.id === recipeId);
      if (!recipe) return totals;

      const servings = card.servings ?? 1;

      recipe.nutrition?.forEach((n) => {
        if (n.name === 'Калорії') totals.calories += n.amount * servings;
        if (n.name === 'Білки') totals.protein += n.amount * servings;
        if (n.name === 'Жири') totals.fat += n.amount * servings;
        if (n.name === 'Вуглеводи') totals.carbs += n.amount * servings;
      });

      return totals;
    },
    {
      calories: 0, protein: 0, fat: 0, carbs: 0,
    },
  );
  const [nutritionGoals, setNutritionGoals] = useState(() => {
    const saved = localStorage.getItem('nutritionGoals');
    return saved
      ? JSON.parse(saved)
      : {
        calories: 2500, protein: 110, fat: 84, carbs: 320,
      }; // стартовые цели
  });

  // Прогресс выполнения
  const progress = {
    calories: Math.min(Math.round((dailyTotals.calories / nutritionGoals.calories) * 100), 100),
    protein: Math.min(Math.round((dailyTotals.protein / nutritionGoals.protein) * 100), 100),
    fat: Math.min(Math.round((dailyTotals.fat / nutritionGoals.fat) * 100), 100),
    carbs: Math.min(Math.round((dailyTotals.carbs / nutritionGoals.carbs) * 100), 100),
  };

  const handleEditAllGoals = () => {
    const newCalories = prompt('Введіть нову ціль калорій:', nutritionGoals.calories.toString());
    if (newCalories && !isNaN(Number(newCalories)) && Number(newCalories) >= dailyTotals.calories) {
      nutritionGoals.calories = Number(newCalories);
    } else if (newCalories) {
      alert(`Ціль не може бути менше поточних калорій (${dailyTotals.calories} ккал)`);
    }

    const newProtein = prompt('Введіть нову ціль білків (г):', nutritionGoals.protein.toString());
    if (newProtein && !isNaN(Number(newProtein)) && Number(newProtein) >= dailyTotals.protein) {
      nutritionGoals.protein = Number(newProtein);
    } else if (newProtein) {
      alert(`Ціль не може бути менше поточного білків (${dailyTotals.protein} г)`);
    }

    const newFat = prompt('Введіть нову ціль жирів (г):', nutritionGoals.fat.toString());
    if (newFat && !isNaN(Number(newFat)) && Number(newFat) >= dailyTotals.fat) {
      nutritionGoals.fat = Number(newFat);
    } else if (newFat) {
      alert(`Ціль не може бути менше поточного жирів (${dailyTotals.fat} г)`);
    }

    const newCarbs = prompt('Введіть нову ціль вуглеводів (г):', nutritionGoals.carbs.toString());
    if (newCarbs && !isNaN(Number(newCarbs)) && Number(newCarbs) >= dailyTotals.carbs) {
      nutritionGoals.carbs = Number(newCarbs);
    } else if (newCarbs) {
      alert(`Ціль не може бути менше поточного вуглеводів (${dailyTotals.carbs} г)`);
    }

    setNutritionGoals({ ...nutritionGoals });
    localStorage.setItem('nutritionGoals', JSON.stringify(nutritionGoals));
  };

  const allIngredients: IngredientWithIndex[] = cardsForSelectedDate.flatMap((card, cardIdx) => {
    // ✅ Extract the base recipe ID from the unique card ID
    const recipeId = card.id.split('_')[0];

    // ✅ Use the correct recipe ID to find the details
    const recipeInfo = recipeDetails.find((r) => r.id === recipeId);
    const recipe = recipes.find((r) => r.id === recipeId);

    if (!recipeInfo || !recipe) return [];

    const servings = card.servings ?? 1;

    return recipeInfo.ingredients.map((ing, idx) => ({
      ...ing,
      amount: ing.amount ? ing.amount * servings : undefined,
      recipeTitle: recipe.title,
      originalIndex: cardIdx * 1000 + idx,
    }));
  });

  // Добавляем состояние для вычеркнутых ингредиентов
  const [crossedIngredients, setCrossedIngredients] = useState<number[]>([]);

  // Функция для "удаления" (вычеркивания) ингредиента
  const handleCrossIngredient = (index: number) => {
    setCrossedIngredients((prev) => (prev.includes(index)
      ? prev.filter((i) => i !== index) // если уже вычеркнут, снимаем вычеркивание
      : [...prev, index]), // иначе добавляем в вычеркнутые
    );
  };

// Группировка ингредиентов по категориям
type IngredientWithIndex = {
  name: string;
  amount?: number;
  unit?: string;
  category?: string;
  recipeTitle: string; // ✅ добавлено название рецепта
  originalIndex: number; // ✅ для идентификации
};

const groupedIngredients = (() => {
  if (sortMode === 'category') {
    return allIngredients.reduce<Record<string, IngredientWithIndex[]>>((acc, ing, idx) => {
      const cat = ing.category || 'Інші';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({ ...ing, originalIndex: idx });
      return acc;
    }, {});
  }
  return { Усі: allIngredients.map((ing, idx) => ({ ...ing, originalIndex: idx })) };
})();

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      showActionsMenu !== null
      && cardDropdownRef.current
      && !cardDropdownRef.current.contains(event.target as Node)
    ) {
      setShowActionsMenu(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showActionsMenu]);

const countNewMealsForWeek = (date: Date, mealCardsList: MealCard[]) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - ((startOfWeek.getDay() + 6) % 7)); // понедельник
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // воскресенье

  return mealCardsList.filter((c) => {
    const d = new Date(c.date);
    return d >= startOfWeek && d <= endOfWeek;
  }).length;
};

const handleSaveMeal = (data: { recipeObj: Recipe; category: string; date: string; portions: number }) => {
  const newCard: MealCard = {
    id: `${data.recipeObj.id}_${Date.now()}`,
    title: data.recipeObj.title,
    category: data.category,
    date: data.date,
    calories: recipeDetails.find((d) => d.id === data.recipeObj.id)
      ?.nutrition?.find((n) => n.name === 'Калорії')?.amount,
    image: data.recipeObj.image,
    servings: data.portions,
    time: data.recipeObj.time,
  };

  setMealCardsList((prev) => {
    const updated = [...prev, newCard];
    localStorage.setItem('mealPlanner', JSON.stringify(updated));

    // ✅ Создаём сообщение о готовности плана
    const count = countNewMealsForWeek(new Date(data.date), updated);
    addMessage({
      title: 'Тижневий план харчування готовий',
      text: `Ваш план харчування на наступний тиждень складено з урахуванням ваших уподобань. Він включає ${count} нових рецептів, які варто спробувати!`,
      source: 'Планувальник страв',
    });

    return updated;
  });
};

const handleAddMealIngredients = (
  mealIngredients: { name: string; amount?: number; unit?: string }[],
  recipeTitle: string,
) => {
  const items = mealIngredients.map((ingredient) => ({
    id: `${Date.now()}-${ingredient.name}-${Math.random()}`,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    recipeTitle,
  }));

  if (items.length === 0) {
    alert('Немає інгредієнтів для додавання!');
    return;
  }

  // Навигация на список покупок
  navigate('/shopping-list', {
    state: { ingredientsToAdd: items },
  });

  // ✅ Добавляем сообщение об обновлении списка
  addMessage({
    title: 'Список покупок оновлено',
    text: `${items.length} товар${items.length === 1 ? '' : 'и'} були автоматично додані до вашого списку покупок з вашого плану харчування.`,
    source: 'Список покупок',
  });
};

const getWeekLabel = (date: Date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - ((date.getDay() + 6) % 7));

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const monthName = monthNames[startOfWeek.getMonth()];
  const year = startOfWeek.getFullYear();

  return `${monthName} ${startOfWeek.getDate()}–${endOfWeek.getDate()}, ${year}`;
};

return (
  <main className={styles.main}>
    <Header />
    <div className={styles.mainBlock}>
      <section className={styles.calendarBlock}>
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
          <span className={styles.monthNames}>
            {viewMode === 'month'
              ? `${monthNames[currentMonth]} ${currentYear}`
              : getWeekLabel(selectedDate)}
          </span>
          <button onClick={handleNextMonth}><ChevronRight size={18} /></button>
          <div className={styles.switchWrapper}>
            <label className={styles.switch}>
              <input type="checkbox" checked={viewMode === 'week'} onChange={() => setViewMode(viewMode === 'month' ? 'week' : 'month')} />
              <span className={styles.slider}>
                <span className={styles.labelMonth}>Місяць</span>
                <span className={styles.labelWeek}>Тиждень</span>
              </span>
            </label>
          </div>
        </div>

        {viewMode === 'month' ? (
          <div className={styles.monthCalendar}>
            <div className={styles.weekDaysHeader}>
              {daysOfWeek.map((d) => <div key={d} className={styles.weekDayHeader}>{d}</div>)}
            </div>
            <div className={styles.monthGrid}>
              {getMonthDays(currentYear, currentMonth).map((d, idx) => (
                <div
                  key={idx}
                  className={`${styles.monthDayBlock} ${d.getMonth() !== currentMonth ? styles.otherMonth : ''}`}
                  onClick={() => handleSelectDate(d)}
                >
                  <span
                    className={`
                      ${isSameDate(selectedDate, d) && isToday(d) ? styles.selectedToday : ''}
                      ${isSameDate(selectedDate, d) && !isToday(d) ? styles.selectedDay : ''}
                      ${!isSameDate(selectedDate, d) && isToday(d) ? styles.today : ''}
                    `}
                  >
                    {d.getDate()}
                  </span>
                  <div className={styles.mealDots}>
                    {Array.from({ length: mealsCountOnDate(d) }, (_, i) => {
                      const meal = mealCardsList.filter((c) => c.date === formatDateKey(d))[i];
                      const category = meal?.category || 'Сніданок';
                      return (
                        <span
                          key={i}
                          className={styles.mealDot}
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.weekCalendar}>
            <div className={styles.weekDaysHeader}>
              {daysOfWeek.map((d) => <div key={d} className={styles.weekDayHeader}>{d}</div>)}
            </div>
            <div className={styles.weekGrid}>
              {getCurrentWeek().map((d) => (
                <div key={d.toDateString()} className={styles.weekDayBlock} onClick={() => handleSelectDate(d)}>
                  <span
                    className={`
                      ${isSameDate(selectedDate, d) && isToday(d) ? styles.selectedToday : ''}
                      ${isSameDate(selectedDate, d) && !isToday(d) ? styles.selectedDay : ''}
                      ${!isSameDate(selectedDate, d) && isToday(d) ? styles.today : ''}
                    `}
                  >
                    {d.getDate()}
                  </span>
                  <div className={styles.mealDots}>
                    {Array.from({ length: mealsCountOnDate(d) }, (_, i) => {
                      // Получаем категорию для i-го блюда на эту дату
                      const meal = mealCardsList.filter((c) => c.date === formatDateKey(d))[i];
                      const category = meal?.category || 'Сніданок'; // по умолчанию
                      return (
                        <span
                          key={i}
                          className={styles.mealDot}
                          style={{ backgroundColor: categoryColors[category] }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Бдок планировки */}
      <section className={styles.mealPlannerBlock}>
        <div className={styles.mealPlannerHeader}>
          <div className={styles.mealHeader}>
            <h2>
              {selectedDate.toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </h2>

            <div className={styles.headerActions} ref={dropdownRef}>
              {/* Кнопка с меню */}
              <button
                className={styles.moreOptionsBtn}
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <img src={iconRedact} alt="redact" />
              </button>

              {/* Всплывающее меню */}
              {dropdownOpen && (
                <div className={styles.headerDropdownMenu}>
                  <button onClick={() => alert('Скопіювати день')}>Скопіювати день</button>
                  <button onClick={() => alert('Поділитися планом дня')}>Поділитися планом дня</button>
                  <button onClick={() => alert('Експорт плану в PDF')}>Експорт плану в PDF</button>
                  <button
                    className={styles.deletePlan}
                    onClick={() => {
                      if (window.confirm('Очистити план на цей день?')) {
                        const updated = mealCardsList.filter(
                          (c) => c.date !== formatDateKey(selectedDate),
                        );
                        setMealCardsList(updated);
                        localStorage.setItem('mealPlanner', JSON.stringify(updated));
                      }
                    }}
                  >
                    Очистити план
                  </button>
                </div>
              )}
            </div>
          </div>

          {cardsForSelectedDate.length > 0 && (
            <button
              className={styles.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              Додати страву
              <Plus size={18} />
            </button>

          )}
          <AddMealModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            defaultCategory="Сніданок" // можно подставить текущую категорию
            onSave={handleSaveMeal}
          />
        </div>

        {cardsForSelectedDate.length > 0 && (
          <nav className={styles.mealCategories}>
            {mealCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryButton} ${
                  activeCategory === cat ? styles.active : ''
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
        )}

        <div className={styles.mealCards}>
          {cardsForSelectedDate.length === 0 ? (
            <div className={styles.emptyMealPlanner}>
              <img
                src={emptyPlan}
                alt="Порожній план"
                className={styles.emptyImage}
              />
              <h3 className={styles.emptyTitle}>План на день порожній</h3>
              <p className={styles.emptyText}>
                Додайте рецепти, щоб наповнити день
                {' '}
                <br />
                смачними та корисними стравами.
              </p>
              <button
                className={styles.addButton}
                onClick={() => setIsModalOpen(true)}
              >
                Додати страву
                <Plus size={18} />
              </button>
              <AddMealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultCategory="Сніданок" // можно подставить текущую категорию
                onSave={handleSaveMeal}
              />
            </div>
          ) : (
            cardsForSelectedDate
              .filter(
                (card) => activeCategory === 'Все' || card.category === activeCategory,
              )
              .map((card) => {
                const fullRecipe = getAllRecipes().find((r) => r.id === card.id);
                const time = card.time || 'Не вказано';

                return (
                  <div key={card.id} className={styles.mealCard}>
                    <div className={styles.mealCardHeader}>
                      <img
                        src={categoryIcons[card.category]}
                        alt={card.category}
                        className={styles.icon}
                      />
                      <span className={styles.categoryName}>{card.category}</span>
                      {card.calories && (
                        <span className={styles.caloriesHeader}>
                          {card.calories}
                          {' '}
                          ккал
                        </span>
                      )}
                    </div>

                    <div className={styles.mealCardBlock}>
                      <div
                        className={styles.mealImagePlaceholder}
                        style={{ backgroundImage: `url(${card.image || fullRecipe?.image})` }}
                      />
                      <div className={styles.mealCardInfo}>
                        <div className={styles.mealTitle}>
                          <h3>{card.title}</h3>
                          <div className={styles.mealCardActionsWrapper} ref={cardDropdownRef}>
                            <button
                              className={styles.menuToggleBtn}
                              onClick={() => setShowActionsMenu(card.id === showActionsMenu ? null : card.id)}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {showActionsMenu === card.id && (
                              <div className={styles.mealCardActionsWrapper} ref={showActionsMenu === card.id ? cardDropdownRef : null}>
                                <button
                                  className={styles.menuToggleBtn}
                                  onClick={() => setShowActionsMenu(card.id === showActionsMenu ? null : card.id)}
                                >
                                  <MoreVertical size={16} />
                                </button>

                                {showActionsMenu === card.id && (
                                <div className={styles.mealCardActionsMenu}>
                                  <button onClick={() => alert(`Копіювати страву "${card.title}"`)}>Копіювати</button>
                                  <button onClick={() => {
                                    // Сначала удаляем старую карточку
                                    setMealCardsList((prev) => {
                                      const filtered = prev.filter((c) => c.id !== card.id);
                                      localStorage.setItem('mealPlanner', JSON.stringify(filtered));
                                      return filtered;
                                    });

                                    // Переход на страницу рецептов для выбора нового
                                    navigate('/recipes', {
                                      state: {
                                        category: card.category,
                                        date: card.date,
                                        replacingCardId: card.id, // можно использовать для логики если нужно
                                        selectedDateFromPlanner: selectedDate,
                                      },
                                    });

                                    setShowActionsMenu(null); // закрываем меню
                                  }}
                                  >
                                    Замінити страву
                                  </button>
                                  <button onClick={() => {
                                    const newServings = prompt(
                                      'Введіть нову кількість порцій:',
                                      (card.servings ?? 1).toString(),
                                    );
                                    if (newServings && !isNaN(Number(newServings)) && Number(newServings) > 0) {
                                      const updated = mealCardsList.map((c) => (c.id === card.id ? { ...c, servings: Number(newServings) } : c));
                                      setMealCardsList(updated);
                                      localStorage.setItem('mealPlanner', JSON.stringify(updated));
                                    }
                                  }}
                                  >
                                    Змінити кількість порцій
                                  </button>
                                  <button
                                    className={styles.deletePlan}
                                    onClick={() => {
                                      if (window.confirm(`Видалити страву "${card.title}" з плану?`)) {
                                        const updated = mealCardsList.filter((c) => c.id !== card.id);
                                        setMealCardsList(updated);
                                        localStorage.setItem('mealPlanner', JSON.stringify(updated));
                                      }
                                    }}
                                  >
                                    Видалити страву з плану
                                  </button>
                                </div>
                                )}
                              </div>
                            )}
                          </div>

                        </div>

                        <div className={styles.mealInfo}>
                          {time && (
                            <p className={styles.time}>
                              <img src={TimeIcon} alt="time" className={styles.fireIcon} />
                              {time}
                            </p>
                          )}

                          <div className={styles.caloriesRow}>
                            <img src={FireIcon} alt="fire" className={styles.fireIcon} />
                            <span className={styles.servingsValue}>
                              {card.calories ? card.calories * (card.servings ?? 1) : 0}
                              {' '}
                              ккал
                            </span>
                          </div>

                          <div className={styles.servingsControlCard}>
                            <button
                              className={styles.servingsButton}
                              onClick={() => handleIncreasePortions(card.id)}
                            >
                              <img src={personIcon} alt="person" className={styles.personIcon} />
                            </button>
                            <span>
                              {card.servings ?? 1}
                              {' '}
                              {(card.servings ?? 1) === 1
                                ? 'порція'
                                : (card.servings ?? 1) >= 2 && (card.servings ?? 1) <= 4
                                  ? 'порції'
                                  : 'порцій'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </section>

      {/* Денний план */}
      <div className={styles.dailyPlan}>
        <div className={styles.dailyPlanHead}>
          <h3 className={styles.dailiTitle}>Денний план</h3>
          <button className={styles.menuToggleBtn} onClick={handleEditAllGoals}>
            <MoreVertical size={16} />
          </button>
        </div>
        <div className={styles.dailyPlanInfo}>
          {(['calories', 'protein', 'fat', 'carbs'] as const).map((key) => (
            <div key={key} className={styles.goalRow}>
              <p className={styles.nutrient}>
                <span className={styles.nutrientName}>
                  {key === 'calories'
                    ? 'Калорії'
                    : key === 'protein'
                      ? 'Білки'
                      : key === 'fat'
                        ? 'Жири'
                        : 'Вуглеводи'}
                </span>
                <span className={styles.nutrientValue}>
                  {key === 'calories'
                    ? `${dailyTotals.calories.toFixed(0)} ккал`
                    : key === 'protein'
                      ? `${dailyTotals.protein.toFixed(2)} г`
                      : key === 'fat'
                        ? `${dailyTotals.fat.toFixed(2)} г`
                        : `${dailyTotals.carbs.toFixed(2)} г`}
                </span>
              </p>

              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${styles[key]}`}
                  style={{ width: `${progress[key]}%` }}
                />
              </div>

              <p className={styles.dailyTarget}>
                {key === 'calories'
                  ? `Ціль: ${nutritionGoals.calories.toFixed(2)} ккал`
                  : key === 'protein'
                    ? `Ціль: ${nutritionGoals.protein.toFixed(2)} г`
                    : key === 'fat'
                      ? `Ціль: ${nutritionGoals.fat.toFixed(2)} г`
                      : `Ціль: ${nutritionGoals.carbs.toFixed(2)} г`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Інгредієнти */}

      {allIngredients.length > 0 && (
        <div className={styles.ingredientsBlock}>
          <div className={styles.ingredientsHeader}>
            <h3 className={styles.ingredientsTitle}>Інгредієнти на день</h3>
            <div className={styles.ingredientsButtons}>
              <div className={styles.sortWrapper}>
                <button
                  className={styles.ingredientsSortButton}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {sortLabels[sortMode]}
                  {' '}
                  <ChevronDown size={16} className={styles.sortIcon} />
                </button>

                {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((option) => (
                    <div
                      key={option}
                      className={`${styles.dropdownItem} ${
                        sortMode === option ? styles.activeItem : ''
                      }`}
                      onClick={() => {
                        setSortMode(option);
                        setDropdownOpen(false);
                      }}
                    >
                      {sortLabels[option]}
                      {sortMode === option }
                    </div>
                  ))}
                </div>
                )}
              </div>

              {/* 🔽 Кнопка "Додати у список" */}
              <button
                className={`${styles.ingredientsAddButton} ${
                  crossedIngredients.length > 0 ? styles.active : ''
                }`}
                onClick={() => {
                  // Берем только выбранные ингредиенты
                  const selectedIngredients = allIngredients.filter((_, index) => crossedIngredients.includes(index));

                  if (selectedIngredients.length === 0) {
                    alert('Виберіть хоча б один інгредієнт ✅');
                    return;
                  }

                  // Используем универсальную функцию для добавления
                  handleAddMealIngredients(
                    selectedIngredients.map((ing) => ({
                      name: ing.name,
                      amount: ing.amount,
                      unit: ing.unit,
                    })),
                    'Інгредієнти на день',
                  );

                  // Сбрасываем вычеркнутые
                  setCrossedIngredients([]);
                }}
              >
                Додати у список
                <Plus size={18} />
              </button>

            </div>
          </div>

          {/* 🔽 Группировка по выбранному режиму */}
          {(() => {
            let groupedView: Record<string, typeof allIngredients> = {};

            if (sortMode === 'all') {
              groupedView = { '': allIngredients };
            } else if (sortMode === 'category') {
              groupedView = groupedIngredients;
            } else if (sortMode === 'recipe') {
              groupedView = allIngredients.reduce((acc, ing) => {
                const recipeName = ing.recipeTitle || 'Без рецепта';
                if (!acc[recipeName]) acc[recipeName] = [];
                acc[recipeName].push(ing);
                return acc;
              }, {} as Record<string, typeof allIngredients>);
            } else if (sortMode === 'status') {
              groupedView = {
                ' Обрані': allIngredients.filter((_, idx) => crossedIngredients.includes(idx)),
                ' Не обрані': allIngredients.filter((_, idx) => !crossedIngredients.includes(idx)),
              };
            }

            return Object.entries(groupedView).map(([group, items]) => (
              <div key={group} className={styles.ingredientCategoryBlock}>
                {group && <h4 className={styles.ingredientCategoryTitle}>{group}</h4>}
                <ul className={styles.ingredientsList}>
                  {items.map((ingredient) => {
                    const index = ingredient.originalIndex;
                    return (
                      <li key={index} className={styles.ingredientItem}>
                        <label className={styles.ingredientLabel}>
                          <input
                            type="checkbox"
                            className={styles.ingredientCheckbox}
                            checked={crossedIngredients.includes(index)}
                            onChange={() => handleCrossIngredient(index)}
                          />
                          <span
                            className={styles.ingredientName}
                            style={{
                              textDecoration: crossedIngredients.includes(index)
                                ? 'line-through'
                                : 'none',
                              color: crossedIngredients.includes(index) ? 'rgba(128, 138, 142, 1)' : 'rgba(28, 35, 39, 1)',
                            }}
                          >
                            {ingredient.name}
                          </span>
                        </label>

                        <div className={styles.ingredientAmountBlock}>
                          <span
                            className={styles.ingredientAmount}
                          >
                            {ingredient.amount ?? ''}
                            {' '}
                            {ingredient.unit ?? ''}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ));
          })()}
        </div>
      )}

    </div>
  </main>
);
};

export default MealPlannerPage;
