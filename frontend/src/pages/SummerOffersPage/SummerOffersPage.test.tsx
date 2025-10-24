/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SummerOffersPage from './SummerOffersPage';
import { summerOffers } from '../../data/recipes';

describe('SummerOffersPage', () => {
  const renderPage = () => render(
    <MemoryRouter>
      <SummerOffersPage />
    </MemoryRouter>,
  );

  test('рендерит заголовок и Header', () => {
    renderPage();
    expect(screen.getByText('Літні сезонні пропозиції')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('рендерит карточки рецептов', () => {
    renderPage();
    const cards = screen.getAllByTestId('recipe-card');
    expect(cards.length).toBeGreaterThan(0);

    const titles = summerOffers.map((r) => r.title);
    cards.forEach((card) => {
      const text = card.textContent || '';
      expect(titles.some((title) => text.includes(title))).toBe(true);
    });
  });

  test('клик по кнопке сортировки открывает и закрывает dropdown', () => {
    renderPage();
    const sortButton = screen.getByText(/Сортувати за/i);
    fireEvent.click(sortButton);

    const dropdown = screen.getByTestId('sort-dropdown');
    expect(dropdown).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(dropdown).not.toBeInTheDocument();
  });

  test('клик по кнопке фильтра открывает FilterModal', () => {
    renderPage();
    const filterButton = screen.getByText(/Фільтр/i);
    fireEvent.click(filterButton);

    const modal = screen.getByTestId('filter-modal');
    expect(modal).toBeInTheDocument();
  });
});
