/* eslint-disable react/react-in-jsx-scope */
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import SelectRecipeModal from './SelectRecipeModal';
import { getAllRecipes } from '../../data/recipes';

jest.mock('../../data/recipes', () => ({
  getAllRecipes: jest.fn(),
}));

describe('SelectRecipeModal', () => {
  const mockRecipes = [
    { id: 'r1', title: 'Салат Цезар' },
    { id: 'r2', title: 'Паста Болоньєзе' },
    { id: 'r3', title: 'Суп' },
  ];

  beforeEach(() => {
    (getAllRecipes as jest.Mock).mockReturnValue(mockRecipes);
    localStorage.setItem(
      'savedCollections',
      JSON.stringify([
        {
          id: 'c1',
          name: 'Колекція 1',
          recipes: [{ id: 'r1', dateSaved: '2025-09-29' }],
        },
        { id: 'c2', name: 'Колекція 2', recipes: [] },
      ]),
    );
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('не рендерится, если isOpen = false', () => {
    const { container } = render(
      <SelectRecipeModal isOpen={false} onClose={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('рендерит модалку и заголовки', () => {
    render(<SelectRecipeModal isOpen onClose={jest.fn()} />);
    expect(screen.getByText('Додати страву')).toBeInTheDocument();
    expect(screen.getByText('Збережене')).toBeInTheDocument();
    expect(screen.getByText('Колекція 1')).toBeInTheDocument();
    expect(screen.getByText('Колекція 2')).toBeInTheDocument();
  });

  test('закрытие модалки по кнопке X вызывает onClose', () => {
    const onClose = jest.fn();
    render(<SelectRecipeModal isOpen onClose={onClose} />);
    // ищем по aria-label (если кнопка без текста)
    const closeBtn = screen.getByRole('button', { name: /закрити/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  test('клик по кнопке назад вызывает onBack если передан', () => {
    const onBack = jest.fn();
    render(
      <SelectRecipeModal isOpen onClose={jest.fn()} onBack={onBack} />,
    );
    const backBtn = screen.getByText(/Назад/i);
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalled();
  });

  test('клик по коллекции открывает CollectionModal', async () => {
    render(<SelectRecipeModal isOpen onClose={jest.fn()} />);
    const collectionCard = screen.getByText('Колекція 2'); // пустая коллекция
    fireEvent.click(collectionCard);

    await waitFor(() => {
      expect(screen.getByText('Рецепти відсутні')).toBeInTheDocument();
    });
  });
});
