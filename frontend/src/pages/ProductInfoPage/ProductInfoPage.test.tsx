/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/ProductInfoPage/ProductInfoPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductInfoPage from './ProductInfoPage';
import * as recipesModule from '../../data/recipes';

// --- Мокаем данные ---
const mockRecipe = {
  id: 'r1',
  title: 'Тестовий рецепт',
  complexity: 'Легко',
  time: '30 хв',
  rating: 4,
  author: 'Автор Тест',
  authorImage: '',
  image: '',
};

const mockDetails = [
  {
    id: 'r1',
    description: 'Опис тестового рецепту',
    ingredients: [
      { name: 'Інгредієнт 1', amount: 100, unit: 'г' },
      { name: 'Інгредієнт 2', amount: 200, unit: 'мл' },
    ],
    steps: [
      { description: 'Крок 1', title: 'Крок 1' },
      { description: 'Крок 2', title: 'Крок 2' },
    ],
    nutrition: [
      { name: 'Білки', amount: 10, unit: 'г' },
      { name: 'Жири', amount: 5, unit: 'г' },
    ],
    tags: ['тег1', 'тег2'],
  },
];

// --- Мокаем модули ---
jest.spyOn(recipesModule, 'getAllRecipes').mockReturnValue([mockRecipe]);

jest.mock('../../data/recipeDetails', () => ({
  recipeDetails: [
    {
      id: 'r1',
      description: 'Опис тестового рецепту',
      ingredients: [
        { name: 'Інгредієнт 1', amount: 100, unit: 'г' },
        { name: 'Інгредієнт 2', amount: 200, unit: 'мл' },
      ],
      steps: [
        { description: 'Крок 1', title: 'Крок 1' },
        { description: 'Крок 2', title: 'Крок 2' },
      ],
      nutrition: [
        { name: 'Білки', amount: 10, unit: 'г' },
        { name: 'Жири', amount: 5, unit: 'г' },
      ],
      tags: ['тег1', 'тег2'],
    },
  ],
}));

// --- Тестовый рендер ---
const renderPage = () => {
  render(
    <MemoryRouter initialEntries={['/product/r1']}>
      <Routes>
        <Route path="/product/:id" element={<ProductInfoPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ProductInfoPage', () => {
  test('рендерит заголовок и описание рецепта', () => {
    renderPage();
    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
    expect(screen.getByText(mockDetails[0].description)).toBeInTheDocument();
  });

  test('рендерит список ингредиентов', () => {
    renderPage();
    mockDetails[0].ingredients.forEach((ing) => {
      expect(screen.getByText(ing.name)).toBeInTheDocument();
    });
  });

  test('рендерит блок шагов приготовления', () => {
    renderPage();
    mockDetails[0].steps.forEach((step) => {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  test('рендерит блок тегов', () => {
    renderPage();
    mockDetails[0].tags.forEach((tag) => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });
  });
});
