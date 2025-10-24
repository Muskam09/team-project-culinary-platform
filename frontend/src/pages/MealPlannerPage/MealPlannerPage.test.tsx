/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MealPlannerPage from './MealPlannerPage';

// Мок рецептов и ингредиентов
jest.mock('../../data/recipes', () => ({
  getAllRecipes: () => [
    {
      id: '1',
      name: 'Суп',
      category: 'Сніданок',
      ingredients: ['Вода', 'Сіль'],
    },
  ],
}));

describe('MealPlannerPage', () => {
  it('рендерится без ошибок и показывает пустой план', () => {
    render(<MemoryRouter><MealPlannerPage /></MemoryRouter>);
    expect(screen.getByText(/План на день порожній/i)).toBeInTheDocument();
  });
});
