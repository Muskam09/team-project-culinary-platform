/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
// src/pages/CollectionPage/CollectionPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import CollectionPage from './CollectionPage';
import { addMessage } from '../../data/messagesService';

// Мокаем useNavigate и useParams
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// Мокаем RecipeCard чтобы не зависеть от внутренней реализации
jest.mock('../../components/RecipeCard/RecipeCard', () => function (props: any) {
  return <div data-testid="recipe-card">{props.title}</div>;
});

// Мокаем Header
jest.mock('../../components/Header/Header', () => function () {
  return <div>Header</div>;
});

jest.mock('../../data/messagesService', () => ({
  addMessage: jest.fn(),
}));

jest.mock('../../data/recipes', () => {
  const original = jest.requireActual('../../data/recipes');
  return {
    ...original,
    getAllRecipes: jest.fn(() => [
      { id: 'r1', title: 'Recipe 1', rating: 5 },
      { id: 'r2', title: 'Recipe 2', rating: 4 },
    ]),
  };
});

describe('CollectionPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: 'col1' });

    localStorage.setItem(
      'savedCollections',
      JSON.stringify([
        {
          id: 'col1',
          name: 'My Collection',
          recipes: [{ id: 'r1', dateSaved: '2025-09-01' }],
        },
      ]),
    );
    localStorage.removeItem('messagesCreated');
    jest.clearAllMocks();
  });

  test('рендерится коллекция и рецепт', () => {
    render(<CollectionPage />);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('My Collection')).toBeInTheDocument();
    expect(screen.getByText('Recipe 1')).toBeInTheDocument();
  });

  test("кнопка 'До колекцій' вызывает navigate", () => {
    render(<CollectionPage />);
    const backBtn = screen.getByText(/До колекцій/i);
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/collection');
  });

  test('если коллекция пустая, отображается пустой блок', () => {
    localStorage.setItem(
      'savedCollections',
      JSON.stringify([{ id: 'col1', name: 'Empty', recipes: [] }]),
    );
    render(<CollectionPage />);
    expect(screen.getByText(/Ваша колекція порожня/i)).toBeInTheDocument();
    const addBtn = screen.getByText(/Додати рецепт/i);
    fireEvent.click(addBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/recipes', { state: { collectionId: 'col1' } });
  });

  test('открытие и закрытие меню редактирования', () => {
    render(<CollectionPage />);
    const menuBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(menuBtn);
    expect(screen.getByText(/Додати рецепт/i)).toBeInTheDocument();

    // Клик по опции закрывает меню
    fireEvent.click(screen.getByText(/Додати рецепт/i));
    expect(mockNavigate).toHaveBeenCalledWith('/recipes', { state: { collectionId: 'col1' } });
  });

  test('удаление рецепта из коллекции', () => {
    render(<CollectionPage />);
    const menuBtn = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(menuBtn);

    const deleteBtn = screen.getByText(/Видалити Recipe 1/i);
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Recipe 1')).not.toBeInTheDocument();
    const savedCollections = JSON.parse(localStorage.getItem('savedCollections')!);
    expect(savedCollections[0].recipes.length).toBe(0);
  });

  test('создание сообщения при загрузке коллекции', () => {
    render(<CollectionPage />);
    expect(addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Рецепт успішно збережено',
        text: expect.stringContaining('Recipe 1'),
        source: 'Збережені рецепти',
      }),
    );
  });

  test('сортировка рецептов по популярности', () => {
    render(<CollectionPage />);
    const sortBtn = screen.getByText(/Сортувати за/i);
    fireEvent.click(sortBtn);
    const option = screen.getByText(/За популярністю/i);
    fireEvent.click(option);

    // Проверяем, что меню закрылось
    expect(screen.queryByText(/За популярністю/i)).not.toBeInTheDocument();
  });
});
