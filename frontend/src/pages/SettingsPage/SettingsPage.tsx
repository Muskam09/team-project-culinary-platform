/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './SettingsPage.module.scss';
import iconAllert from '../../assets/icon-park-outline_caution.svg';
import saveButton from '../../assets/Group.svg';
import iconEnd from '../../assets/icon-park-outline_logout.svg';
import iconPlat from '../../assets/icon-park-outline_afferent-four.svg';
import deleteIcon from '../../assets/icon-park-outline_delete_white.svg';
import fitnessIcon from '../../assets/Fitness.png';
import instagramIcon from '../../assets/instagram1.png';
import facebookIcon from '../../assets/Facebook1.png';

const sections = [
  'Обліковий запис',
  'Сповіщення',
  'Мова та регіон',
  'Сімейний акаунт',
  'Безпека',
  'Інтеграції',
  'Про платформу',
];

const notificationTypes = [
  'Рекомендації рецептів',
  'Оновлення плану харчування',
  'Нагадування про список покупок',
  'Активність спільноти',
  'Сервісні повідомлення',
];

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  photo?: string | null;
}

interface Device {
  id: string;
  name: string;
  os: string;
  region: string;
}

interface ActivityLog {
  id: string;
  text: string;
}

interface Integration {
  id: string;
  name: string;
  connected: boolean;
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
  sharedListsEnabled?: boolean;
  anotherOptionEnabled?: boolean;
  familyMembers: FamilyMember[];
  twoFactorEnabled?: boolean;
  activeDevices: Device[];
  deviceNotifications?: boolean;
  recentActivity?: ActivityLog[];
  integrations: Integration[];
}

