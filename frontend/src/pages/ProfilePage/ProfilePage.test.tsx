/* eslint-disable react/react-in-jsx-scope */
// __tests__/ProfilePage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';

// Мокаем localStorage
const mockProfile = {
  firstName: 'Олександр',
  username: 'alex123',
  bio: 'Це моя біографія',
  avatar: 'avatar.png',
};

beforeEach(() => {
  localStorage.setItem('profileData', JSON.stringify(mockProfile));
});

afterEach(() => {
  localStorage.clear();
});

describe('ProfilePage', () => {
  test('рендерит профиль пользователя', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(mockProfile.firstName)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.username)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.bio)).toBeInTheDocument();
    const avatarDiv = document.querySelector('.profileImage') as HTMLDivElement;
    expect(avatarDiv).toBeTruthy();
    expect(avatarDiv.style.backgroundImage).toContain('avatar.png');
  });

  test('рендерит статистику пользователя', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('Рецепти')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Підписники')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Підписок')).toBeInTheDocument();
  });

  test('рендерит кнопки редагування і додавання рецепта', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const editButton = screen.getByText(/Редагувати/i);
    const addButton = screen.getByText(/Додати рецепт/i);

    expect(editButton).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });

  test("по умолчанию активна вкладка 'Мої рецепти'", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Тут список опублікованих рецептів...')).toBeInTheDocument();
  });

  test("можно переключить вкладку на 'Чернетки'", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>,
    );

    const draftsTab = screen.getByText(/Чернетки/i);
    fireEvent.click(draftsTab);

    expect(screen.getByText('Тут список чернеток...')).toBeInTheDocument();
  });
});
