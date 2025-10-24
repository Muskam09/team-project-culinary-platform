import React, { useState } from 'react';
import { X, ImagePlus, Plus, Trash } from 'lucide-react';
import styles from './CreateRecipeModal.module.scss';

type NewRecipeInput = {
  title: string;
  description: string;
  ingredients: string[];
  image?: string | null;
  complexity?: string;
  time?: string;
  rating?: number;
};

interface CreateRecipeModalProps {
  onClose: () => void;
  onCreate: (recipe: NewRecipeInput) => void;
}

const CreateRecipeModal: React.FC<CreateRecipeModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [image, setImage] = useState<string | null>(null);
  const [complexity, setComplexity] = useState('Легко'); // 🔹 новое поле
  const [time, setTime] = useState('30 хв');           // 🔹 новое поле

  // 📸 Загрузка изображения
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ➕ Добавить / удалить ингредиент
  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleRemoveIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleIngredientChange = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  // ✅ Создание рецепта
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecipe: NewRecipeInput = {
      title,
      description,
      ingredients: ingredients.filter((i) => i.trim() !== ''),
      image,
      complexity,
      time,
    };

    onCreate(newRecipe);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>Створити новий рецепт</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Фото */}
          <div className={styles.imageUpload}>
            {image ? (
              <div className={styles.imagePreview}>
                <img src={image} alt="recipe preview" />
                <button
                  type="button"
                  className={styles.removeImage}
                  onClick={() => setImage(null)}
                >
                  <Trash size={16} /> Видалити
                </button>
              </div>
            ) : (
              <label className={styles.imageLabel}>
                <ImagePlus size={24} />
                <span>Додати фото</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Назва рецепта */}
          <label className={styles.label}>
            Назва рецепта:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          {/* Опис */}
          <label className={styles.label}>
            Опис:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Коротко опишіть процес приготування..."
            />
          </label>

          {/* Сложность */}
          <label className={styles.label}>
            Складність:
            <select value={complexity} onChange={(e) => setComplexity(e.target.value)}>
              <option value="Легко">Легко</option>
              <option value="Помірно">Помірно</option>
              <option value="Складно">Складно</option>
            </select>
          </label>

          {/* Время */}
          <label className={styles.label}>
            Час приготування:
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Напр., 30 хв"
            />
          </label>

          {/* Інгредієнти */}
          <div className={styles.ingredientsBlock}>
            <p className={styles.subtitle}>Інгредієнти:</p>

            {ingredients.map((ing, i) => (
              <div key={i} className={styles.ingredientRow}>
                <input
                  type="text"
                  value={ing}
                  placeholder={`Інгредієнт ${i + 1}`}
                  onChange={(e) => handleIngredientChange(i, e.target.value)}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(i)}
                    className={styles.removeButton}
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddIngredient}
              className={styles.addIngredientButton}
            >
              <Plus size={16} /> Додати ще
            </button>
          </div>

          <button type="submit" className={styles.submitButton}>
            Зберегти рецепт
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default CreateRecipeModal;
