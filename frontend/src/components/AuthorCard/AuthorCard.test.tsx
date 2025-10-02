/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import AuthorCard from './AuthorCard';

describe('AuthorCard', () => {
  const defaultProps = {
    name: 'Іван Іванов',
    profession: 'Шеф-кухар',
    recipesCount: 12,
    followers: 1500,
    email: 'ivan@test.com',
    className: 'customClass',
    image: 'avatar.jpg',
  };

  test('рендер имени, профессии, email и статистики', () => {
    render(<AuthorCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.profession)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.email)).toBeInTheDocument();
    expect(screen.getByText(/12 рецепт/)).toBeInTheDocument();
    expect(screen.getByText(/1.5k підписник/)).toBeInTheDocument();
  });

  test('кнопка подписки меняет текст и класс при клике', () => {
    render(<AuthorCard {...defaultProps} />);
    const button = screen.getByRole('button', { name: /підписатись/i });

    // Изначально не подписан
    expect(button).toHaveTextContent('Підписатись');
    expect(button).not.toHaveClass('subscribed');

    // Клик — подписка
    fireEvent.click(button);
    expect(button).toHaveTextContent('Підписано');
    expect(button).toHaveClass('subscribed');

    // Второй клик — отписка
    fireEvent.click(button);
    expect(button).toHaveTextContent('Підписатись');
    expect(button).not.toHaveClass('subscribed');
  });

  test('корректное форматирование подписчиков < 1000', () => {
    render(<AuthorCard {...defaultProps} followers={999} />);
    expect(screen.getByText(/999 підписник/)).toBeInTheDocument();
  });

  test('корректное форматирование подписчиков = 1000+', () => {
    render(<AuthorCard {...defaultProps} followers={1500} />);
    expect(screen.getByText(/1.5k підписник/)).toBeInTheDocument();
  });

  test('если followers не указан, показывает 0', () => {
    render(<AuthorCard {...defaultProps} followers={undefined} />);
    expect(screen.getByText(/0 підписник/)).toBeInTheDocument();
  });
});