const defaultSettings: SettingsData = {
  email: '',
  phone: '',
  password: '',
  pushEnabled: false,
  messageEnabled: false,
  selectedTypes: [],
  language: 'Українська',
  region: 'Україна',
  unit: 'metric',
  familyMembers: [],
  sharedListsEnabled: false,
  anotherOptionEnabled: false,
  twoFactorEnabled: false,
  deviceNotifications: true,

  activeDevices: [
    {
      id: '1', name: 'Lenovo ThinkPad T14', os: 'Chrome on Windows', region: 'Kharkiv, Ukraine',
    },
    {
      id: '2', name: 'MacBook Pro 2021', os: 'Safari on macOS', region: 'Kyiv, Ukraine',
    },
    {
      id: '3', name: 'iPhone 14', os: 'iOS 17', region: 'Lviv, Ukraine',
    },
  ],
  recentActivity: [
    { id: '1', text: 'Вхід з Chrome • 2 години тому' },
    { id: '2', text: 'Змінено пароль • 3 дні тому' },
    { id: '3', text: 'Вхід з мобільного браузера • 1 тиждень тому' },
  ],

  integrations: [
    {
      id: '1',
      name: 'Instagram',
      connected: true,
    },
    {
      id: '2',
      name: 'Google',
      connected: false,
    },
  ],
};

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [newMemberPhoto, setNewMemberPhoto] = useState<string | null>(null);
  // Загружаем настройки из localStorage, если пусто — подставляем дефолтные
  const [settings, setSettings] = useState<SettingsData>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        const parsed: SettingsData = JSON.parse(saved);

        parsed.activeDevices = defaultSettings.activeDevices;
        parsed.recentActivity = defaultSettings.recentActivity;

        // Подстрахуємося, щоб integrations завжди були масивом
        if (!parsed.integrations) {
          parsed.integrations = defaultSettings.integrations;
        }

        return parsed;
      } catch (e) {
        console.error('Ошибка парсинга настроек:', e);
      }
    }
    return defaultSettings;
  });

  // Сохраняем настройки при изменении
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (field: keyof SettingsData, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddMember = () => {
    if (!newMemberName.trim() || !newMemberRole.trim()) return;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      role: newMemberRole,
      photo: newMemberPhoto || undefined, // если фото нет, ставим undefined
    };

    // Обновляем список
    updateSetting('familyMembers', [...settings.familyMembers, newMember]);

    // Сбрасываем форму
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberPhoto(null);
    setShowInput(false);
  };

  const handleRemoveMember = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((member) => member.id !== id),
    }));
  };

  const handleTypeChange = (type: string) => {
    setSettings((prev) => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter((t) => t !== type)
        : [...prev.selectedTypes, type],
    }));
  };

  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      alert('Спочатку підтвердіть видалення, поставивши галочку.');
      return;
    }
    setSettings(defaultSettings);
    setConfirmDelete(false);
    localStorage.removeItem('appSettings');
    alert('Обліковий запис видалено!');
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'Обліковий запис':
        return (
          <>
            {['email', 'phone', 'password'].map((field) => (
              <div key={field} className={styles.inputGroup}>
                <label htmlFor={field}>
                  {field === 'email' ? 'Адреса електронної пошти' : field === 'phone' ? 'Номер телефону' : 'Пароль'}
                </label>
                <div className={styles.inputRow}>
                  <div className={styles.inputWrapper}>
                    <input
                      id={field}
                      type={field === 'password' ? 'password' : field === 'phone' ? 'tel' : 'email'}
                      value={settings[field as keyof SettingsData] as string}
                      onChange={(e) => updateSetting(field as keyof SettingsData, e.target.value)}
                      placeholder={field === 'email' ? 'example@gmail.com' : field === 'phone' ? '+38 (050) 557 57 57' : '**********'}
                    />
                    {(settings[field as keyof SettingsData] as string) && <span className={styles.checkmark}><Check /></span>}
                  </div>
                  <button
                    className={styles.saveButton}
                    disabled={!(settings[field as keyof SettingsData] as string)}
                    onClick={() => alert(field === 'password' ? 'Пароль збережено' : `${field === 'email' ? 'Email' : 'Телефон'} збережено: ${settings[field as keyof SettingsData]}`)}
                  >
                    <img src={saveButton} alt="save" />
                  </button>
                </div>
              </div>
            ))}
            <h2 className={styles.deletetTitle}>
              Видалити обліковий запис
            </h2>
            <div className={styles.alertGroup}>
              <img src={iconAllert} alt="allert" />
              <p className={styles.alertText}>
                Попередження: цю дію неможливо скасувати.
                <br />
                Видалення облікового запису призведе до остаточного видалення всіх ваших даних,
                {' '}
                <br />
                {' '}
                включаючи збережені рецепти, плани харчування та списки покупок.
              </p>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={confirmDelete} onChange={(e) => setConfirmDelete(e.target.checked)} />
                <span>Я розумію, що ця дія є остаточною.</span>
              </label>
            </div>
            <button className={styles.deleteButton} disabled={!confirmDelete} onClick={handleDeleteAccount}>
              Видалити мій обліковий запис
              {' '}
              <img src={deleteIcon} alt="delete" />
            </button>
          </>
        );

      case 'Сповіщення':
        return (
          <div className={styles.notificationBlock}>
            {[
              { title: 'Push-повідомлення', field: 'pushEnabled' },
              { title: 'Повідомлення', field: 'messageEnabled' },
            ].map((item) => (
              <div key={item.field} className={item.field === 'pushEnabled' ? styles.pushBlock : styles.mesageBlock}>
                <div className={styles.pushTextBlock}>
                  <h1 className={styles.pushTitle}>{item.title}</h1>
                  <p className={styles.pushText}>Отримуйте повідомлення на свій пристрій</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={settings[item.field as keyof SettingsData] as boolean}
                    onChange={(e) => updateSetting(item.field as keyof SettingsData, e.target.checked)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            ))}
            <div className={styles.typesBlock}>
              <h2 className={styles.typesTitle}>Типи повідомлень</h2>
              <ul className={styles.typesList}>
                {notificationTypes.map((type) => (
                  <li key={type} className={styles.typeItem}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" checked={settings.selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} />
                      <span>{type}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'Мова та регіон':
        return (
          <div className={styles.inputGroup}>
            <label htmlFor="languageSelect">Мова інтерфейсу</label>
            <div className={styles.selectWrapper}>
              <select id="languageSelect" value={settings.language} onChange={(e) => updateSetting('language', e.target.value)} className={styles.selectLenguage}>
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
              <select id="regionSelect" value={settings.region} onChange={(e) => updateSetting('region', e.target.value)} className={styles.selectRegion}>
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
                  { label: 'Метрична система (кг, °C)', value: 'metric' },
                  { label: 'Імперська система (lb, °F)', value: 'imperial' },
                ].map((u) => (
                  <label key={u.value} className={styles.radioLabel}>
                    <div className={styles.radioText}>
                      <input type="radio" name="units" value={u.value} checked={settings.unit === u.value} onChange={(e) => updateSetting('unit', e.target.value)} />
                      <span className={styles.customRadio} />
                      {u.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Сімейний акаунт':
        return (
          <div className={styles.familyBlock}>
            <h2 className={styles.familyTitle}>Члени родини</h2>
            <ul className={styles.familyList}>
              {settings.familyMembers.map((member) => (
                <li key={member.id} className={styles.familyItem}>
                  <div
                    className={styles.avatar}
                    style={
    member.photo
      ? { backgroundImage: `url(${member.photo})`, backgroundSize: 'cover' }
      : {
        backgroundColor: ' rgba(215, 234, 235, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }
  }
                  >
                    {!member.photo && (
                    <span className={styles.avatarInitials}>
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                    )}
                  </div>
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

            {/* Форма додавання */}
            {showInput ? (
              <div className={styles.addMemberBlock}>
                <input
                  type="text"
                  placeholder="Ім’я"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className={styles.addMemberInput}
                />
                <input
                  type="text"
                  placeholder="Роль (напр. Мама)"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className={styles.addMemberInput}
                />

                {/* Кнопка вибору фото */}
                <label className={styles.photoUploadButton}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const url = URL.createObjectURL(file);
                        setNewMemberPhoto(url); // зберігаємо фото у стан
                      }
                    }}
                  />
                  Додати фото
                </label>

                {/* превʼю фото */}
                {newMemberPhoto && (
                <img
                  src={newMemberPhoto}
                  alt="preview"
                  className={styles.previewAvatar}
                />
                )}

                <button
                  className={`${styles.addMemberButton} ${(!newMemberName.trim() || !newMemberRole.trim()) ? styles.disabledButton : ''}`}
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim() || !newMemberRole.trim()}
                >
                  Зберегти
                </button>

                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowInput(false);
                    setNewMemberName('');
                    setNewMemberRole('');
                    setNewMemberPhoto(null);
                  }}
                >
                  Скасувати
                </button>
              </div>
            ) : (
              <button
                className={styles.addMemberMainButton}
                onClick={() => setShowInput(true)}
              >
                Додати члена сім'ї
                {' '}
                <Plus size={20} className={styles.sortIcon} />
              </button>
            )}

            <div className={styles.sharedListsBlocks}>
              <div className={styles.sharedListsBlock}>
                <div className={styles.sharedListsTextBlock}>
                  <h2 className={styles.sharedListsTitle}>Спільні списки покупок</h2>
                  <p className={styles.sharedListsText}>Дозвольте членам сім'ї редагувати списки</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={settings.sharedListsEnabled ?? false} onChange={(e) => updateSetting('sharedListsEnabled', e.target.checked)} />
                  <span className={styles.slider} />
                </label>
              </div>
              <div className={styles.sharedListsBlock}>
                <div className={styles.sharedListsTextBlock}>
                  <h2 className={styles.sharedListsTitle}>Спільні плани харчування</h2>
                  <p className={styles.sharedListsText}>Співпрацюйте над плануванням харчування на тиждень</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={settings.anotherOptionEnabled ?? false} onChange={(e) => updateSetting('anotherOptionEnabled', e.target.checked)} />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>
          </div>
        );

      case 'Безпека':
        return (
          <div className={styles.securityBlock}>
            {/* Активні сесії */}
            <h3 className={styles.securityTitle}>Активні сесії</h3>
            <ul className={styles.deviceList}>
              {settings.activeDevices.map((device, index) => (
                <li key={device.id} className={styles.deviceItem}>
                  <div className={styles.deviceInfoBlock}>
                    {/* Текст слева */}
                    <div className={styles.deviceInfo}>
                      <span className={styles.deviceName}>{device.name}</span>
                      <span className={styles.deviceOS}>{device.os}</span>
                      <span className={styles.deviceRegion}>{device.region}</span>
                    </div>

                    {/* Кнопки справа */}
                    <div className={styles.deviceActions}>
                      {index === 0 ? (
                        <span className={styles.currentSession}>Поточний</span>
                      ) : (
                        <button
                          className={styles.logoutButton}
                          onClick={() => updateSetting(
                            'activeDevices',
                            settings.activeDevices.filter((d) => d.id !== device.id),
                          )}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Кнопка "Завершити всі інші сесії" под первой сессией */}
                  {index === 0 && settings.activeDevices.length > 1 && (
                  <button
                    className={styles.logoutAllButton}
                    onClick={() => updateSetting('activeDevices', [settings.activeDevices[0]])}
                  >
                    Завершити всі інші сесії
                    <img src={iconEnd} alt="end" />
                  </button>
                  )}
                </li>
              ))}
              {settings.activeDevices.length === 0 && (
              <li className={styles.emptySessions}>Немає активних сесій</li>
              )}
            </ul>

            {/* Двофакторна автентифікація */}
            <div className={styles.infoBlock}>
              <div className={styles.infoText}>
                <h4 className={styles.infoTitle}>Двофакторна автентифікація</h4>
                <p className={styles.infoDescription}>
                  Додайте додатковий рівень безпеки до свого облікового запису
                </p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={settings.twoFactorEnabled ?? false}
                  onChange={(e) => updateSetting('twoFactorEnabled', e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Нещодавня активність */}
            <div className={styles.activityBlock}>
              <h3 className={styles.activityTitle}>Нещодавня активність</h3>
              <ul className={styles.activityList}>
                {settings.recentActivity && settings.recentActivity.length > 0 ? (
                  settings.recentActivity.map((item) => (
                    <li key={item.id} className={styles.activityItem}>
                      {item.text}
                    </li>
                  ))
                ) : (
                  <li className={styles.activityTitle}>Активність відсутня</li>
                )}
              </ul>
            </div>

          </div>
        );

      case 'Інтеграції':
        return (
          <div className={styles.integrationsBlock}>
            {/* Основний блок соцмереж */}
            <h3 className={styles.integrationsTitle}>Зв'язки в соціальних мережах</h3>
            <ul className={styles.integrationList}>
              {settings.integrations?.length ? (
                settings.integrations.map((integration) => (
                  <li key={integration.id} className={styles.integrationItem}>
                    <div className={styles.integrationInfo}>
                       <img
  className={styles.integrationAvatar}
  src={
    integration.name === 'Instagram'
      ? instagramIcon
      : integration.name === 'Google'
        ? facebookIcon
        : undefined
  }
  alt={integration.name}
/>
                      <div className={styles.integrationText}>
                        <span className={styles.integrationName}>{integration.name}</span>
                        <span
                          className={integration.connected ? styles.integrationConnected : styles.integrationDisconnected}
                        >
                          {integration.connected ? 'Підключено' : 'Відключено'}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`${styles.toggleIntegrationButton} ${
                        integration.connected ? styles.disconnectMode : ''
                      }`}
                      onClick={() => updateSetting(
                        'integrations',
                        settings.integrations.map((i) => (i.id === integration.id ? { ...i, connected: !i.connected } : i)),
                      )}
                    >
                      {integration.connected ? 'Відключити' : 'Підключити'}
                    </button>
                  </li>
                ))
              ) : (
                <li>Інтеграції відсутні</li>
              )}
            </ul>

            {/* Блок сторонніх додатків */}
            <div className={styles.connectedAppsBlock}>
              <h4 className={styles.integrationsTitle}>Підключені додатки</h4>
              <ul className={styles.connectedAppsList}>
                {[
                  {
                    name: 'Fitness Tracker Sync', connected: true, lastSync: '2 години тому', avatar: '/avatars/fitness.png',
                  },

                ].map((app) => (
                  <li key={app.name} className={styles.connectedAppItem}>
                    <div className={styles.connectedAppInfo}>
                      <img
                        className={styles.connectedAppAvatar}
                        src={fitnessIcon}
                        alt="fitness"
                      />
                      <div className={styles.connectedAppInfoText}>
                        <span className={styles.connectedAppName}>{app.name}</span>
                        <span className={styles.connectedAppSync}>
                          Останнє синхронізування:
                          {app.lastSync}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`${styles.toggleIntegrationButton} ${
                        app.connected ? styles.disconnectMode : ''
                      }`}
                      onClick={() => alert(`${app.connected ? 'Відключено' : 'Підключено'}: ${app.name}`)}
                    >
                      {app.connected ? 'Відключити' : 'Підключити'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'Про платформу':
        return (
          <div className={styles.aboutPlatformBlock}>
            <div className={styles.aboutInfoBlock}>
              <div className={styles.platformInfoItem}>
                <span className={styles.platformInfoLabel}>Версія платформи</span>
                <span className={styles.platformInfoValue}>1.4.2</span>
              </div>

              <div className={styles.platformInfoItem}>
                <span className={styles.platformInfoLabel}>Останнє оновлення</span>
                <span className={styles.platformInfoValue}>12 вересня 2025</span>
              </div>
            </div>

            <div className={styles.platformButtonsBlock}>
              <div className={styles.platformButtonRow}>
                <span className={styles.platformButtonLabel}>Політика конфіденційності</span>
                <button
                  className={styles.platformIconButton}
                  onClick={() => alert('Перехід до Політики конфіденційності')}
                >
                  <img src={iconPlat} alt="plat" />
                </button>
              </div>

              <div className={styles.platformButtonRow}>
                <span className={styles.platformButtonLabel}>Умови користування</span>
                <button
                  className={styles.platformIconButton}
                  onClick={() => alert('Перехід до Умов користування')}
                >
                  <img src={iconPlat} alt="plat" />
                </button>
              </div>

              <div className={styles.platformButtonRow}>
                <span className={styles.platformButtonLabel}>Довідковий центр</span>
                <button
                  className={styles.platformIconButton}
                  onClick={() => alert('Перехід до Довідкового центру')}
                >
                  <img src={iconPlat} alt="plat" />
                </button>
              </div>
            </div>
            <p className={styles.footerText}>© 2024 Кулінарна платформа. Всі права захищені.</p>
          </div>
        );

      default:
        return (
          <p>
            Секція
            {activeSection}
          </p>
        );
    }
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <div className={styles.settingsWrapper}>
          <aside className={styles.sidebar}>
            <ul>
              {sections.map((section) => (
                <li key={section} className={`${styles.navItem} ${activeSection === section ? styles.active : ''}`} onClick={() => setActiveSection(section)}>
                  {section}
                </li>
              ))}
            </ul>
          </aside>
          <section className={styles.content}>{renderSectionContent()}</section>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
