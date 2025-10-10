import React, { useState } from 'react';
import styles from './AuthorCard.module.scss';

interface AuthorCardProps {
  name: string;
  profession?: string;
  recipesCount?: number;
  followers?: number;
  email?: string;
  className?: string;
  image?: string;
}

const formatFollowers = (num: number | undefined) => {
  if (!num) return '0';
  if (num >= 1000) {
    const kNum = num / 1000;
    return kNum % 1 === 0 ? `${Math.floor(kNum)}k` : `${kNum.toFixed(1)}k`;
  }
  return num.toString();
};

const AuthorCard: React.FC<AuthorCardProps> = ({
  name,
  profession,
  recipesCount,
  followers,
  email,
  className,
  image,
}) => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => setSubscribed(!subscribed);

  return (
    <div className={`${styles.authorCard} ${className || ''}`}>
      <div
        className={styles.avatar}
        style={{
          backgroundImage: image ? `url(${image})` : 'none',
        }}
      />
      <div className={styles.authorInfo}>
        <p className={styles.name}>{name}</p>
        {email && <p>{email}</p>}
        {profession && <p className={styles.profession}>{profession}</p>}
        <p className={styles.stats}>
          {recipesCount}
          {' '}
          рецепт
          {recipesCount === 1 ? '' : 'ів'}
          {' '}
          •
          {' '}
          {formatFollowers(followers)}
          {' '}
          підписник
          {followers === 1 ? '' : 'ів'}
        </p>
        <button
          className={`${styles.subscribeButton} ${
            subscribed ? styles.subscribed : ''
          }`}
          onClick={handleSubscribe}
        >
          {subscribed ? 'Підписано' : 'Підписатись'}
        </button>
      </div>
    </div>
  );
};

export default AuthorCard;
