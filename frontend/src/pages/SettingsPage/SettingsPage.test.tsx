/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './SettingsPage';

describe('SettingsPage full tests', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>,
    );
  });

  it('renders sidebar with all sections', () => {
    const sections = [
      'Обліковий запис',
      'Сповіщення',
      'Мова та регіон',
      'Сімейний акаунт',
      'Безпека',
      'Інтеграції',
      'Про платформу',
    ];
    sections.forEach((section) => {
      expect(screen.getByText(section)).toBeInTheDocument();
    });
  });

  it('switches sections when sidebar item is clicked', () => {
    const familyItem = screen.getByText('Сімейний акаунт');
    fireEvent.click(familyItem);
    expect(familyItem.className.includes('active')).toBe(true);
    expect(screen.getByText(/Члени родини/i)).toBeInTheDocument();
  });

  it('can open add family member form', () => {
    fireEvent.click(screen.getByText('Сімейний акаунт'));
    const addButton = screen.getByText(/Додати члена сім'ї/i);
    fireEvent.click(addButton);
    expect(screen.getByPlaceholderText('Ім’я')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Роль (напр. Мама)')).toBeInTheDocument();
  });

  it('can add and remove a family member', () => {
    fireEvent.click(screen.getByText('Сімейний акаунт'));
    fireEvent.click(screen.getByText(/Додати члена сім'ї/i));

    const nameInput = screen.getByPlaceholderText('Ім’я');
    const roleInput = screen.getByPlaceholderText('Роль (напр. Мама)');
    const saveButton = screen.getByText(/Зберегти/i);

    // Добавляем члена семьи
    fireEvent.change(nameInput, { target: { value: 'Іван' } });
    fireEvent.change(roleInput, { target: { value: 'Батько' } });
    fireEvent.click(saveButton);

    expect(screen.getByText('Іван')).toBeInTheDocument();
    expect(screen.getByText('Батько')).toBeInTheDocument();

    // Удаляем члена семьи
    const removeButton = screen.getAllByText('✕')[0];
    fireEvent.click(removeButton);

    expect(screen.queryByText('Іван')).not.toBeInTheDocument();
  });

  it('renders delete account section', () => {
    fireEvent.click(screen.getByText('Обліковий запис'));
    expect(screen.getByText(/Видалити мій обліковий запис/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders notification types', () => {
    fireEvent.click(screen.getByText('Сповіщення'));
    expect(screen.getByText('Типи повідомлень')).toBeInTheDocument();
    expect(screen.getByText('Рекомендації рецептів')).toBeInTheDocument();
  });

  it('renders integrations section', () => {
    fireEvent.click(screen.getByText('Інтеграції'));
    expect(screen.getByText(/Зв'язки в соціальних мережах/i)).toBeInTheDocument();
    expect(screen.getByText(/Підключити/i)).toBeInTheDocument();
  });
});
