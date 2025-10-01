import React, { useState } from 'react';
import { Plus, FilePen, Files } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './ProfilePage.module.scss';
import iconEdit from '../../assets/icon-park-outline_edit.svg';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'recipes'>('recipes');
  const navigate = useNavigate();
  const savedProfile = localStorage.getItem('profileData');
  const profile = savedProfile ? JSON.parse(savedProfile) : null;

  const userStats = {
    recipes: 24,
    followers: 120,
    following: 45,
  };

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock1}>
        <div className={styles.mainBlock}>
          <div className={styles.headerBlock}>
            <div
              className={styles.profileImage}
              style={{ backgroundImage: `url(${profile?.avatar})` }}
            />
            <div className={styles.headerInfo}>
              <div className={styles.profileNameBlock}>
                <h1 className={styles.profileName}>{profile?.firstName || 'My name'}</h1>
                <p className={styles.userName}>{profile?.username || '_user.name'}</p>
              </div>
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{userStats.recipes}</span>
                  <span className={styles.statLabel}>Рецепти</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{userStats.followers}</span>
                  <span className={styles.statLabel}>Підписники</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{userStats.following}</span>
                  <span className={styles.statLabel}>Підписок</span>
                </div>
              </div>
              <div className={styles.biography}>{profile?.bio || 'my_biography'}</div>
            </div>
            <div className={styles.headerButtons}>
              <button
                className={styles.editButton}
                onClick={() => navigate('/edit-profile')}
              >
                Редагувати
                {' '}
                <img className={styles.iconEdit} src={iconEdit} alt="edit" />
              </button>
              <button className={styles.addButton}>
                Додати рецепт
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className={styles.navTabsBlock}>
            <div className={styles.navTabs}>
              <button
                className={`${styles.navTab} ${
                  activeTab === 'drafts' ? styles.activeTab : ''
                }`}
                onClick={() => setActiveTab('drafts')}
              >
                Чернетки
                {' '}
                <FilePen size={20} />
              </button>
              <button
                className={`${styles.navTab} ${
                  activeTab === 'recipes' ? styles.activeTab : ''
                }`}
                onClick={() => setActiveTab('recipes')}
              >
                Мої рецепти
                {' '}
                <Files />
              </button>
            </div>

            {/* Контент в зависимости от выбранной вкладки */}
            <div className={styles.tabContent}>
              {activeTab === 'drafts' ? (
                <p>Тут список чернеток...</p>
              ) : (
                <p>Тут список опублікованих рецептів...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
