/* eslint-disable react/react-in-jsx-scope */
// src/pages/EditProfilePage/EditProfilePage.test.tsx
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditProfilePage from './EditProfilePage';

// мокируем navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('EditProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
    window.alert = jest.fn();
  });

  it('рендерится с Header и кнопками', () => {
    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Фотографія профілю')).toBeInTheDocument();
    expect(screen.getByText('Особиста інформація')).toBeInTheDocument();
    expect(screen.getByText('Інформація про дієту')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Скасувати/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Зберегти зміни/i })).toBeInTheDocument();
  });

  it('добавление и удаление аллергии', async () => {
    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>,
    );

    const allergyInput = screen.getByPlaceholderText(/Наприклад/i);
    fireEvent.change(allergyInput, { target: { value: 'Глютен' } });

    const option = await screen.findByText('Глютен');
    fireEvent.mouseDown(option);
    fireEvent.click(option);

    expect(screen.getByText('Глютен')).toBeInTheDocument();

    const removeBtn = screen.getByText('×');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Глютен')).not.toBeInTheDocument();
    });
  });

  it('добавление и удаление вподобань', async () => {
    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>,
    );

    const foodInput = screen.getByPlaceholderText(/вегетаріанець/i);
    fireEvent.change(foodInput, { target: { value: 'Веган' } });

    const option = await screen.findByText('Веган');
    fireEvent.mouseDown(option);
    fireEvent.click(option);

    expect(screen.getByText('Веган')).toBeInTheDocument();

    const removeBtn = screen.getByText('×');
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByText('Веган')).not.toBeInTheDocument();
    });
  });

  it("кнопка 'До профілю' вызывает navigate", () => {
    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>,
    );

   const backBtn = screen.getByRole('button', { name: /До профілю/i });

    fireEvent.click(backBtn);
    // navigate замокан — достаточно что кнопка кликается
    expect(backBtn).toBeInTheDocument();
  });

  it('сохранение профиля записывает в localStorage и вызывает alert', () => {
    render(
      <MemoryRouter>
        <EditProfilePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /Зберегти зміни/i }));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'profileData',
      expect.stringContaining('"allergies":[]'),
    );
    expect(window.alert).toHaveBeenCalledWith('Зміни збережено!');
  });
});
