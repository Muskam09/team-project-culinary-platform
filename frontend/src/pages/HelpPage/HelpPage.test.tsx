/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
// src/pages/HelpPage/HelpPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import HelpPage from './HelpPage';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../components/Header/Header', () => function () {
  return <div>Header</div>;
});

describe('HelpPage', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('рендерится корректно', () => {
    render(<HelpPage />);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Чим ми можемо допомогти?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Введіть тему або ключеві слова/i)).toBeInTheDocument();
    expect(screen.getByText('Поширені запитання')).toBeInTheDocument();
    expect(screen.getByText('Потрібна додаткова допомога?')).toBeInTheDocument();
  });

  test('поля поиска обновляются при вводе', () => {
    render(<HelpPage />);
    const searchInput = screen.getByPlaceholderText(/Введіть тему або ключеві слова/i);
    fireEvent.change(searchInput, { target: { value: 'тест' } });
    expect(searchInput).toHaveValue('тест');
  });

  test('кнопки FAQ вызывают navigate или alert', () => {
    render(<HelpPage />);

    const accountBtn = screen.getByText(/Обліковий запис/i).closest('button')!;
    fireEvent.click(accountBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/account');

    const recipesBtn = screen.getByText(/Рецепти та використання сервісу/i).closest('button')!;
    fireEvent.click(recipesBtn);
    expect(window.alert).toHaveBeenCalledWith('Категорія: Сімейний акаунт');

    const premiumBtn = screen.getByText(/Оплата та підписка/i).closest('button')!;
    fireEvent.click(premiumBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/premium');

    const notificationsBtn = screen.getByText(/Сповіщення та технічні питання/i).closest('button')!;
    fireEvent.click(notificationsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/mesage');
  });

  test('форма поддержки отправляет alert и очищает поля', () => {
    render(<HelpPage />);

    const nameInput = screen.getByPlaceholderText(/Ваше ім’я/i);
    const emailInput = screen.getByPlaceholderText(/Ваша електронна адреса/i);
    const subjectInput = screen.getByPlaceholderText(/Тема звернення/i);
    const descriptionTextarea = screen.getByPlaceholderText(/Опишіть ситуацію або питання/i);

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test subject' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Test description' } });

    const submitBtn = screen.getByText(/Надіслати повідомлення/i).closest('button')!;
    fireEvent.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith(
      'Ім\'я: John\nEmail: john@example.com\nТема: Test subject\nОпис: Test description',
    );

    // После отправки поля должны быть очищены
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(subjectInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
  });
});
