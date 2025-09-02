import React from "react";
import styles from "./FreshProductsBanner.module.scss";
import { FaShoppingBag } from "react-icons/fa"; // импорт иконки

const FreshProductsBanner: React.FC = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.text}>
        <h2>Свіжі товари від Сільпо</h2>
        <p>Готуй разом із доставкою</p>
        <button className={styles.orderButton}>
          Спробувати зараз
          <FaShoppingBag className={styles.buttonIcon} />
        </button>
      </div>
      <div className={styles.imagePlaceholder}></div>
    </section>
  );
};

export default FreshProductsBanner;
