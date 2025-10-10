/* eslint-disable react/react-in-jsx-scope */
// src/pages/ShoppingListDetailPage/ShoppingListDetailPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ShoppingListDetailPage from './ShoppingListDetailPage';

const mockList = {
  id: '1',
  name: 'Список покупок',
  createdAt: new Date().toISOString(),
  items: [
    {
      id: 'i1', name: 'Помідор', amount: 2, unit: 'шт', checked: false,
    },
    {
      id: 'i2', name: 'Молоко', amount: 1, unit: 'л', checked: true,
    },
  ],
};

// Мокаем localStorage
beforeEach(() => {
  localStorage.setItem('shoppingLists', JSON.stringify([mockList]));
});

afterEach(() => {
  localStorage.clear();
});

const renderWithRouter = (id: string) => render(
  <MemoryRouter initialEntries={[`/shopping-list/${id}`]}>
    <Routes>
      <Route path="/shopping-list/:id" element={<ShoppingListDetailPage />} />
    </Routes>
  </MemoryRouter>,
);

describe('ShoppingListDetailPage', () => {
  test('рендерится список с названием и количеством элементов', () => {
    renderWithRouter('1');
    expect(screen.getByText(mockList.name)).toBeInTheDocument();
    expect(screen.getByText(/2 елементів/)).toBeInTheDocument();
  });

  test('отображается пустой список если элементов нет', () => {
    localStorage.setItem(
      'shoppingLists',
      JSON.stringify([{ ...mockList, items: [] }]),
    );
    renderWithRouter('1');
    expect(screen.getByText(/Список продуктів порожній/i)).toBeInTheDocument();
  });

  test('можно отметить и снять отметку с ингредиента', () => {
    renderWithRouter('1');
    const checkbox = screen.getByLabelText('Помідор') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test('можно открыть и закрыть меню редактирования', () => {
    renderWithRouter('1');

    const menuButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(menuButton);

    expect(screen.getByText('Видалити всі продукти')).toBeInTheDocument();

    // закрываем меню кликом вне
    fireEvent.mouseDown(document.body);
    expect(
      screen.queryByText('Видалити всі продукти'),
    ).not.toBeInTheDocument();
  });

  test('удаление всех продуктов через меню', () => {
    renderWithRouter('1');

    // Мокаем window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByText('Видалити всі продукти'));

    // Проверяем, что появился пустой список
    expect(
      screen.getByText(/Список продуктів порожній/i),
    ).toBeInTheDocument();

    // Восстанавливаем оригинальный confirm
    confirmSpy.mockRestore();
  });

  test('удаление выбранного ингредиента через меню', () => {
    renderWithRouter('1');

    // Выбираем элемент
    fireEvent.click(screen.getByText('Помідор'));

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByText('Видалити інгредієнт'));

    expect(screen.queryByText('Помідор')).not.toBeInTheDocument();
    expect(screen.getByText('Молоко')).toBeInTheDocument();
  });

  test('открытие модального окна добавления ингредиента', () => {
    renderWithRouter('1');

    const addButton = screen
      .getAllByText(/Додати інгредієнт/i)
      .find(
        (el) => el.tagName.toLowerCase() === 'button'
          && el.classList.contains('showAddButton'),
      );
    fireEvent.click(addButton!);

    // проверяем, что появился заголовок модалки
    expect(
      screen.getByRole('heading', { name: /Додати інгредієнт/i }),
    ).toBeInTheDocument();
  });

  test('сортировка по категориям', () => {
    renderWithRouter('1');

    const sortButton = screen.getByText(/Сортувати за/i);
    fireEvent.click(sortButton);

    // ищем категорию по startsWith, чтобы не зависеть от точного текста
    const categoryTitle = screen.getByText((content) => content.startsWith('Овочі'));
    expect(categoryTitle).toBeInTheDocument();
  });
});
