import React from 'react';
import { ShoppingBag } from 'lucide-react';
import styles from './FreshProductsBanner.module.scss';

const FreshProductsBanner: React.FC = () => (
  <section className={styles.banner}>
    <div className={styles.text}>
      <h2>Свіжі продукти від Сільпо</h2>
      <p>Готуй із задоволенням — ми подбаємо, щоб усі інгредієнти були під рукою</p>
      <a
        href="https://silpo.ua/"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.orderButton}
      >
        Спробувати зараз
        <ShoppingBag className={styles.buttonIcon} />
      </a>
    </div>
  </section>
);

export default FreshProductsBanner;
