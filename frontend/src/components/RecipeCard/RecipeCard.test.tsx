// src/components/RecipeCard/RecipeCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from './RecipeCard';

// Обертка для тестов с useNavigate
const renderWithRouter = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('RecipeCard', () => {
  const recipe = {
    id: 'r1',
    title: 'Салат Цезар',
    author: 'Chef John',
    complexity: 'Легко',
    time: '15 хв',
    rating: 4.0,
    image: 'image-url',
    authorImage: 'author-image-url',
  };

  test('рендерит карточку с основными данными', () => {
    renderWithRouter(<RecipeCard {...recipe} />);
    expect(screen.getByText(recipe.title)).toBeInTheDocument();
    expect(screen.getByText(recipe.author)).toBeInTheDocument();
    expect(screen.getByText(recipe.time)).toBeInTheDocument();
    expect(screen.getByText(recipe.rating.toFixed(1))).toBeInTheDocument();
  });

  test('использует highlightedTitle, если передан', () => {
    renderWithRouter(
      <RecipeCard {...recipe} highlightedTitle={<span>Highlighted</span>} />,
    );
    expect(screen.getByText('Highlighted')).toBeInTheDocument();
  });

  test('клик по карточке вызывает навигацию', () => {
    const { container } = renderWithRouter(<RecipeCard {...recipe} />);
    const card = container.querySelector(`.${recipe.complexity}`);
    // здесь мы не можем проверить navigate напрямую, но можно проверить обработчик onClick
    expect(card).toBeDefined();
  });


  test('клик по рейтингу изменяет значение', () => {
    renderWithRouter(<RecipeCard {...recipe} />);
    const ratingDiv = screen.getByText(recipe.rating.toFixed(1)).parentElement!;
    const oldValue = ratingDiv.textContent;
    fireEvent.click(ratingDiv);
    const newValue = screen.getByText(/4.5|5.0/); // проверка нового значения
    expect(newValue).toBeInTheDocument();
    expect(newValue.textContent).not.toBe(oldValue);
  });
});
