/* eslint-disable react/react-in-jsx-scope */
// __tests__/RecipesPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecipesPage from './RecipePage';

describe('RecipesPage', () => {
  test('открывает и закрывает дропдаун сортировки', () => {
    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>,
    );

    const sortButton = screen.getByText(/Сортувати за/i);
    fireEvent.click(sortButton);
    expect(screen.getByText(/За рейтингом/i)).toBeInTheDocument();

    fireEvent.mouseDown(document);
    expect(screen.queryByText(/За рейтингом/i)).not.toBeInTheDocument();
  });

  test('открывает и закрывает фильтр-модал', () => {
    render(
      <MemoryRouter>
        <RecipesPage />
      </MemoryRouter>,
    );

    const filterButton = screen.getByText(/Фільтр/i);
    fireEvent.click(filterButton);

    expect(
      screen.getByText(/Очистити/i) || screen.getByText(/Застосувати/i),
    ).toBeInTheDocument();
  });
});
