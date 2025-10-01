// src/data/recipes.ts
import image1 from '../assets/recepes/image_1.png';
import image2 from '../assets/recepes/recept_2.webp';
import image3 from '../assets/recepes/recept_3.webp';
import image4 from '../assets/recepes/recept_4.webp';
import image5 from '../assets/recepes/recept_5.webp';
import image6 from '../assets/recepes/recept_6.webp';
import image7 from '../assets/recepes/recept_7.webp';
import image8 from '../assets/recepes/recept_8.webp';
import image9 from '../assets/recepes/recept_9.webp';
import image10 from '../assets/recepes/recept_10.webp';
import image11 from '../assets/recepes/recept_11.webp';
import image12 from '../assets/recepes/recept_12.webp';
import image13 from '../assets/recepes/recept_13.webp';
import image14 from '../assets/recepes/recept_14.webp';
import image15 from '../assets/recepes/recept_15.webp';
import image16 from '../assets/recepes/recept_16.webp';
import image17 from '../assets/recepes/recept_17.webp';
import image18 from '../assets/recepes/recept_18.webp';
import image19 from '../assets/recepes/recept_19.webp';
import image20 from '../assets/recepes/recept_20.webp';
import image21 from '../assets/recepes/recept_21.webp';
import image22 from '../assets/recepes/recept_22.webp';
import image23 from '../assets/recepes/recept_23.webp';
import image24 from '../assets/recepes/recept_24.webp';
import image25 from '../assets/recepes/recept_25.webp';
import image26 from '../assets/recepes/recept_26.webp';
import image27 from '../assets/recepes/recept_27.webp';
import image28 from '../assets/recepes/recept_28.webp';
import image29 from '../assets/recepes/recept_29.webp';
import image30 from '../assets/recepes/recept_30.webp';
import image31 from '../assets/recepes/recept_31.webp';
import image32 from '../assets/recepes/recept_32.webp';
import image33 from '../assets/recepes/recept_33.webp';
import image34 from '../assets/recepes/recept_34.webp';
import image35 from '../assets/recepes/recept_35.webp';
import image36 from '../assets/recepes/recept_36.webp';
import image37 from '../assets/recepes/recept_37.webp';
import image38 from '../assets/recepes/recept_38.webp';
import image39 from '../assets/recepes/recept_39.webp';
import image40 from '../assets/recepes/recept_40.webp';
import image41 from '../assets/recepes/recept_41.webp';
import image42 from '../assets/recepes/recept_42.webp';
import image43 from '../assets/recepes/recept_43.webp';
import image44 from '../assets/recepes/recept_44.webp';
import image45 from '../assets/recepes/recept_45.webp';
import image46 from '../assets/recepes/recept_46.webp';
import image47 from '../assets/recepes/recept_47.webp';
import image48 from '../assets/recepes/recept_48.webp';
import image49 from '../assets/recepes/recept_49.webp';
import image50 from '../assets/recepes/recept_50.webp';
import image51 from '../assets/recepes/recept_51.webp';
import image52 from '../assets/recepes/recept_52.webp';
import image53 from '../assets/recepes/recept_53.webp';
import image54 from '../assets/recepes/recept_54.webp';
import image55 from '../assets/recepes/recept_55.webp';
import image56 from '../assets/recepes/recept_56.webp';
import image57 from '../assets/recepes/recept_57.webp';
import image58 from '../assets/recepes/recept_58.webp';
import image59 from '../assets/recepes/recept_59.webp';
import image60 from '../assets/recepes/recept_60.webp';
import autorimage1 from '../assets/autors/autor_1.webp';
import autorimage2 from '../assets/autors/autor_2.webp';
import autorimage3 from '../assets/autors/autor_3.jpg';
import autorimage4 from '../assets/autors/autor_4.webp';
import autorimage5 from '../assets/autors/autor_5.webp';
import autorimage6 from '../assets/autors/autor_6.webp';
import autorimage7 from '../assets/autors/autor_7.webp';
import autorimage8 from '../assets/autors/autor_8.webp';
import autorimage9 from '../assets/autors/autor_9.webp';
import autorimage10 from '../assets/autors/autor_10.webp';
import autorimage11 from '../assets/autors/autor_11.webp';
import autorimage12 from '../assets/autors/autor_12.webp';
import autorimage13 from '../assets/autors/autor_13.webp';
import autorimage14 from '../assets/autors/autor_14.webp';
import autorimage15 from '../assets/autors/autor_15.webp';
import autorimage16 from '../assets/autors/autor_16.webp';
import autorimage17 from '../assets/autors/autor_17.webp';
import autorimage19 from '../assets/autors/autor_19.png';

