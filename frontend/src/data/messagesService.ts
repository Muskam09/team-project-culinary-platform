export interface Message {
  id: string;
  title: string;
  text: string;
  source: string;
  createdAt: number;
}

export const getMessages = (): Message[] => {
  const saved = localStorage.getItem('messages');
  return saved ? JSON.parse(saved) : [];
};

export const addMessage = (msg: Omit<Message, 'id' | 'createdAt'>) => {
  const newMsg: Message = {
    ...msg,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  const updated = [newMsg, ...getMessages()];
  localStorage.setItem('messages', JSON.stringify(updated));

  // уведомляем текущую вкладку об обновлении
  window.dispatchEvent(new CustomEvent('messagesUpdated'));
};

export const deleteMessage = (id: string) => {
  const updated = getMessages().filter((msg) => msg.id !== id);
  localStorage.setItem('messages', JSON.stringify(updated));
  // Уведомление других вкладок об изменении
  window.dispatchEvent(new CustomEvent('messagesUpdated'));
};
