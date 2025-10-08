"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
// ===== ✅ ИМПОРТ ДАННЫХ (только текстовые поля, картинки игнорируем) =====
const recipes_1 = require("../src/data/recipes");
const API_BASE = 'http://localhost:8000/api/v1';
// === Получаем существующих авторов ===
async function fetchExistingAuthors() {
    const res = await axios_1.default.get(`${API_BASE}/authors/`);
    const map = {};
    res.data.forEach(a => {
        map[a.name] = Number(a.id);
    });
    return map;
}
// === Получаем существующие рецепты ===
async function fetchExistingRecipes() {
    const res = await axios_1.default.get(`${API_BASE}/recipes/`);
    const set = new Set();
    res.data.forEach(r => set.add(r.title));
    return set;
}
// === Загружаем авторов ===
async function uploadAuthors(existingAuthors) {
    const authors = (0, recipes_1.getAllAuthors)();
    const authorMap = { ...existingAuthors };
    for (const author of authors) {
        if (authorMap[author.name]) {
            console.log(`✅ Author exists: ${author.name}`);
            continue;
        }
        try {
            const res = await axios_1.default.post(`${API_BASE}/authors/`, {
                name: author.name,
                email: author.email || '',
                profession: author.profession || '',
                recipes_count: author.recipesCount || 0,
                followers: author.followers || 0,
                image: '', // игнорируем реальные картинки
            });
            authorMap[author.name] = res.data.id;
            console.log(`⬆️ Author uploaded: ${author.name} (id=${res.data.id})`);
        }
        catch (err) {
            console.error(`❌ Failed to upload author ${author.name}:`, err);
        }
    }
    return authorMap;
}
// === Загружаем рецепты ===
async function uploadRecipes(authorMap, existingRecipes) {
    const recipes = (0, recipes_1.getAllRecipes)();
    for (const recipe of recipes) {
        if (existingRecipes.has(recipe.title)) {
            console.log(`✅ Recipe exists: ${recipe.title}`);
            continue;
        }
        const authorId = authorMap[recipe.author];
        if (!authorId) {
            console.warn(`⚠️ Author not found for recipe: ${recipe.title}`);
            continue;
        }
        try {
            await axios_1.default.post(`${API_BASE}/recipes/`, {
                title: recipe.title,
                author: authorId,
                complexity: recipe.complexity || '',
                time: recipe.time || '',
                rating: recipe.rating || 0,
                image: '', // игнорируем реальные картинки
                cuisine: recipe.cuisine || '',
                category: recipe.category || '',
                diet: recipe.diet || '',
            });
            console.log(`⬆️ Recipe uploaded: ${recipe.title}`);
        }
        catch (err) {
            console.error(`❌ Failed to upload recipe ${recipe.title}:`, err);
        }
    }
}
// === Основная функция ===
async function main() {
    console.log('🚀 Starting upload...');
    const existingAuthors = await fetchExistingAuthors();
    const existingRecipes = await fetchExistingRecipes();
    const authorMap = await uploadAuthors(existingAuthors);
    await uploadRecipes(authorMap, existingRecipes);
    console.log('✅ Upload complete!');
}
main().catch(err => console.error('❌ Upload failed:', err));
