/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import AddIngredientModal from './AddIngredientModal';

const mockOnClose = jest.fn();
const mockOnAdd = jest.fn();

const existingIngredients = [
  { name: 'Сир твердий' },
  { name: 'Помідор' },
];

const categories = ['Овочі', 'Сир', 'Молочні'];
const units = ['г', 'кг', 'шт'];

describe('AddIngredientModal', () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnAdd.mockClear();
  });

  test('закриває модалку при кліку на кнопку X', () => {
    render(
      <AddIngredientModal
        categories={categories}
        units={units}
        existingIngredients={existingIngredients}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />,
    );

    const closeButton = screen.getByRole('button', { name: '' }); // кнопка без текста
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('показує автокомпліт при введенні назви', () => {
    render(
      <AddIngredientModal
        categories={categories}
        units={units}
        existingIngredients={existingIngredients}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />,
    );

    const input = screen.getByPlaceholderText(/Наприклад/i);
    fireEvent.change(input, { target: { value: 'Сир' } });
    fireEvent.focus(input);

    expect(screen.getByText('Сир твердий')).toBeInTheDocument();
  });

  test('вибір категорії та одиниці', () => {
    render(
      <AddIngredientModal
        categories={categories}
        units={units}
        existingIngredients={existingIngredients}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />,
    );

    // Вибір категорії
    const categorySelect = screen.getByText('Оберіть категорію інгредієнта');
    fireEvent.click(categorySelect);
    fireEvent.click(screen.getByText('Сир'));
    expect(screen.getByText('Сир')).toBeInTheDocument();

    // Вибір одиниці
    const unitSelect = screen.getByText('Одиниця виміру');
    fireEvent.click(unitSelect);
    fireEvent.click(screen.getByText('г'));
    expect(screen.getByText('г')).toBeInTheDocument();
  });

  test('кнопка Додати викликає onAdd, якщо всі поля заповнені', () => {
    render(
      <AddIngredientModal
        categories={categories}
        units={units}
        existingIngredients={existingIngredients}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />,
    );

    // Назва
    const nameInput = screen.getByPlaceholderText(/Наприклад/i);
    fireEvent.change(nameInput, { target: { value: 'Помідор' } });

    // Категорія
    const categorySelect = screen.getByText('Оберіть категорію інгредієнта');
    fireEvent.click(categorySelect);
    fireEvent.click(screen.getByText('Овочі'));

    // Кількість
    const amountInput = screen.getByPlaceholderText('Укажіть кількість');
    fireEvent.change(amountInput, { target: { value: '2' } });

    // Одиниця
    const unitSelect = screen.getByText('Одиниця виміру');
    fireEvent.click(unitSelect);
    fireEvent.click(screen.getByText('шт'));

    // Кнопка
    const addButton = screen.getByRole('button', { name: /Додати інгредієнт/i });
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledWith({
      name: 'Помідор',
      category: 'Овочі',
      amount: 2,
      unit: 'шт',
    });
  });

  test('кнопка Додати заблокована, якщо поля порожні', () => {
    render(
      <AddIngredientModal
        categories={categories}
        units={units}
        existingIngredients={existingIngredients}
        onClose={mockOnClose}
        onAdd={mockOnAdd}
      />,
    );

    const addButton = screen.getByRole('button', { name: /Додати інгредієнт/i }) as HTMLButtonElement;
    expect(addButton).toBeDisabled();
  });
});
