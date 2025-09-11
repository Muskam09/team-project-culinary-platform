import React, { useState, useEffect } from "react";
import styles from "./MealPlannerPage.module.scss";
import Header from "../components/Header";
import { ChevronRight, ChevronLeft, Plus, Trash2, Edit2, MoreVertical, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BreakfastIcon from "../assets/menu_icon/icon-park-outline_snacks.svg";
import LunchIcon from "../assets/menu_icon/icon-park-outline_bowl.svg";
import DinnerIcon from "../assets/menu_icon/icon-park-outline_rice.svg";
import SnackIcon from "../assets/menu_icon/icon-park-outline_apple-one.svg";
import DessertIcon from "../assets/menu_icon/icon-park-outline_cake-five.svg";
import DrinksIcon from "../assets/menu_icon/icon-park-outline_snacks.svg";
import { recipeDetails } from "../data/recipeDetails";
import type { Recipe } from "../data/recipes";
import { getAllRecipes } from "../data/recipes";
import FireIcon  from "../assets/menu_icon/icon-park-outline_fire.svg";
import TimeIcon  from "../assets/menu_icon/icon-park-outline_time.svg";
import personIcon from "../assets/menu_icon/icon-park-outline_user.svg";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const monthNames = ["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];

const categoryIcons: Record<string, string> = {
  "Сніданок": BreakfastIcon,
  "Обід": LunchIcon,
  "Вечеря": DinnerIcon,
  "Перекус": SnackIcon,
  "Десерт": DessertIcon,
  "Напої": DrinksIcon,
};

const mealCategories = ["Все","Сніданок","Обід","Вечеря","Перекус","Десерт","Напої"];

interface MealCard {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  calories?: number;
   servings?: number;
}



const MealPlannerPage: React.FC = () => {
  const today = new Date();
  const navigate = useNavigate();
  const location = useLocation();
   const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<"month"|"week">("month");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [mealCardsList, setMealCardsList] = useState<MealCard[]>([]);

  const formatDateKey = (d: Date) => d.toISOString().split("T")[0];

  // Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mealPlanner");
    if (saved) setMealCardsList(JSON.parse(saved));
  }, []);


 // Добавление рецепта после возврата со страницы /recipes
useEffect(() => {
  const addedRecipe: Recipe = location.state?.addedRecipe;
  if (!addedRecipe) return;

  const category: string = location.state.category || "Сніданок";
  const date: string = location.state.date || formatDateKey(selectedDate);

  setMealCardsList(prev => {
    const exists = prev.some(c => c.id === addedRecipe.id && c.date === date);
    if (exists) return prev;

    const newCard: MealCard = {
      id: addedRecipe.id,
      title: addedRecipe.title,
      category,
      date,
      calories: recipeDetails.find(d => d.id === addedRecipe.id)?.nutrition?.find(n => n.name === "Калорії")?.amount,
    };

    const updated = [...prev, newCard];
    localStorage.setItem("mealPlanner", JSON.stringify(updated));
    return updated;
  });

  // Очищаем location.state, чтобы при повторном рендере не добавлялся повторно
  navigate(location.pathname, { replace: true, state: {} });
}, [location.state, navigate, location.pathname, selectedDate]);






  const handleAddCard = () => {
    if (activeCategory === "Все") return; // запрет добавления
    navigate("/recipes", {
      state: { 
        category: activeCategory,
        date: formatDateKey(selectedDate)
      }
    });
  };

  const handleDeleteCard = (id: string) => {
    const updated = mealCardsList.filter(c => c.id !== id);
    setMealCardsList(updated);
    localStorage.setItem("mealPlanner", JSON.stringify(updated));
  };

  const handleEditCard = (id: string) => {
    const card = mealCardsList.find(c => c.id === id);
    if (!card) return;
    const newTitle = prompt("Редагувати назву страви:", card.title);
    if (newTitle && newTitle.trim() !== "") {
      const updated = mealCardsList.map(c => c.id === id ? {...c, title: newTitle} : c);
      setMealCardsList(updated);
      localStorage.setItem("mealPlanner", JSON.stringify(updated));
    }
  };

  const cardsForSelectedDate = mealCardsList.filter(c => c.date === formatDateKey(selectedDate));

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

  const isSameDate = (d1: Date, d2: Date) =>
    d2 && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  const isToday = (d: Date) => isSameDate(today, d);

  const handleSelectDate = (d: Date) => setSelectedDate(d);

  // Подсчёт количества блюд на дату
  const mealsCountOnDate = (d: Date) =>
    mealCardsList.filter(c => c.date === formatDateKey(d)).length;
  
  const handleIncreasePortions = (id: string) => {
  setMealCardsList(prev =>
    prev.map(c =>
      c.id === id
        ? {
            ...c,
            servings: (c.servings ?? 1) + 1
          }
        : c
    )
  );
};

const dailyTotals = cardsForSelectedDate.reduce(
  (totals, card) => {
    const recipe = recipeDetails.find(r => r.id === card.id);
    if (!recipe) return totals;

    const servings = card.servings ?? 1;

    recipe.nutrition?.forEach(n => {
      if (n.name === "Калорії") totals.calories += n.amount * servings;
      if (n.name === "Білки") totals.protein += n.amount * servings;
      if (n.name === "Жири") totals.fat += n.amount * servings;
      if (n.name === "Вуглеводи") totals.carbs += n.amount * servings;
    });

    return totals;
  },
  { calories: 0, protein: 0, fat: 0, carbs: 0 }
);
const [nutritionGoals, setNutritionGoals] = useState(() => {
  const saved = localStorage.getItem("nutritionGoals");
  return saved
    ? JSON.parse(saved)
    : { calories: 2500, protein: 110, fat: 84, carbs: 320 }; // стартовые цели
});

// Прогресс выполнения
const progress = {
  calories: Math.min(Math.round((dailyTotals.calories / nutritionGoals.calories) * 100), 100),
  protein: Math.min(Math.round((dailyTotals.protein / nutritionGoals.protein) * 100), 100),
  fat: Math.min(Math.round((dailyTotals.fat / nutritionGoals.fat) * 100), 100),
  carbs: Math.min(Math.round((dailyTotals.carbs / nutritionGoals.carbs) * 100), 100),
};

const handleEditAllGoals = () => {
  const newCalories = prompt("Введіть нову ціль калорій:", nutritionGoals.calories.toString());
  if (newCalories && !isNaN(Number(newCalories)) && Number(newCalories) >= dailyTotals.calories) {
    nutritionGoals.calories = Number(newCalories);
  } else if (newCalories) {
    alert(`Ціль не може бути менше поточних калорій (${dailyTotals.calories} ккал)`);
  }

  const newProtein = prompt("Введіть нову ціль білків (г):", nutritionGoals.protein.toString());
  if (newProtein && !isNaN(Number(newProtein)) && Number(newProtein) >= dailyTotals.protein) {
    nutritionGoals.protein = Number(newProtein);
  } else if (newProtein) {
    alert(`Ціль не може бути менше поточного білків (${dailyTotals.protein} г)`);
  }

  const newFat = prompt("Введіть нову ціль жирів (г):", nutritionGoals.fat.toString());
  if (newFat && !isNaN(Number(newFat)) && Number(newFat) >= dailyTotals.fat) {
    nutritionGoals.fat = Number(newFat);
  } else if (newFat) {
    alert(`Ціль не може бути менше поточного жирів (${dailyTotals.fat} г)`);
  }

  const newCarbs = prompt("Введіть нову ціль вуглеводів (г):", nutritionGoals.carbs.toString());
  if (newCarbs && !isNaN(Number(newCarbs)) && Number(newCarbs) >= dailyTotals.carbs) {
    nutritionGoals.carbs = Number(newCarbs);
  } else if (newCarbs) {
    alert(`Ціль не може бути менше поточного вуглеводів (${dailyTotals.carbs} г)`);
  }

  setNutritionGoals({ ...nutritionGoals });
  localStorage.setItem("nutritionGoals", JSON.stringify(nutritionGoals));
};

const allIngredients = cardsForSelectedDate.flatMap(card => {
  const recipe = recipeDetails.find(r => r.id === card.id);
  if (!recipe) return [];
  const servings = card.servings ?? 1;
  return recipe.ingredients.map(ing => ({
    ...ing,
    amount: ing.amount ? ing.amount * servings : undefined,
  }));
});


// Редактирование ингредиента
const handleEditIngredient = (index: number) => {
  const ingredient = allIngredients[index];
  const newName = prompt("Редагувати назву інгредієнта:", ingredient.name);
  if (newName && newName.trim() !== "") {
    const updated = [...allIngredients];
    updated[index] = { ...ingredient, name: newName };
    localStorage.setItem("allIngredients", JSON.stringify(updated));
  }
};

// Добавляем состояние для вычеркнутых ингредиентов
const [crossedIngredients, setCrossedIngredients] = useState<number[]>([]);

// Функция для "удаления" (вычеркивания) ингредиента
const handleCrossIngredient = (index: number) => {
  setCrossedIngredients(prev =>
    prev.includes(index)
      ? prev.filter(i => i !== index) // если уже вычеркнут, снимаем вычеркивание
      : [...prev, index] // иначе добавляем в вычеркнутые
  );
};

// Состояние для сортировки
const [sortByCategory, setSortByCategory] = useState(false);

// Группировка ингредиентов по категориям
type IngredientWithIndex = (typeof allIngredients)[number] & { originalIndex: number };

const groupedIngredients = sortByCategory
  ? allIngredients.reduce<Record<string, IngredientWithIndex[]>>((acc, ing, idx) => {
      const cat = ing.category || "Інші";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({ ...ing, originalIndex: idx }); // сохраняем оригинальный индекс для действий
      return acc;
    }, {} as Record<string, IngredientWithIndex[]>)
  : { "Усі": allIngredients.map((ing, idx) => ({ ...ing, originalIndex: idx })) as IngredientWithIndex[] };



  return (
    <main className={styles.main}>
      <Header />

      <section className={styles.calendarBlock}>
        <div className={styles.calendarHeader}>
          <button onClick={handlePrevMonth}><ChevronLeft size={18} /></button>
          <span>{monthNames[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth}><ChevronRight size={18} /></button>
          <div className={styles.switchWrapper}>
            <label className={styles.switch}>
              <input type="checkbox" checked={viewMode === "week"} onChange={() => setViewMode(viewMode === "month" ? "week" : "month")} />
              <span className={styles.slider}>
                <span className={styles.labelMonth}>Місяць</span>
                <span className={styles.labelWeek}>Тиждень</span>
              </span>
            </label>
          </div>
        </div>

        {viewMode === "month" ? (
          <div className={styles.monthCalendar}>
            <div className={styles.weekDaysHeader}>
              {daysOfWeek.map(d => <div key={d} className={styles.weekDayHeader}>{d}</div>)}
            </div>
            <div className={styles.monthGrid}>
              {getMonthDays(currentYear, currentMonth).map((d, idx) => (
                <div
                  key={idx}
                  className={`${styles.monthDayBlock} ${d.getMonth() !== currentMonth ? styles.otherMonth : ""}`}
                  onClick={() => handleSelectDate(d)}
                >
                  <span
                    className={`
                      ${isSameDate(selectedDate, d) && isToday(d) ? styles.selectedToday : ""}
                      ${isSameDate(selectedDate, d) && !isToday(d) ? styles.selectedDay : ""}
                      ${!isSameDate(selectedDate, d) && isToday(d) ? styles.today : ""}
                    `}
                  >
                    {d.getDate()}
                  </span>
                  <div className={styles.mealDots}>
                    {Array.from({ length: mealsCountOnDate(d) }, (_, i) => (
                      <span key={i} className={styles.mealDot}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.weekCalendar}>
            <div className={styles.weekDaysHeader}>
              {daysOfWeek.map(d => <div key={d} className={styles.weekDayHeader}>{d}</div>)}
            </div>
            <div className={styles.weekGrid}>
              {getCurrentWeek().map(d => (
                <div key={d.toDateString()} className={styles.weekDayBlock} onClick={() => handleSelectDate(d)}>
                  <span
                    className={`
                      ${isSameDate(selectedDate, d) && isToday(d) ? styles.selectedToday : ""}
                      ${isSameDate(selectedDate, d) && !isToday(d) ? styles.selectedDay : ""}
                      ${!isSameDate(selectedDate, d) && isToday(d) ? styles.today : ""}
                    `}
                  >
                    {d.getDate()}
                  </span>
                  <div className={styles.mealDots}>
                    {Array.from({ length: mealsCountOnDate(d) }, (_, i) => (
                      <span key={i} className={styles.mealDot}></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      
        {/*Бдок планировки */}
      <section className={styles.mealPlannerBlock}>
        <div className={styles.mealPlannerHeader}>
          <h2>{selectedDate.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</h2>
          <button 
            className={styles.addButton} 
            onClick={handleAddCard} 
            disabled={activeCategory === "Все"} // кнопка отключена
          >
            <Plus size={18} /> Додати
          </button>
        </div>

        <nav className={styles.mealCategories}>
          {mealCategories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.categoryButton} ${activeCategory === cat ? styles.active : ""}`} 
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

      <div className={styles.mealCards}>
  {cardsForSelectedDate
    .filter(card => activeCategory === "Все" || card.category === activeCategory)
    .map(card => {
      // Получаем полный рецепт и детали для каждой карточки
      const fullRecipe = getAllRecipes().find(r => r.id === card.id);

      // Если рецепт удалён или не найден, показываем заглушку
      const time =  fullRecipe?.time || "Не вказано";

      return (
    <div key={card.id} className={styles.mealCard}>
          <div className={styles.mealCardHeader}>
             <img src={categoryIcons[card.category]} alt={card.category} className={styles.icon} />
             <span className={styles.categoryName}>{card.category}</span>
            {card.calories && <span className={styles.caloriesHeader}>{card.calories} ккал</span>}
          </div>

  <div className={styles.mealCardBlock}>
    <div className={styles.mealImagePlaceholder}></div>
    <div className={styles.mealCardInfo}>
    <div className={styles.mealTitle}>
  <h3>{card.title}</h3>
  <div className={styles.mealCardActionsWrapper}>
    <button
      className={styles.menuToggleBtn}
      onClick={() => setShowActionsMenu(card.id === showActionsMenu ? null : card.id)} >
      <MoreVertical size={16} />
    </button>
    {showActionsMenu === card.id && (
      <div className={styles.mealCardActionsMenu}>
        <button onClick={() => handleEditCard(card.id)}>
          <Edit2 size={16} /> Редагувати
        </button>
        <button onClick={() => handleDeleteCard(card.id)}>
          <Trash2 size={16} /> Видалити
        </button>
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
    {card.calories ? card.calories * (card.servings ?? 1) : 0} ккал
  </span>
</div>

         <div className={styles.servingsControlCard}>
         <button className={styles.servingsButton} onClick={() => handleIncreasePortions(card.id)}>
           <img src={personIcon} alt="person"className={styles.personIcon} />
           </button>
       <span>
    {card.servings ?? 1}{" "}
    {((card.servings ?? 1) === 1 ? "порція" : 
      ((card.servings ?? 1) >= 2 && (card.servings ?? 1) <= 4 ? "порції" : "порцій"))}
  </span>
       </div>
      </div>
   </div>


  
      
                </div>
                </div>                    
        
      );
    })}
</div>
      


      </section>
<div className={styles.dailyPlan}>
 <div className={styles.dailyPlanHead}>
    <h3 className={styles.dailiTitle}>Денний план</h3>
    <button className={styles.menuToggleBtn} onClick={handleEditAllGoals}>
      <MoreVertical size={16} />
    </button>
  </div>
  <div className={styles.dailyPlanInfo}>
    
    {(["calories", "protein", "fat", "carbs"] as const).map((key) => (
      
      <div key={key} className={styles.goalRow}>
       <p className={styles.nutrient}>
  <span className={styles.nutrientName}>
    {key === "calories"
      ? "Калорії"
      : key === "protein"
      ? "Білки"
      : key === "fat"
      ? "Жири"
      : "Вуглеводи"}
  </span>
  <span className={styles.nutrientValue}>
    {key === "calories"
      ? `${dailyTotals.calories} ккал`
      : key === "protein"
      ? `${dailyTotals.protein} г`
      : key === "fat"
      ? `${dailyTotals.fat} г`
      : `${dailyTotals.carbs} г`}
  </span>
</p>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress[key]}%` }}
          ></div>
        </div>
        <p className={styles.dailyTarget}>
  {key === "calories"
    ? `Ціль: ${nutritionGoals.calories} ккал`
    : key === "protein"
    ? `Ціль: ${nutritionGoals.protein} г`
    : key === "fat"
    ? `Ціль: ${nutritionGoals.fat} г`
    : `Ціль: ${nutritionGoals.carbs} г`}
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
      <button
        className={styles.ingredientsSortButton}
        onClick={() => setSortByCategory(prev => !prev)}
      >
        {sortByCategory ? "Всі" : "За категорією"}
        <ChevronDown size={16} className={styles.sortIcon} />
      </button>
      <button className={styles.ingredientsAddButton}>
        Додати у список
        <Plus size={18} />
      </button>
    </div>
  </div>

  {Object.entries(groupedIngredients).map(([category, items]) => (
    <div key={category} className={styles.ingredientCategoryBlock}>
      {sortByCategory && <h4 className={styles.ingredientCategoryTitle}>{category}</h4>}
      <ul className={styles.ingredientsList}>
        {items.map((ingredient) => {
          const index = ingredient.originalIndex;
          return (
            <li key={index} className={styles.ingredientItem}>
              <label className={styles.ingredientLabel}>
                <input type="checkbox" className={styles.ingredientCheckbox} />
                <span
                  className={styles.ingredientName}
                  style={{
                    textDecoration: crossedIngredients.includes(index) ? "line-through" : "none",
                    color: crossedIngredients.includes(index) ? "#888" : "#000",
                  }}
                >
                  {ingredient.name}
                </span>
              </label>

              <div className={styles.ingredientAmountBlock}>
                <span
                  className={styles.ingredientAmount}
                  style={{
                    textDecoration: crossedIngredients.includes(index) ? "line-through" : "none",
                    color: crossedIngredients.includes(index) ? "#888" : "#000",
                  }}
                >
                  {ingredient.amount ?? ""} {ingredient.unit ?? ""}
                </span>

                <div className={styles.mealCardActionsWrapper}>
                  <button
                    className={styles.menuToggleBtn}
                    onClick={() =>
                      setShowActionsMenu(
                        showActionsMenu === `ingredient-${index}`
                          ? null
                          : `ingredient-${index}`
                      )
                    }
                  >
                    <MoreVertical size={16} />
                  </button>
                  {showActionsMenu === `ingredient-${index}` && (
                    <div className={styles.mealCardActionsMenu}>
                      <button onClick={() => handleEditIngredient(index)}>
                        <Edit2 size={16} /> Редагувати
                      </button>
                      <button onClick={() => handleCrossIngredient(index)}>
                        <Trash2 size={16} /> Викреслити
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ))}
</div>

)}





    </main>
  );
};

export default MealPlannerPage;
