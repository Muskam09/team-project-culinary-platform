// src/data/recipes.ts
import image1 from "../assets/recepes/image_1.png";
import image2 from "../assets/recepes/recept_2.webp";
import image3 from "../assets/recepes/recept_3.webp";
import image4 from "../assets/recepes/recept_4.webp";
import image5 from "../assets/recepes/recept_5.webp";
import image6 from "../assets/recepes/recept_6.webp";
import image7 from "../assets/recepes/recept_7.webp";
import image8 from "../assets/recepes/recept_8.webp";

export interface Recipe {
  id: string;
  title: string;
  author: string;
  complexity: string;
  time?: string;
  rating?: number;
    image?: string; 
}

export interface Author {
  id: string;
  name: string;
  email?: string; 
  profession: string;
  recipesCount?: number;
  followers?: number;
}

export interface Section {
  title: string;
  type: "recipes" | "authors";
  items: Recipe[] | Author[];
}

// --- Рецепты ---
export const recommendedRecipes: Recipe[] = [
  { id: "r1", title: " Ідеальний гарбузовий пиріг", author: "Лілія Климчук", complexity: "Легко", time: "2 год 45 хв", rating: 4.7,  image: image1   },
  { id: "r2", title: "Полуничне сирне морозиво з крихтами", author: "Марія Шевченко", complexity: "Помірно", time: "4 год 15 хв", rating: 4.3,  image: image2  },
  { id: "r3", title: "Швидкий тортилья-кіш", author: "Юлія Романенко", complexity: "Легко", time: "17 хв", rating: 4.9 , image: image3},
];

export const popularRecipes: Recipe[] = [
  { id: "r4", title: "Песто і смаженим свиним фаршем", author: "Дмитро Савченко", complexity: "Легко", time: "20 хв", rating: 4.7, image: image4 },
  { id: "r5", title: "Курка ескабече з халапеньйо, золотим родзинком та м’ятою", author: "Юлія Мельник", complexity: "Легко", time: "46 хв", rating: 4.3, image: image5 },
  { id: "r6", title: "Оливкові мафіни з чорним шоколадом", author: "Софія Дорошенко", complexity: "Помірно", time: "45 хв", rating: 4.9, image: image6 },
];

export const summerOffers: Recipe[] = [
  { id: "r7", title: "Грецький салат з нутом", author: "Лілія Климчук", complexity: "Легко", time: "20 хв", rating: 4.7, image: image7 },
  { id: "r8", title: "Суші «Грецький салат»", author: "Марія Шевченко", complexity: "Складно", time: "10 хв", rating: 4.3, image: image8 },
  { id: "r9", title: "Кабачкові оладки з зеленню", author: "Юлія Романенко", complexity: "Помірно", time: "1 год 15 хв", rating: 4.9 },
];

// --- Авторы ---
export const popularAuthors: Author[] = [
  { id: "a1", name: "Юлія Романенко", email: "yulia.romanenko@example.com",profession: "Веган-шеф", recipesCount: 356, followers: 32500 },
  { id: "a2", name: "Марія Левченко", email: "maria.levchenko@example.com", profession: "Шеф-кухар", recipesCount: 278, followers: 22400 },
  { id: "a3", name: "Катерина Бондар", email: "kateryna.bondar@example.com", profession: "Експерт з випічки", recipesCount: 230, followers: 22100 },
  { id: "a4", name: "Юлія Романенко", email: "yulia.fitness@example.com", profession: "Фітнес-нутриціолог", recipesCount: 189, followers: 12500 },
  { id: "a5", name: "Лілія Климчук", email: "@liliaCooks", profession: "Майстер грилю", recipesCount: 68, followers: 3576 },
];

// --- Секции для Home ---
export const sections: Section[] = [
  { title: "Рекомендовано для тебе", type: "recipes", items: recommendedRecipes },
  { title: "Популярне зараз", type: "recipes", items: popularRecipes },
  { title: "Популярні автори", type: "authors", items: popularAuthors },
];

// --- Утилита для получения всех рецептов ---
export const getAllRecipes = (): Recipe[] => [
  ...recommendedRecipes,
  ...popularRecipes,
  ...summerOffers,
];
export const getAllAuthors = (): Author[] => [
  ...popularAuthors,
];