export interface Recipe {
  id: string;
  title: string;
  author: string;
  complexity: string;
  time?: string;
  rating?: number;
  image?: string;
  authorImage?: string;
  cuisine?: string;
  category?: string;
  diet?: string;
}

export interface Author {
  id: string;
  name: string;
  email?: string;
  profession: string;
  recipesCount?: number;
  followers?: number;
  image? :string;
}

export interface Section {
  title: string;
  type: 'recipes' | 'authors';
  items: Recipe[] | Author[];
  link?: string;
}

// --- Рецепты ---
export const recommendedRecipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Ідеальний гарбузовий пиріг',
    author: 'Лілія Климчук',
    authorImage: autorimage14,
    complexity: 'Легко',
    time: '2 год 45 хв',
    rating: 5.0,
    image: image1,
    cuisine: 'Американська',
    category: 'Десерт',
    diet: 'Вегетаріанське',
  },
  {
    id: 'r2',
    title: 'Полуничне сирне морозиво з крихтами',
    author: 'Марія Шевченко',
    authorImage: autorimage13,
    complexity: 'Помірно',
    time: '4 год 15 хв',
    rating: 4.5,
    image: image2,
    cuisine: 'Італійська',
    category: 'Десерт',
    diet: 'Безглютенове',
  },
  {
    id: 'r3',
    title: 'Швидкий тортилья-кіш',
    author: 'Юлія Романенко',
    authorImage: autorimage1,
    complexity: 'Легко',
    time: '17 хв',
    rating: 4.0,
    image: image3,
    cuisine: 'Французька',
    category: 'Обід',
    diet: 'Вегетаріанське',
  },
  {
    id: 'r10',
    title: 'Міні-бургери з яйцем',
    author: 'Максим Петренко',
    complexity: 'Легко',
    time: '15 хв',
    rating: 4.9,
    image: image10,
    authorImage: autorimage5,
    cuisine: 'Американська',
    category: 'Перекус',
    diet: 'Низьковуглеводне',
  },
  {
    id: 'r11',
    title: 'Сніданкова тортилья-піца',
    author: 'Анастасія Гончар',
    complexity: 'Легко',
    time: '10 хв',
    rating: 4.0,
    image: image11,
    authorImage: autorimage4,
    cuisine: 'Італійська',
    category: 'Сніданок',
    diet: 'Вегетаріанське',
  },
  {
    id: 'r12',
    title: 'Запечені оніґірі з бататом та авокадо',
    author: 'Анастасія Гончар',
    complexity: 'Помірно',
    time: '1 год',
    rating: 5.0,
    image: image12,
    authorImage: autorimage4,
    cuisine: 'Японська',
    category: 'Перекус',
    diet: 'Веганське',
  },
  {
    id: 'r13',
    title: 'Сніданкова боул-тарілка з бататом',
    author: 'Юлія Романенко',
    complexity: 'Легко',
    time: '35 хв',
    rating: 4.8,
    image: image13,
    authorImage: autorimage1,
    cuisine: 'Сучасна',
    category: 'Сніданок',
    diet: 'Веганське',
  },
  {
    id: 'r14',
    title: 'Фрикадельки з сиром рікота та моцарела',
    author: 'Валентина Кушнір',
    complexity: 'Легко',
    time: '30 хв',
    rating: 4.0,
    image: image14,
    authorImage: autorimage11,
    cuisine: 'Італійська',
    category: 'Вечеря',
    diet: 'Безлактозне',
  },
  {
    id: 'r15',
    title: 'Паста з яловичиною та вершковим соусом',
    author: 'Марія Шевченко',
    complexity: 'Легко',
    time: '25 хв',
    rating: 5.0,
    image: image15,
    authorImage: autorimage13,
    cuisine: 'Італійська',
    category: 'Вечеря',
    diet: 'Низькокалорійне',
  },
  {
    id: 'r16',
    title: 'Легка запіканка з тортильї з начинкою',
    author: 'Марко Левченко',
    complexity: 'Легко',
    time: '1 год 5хв',
    rating: 5.0,
    image: image16,
    authorImage: autorimage2,
    cuisine: 'Мексиканська',
    category: 'Обід',
    diet: 'Вегетаріанське',
  },
  {
    id: 'r17',
    title: 'Шаурма з куркою',
    author: 'Юлія Пастушенко',
    complexity: 'Легко',
    time: '1 год 25хв',
    rating: 5.0,
    authorImage: autorimage8,
    image: image17,
    cuisine: 'Близькосхідна',
    category: 'Обід',
    diet: 'Низьковуглеводне',
  },
  {
    id: 'r18',
    title: 'Салат із запеченого нуту з ніжною кремовою заправкою',
    author: 'Максим Петренко',
    complexity: 'Легко',
    time: '30хв',
    rating: 4.0,
    image: image18,
    authorImage: autorimage5,
    cuisine: 'Середземноморська',
    category: 'Обід',
    diet: 'Веганське',
  },
  {
    id: 'r19',
    title: 'Тако з цвітної капусти та кіноа',
    author: 'Юлія Романенко',
    complexity: 'Легко',
    time: '1 год',
    rating: 4.5,
    image: image19,
    authorImage: autorimage1,
    cuisine: 'Мексиканська',
    category: 'Вечеря',
    diet: 'Вегетаріанське',
  },
  {
    id: 'r20',
    title: 'Лосось із кунжутом та салат з рисової локшини',
    author: 'Галина Левчук',
    complexity: 'Легко',
    time: '45 хв',
    rating: 4.9,
    image: image20,
    authorImage: autorimage10,
    cuisine: 'Азійська',
    category: 'Вечеря',
    diet: 'Безглютенове',
  },
  {
    id: 'r21',
    title: 'Боул із креветками та манговою сальсою',
    author: 'Галина Левчук',
    complexity: 'Легко',
    time: '45 хв',
    rating: 4.8,
    image: image21,
    authorImage: autorimage10,
    cuisine: 'Гавайська',
    category: 'Обід',
    diet: 'Низькокалорійне',
  },
  {
    id: 'r22',
    title: 'Качині грудки з винним соусом і запеченим виноградом',
    author: 'Валентина Кушнір',
    complexity: 'Легко',
    time: '40 хв',
    rating: 4.7,
    image: image22,
    authorImage: autorimage11,
    cuisine: 'Французька',
    category: 'Вечеря',
    diet: 'Безглютенове',
  },
  {
    id: 'r23',
    title: 'Смажені на пательні свинячі відбивні',
    author: 'Юлія Пастушенко',
    complexity: 'Легко',
    time: '40 хв',
    rating: 4.5,
    image: image23,
    authorImage: autorimage8,
    cuisine: 'Європейська',
    category: 'Вечеря',
    diet: 'Кето',
  },

  {
    id: 'r60',
    title: '5-хвилинний кекс з Нутеллою в чашці',
    author: 'Марко Левченко',
    complexity: 'Легко',
    time: '5 хв',
    rating: 4.6,
    authorImage: autorimage2,
    image: image60,
    cuisine: 'Американська',
    category: 'Напій',
    diet: 'Безглютенове',
  },

];

