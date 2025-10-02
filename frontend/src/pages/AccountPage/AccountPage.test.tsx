/* eslint-disable react/react-in-jsx-scope */
// src/pages/AccountPage/AccountPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import AccountPage from './AccountPage';

// Мокаем useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('AccountPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("рендерит заголовок страницы и кнопку 'До допомоги'", () => {
    render(<AccountPage />);
    expect(screen.getByText('Обліковий запис')).toBeInTheDocument();
    expect(screen.getByText('До допомоги')).toBeInTheDocument();
  });

  test("кнопка 'До допомоги' вызывает navigate с '/help'", () => {
    render(<AccountPage />);
    const helpBtn = screen.getByText('До допомоги');
    fireEvent.click(helpBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/help');
  });

  test('рендерит все секции с вопросами', () => {
    render(<AccountPage />);
    expect(screen.getByText('Як змінити пароль до свого облікового запису?')).toBeInTheDocument();
    expect(screen.getByText('Як змінити адресу електронної пошти або номер телефону?')).toBeInTheDocument();
    expect(screen.getByText('Чи можна видалити свій обліковий запис?')).toBeInTheDocument();
  });

  test('клик по секции раскрывает и скрывает ответ', () => {
    render(<AccountPage />);
    const firstSectionBtn = screen.getByText('Як змінити пароль до свого облікового запису?');

    // Сначала ответ не виден
    expect(screen.queryByText(/Щоб змінити пароль/)).not.toBeInTheDocument();

    // Клик раскрывает
    fireEvent.click(firstSectionBtn);
    expect(screen.getByText(/Щоб змінити пароль/)).toBeInTheDocument();

    // Клик снова скрывает
    fireEvent.click(firstSectionBtn);
    expect(screen.queryByText(/Щоб змінити пароль/)).not.toBeInTheDocument();
  });

  test('только одна секция открыта одновременно', () => {
    render(<AccountPage />);
    const firstSectionBtn = screen.getByText('Як змінити пароль до свого облікового запису?');
    const secondSectionBtn = screen.getByText('Як змінити адресу електронної пошти або номер телефону?');

    // Раскрываем первую
    fireEvent.click(firstSectionBtn);
    expect(screen.getByText(/Щоб змінити пароль/)).toBeInTheDocument();

    // Раскрываем вторую
    fireEvent.click(secondSectionBtn);
    expect(screen.getByText(/Щоб змінити адресу електронної пошти/)).toBeInTheDocument();
    expect(screen.queryByText(/Щоб змінити пароль/)).not.toBeInTheDocument();
  });
});
