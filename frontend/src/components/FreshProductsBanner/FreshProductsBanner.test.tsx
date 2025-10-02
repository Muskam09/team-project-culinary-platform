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

  test('рендерит кнопку з текстом і иконкой', () => {
    render(<FreshProductsBanner />);

    const button = screen.getByRole('button', { name: /Спробувати зараз/i });
    expect(button).toBeInTheDocument();

    // Проверяем, что внутри кнопки есть иконка ShoppingBag
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
