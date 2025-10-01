import React from 'react';
import { ShoppingBag } from 'lucide-react';
import styles from './FreshProductsBanner.module.scss';

const FreshProductsBanner: React.FC = () => (
  <section className={styles.banner}>
    <div className={styles.text}>
      <h2>Свіжі продукти від Сільпо</h2>
      <p>Готуй із задоволенням — ми подбаємо, щоб усі інгредієнти були під рукою</p>
      <button className={styles.orderButton}>
        Спробувати зараз
        <ShoppingBag className={styles.buttonIcon} />
      </button>
    </div>
  </section>
);

export default FreshProductsBanner;
