/* eslint-disable react/react-in-jsx-scope */
import { render, screen } from '@testing-library/react';
import FreshProductsBanner from './FreshProductsBanner';

describe('FreshProductsBanner', () => {
  test('рендерит заголовок и описание', () => {
    render(<FreshProductsBanner />);

    expect(screen.getByText('Свіжі продукти від Сільпо')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Готуй із задоволенням — ми подбаємо, щоб усі інгредієнти були під рукою',
      ),
    ).toBeInTheDocument();
  });

  test('рендерит ссылку с текстом и иконкой', () => {
    render(<FreshProductsBanner />);

    // Ищем по роли "link", так как это <a>
    const link = screen.getByRole('link', { name: /Спробувати зараз/i });
    expect(link).toBeInTheDocument();

    // Проверяем, что внутри ссылки есть svg (иконка)
    const svg = link.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Проверяем, что ссылка ведет на правильный URL
    expect(link).toHaveAttribute('href', 'https://silpo.ua/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
