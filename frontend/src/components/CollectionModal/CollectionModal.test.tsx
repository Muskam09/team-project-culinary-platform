/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import CollectionModal from './CollectionModal';
import * as recipesModule from '../../data/recipes';

const mockOnClose = jest.fn();
const mockOnBack = jest.fn();
const mockOnSelectRecipe = jest.fn();

// Мокаем getAllRecipes
jest.spyOn(recipesModule, 'getAllRecipes').mockReturnValue([
  {
    id: '1', title: 'Recipe 1', image: 'img1.jpg', author: 'A', complexity: 'Easy',
  },
  {
    id: '2', title: 'Recipe 2', image: 'img2.jpg', author: 'B', complexity: 'Medium',
  },
]);

const collection = {
  id: 'col1',
  name: 'Моя колекція',
  recipes: [{ id: '1', dateSaved: '2025-01-01' }],
};

describe('CollectionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('не рендерится, если isOpen = false', () => {
    render(
      <CollectionModal
        isOpen={false}
        collection={collection}
        onClose={mockOnClose}
      />,
    );
    expect(screen.queryByText('Моя колекція')).toBeNull();
  });

  test('не рендерится, если collection = null', () => {
    render(
      <CollectionModal
        isOpen
        collection={null}
        onClose={mockOnClose}
      />,
    );
    expect(screen.queryByText('Моя колекція')).toBeNull();
  });

  test('рендерится корректно с заголовком и кнопками', () => {
    render(
      <CollectionModal
        isOpen
        collection={collection}
        onClose={mockOnClose}
        onBack={mockOnBack}
      />,
    );

    expect(screen.getByText('Моя колекція')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Назад/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // close button без текста
  });

  test('отображение рецептов и пустого состояния', () => {
    render(
      <CollectionModal
        isOpen
        collection={collection}
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText('Recipe 1')).toBeInTheDocument();

    render(
      <CollectionModal
        isOpen
        collection={{ ...collection, recipes: [] }}
        onClose={mockOnClose}
      />,
    );
    expect(screen.getByText('Рецепти відсутні')).toBeInTheDocument();
  });

  test("выбор рецепта и кнопка 'Додати рецепт'", () => {
    render(
      <CollectionModal
        isOpen
        collection={collection}
        onClose={mockOnClose}
        onSelectRecipe={mockOnSelectRecipe}
      />,
    );

    const recipeCard = screen.getByText('Recipe 1').closest('div')!;
    fireEvent.click(recipeCard);

    const addButton = screen.getByText('Додати рецепт');
    fireEvent.click(addButton);

    expect(mockOnSelectRecipe).toHaveBeenCalledWith({
      id: '1',
      title: 'Recipe 1',
      image: 'img1.jpg',
      author: 'A',
      complexity: 'Easy',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("кнопка 'Додати рецепт' без выбранного рецепта вызывает alert", () => {
    window.alert = jest.fn();
    render(
      <CollectionModal
        isOpen
        collection={collection}
        onClose={mockOnClose}
        onSelectRecipe={mockOnSelectRecipe}
      />,
    );

    const addButton = screen.getByText('Додати рецепт');
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith('Оберіть рецепт перед додаванням');
  });
});
