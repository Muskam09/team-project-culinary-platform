import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import styles from "./ProductInfoPage.module.scss";
import flagIcon from "../assets/icon-park-outline_tag.svg";
import exportIcon from "../assets/icon-park-outline_export.svg";
import iconComplexity from "../assets/icon-park-outline_hamburger-button.svg";
import iconTime from "../assets/icon-park-outline_time.svg";
import iconStar from "../assets/icon-park-outline_star.svg";
import iconCalendar from "../assets/icon-park-outline_calendar.svg";
import iconPrinter from "../assets/icon-park-outline_printer-one.svg";
import iconCamera from "../assets/icon-park-outline_camera.svg";
import like from "../assets/icon-park-outline_good-two.svg";
import dislike from "../assets/icon-park-outline_bad-two.svg";
import more_one from "../assets/icon-park-outline_more-one.svg";
import { FaSearch } from "react-icons/fa";
import { recipeDetails } from "../data/recipeDetails"
import { getAllRecipes, getAllAuthors  } from "../data/recipes";
import type { Author } from "../data/recipes";
import { FaArrowRight } from "react-icons/fa";
import RecipeCard from "../components/RecipeCard";
import { ChevronRight } from "lucide-react";

interface SavedItem {
  id: string;
  title: string;
  category: string;
  dateSaved: string;
}

