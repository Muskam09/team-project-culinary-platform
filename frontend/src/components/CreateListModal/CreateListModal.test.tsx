/* eslint-disable react/react-in-jsx-scope */
// src/components/CreateListModal/CreateListModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import CreateListModal from './CreateListModal';

const mockOnClose = jest.fn();
const mockOnCreate = jest.fn();
const mockOnEdit = jest.fn();

describe('CreateListModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('рендерит модалку в режиме создания', () => {
    render(<CreateListModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    expect(screen.getByText('Новий список')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Наприклад: «Покупки на тиждень»')).toBeInTheDocument();
    expect(screen.getByText('Скасувати')).toBeInTheDocument();
    expect(screen.getByText('Створити список')).toBeInTheDocument();
  });

  test('закрывает модалку по кнопке Скасувати', () => {
    render(<CreateListModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    const cancelBtn = screen.getByText('Скасувати');
    fireEvent.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('ввод названия и описания работает', () => {
    render(<CreateListModal onClose={mockOnClose} onCreate={mockOnCreate} />);

    const nameInput = screen.getByPlaceholderText('Наприклад: «Покупки на тиждень»');
    const descInput = screen.getByPlaceholderText('Наприклад: «Продукти для вечері з друзями»');

    fireEvent.change(nameInput, { target: { value: 'Мій список' } });
    fireEvent.change(descInput, { target: { value: 'Опис списку' } });

    expect(nameInput).toHaveValue('Мій список');
    expect(descInput).toHaveValue('Опис списку');
  });

  test('создание нового списка вызывает onCreate с правильными данными', () => {
    render(<CreateListModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByPlaceholderText('Наприклад: «Покупки на тиждень»');
    fireEvent.change(nameInput, { target: { value: 'Мій список' } });

    const createBtn = screen.getByText('Створити список');
    fireEvent.click(createBtn);

    expect(mockOnCreate).toHaveBeenCalledWith('Мій список', '', expect.any(String)); // цвет любой из COLORS
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('кнопка создания disabled если имя пустое', () => {
    render(<CreateListModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    const createBtn = screen.getByText('Створити список') as HTMLButtonElement;
    expect(createBtn.disabled).toBe(true);
  });

  test('редактирование списка вызывает onEdit с правильными данными', () => {
    const initialData = {
      id: '1', name: 'Старий список', description: 'Опис', color: 'rgba(255, 70, 70, 1)',
    };
    render(
      <CreateListModal
        onClose={mockOnClose}
        onCreate={mockOnCreate}
        onEdit={mockOnEdit}
        initialData={initialData}
      />,
    );

    const nameInput = screen.getByDisplayValue('Старий список');
    fireEvent.change(nameInput, { target: { value: 'Новий список' } });

    const saveBtn = screen.getByText('Зберегти');
    fireEvent.click(saveBtn);

    expect(mockOnEdit).toHaveBeenCalledWith({
      id: '1',
      name: 'Новий список',
      description: 'Опис',
      color: 'rgba(255, 70, 70, 1)',
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
