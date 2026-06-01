// ДАННЫЕ ТОВАРОВ
const dataMapping = {
    rolls: [
        { title: "Филадельфия", desc: "Лосось, сливочный сыр, огурец", price: "1200 ₸", img: "images/fila.jpg" },
        { title: "Калифорния", desc: "Краб, авокадо, огурец, икра", price: "1100 ₸", img: "images/kalifornia.jpg" },
        { title: "Дракон", desc: "Угорь, авокадо, унаги соус", price: "1500 ₸", img: "images/drakon.jpg" },
        { title: "Спайси тунец", desc: "Тунец, острый соус", price: "1300 ₸", img: "images/spicytuna.jpg" }
    ],
    sets: [
        { title: "Сет №1", desc: "Разные роллы", price: "4500 ₸", img: "images/set1.jpeg" },
        { title: "Сет №2", desc: "Фила + Калифорния", price: "5200 ₸", img: "images/set2.jpg" },
        { title: "Сет №3", desc: "Острые роллы", price: "4800 ₸", img: "images/set3.webp" },
        { title: "Сет №4", desc: "Большой микс", price: "6000 ₸", img: "images/set4.webp" }
    ],
    kombos: [
        { title: "Комбо 1", desc: "Бургер, картофель фри, соус", price: "1800 ₸", img: "images/kombo1.jpg" },
        { title: "Комбо 2", desc: "Наггетсы, картофель фри, кола", price: "1600 ₸", img: "images/kombo2.jpg" },
        { title: "Комбо 3", desc: "Шаурма, картофель фри, напиток", price: "1700 ₸", img: "images/kombo3.jpeg" },
        { title: "Комбо 4", desc: "Бургер, наггетсы, картофель фри, соус", price: "2000 ₸", img: "images/kombo4.webp" }
    ],
    fastfood: [
        { title: "Чизбургер фри", desc: "Говядина, сыр чеддер, соус", price: "1500 ₸", img: "images/burger.jpg" },
        { title: "Картофель фри", desc: "Хрустящий картофель, соль", price: "700 ₸", img: "images/fried.webp" },
        { title: "Наггетсы", desc: "Куриное филе в панировке", price: "900 ₸", img: "images/naggets.jpg" },
        { title: "Стрипсы", desc: "Курица в хрустящей панировке", price: "1100 ₸", img: "images/strips.jpg" }
    ],
    pizzas: [
        { title: "Пепперони", desc: "Сыр, колбаса", price: "2500 ₸", img: "images/peperoni.jpg" },
        { title: "Маргарита", desc: "Сыр, томаты", price: "2200 ₸", img: "images/margarita.jpg" },
        { title: "4 сыра", desc: "Сырный микс", price: "2800 ₸", img: "images/cheese.png" },
        { title: "Мясная", desc: "Говядина, курица", price: "3000 ₸", img: "images/meat.jpg" }
    ],
    burgers: [
        { title: "Чизбургер", desc: "Говядина, сыр чеддер, огурцы, соус", price: "1400 ₸", img: "images/burger.jpg" },
        { title: "Биг бургер", desc: "Двойная котлета, сыр, овощи", price: "1900 ₸", img: "images/big-burger.jpg" },
        { title: "Чикенбургер", desc: "Куриное филе, салат, соус", price: "1300 ₸", img: "images/chikenb.jpeg" },
        { title: "Острый бургер", desc: "Говядина, чили соус, сыр", price: "1500 ₸", img: "images/hot-burger.png" }
    ],
    soups: [
        { title: "Мисо суп", desc: "Паста мисо, тофу, вакаме", price: "900 ₸", img: "images/miso.jpg" },
        { title: "Рамен с курицей", desc: "Лапша, курица, яйцо", price: "1500 ₸", img: "images/ramen.jpg" },
        { title: "Рамен с говядиной", desc: "Говяжий бульон, лапша", price: "1700 ₸", img: "images/ramen-gov.jpg" },
        { title: "Удон суп", desc: "Толстая лапша, овощи", price: "1200 ₸", img: "images/udon.webp" }
    ],
    drinks: [
        { title: "Coca-Cola", price: "500 ₸", img: "images/cola.jpeg" },
        { title: "Апельсиновый сок", price: "600 ₸", img: "images/apelsin.jpg" },
        { title: "Минеральная вода", price: "300 ₸", img: "images/mineral.jpg" },
        { title: "Энергетик", price: "800 ₸", img: "images/gorila-mango.jpg" }
    ],
    deserts: [
        { title: "Чизкейк", desc: "Сливочный сыр, ваниль", price: "1200 ₸", img: "images/cheese-cake.jpg" },
        { title: "Тирамису", desc: "Кофейный бисквит, маскарпоне", price: "1300 ₸", img: "images/tiramisu.jpg" },
        { title: "Мороженое", desc: "Ванильное, сливки", price: "700 ₸", img: "images/ice-cream.webp" },
        { title: "Пончик", desc: "Шоколадная глазурь", price: "600 ₸", img: "images/donut.jpg" }
    ]
};

