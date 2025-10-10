/* eslint-disable react/react-in-jsx-scope */
// __tests__/MessagesPage.test.tsx

import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MessagesPage from './MessagesPage';
import * as messagesService from '../../data/messagesService';

const mockMessages = [
  {
    id: '1',
    title: 'Повідомлення 1',
    text: 'Текст 1',
    source: 'Список покупок',
    createdAt: Date.now() - 60000,
  },
  {
    id: '2',
    title: 'Повідомлення 2',
    text: 'Текст 2',
    source: 'Планувальник страв',
    createdAt: Date.now() - 120000,
  },
];

jest.mock('../../data/messagesService', () => ({
  getMessages: jest.fn(),
  deleteMessage: jest.fn(),
}));

describe('MessagesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (messagesService.getMessages as jest.Mock).mockReturnValue(mockMessages);
  });

  test('рендерит список сообщений', () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>,
    );

    mockMessages.forEach((msg) => {
      expect(screen.getByText(msg.title)).toBeInTheDocument();
      expect(screen.getByText(msg.text)).toBeInTheDocument();
    });
  });

  test('клик на сообщение переключает активность', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>,
    );

    const msgCard = screen.getByTestId('message-1'); // data-testid="message-1" должен быть в компоненте
    expect(msgCard).not.toHaveClass('active');

    fireEvent.click(msgCard);

    await waitFor(() => {
      expect(msgCard).toHaveClass('active');
    });

    const stored = JSON.parse(localStorage.getItem('activeMessages')!);
    expect(stored).toContain('1');
  });

  test("кнопка 'Прочитати всі' добавляет все сообщения в активные", () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>,
    );

    const button = screen.getByText(/Прочитати всі/i);
    fireEvent.click(button);

    const stored = JSON.parse(localStorage.getItem('activeMessages')!);
    expect(stored).toEqual(mockMessages.map((m) => m.id));
  });

  test('кнопка меню показывает меню и можно удалить сообщение', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>,
    );

    const menuButton = screen.getByTestId('menu-btn-1'); // data-testid="menu-btn-1"
    fireEvent.click(menuButton);

    const deleteButton = await screen.findByText('Видалити');
    fireEvent.click(deleteButton);

    expect(messagesService.deleteMessage).toHaveBeenCalledWith('1');

    await waitFor(() => {
      expect(screen.queryByText('Повідомлення 1')).not.toBeInTheDocument();
    });
  });
});
