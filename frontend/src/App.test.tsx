/* eslint-disable react/display-name */
/* eslint-disable func-names */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
// src/__tests__/App.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from './App';

// Моки для компонентов и страниц
jest.mock('./components/Sidebar/Sidebar', () => function () {
  return <div data-testid="sidebar" />;
});
jest.mock('./pages/Home/Home', () => function () {
  return <div>Home Page</div>;
});
jest.mock('./pages/RecipePage/RecipePage', () => function () {
  return <div>Recipe Page</div>;
});
jest.mock('./pages/ProductInfoPage/ProductInfoPage', () => function () {
  return <div>Product Info Page</div>;
});
jest.mock('./pages/MealPlannerPage/MealPlannerPage', () => function () {
  return <div>Meal Planner Page</div>;
});
jest.mock('./pages/SavedPage/SavedPage', () => function () {
  return <div>Saved Page</div>;
});
jest.mock('./pages/CollectionPage/CollectionPage', () => function () {
  return <div>Collection Page</div>;
});
jest.mock('./pages/ShoppingListPage/ShoppingListPage', () => function () {
  return <div>Shopping List Page</div>;
});
jest.mock('./pages/ShoppingListDetailPage/ShoppingListDetailPage', () => function () {
  return <div>Shopping List Detail Page</div>;
});
jest.mock('./pages/SettingsPage/SettingsPage', () => function () {
  return <div>Settings Page</div>;
});
jest.mock('./pages/HelpPage/HelpPage', () => function () {
  return <div>Help Page</div>;
});
jest.mock('./pages/RecommendedRecipesPage/RecommendedRecipesPage', () => function () {
  return <div>Recommended Recipes Page</div>;
});
jest.mock('./pages/PopularRecipesPage/PopularRecipesPage', () => function () {
  return <div>Popular Recipes Page</div>;
});
jest.mock('./pages/SummerOffersPage/SummerOffersPage', () => function () {
  return <div>Summer Offers Page</div>;
});
jest.mock('./pages/AuthorsPage/AuthorsPage', () => function () {
  return <div>Authors Page</div>;
});
jest.mock('./pages/PremiumPage/PremiumPage', () => function () {
  return <div>Premium Page</div>;
});
jest.mock('./pages/ProfilePage/ProfilePage', () => function () {
  return <div>Profile Page</div>;
});
jest.mock('./pages/EditProfilePage/EditProfilePage', () => function () {
  return <div>Edit Profile Page</div>;
});
jest.mock('./pages/AccountPage/AccountPage', () => function () {
  return <div>Account Page</div>;
});
jest.mock('./pages/MessagesPage/MessagesPage', () => function () {
  return <div>Messages Page</div>;
});

describe('App routing', () => {
  const renderWithRouter = (initialRoute: string) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>,
    );
  };

  test('рендерит Sidebar и Home по /', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('переходит на страницу RecipePage', () => {
    renderWithRouter('/recipe/1');
    expect(screen.getByText('Recipe Page')).toBeInTheDocument();
  });

  test('переходит на страницу ShoppingListDetailPage', () => {
    renderWithRouter('/shopping-list/123');
    expect(screen.getByText('Shopping List Detail Page')).toBeInTheDocument();
  });

  test('переходит на страницу SummerOffersPage', () => {
    renderWithRouter('/recipes/summer-offers');
    expect(screen.getByText('Summer Offers Page')).toBeInTheDocument();
  });

  test('переходит на страницу MessagesPage', () => {
    renderWithRouter('/mesage');
    expect(screen.getByText('Messages Page')).toBeInTheDocument();
  });
});
