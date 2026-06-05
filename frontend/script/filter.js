// ==========================================
// ФАЙЛ: filter.js
// ИСПОЛЬЗОВАНИЕ API ДЛЯ ФИЛЬТРАЦИИ И СОРТИРОВКИ
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const categoryFilter = document.querySelector("#categoryFilter");
    const priceSort = document.querySelector("#priceSort");

    function applyFiltersAndSortFromAPI() {
        const selectedCategory = categoryFilter.value;
        const sortOrder = priceSort.value;
        
        // Формируем параметры запроса
        const params = new URLSearchParams();
        
        if (selectedCategory !== "all") {
            params.append("category", selectedCategory);
        }
        
        if (sortOrder !== "default") {
            params.append("sort", sortOrder);
        }

        const queryString = params.toString() ? `?${params.toString()}` : "";
        
        // Вызываем функцию загрузки товаров из script.js с параметрами
        if (window.loadProducts) {
            window.loadProducts(queryString);
        }
    }

    // Слушатели событий
    if(categoryFilter) categoryFilter.addEventListener("change", applyFiltersAndSortFromAPI);
    if(priceSort) priceSort.addEventListener("change", applyFiltersAndSortFromAPI);
});