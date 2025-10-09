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
});
