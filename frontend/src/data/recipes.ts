// src/data/recipes.ts
import image1 from "../assets/recepes/image_1.png";

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
  { id: "r1", title: " Молода капуста з куркою, томатами та сиром", author: "Лілія Климчук", complexity: "Легко", time: "45 хв", rating: 4.7,  image: image1   },
  { id: "r2", title: "Сирна шарлотка з яблуками", author: "Марія Шевченко", complexity: "Складно", time: "1 год 30 хв", rating: 4.3 },
  { id: "r3", title: "Перець з куркою у духовці", author: "Юлія Романенко", complexity: "Помірно", time: "1 год 15 хв", rating: 4.9 },
];

export const popularRecipes: Recipe[] = [
  { id: "r4", title: "Лазанья з овочами для всієї родини", author: "Дмитро Савченко", complexity: "Легко", time: "45 хв", rating: 4.7 },
  { id: "r5", title: "Суп-пюре з броколі та сиром", author: "Юлія Мельник", complexity: "Складно", time: "1 год 30 хв", rating: 4.3 },
  { id: "r6", title: "Швидка паста з куркою та овочами", author: "Софія Дорошенко", complexity: "Помірно", time: "1 год 15 хв", rating: 4.9 },
];

export const summerOffers: Recipe[] = [
  { id: "r7", title: "Фруктовий салат із полуницею та персиками", author: "Лілія Климчук", complexity: "Легко", time: "45 хв", rating: 4.7 },
  { id: "r8", title: "Печені персики з медом і горіхами", author: "Марія Шевченко", complexity: "Складно", time: "1 год 30 хв", rating: 4.3 },
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