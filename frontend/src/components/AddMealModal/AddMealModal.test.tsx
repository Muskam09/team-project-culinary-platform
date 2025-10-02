/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import AddMealModal from './AddMealModal';

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

describe('AddMealModal', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSave.mockClear();
  });

  test('рендерит модалку и элементы', () => {
    render(<AddMealModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    expect(screen.getByRole('heading', { name: 'Додати страву' })).toBeInTheDocument();

    // Находим кнопку "Додати страву" через класс
    const addButton = screen.getByRole('button', { name: /Додати страву/i });
    expect(addButton).toBeDisabled();
  });

  test('закрытие модалки через кнопку X', () => {
    render(<AddMealModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    // Кнопка закрытия имеет класс closeBtn
    const closeBtn = screen.getAllByRole('button').find((btn) => btn.classList.contains('closeBtn'));
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('изменение категории и порций', () => {
    render(<AddMealModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    // Категория - кастомный select, ищем по классу
    const select = screen.getByDisplayValue('Сніданок');
    fireEvent.change(select, { target: { value: 'Обід' } });
    expect(screen.getByDisplayValue('Обід')).toBeInTheDocument();

    // Порции - обычный input number
    const portionsInput = screen.getByPlaceholderText('Укажіть кількість порцій') as HTMLInputElement;
    fireEvent.change(portionsInput, { target: { value: '3' } });
    expect(portionsInput.value).toBe('3');
  });

  test("кнопка 'Додати страву' заблокирована без рецепту", () => {
    render(<AddMealModal isOpen onClose={mockOnClose} onSave={mockOnSave} />);

    const addButton = screen.getByRole('button', { name: /Додати страву/i }) as HTMLButtonElement;
    expect(addButton).toBeDisabled();
  });
});