export const popularRecipes: Recipe[] = [
  {
    id: 'r4', title: 'Песто і смаженим свиним фаршем', author: 'Дмитро Савченко', authorImage: autorimage17, complexity: 'Легко', time: '20 хв', rating: 4.7, image: image4, cuisine: 'Італійська', category: 'Обід', diet: 'Низьковуглеводне',
  },
  {
    id: 'r5', title: 'Курка ескабече з халапеньйо, золотим родзинком та м’ятою', author: 'Юлія Мельник', authorImage: autorimage19, complexity: 'Легко', time: '46 хв', rating: 4.3, image: image5, cuisine: 'Мексиканська', category: 'Обід', diet: 'Безглютенове',
  },
  {
    id: 'r6', title: 'Оливкові мафіни з чорним шоколадом', author: 'Софія Дорошенко', authorImage: autorimage16, complexity: 'Помірно', time: '45 хв', rating: 4.9, image: image6, cuisine: 'Середземноморська', category: 'Десерт', diet: 'Вегетаріанське',
  },
  {
    id: 'r24', title: 'Легка галета з персиками на листковому тісті з морозивом', author: 'Лілія Климчук', authorImage: autorimage14, complexity: 'Легко', time: '40 хв', rating: 4.9, image: image24, cuisine: 'Французька', category: 'Десерт', diet: 'Вегетаріанське',
  },
  {
    id: 'r25', title: 'Салат із слив та фенхелю з заправкою з імбиру й меду', author: 'Марія Шевченко', authorImage: autorimage13, complexity: 'Помірно', time: '30 хв', rating: 4.9, image: image25, cuisine: 'Середземноморська', category: 'Перекус', diet: 'Веганське',
  },
  {
    id: 'r26', title: 'Салат із куркою, персиками та манго', author: 'Юлія Романенко', authorImage: autorimage1, complexity: 'Легко', time: '45 хв', rating: 4.9, image: image26, cuisine: 'Сучасна', category: 'Обід', diet: 'Низькокалорійне',
  },
  {
    id: 'r27', title: 'Домашній йогурт із ягодами та натуральним смаком', author: 'Марко Левченко', authorImage: autorimage2, complexity: 'Легко', time: '10 хв', rating: 4.9, image: image27, cuisine: 'Європейська', category: 'Сніданок', diet: 'Безглютенове',
  },

  {
    id: 'r28', title: 'Хот-дог бар (асорті на дошці з хот-догами)', author: 'Максим Петренко', authorImage: autorimage5, complexity: 'Легко', time: '40 хв', rating: 4.9, image: image28, cuisine: 'Американська', category: 'Вечеря', diet: 'Низьковуглеводне',
  },

  {
    id: 'r29', title: 'Бургери з лососем', author: 'Анастасія Гончар', authorImage: autorimage4, complexity: 'Помірно', time: '49 хв', rating: 4.9, image: image29, cuisine: 'Скандинавська', category: 'Вечеря', diet: 'Безглютенове',
  },
  {
    id: 'r30', title: 'Салат із яблук та кіноа з солодкою тахінною заправкою', author: 'Анастасія Гончар', authorImage: autorimage4, complexity: 'Легко', time: '30 хв', rating: 4.9, image: image30, cuisine: 'Близькосхідна', category: 'Перекус', diet: 'Веганське',
  },

  {
    id: 'r31', title: 'Курка з лаймом та кінзовим рисом', author: 'Юлія Романенко', authorImage: autorimage1, complexity: 'Помірно', time: '40 хв', rating: 4.9, image: image31, cuisine: 'Мексиканська', category: 'Обід', diet: 'Безглютенове',
  },
  {
    id: 'r32', title: 'Курка в соусі кочуджан, обсмажена з овочами', author: 'Валентина Кушнір', authorImage: autorimage11, complexity: 'Легко', time: '30 хв', rating: 4.9, image: image32, cuisine: 'Корейська', category: 'Вечеря', diet: 'Безлактозне',
  },

  {
    id: 'r33', title: 'Шотландські яйця', author: 'Марія Шевченко', authorImage: autorimage13, complexity: 'Помірно', time: '1 год 15 хв', rating: 4.9, image: image33, cuisine: 'Британська', category: 'Перекус', diet: 'Низьковуглеводне',
  },
  {
    id: 'r34', title: 'Веганська ригатоні-пиріг з гарбузом', author: 'Марко Левченко', authorImage: autorimage2, complexity: 'Помірно', time: '45 хв', rating: 4.9, image: image34, cuisine: 'Італійська', category: 'Вечеря', diet: 'Веганське',
  },

  {
    id: 'r35', title: 'Запечена цвітна капуста з нутом і гірчичною заправкою', author: 'Юлія Пастушенко', authorImage: autorimage8, complexity: 'Легко', time: '1 год 10 хв', rating: 4.9, image: image35, cuisine: 'Індійська', category: 'Обід', diet: 'Веганське',
  },
  {
    id: 'r36', title: 'Обсмажені помідори з яєчнею-бовтанкою', author: 'Максим Петренко', authorImage: autorimage5, complexity: 'Легко', time: '15 хв', rating: 4.9, image: image36, cuisine: 'Європейська', category: 'Сніданок', diet: 'Вегетаріанське',
  },
  {
    id: 'r37', title: 'Сендвіч із грильованими овочами та песто', author: 'Юлія Романенко', authorImage: autorimage1, complexity: 'Легко', time: '40 хв', rating: 4.9, image: image37, cuisine: 'Італійська', category: 'Перекус', diet: 'Вегетаріанське',
  },

  {
    id: 'r38', title: 'Бургер у стилі Рілаккума', author: 'Галина Левчук', authorImage: autorimage10, complexity: 'Складно', time: '1 год', rating: 4.9, image: image38, cuisine: 'Японська', category: 'Вечеря', diet: 'Низькокалорійне',
  },
  {
    id: 'r39', title: 'Китайська парова курка з сушеними грибами шиїтаке', author: 'Галина Левчук', authorImage: autorimage10, complexity: 'Складно', time: '1 год 40 хв', rating: 4.9, image: image39, cuisine: 'Китайська', category: 'Обід', diet: 'Безглютенове',
  },
  {
    id: 'r40', title: 'Паста з куркою по-тосканськи в кремовому соусі', author: 'Валентина Кушнір', authorImage: autorimage11, complexity: 'Легко', time: '30 хв', rating: 4.9, image: image40, cuisine: 'Італійська', category: 'Вечеря', diet: 'Безлактозне',
  },
  {
    id: 'r41', title: 'Суп із молюсків у кремово-томатному стилі', author: 'Юлія Пастушенко', authorImage: autorimage8, complexity: 'Помірно', time: '1 год', rating: 4.9, image: image41, cuisine: 'Французька', category: 'Вечеря', diet: 'Безглютенове',
  },
];

