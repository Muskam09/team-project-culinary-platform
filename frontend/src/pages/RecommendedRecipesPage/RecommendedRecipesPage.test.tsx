/* eslint-disable react/react-in-jsx-scope */
// __tests__/RecommendedRecipesPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecommendedRecipesPage from './RecommendedRecipesPage';

// --- Мокаем react-router-dom ---
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// --- Мокаем модуль с рецептами ---
const mockRecipes = [
  {
    id: 'r1', title: 'Рецепт 1', rating: 5, time: '30 хв', complexity: 'Легко', author: 'Автор 1', category: 'Сніданок', cuisine: 'Українська', image: '', diet: '',
  },
  {
    id: 'r2', title: 'Рецепт 2', rating: 4, time: '45 хв', complexity: 'Помірно', author: 'Автор 2', category: 'Обід', cuisine: 'Італійська', image: '', diet: '',
  },
  {
    id: 'r3', title: 'Рецепт 3', rating: 3, time: '1 год', complexity: 'Складно', author: 'Автор 3', category: 'Вечеря', cuisine: 'Французька', image: '', diet: '',
  },
];

// Важно: jest.mock должен видеть переменную через функцию
jest.mock('../../data/recipes', () => ({
  __esModule: true,
  get recommendedRecipes() {
    return mockRecipes;
  },
}));

describe('RecommendedRecipesPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('рендерит заголовок и карточки рецептов', () => {
    render(
      <MemoryRouter>
        <RecommendedRecipesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Рекомендовано для тебе/i)).toBeInTheDocument();
    mockRecipes.forEach((recipe) => {
      expect(screen.getByText(recipe.title)).toBeInTheDocument();
    });
  });

  test('кнопка назад вызывает navigate(-1)', () => {
    render(
      <MemoryRouter>
        <RecommendedRecipesPage />
      </MemoryRouter>,
    );

    const backButton = screen.getByText(/До рецептів/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
