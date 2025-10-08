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

  test('рендерит существующие списки', async () => {
    renderPage();
    expect(await screen.findByText('Список А')).toBeInTheDocument();
    expect(await screen.findByText('Список Б')).toBeInTheDocument();
  });

  test('отображает пустое состояние, если нет списков', async () => {
    localStorage.setItem('shoppingLists', JSON.stringify([]));
    renderPage();
    expect(await screen.findByText('У вас ще немає списків')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Додати список/i }),
    ).toBeInTheDocument();
  });

  test('открывает модальное окно создания нового списка', async () => {
    renderPage();
    const addButton = await screen.findAllByText(/Додати список/i);
    fireEvent.click(addButton[0]);
    expect(await screen.findByRole('heading', { name: /Новий список/i })).toBeInTheDocument();
  });

  test('удаление списка через меню', async () => {
    renderPage();

    const menuButton = await screen.findByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const deleteOption = await screen.findByText('Видалити');
    fireEvent.click(deleteOption);

    expect(screen.queryByText('Список А')).not.toBeInTheDocument();
    const savedLists = JSON.parse(localStorage.getItem('shoppingLists') || '[]');
    expect(savedLists.find((l: any) => l.id === '1')).toBeUndefined();
  });

  test('редактирование списка открывает модальное окно с данными', async () => {
    renderPage();

    const menuButton = await screen.findByTestId('menu-button-1');
    fireEvent.click(menuButton);

    const editOption = await screen.findByText('Редагувати');
    fireEvent.click(editOption);

    expect(await screen.findByDisplayValue('Список А')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Опис А')).toBeInTheDocument();
  });

  test('сортировка по названию', async () => {
    renderPage();
    fireEvent.click(await screen.findByText(/Сортувати за/i));
    fireEvent.click(await screen.findByText('За назвою'));

    const titles = screen.getAllByTestId(/list-title-/).map(h => h.textContent);
    const sortedTitles = [...titles].sort();
    expect(titles).toEqual(sortedTitles);
  });

  test('сортировка по дате создания', async () => {
    renderPage();
    fireEvent.click(await screen.findByText(/Сортувати за/i));
    fireEvent.click(await screen.findByText('За датою створення'));

    const titles = screen.getAllByTestId(/list-title-/).map(h => h.textContent);
    expect(titles[0]).toBe('Список А');
    expect(titles[1]).toBe('Список Б');
  });

  test('сортировка по количеству ингредиентов', async () => {
    renderPage();
    fireEvent.click(await screen.findByText(/Сортувати за/i));
    fireEvent.click(await screen.findByText('За кількістю інгредієнтів'));

    const titles = screen.getAllByTestId(/list-title-/).map(h => h.textContent);
    expect(titles[0]).toBe('Список Б'); // меньше ингредиентов
    expect(titles[1]).toBe('Список А');
  });
});
