// SavedPage.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SavedPage from './SavedPage';
import * as collectionsService from '../../services/collectionsService';

// ===== MOCKS =====
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: {} }),
}));

// Мок localStorage
beforeEach(() => {
  const store: Record<string, string> = {};
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => store[key as string] || null);
  jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
    store[key as string] = value as string;
  });
  jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation((key) => {
    delete store[key as string];
  });
});

// Мок сервисов коллекций
jest.mock('../../services/collectionsService');

const mockCollections = [
  { id: '1', name: 'Колекція 1', recipes: [] },
  { id: '2', name: 'Колекція 2', recipes: [] },
];

describe('SavedPage', () => {
  beforeEach(() => {
    (collectionsService.getCollectionsHybrid as jest.Mock).mockResolvedValue(mockCollections);
    (collectionsService.createCollectionHybrid as jest.Mock).mockImplementation(async (data) => ({ id: '3', ...data }));
    (collectionsService.updateCollectionHybrid as jest.Mock).mockResolvedValue(undefined);
    (collectionsService.deleteCollectionHybrid as jest.Mock).mockResolvedValue(undefined);
  });


  test('открытие модалки создания коллекции', async () => {
    render(<SavedPage />);
    const addButton = screen.getAllByText(/Додати колекцію/i)[0];
    fireEvent.click(addButton);
    expect(screen.getByText(/Створення колекції/i)).toBeInTheDocument();
  });

});
