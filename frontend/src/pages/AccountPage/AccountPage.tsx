import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './AccountPage.module.scss';

interface Section {
  id: string;
  question: string;
  answer: string;
}

const sections: Section[] = [
  {
    id: 'profile-1',
    question: 'Як змінити пароль до свого облікового запису?',
    answer: 'Щоб змінити пароль, відкрийте Налаштування → Обліковий запис і виберіть пункт «Змінити пароль». Введіть поточний пароль, а потім новий. Після підтвердження зміни пароль буде оновлено.',
  },
  {
    id: 'password-1',
    question: 'Як змінити адресу електронної пошти або номер телефону?',
    answer: 'Щоб змінити адресу електронної пошти або номер телефону, відкрийте Налаштування → Обліковий запис і виберіть пункт «Змінити контактні дані». Введіть нову електронну адресу або номер телефону та підтвердьте зміни. Після перевірки введених даних контактна інформація у вашому профілі буде оновлена.',
  },
  {
    id: 'services-1',
    question: 'Чи можна видалити свій обліковий запис?',
    answer: 'Щоб видалити обліковий запис, відкрийте Налаштування профілю → Редагувати і виберіть пункт «Видалити обліковий запис». Після підтвердження вся ваша інформація, включно з рецептами, списками покупок та збереженими налаштуваннями, буде безповоротно видалена.',
  },
  {
    id: 'profile-2',
    question: 'Як підключити або відключити Google / Instagram / інші сервіси?',
    answer: 'Щоб керувати підключеними сервісами, відкрийте Налаштування → Обліковий запис і перейдіть у розділ «Підключені сервіси». Тут ви можете підключити новий сервіс, наприклад Google чи Instagram, або відключити вже існуючий у будь-який момент.',
  },
  {
    id: 'password-2',
    question: 'Чи можна увійти в акаунт за допомогою соцмереж?',
    answer: 'Щоб увійти в акаунт за допомогою соцмереж, відкрийте сторінку входу та виберіть потрібний сервіс (наприклад, Google чи Instagram). Підтвердьте доступ, і система автоматично авторизує вас. Якщо сервіс ще не підключено, його можна додати в Налаштування → «Інтеграції».',
  },
  {
    id: 'services-2',
    question: 'Як змінити особисті дані (ім’я, фото, свої вподобання)?',
    answer: 'Щоб змінити особисті дані (ім’я, фото чи вподобання), відкрийте Налаштування профілю → Редагувати профіль. У цьому розділі можна завантажити нове фото, відредагувати ім’я та прізвище, змінити ім’я користувача, біографію та вказати свої харчові вподобання чи алергії. Після внесення змін натисніть «Зберегти».',
  },
  {
    id: 'profile-3',
    question: 'Чи можу я мати кілька облікових записів?',
    answer: 'Щоб користуватися кількома обліковими записами, потрібно зареєструвати кожен акаунт окремо з різною електронною поштою або номером телефону. Перемикання між обліковими записами здійснюється через вихід із поточного акаунта та вхід в інший. Одночасно використовувати кілька акаунтів у додатку неможливо.',
  },
  {
    id: 'password-3',
    question: 'Як перевірити, які сервіси підключені до мого акаунта?',
    answer: 'Щоб перевірити підключені сервіси, відкрийте Налаштування → Інтеграції. У цьому розділі ви побачите перелік усіх платформ (Google, Instagram та інші), які зв’язані з вашим акаунтом. Там же можна відключити або підключити сервіси.',
  },
  {
    id: 'services-3',
    question: 'Чи можна відновити обліковий запис після видалення?',
    answer: 'Після остаточного видалення облікового запису його неможливо відновити. Усі ваші дані, рецепти та налаштування будуть видалені назавжди. Якщо ви плануєте повернутися до сервісу, рекомендуємо тимчасово призупинити акаунт замість видалення.',
  },
];

const AccountPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <button className={styles.backButton} onClick={() => navigate('/help')}>
          <ChevronLeft />
          {' '}
          До допомоги
        </button>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Обліковий запис</h1>

          {sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
              >
                <span className={styles.sectionTitle}>{section.question}</span>
                {openSection === section.id ? (
                  <ChevronUp className={styles.icon} />
                ) : (
                  <ChevronDown className={styles.icon} />
                )}
              </button>

              {openSection === section.id && (
                <p className={styles.sectionText}>{section.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
