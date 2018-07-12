app.controller('myCtrl', ['$scope', function($scope) { 
  $scope.promos = [
  	{ 
		address: "../../images/promo/eng/promoEng5.jpg", 
		date: new Date('2018', '06', '19'),
		lang: "en"
  	},
	{ 
		address: "../../images/promo/eng/promoEng6.jpg", 
		date: new Date('2018', '06', '20'),
		lang: "en"
  	},
	{ 
		address: "../../images/promo/eng/promoEng7.jpg", 
		date: new Date('2018', '06', '21'),
		lang: "en"
  	},
	{ 
		address: "../../images/promo/rus/promoRus5.jpg", 
		date: new Date('2018', '06', '19'),
		lang: "ru"
  	},
	{ 
		address: "../../images/promo/rus/promoRus6.jpg", 
		date: new Date('2018', '06', '20'),
		lang: "ru"
  	},
	{ 
		address: "../../images/promo/rus/promoRus7.jpg", 
		date: new Date('2018', '06', '21'),
		lang: "ru"
  	}
  ];
  $scope.books = [
	{
		address: "../../images/books/01.jpg",
		title: "История Российского государства. Царь Петр Алексеевич. Азиатская европеизация",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/02.jpg",
		title: "Ореховый Будда",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/03.jpg",
		title: "Призрак Канта",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/04.jpg",
		title: "Не прощаюсь",
		price: 0,
		author: "",
		category: "New Arrivals"
		
	},
	{
		address: "../../images/books/05.jpg",
		title: "Огонь и агония",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/06.jpg",
		title: "Дети мои",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/07.jpg",
		title: "Тобол. Много званых",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/08.jpg",
		title: "Вафли по-шпионски",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/09.jpg",
		title: "iPhuck 10",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/10.jpg",
		title: "Дальше жить",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/11.jpg",
		title: "Самые родные, самые близкие",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/12.jpg",
		title: "Про девушку, которая была бабушкой",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/13.jpg",
		title: "Тобол. Мало избранных",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/14.jpg",
		title: "Бабий ветер",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/15.jpg",
		title: "Русская фантастика-2017. Том первый",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/16.jpg",
		title: "Погребенный великан",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/17.jpg",
		title: "Шпионы тоже лохи",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/18.jpg",
		title: "Джек Ричер, или Без второго имени",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/19.png",
		title: "Мой дикий сад",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/20.jpg",
		title: "Желтые розы для актрисы",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/21.jpg",
		title: "Крайон. Обретение счастья. Победа над страхами, тревогами, сомнениями",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/22.jpg",
		title: "Всё та же я. Цикл До встречи с тобой. Кн.3",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/23.jpg",
		title: "Очаг",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/24.jpg",
		title: "След лисицы на камнях",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/25.jpg",
		title: "Я признаюсь",
		price: 0 ,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/26.jpg",
		title: "Девушка не нашего круга",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/27.jpg",
		title: "Союз радости и печали",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/28.jpg",
		title: "Запасной выход из комы",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/29.jpg",
		title: "Венец демона",
		price: 0,
		author: "",
		category: "New Arrivals"
	},
	{
		address: "../../images/books/30.jpg",
		title: "Север и Юг",
		price: 0,
		author: "",
		category: "New Arrivals"
	}
  ];
}]);