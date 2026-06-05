// Добавлены уникальные id каждому объекту
const dataMapping = {
    rolls: [
        { id: "r1", title: "Филадельфия", desc: "Лосось, сливочный сыр, огурец", price: "1200 ₸", img: "images/fila.jpg" },
        { id: "r2", title: "Калифорния", desc: "Краб, авокадо, огурец, икра", price: "1100 ₸", img: "images/kalifornia.jpg" },
        { id: "r3", title: "Дракон", desc: "Угорь, авокадо, унаги соус", price: "1500 ₸", img: "images/drakon.jpg" },
        { id: "r4", title: "Спайси тунец", desc: "Тунец, острый соус", price: "1300 ₸", img: "images/spicytuna.jpg" }
    ],
    sets: [
        { id: "s1", title: "Сет №1", desc: "Разные роллы", price: "4500 ₸", img: "images/set1.jpeg" },
        { id: "s2", title: "Сет №2", desc: "Фила + Калифорния", price: "5200 ₸", img: "images/set2.jpg" },
        { id: "s3", title: "Сет №3", desc: "Острые роллы", price: "4800 ₸", img: "images/set3.webp" },
        { id: "s4", title: "Сет №4", desc: "Большой микс", price: "6000 ₸", img: "images/set4.webp" }
    ],
    kombos: [
        { id: "k1", title: "Комбо 1", desc: "Бургер, картофель фри, соус", price: "1800 ₸", img: "images/kombo1.jpg" },
        { id: "k2", title: "Комбо 2", desc: "Наггетсы, картофель фри, кола", price: "1600 ₸", img: "images/kombo2.jpg" },
        { id: "k3", title: "Комбо 3", desc: "Шаурма, картофель фри, напиток", price: "1700 ₸", img: "images/kombo3.jpeg" },
        { id: "k4", title: "Комбо 4", desc: "Бургер, наггетсы, картофель фри, соус", price: "2000 ₸", img: "images/kombo4.webp" }
    ],
    fastfood: [
        { id: "f1", title: "Чизбургер фри", desc: "Говядина, сыр чеддер, соус", price: "1500 ₸", img: "images/burger.jpg" },
        { id: "f2", title: "Картофель фри", desc: "Хрустящий картофель, соль", price: "700 ₸", img: "images/fried.webp" },
        { id: "f3", title: "Наггетсы", desc: "Куриное филе в панировке", price: "900 ₸", img: "images/naggets.jpg" },
        { id: "f4", title: "Стрипсы", desc: "Курица в хрустящей панировке", price: "1100 ₸", img: "images/strips.jpg" }
    ],
    pizzas: [
        { id: "p1", title: "Пепперони", desc: "Сыр, колбаса", price: "2500 ₸", img: "images/peperoni.jpg" },
        { id: "p2", title: "Маргарита", desc: "Сыр, томаты", price: "2200 ₸", img: "images/margarita.jpg" },
        { id: "p3", title: "4 сыра", desc: "Сырный микс", price: "2800 ₸", img: "images/cheese.png" },
        { id: "p4", title: "Мясная", desc: "Говядина, курица", price: "3000 ₸", img: "images/meat.jpg" }
    ],
    burgers: [
        { id: "b1", title: "Чизбургер", desc: "Говядина, сыр чеддер, огурцы, соус", price: "1400 ₸", img: "images/burger.jpg" },
        { id: "b2", title: "Биг бургер", desc: "Двойная котлета, сыр, овощи", price: "1900 ₸", img: "images/big-burger.jpg" },
        { id: "b3", title: "Чикенбургер", desc: "Куриное филе, салат, соус", price: "1300 ₸", img: "images/chikenb.jpeg" },
        { id: "b4", title: "Острый бургер", desc: "Говядина, чили соус, сыр", price: "1500 ₸", img: "images/hot-burger.png" }
    ],
    soups: [
        { id: "sp1", title: "Мисо суп", desc: "Паста мисо, тофу, вакаме", price: "900 ₸", img: "images/miso.jpg" },
        { id: "sp2", title: "Рамен с курицей", desc: "Лапша, курица, яйцо", price: "1500 ₸", img: "images/ramen.jpg" },
        { id: "sp3", title: "Рамен с говядиной", desc: "Говяжий бульон, лапша", price: "1700 ₸", img: "images/ramen-gov.jpg" },
        { id: "sp4", title: "Удон суп", desc: "Толстая лапша, овощи", price: "1200 ₸", img: "images/udon.webp" }
    ],
    drinks: [
        { id: "d1", title: "Coca-Cola", price: "500 ₸", img: "images/cola.jpeg" },
        { id: "d2", title: "Апельсиновый сок", price: "600 ₸", img: "images/apelsin.jpg" },
        { id: "d3", title: "Минеральная вода", price: "300 ₸", img: "images/mineral.jpg" },
        { id: "d4", title: "Энергетик", price: "800 ₸", img: "images/gorila-mango.jpg" }
    ],
    deserts: [
        { id: "ds1", title: "Чизкейк", desc: "Сливочный сыр, ваниль", price: "1200 ₸", img: "images/cheese-cake.jpg" },
        { id: "ds2", title: "Тирамису", desc: "Кофейный бисквит, маскарпоне", price: "1300 ₸", img: "images/tiramisu.jpg" },
        { id: "ds3", title: "Мороженое", desc: "Ванильное, сливки", price: "700 ₸", img: "images/ice-cream.webp" },
        { id: "ds4", title: "Пончик", desc: "Шоколадная глазурь", price: "600 ₸", img: "images/donut.jpg" }
    ]
};

// Получение списка с обработкой req.query (фильтрация, сортировка, лимит)
const getProducts = (req, res) => {
    const { category, sort, limit } = req.query;
    
    let allProducts = [];
    for (const catKey in dataMapping) {
        dataMapping[catKey].forEach(item => {
            allProducts.push({ ...item, category: catKey });
        });
    }

    // Фильтрация по категории
    if (category && category !== "all") {
        allProducts = allProducts.filter(item => item.category === category);
    }

    // Сортировка по цене
    if (sort === "low-to-high") {
        allProducts.sort((a, b) => parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, '')));
    } else if (sort === "high-to-low") {
        allProducts.sort((a, b) => parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, '')));
    }

    // Ограничение количества (limit)
    if (limit) {
        allProducts = allProducts.slice(0, parseInt(limit));
    }

    // Восстанавливаем структуру по категориям для отправки на frontend
    let groupedResult = {};
    allProducts.forEach(item => {
        if (!groupedResult[item.category]) {
            groupedResult[item.category] = [];
        }
        const { category, ...itemData } = item;
        groupedResult[item.category].push(itemData);
    });

    res.json(groupedResult);
};

// Получение одного товара по ID с использованием req.params
const getProductById = (req, res) => {
    const { id } = req.params;
    let foundProduct = null;

    for (const catKey in dataMapping) {
        const product = dataMapping[catKey].find(item => item.id === id);
        if (product) {
            foundProduct = product;
            break;
        }
    }

    // Обработка ошибки 404
    if (!foundProduct) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    res.json(foundProduct);
};

module.exports = {
    getProducts,
    getProductById
};