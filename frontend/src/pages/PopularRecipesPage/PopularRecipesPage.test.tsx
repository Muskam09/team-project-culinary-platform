/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PopularRecipesPage from './PopularRecipesPage';
import { popularRecipes } from '../../data/recipes';

// Мокаем useNavigate, чтобы не было ошибок при навигации
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('PopularRecipesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит заголовок и первые рецепты', () => {
    render(
      <MemoryRouter>
        <PopularRecipesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Популярне зараз/i)).toBeInTheDocument();

    // Проверяем, что хотя бы один рецепт отображается
    const anyRecipeRendered = screen
      .getAllByText(/.+/i)
      .some((el) => popularRecipes.some((r) => el.textContent?.includes(r.title)));
    expect(anyRecipeRendered).toBe(true);
  });

  test("кнопка 'До головної' вызывает navigate(-1)", () => {
    render(
      <MemoryRouter>
        <PopularRecipesPage />
      </MemoryRouter>,
    );

    const backButton = screen.getByText(/До головної/i);
    fireEvent.click(backButton);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test('кнопка сортировки открывает и выбирает сортировку', () => {
    render(
      <MemoryRouter>
        <PopularRecipesPage />
      </MemoryRouter>,
    );

    const sortButton = screen.getByText(/Сортувати за/i);
    fireEvent.click(sortButton);

    const sortOption = screen.getByText(/За рейтингом/i);
    fireEvent.click(sortOption);

    // dropdown должен закрыться
    expect(screen.queryByText(/За рейтингом/i)).not.toBeInTheDocument();
  });

  test('кнопка фильтра открывает FilterModal и можно закрыть', () => {
    render(
      <MemoryRouter>
        <PopularRecipesPage />
      </MemoryRouter>,
    );

    const filterButton = screen.getByRole('button', { name: /Фільтр/i });
    fireEvent.click(filterButton);

    // Проверяем, что модалка открыта
    const modal = screen.getByTestId('filter-modal');
    expect(modal).toBeInTheDocument();

    // Закрытие кликом по overlay
    fireEvent.click(modal);
    expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
  });

  test("кнопка 'Показати більше' увеличивает showAll", () => {
    render(
      <MemoryRouter>
        <PopularRecipesPage />
      </MemoryRouter>,
    );

    // Проверяем, что кнопка отображается, если больше 12 рецептов
    if (popularRecipes.length > 12) {
      const showMoreButton = screen.getByText(/Показати більше/i);
      fireEvent.click(showMoreButton);

      // Теперь showAll = true, кнопка должна исчезнуть
      expect(screen.queryByText(/Показати більше/i)).not.toBeInTheDocument();
    }
  });
});
