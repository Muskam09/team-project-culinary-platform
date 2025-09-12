import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import styles from "./SettingsPage.module.scss";
import iconPeople from "../assets/icon-park-outline_people.svg";
import iconTrash from "../assets/icon-park-outline_delete.svg";
import iconAllert from "../assets/icon-park-outline_caution.svg";
import saveButton from "../assets/Group.svg";
import { ChevronDown, Plus } from "lucide-react";

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
  "Активність спільноти",
  "Сервісні повідомлення",
];

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface SettingsData {
  email: string;
  phone: string;
  password: string;
  pushEnabled: boolean;
  messageEnabled: boolean;
  selectedTypes: string[];
  language: string;
  region: string;
  unit: string;
  familyMembers: FamilyMember[];
}

const defaultSettings: SettingsData = {
  email: "",
  phone: "",
  password: "",
  pushEnabled: false,
  messageEnabled: false,
  selectedTypes: [],
  language: "Українська",
  region: "Україна",
  unit: "metric",
  familyMembers: [],
};

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [showInput, setShowInput] = useState(false);

  // === Загрузка настроек из localStorage при монтировании ===
const [settings, setSettings] = useState<SettingsData>(() => {
  const savedSettings = localStorage.getItem("appSettings");
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error("Ошибка парсинга настроек:", e);
    }
  }
  return defaultSettings;
});

  // === Сохранение настроек в localStorage при любых изменениях ===
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  // === Обновление отдельного поля ===
  const updateSetting = (field: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // === Добавление нового члена семьи ===
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRole.trim()) return;
    setSettings(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        {
          id: (Date.now() + Math.random()).toString(),
          name: newMemberName.trim(),
          role: newMemberRole.trim(),
        },
      ],
    }));
    setNewMemberName("");
    setNewMemberRole("");
    setShowInput(false);
  };

  // === Удаление члена семьи ===
  const handleRemoveMember = (id: string) => {
    setSettings(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter(member => member.id !== id),
    }));
  };

  // === Изменение типов уведомлений ===
  const handleTypeChange = (type: string) => {
    setSettings(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type],
    }));
  };

  // === Удаление аккаунта ===
  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      alert("Спочатку підтвердіть видалення, поставивши галочку.");
      return;
    }
    setSettings(defaultSettings);
    setConfirmDelete(false);
    localStorage.removeItem("appSettings");
    alert("Обліковий запис видалено!");
  };

  // === Контент секций ===
  const renderSectionContent = () => {
    switch (activeSection) {
      case "Обліковий запис":
        return (
          <>
            <h2 className={styles.contentTitle}>
              <img src={iconPeople} alt="people" /> {activeSection}
            </h2>

            {["email", "phone", "password"].map(field => (
              <div key={field} className={styles.inputGroup}>
                <label htmlFor={field}>
                  {field === "email"
                    ? "Адреса електронної пошти"
                    : field === "phone"
                    ? "Номер телефону"
                    : "Пароль"}
                </label>
                <div className={styles.inputRow}>
                  <div className={styles.inputWrapper}>
                    <input
                      id={field}
                      type={
                        field === "password"
                          ? "password"
                          : field === "phone"
                          ? "tel"
                          : "email"
                      }
                      value={settings[field as keyof SettingsData] as string}
                      onChange={e =>
                        updateSetting(field as keyof SettingsData, e.target.value)
                      }
                      placeholder={
                        field === "email"
                          ? "example@gmail.com"
                          : field === "phone"
                          ? "+38 (050) 557 57 57"
                          : "**********"
                      }
                    />
                    {(settings[field as keyof SettingsData] as string) && (
                      <span className={styles.checkmark}>✔</span>
                    )}
                  </div>
                  <button
                    className={styles.saveButton}
                    disabled={!(settings[field as keyof SettingsData] as string)}
                    onClick={() =>
                      alert(
                        field === "password"
                          ? "Пароль збережено"
                          : `${field === "email" ? "Email" : "Телефон"} збережено: ${
                              settings[field as keyof SettingsData]
                            }`
                      )
                    }
                  >
                    <img src={saveButton} alt="save" />
                  </button>
                </div>
              </div>
            ))}

            <h2 className={styles.deletetTitle}>
              <img src={iconTrash} alt="trash" /> Видалити обліковий запис
            </h2>
            <div className={styles.alertGroup}>
              <img src={iconAllert} alt="allert" />
              <p className={styles.alertText}>
                Попередження: цю дію неможливо скасувати. Видалення облікового
                запису призведе до остаточного видалення всіх ваших даних.
              </p>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={e => setConfirmDelete(e.target.checked)}
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
            {[
              { title: "Push-повідомлення", field: "pushEnabled" },
              { title: "Повідомлення", field: "messageEnabled" },
            ].map(item => (
              <div
                key={item.field}
                className={
                  item.field === "pushEnabled"
                    ? styles.pushBlock
                    : styles.mesageBlock
                }
              >
                <div className={styles.pushTextBlock}>
                  <h1 className={styles.pushTitle}>{item.title}</h1>
                  <p className={styles.pushText}>
                    Отримуйте повідомлення на свій пристрій
                  </p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={settings[item.field as keyof SettingsData] as boolean}
                    onChange={e =>
                      updateSetting(item.field as keyof SettingsData, e.target.checked)
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ))}

            <div className={styles.typesBlock}>
              <h2 className={styles.typesTitle}>Типи повідомлень</h2>
              <ul className={styles.typesList}>
                {notificationTypes.map(type => (
                  <li key={type} className={styles.typeItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={settings.selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                      />
                      <span>{type}</span>
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
            <label htmlFor="languageSelect">Мова інтерфейсу</label>
            <div className={styles.selectWrapper}>
              <select
                id="languageSelect"
                value={settings.language}
                onChange={e => updateSetting("language", e.target.value)}
                className={styles.selectLenguage}
              >
                <option>Українська</option>
                <option>English</option>
                <option>Русский</option>
              </select>
              <span className={styles.customArrow}>
                <ChevronDown size={20} className={styles.sortIcon} />
              </span>
            </div>

            <label htmlFor="regionSelect">Регіон</label>
            <div className={styles.selectWrapper}>
              <select
                id="regionSelect"
                value={settings.region}
                onChange={e => updateSetting("region", e.target.value)}
                className={styles.selectRegion}
              >
                <option>Україна</option>
                <option>Європа</option>
                <option>Азія</option>
              </select>
              <span className={styles.customArrow}>
                <ChevronDown size={20} className={styles.sortIcon} />
              </span>
            </div>

            <div className={styles.unitsBlock}>
              <label>Одиниці вимірювання</label>
              <div className={styles.radioGroup}>
                {[
                  { label: "Метрична система (кг, °C)", value: "metric" },
                  { label: "Імперська система (lb, °F)", value: "imperial" },
                ].map(u => (
                  <label key={u.value} className={styles.radioLabel}>
                    <div className={styles.radioText}>
                      <input
                        type="radio"
                        name="units"
                        value={u.value}
                        checked={settings.unit === u.value}
                        onChange={e => updateSetting("unit", e.target.value)}
                      />
                      <span className={styles.customRadio}></span>
                      {u.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "Сімейний акаунт":
        return (
          <div className={styles.familyBlock}>
            <h2 className={styles.familyTitle}>Члени родини</h2>
            <ul className={styles.familyList}>
              {settings.familyMembers.map(member => (
                <li key={member.id} className={styles.familyItem}>
                  <img className={styles.avatar} />
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.name}</span>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                  <button
                    className={styles.removeMember}
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {showInput ? (
              <div className={styles.addMemberBlock}>
                <input
                  type="text"
                  placeholder="Ім’я"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className={styles.addMemberInput}
                />
                <input
                  type="text"
                  placeholder="Роль (напр. Мама)"
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value)}
                  className={styles.addMemberInput}
                />
                <button
                  className={styles.addMemberButton}
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim() || !newMemberRole.trim()}
                >
                  ✅ Зберегти
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowInput(false);
                    setNewMemberName("");
                    setNewMemberRole("");
                  }}
                >
                  ❌ Скасувати
                </button>
              </div>
            ) : (
              <button
                className={styles.addMemberMainButton}
                onClick={() => setShowInput(true)}
              >
                Додати члена сім'ї <Plus size={20} className={styles.sortIcon} />
              </button>
            )}
          </div>
        );

      default:
        return <p>Секція {activeSection}</p>;
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.settingsWrapper}>
        <aside className={styles.sidebar}>
          <ul>
            {sections.map(section => (
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

        <section className={styles.content}>{renderSectionContent()}</section>
      </div>
    </main>
  );
};

export default SettingsPage;
