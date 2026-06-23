let dataMapping = {};
let isAdmin = false;

let categoriesMap = {};
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

// ---------------------------------------------------------
// Функция для красивых уведомлений (Вместо alert)
// ---------------------------------------------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Иконка в зависимости от типа
    const icon = type === 'success' ? '<i class="fa-solid fa-check-circle" style="color:#34c759;"></i>' : '<i class="fa-solid fa-triangle-exclamation" style="color:#ff3b30;"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Удаляем тост из DOM после завершения анимации (3.4 сек)
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3400);
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
    const userAddressInput = document.querySelector("#userAddressInput");
    const saveAddressBtn = document.querySelector("#saveAddressBtn");
    const profileAddressSection = document.querySelector("#profileAddressSection");

    const checkoutModal = document.querySelector("#checkoutModal");
    const closeCheckoutModal = document.querySelector("#closeCheckoutModal");
    const checkoutForm = document.querySelector("#checkoutForm");
    const checkoutAddressInput = document.querySelector("#checkoutAddressInput");
    const checkoutTotalSum = document.querySelector("#checkoutTotalSum");
    
    // Новые поля реалистичного чекаута
    const checkoutDeliveryTime = document.querySelector("#checkoutDeliveryTime");
    const checkoutPaymentMethod = document.querySelector("#checkoutPaymentMethod");
    const checkoutComment = document.querySelector("#checkoutComment");

    const categoryFilter = document.querySelector("#categoryFilter");
    const priceSort = document.querySelector("#priceSort");

    // Карта
    const mapModal = document.querySelector("#mapModal");
    const closeMapModal = document.querySelector("#closeMapModal");
    const confirmMapAddressBtn = document.querySelector("#confirmMapAddressBtn");
    const mapSelectedAddressInput = document.querySelector("#mapSelectedAddressInput");
    let leafletMapInstance = null;
    let mapPlacemark = null;
    let currentAddressTargetInput = null;

    const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    let authMode = "login";

    function updateCartUI(skipPost = false) {
        localStorage.setItem(getCartStorageKey(), JSON.stringify(cartItems));

        if (!skipPost && !isAdmin) {
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
                    <span class="cart-item-price">${displayPrice}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-control-btn minus-btn" data-index="${index}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-control-btn plus-btn" data-index="${index}">+</button>
                </div>
            `;
            if (cartBody) cartBody.appendChild(itemEl);
        });

        if (basketText) {
            basketText.textContent = `${totalSum.toLocaleString()} ₸`;
        }

        if (cartBody) {
            cartBody.querySelectorAll(".minus-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-index"));
                    if (cartItems[idx].quantity > 1) {
                        cartItems[idx].quantity -= 1;
                    } else {
                        cartItems.splice(idx, 1);
                    }
                    updateCartUI();
                });
            });

            cartBody.querySelectorAll(".plus-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute("data-index"));
                    cartItems[idx].quantity += 1;
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
        showToast("Товар добавлен в корзину", "success");
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

        // Клик по карточке: Админ открывает редактирование, Пользователь добавляет в корзину
        card.addEventListener("click", async () => {
            if (isAdmin) {
                window.openAdminModal('edit', item.id);
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
                if (response.ok) {
                    const productData = await response.json();
                    addItemToCart(productData);
                }
            } catch (error) {
                showToast("Ошибка связи с сервером", "error");
            }
        });

        return card;
    }

    async function loadCartFromDB() {
        if (isAdmin) return; // Админу не нужно грузить корзину

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
        if (isAdmin) return; // Админу не сохраняем корзину
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

            Object.keys(dataMapping).forEach(categoryId => {
                const container = document.querySelector(`#category-${categoryId} .category`);
                if (container) {
                    dataMapping[categoryId].forEach(item => {
                        container.append(createCard(item));
                    });

                    if (isAdmin) {
                        const addCard = document.createElement("div");
                        addCard.classList.add("item", "add-item-card");
                        addCard.innerHTML = `
                            <i class="fa-solid fa-plus"></i>
                            <p>Добавить товар</p>
                        `;
                        addCard.onclick = () => window.openAdminModal('add', null, categoryId);
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

        } catch (error) {
            showToast("Не удалось загрузить товары", "error");
        }
    };

    function buildProductQueryString() {
        const params = new URLSearchParams();
        if (categoryFilter && categoryFilter.value !== "all") {
            params.append("category", categoryFilter.value);
        }
        if (priceSort && priceSort.value !== "default") {
            params.append("sort", priceSort.value);
        }
        return params.toString() ? `?${params.toString()}` : "";
    }

    async function loadCategories() {
        try {
            const response = await fetch("http://localhost:3000/api/categories");
            const categories = await response.json();

            categoriesMap = {};
            categories.forEach(cat => { categoriesMap[cat.id] = cat.name; });

            const categoriesNavEl = document.querySelector("#categories");
            if (categoriesNavEl) {
                categoriesNavEl.querySelectorAll(".dynamic-category-link").forEach(el => el.remove());
                const addBtn = document.getElementById("addCategoryNavBtn");

                categories.forEach(cat => {
                    const link = document.createElement("a");
                    link.href = `#category-${cat.id}`;
                    link.textContent = cat.name;
                    link.classList.add("dynamic-category-link");

                    if (addBtn) {
                        categoriesNavEl.insertBefore(link, addBtn);
                    } else {
                        categoriesNavEl.appendChild(link);
                    }
                });

                if (addBtn) addBtn.style.display = isAdmin ? "inline-flex" : "none";
            }

            if (categoryFilter) {
                const previousValue = categoryFilter.value;
                categoryFilter.querySelectorAll(".dynamic-category-option").forEach(el => el.remove());

                categories.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = String(cat.id);
                    option.textContent = cat.name;
                    option.classList.add("dynamic-category-option");
                    categoryFilter.appendChild(option);
                });

                const savedCategory = localStorage.getItem("ui_category_filter");
                const candidates = [previousValue, savedCategory].filter(Boolean);
                const stillValid = candidates.find(val =>
                    Array.from(categoryFilter.options).some(opt => opt.value === val)
                );
                categoryFilter.value = stillValid || "all";
            }

            const goodsEl = document.querySelector("#goods");
            const filterPanel = document.querySelector("#filterControlPanel");

            if (goodsEl) {
                goodsEl.querySelectorAll(".dynamic-category-section").forEach(el => el.remove());

                let insertAfter = filterPanel;

                categories.forEach(cat => {
                    const section = document.createElement("section");
                    section.classList.add("section", "dynamic-category-section");
                    section.id = `category-${cat.id}`;

                    const header = document.createElement("div");
                    header.classList.add("section-header");

                    const heading = document.createElement("h2");
                    heading.textContent = cat.name;
                    header.appendChild(heading);

                    if (isAdmin) {
                        const editBtn = document.createElement("button");
                        editBtn.type = "button";
                        editBtn.classList.add("edit-category-btn");
                        editBtn.innerHTML = `<i class="fa-solid fa-gear"></i>`;
                        editBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            window.openCategoryModal('edit', cat.id);
                        });
                        header.appendChild(editBtn);
                    }

                    section.appendChild(header);

                    const itemsContainer = document.createElement("div");
                    itemsContainer.classList.add("category");
                    section.appendChild(itemsContainer);

                    if (insertAfter && insertAfter.nextSibling) {
                        insertAfter.parentNode.insertBefore(section, insertAfter.nextSibling);
                    } else {
                        goodsEl.appendChild(section);
                    }
                    insertAfter = section;
                });
            }

            if (window.loadProducts) {
                window.loadProducts(buildProductQueryString());
            }
        } catch (error) {
            showToast("Не удалось загрузить категории", "error");
        }
    }

    loadCategories();

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
                        <span class="suggestion-category">${categoriesMap[match.category] || ""}</span>
                    `;

                    div.addEventListener("click", () => {
                        searchInput.value = "";
                        suggestionsContainer.classList.remove("active");
                        searchInput.dispatchEvent(new Event('input'));

                        setTimeout(() => {
                            let targetCard = document.querySelector(`#category-${match.category} [data-title="${match.title}"]`) ||
                                document.querySelector(`#category-${match.category} [data-title="${match.title.toLowerCase()}"]`);

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
            if (phoneInput.value === "") phoneInput.value = "+7 (7";
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
                    authDropdown.insertBefore(phoneDisplay, authDropdown.querySelector(".address-section"));
                }
                phoneDisplay.textContent = user.phone;
            }

            if (userAddressInput) {
                userAddressInput.value = user.address || "";
            }

            // ПРОВЕРКА РОЛИ: Скрываем пользовательские элементы от администратора
            if (isAdmin) {
                if (basketBtn) basketBtn.style.display = "none";
                if (profileAddressSection) profileAddressSection.style.display = "none";
            } else {
                if (basketBtn) basketBtn.style.display = "flex";
                if (profileAddressSection) profileAddressSection.style.display = "flex";
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
            if (userAddressInput) {
                userAddressInput.value = "";
            }
            if (basketBtn) basketBtn.style.display = "flex";
            if (profileAddressSection) profileAddressSection.style.display = "flex";
        }

        loadCartFromDB();
        loadCategories();
    }

    if (saveAddressBtn && userAddressInput) {
        saveAddressBtn.addEventListener("click", () => {
            const currentUser = localStorage.getItem("currentUser");
            if (currentUser) {
                const user = JSON.parse(currentUser);
                user.address = userAddressInput.value.trim();
                localStorage.setItem("currentUser", JSON.stringify(user));
                showToast("Адрес успешно сохранен!", "success");
            }
        });
    }

    const cartOrderBtn = document.querySelector(".cart-footer .primary-btn");
    if (cartOrderBtn) {
        cartOrderBtn.addEventListener("click", () => {
            const currentUser = localStorage.getItem("currentUser");
            if (!currentUser) {
                if (cart) cart.classList.remove("active");
                if (cartOverlay) cartOverlay.classList.remove("active");
                authMode = "login";
                modalTitle.textContent = "Вход";
                if (nameInputGroup) nameInputGroup.style.display = "none";
                submitModalBtn.textContent = "Войти";
                if (modal) modal.classList.add("active");
                return;
            }

            if (cartItems.length === 0) {
                showToast("Ваша корзина пуста.", "error");
                return;
            }

            const user = JSON.parse(currentUser);
            if (checkoutAddressInput) {
                checkoutAddressInput.value = user.address || "";
            }

            if (checkoutTotalSum) {
                let total = 0;
                cartItems.forEach(item => {
                    let price = typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, '')) : parseInt(item.price);
                    total += price * item.quantity;
                });
                checkoutTotalSum.textContent = `${total.toLocaleString()} ₸`;
            }

            if (cart) cart.classList.remove("active");
            if (cartOverlay) cartOverlay.classList.remove("active");
            if (checkoutModal) checkoutModal.classList.add("active");
        });
    }

    // ЛОГИКА ИНТЕГРАЦИИ КАРТ OPENSTREETMAP (LEAFLET)
    if (checkoutAddressInput) {
        checkoutAddressInput.addEventListener("click", () => {
            currentAddressTargetInput = checkoutAddressInput; 
            if (mapModal) mapModal.classList.add("active");
            
            if (!leafletMapInstance && typeof L !== "undefined") {
                initLeafletMap();
            } else if (leafletMapInstance) {
                setTimeout(() => {
                    leafletMapInstance.invalidateSize();
                }, 100);
            }
        });
    }

    if (userAddressInput) {
        userAddressInput.addEventListener("click", () => {
            currentAddressTargetInput = userAddressInput;
            if (mapModal) mapModal.classList.add("active");
            
            if (!leafletMapInstance && typeof L !== "undefined") {
                initLeafletMap();
            } else if (leafletMapInstance) {
                setTimeout(() => {
                    leafletMapInstance.invalidateSize();
                }, 100);
            }
        });
    }

    if (closeMapModal) {
        closeMapModal.addEventListener("click", () => {
            if (mapModal) mapModal.classList.remove("active");
        });
    }

    function initLeafletMap() {
        leafletMapInstance = L.map("deliveryMap").setView([54.8667, 69.1500], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(leafletMapInstance);

        setTimeout(() => {
            leafletMapInstance.invalidateSize();
        }, 200);

        leafletMapInstance.on('click', async function (e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            if (mapPlacemark) {
                mapPlacemark.setLatLng(e.latlng);
            } else {
                mapPlacemark = L.marker(e.latlng).addTo(leafletMapInstance);
            }

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=ru`);
                if (response.ok) {
                    const data = await response.json();
                    
                    if (data && data.address) {
                        const addr = data.address;
                        let street = addr.road || addr.street || addr.pedestrian || addr.suburb || "";
                        let houseNumber = addr.house_number || "";
                        
                        let shortAddress = "";
                        if (street && houseNumber) {
                            shortAddress = `${street}, ${houseNumber}`;
                        } else if (street) {
                            shortAddress = street;
                        } else {
                            shortAddress = data.display_name.split(',').slice(0, 2).join(',').trim();
                        }
                        
                        if (mapSelectedAddressInput) {
                            mapSelectedAddressInput.value = shortAddress;
                        }
                        if (confirmMapAddressBtn) {
                            confirmMapAddressBtn.disabled = false;
                        }
                    }
                }
            } catch (error) {
                showToast("Ошибка определения адреса", "error");
            }
        });
    }

    if (confirmMapAddressBtn) {
        confirmMapAddressBtn.addEventListener("click", () => {
            if (mapSelectedAddressInput && currentAddressTargetInput) {
                currentAddressTargetInput.value = mapSelectedAddressInput.value;
            }
            if (mapModal) mapModal.classList.remove("active");
        });
    }

    // ОТПРАВКА ЗАКАЗА С НОВЫМИ ПОЛЯМИ
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const currentUser = localStorage.getItem("currentUser");
            if (!currentUser) return;

            const user = JSON.parse(currentUser);
            const addressValue = checkoutAddressInput.value.trim();

            if (!addressValue) {
                showToast("Пожалуйста, укажите адрес доставки.", "error");
                return;
            }

            user.address = addressValue;
            localStorage.setItem("currentUser", JSON.stringify(user));
            if (userAddressInput) userAddressInput.value = addressValue;

            // Формируем payload с учетом новых полей из формы чекаута
            const orderData = {
                userId: user.id,
                address: addressValue,
                paymentMethod: checkoutPaymentMethod ? checkoutPaymentMethod.value : 'cash',
                deliveryTime: checkoutDeliveryTime ? checkoutDeliveryTime.value : 'asap',
                comment: checkoutComment ? checkoutComment.value.trim() : '',
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
            };

            try {
                const response = await fetch("http://localhost:3000/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    showToast("Заказ успешно оформлен!", "success");
                    cartItems = [];
                    updateCartUI();
                    if (checkoutModal) checkoutModal.classList.remove("active");
                } else {
                    const err = await response.json();
                    showToast("Ошибка при оформлении: " + (err.error || "Попробуйте позже"), "error");
                }
            } catch (error) {
                showToast("Ошибка соединения с сервером.", "error");
            }
        });
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
            showToast("Вы успешно вышли", "success");
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
                    showToast(data.message || "Регистрация успешна!", "success");

                    const newUser = { id: data.userId, name: nameValue, phone: phoneValue, status: 'user', address: '' };
                    localStorage.setItem("currentUser", JSON.stringify(newUser));

                    modal.classList.remove("active");
                    loginForm.reset();
                    checkAuthStatus();
                } else {
                    showToast("Ошибка: " + data.error, "error");
                }
            } catch (error) {
                showToast("Сервер недоступен.", "error");
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
                    showToast("Успешный вход", "success");

                    modal.classList.remove("active");
                    loginForm.reset();
                    checkAuthStatus();
                } else {
                    showToast("Ошибка: " + data.error, "error");
                }
            } catch (error) {
                showToast("Сервер недоступен.", "error");
            }
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (modal) modal.classList.remove("active");
            clearAllErrors();
            if (cart) cart.classList.remove("active");
            if (cartOverlay) cartOverlay.classList.remove("active");
            if (checkoutModal) checkoutModal.classList.remove("active");
            if (mapModal) mapModal.classList.remove("active");
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
                adminCatInput.value = product.category_id;

                adminNameInput.value = product.title;
                adminDescInput.value = product.desc || "";
                
                adminPriceInput.value = typeof product.price === 'string' ? product.price.replace(/\D/g, "") : product.price;
                
                adminImgInput.value = product.img;
            } catch (e) {
                showToast("Ошибка загрузки данных товара", "error");
            }
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

            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            const headers = { "Content-Type": "application/json" };
            if (currentUser.id) {
                headers["x-user-id"] = currentUser.id;
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: headers,
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    adminModal.classList.remove("active");
                    window.loadProducts();
                    showToast("Товар успешно сохранен", "success");
                } else {
                    const err = await response.json();
                    showToast("Ошибка: " + err.error, "error");
                }
            } catch (error) {
                showToast("Ошибка соединения с сервером.", "error");
            }
        });
    }

    if (adminDeleteBtn) {
        adminDeleteBtn.addEventListener("click", async () => {
            const productId = adminIdInput.value;
            if (!productId || !confirm("Точно удалить товар?")) return;

            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            const headers = {};
            if (currentUser.id) {
                headers["x-user-id"] = currentUser.id;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
                    method: "DELETE",
                    headers: headers
                });

                if (response.ok) {
                    adminModal.classList.remove("active");
                    window.loadProducts();
                    showToast("Товар удален", "success");
                } else {
                    const err = await response.json();
                    showToast("Ошибка: " + err.error, "error");
                }
            } catch (error) {
                showToast("Ошибка соединения.", "error");
            }
        });
    }

    const categoryModal = document.getElementById("categoryModal");
    const closeCategoryModal = document.getElementById("closeCategoryModal");
    const categoryFormInline = document.getElementById("categoryFormInline");

    const categoryIdInput = document.getElementById("categoryItemId");
    const categoryNameInput = document.getElementById("categoryItemName");

    const categoryModalTitle = document.getElementById("categoryModalTitle");
    const categoryDeleteBtn = document.getElementById("categoryDeleteBtnInline");

    const addCategoryNavBtn = document.getElementById("addCategoryNavBtn");

    window.openCategoryModal = function (mode, categoryId = null) {
        if (mode === 'add') {
            categoryModalTitle.textContent = "Добавить категорию";
            categoryFormInline.reset();
            categoryIdInput.value = "";
            categoryDeleteBtn.style.display = "none";
        } else if (mode === 'edit') {
            categoryModalTitle.textContent = "Изменить категорию";
            categoryDeleteBtn.style.display = "block";
            categoryIdInput.value = categoryId;
            categoryNameInput.value = categoriesMap[categoryId] || "";
        }

        categoryModal.classList.add("active");
    };

    if (addCategoryNavBtn) {
        addCategoryNavBtn.addEventListener("click", () => {
            window.openCategoryModal('add');
        });
    }

    if (closeCategoryModal) {
        closeCategoryModal.addEventListener("click", () => {
            categoryModal.classList.remove("active");
        });
    }

    if (categoryModal) {
        categoryModal.addEventListener("click", (e) => {
            if (e.target === categoryModal) {
                categoryModal.classList.remove("active");
            }
        });
    }

    if (categoryFormInline) {
        categoryFormInline.addEventListener("submit", async (e) => {
            e.preventDefault();

            const categoryId = categoryIdInput.value;
            const method = categoryId ? "PUT" : "POST";
            const url = categoryId
                ? `http://localhost:3000/api/categories/${categoryId}`
                : "http://localhost:3000/api/categories";

            const categoryData = {
                name: categoryNameInput.value
            };

            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            const headers = { "Content-Type": "application/json" };
            if (currentUser.id) {
                headers["x-user-id"] = currentUser.id;
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: headers,
                    body: JSON.stringify(categoryData)
                });

                if (response.ok) {
                    categoryModal.classList.remove("active");
                    loadCategories();
                    showToast("Категория сохранена", "success");
                } else {
                    const err = await response.json();
                    showToast("Ошибка: " + err.error, "error");
                }
            } catch (error) {
                showToast("Сервер недоступен", "error");
            }
        });
    }

    if (categoryDeleteBtn) {
        categoryDeleteBtn.addEventListener("click", async () => {
            const categoryId = categoryIdInput.value;
            if (!categoryId || !confirm("Точно удалить категорию?")) return;

            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
            const headers = {};
            if (currentUser.id) {
                headers["x-user-id"] = currentUser.id;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
                    method: "DELETE",
                    headers: headers
                });

                if (response.ok) {
                    categoryModal.classList.remove("active");
                    loadCategories();
                    showToast("Категория удалена", "success");
                } else {
                    const err = await response.json();
                    showToast("Ошибка: " + err.error, "error");
                }
            } catch (error) {
                showToast("Сервер недоступен", "error");
            }
        });
    }
});