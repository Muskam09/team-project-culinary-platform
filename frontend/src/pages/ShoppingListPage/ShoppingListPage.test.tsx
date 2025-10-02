/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ShoppingListPage from './ShoppingListPage';

// Мок localStorage
const mockLists = [
  {
    id: '1',
    name: 'Список А',
    description: 'Опис А',
    color: '#ff0000',
    items: [
      { id: 'i1', name: 'Помідор', checked: true },
      { id: 'i2', name: 'Молоко', checked: false },
    ],
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: '2',
    name: 'Список Б',
    description: 'Опис Б',
    color: '#00ff00',
    items: [],
    createdAt: new Date('2025-01-02').toISOString(),
  },
];

beforeEach(() => {
  localStorage.setItem('shoppingLists', JSON.stringify(mockLists));
});

afterEach(() => {
  localStorage.clear();
});

describe('ShoppingListPage', () => {
  const renderPage = () => render(
    <MemoryRouter>
      <ShoppingListPage />
    </MemoryRouter>,
  );

  test('рендерит существующие списки', () => {
    renderPage();
    expect(screen.getByText('Список А')).toBeInTheDocument();
    expect(screen.getByText('Список Б')).toBeInTheDocument();
  });

  test('отображает пустое состояние, если нет списков', () => {
    localStorage.setItem('shoppingLists', JSON.stringify([]));
    renderPage();
    expect(screen.getByText('У вас ще немає списків')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Додати список/i }),
    ).toBeInTheDocument();
  });

  test('открывает модальное окно создания нового списка', () => {
    renderPage();
    const addButton = screen.getAllByText(/Додати список/i)[0];
    fireEvent.click(addButton);
    expect(
      screen.getByRole('heading', { name: /Новий список/i }),
    ).toBeInTheDocument();
  });

  test('удаление списка через меню', () => {
    renderPage();
    // Берем первую кнопку меню по классу
    const menuButtons = screen.getAllByRole('button').filter((btn) => btn.classList.contains('menuButton'));
    fireEvent.click(menuButtons[0]);

    fireEvent.click(screen.getByText('Видалити'));

    expect(screen.queryByText('Список А')).not.toBeInTheDocument();
    const savedLists = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    expect(savedLists.find((l: any) => l.id === '1')).toBeUndefined();
  });

  test('редактирование списка открывает модальное окно с данными', () => {
    renderPage();
    const menuButtons = screen.getAllByRole('button').filter((btn) => btn.classList.contains('menuButton'));
    fireEvent.click(menuButtons[0]);

    fireEvent.click(screen.getByText('Редагувати'));

    expect(screen.getByDisplayValue('Список А')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Опис А')).toBeInTheDocument();
  });

  test('сортировка по названию', () => {
    renderPage();
    fireEvent.click(screen.getByText(/Сортувати за/i));
    fireEvent.click(screen.getByText('За назвою'));

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);
    const sortedTitles = [...titles].sort();
    expect(titles).toEqual(sortedTitles);
  });

  test('сортировка по дате создания', () => {
    renderPage();
    fireEvent.click(screen.getByText(/Сортувати за/i));
    fireEvent.click(screen.getByText('За датою створення'));

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);

    expect(titles[0]).toBe('Список А');
    expect(titles[1]).toBe('Список Б');
  });

  test('сортировка по количеству ингредиентов', () => {
    renderPage();
    fireEvent.click(screen.getByText(/Сортувати за/i));
    fireEvent.click(screen.getByText('За кількістю інгредієнтів'));

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent);

    expect(titles[0]).toBe('Список Б'); // меньше ингредиентов
    expect(titles[1]).toBe('Список А');
  });
});
