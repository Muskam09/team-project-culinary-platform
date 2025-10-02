/* eslint-disable react/no-unescaped-entities */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './EditProfilePage.module.scss';
import avatarDefault from '../../assets/avatar.webp';
import iconEdit from '../../assets/icon-park-outline_edit_white.svg';
import iconDelete from '../../assets/icon-park-outline_delete_red.svg';

const allergyOptions = ['Глютен', 'Молоко', 'Морепродукти', 'Яйця', 'Горіхи'];
const foodOptions = ['Вегетаріанець', 'Веган', 'Безглютенова дієта', 'Палео', 'Кето'];

const EditProfilePage: React.FC = () => {
  // --- State для профиля ---
  const [avatar, setAvatar] = useState<string>(avatarDefault);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  // --- State для аллергий ---
  const [allergyQuery, setAllergyQuery] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const allergyRef = useRef<HTMLDivElement>(null);

  // --- State для предпочтений еды ---
  const [foodQuery, setFoodQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const foodRef = useRef<HTMLDivElement>(null);

  // --- Изменение аватара ---
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setAvatar(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleDeleteAvatar = () => setAvatar(avatarDefault);

  // --- Фильтрация опций ---
  const filteredAllergyOptions = allergyOptions.filter(
    (option) => option.toLowerCase().includes(allergyQuery.toLowerCase())
      && !selectedAllergies.includes(option),
  );
  const filteredFoodOptions = foodOptions.filter(
    (option) => option.toLowerCase().includes(foodQuery.toLowerCase())
      && !selectedFood.includes(option),
  );

  // --- Закрытие дропдаунов при клике вне ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allergyRef.current && !allergyRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (foodRef.current && !foodRef.current.contains(event.target as Node)) {
        setShowFoodDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Сохранение изменений ---
  const handleSave = () => {
    const profileData = {
      avatar,
      firstName,
      lastName,
      username,
      bio,
      allergies: selectedAllergies,
      foodPreference: selectedFood,
    };
    localStorage.setItem('profileData', JSON.stringify(profileData));
    alert('Зміни збережено!');
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <button className={styles.backButton} onClick={() => navigate('/profile')}>
          <ChevronLeft />
          {' '}
          До профілю
        </button>
        {/* --- Фотография профиля --- */}
        <div className={styles.profileImageBlock}>
          <h1 className={styles.title}>Фотографія профілю</h1>
          <div className={styles.profileImageInfoBlock}>
            <img src={avatar} alt="Profile avatar" className={styles.profileImage} />
            <div className={styles.profileImageInfo}>
              <div className={styles.PhotoButtons}>
                <label className={styles.changePhotoButton}>
                  Змінити фото
                  {' '}
                  <img src={iconEdit} alt="edit" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
                </label>
                <button className={styles.deletePhotoButton} onClick={handleDeleteAvatar}>
                  Видалити фото
                  {' '}
                  <img src={iconDelete} alt="delete" />
                </button>
              </div>
              <p className={styles.fileInfo}>PNG, JPEG Under 15MB</p>
            </div>
          </div>
        </div>

        {/* --- Особиста інформація --- */}
        <div className={styles.personalInfoBlock}>
          <h2 className={styles.title}>Особиста інформація</h2>
          <div className={styles.nameRow}>
            <div className={styles.inputGroup}>
              <label>Ім'я</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label>Прізвище</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Ім'я користувача</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label>Біографія</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className={styles.cookingProgress}>
            <span className={styles.progressText}>
              Поділіться своїми кулінарними подорожами з спільнотою
            </span>
            <span className={styles.progressNumber}>74/150</span>
          </div>
        </div>

        {/* --- Інформація про дієту --- */}
        <div className={styles.dietInfoBlock}>
          <h2 className={styles.sectionTitle}>Інформація про дієту</h2>

          {/* Аллергии */}
          <div className={styles.dietInputsRow} ref={allergyRef}>
            <label>Алергії</label>

            <div className={styles.selectedAllergies}>
              {selectedAllergies.map((a) => (
                <div key={a} className={styles.allergyTag}>
                  {a}
                  {' '}
                  <span onClick={() => setSelectedAllergies(selectedAllergies.filter((item) => item !== a))}>×</span>
                </div>
              ))}
            </div>

            <div className={styles.inputWithIcon}>
              <input
                type="text"
                placeholder="Наприклад: глютен, молоко, морепродукти"
                value={allergyQuery}
                onChange={(e) => { setAllergyQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className={styles.dietInput}
              />
              <ChevronDown className={styles.inputIcon} />
            </div>

            {showDropdown && filteredAllergyOptions.length > 0 && (
            <ul className={styles.dropdown}>
              {filteredAllergyOptions.map((option) => (
                <li
                  key={option}
                  onMouseDown={() => {
                    setSelectedAllergies([...selectedAllergies, option]);
                    setAllergyQuery('');
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
            )}
          </div>
          {/* Харчові вподобання */}
          <div className={styles.dietInputsRow} ref={foodRef}>
            <label>Харчові вподобання</label>

            <div className={styles.selectedAllergies}>
              {selectedFood.map((f) => (
                <div key={f} className={styles.allergyTag}>
                  {f}
                  {' '}
                  <span onClick={() => setSelectedFood(selectedFood.filter((item) => item !== f))}>×</span>
                </div>
              ))}
            </div>

            <div className={styles.inputWithIcon}>
              <input
                type="text"
                placeholder="Поширені вподобання: вегетаріанець, веган, безглютенова дієта"
                value={foodQuery}
                onChange={(e) => { setFoodQuery(e.target.value); setShowFoodDropdown(true); }}
                onFocus={() => setShowFoodDropdown(true)}
                className={styles.dietInput}
              />
              <ChevronDown className={styles.inputIcon} />
            </div>

            {showFoodDropdown && filteredFoodOptions.length > 0 && (
            <ul className={styles.dropdown}>
              {filteredFoodOptions.map((option) => (
                <li
                  key={option}
                  onMouseDown={() => {
                    setSelectedFood([...selectedFood, option]);
                    setFoodQuery('');
                    setShowFoodDropdown(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>

        {/* --- Кнопки действий --- */}
        <div className={styles.actionButtons}>
          <button type="button" className={styles.cancelButton} onClick={() => window.history.back()}>
            Скасувати
          </button>
          <button type="button" className={styles.saveButton} onClick={handleSave}>
            Зберегти зміни
          </button>
        </div>
      </div>
    </main>
  );
};

export default EditProfilePage;