const ProductInfoPage: React.FC = () => {
  // Состояние для комментариев
  const [comments, setComments] = useState([
    { author: "Марія Коваленко", email: "@marriKoval",likes: 3, dislikes: 0, date: "05.09.2025",rating: 4, text: "Дуже смачно! Готувала на обід для сім’ї — усі були у захваті. Сир додав страві ніжності, а капуста залишилася соковитою." },
  { author: "Андрій Коваленко", email: "@andriKoval",likes: 5, dislikes: 6, date: "04.09.2025",rating: 2, text: "Додав трохи більше спецій, вийшло супер!" },
    { author: "Ірина Савіна", email: "@savinaIrina",likes: 10, dislikes: 15, date: "1 місяць тому ",rating: 3, text: "Відмінний варіант для тих, хто слідкує за харчуванням. Легко, смачно і корисно. Наступного разу спробую ще з іншими спеціями." },
]);
  // Обработчик лайков/дизлайков
  const handleLike = (index: number, type: "like" | "dislike") => {
  setComments((prev) =>
    prev.map((c, i) => {
      if (i === index) {
        return {
          ...c,
          likes: type === "like" ? c.likes + 1 : c.likes,
          dislikes: type === "dislike" ? c.dislikes + 1 : c.dislikes,
        };
      }
      return c;
    })
  );
};
  const [rating, setRating] = useState(0);
const [hoverRating, setHoverRating] = useState(0);

  // Получаем ID рецепта из URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = getAllRecipes().find((r) => r.id === id);
  const details = recipeDetails.find((r) => r.id === id);
  
  if (!recipe || !details) return <p>Рецепт не найден</p>;

  const [servings, setServings] = useState(1);

  // Состояние выбранных ингредиентов
  const [selectedIngredients, setSelectedIngredients] = useState<boolean[]>(
    details.ingredients.map(() => false)
  );

  const handleIncrease = () => setServings((s) => s + 1);
  const handleDecrease = () => setServings((s) => (s > 1 ? s - 1 : 1));

  // Переключение одного ингредиента
  const toggleIngredient = (index: number) => {
    setSelectedIngredients((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  // Выбрать все ингредиенты
  const selectAll = () => setSelectedIngredients(details.ingredients.map(() => true));

  // Очистить все ингредиенты
  const clearAll = () => setSelectedIngredients(details.ingredients.map(() => false));

  let authorData: Author | undefined = getAllAuthors().find(
    (a) => a.name.trim().toLowerCase() === recipe.author.trim().toLowerCase()
  );

  // Если автора нет в массиве, создаём "пустую" карточку
  if (!authorData) {
    authorData = {
      id: `a_${recipe.id}`,
      name: recipe.author,
      email: "",
      profession: "",
      recipesCount: 1,
      followers: 0,
    };
  }

  const formatFollowers = (num: number | undefined) => {
  if (!num) return "0";
  if (num >= 1000) {
    const kNum = num / 1000;
    return kNum % 1 === 0 ? Math.floor(kNum) + "k" : kNum.toFixed(1) + "k";
  }
  return num.toString();
};

  const location = useLocation();
  const targetCategory = location.state?.category || "Сніданок";
  const selectedDate = location.state?.date; // дата, выбранная в MealPlannerPage

const handleSaveRecipe = () => {
  // Получаем текущие сохранённые рецепты
  const saved: SavedItem[] = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

  // Проверяем, есть ли уже этот рецепт
 const exists = saved.some(item => item.id === recipe.id);
  if (exists) {
    alert("Рецепт вже збережено!");
    return;
  }
  const newItem: SavedItem = {
    id: recipe.id,
    title: recipe.title,
    category: targetCategory, // категория текущего рецепта
    dateSaved: new Date().toLocaleDateString(),
  };
    const updated = [...saved, newItem];
  localStorage.setItem("savedRecipes", JSON.stringify(updated));
     // Перейти на страницу Збережене
  navigate("/saved");
};

// Тип для элемента списка покупок
type ShoppingItem = {
  id: string;
  name: string;
   amount?: number;
  unit?: string;
  recipeTitle?: string; // Позначаємо як обов'язкове, якщо це завжди буде з рецептом
};

// Функция добавления выбранных ингредиентов в список покупок
const handleAddToShoppingList = () => {
  // Выбираем отмеченные ингредиенты
  const selectedItems: ShoppingItem[] = details.ingredients
    .filter((_, index) => selectedIngredients[index])
    .map((ingredient) => ({
      id: `${Date.now()}-${ingredient.name}-${Math.random()}`,
      name: ingredient.name,
      amount: ingredient.amount ? ingredient.amount * servings : undefined,
      unit: ingredient.unit,
      recipeTitle: recipe.title,
    }));

  if (selectedItems.length === 0) {
    alert("Оберіть хоча б один інгредієнт!");
    return;
  }

  // Загружаем текущие продукты
  const savedProducts: ShoppingItem[] = JSON.parse(
    localStorage.getItem("shoppingProducts") || "[]"
  );

  // Добавляем новые
  const updatedProducts = [...savedProducts, ...selectedItems];

  // Сохраняем в localStorage
  localStorage.setItem("shoppingProducts", JSON.stringify(updatedProducts));

  console.log("Products saved:", updatedProducts); // ✅ лог для проверки

  alert("Інгредієнти додані до списку покупок!");
  navigate("/shopping-list");
};

  return (
    <main className={styles.main}>
      <Header
        showSearch={false}
        customSearch={
          <div className={styles.customSearchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.customSearch}
              placeholder="Пошук…"
            />
          </div>
        }
          showBackButton
          backButtonLabel="До списку рецептів"   // 👈 свой текст
          onBackClick={() => navigate(-1)}
      />

      <section className={styles.productInfo}>
        <div className={styles.imagePlaceholder}   style={{
    backgroundImage: recipe.image ? `url(${recipe.image})` : "none",
  }}>
          <div className={styles.imageTopButton}>
            <button className={styles.exportButton}>
              <img src={exportIcon} alt="export" />
            </button>
            <button className={styles.flagButton}>
              <img src={flagIcon} alt="flag" />
            </button>
          </div>

          <div className={styles.productImageInfo}>
            <div className={styles.productComplexity}>
              <div className={styles.iconComplexity}>
                <img src={iconComplexity} alt="comp" />
              </div>
              <div className={styles.textComplexity}>
                <div className={styles.details}>{recipe.complexity}</div>
                <p className={styles.titleComplexity}>Рівень</p>
              </div>
            </div>

            <div className={styles.productTime}>
              <div className={styles.iconComplexity}>
                <img src={iconTime} alt="time" />
              </div>
              <div className={styles.textComplexity}>
                <div className={styles.details}>{recipe.time}</div>
                <p className={styles.titleComplexity}>Час готування</p>
              </div>
            </div>

            <div className={styles.productRating}>
              <div className={styles.iconComplexity}>
                <img src={iconStar} alt="star" />
              </div>
              <div className={styles.texComplexity}>
                <div className={styles.details}>{recipe.rating}</div>
                <p className={styles.titleComplexity}>Рейтинг</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.productTitle}>
          <h1 className={styles.title}>{recipe.title}</h1>
          <p className={styles.textMain}>{details.description}</p>
        </div>

            {/* Блок с ингредиентами и питательной ценностью */} 
        <div className={styles.productIngredients}>
          <div className={styles.productBlock}>
            <div className={styles.ingredientsTitle}>
              <h2 className={styles.titleIngredients}>Інгредієнти</h2>
              <div className={styles.portion}>
                <p className={styles.textPortion}>порцій:</p>
                <div className={styles.servingsControl}>
                  <button onClick={handleDecrease} className={styles.servingBtn}>-</button>
                  <span className={styles.servingsValue}>{servings}</span>
                  <button onClick={handleIncrease} className={styles.servingBtn}>+</button>
                </div>
              </div>
            </div>

            {/* Кнопки выбора/очистки ингредиентов */}
            <div className={styles.monipulateIngredients}>
              <button onClick={clearAll} className={styles.cleartAll}>Очистити</button>
              <button onClick={selectAll} className={styles.checkAll}>Обрати все</button>
            </div>

            {/* Список ингредиентов */}
           <ul className={styles.ingredientsList}>
  {details.ingredients.map((ingredient, index) => {
    const amount =
      ingredient.amount !== undefined ? ingredient.amount * servings : undefined;

    return (
      <li key={index} className={styles.ingredientItem}>
        <input
          type="checkbox"
          id={`ingredient-${index}`}
          className={styles.ingredientCheckbox}
          checked={selectedIngredients[index]}       // ✅ связываем с состоянием
          onChange={() => toggleIngredient(index)}   // ✅ переключение состояния при клике
        />
        <label htmlFor={`ingredient-${index}`} className={styles.ingredientLabel}>
          <span className={styles.ingredientName}>{ingredient.name}</span>
          {amount !== undefined || ingredient.unit ? (
            <span className={styles.ingredientAmount}>
              {amount !== undefined ? amount : ""} {ingredient.unit || ""}
            </span>
          ) : null}
        </label>
      </li>
    );
  })}
</ul>

        <button
  className={styles.addToListButton}
  onClick={handleAddToShoppingList}   // ✅ здесь вызываем нашу функцию
>
  Додати до списку покупок
</button>
          </div>
              {/* Блок с информацией о питательной ценности */}
          <div className={styles.nutritionBlock}>
            <div className={styles.nutritionText}>
              <h2 className={styles.nutritionTitle}>Поживна цінність</h2>
              <p className={styles.nutritionSubtitle}>(на 100г)</p>
            </div>
               {/* Сетка с элементами питания */}
            <div className={styles.nutritionGrid}>
              {details.nutrition?.map((n, idx) => (
                <div key={idx} className={styles.nutritionItem}>
                  <span className={styles.nutritionName}>{n.name}</span>
                  <span className={styles.nutritionAmount}>{n.amount! * servings} {n.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
            {/* Блок с шагами приготовления */}
        <section className={styles.recipeSteps}>
          <h2 className={styles.stepsTitle}>Як приготувати</h2>
          <ol className={styles.stepsList}>
            {details.steps.map((step, idx) => (
              <li key={idx} className={styles.stepItem}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>{idx + 1}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>

                <p className={styles.stepDescription}>{step.description}</p>

                {step.image ? (
                  <img src={step.image} alt={step.title} className={styles.stepImage} />
                ) : (
                  <div className={styles.stepPlaceholder}></div>
                )}
              </li>
            ))}
          </ol>
        </section>
        {/* Блок действий с рецептом */}
        <div className={styles.recipeActions}>
 <button className={styles.actionButton} onClick={handleSaveRecipe}>
      Зберегти
      <img src={flagIcon} alt="flag" className={styles.actionIcon} />
    </button>
  <button
      className={styles.actionButton}
      onClick={() =>
        navigate("/planner", {
          state: {
            addedRecipe: recipe,
            category: targetCategory,
            date: selectedDate || new Date().toLocaleDateString(),
          },
        })
      }
    >
      До плану
      <img src={iconCalendar} alt="calendar" className={styles.actionIcon} />
    </button>


          <button className={styles.actionButton}>Друкувати
            <img src={iconPrinter} alt="printer" className={styles.actionIcon} />
          </button>
          <button className={styles.actionButton}>Поділитись
            <img src={exportIcon} alt="export" className={styles.actionIcon} />
          </button>
        </div>

        {/* Блок тегов */}
         <div className={styles.tagsBlock}>
          <h2 className={styles.titleTags}>Теги</h2>
         <div className={styles.recipeTags}>
        {details.tags?.map((tag, index) => (
        <span key={index} className={styles.tag}>
          {tag}
        </span>
        ))}
        </div>
      </div>

        {/* Блок с информацией о авторе и метаинформацией */}
<div className={styles.customAuthorCard}>
  <p className={styles.autorcardTitle}>Автор</p>
  <div className={styles.autocardBlock}>
  <div className={styles.avatar}></div>
  <div className={styles.authorInfo}>
    <div className={styles.authorHeader}>
    <div className={styles.authorDetails}>
    <p className={styles.name}>{authorData.name}</p>
    {authorData.email && <p className={styles.email}>{authorData.email}</p>}
    </div>
<p className={styles.stats}>
  <span className={styles.statsNumber}>{authorData.recipesCount}</span>
  <span className={styles.statsText}>
    рецепт{authorData.recipesCount === 1 ? "" : "ів"}
  </span>

  <span className={styles.statsNumber}>
    {formatFollowers(authorData.followers)}
  </span>
  <span className={styles.statsText}>
    підписник{authorData.followers === 1 ? "" : "ів"}
  </span>
</p>
    </div>
    <button className={styles.subscribeButton}>Підписатись</button>
    </div>
  </div>
</div>

       {/* Блок с отзывами */}
       <section className={styles.commentsBlock}>
   <div className={styles.ratingHeader}>
    <h2 className={styles.commentsTitle}>Коментарі</h2>
    <div className={styles.userRating}>
      <span className={styles.ratingLabel}>Натисніть, щоб оцінити:</span>
      <div className={styles.stars}>
  {[1,2,3,4,5].map((star) => (
    <span
      key={star}
      className={`${styles.star} ${star <= rating ? styles.filled : ""} ${hoverRating === star ? styles.hovered : ""}`}
      onClick={() => setRating(star)}
      onMouseEnter={() => setHoverRating(star)}
      onMouseLeave={() => setHoverRating(0)}
    >
      ★
    </span>
  ))}
</div>
    </div>
  </div>
  <hr />

  {/* Форма для добавления нового комментария */}
  <form
    className={styles.commentForm}
    onSubmit={(e) => {
      e.preventDefault();
      const target = e.target as typeof e.target & {
        commentInput: { value: string };
      };
      const text = target.commentInput.value.trim();
      if (!text) return;
      setComments((prev) => [
        ...prev,
        { author: "Ви", email: "", likes: 0, dislikes: 0, date: new Date().toLocaleDateString(), rating, text },
      ]);
      target.commentInput.value = "";
    }}
  >
    <div className={styles.inputWrapper}>
  <textarea
    name="commentInput"
    className={styles.commentInput}
    placeholder="Додати коментар.."
    rows={3}
  />
  <img src={iconCamera} alt="star" className={styles.inputIcon} />
</div>
    <button type="submit" className={styles.commentButton}>
      Залишити відгук 
    </button>
  </form>

  {/* Список комментариев */}
<div className={styles.commentsBlockPeople}>
  <ul className={styles.commentsList}>
    {comments.map((comment, idx) => (
      <li key={idx} className={styles.commentItem}>
        <div className={styles.commentMainBlock}>
        <div className={styles.avatarComment}></div>
        <div className={styles.commentContent}>
        <div className={styles.commentHeader}>
          <div className={styles.commentAuthorBlock}>
            <div className={styles.authorInfoBlock}>
            <span className={styles.commentAuthor}>{comment.author}</span>
            <span className={styles.commentEmail}>{comment.email}</span>
            </div>
            <span className={styles.commentDate}>{comment.date}</span>
            </div>
            <div className={styles.commentRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${
                    star <= comment.rating ? styles.filled : ""
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        
        <p className={styles.commentText}>{comment.text}</p>
        <div className={styles.commentActionsBlock}>
          <button className={styles.commentActionButton}>Відповісти</button>
          <div className={styles.commentActions}>
          <button className={styles.likeButton} onClick={() => handleLike(idx, "like")}>
            <img src={like} alt="Like" className={styles.icon} /> {comment.likes}
           </button>
            <button className={styles.dislikeButton} onClick={() => handleLike(idx, "dislike")}>
          <img src={dislike} alt="Dislike" className={styles.icon} /> {comment.dislikes}
            </button>
         <button className={styles.reportButton}>
            <img src={more_one} alt="more" className={styles.icon} />
         </button>
        </div>
        </div>
        </div>
        </div>
      </li>
    ))}
  </ul>
  
</div>
  <button className={styles.loadMoreButton}>Дивитись всі коментарі<FaArrowRight /></button>


</section>

   {/* Блок Схожі страви */}
<section className={styles.similarRecipesBlock}>
  <div className={styles.similarHeader}>
  <h2 className={styles.similarTitle}>Схожі страви</h2>
   <button className={styles.allButton}  onClick={() => navigate("/recipes")}>
            Всі <ChevronRight size={18} />
          </button>
            </div>
  <div className={styles.similarCardsWrapper}>
    {getAllRecipes()
      .filter(r => r.id !== recipe.id) // исключаем текущий рецепт
      .slice(0, 3) // максимум 4 карточки
      .map(r => (
        <RecipeCard key={r.id} {...r} />
      ))}
  </div>
</section>



      </section>
    </main>
  );
};

export default ProductInfoPage;
