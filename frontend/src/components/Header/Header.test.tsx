/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Header/Header.test.tsx
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../../data/recipes', () => ({
  getAllRecipes: () => [{ id: '1', title: 'Борщ' }],
  getAllAuthors: () => [{ id: 'a1', name: 'Олександр' }],
}));

jest.mock('../../data/messagesService', () => ({
  getMessages: () => [{ id: 'm1', text: 'Привіт' }],
}));

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
  });

  test('рендерить кнопку назад і викликає onBackClick', () => {
    const onBackClick = jest.fn();
    render(
      <MemoryRouter>
        <Header showBackButton onBackClick={onBackClick} backButtonLabel="Назад" />
      </MemoryRouter>,
    );

    const backBtn = screen.getByRole('button', { name: /назад/i });
    fireEvent.click(backBtn);

    expect(onBackClick).toHaveBeenCalledTimes(1);
  });

  test('переходить у профіль при кліку на аватар', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const avatarDiv = screen.getByTestId('avatar');
    fireEvent.click(avatarDiv);

    expect(mockedNavigate).toHaveBeenCalledWith('/profile');
  });

  test('показує червону крапку якщо є непрочитані', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId('redDot')).toBeInTheDocument();
  });
});
