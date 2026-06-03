// ==========================================
// ФАЙЛ: filter.js
// РЕАЛИЗАЦИЯ ФИЛЬТРАЦИИ И СОРТИРОВКИ (БЕЗ ПОИСКА)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const categoryFilter = document.querySelector("#categoryFilter");
    const priceSort = document.querySelector("#priceSort");
    const sections = document.querySelectorAll(".section");

    // Массив для хранения исходного порядка карточек
    const originalOrders = new Map();
    let isOriginalOrderSaved = false;

    // Функция для фиксации дефолтного порядка (вызывается один раз при первом действии пользователя)
    function saveOriginalOrder() {
        if (isOriginalOrderSaved) return;
        
        sections.forEach(section => {
            if (section.id === "actions") return;
            const container = section.querySelector(".category");
            if (container) {
                const cards = Array.from(container.querySelectorAll(".item"));
                // Запоминаем только если карточки уже были сгенерированы в DOM
                if (cards.length > 0) {
                    originalOrders.set(section.id, cards);
                }
            }
        });
        
        // Если карточки найдены и сохранены, фиксируем состояние
        if (originalOrders.size > 0) {
            isOriginalOrderSaved = true;
        }
    }

    // Главная функция синхронизации и обновления интерфейса
    function applyFiltersAndSort() {
        // Запускаем проверку и сохранение изначального порядка динамических карточек
        saveOriginalOrder();

        const selectedCategory = categoryFilter.value;
        const sortOrder = priceSort.value;

        sections.forEach(section => {
            // Секцию промо-акций фильтрация не затрагивает
            if (section.id === "actions") return;

            const container = section.querySelector(".category");
            if (!container) return;

            // Извлекаем все карточки в текущей категории
            let cards = Array.from(container.querySelectorAll(".item"));

            // 1. ПРОВЕРКА КАТЕГОРИИ (ФИЛЬТРАЦИЯ)
            if (selectedCategory !== "all" && section.id !== selectedCategory) {
                section.style.display = "none";
                return; // Пропускаем дальнейшую обработку этой секции
            } else {
                section.style.display = "block"; // Показываем подходящую секцию обратно
            }

            // 2. СОРТИРОВКА КАРТОЧЕК В DOM ПО ЦЕНЕ
            if (sortOrder === "default") {
                // Если выбрано "по умолчанию" — восстанавливаем изначальную структуру DOM из копии
                const defaultOrder = originalOrders.get(section.id);
                if (defaultOrder) {
                    defaultOrder.forEach(card => container.appendChild(card));
                }
            } else {
                cards.sort((cardA, cardB) => {
                    // Парсим строку цены вида "1 200 ₸", удаляя пробелы и знак валюты
                    const priceA = parseInt(cardA.querySelector(".price").textContent.replace(/\s/g, '')) || 0;
                    const priceB = parseInt(cardB.querySelector(".price").textContent.replace(/\s/g, '')) || 0;

                    if (sortOrder === "low-to-high") {
                        return priceA - priceB;
                    } else if (sortOrder === "high-to-low") {
                        return priceB - priceA;
                    }
                    return 0;
                });

                // Перестраиваем ноды элементов в контейнере согласно новой сортировке
                cards.forEach(card => container.appendChild(card));
            }
        });
    }

    // Навешиваем слушатели событий на выпадающие списки панели управления
    categoryFilter.addEventListener("change", applyFiltersAndSort);
    priceSort.addEventListener("change", applyFiltersAndSort);
});