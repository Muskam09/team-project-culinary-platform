/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import FilterModal from './FilterModal';

const mockOnClose = jest.fn();
const mockOnApply = jest.fn();

describe('FilterModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит модалку и кнопки закрытия', () => {
    render(<FilterModal isOpen onClose={mockOnClose} onApply={mockOnApply} />);

    expect(screen.getByText('Фільтр')).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('dropdown кухни открывается и работает выбор', () => {
    render(<FilterModal isOpen onClose={mockOnClose} onApply={mockOnApply} />);

    const input = screen.getByPlaceholderText('Оберіть кухню');
    fireEvent.click(input);

    const japaneseCheckbox = screen.getByLabelText('Японська') as HTMLInputElement;
    expect(japaneseCheckbox.checked).toBe(false);

    fireEvent.click(japaneseCheckbox);
    expect(japaneseCheckbox.checked).toBe(true);

    const allCheckbox = screen.getByLabelText('Всі') as HTMLInputElement;
    fireEvent.click(allCheckbox);
    expect(allCheckbox.checked).toBe(true);
  });

  test('выбор категории, времени, сложности и диеты', () => {
    render(<FilterModal isOpen onClose={mockOnClose} onApply={mockOnApply} />);

    const categoryBtn = screen.getByText('Обід');
    fireEvent.click(categoryBtn);
    expect(categoryBtn.className).toContain('active');

    const timeBtn = screen.getByText('< 30 хв');
    fireEvent.click(timeBtn);
    expect(timeBtn.className).toContain('active');

    const complexityBtn = screen.getByText('Помірно');
    fireEvent.click(complexityBtn);
    expect(complexityBtn.className).toContain('active');

    const dietBtn = screen.getByText('Веганське');
    fireEvent.click(dietBtn);
    expect(dietBtn.className).toContain('active');
  });

  test('сброс фильтров очищает все выбранные значения', () => {
    render(<FilterModal isOpen onClose={mockOnClose} onApply={mockOnApply} />);

    // выбираем фильтры
    fireEvent.click(screen.getByText('Обід'));
    fireEvent.click(screen.getByText('< 30 хв'));
    fireEvent.click(screen.getByText('Помірно'));
    fireEvent.click(screen.getByText('Веганське'));

    fireEvent.click(screen.getByText('Очистити фільтр'));

    expect(screen.getByText('Обід').className).not.toContain('active');
    expect(screen.getByText('< 30 хв').className).not.toContain('active');
    expect(screen.getByText('Помірно').className).not.toContain('active');
    expect(screen.getByText('Веганське').className).not.toContain('active');
  });

  test("кнопка 'Застосувати' вызывает onApply с выбранными фильтрами", () => {
    render(<FilterModal isOpen onClose={mockOnClose} onApply={mockOnApply} />);

    // выбираем фильтры
    fireEvent.click(screen.getByText('Обід'));
    fireEvent.click(screen.getByText('< 30 хв'));
    fireEvent.click(screen.getByText('Помірно'));
    fireEvent.click(screen.getByText('Веганське'));

    // выбираем кухню
    const input = screen.getByPlaceholderText('Оберіть кухню');
    fireEvent.click(input);
    const japaneseCheckbox = screen.getByLabelText('Японська') as HTMLInputElement;
    fireEvent.click(japaneseCheckbox);

    // клик по кнопке с data-testid
    const applyBtn = screen.getByTestId('apply-button');
    fireEvent.click(applyBtn);

    expect(mockOnApply).toHaveBeenCalledWith({
      cuisines: ['Японська'],
      category: 'Обід',
      time: '< 30 хв',
      complexity: 'Помірно',
      diet: 'Веганське',
    });
  });

  test("кнопка 'Застосувати' disabled если нет выбранных фильтров", () => {
    render(<FilterModal isOpen onClose={mockOnClose} onApply={mockOnApply} />);
    const applyBtn = screen.getByText('Застосувати') as HTMLButtonElement;
    expect(applyBtn.disabled).toBe(true);
  });
});
