let dataMapping = {};
let isAdmin = false;

const dbCategoryIds = {
    rolls: 1, sets: 2, kombos: 3, fastfood: 4,
    pizzas: 5, burgers: 6, soups: 7, drinks: 8, deserts: 9
};

const categoryNamesRU = {
    rolls: "Роллы", sets: "Сеты", kombos: "Комбо",
    fastfood: "Фастфуд", pizzas: "Пиццы", burgers: "Бургеры",
    soups: "Супы", drinks: "Напитки", deserts: "Десерты"
};

let cartItems = [];

function getCartStorageKey() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        const user = JSON.parse(currentUser);
        return `ui_cart_items_${user.phone}`;
    }
    return "ui_cart_items_guest";
}

function loadCartFromStorage() {
    const key = getCartStorageKey();
    cartItems = JSON.parse(localStorage.getItem(key)) || [];
}

document.addEventListener("DOMContentLoaded", () => {

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

    function updateCartUI(skipPost = false) {
        localStorage.setItem(getCartStorageKey(), JSON.stringify(cartItems));

        if (!skipPost) {
            saveCartToDB();
        }

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
            // БЕЗОПАСНАЯ ПРОВЕРКА ЦЕНЫ (решает ошибку replace is not a function)
            let numericPrice = 0;
            let displayPrice = "";
            
            if (typeof item.price === 'string') {
                numericPrice = parseInt(item.price.replace(/\D/g, ''));
                displayPrice = item.price;
            } else {
                numericPrice = parseInt(item.price);
                displayPrice = `${item.price} ₸`;
            }

            const itemSum = numericPrice * item.quantity;
            totalSum += itemSum;

            const itemEl = document.createElement("div");
            itemEl.classList.add("cart-item");
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">${displayPrice} x ${item.quantity}</span>
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

    function createCard(item) {
        const card = document.createElement("div");
        card.classList.add("item");
        card.setAttribute("data-title", item.title.toLowerCase());

        let adminBtnHTML = "";
        if (isAdmin) {
            adminBtnHTML = `
                <button class="edit-item-btn" onclick="event.stopPropagation(); window.openAdminModal('edit', '${item.id}')">
                    <i class="fa-solid fa-gear"></i>
                </button>
            `;
        }

        // Защита отображения цены на карточке товара
        const displayPriceCard = typeof item.price === 'string' ? item.price : `${item.price} ₸`;

        card.innerHTML = `
            ${adminBtnHTML}
            <div class="img-box">
                <img src="${item.img}" alt="${item.title}">
            </div>
            <p class="title">${item.title}</p>
            ${item.desc ? `<p class="desc">${item.desc}</p>` : ""}
            <p class="price">${displayPriceCard}</p>
        `;

        card.addEventListener("click", async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
                if (response.ok) {
                    const productData = await response.json();
                    addItemToCart(productData);
                }
            } catch (error) {}
        });

        return card;
    }

    async function loadCartFromDB() {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            loadCartFromStorage();
            if (typeof updateCartUI === "function") updateCartUI(true);
            return;
        }

        const user = JSON.parse(currentUser);

        if (!user.id) {
            if (typeof updateCartUI === "function") updateCartUI(true);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/cart/${user.id}`);
            if (response.ok) {
                const dbCart = await response.json();
                
                if (cartItems.length > 0 && dbCart.length === 0) {
                    await saveCartToDB();
                } 
                else if (dbCart.length > 0) {
                    cartItems = dbCart;
                }
                
                localStorage.setItem(`ui_cart_items_${user.phone}`, JSON.stringify(cartItems));
            } else {
                loadCartFromStorage();
            }
        } catch (error) {
            loadCartFromStorage();
        }

        if (typeof updateCartUI === "function") updateCartUI(true);
    }

    async function saveCartToDB() {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) return;

        const user = JSON.parse(currentUser);
        const itemsToSend = cartItems.map(item => ({ id: item.id, quantity: item.quantity }));

        try {
            await fetch(`http://localhost:3000/api/cart/${user.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: itemsToSend })
            });
        } catch (error) {}
    }

    window.loadProducts = async function (queryString = "") {
        try {
            const response = await fetch(`http://localhost:3000/api/products${queryString}`);
            dataMapping = await response.json();

            document.querySelectorAll(".category").forEach(container => container.innerHTML = "");

            Object.keys(dataMapping).forEach(categoryKey => {
                const container = document.querySelector(`#${categoryKey} .category`);
                if (container) {
                    dataMapping[categoryKey].forEach(item => {
                        container.append(createCard(item));
                    });

                    if (isAdmin) {
                        const addCard = document.createElement("div");
                        addCard.classList.add("item", "add-item-card");
                        addCard.innerHTML = `
                            <i class="fa-solid fa-plus"></i>
                            <p>Добавить товар</p>
                        `;
                        const catId = dbCategoryIds[categoryKey] || 1;
                        addCard.onclick = () => window.openAdminModal('add', null, catId);
                        container.append(addCard);
                    }
                }
            });

            document.querySelectorAll('.section').forEach(section => {
                if (section.id === "actions") return;
                const container = section.querySelector(".category");
                if (container) {
                    section.style.display = container.children.length === 0 ? "none" : "block";
                }
            });

        } catch (error) {}
    };

    window.loadProducts();

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

    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let matrix = "+7 (7__) ___-__-__",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = phoneInput.value.replace(/\D/g, "");

            if (def.length >= val.length) val = def;

            phoneInput.value = matrix.replace(/./g, function (a) {
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

    function checkAuthStatus() {
        const currentUser = localStorage.getItem("currentUser");

        if (currentUser) {
            const user = JSON.parse(currentUser);
            isAdmin = user.status === "admin";
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
            isAdmin = false;
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

        loadCartFromDB();

        if (window.loadProducts) window.loadProducts();
    }

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

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            checkAuthStatus();
        });
    }

    document.addEventListener("click", (e) => {
        if (authDropdown && !e.target.closest(".auth-wrapper")) {
            authDropdown.classList.remove("active");
        }
    });

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

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
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

            if (authMode === "register") {
                try {
                    const response = await fetch("http://localhost:3000/api/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: nameValue, phone: phoneValue })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert(data.message);

                        const newUser = { id: data.userId, name: nameValue, phone: phoneValue, status: 'user' };
                        localStorage.setItem("currentUser", JSON.stringify(newUser));

                        modal.classList.remove("active");
                        loginForm.reset();
                        checkAuthStatus();
                    } else {
                        alert("Ошибка регистрации: " + data.error);
                    }
                } catch (error) {
                    alert("Не удалось связаться с сервером для регистрации.");
                }
            }
            else {
                try {
                    const response = await fetch("http://localhost:3000/api/logIn", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phone: phoneValue })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem("currentUser", JSON.stringify(data.user));

                        modal.classList.remove("active");
                        loginForm.reset();
                        checkAuthStatus();
                    } else {
                        alert("Ошибка входа: " + data.error);
                    }
                } catch (error) {
                    alert("Не удалось связаться с сервером для входа.");
                }
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (modal) modal.classList.remove("active");
            clearAllErrors();
            if (typeof closeCart === "function") closeCart();
            if (suggestionsContainer) suggestionsContainer.classList.remove("active");
        }
    });

    checkAuthStatus();
    
    const adminModal = document.getElementById("adminModal");
    const closeAdminModal = document.getElementById("closeAdminModal");
    const adminFormInline = document.getElementById("adminFormInline");

    const adminIdInput = document.getElementById("adminItemId");
    const adminCatInput = document.getElementById("adminItemCategory");
    const adminNameInput = document.getElementById("adminItemName");
    const adminDescInput = document.getElementById("adminItemDesc");
    const adminPriceInput = document.getElementById("adminItemPrice");
    const adminImgInput = document.getElementById("adminItemImg");

    const adminModalTitle = document.getElementById("adminModalTitle");
    const adminDeleteBtn = document.getElementById("adminDeleteBtnInline");

    window.openAdminModal = async function (mode, productId = null, categoryId = null) {
        if (mode === 'add') {
            adminModalTitle.textContent = "Добавить товар";
            adminFormInline.reset();
            adminIdInput.value = "";
            adminCatInput.value = categoryId;
            adminImgInput.value = "images/default.jpg";
            adminDeleteBtn.style.display = "none";
        } else if (mode === 'edit') {
            adminModalTitle.textContent = "Изменить товар";
            adminDeleteBtn.style.display = "block";

            try {
                const res = await fetch(`http://localhost:3000/api/products/${productId}`);
                const product = await res.json();

                adminIdInput.value = product.id;
                adminCatInput.value = 1;

                adminNameInput.value = product.title;
                adminDescInput.value = product.desc || "";
                
                // БЕЗОПАСНАЯ ПРОВЕРКА ЦЕНЫ ДЛЯ АДМИНКИ (чтобы не падало при редактировании)
                adminPriceInput.value = typeof product.price === 'string' ? product.price.replace(/\D/g, "") : product.price;
                
                adminImgInput.value = product.img;
            } catch (e) {}
        }

        adminModal.classList.add("active");
    };

    if (closeAdminModal) {
        closeAdminModal.addEventListener("click", () => {
            adminModal.classList.remove("active");
        });
    }

    if (adminFormInline) {
        adminFormInline.addEventListener("submit", async (e) => {
            e.preventDefault();

            const productId = adminIdInput.value;
            const method = productId ? "PUT" : "POST";
            const url = productId ? `http://localhost:3000/api/products/${productId}` : "http://localhost:3000/api/products";

            const productData = {
                name: adminNameInput.value,
                compound: adminDescInput.value,
                price: adminPriceInput.value,
                image: adminImgInput.value,
                category_id: adminCatInput.value || 1
            };

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    adminModal.classList.remove("active");
                    window.loadProducts();
                } else {
                    const err = await response.json();
                    alert("Ошибка: " + err.error);
                }
            } catch (error) {}
        });
    }

    if (adminDeleteBtn) {
        adminDeleteBtn.addEventListener("click", async () => {
            const productId = adminIdInput.value;
            if (!productId || !confirm("Точно удалить товар?")) return;

            try {
                const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    adminModal.classList.remove("active");
                    window.loadProducts();
                }
            } catch (error) {}
        });
    }
});