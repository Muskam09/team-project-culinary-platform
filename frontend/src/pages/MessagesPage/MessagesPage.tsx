import React, { useEffect, useState, useRef } from 'react';
import {
  Check, ChevronDown, MoreVertical, Calendar, Heart, ShoppingBag, Bookmark,
} from 'lucide-react';
import styles from './MessagesPage.module.scss';
import Header from '../../components/Header/Header';
// ✅ Импортируем обе функции
import { getMessages, deleteMessage as deleteMessageService } from '../../data/messagesService';
import type { Message } from '../../data/messagesService';

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeMessages, setActiveMessages] = useState<Set<string>>(() => {
    const savedActive = localStorage.getItem('activeMessages');
    return savedActive ? new Set(JSON.parse(savedActive)) : new Set();
  });
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadMessages = () => setMessages(getMessages());

  useEffect(() => {
    loadMessages();
    const handleMessagesUpdated = () => loadMessages();
    window.addEventListener('messagesUpdated', handleMessagesUpdated);
    return () => window.removeEventListener('messagesUpdated', handleMessagesUpdated);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenuId
        && menuRefs.current[showMenuId]
        && !menuRefs.current[showMenuId]!.contains(event.target as Node)
      ) {
        setShowMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenuId]);

  const timeAgo = (timestamp: number) => {
    const diffMinutes = Math.floor((Date.now() - timestamp) / 1000 / 60);
    if (diffMinutes < 60) return `${diffMinutes} хв тому`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours} год тому`;
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'Список покупок': ShoppingBag,
    'Планувальник страв': Calendar,
    'Збережені рецепти': Bookmark,
    Рекомендації: Heart,
  };

  const toggleActive = (id: string) => {
    setActiveMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      localStorage.setItem('activeMessages', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
    setShowMenuId(null);
  };

  // ✅ Обновлённая функция удаления
  const deleteMessage = (id: string) => {
    // Вызываем функцию из сервиса для сохранения в localStorage
    deleteMessageService(id);
    // Обновляем локальное состояние, чтобы изменения были видны сразу
    setActiveMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      localStorage.setItem('activeMessages', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    setShowMenuId(null);
  };

  const handleReadAll = () => {
    const allMessageIds = messages.map((msg) => msg.id);
    const newActiveSet = new Set(allMessageIds);
    localStorage.setItem('activeMessages', JSON.stringify(allMessageIds));
    setActiveMessages(newActiveSet);
  };

  const handleToggleShowAll = () => setShowAll((prev) => !prev);

  const displayedMessages = showAll ? messages : messages.slice(0, 1);

  return (
    <div className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <div className={styles.buttonBlock}>
          <button className={styles.buttonAll} onClick={handleToggleShowAll}>
            {showAll ? 'Всі' : 'Останнє'}
            {' '}
            <ChevronDown className={styles.buttonIcon} />
          </button>
          <button className={styles.buttonReadAll} onClick={handleReadAll}>
            Прочитати всі
            {' '}
            <Check className={styles.buttonIcon} />
          </button>
        </div>

        <div className={styles.messagesList}>
          {displayedMessages.length === 0 ? (
            <p>Повідомлень немає</p>
          ) : (
            displayedMessages.map((msg) => {
              const Icon = iconMap[msg.source] || Bookmark;
              const isActive = activeMessages.has(msg.id);
              const isMenuOpen = showMenuId === msg.id;

              return (
                <div
                  key={msg.id}
                  data-testid={`message-${msg.id}`}
                  className={`${styles.messageCard} ${isActive ? styles.active : ''}`}
                  onClick={() => toggleActive(msg.id)}
                >
                  <Icon className={`${styles.messageIcon} ${isActive ? styles.active : ''}`} />
                  <div className={styles.messageHeader}>
                    <div className={styles.messageTitleBlock}>
                      <h3>{msg.title}</h3>
                      <div
                        className={styles.buttonWithDot}
                      >
                        <button
                          className={styles.messageButton}
                          data-testid={`menu-btn-${msg.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenuId((prev) => (prev === msg.id ? null : msg.id));
                          }}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {isActive && <span className={styles.activeDot} />}
                        {isMenuOpen && (
                        <div className={styles.messageMenu}>
                          <button
                            className={styles.messageMenuButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMessage(msg.id);
                            }}
                          >
                            Видалити
                          </button>
                        </div>
                        )}
                      </div>
                    </div>

                    <p className={styles.messageText}>{msg.text}</p>
                    <small>
                      {msg.source}
                      {' '}
                      ·
                      {timeAgo(msg.createdAt)}
                    </small>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