const categoryNamesRU = {
    rolls: "Роллы", sets: "Сеты", kombos: "Комбо",
    fastfood: "Фастфуд", pizzas: "Пиццы", burgers: "Бургеры",
    soups: "Супы", drinks: "Напитки", deserts: "Десерты"
};

// Глобальный массив товаров в корзине
let cartItems = [];

// Функция динамического определения ключа localStorage для корзины текущего пользователя
function getCartStorageKey() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const user = JSON.parse(currentUser);
        return `ui_cart_items_${user.phone}`; // Корзина привязана к телефону
    }
    return "ui_cart_items_guest"; // Корзина для неавторизованных пользователей
}

// Функция для загрузки корзины из localStorage на основе текущего статуса пользователя
function loadCartFromStorage() {
    const key = getCartStorageKey();
    cartItems = JSON.parse(localStorage.getItem(key)) || [];
}

// ЕДИНЫЙ ОБРАБОТЧИК ЗАГРУЗКИ СТРАНИЦЫ
document.addEventListener("DOMContentLoaded", () => {
    
    // СЕЛЕКТОРЫ ИНТЕРФЕЙСА И АВТОРИЗАЦИИ
    const loginBtn = document.querySelector("#logIn");
    const loginBtnSpan = loginBtn ? loginBtn.querySelector("span") : null;
    const loginBtnIcon = loginBtn ? loginBtn.querySelector("i") : null;

    const modal = document.querySelector("#modal");
    const closeModal = document.querySelector("#closeModal");
    const loginForm = document.querySelector("#loginForm");
    const phoneInput = document.querySelector("#phoneInput");

    const modalTitle = document.querySelector("#modalTitle");
    const nameInput = document.querySelector("#nameInput");
    const nameInputGroup = document.querySelector("#nameInputGroup");
    const submitModalBtn = document.querySelector("#submitModalBtn");
    const toggleAuthMode = document.querySelector("#toggleAuthMode");

    const authDropdown = document.querySelector("#authDropdown");
    const logoutBtn = document.querySelector("#logoutBtn");

    const categoryFilter = document.querySelector("#categoryFilter");
    const priceSort = document.querySelector("#priceSort");

    const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    let authMode = "login"; 

    // ЛОГИКА РАБОТЫ КОРЗИНЫ
    function updateCartUI() {
        // СОХРАНЯЕМ КОРЗИНУ В ПРАВИЛЬНЫЙ КЛЮЧ
        localStorage.setItem(getCartStorageKey(), JSON.stringify(cartItems));

        const cartBody = document.querySelector(".cart-body");
        const basketBtn = document.querySelector("#basket");
        const basketText = basketBtn ? basketBtn.querySelector("span") : null; 
        
        if (cartItems.length === 0) {
            if (cartBody) cartBody.innerHTML = '<p class="empty">Корзина пуста</p>';
            if (basketText) basketText.textContent = "0 ₸";
            return;
        }
        
        if (cartBody) cartBody.innerHTML = "";
        let totalSum = 0;
        
        cartItems.forEach((item, index) => {
            const numericPrice = parseInt(item.price.replace(/\s/g, ''));
            const itemSum = numericPrice * item.quantity;
            totalSum += itemSum;
            
            const itemEl = document.createElement("div");
            itemEl.classList.add("cart-item");
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">${item.price} x ${item.quantity}</span>
                </div>
                <button class="remove-item-btn" data-index="${index}">✕</button>
            `;
            if (cartBody) cartBody.appendChild(itemEl);
        });
        
        if (basketText) {
            basketText.textContent = `${totalSum.toLocaleString()} ₸`;
        }
        
        if (cartBody) {
            cartBody.querySelectorAll(".remove-item-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-index"));
                    cartItems.splice(idx, 1);
                    updateCartUI();
                });
            });
        }
    }

    function addItemToCart(item) {
        const existingItem = cartItems.find(cartItem => cartItem.title === item.title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...item, quantity: 1 });
        }
        updateCartUI();
    }

    // ГЕНЕРАЦИЯ КАРТОЧЕК С ТОВАРАМИ
    function createCard(item) {
        const card = document.createElement("div");
        card.classList.add("item");
        card.setAttribute("data-title", item.title.toLowerCase());

        card.innerHTML = `
            <div class="img-box">
                <img src="${item.img}" alt="${item.title}">
            </div>
            <p class="title">${item.title}</p>
            ${item.desc ? `<p class="desc">${item.desc}</p>` : ""}
            <p class="price">${item.price}</p>
        `;

        card.addEventListener("click", () => {
            addItemToCart(item);
        });

        return card;
    }

    Object.keys(dataMapping).forEach(categoryKey => {
        const container = document.querySelector(`#${categoryKey} .category`);
        if (container) {
            dataMapping[categoryKey].forEach(item => {
                container.append(createCard(item));
            });
        }
    });

    // УМНЫЙ ПОИСК С САДЖЕСТАМИ
    const searchInput = document.querySelector("#searchInput");
    const suggestionsContainer = document.querySelector("#searchSuggestions");

    if (searchInput && suggestionsContainer) {
        searchInput.addEventListener("input", (e) => {
            const value = e.target.value.toLowerCase().trim();
            suggestionsContainer.innerHTML = "";

            if (value === "") {
                suggestionsContainer.classList.remove("active");
                return;
            }

            let matches = [];
            Object.keys(dataMapping).forEach(categoryKey => {
                dataMapping[categoryKey].forEach(item => {
                    if (item.title.toLowerCase().includes(value)) {
                        matches.push({ ...item, category: categoryKey });
                    }
                });
            });

            if (matches.length > 0) {
                suggestionsContainer.classList.add("active");
                
                matches.forEach(match => {
                    const div = document.createElement("div");
                    div.classList.add("suggestion-item");
                    div.innerHTML = `
                        <span>${match.title}</span>
                        <span class="suggestion-category">${categoryNamesRU[match.category]}</span>
                    `;

                    div.addEventListener("click", () => {
                        searchInput.value = "";
                        suggestionsContainer.classList.remove("active");
                        searchInput.dispatchEvent(new Event('input'));

                        setTimeout(() => {
                            let targetCard = document.querySelector(`#${match.category} [data-title="${match.title}"]`) || 
                                             document.querySelector(`#${match.category} [data-title="${match.title.toLowerCase()}"]`);
                            
                            if (targetCard) {
                                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                targetCard.style.outline = "3px solid #111111";
                                targetCard.style.transform = "scale(1.04)";
                                targetCard.style.zIndex = "10";
                                
                                setTimeout(() => {
                                    targetCard.style.outline = "none";
                                    targetCard.style.transform = "";
                                    targetCard.style.zIndex = "";
                                }, 1500);
                            }
                        }, 50); 
                    });
                    suggestionsContainer.appendChild(div);
                });
            } else {
                suggestionsContainer.classList.remove("active");
            }
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest("#searchContainer")) {
                suggestionsContainer.classList.remove("active");
            }
        });
    }

    // МОБИЛЬНОЕ БУРГЕР МЕНЮ
    const burgerBtn = document.querySelector("#burgerMenuBtn");
    const categoriesNav = document.querySelector("#categories");

    if (burgerBtn && categoriesNav) {
        burgerBtn.addEventListener("click", () => {
            categoriesNav.classList.toggle("active");
        });

        categoriesNav.addEventListener("click", (e) => {
            if (e.target.tagName === "A") {
                categoriesNav.classList.remove("active");
            }
        });
    }

    // ЛОГИКА КНОПКИ «НАВЕРХ»
    const scrollToTopBtn = document.querySelector("#scrollToTopBtn");

    if (scrollToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                scrollToTopBtn.classList.add("active");
            } else {
                scrollToTopBtn.classList.remove("active");
            }
        });

        scrollToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // СОХРАНЕНИЕ И ВОССТАНОВЛЕНИЕ ФИЛЬТРОВ ИНТЕРФЕЙСА
    if (categoryFilter) {
        const savedCategory = localStorage.getItem("ui_category_filter");
        if (savedCategory) {
            categoryFilter.value = savedCategory;
            setTimeout(() => categoryFilter.dispatchEvent(new Event("change")), 50);
        }
        categoryFilter.addEventListener("change", (e) => {
            localStorage.setItem("ui_category_filter", e.target.value);
        });
    }

    if (priceSort) {
        const savedSort = localStorage.getItem("ui_price_sort");
        if (savedSort) {
            priceSort.value = savedSort;
            setTimeout(() => priceSort.dispatchEvent(new Event("change")), 50);
        }
        priceSort.addEventListener("change", (e) => {
            localStorage.setItem("ui_price_sort", e.target.value);
        });
    }

    // КОРЗИНА (ОТКРЫТИЕ / ЗАКРЫТИЕ)
    const basketBtn = document.querySelector("#basket");
    const cart = document.querySelector("#cart");
    const cartOverlay = document.querySelector("#cartOverlay");
    const closeCartBtn = document.querySelector("#closeCart");

    if (basketBtn && cart && cartOverlay && closeCartBtn) {
        function openCart() {
            cart.classList.add("active");
            cartOverlay.classList.add("active");
        }

        function closeCart() {
            cart.classList.remove("active");
            cartOverlay.classList.remove("active");
        }

        basketBtn.addEventListener("click", openCart);
        closeCartBtn.addEventListener("click", closeCart);
        cartOverlay.addEventListener("click", closeCart);
    }

    // ВАЛИДАЦИЯ И ОШИБКИ ВВОДАХ ТЕЛЕФОНА
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let matrix = "+7 (7__) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = phoneInput.value.replace(/\D/g, "");

            if (def.length >= val.length) val = def;

            phoneInput.value = matrix.replace(/./g, function(a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a;
            });
        });

        phoneInput.addEventListener("focus", () => {
            if (phoneInput.value === "") phoneInput.value = "+7 ";
        });

        phoneInput.addEventListener("blur", () => {
            if (phoneInput.value === "+7 " || phoneInput.value === "+7 (") phoneInput.value = "";
        });
    }

    function setError(inputElement, errorMessage) {
        const parent = inputElement.parentElement;
        inputElement.classList.add("error-field");
        
        let errorText = parent.querySelector(".error-message");
        if (!errorText) {
            errorText = document.createElement("span");
            errorText.className = "error-message";
            parent.insertBefore(errorText, inputElement);
        }
        errorText.innerText = errorMessage;
    }

    function clearError(inputElement) {
        if (!inputElement) return;
        const parent = inputElement.parentElement;
        inputElement.classList.remove("error-field");
        const errorText = parent.querySelector(".error-message");
        if (errorText) errorText.remove();
    }

    function clearAllErrors() {
        clearError(phoneInput);
        clearError(nameInput);
    }

    // ПРОВЕРКА СТАТУСА АВТОРИЗАЦИИ
    function checkAuthStatus() {
        const currentUser = localStorage.getItem("currentUser");
        
        if (currentUser) {
            const user = JSON.parse(currentUser);
            
            //меняет текст на имя пользователя
            if (loginBtnSpan) loginBtnSpan.textContent = user.name;
            
            if (loginBtnIcon) {
                loginBtnIcon.className = "fa-solid fa-user";
                loginBtnIcon.style.display = "inline-block";
            }
            if (loginBtn) loginBtn.setAttribute("data-logged", "true");

            if (authDropdown) {
                let phoneDisplay = authDropdown.querySelector(".user-phone-info");
                if (!phoneDisplay) {
                    phoneDisplay = document.createElement("div");
                    phoneDisplay.className = "user-phone-info";
                    authDropdown.insertBefore(phoneDisplay, authDropdown.firstChild);
                }
                phoneDisplay.textContent = user.phone;
            }
        } else {
            if (loginBtnSpan) loginBtnSpan.textContent = "Войти";
            if (loginBtnIcon) {
                loginBtnIcon.className = "fa-solid fa-user";
                loginBtnIcon.style.display = "none";
            }
            if (loginBtn) loginBtn.setAttribute("data-logged", "false");
            if (authDropdown) {
                authDropdown.classList.remove("active");
                const phoneDisplay = authDropdown.querySelector(".user-phone-info");
                if (phoneDisplay) phoneDisplay.remove();
            }
        }

        // Обновляем данные в массиве и интерфейсе корзины под нового пользователя (или гостя)
        loadCartFromStorage();
        updateCartUI();
    }

    // ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ МОДАЛКИ (ВХОД / РЕГИСТРАЦИЯ)
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener("click", () => {
            clearAllErrors();
            if (authMode === "login") {
                authMode = "register";
                modalTitle.textContent = "Регистрация";
                if (nameInputGroup) nameInputGroup.style.display = "block";
                submitModalBtn.textContent = "Зарегистрироваться";
                toggleAuthMode.textContent = "Уже есть аккаунт? Войти";
            } else {
                authMode = "login";
                modalTitle.textContent = "Вход";
                if (nameInputGroup) nameInputGroup.style.display = "none";
                submitModalBtn.textContent = "Войти";
                toggleAuthMode.textContent = "Нет аккаунта? Зарегистрироваться";
            }
        });
    }

    // КЛИК ПО КНОПКЕ "ВОЙТИ" / ХЕДЕР-АККАУНТУ
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            const isLogged = loginBtn.getAttribute("data-logged") === "true";
            if (isLogged) {
                e.stopPropagation(); 
                if (authDropdown) authDropdown.classList.toggle("active");
            } else {
                authMode = "login";
                modalTitle.textContent = "Вход";
                if (nameInputGroup) nameInputGroup.style.display = "none";
                submitModalBtn.textContent = "Войти";
                toggleAuthMode.textContent = "Нет аккаунта? Зарегистрироваться";
                if (modal) modal.classList.add("active");
            }
        });
    }

    // КНОПКА ВЫХОДА ИЗ АККАУНТА
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            checkAuthStatus(); // Переключит корзину на 'ui_cart_items_guest' и очистит интерфейс
        });
    }

    // ЗАКРЫТИЕ ДРОПДАУНА ПРИ КЛИКЕ В ЛЮБОЕ МЕСТО ЭКРАНА
    document.addEventListener("click", (e) => {
        if (authDropdown && !e.target.closest(".auth-wrapper")) {
            authDropdown.classList.remove("active");
        }
    });

    // ЗАКРЫТИЕ МОДАЛКИ ПО КРЕСТИКУ И ОВЕРЛЕЮ
    if (closeModal) {
        closeModal.addEventListener("click", () => {
            if (modal) modal.classList.remove("active");
            clearAllErrors();
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                clearAllErrors();
            }
        });
    }

    // ОТПРАВКА ФОРМЫ АВТОРИЗАЦИИ
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            let isValid = true;
            const phoneValue = phoneInput.value.trim();
            const nameValue = nameInput ? nameInput.value.trim() : "";
            const digitsCount = phoneValue.replace(/\D/g, "").length;

            if (phoneValue === "" || phoneValue === "+7 ") {
                setError(phoneInput, "Поле 'Номер телефона' обязательно");
                isValid = false;
            } else if (digitsCount < 11 || !phoneRegex.test(phoneValue)) {
                setError(phoneInput, "Неверный формат номера телефона");
                isValid = false;
            } else {
                clearError(phoneInput);
            }

            if (authMode === "register" && nameValue === "") {
                if (nameInput) setError(nameInput, "Введите имя");
                isValid = false;
            } else if (nameInput) {
                clearError(nameInput);
            }

            if (!isValid) return;

            let usersBase = JSON.parse(localStorage.getItem("usersBase")) || [];

            if (authMode === "register") {
                if (usersBase.some(u => u.phone === phoneValue)) {
                    alert("Этот номер телефона уже зарегистрирован.");
                    return;
                }
                const newUser = { name: nameValue, phone: phoneValue };
                usersBase.push(newUser);
                localStorage.setItem("usersBase", JSON.stringify(usersBase));
                localStorage.setItem("currentUser", JSON.stringify(newUser));
                
                modal.classList.remove("active");
                loginForm.reset();
                checkAuthStatus(); // Автоматически подгрузит пустую или старую сохраненную корзину юзера
            } else {
                const registeredUser = usersBase.find(u => u.phone === phoneValue);
                if (registeredUser) {
                    localStorage.setItem("currentUser", JSON.stringify(registeredUser));
                    modal.classList.remove("active");
                    loginForm.reset();
                    checkAuthStatus(); // Переключит на корзину вошедшего юзера
                } else {
                    alert("Пользователь не найден. Пройдите регистрацию.");
                }
            }
        });
    }

    // ДОПОЛНИТЕЛЬНОЕ ЗАКРЫТИЕ ВСЕГО ПО НАЖАТИЮ ESCAPE
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (modal) modal.classList.remove("active");
            clearAllErrors();
            if (typeof closeCart === "function") closeCart();
            if (suggestionsContainer) suggestionsContainer.classList.remove("active");
        }
    });

    // ПЕРВИЧНАЯ ПРОВЕРКА СТАТУСА ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
    // (Внутри неё автоматически вызовутся loadCartFromStorage() и updateCartUI())
    checkAuthStatus();
});