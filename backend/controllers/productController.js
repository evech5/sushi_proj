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

const getProducts = (req, res) => {
    res.json(dataMapping);
};

module.exports = {
    getProducts
};