"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAuthors = exports.getAllRecipes = exports.sections = exports.popularAuthors = exports.summerOffers = exports.popularRecipes = exports.recommendedRecipes = void 0;
// src/data/recipes.ts
const image_1_png_1 = __importDefault(require("../assets/recepes/image_1.png"));
const recept_2_webp_1 = __importDefault(require("../assets/recepes/recept_2.webp"));
const recept_3_webp_1 = __importDefault(require("../assets/recepes/recept_3.webp"));
const recept_4_webp_1 = __importDefault(require("../assets/recepes/recept_4.webp"));
const recept_5_webp_1 = __importDefault(require("../assets/recepes/recept_5.webp"));
const recept_6_webp_1 = __importDefault(require("../assets/recepes/recept_6.webp"));
const recept_7_webp_1 = __importDefault(require("../assets/recepes/recept_7.webp"));
const recept_8_webp_1 = __importDefault(require("../assets/recepes/recept_8.webp"));
const recept_9_webp_1 = __importDefault(require("../assets/recepes/recept_9.webp"));
const recept_10_webp_1 = __importDefault(require("../assets/recepes/recept_10.webp"));
const recept_11_webp_1 = __importDefault(require("../assets/recepes/recept_11.webp"));
const recept_12_webp_1 = __importDefault(require("../assets/recepes/recept_12.webp"));
const recept_13_webp_1 = __importDefault(require("../assets/recepes/recept_13.webp"));
const recept_14_webp_1 = __importDefault(require("../assets/recepes/recept_14.webp"));
const recept_15_webp_1 = __importDefault(require("../assets/recepes/recept_15.webp"));
const recept_16_webp_1 = __importDefault(require("../assets/recepes/recept_16.webp"));
const recept_17_webp_1 = __importDefault(require("../assets/recepes/recept_17.webp"));
const recept_18_webp_1 = __importDefault(require("../assets/recepes/recept_18.webp"));
const recept_19_webp_1 = __importDefault(require("../assets/recepes/recept_19.webp"));
const recept_20_webp_1 = __importDefault(require("../assets/recepes/recept_20.webp"));
const recept_21_webp_1 = __importDefault(require("../assets/recepes/recept_21.webp"));
const recept_22_webp_1 = __importDefault(require("../assets/recepes/recept_22.webp"));
const recept_23_webp_1 = __importDefault(require("../assets/recepes/recept_23.webp"));
const recept_24_webp_1 = __importDefault(require("../assets/recepes/recept_24.webp"));
const recept_25_webp_1 = __importDefault(require("../assets/recepes/recept_25.webp"));
const recept_26_webp_1 = __importDefault(require("../assets/recepes/recept_26.webp"));
const recept_27_webp_1 = __importDefault(require("../assets/recepes/recept_27.webp"));
const recept_28_webp_1 = __importDefault(require("../assets/recepes/recept_28.webp"));
const recept_29_webp_1 = __importDefault(require("../assets/recepes/recept_29.webp"));
const recept_30_webp_1 = __importDefault(require("../assets/recepes/recept_30.webp"));
const recept_31_webp_1 = __importDefault(require("../assets/recepes/recept_31.webp"));
const recept_32_webp_1 = __importDefault(require("../assets/recepes/recept_32.webp"));
const recept_33_webp_1 = __importDefault(require("../assets/recepes/recept_33.webp"));
const recept_34_webp_1 = __importDefault(require("../assets/recepes/recept_34.webp"));
const recept_35_webp_1 = __importDefault(require("../assets/recepes/recept_35.webp"));
const recept_36_webp_1 = __importDefault(require("../assets/recepes/recept_36.webp"));
const recept_37_webp_1 = __importDefault(require("../assets/recepes/recept_37.webp"));
const recept_38_webp_1 = __importDefault(require("../assets/recepes/recept_38.webp"));
const recept_39_webp_1 = __importDefault(require("../assets/recepes/recept_39.webp"));
const recept_40_webp_1 = __importDefault(require("../assets/recepes/recept_40.webp"));
const recept_41_webp_1 = __importDefault(require("../assets/recepes/recept_41.webp"));
const recept_42_webp_1 = __importDefault(require("../assets/recepes/recept_42.webp"));
const recept_43_webp_1 = __importDefault(require("../assets/recepes/recept_43.webp"));
const recept_44_webp_1 = __importDefault(require("../assets/recepes/recept_44.webp"));
const recept_45_webp_1 = __importDefault(require("../assets/recepes/recept_45.webp"));
const recept_46_webp_1 = __importDefault(require("../assets/recepes/recept_46.webp"));
const recept_47_webp_1 = __importDefault(require("../assets/recepes/recept_47.webp"));
const recept_48_webp_1 = __importDefault(require("../assets/recepes/recept_48.webp"));
const recept_49_webp_1 = __importDefault(require("../assets/recepes/recept_49.webp"));
const recept_50_webp_1 = __importDefault(require("../assets/recepes/recept_50.webp"));
const recept_51_webp_1 = __importDefault(require("../assets/recepes/recept_51.webp"));
const recept_52_webp_1 = __importDefault(require("../assets/recepes/recept_52.webp"));
const recept_53_webp_1 = __importDefault(require("../assets/recepes/recept_53.webp"));
const recept_54_webp_1 = __importDefault(require("../assets/recepes/recept_54.webp"));
const recept_55_webp_1 = __importDefault(require("../assets/recepes/recept_55.webp"));
const recept_56_webp_1 = __importDefault(require("../assets/recepes/recept_56.webp"));
const recept_57_webp_1 = __importDefault(require("../assets/recepes/recept_57.webp"));
const recept_58_webp_1 = __importDefault(require("../assets/recepes/recept_58.webp"));
const recept_59_webp_1 = __importDefault(require("../assets/recepes/recept_59.webp"));
const recept_60_webp_1 = __importDefault(require("../assets/recepes/recept_60.webp"));
const autor_1_webp_1 = __importDefault(require("../assets/autors/autor_1.webp"));
const autor_2_webp_1 = __importDefault(require("../assets/autors/autor_2.webp"));
const autor_3_jpg_1 = __importDefault(require("../assets/autors/autor_3.jpg"));
const autor_4_webp_1 = __importDefault(require("../assets/autors/autor_4.webp"));
const autor_5_webp_1 = __importDefault(require("../assets/autors/autor_5.webp"));
const autor_6_webp_1 = __importDefault(require("../assets/autors/autor_6.webp"));
const autor_7_webp_1 = __importDefault(require("../assets/autors/autor_7.webp"));
const autor_8_webp_1 = __importDefault(require("../assets/autors/autor_8.webp"));
const autor_9_webp_1 = __importDefault(require("../assets/autors/autor_9.webp"));
const autor_10_webp_1 = __importDefault(require("../assets/autors/autor_10.webp"));
const autor_11_webp_1 = __importDefault(require("../assets/autors/autor_11.webp"));
const autor_12_webp_1 = __importDefault(require("../assets/autors/autor_12.webp"));
const autor_13_webp_1 = __importDefault(require("../assets/autors/autor_13.webp"));
const autor_14_webp_1 = __importDefault(require("../assets/autors/autor_14.webp"));
const autor_15_png_1 = __importDefault(require("../assets/autors/autor_15.png"));
const autor_16_webp_1 = __importDefault(require("../assets/autors/autor_16.webp"));
const autor_17_webp_1 = __importDefault(require("../assets/autors/autor_17.webp"));
const autor_19_png_1 = __importDefault(require("../assets/autors/autor_19.png"));
// --- Рецепты ---
exports.recommendedRecipes = [
    {
        id: 'r1',
        title: 'Ідеальний гарбузовий пиріг',
        author: 'Лілія Климчук',
        authorImage: autor_14_webp_1.default,
        complexity: 'Легко',
        time: '2 год 45 хв',
        rating: 5.0,
        image: image_1_png_1.default,
        cuisine: 'Американська',
        category: 'Десерт',
        diet: 'Вегетаріанське',
    },
    {
        id: 'r2',
        title: 'Полуничне сирне морозиво з крихтами',
        author: 'Марія Шевченко',
        authorImage: autor_13_webp_1.default,
        complexity: 'Помірно',
        time: '4 год 15 хв',
        rating: 4.5,
        image: recept_2_webp_1.default,
        cuisine: 'Італійська',
        category: 'Десерт',
        diet: 'Безглютенове',
    },
    {
        id: 'r3',
        title: 'Швидкий тортилья-кіш',
        author: 'Юлія Романенко',
        authorImage: autor_1_webp_1.default,
        complexity: 'Легко',
        time: '17 хв',
        rating: 4.0,
        image: recept_3_webp_1.default,
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
        image: recept_10_webp_1.default,
        authorImage: autor_5_webp_1.default,
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
        image: recept_11_webp_1.default,
        authorImage: autor_4_webp_1.default,
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
        image: recept_12_webp_1.default,
        authorImage: autor_4_webp_1.default,
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
        image: recept_13_webp_1.default,
        authorImage: autor_1_webp_1.default,
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
        image: recept_14_webp_1.default,
        authorImage: autor_11_webp_1.default,
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
        image: recept_15_webp_1.default,
        authorImage: autor_13_webp_1.default,
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
        image: recept_16_webp_1.default,
        authorImage: autor_2_webp_1.default,
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
        authorImage: autor_8_webp_1.default,
        image: recept_17_webp_1.default,
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
        image: recept_18_webp_1.default,
        authorImage: autor_5_webp_1.default,
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
        image: recept_19_webp_1.default,
        authorImage: autor_1_webp_1.default,
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
        image: recept_20_webp_1.default,
        authorImage: autor_10_webp_1.default,
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
        image: recept_21_webp_1.default,
        authorImage: autor_10_webp_1.default,
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
        image: recept_22_webp_1.default,
        authorImage: autor_11_webp_1.default,
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
        image: recept_23_webp_1.default,
        authorImage: autor_8_webp_1.default,
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
        authorImage: autor_2_webp_1.default,
        image: recept_60_webp_1.default,
        cuisine: 'Американська',
        category: 'Напій',
        diet: 'Безглютенове',
    },
];
exports.popularRecipes = [
    {
        id: 'r4', title: 'Песто і смаженим свиним фаршем', author: 'Дмитро Савченко', authorImage: autor_17_webp_1.default, complexity: 'Легко', time: '20 хв', rating: 4.7, image: recept_4_webp_1.default, cuisine: 'Італійська', category: 'Обід', diet: 'Низьковуглеводне',
    },
    {
        id: 'r5', title: 'Курка ескабече з халапеньйо, золотим родзинком та м’ятою', author: 'Юлія Мельник', authorImage: autor_19_png_1.default, complexity: 'Легко', time: '46 хв', rating: 4.3, image: recept_5_webp_1.default, cuisine: 'Мексиканська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r6', title: 'Оливкові мафіни з чорним шоколадом', author: 'Софія Дорошенко', authorImage: autor_16_webp_1.default, complexity: 'Помірно', time: '45 хв', rating: 4.9, image: recept_6_webp_1.default, cuisine: 'Середземноморська', category: 'Десерт', diet: 'Вегетаріанське',
    },
    {
        id: 'r24', title: 'Легка галета з персиками на листковому тісті з морозивом', author: 'Лілія Климчук', authorImage: autor_14_webp_1.default, complexity: 'Легко', time: '40 хв', rating: 4.9, image: recept_24_webp_1.default, cuisine: 'Французька', category: 'Десерт', diet: 'Вегетаріанське',
    },
    {
        id: 'r25', title: 'Салат із слив та фенхелю з заправкою з імбиру й меду', author: 'Марія Шевченко', authorImage: autor_13_webp_1.default, complexity: 'Помірно', time: '30 хв', rating: 4.9, image: recept_25_webp_1.default, cuisine: 'Середземноморська', category: 'Перекус', diet: 'Веганське',
    },
    {
        id: 'r26', title: 'Салат із куркою, персиками та манго', author: 'Юлія Романенко', authorImage: autor_1_webp_1.default, complexity: 'Легко', time: '45 хв', rating: 4.9, image: recept_26_webp_1.default, cuisine: 'Сучасна', category: 'Обід', diet: 'Низькокалорійне',
    },
    {
        id: 'r27', title: 'Домашній йогурт із ягодами та натуральним смаком', author: 'Марко Левченко', authorImage: autor_2_webp_1.default, complexity: 'Легко', time: '10 хв', rating: 4.9, image: recept_27_webp_1.default, cuisine: 'Європейська', category: 'Сніданок', diet: 'Безглютенове',
    },
    {
        id: 'r28', title: 'Хот-дог бар (асорті на дошці з хот-догами)', author: 'Максим Петренко', authorImage: autor_5_webp_1.default, complexity: 'Легко', time: '40 хв', rating: 4.9, image: recept_28_webp_1.default, cuisine: 'Американська', category: 'Вечеря', diet: 'Низьковуглеводне',
    },
    {
        id: 'r29', title: 'Бургери з лососем', author: 'Анастасія Гончар', authorImage: autor_4_webp_1.default, complexity: 'Помірно', time: '49 хв', rating: 4.9, image: recept_29_webp_1.default, cuisine: 'Скандинавська', category: 'Вечеря', diet: 'Безглютенове',
    },
    {
        id: 'r30', title: 'Салат із яблук та кіноа з солодкою тахінною заправкою', author: 'Анастасія Гончар', authorImage: autor_4_webp_1.default, complexity: 'Легко', time: '30 хв', rating: 4.9, image: recept_30_webp_1.default, cuisine: 'Близькосхідна', category: 'Перекус', diet: 'Веганське',
    },
    {
        id: 'r31', title: 'Курка з лаймом та кінзовим рисом', author: 'Юлія Романенко', authorImage: autor_1_webp_1.default, complexity: 'Помірно', time: '40 хв', rating: 4.9, image: recept_31_webp_1.default, cuisine: 'Мексиканська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r32', title: 'Курка в соусі кочуджан, обсмажена з овочами', author: 'Валентина Кушнір', authorImage: autor_11_webp_1.default, complexity: 'Легко', time: '30 хв', rating: 4.9, image: recept_32_webp_1.default, cuisine: 'Корейська', category: 'Вечеря', diet: 'Безлактозне',
    },
    {
        id: 'r33', title: 'Шотландські яйця', author: 'Марія Шевченко', authorImage: autor_13_webp_1.default, complexity: 'Помірно', time: '1 год 15 хв', rating: 4.9, image: recept_33_webp_1.default, cuisine: 'Британська', category: 'Перекус', diet: 'Низьковуглеводне',
    },
    {
        id: 'r34', title: 'Веганська ригатоні-пиріг з гарбузом', author: 'Марко Левченко', authorImage: autor_2_webp_1.default, complexity: 'Помірно', time: '45 хв', rating: 4.9, image: recept_34_webp_1.default, cuisine: 'Італійська', category: 'Вечеря', diet: 'Веганське',
    },
    {
        id: 'r35', title: 'Запечена цвітна капуста з нутом і гірчичною заправкою', author: 'Юлія Пастушенко', authorImage: autor_8_webp_1.default, complexity: 'Легко', time: '1 год 10 хв', rating: 4.9, image: recept_35_webp_1.default, cuisine: 'Індійська', category: 'Обід', diet: 'Веганське',
    },
    {
        id: 'r36', title: 'Обсмажені помідори з яєчнею-бовтанкою', author: 'Максим Петренко', authorImage: autor_5_webp_1.default, complexity: 'Легко', time: '15 хв', rating: 4.9, image: recept_36_webp_1.default, cuisine: 'Європейська', category: 'Сніданок', diet: 'Вегетаріанське',
    },
    {
        id: 'r37', title: 'Сендвіч із грильованими овочами та песто', author: 'Юлія Романенко', authorImage: autor_1_webp_1.default, complexity: 'Легко', time: '40 хв', rating: 4.9, image: recept_37_webp_1.default, cuisine: 'Італійська', category: 'Перекус', diet: 'Вегетаріанське',
    },
    {
        id: 'r38', title: 'Бургер у стилі Рілаккума', author: 'Галина Левчук', authorImage: autor_10_webp_1.default, complexity: 'Складно', time: '1 год', rating: 4.9, image: recept_38_webp_1.default, cuisine: 'Японська', category: 'Вечеря', diet: 'Низькокалорійне',
    },
    {
        id: 'r39', title: 'Китайська парова курка з сушеними грибами шиїтаке', author: 'Галина Левчук', authorImage: autor_10_webp_1.default, complexity: 'Складно', time: '1 год 40 хв', rating: 4.9, image: recept_39_webp_1.default, cuisine: 'Китайська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r40', title: 'Паста з куркою по-тосканськи в кремовому соусі', author: 'Валентина Кушнір', authorImage: autor_11_webp_1.default, complexity: 'Легко', time: '30 хв', rating: 4.9, image: recept_40_webp_1.default, cuisine: 'Італійська', category: 'Вечеря', diet: 'Безлактозне',
    },
    {
        id: 'r41', title: 'Суп із молюсків у кремово-томатному стилі', author: 'Юлія Пастушенко', authorImage: autor_8_webp_1.default, complexity: 'Помірно', time: '1 год', rating: 4.9, image: recept_41_webp_1.default, cuisine: 'Французька', category: 'Вечеря', diet: 'Безглютенове',
    },
];
exports.summerOffers = [
    {
        id: 'r7', title: 'Грецький салат з нутом', author: 'Богдан Іваненко', authorImage: autor_15_png_1.default, complexity: 'Легко', time: '20 хв', rating: 4.7, image: recept_7_webp_1.default, cuisine: 'Грецька', category: 'Перекус', diet: 'Веганське',
    },
    {
        id: 'r8', title: 'Суші «Грецький салат»', author: 'Марія Шевченко', authorImage: autor_13_webp_1.default, complexity: 'Легко', time: '10 хв', rating: 4.3, image: recept_8_webp_1.default, cuisine: 'Японська', category: 'Перекус', diet: 'Вегетаріанське',
    },
    {
        id: 'r9', title: 'Запечені картопля з бальзамічним соусом', author: 'Анастасія Гончар', authorImage: autor_4_webp_1.default, complexity: 'Помірно', time: '55 хв', rating: 4.9, image: recept_9_webp_1.default, cuisine: 'Італійська', category: 'Вечеря', diet: 'Вегетаріанське',
    },
    {
        id: 'r42', title: 'Солона яблучна тарталетка на хрусткому тісті', author: 'Лілія Климчук', authorImage: autor_14_webp_1.default, complexity: 'Помірно', time: '1 год 40 хв', rating: 4.9, image: recept_42_webp_1.default, cuisine: 'Французька', category: 'Десерт', diet: 'Вегетаріанське',
    },
    {
        id: 'r43', title: 'Апельсинове пісочне печиво', author: 'Марія Шевченко', authorImage: autor_13_webp_1.default, complexity: 'Легко', time: '35 хв', rating: 4.9, image: recept_43_webp_1.default, cuisine: 'Європейська', category: 'Десерт', diet: 'Вегетаріанське',
    },
    {
        id: 'r44', title: 'Шоколадний мус із 2 інгредієнтів', author: 'Юлія Романенко', authorImage: autor_1_webp_1.default, complexity: 'Складно', time: '2 год 40 хв', rating: 4.9, image: recept_44_webp_1.default, cuisine: 'Європейська', category: 'Десерт', diet: 'Веганське',
    },
    {
        id: 'r45', title: 'Індичка та прошутто з глазур’ю з портвейну', author: 'Марко Левченко', authorImage: autor_2_webp_1.default, complexity: 'Легко', time: '35 хв', rating: 4.9, image: recept_45_webp_1.default, cuisine: 'Французька', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r46', title: 'Шведські фрикадельки', author: 'Максим Петренко', authorImage: autor_5_webp_1.default, complexity: 'Легко', time: '40 хв', rating: 4.9, image: recept_46_webp_1.default, cuisine: 'Шведська', category: 'Обід', diet: 'Низькокалорійне',
    },
    {
        id: 'r47', title: 'Паста з фундука, шоколаду та фініків', author: 'Анастасія Гончар', authorImage: autor_4_webp_1.default, complexity: 'Легко', time: '45 хв', rating: 4.9, image: recept_47_webp_1.default, cuisine: 'Італійська', category: 'Десерт', diet: 'Веганське',
    },
    {
        id: 'r48', title: 'Легка яблучна галета', author: 'Анастасія Гончар', authorImage: autor_4_webp_1.default, complexity: 'Помірно', time: '1 год 40 хв', rating: 4.9, image: recept_48_webp_1.default, cuisine: 'Французька', category: 'Десерт', diet: 'Вегетаріанське',
    },
    {
        id: 'r49', title: 'Корисний гарбузовий смузі', author: 'Юлія Романенко', authorImage: autor_1_webp_1.default, complexity: 'Легко', time: '5 хв', rating: 4.9, image: recept_49_webp_1.default, cuisine: 'Європейська', category: 'Напій', diet: 'Веганське',
    },
    {
        id: 'r50', title: 'Свіжий томатний суп із базиліком', author: 'Валентина Кушнір', authorImage: autor_11_webp_1.default, complexity: 'Легко', time: '30 хв', rating: 4.9, image: recept_50_webp_1.default, cuisine: 'Італійська', category: 'Обід', diet: 'Веганське',
    },
    {
        id: 'r51', title: 'Свинина на одній пательні з карамелізованими яблуками', author: 'Марія Шевченко', authorImage: autor_13_webp_1.default, complexity: 'Помірно', time: '30 хв', rating: 4.9, image: recept_51_webp_1.default, cuisine: 'Американська', category: 'Обід', diet: 'Низьковуглеводне',
    },
    {
        id: 'r52', title: 'Печиво з гарбуза та шоколадних крапель', author: 'Марко Левченко', authorImage: autor_2_webp_1.default, complexity: 'Помірно', time: '1 год 30 хв', rating: 4.9, image: recept_52_webp_1.default, cuisine: 'Європейська', category: 'Десерт', diet: 'Веганське',
    },
    {
        id: 'r53', title: 'Тонкацу з рисом із кінзи та граната', author: 'Юлія Пастушенко', authorImage: autor_8_webp_1.default, complexity: 'Легко', time: '20 хв', rating: 4.9, image: recept_53_webp_1.default, cuisine: 'Японська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r54', title: 'Лосось з рисом у апельсиново-медовій глазурі', author: 'Максим Петренко', authorImage: autor_5_webp_1.default, complexity: 'Легко', time: '40 хв', rating: 4.9, image: recept_54_webp_1.default, cuisine: 'Скандинавська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r55', title: 'Лате з гарбузом і прянощами', author: 'Юлія Романенко', authorImage: autor_1_webp_1.default, complexity: 'Легко', time: '15 хв', rating: 4.9, image: recept_55_webp_1.default, cuisine: 'Європейська', category: 'Напій', diet: 'Веганське',
    },
    {
        id: 'r56', title: 'Тушкована карибська курка в пряному соусі', author: 'Галина Левчук', authorImage: autor_10_webp_1.default, complexity: 'Помірно', time: '1 год 30 хв', rating: 4.9, image: recept_56_webp_1.default, cuisine: 'Карибська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r57', title: 'М’ясний рулет, фарширований кремовими грибами', author: 'Галина Левчук', authorImage: autor_10_webp_1.default, complexity: 'Помірно', time: '1 год 30 хв', rating: 4.9, image: recept_57_webp_1.default, cuisine: 'Європейська', category: 'Обід', diet: 'Безлактозне',
    },
    {
        id: 'r58', title: 'Суп із курки та сочевиці', author: 'Валентина Кушнір', authorImage: autor_11_webp_1.default, complexity: 'Легко', time: '45 хв', rating: 4.9, image: recept_58_webp_1.default, cuisine: 'Середземноморська', category: 'Обід', diet: 'Безглютенове',
    },
    {
        id: 'r59', title: 'Кіноа-страви зі шпинатом та яйцем у формочках', author: 'Юлія Пастушенко', authorImage: autor_8_webp_1.default, complexity: 'Легко', time: '45 хв', rating: 4.9, image: recept_59_webp_1.default, cuisine: 'Близькосхідна', category: 'Сніданок', diet: 'Вегетаріанське',
    },
];
// --- Авторы ---
exports.popularAuthors = [
    {
        id: 'a1', name: 'Юлія Романенко', email: 'yulia.romanenko@example.com', profession: 'Веган-шеф', recipesCount: 56, followers: 32500, image: autor_1_webp_1.default,
    },
    {
        id: 'a2', name: 'Марко Левченко', email: 'maria.levchenko@example.com', profession: 'Шеф-кухар', recipesCount: 78, followers: 22400, image: autor_2_webp_1.default,
    },
    {
        id: 'a3', name: 'Катерина Бондар', email: 'kateryna.bondar@example.com', profession: 'Кондитер', recipesCount: 70, followers: 22100, image: autor_3_jpg_1.default,
    },
    {
        id: 'a4', name: 'Анастасія Гончар', email: 'yulia.fitness@example.com', profession: 'Фітнес-нутриціолог', recipesCount: 89, followers: 12500, image: autor_4_webp_1.default,
    },
    {
        id: 'a5', name: 'Максим Петренко', email: '@liliaCooks', profession: 'Домашній кулінар', recipesCount: 48, followers: 8700, image: autor_5_webp_1.default,
    },
    {
        id: 'a6', name: 'Тарас Бондар', email: 'yulia.romanenko@example.com', profession: ' Шеф-кухар', recipesCount: 112, followers: 45200, image: autor_6_webp_1.default,
    },
    {
        id: 'a7', name: 'Марія Гаврилюк', email: 'maria.levchenko@example.com', profession: 'Домашній кулінар', recipesCount: 76, followers: 5400, image: autor_7_webp_1.default,
    },
    {
        id: 'a8', name: 'Юлія Пастушенко', email: 'kateryna.bondar@example.com', profession: 'Домашній кулінар', recipesCount: 89, followers: 19800, image: autor_8_webp_1.default,
    },
    {
        id: 'a9', name: 'Софія Паньків', email: 'yulia.fitness@example.com', profession: 'Кондитер', recipesCount: 95, followers: 6100, image: autor_9_webp_1.default,
    },
    {
        id: 'a10', name: 'Галина Левчук', email: '@liliaCooks', profession: 'Фітнес-нутриціолог ', recipesCount: 123, followers: 58300, image: autor_10_webp_1.default,
    },
    {
        id: 'a11', name: 'Валентина Кушнір ', email: 'yulia.fitness@example.com', profession: 'Шеф-кухар', recipesCount: 64, followers: 3200, image: autor_11_webp_1.default,
    },
    {
        id: 'a12', name: 'Кирило Олійник', email: '@liliaCooks', profession: 'Експерт з напоїв', recipesCount: 98, followers: 7500, image: autor_12_webp_1.default,
    },
];
// --- Секции для Home ---
exports.sections = [
    {
        title: 'Рекомендовано для тебе',
        type: 'recipes',
        items: exports.recommendedRecipes,
        link: '/recipes/recommended',
    },
    {
        title: 'Популярне зараз',
        type: 'recipes',
        items: exports.popularRecipes,
        link: '/recipes/popular',
    },
    {
        title: 'Популярні автори',
        type: 'authors',
        items: exports.popularAuthors,
        link: '/authors',
    },
];
// --- Утилита для получения всех рецептов ---
const getAllRecipes = () => [
    ...exports.recommendedRecipes,
    ...exports.popularRecipes,
    ...exports.summerOffers,
];
exports.getAllRecipes = getAllRecipes;
const getAllAuthors = () => [
    ...exports.popularAuthors,
];
exports.getAllAuthors = getAllAuthors;
