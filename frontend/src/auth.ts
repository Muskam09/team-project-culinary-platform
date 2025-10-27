export const isLoggedIn = () => {
  // Проверяем наличие токена или какого-то флага
  return !!localStorage.getItem('token'); // например, токен хранится в localStorage
};

export const login = (token: string) => {
  localStorage.setItem('token', token);
};

export const logout = () => {
  localStorage.removeItem('token');
};