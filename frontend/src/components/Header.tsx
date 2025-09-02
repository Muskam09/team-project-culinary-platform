// Header.tsx
import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Пошук рецептів, кухарів, інгредієнтів…" />
      </div>
      <div className={styles.rightSection}>
        <button className={styles.bellButton}>
          <FaBell />
        </button>
        <div className={styles.avatar}></div>
      </div>
    </header>
  );
};

export default Header;