export const summerOffers: Recipe[] = [
  {
    id: 'r7', title: 'Грецький салат з нутом', author: 'Богдан Іваненко', authorImage: autorimage15, complexity: 'Легко', time: '20 хв', rating: 4.7, image: image7, cuisine: 'Грецька', category: 'Перекус', diet: 'Веганське',
  },
  {
    id: 'r8', title: 'Суші «Грецький салат»', author: 'Марія Шевченко', authorImage: autorimage13, complexity: 'Легко', time: '10 хв', rating: 4.3, image: image8, cuisine: 'Японська', category: 'Перекус', diet: 'Вегетаріанське',
  },

  {
    id: 'r9', title: 'Запечені картопля з бальзамічним соусом', author: 'Анастасія Гончар', authorImage: autorimage4, complexity: 'Помірно', time: '55 хв', rating: 4.9, image: image9, cuisine: 'Італійська', category: 'Вечеря', diet: 'Вегетаріанське',
  },
  {
    id: 'r42', title: 'Солона яблучна тарталетка на хрусткому тісті', author: 'Лілія Климчук', authorImage: autorimage14, complexity: 'Помірно', time: '1 год 40 хв', rating: 4.9, image: image42, cuisine: 'Французька', category: 'Десерт', diet: 'Вегетаріанське',
  },

  {
    id: 'r43', title: 'Апельсинове пісочне печиво', author: 'Марія Шевченко', authorImage: autorimage13, complexity: 'Легко', time: '35 хв', rating: 4.9, image: image43, cuisine: 'Європейська', category: 'Десерт', diet: 'Вегетаріанське',
  },
  {
    id: 'r44', title: 'Шоколадний мус із 2 інгредієнтів', author: 'Юлія Романенко', authorImage: autorimage1, complexity: 'Складно', time: '2 год 40 хв', rating: 4.9, image: image44, cuisine: 'Європейська', category: 'Десерт', diet: 'Веганське',
  },

  {
    id: 'r45', title: 'Індичка та прошутто з глазур’ю з портвейну', author: 'Марко Левченко', authorImage: autorimage2, complexity: 'Легко', time: '35 хв', rating: 4.9, image: image45, cuisine: 'Французька', category: 'Обід', diet: 'Безглютенове',
  },
  {
    id: 'r46', title: 'Шведські фрикадельки', author: 'Максим Петренко', authorImage: autorimage5, complexity: 'Легко', time: '40 хв', rating: 4.9, image: image46, cuisine: 'Шведська', category: 'Обід', diet: 'Низькокалорійне',
  },

  {
    id: 'r47', title: 'Паста з фундука, шоколаду та фініків', author: 'Анастасія Гончар', authorImage: autorimage4, complexity: 'Легко', time: '45 хв', rating: 4.9, image: image47, cuisine: 'Італійська', category: 'Десерт', diet: 'Веганське',
  },
  {
    id: 'r48', title: 'Легка яблучна галета', author: 'Анастасія Гончар', authorImage: autorimage4, complexity: 'Помірно', time: '1 год 40 хв', rating: 4.9, image: image48, cuisine: 'Французька', category: 'Десерт', diet: 'Вегетаріанське',
  },

  {
    id: 'r49', title: 'Корисний гарбузовий смузі', author: 'Юлія Романенко', authorImage: autorimage1, complexity: 'Легко', time: '5 хв', rating: 4.9, image: image49, cuisine: 'Європейська', category: 'Напій', diet: 'Веганське',
  },
  {
    id: 'r50', title: 'Свіжий томатний суп із базиліком', author: 'Валентина Кушнір', authorImage: autorimage11, complexity: 'Легко', time: '30 хв', rating: 4.9, image: image50, cuisine: 'Італійська', category: 'Обід', diet: 'Веганське',
  },

  {
    id: 'r51', title: 'Свинина на одній пательні з карамелізованими яблуками', author: 'Марія Шевченко', authorImage: autorimage13, complexity: 'Помірно', time: '30 хв', rating: 4.9, image: image51, cuisine: 'Американська', category: 'Обід', diet: 'Низьковуглеводне',
  },
  {
    id: 'r52', title: 'Печиво з гарбуза та шоколадних крапель', author: 'Марко Левченко', authorImage: autorimage2, complexity: 'Помірно', time: '1 год 30 хв', rating: 4.9, image: image52, cuisine: 'Європейська', category: 'Десерт', diet: 'Веганське',
  },

  {
    id: 'r53', title: 'Тонкацу з рисом із кінзи та граната', author: 'Юлія Пастушенко', authorImage: autorimage8, complexity: 'Легко', time: '20 хв', rating: 4.9, image: image53, cuisine: 'Японська', category: 'Обід', diet: 'Безглютенове',
  },
  {
    id: 'r54', title: 'Лосось з рисом у апельсиново-медовій глазурі', author: 'Максим Петренко', authorImage: autorimage5, complexity: 'Легко', time: '40 хв', rating: 4.9, image: image54, cuisine: 'Скандинавська', category: 'Обід', diet: 'Безглютенове',
  },

  {
    id: 'r55', title: 'Лате з гарбузом і прянощами', author: 'Юлія Романенко', authorImage: autorimage1, complexity: 'Легко', time: '15 хв', rating: 4.9, image: image55, cuisine: 'Європейська', category: 'Напій', diet: 'Веганське',
  },
  {
    id: 'r56', title: 'Тушкована карибська курка в пряному соусі', author: 'Галина Левчук', authorImage: autorimage10, complexity: 'Помірно', time: '1 год 30 хв', rating: 4.9, image: image56, cuisine: 'Карибська', category: 'Обід', diet: 'Безглютенове',
  },

  {
    id: 'r57', title: 'М’ясний рулет, фарширований кремовими грибами', author: 'Галина Левчук', authorImage: autorimage10, complexity: 'Помірно', time: '1 год 30 хв', rating: 4.9, image: image57, cuisine: 'Європейська', category: 'Обід', diet: 'Безлактозне',
  },
  {
    id: 'r58', title: 'Суп із курки та сочевиці', author: 'Валентина Кушнір', authorImage: autorimage11, complexity: 'Легко', time: '45 хв', rating: 4.9, image: image58, cuisine: 'Середземноморська', category: 'Обід', diet: 'Безглютенове',
  },
  {
    id: 'r59', title: 'Кіноа-страви зі шпинатом та яйцем у формочках', author: 'Юлія Пастушенко', authorImage: autorimage8, complexity: 'Легко', time: '45 хв', rating: 4.9, image: image59, cuisine: 'Близькосхідна', category: 'Сніданок', diet: 'Вегетаріанське',
  },
];

