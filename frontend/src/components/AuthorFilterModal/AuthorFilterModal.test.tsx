/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import AuthorFilterModal from './AuthorFilterModal';

const mockOnClose = jest.fn();
const mockOnApply = jest.fn();

const availableCuisines = ['Італійська', 'Японська', 'Українська'];
const availableSpecializations = ['Шеф-кухар', 'Веган-шеф'];

describe('AuthorFilterModal', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnApply.mockClear();
  });

  test('не рендерится, если isOpen = false', () => {
    render(
      <AuthorFilterModal
        isOpen={false}
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
      />,
    );

    expect(screen.queryByTestId('overlay')).toBeNull();
  });

  test('рендерится, если isOpen = true', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
      />,
    );

    expect(screen.getByTestId('overlay')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-input')).toBeInTheDocument();
    expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
    expect(screen.getByTestId('apply-filters')).toBeDisabled();
  });

  test('клик на overlay вызывает onClose', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
      />,
    );

    const overlay = screen.getByTestId('overlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('открытие/закрытие дропдауна кухонь', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
      />,
    );

    const inputWrapper = screen.getByTestId('cuisine-input-wrapper');
    fireEvent.click(inputWrapper);

    availableCuisines.forEach((c) => {
      expect(screen.getByTestId(`cuisine-${c}`)).toBeInTheDocument();
    });

    // Закрытие дропдауна
    fireEvent.click(screen.getByTestId('dropdown-apply'));
    availableCuisines.forEach((c) => {
      expect(screen.queryByTestId(`cuisine-${c}`)).toBeNull();
    });
  });

  test('выбор и снятие фильтров кухонь', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
      />,
    );

    fireEvent.click(screen.getByTestId('cuisine-input-wrapper'));

    const italianCheckbox = screen.getByTestId('cuisine-checkbox-Італійська') as HTMLInputElement;
    fireEvent.click(italianCheckbox);
    expect(italianCheckbox.checked).toBe(true);

    fireEvent.click(italianCheckbox);
    expect(italianCheckbox.checked).toBe(false);
  });

  test('кнопка Очистити фільтр сбрасывает фильтры', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
      />,
    );

    fireEvent.click(screen.getByTestId('cuisine-input-wrapper'));
    fireEvent.click(screen.getByTestId('cuisine-checkbox-Італійська'));

    const clearBtn = screen.getByTestId('clear-filters');
    fireEvent.click(clearBtn);

    expect(screen.queryByTestId('selected-cuisines')).toBeNull();
  });

  test('кнопка Застосувати вызывает onApply с выбранными фильтрами', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
        availableSpecializations={availableSpecializations}
      />,
    );

    fireEvent.click(screen.getByTestId('cuisine-input-wrapper'));
    fireEvent.click(screen.getByTestId('cuisine-checkbox-Італійська'));
    fireEvent.click(screen.getByTestId('cuisine-checkbox-Японська'));

    fireEvent.click(screen.getByTestId('specialization-Веган-шеф'));

    fireEvent.click(screen.getByTestId('apply-filters'));
    expect(mockOnApply).toHaveBeenCalledWith({
      cuisines: ['Італійська', 'Японська'],
      specialization: ['Веган-шеф'],
    });
  });

  test('выбор специализаций', () => {
    render(
      <AuthorFilterModal
        isOpen
        onClose={mockOnClose}
        onApply={mockOnApply}
        availableCuisines={availableCuisines}
        availableSpecializations={availableSpecializations}
      />,
    );

    const veganButton = screen.getByTestId('specialization-Веган-шеф');
    fireEvent.click(veganButton);
    expect(veganButton).toHaveClass('active');

    fireEvent.click(veganButton);
    expect(veganButton).not.toHaveClass('active');
  });
});
