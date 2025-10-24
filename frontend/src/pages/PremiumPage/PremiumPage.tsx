// src/pages/PremiumPage.tsx
import React from 'react';
import { Check } from 'lucide-react';
import Header from '../../components/Header/Header';
import styles from './PremiumPage.module.scss';
import buttonIcon from '../../assets/icon-park-outline_vip-one.svg';
import headerImage from '../../assets/image_6.png';

// Пример картинок для блоков
import img1 from '../../assets/prenium/image_1.svg';
import img2 from '../../assets/prenium/image_2.svg';
import img3 from '../../assets/prenium/image_3.svg';
import img4 from '../../assets/prenium/image_4.svg';

const PremiumPage: React.FC = () => {
  const features = [
    { img: img1, title: 'Доставка інгредієнтів', text: 'Отримуйте свіжі інгредієнти з доставкою додому. Забудьте про магазин і насолоджуйтесь приготуванням.' },
    { img: img2, title: 'Розумний планувальник харчування', text: 'Створюйте тижневі плани та списки покупок. Економте час і зменшуйте харчові відходи.' },
    { img: img3, title: 'Без реклами', text: 'Готуйте без відволікань і реклами. Насолоджуйтесь чистим досвідом на всіх пристроях.' },
    { img: img4, title: 'Ексклюзивні рецепти', text: 'Відкрийте доступ до преміум-рецептів від шеф-кухарів. Досліджуйте унікальні страви та нові техніки.' },
  ];

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.mainBlock}>
        <div className={styles.headerBlock}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTittle}>Перейдіть на преміум-аккаунт</h1>
            <p className={styles.headerDiscription}>
              Відкрийте всі функції та готуйте без обмежень. Змініть своє кулінарне
              {' '}
              <br />
              подорож з нашими преміум-інструментами та ексклюзивним контентом
            </p>
            <button className={styles.headerButton}>
              Оновитись зараз
              <img src={buttonIcon} alt="buttonIcon" />
            </button>
          </div>
          <img src={headerImage} alt="headerImage" />
        </div>

        <div className={styles.mainText}>
          <h2 className={styles.mainTittle}>Преміум-переваги</h2>
          <p className={styles.mainDiscription}>Все, що потрібно, щоб стати шеф-кухарем</p>
        </div>

        {/* Четыре блока */}
        <div className={styles.featuresBlock}>
          {features.map((feature, index) => (
            <div key={index} className={styles.feature}>
              <img src={feature.img} alt={feature.title} className={styles.featureImg} />
              <div key={index} className={styles.featureTextBlock}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureText}>
                  {feature.text.split('. ').map((sentence, i, arr) => (
                    <React.Fragment key={i}>
                      {sentence.trim()}
                      {i < arr.length - 1 ? '.' : ''}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.mainText}>
          <h2 className={styles.mainTittle}>Виберіть свій план</h2>
          <p className={styles.mainDiscription}>Почніть свою подорож у світ преміум-кулінарії вже сьогодні</p>
        </div>

        <div className={styles.footerBlock}>
          <div className={styles.footerLeft}>
            <h3>Щомісячно</h3>
            <div className={styles.priceText}>
              <p className={styles.price}>$12</p>
              <p className={styles.priceMonth}>/на місяць</p>
            </div>
            <p className={styles.priceDiscription}>Оплата щомісяця</p>
            <ul className={styles.featuresList}>
              <li>
                <Check size={20} color="#0d9488" />
                Необмежений доступ до рецептів
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Необмежене планування меню
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Доставка продуктів із Сільпо
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Використання сервісу без реклами
              </li>
            </ul>
            <button className={styles.futerButton}>Обрати план</button>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.planLabel}>Найкраща ціна</div>
            <h3>Щорічно</h3>
            <div className={styles.priceText}>
              <p className={styles.price}>$99</p>
              <p className={styles.priceMonth}>/на рік</p>
            </div>
            <p className={styles.priceDiscription}>Економте 45 $ на рік</p>
            <ul className={styles.featuresList}>
              <li>
                <Check size={20} color="#0d9488" />
                Необмежений доступ до рецептів
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Необмежене планування меню
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Доставка продуктів із Сільпо
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Використання сервісу без реклами
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Індивідуальний план харчування
              </li>
              <li>
                <Check size={20} color="#0d9488" />
                Ексклюзивні рецепти від шефів
              </li>
            </ul>
            <button className={styles.futerButton}>Обрати план</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PremiumPage;
