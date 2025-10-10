/* eslint-disable react/react-in-jsx-scope */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PremiumPage from './PremiumPage';

describe('PremiumPage', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <PremiumPage />
      </MemoryRouter>,
    );
  });

  test('рендерит заголовок і опис', () => {
    expect(screen.getByText(/Перейдіть на преміум-аккаунт/i)).toBeInTheDocument();
    expect(screen.getByText(/Відкрийте всі функції/i)).toBeInTheDocument();
    expect(screen.getByText(/Преміум-переваги/i)).toBeInTheDocument();
    expect(screen.getByText(/Виберіть свій план/i)).toBeInTheDocument();
  });

  test("рендерит кнопку 'Оновитись зараз'", () => {
    const upgradeButton = screen.getByRole('button', { name: /Оновитись зараз/i });
    expect(upgradeButton).toBeInTheDocument();
  });

  test('рендерит все четыре преимущества', () => {
    const featureTitles = [
      'Доставка інгредієнтів',
      'Розумний планувальник харчування',
      'Без реклами',
      'Ексклюзивні рецепти',
    ];

    featureTitles.forEach((title) => {
      const el = screen.getAllByText(new RegExp(title, 'i'), { exact: false });
      expect(el.length).toBeGreaterThan(0);
    });
  });

  test('рендерит обидва тарифні плани з кнопками', () => {
    expect(screen.getAllByText(/Обрати план/i)).toHaveLength(2);
    expect(screen.getByText(/\$12/i)).toBeInTheDocument();
    expect(screen.getByText(/\$99/i)).toBeInTheDocument();
  });

  test('рендерит список функцій преміум-планів', () => {
    const features = [
      'Необмежений доступ до рецептів',
      'Необмежене планування меню',
      'Доставка продуктів із Сільпо',
      'Використання сервісу без реклами',
      'Індивідуальний план харчування',
      'Ексклюзивні рецепти від шефів',
    ];

    features.forEach((f) => {
      const el = screen.getAllByText(new RegExp(f, 'i'), { exact: false });
      expect(el.length).toBeGreaterThan(0);
    });
  });
});
