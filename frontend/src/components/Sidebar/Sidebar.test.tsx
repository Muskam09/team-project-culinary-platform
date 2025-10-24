/* eslint-disable react/react-in-jsx-scope */
// src/components/Sidebar/Sidebar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

// Мокаем хуки из react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('Sidebar', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит логотип и навигацию', () => {
    render(<Sidebar />);
    expect(screen.getByAltText('Logo Icon')).toBeInTheDocument();

    expect(screen.getByText('Основне')).toBeInTheDocument();
    expect(screen.getByText('Рецепти')).toBeInTheDocument();
    expect(screen.getByText('Збережене')).toBeInTheDocument();
    expect(screen.getByText('Організація')).toBeInTheDocument();
    expect(screen.getByText('Планувальник страв')).toBeInTheDocument();
    expect(screen.getByText('Список покупок')).toBeInTheDocument();
    expect(screen.getByText('Інше')).toBeInTheDocument();
  });

  test('кнопка навигации вызывает navigate с правильным путем', () => {
    render(<Sidebar />);
    const recipesBtn = screen.getByText('Рецепти').closest('button');
    fireEvent.click(recipesBtn!);
    expect(mockNavigate).toHaveBeenCalledWith('/recipes');
  });

  test('активный путь подсвечивается', () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/recipes' });
    render(<Sidebar />);
    const recipesBtn = screen.getByText('Рецепти').closest('button');

    // Проверяем, что в className есть подстрока "active"
    expect(recipesBtn?.className).toEqual(expect.stringContaining('active'));
  });

  test('кнопка премиум вызывает navigate с /premium', () => {
    render(<Sidebar />);
    const premiumBtn = screen.getByText('Оновити').closest('button');
    fireEvent.click(premiumBtn!);
    expect(mockNavigate).toHaveBeenCalledWith('/premium');
  });

  test('рендерит блок Преміум с заголовком и текстом', () => {
    render(<Sidebar />);
    expect(screen.getByText('Станьте Преміум')).toBeInTheDocument();
    expect(screen.getByText(/Отримайте доступ до/i)).toBeInTheDocument();
    expect(screen.getByAltText('diamand')).toBeInTheDocument();
  });
});
