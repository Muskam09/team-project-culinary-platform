/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
// src/pages/AuthorsPage/AuthorsPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import AuthorsPage from './AuthorsPage';
import { popularAuthors } from '../../data/recipes';

// Мокаем useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Мокаем AuthorCard чтобы не зависеть от внутренней реализации
jest.mock('../../components/AuthorCard/AuthorCard', () => function (props: any) {
  return <div data-testid="author-card">{props.name}</div>;
});

describe('AuthorsPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("рендерит заголовок и кнопку 'До головної'", () => {
    render(<AuthorsPage />);
    expect(screen.getByText('Популярні автори')).toBeInTheDocument();
    expect(screen.getByText('До головної')).toBeInTheDocument();
  });

  test("кнопка 'До головної' вызывает navigate(-1)", () => {
    render(<AuthorsPage />);
    const backBtn = screen.getByText('До головної');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('дропдаун сортировки открывается и закрывается', () => {
    render(<AuthorsPage />);
    const sortBtn = screen.getByText(/Сортувати за/i);

    // Сначала дропдаун не виден
    expect(screen.queryByText('Популярністю')).not.toBeInTheDocument();

    // Клик открывает
    fireEvent.click(sortBtn);
    expect(screen.getByText('Популярністю')).toBeInTheDocument();

    // Клик по опции закрывает дропдаун
    const option = screen.getByText('Популярністю');
    fireEvent.click(option);
    expect(screen.queryByText('Популярністю')).not.toBeInTheDocument();
  });

  test('кнопка фильтра открывает модалку AuthorFilterModal', () => {
    render(<AuthorsPage />);
    const filterBtn = screen.getByText(/Фільтр/i);
    fireEvent.click(filterBtn);
    // Проверяем что модалка рендерится
    expect(screen.getByText(/Очистити/i)).toBeInTheDocument(); // assuming clear button exists inside modal
  });

  test('рендерит карточки авторов', () => {
    render(<AuthorsPage />);
    const authorCards = screen.getAllByTestId('author-card');
    expect(authorCards.length).toBe(popularAuthors.length);
  });
});
