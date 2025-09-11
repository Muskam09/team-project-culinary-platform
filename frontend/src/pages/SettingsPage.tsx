import React, { useState } from "react";
import Header from "../components/Header";
import styles from "./SettingsPage.module.scss";
import iconPeople from "../assets/icon-park-outline_people.svg";
import iconTrash from "../assets/icon-park-outline_delete.svg";
import iconAllert from "../assets/icon-park-outline_caution.svg";
import saveButton from "../assets/Group.svg";

const sections = [
  "Обліковий запис",
  "Сповіщення",
  "Мова та регіон",
  "Сімейний акаунт",
  "Безпека",
  "Інтеграції",
  "Про платформу",
];

  const notificationTypes = [
    "Рекомендації рецептів",
    "Оновлення плану харчування",
    "Нагадування про список покупок",
    "Активність спільноти ",
    "Сервісні повідомлення"
  ];


const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);

  // Поля для Обліковий запис
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Чекбокс удаления аккаунта
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Пример состояния для языка
  const [language, setLanguage] = useState("Українська");

  const handleDeleteAccount = () => {
    if (confirmDelete) {
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmDelete(false);
      alert("Обліковий запис видалено!");
    } else {
      alert("Спочатку підтвердіть видалення, поставивши галочку.");
    }
  };
  const [pushEnabled, setPushEnabled] = useState(false);
const [messageEnabled, setMessageEnabled] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Контент для каждой секции
  const renderSectionContent = () => {
    switch (activeSection) {
      case "Обліковий запис":
        return (
          <>
           <h2 className={styles.contentTitle}>
            <img src={iconPeople} alt="people" />
            {activeSection}
          </h2>
            {/* Email */}
            <div className={styles.inputGroup}>
              <label htmlFor="email">Адреса електронної пошти</label>
              <div className={styles.inputRow}>
                <div className={styles.inputWrapper}>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                  />
                  {email && <span className={styles.checkmark}>✔</span>}
                </div>
                <button
                  className={styles.saveButton}
                  disabled={!email}
                  onClick={() => alert(`Email збережено: ${email}`)}
                >
                  <img src={saveButton} alt="save" />
                </button>
              </div>
            </div>

            {/* Телефон */}
            <div className={styles.inputGroup}>
              <label htmlFor="phone">Номер телефону</label>
              <div className={styles.inputRow}>
                <div className={styles.inputWrapper}>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+38 (050) 557 57 57"
                  />
                  {phone && <span className={styles.checkmark}>✔</span>}
                </div>
                <button
                  className={styles.saveButton}
                  disabled={!phone}
                  onClick={() => alert(`Телефон збережено: ${phone}`)}
                >
                  <img src={saveButton} alt="save" />
                </button>
              </div>
            </div>

            {/* Пароль */}
            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <div className={styles.inputRow}>
                <div className={styles.inputWrapper}>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                  />
                  {password && <span className={styles.checkmark}>✔</span>}
                </div>
                <button
                  className={styles.saveButton}
                  disabled={!password}
                  onClick={() => alert("Пароль збережено")}
                >
                  <img src={saveButton} alt="save" />
                </button>
              </div>
            </div>

            {/* Удаление аккаунта */}
            <h2 className={styles.deletetTitle}>
              <img src={iconTrash} alt="trash" />
              Видалити обліковий запис
            </h2>
            <div className={styles.alertGroup}>
              <img src={iconAllert} alt="allert" />
              <p className={styles.alertText}>
                Попередження: цю дію неможливо скасувати. Видалення облікового
                запису призведе до остаточного видалення всіх ваших даних,
                включаючи збережені рецепти, плани харчування та списки покупок.
              </p>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                />
                <span>Я розумію, що ця дія є остаточною.</span>
              </label>
            </div>
            <button
              className={styles.deleteButton}
              disabled={!confirmDelete}
              onClick={handleDeleteAccount}
            >
              Видалити мій обліковий запис
            </button>
          </>
        );

      case "Сповіщення":
        return (
         <div className={styles.notificationBlock}>
  <div className={styles.pushBlock}>
    <div className={styles.pushTextBlock}>
      <h1 className={styles.pushTitle}> Push-повідомлення</h1>
      <p className={styles.pushText}>Отримуйте повідомлення на свій пристрій</p>
    </div>
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={pushEnabled}
        onChange={(e) => setPushEnabled(e.target.checked)}
      />
      <span className={styles.slider}></span>
    </label>
  </div>

  <div className={styles.mesageBlock}>
    <div className={styles.pushTextBlock}>
      <h1 className={styles.pushTitle}>Повідомлення</h1>
      <p className={styles.pushText}>Отримуйте повідомлення на свій пристрій</p>
    </div>
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={messageEnabled}
        onChange={(e) => setMessageEnabled(e.target.checked)}
      />
      <span className={styles.slider}></span>
       </label>
       </div>

       <div className={styles.typesBlock}>
        <h2 className={styles.typesTitle}>Типи повідомлень</h2>
        <ul className={styles.typesList}>
          {notificationTypes.map(type => (
            <li key={type} className={styles.typeItem}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeChange(type)}
                />
                <span> {type}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
     </div>

        
        );

      case "Мова та регіон":
        return (
        <div className={styles.inputGroup}>
  <label htmlFor="language">Мова інтерфейсу</label>
  <div className={styles.selectWrapper}>
    <select
      id="language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className={styles.selectLenguage}
    >
      <option>Українська</option>
      <option>English</option>
      <option>Русский</option>
    </select>
    <span className={styles.customArrow}>▼</span>
  </div>
</div>
        );

      case "Сімейний акаунт":
        return <p>Секція для керування сімейним акаунтом</p>;

      case "Безпека":
        return <p>Секція Безпека (двухфакторная аутентифікація и т.п.)</p>;

      case "Інтеграції":
        return <p>Секція Інтеграції (зовнішні сервіси)</p>;

      case "Про платформу":
        return <p>Інформація про платформу</p>;

      default:
        return null;
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.settingsWrapper}>
        <aside className={styles.sidebar}>
          <ul>
            {sections.map((section) => (
              <li
                key={section}
                className={`${styles.navItem} ${
                  activeSection === section ? styles.active : ""
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.content}>
         

          {renderSectionContent()}
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
