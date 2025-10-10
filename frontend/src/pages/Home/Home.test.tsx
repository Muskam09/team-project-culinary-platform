/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
// src/pages/Home/Home.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import { sections, summerOffers } from '../../data/recipes';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../components/Header/Header', () => function () {
  return <div>Header</div>;
});
jest.mock('../../components/RecipeCard/RecipeCard', () => function (props: any) {
  return <div data-testid="recipe-card">{props.title}</div>;
});
jest.mock('../../components/AuthorCard/AuthorCard', () => function (props: any) {
  return <div data-testid="author-card">{props.name}</div>;
});
jest.mock('../../components/FreshProductsBanner/FreshProductsBanner', () => function () {
  return <div>FreshProductsBanner</div>;
});

describe('Home page', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('рендер всех основных элементов', () => {
    render(<Home />);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('FreshProductsBanner')).toBeInTheDocument();

    sections.forEach((section) => {
      expect(screen.getByText(section.title)).toBeInTheDocument();
    });

    const recipeCards = screen.getAllByTestId('recipe-card');
    const authorCards = screen.getAllByTestId('author-card');

    expect(recipeCards.length).toBeGreaterThan(0);
    expect(authorCards.length).toBeGreaterThan(0);

    // Летние предложения отображаются в "Популярне зараз"
    if (sections.some((s) => s.title === 'Популярне зараз')) {
      summerOffers.slice(0, 3).forEach((recipe) => {
        expect(screen.getByText(recipe.title)).toBeInTheDocument();
      });
    }
  });

  test('рендер карточек рецептов и авторов при пустом searchQuery', () => {
    render(<Home />);
    const recipeCards = screen.getAllByTestId('recipe-card');
    const authorCards = screen.getAllByTestId('author-card');

    // Проверяем, что карточки есть
    expect(recipeCards.length).toBeGreaterThan(0);
    expect(authorCards.length).toBeGreaterThan(0);
  });
});