// --- Авторы ---
export const popularAuthors: Author[] = [
  {
    id: 'a1', name: 'Юлія Романенко', email: 'yulia.romanenko@example.com', profession: 'Веган-шеф', recipesCount: 56, followers: 32500, image: autorimage1,
  },
  {
    id: 'a2', name: 'Марко Левченко', email: 'maria.levchenko@example.com', profession: 'Шеф-кухар', recipesCount: 78, followers: 22400, image: autorimage2,
  },
  {
    id: 'a3', name: 'Катерина Бондар', email: 'kateryna.bondar@example.com', profession: 'Кондитер', recipesCount: 70, followers: 22100, image: autorimage3,
  },
  {
    id: 'a4', name: 'Анастасія Гончар', email: 'yulia.fitness@example.com', profession: 'Фітнес-нутриціолог', recipesCount: 89, followers: 12500, image: autorimage4,
  },
  {
    id: 'a5', name: 'Максим Петренко', email: '@liliaCooks', profession: 'Домашній кулінар', recipesCount: 48, followers: 8700, image: autorimage5,
  },
  {
    id: 'a6', name: 'Тарас Бондар', email: 'yulia.romanenko@example.com', profession: ' Шеф-кухар', recipesCount: 112, followers: 45200, image: autorimage6,
  },
  {
    id: 'a7', name: 'Марія Гаврилюк', email: 'maria.levchenko@example.com', profession: 'Домашній кулінар', recipesCount: 76, followers: 5400, image: autorimage7,
  },
  {
    id: 'a8', name: 'Юлія Пастушенко', email: 'kateryna.bondar@example.com', profession: 'Домашній кулінар', recipesCount: 89, followers: 19800, image: autorimage8,
  },
  {
    id: 'a9', name: 'Софія Паньків', email: 'yulia.fitness@example.com', profession: 'Кондитер', recipesCount: 95, followers: 6100, image: autorimage9,
  },
  {
    id: 'a10', name: 'Галина Левчук', email: '@liliaCooks', profession: 'Фітнес-нутриціолог ', recipesCount: 123, followers: 58300, image: autorimage10,
  },
  {
    id: 'a11', name: 'Валентина Кушнір ', email: 'yulia.fitness@example.com', profession: 'Шеф-кухар', recipesCount: 64, followers: 3200, image: autorimage11,
  },
  {
    id: 'a12', name: 'Кирило Олійник', email: '@liliaCooks', profession: 'Експерт з напоїв', recipesCount: 98, followers: 7500, image: autorimage12,
  },

];

// --- Секции для Home ---
export const sections: Section[] = [
  {
    title: 'Рекомендовано для тебе',
    type: 'recipes',
    items: recommendedRecipes,
    link: '/recipes/recommended',
  },
  {
    title: 'Популярне зараз',
    type: 'recipes',
    items: popularRecipes,
    link: '/recipes/popular',
  },
  {
    title: 'Популярні автори',
    type: 'authors',
    items: popularAuthors,
    link: '/authors',
  },
];

// --- Утилита для получения всех рецептов ---
export const getAllRecipes = (): Recipe[] => [
  ...recommendedRecipes,
  ...popularRecipes,
  ...summerOffers,
];
export const getAllAuthors = (): Author[] => [
  ...popularAuthors,
];
