/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SavedPage from './SavedPage';

// Мокируем useNavigate заранее
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

describe('SavedPage navigate test', () => {
  beforeEach(() => {
    localStorage.setItem(
      'savedCollections',
      JSON.stringify([{ id: 'col1', name: 'Колекція', recipes: [] }]),
    );
    localStorage.setItem(
      'savedRecipes',
      JSON.stringify([{ id: 'r1', dateSaved: '' }]),
    );
    mockNavigate.mockClear();
  });

  test('клик по коллекции добавляет рецепт и вызывает navigate', () => {
    render(
      <MemoryRouter initialEntries={[{ state: { addedRecipeId: 'r1' } }]}>
        <SavedPage />
      </MemoryRouter>,
    );

    const collectionCard = screen.getByText(/Колекція/i);
    fireEvent.click(collectionCard);

    const savedCollections = JSON.parse(localStorage.getItem('savedCollections') || '[]');
    expect(savedCollections[0].recipes).toHaveLength(1);
    expect(savedCollections[0].recipes[0].id).toBe('r1');

    expect(mockNavigate).toHaveBeenCalledWith('/collection/col1', { state: {} });
  });
});
