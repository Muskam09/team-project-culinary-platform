import React from 'react';
import styles from './ShareMenu.module.scss';
import { FaFacebookF, FaTelegramPlane, FaWhatsapp, FaViber, FaCopy } from 'react-icons/fa';
import { X } from 'lucide-react';

interface ShareMenuProps {
  recipeId: string;
  recipeTitle: string;
  onClose?: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ recipeId, recipeTitle, onClose }) => {
  const url = `${window.location.origin}/product/${recipeId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
      .then(() => alert('Посилання скопійоване'))
      .catch(() => alert('Не вдалося скопіювати посилання'));
    onClose?.();
  };

const handleShare = (platform: 'facebook' | 'telegram' | 'whatsapp' | 'viber') => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${url}\n${recipeTitle}`);
  let shareUrl = '';

  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'telegram':
      // Важно: сначала ссылка, потом текст — тогда Telegram делает её кликабельной
      shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(recipeTitle)}`;
      break;
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
      break;
    case 'viber':
      shareUrl = `viber://forward?text=${encodedText}`;
      break;
  }

  window.open(shareUrl, '_blank');
  onClose?.();
};


  return (
 
    <div className={styles.shareMenu}>
         <button className={styles.closeButton} onClick={onClose}><X size={16}/> </button>
      <button onClick={handleCopyLink}><FaCopy className={styles.socialIcon} /> Копіювати посилання</button>
      <button onClick={() => handleShare('facebook')}><FaFacebookF className={styles.socialIcon} /> Facebook</button>
      <button onClick={() => handleShare('telegram')}><FaTelegramPlane className={styles.socialIcon} /> Telegram</button>
      <button onClick={() => handleShare('whatsapp')}><FaWhatsapp className={styles.socialIcon} /> WhatsApp</button>
      <button onClick={() => handleShare('viber')}><FaViber className={styles.socialIcon} /> Viber</button>
    </div>
  
  );
};

export default ShareMenu;
