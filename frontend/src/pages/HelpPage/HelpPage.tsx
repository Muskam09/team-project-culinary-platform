/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './HelpPage.module.scss';
import iconSearch from '../../assets/icon-park-outline_search.svg';
import iconPeople from '../../assets/Frame_296.svg';
import iconBook from '../../assets/Frame_297.svg';
import iconZero from '../../assets/Frame_298.svg';
import iconBell from '../../assets/Frame_299.svg';
import iconPhones from '../../assets/Frame_300.svg';
import iconSend from '../../assets/icon-park-outline_send-one.svg';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Ім'я: ${name}\nEmail: ${email}\nТема: ${subject}\nОпис: ${description}`,
    );
    setName('');
    setEmail('');
    setSubject('');
    setDescription('');
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <div className={styles.helpWrapper}>
          <h1 className={styles.helpTitle}>Чим ми можемо допомогти?</h1>
          <p className={styles.helpText}>
            Знайдіть швидкі відповіді або зверніться до нашої служби підтримки
          </p>

          {/* Інпут пошуку */}
          <div className={styles.searchWrapper}>
            <div className={styles.inputIconWrapper}>
              <img src={iconSearch} alt="search" className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Введіть тему або ключеві слова…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
          <section className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Поширені запитання</h2>

            <div className={styles.faqGrid}>
              <button className={styles.faqButton} onClick={() => navigate('/account')}>
                <div className={styles.faqButtonItem}>
                  <img src={iconPeople} />
                  <div className={styles.faqButtonTextBlock}>
                    <h1 className={styles.faqButtonTitle}>Обліковий запис</h1>
                    <p className={styles.faqButtonText}>Все про ваш профіль, пароль і підключені сервіси</p>
                  </div>
                </div>
              </button>
              <button className={styles.faqButton} onClick={() => alert('Категорія: Сімейний акаунт')}>
                <div className={styles.faqButtonItem}>
                  <img src={iconBook} />
                  <div className={styles.faqButtonTextBlock}>
                    <h1 className={styles.faqButtonTitle}>Рецепти та використання сервісу</h1>
                    <p className={styles.faqButtonText}>Як шукати, зберігати та насолоджуватись рецептами</p>
                  </div>
                </div>
              </button>
              <button className={styles.faqButton} onClick={() => navigate('/premium')}>
                <div className={styles.faqButtonItem}>
                  <img src={iconZero} />
                  <div className={styles.faqButtonTextBlock}>
                    <h1 className={styles.faqButtonTitle}>Оплата та підписка</h1>
                    <p className={styles.faqButtonText}>Легко керуйте тарифами, оплатою та передплатою</p>
                  </div>
                </div>
              </button>
              <button className={styles.faqButton} onClick={() => navigate('/mesage')}>
                <div className={styles.faqButtonItem}>
                  <img src={iconBell} />
                  <div className={styles.faqButtonTextBlock}>
                    <h1 className={styles.faqButtonTitle}>Сповіщення та технічні питання</h1>
                    <p className={styles.faqButtonText}>Налаштуйте сповіщення та вирішуйте проблеми</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
          <h2 className={styles.helpTitle_1}>Потрібна додаткова допомога?</h2>
          <p className={styles.helpText_1}>Наша команда підтримки готова допомогти вам</p>

          <section className={styles.supportSection}>
            <div className={styles.supportSectionHeader}>
              <img src={iconPhones} />
              <div className={styles.supportSectionText}>
                <h2 className={styles.sectionTitle}>Зв'язатися зі службою підтримки</h2>
                <p className={styles.sectionText}>Заповніть форму і ми зв’яжемося з вами найближчим часом.</p>
              </div>
            </div>
            <form className={styles.supportForm} onSubmit={handleSubmit}>
              <div className={styles.supportSectionInput}>
                <input
                  type="text"
                  placeholder="Ваше ім’я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.inputField}
                  required
                />
                <input
                  type="email"
                  placeholder="Ваша електронна адреса"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Тема звернення"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={styles.inputField}
                required
              />
              <textarea
                placeholder="Опишіть ситуацію або питання"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.inputField_1}
                required
              />
              <button type="submit" className={styles.submitButton}>
                Надіслати повідомлення
                {' '}
                <img src={iconSend} alt="send" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default HelpPage;
