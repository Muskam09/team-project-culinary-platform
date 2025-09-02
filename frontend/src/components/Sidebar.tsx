import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import logoIcon from "../assets/Logo.svg";
import logoText from "../assets/Smachno.svg";

// Иконки
import { FaHome, FaBook, FaBookmark, FaCalendarAlt, FaShoppingCart, FaCog, FaQuestionCircle, FaGem } from "react-icons/fa";
import type { IconType } from "react-icons";

interface NavItem {
  label: string;
  icon: IconType;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navGroups: NavGroup[] = [
    {
      title: "Основне",
      items: [
        { label: "Головна", icon: FaHome, path: "/" },
        { label: "Рецепти", icon: FaBook, path: "/recipes" },
        { label: "Збережене", icon: FaBookmark, path: "/saved" },
      ],
    },
    {
      title: "Планування",
      items: [
        { label: "Планувальник страв", icon: FaCalendarAlt, path: "/planner" },
        { label: "Список покупок", icon: FaShoppingCart, path: "/shopping" },
      ],
    },
    {
      title: "Налаштування та допомога",
      items: [
        { label: "Налаштування", icon: FaCog, path: "/settings" },
        { label: "Допомога", icon: FaQuestionCircle, path: "/help" },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Логотип */}
      <div className={styles.logo}>
        <img src={logoIcon} alt="Logo Icon" className={styles.icon} />
        <img src={logoText} alt="Smachno" className={styles.text} />
      </div>
      <hr />
      {/* Навигация */}
      <nav className={styles.nav}>
        {navGroups.map((group, idx) => (
          <div key={idx} className={styles.navGroup}>
            <p className={styles.groupTitle}>{group.title}</p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  className={`${styles.navButton} ${isActive ? styles.active : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className={styles.iconWrapper}>
                    <IconComponent />
                  </span>
                  <span className={styles.label}>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Блок "Отримати преміум" внизу */}
      <div className={styles.premiumBlock}>
        <div className={styles.premiumTextBlock}>
        <h1 className={styles.premiumTitle}>Отримати преміум</h1>
        <p className={styles.premiumText}>Ексклюзивні рецепти та додаткові можливості </p>
        <button className={styles.premiumButton}>
  Оновити
  <span className={styles.buttonIcon}>
    <FaGem />
  </span>
</button>
      </div>
      </div>
    </aside>
  );
};

export default Sidebar;
