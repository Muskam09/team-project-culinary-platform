/* eslint-disable react/react-in-jsx-scope */
// __tests__/ProfilePage.test.tsx
import { render, screen } from '@testing-library/react';
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

});
