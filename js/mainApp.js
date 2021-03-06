var app = angular.module('mainApp', []);

// Initiates the slide cycle if the scope is loaded into the page
app.directive('cycleSlides', function() {
	return function(scope, element, attrs) {
		// Carousel variables
		var slides = $('.slide');
		var slideIndex = 0;
		var slideDuration = 5000;
		var myVar;
		
		// Initializes carousel buttons
		var newHTML = '';
		console.log(slides.length);
		if(slides.length > 1) {
			for (var i = 0; i < slides.length; i++){
				if (i == slideIndex) newHTML += '<span> &#9679; </span>';
				else newHTML += '<span> &#9900; </span>';
			}
			$('#slidesButtons').css('display', 'block');
		} else {
			$('#slidesButtons').css('display', 'none');
		}
		$('#nums').html(newHTML);
		
		// Carousel variables
		var slidesNumButtons = $('#nums span');
		
		// Starts carousel cycle once scope has been loaded
		if(scope.$last){
			setTimeout(cycleSlides(), slideDuration);
		}
		
		// Cycles carousel
		function cycleSlides() {
			// Controls overflow
			if (slideIndex > slides.length - 1) {
				slideIndex = 0;
			// Controls underflow
			} else if (slideIndex < 0) {
				slideIndex = slides.length - 1;
			}
			
			// Updates buttons and hides all images
			for (var i = 0; i < slides.length; i++){
				slides[i].style.display = 'none';
				if (i == slideIndex) $('#nums span').eq(i).html(' &#9679; ');
				else $('#nums span').eq(i).html(' &#9900; ');
			}

			// Unhides the image to be displayed
			for (var i = 0; i < slides.length; i++){
				if (i == slideIndex) slides[i].style.display = 'block';
			}
			
			// Initiates next cycle with a delay
			slideIndex++;
			myVar = setTimeout(cycleSlides, slideDuration);
		}
		
		// Next slide button
		$('#next').click(function(){
			clearTimeout(myVar);
			cycleSlides();
		});
		
		// Previous slide button
		$('#prev').click(function(){
			clearTimeout(myVar);
			slideIndex -= 2;
			cycleSlides();
		});
		
		// Specific slide button
		$('#nums span').click(function(){
			clearTimeout(myVar);
			slideIndex = $('#nums span').index(this);
			cycleSlides();
		});
	};
});

// Filters promos based on start and end dates
app.filter('promoFilter', function(){
	return function(input){
		var output = [];
		var currentDate = new Date();
		
		for(var i = 0; i < input.length; i++){
			// Begins displaying on start date, removed on end date
			if(input[i].endDate.getTime() > currentDate.getTime() && currentDate.getTime() > input[i].startDate.getTime()){
				output.push(input[i]);
			}
		}
		return output;
	}
});

app.controller('myCtrl', ['$scope', function($scope, $http) {
	
	// Container functionality
	angular.element(document).ready(function () {
		// Highlights the first item in each container
		$('.itemContainer').each(function(){$('.item:first', this).addClass('highlight');});
		
        // Scroll variables
		var blockScroll = false;
		var scrollSpeedBase = 500;
		
		// Sets margin width based on container parameters
		setMargins();
		window.onresize = setMargins;
		
		// Scroll items >>LEFT to RIGHT>>
		$('.scrollLeft').click(function(){
			var thisClass = $(this).parent().parent().attr('class');
			if(!reachedStart(thisClass, 0)){
				if(!blockScroll){
					// Disables scrolling while animation plays
					blockScroll = true;
					var itemOuterWidth = $('.' + thisClass + ' .item').outerWidth(true);
					var containerWidth = $('.' + thisClass + ' .itemContainer').innerWidth();
					var n = containerWidth / itemOuterWidth;
					while(reachedStart(thisClass, n - 1)) n--;
					var scrollSpeed = scrollSpeedBase + n * 100;
					// Animate for first item in the slider
					$('.' + thisClass + ' .item:first').animate({right: '-=' + $('.' + thisClass + ' .item').outerWidth(true)*n + 'px'}, scrollSpeed, function(){
						// Enables scrolling
						blockScroll = false;
						// Toggles buttons
						if(reachedStart(thisClass, 0)) toggleButton(thisClass, '.scrollLeft', 0);
					});
					// Animate for the rest of the items in the slider
					$('.' + thisClass + ' .item:not(:first)').animate({right: '-=' + $('.' + thisClass + ' .item').outerWidth(true)*n + 'px'}, scrollSpeed, function(){
						if(!reachedEnd(thisClass, 0)) toggleButton(thisClass, '.scrollRight', 1);
					});
				}
			}
		});
		
		// Scroll items <<RIGHT to LEFT<<
		$('.scrollRight').click(function(){
			var thisClass = $(this).parent().parent().attr('class');
			if(!reachedEnd(thisClass, 0)){
				if(!blockScroll){
					// Disables scrolling while animation plays
					blockScroll = true;
					var itemOuterWidth = $('.' + thisClass + ' .item').outerWidth(true);
					var containerWidth = $('.' + thisClass + ' .itemContainer').innerWidth();
					var n = containerWidth / itemOuterWidth;
					while(reachedEnd(thisClass, n - 1)) n--;
					var scrollSpeed = scrollSpeedBase + n * 100;
					// Animate for first item in the slider
					$('.' + thisClass + ' .item:first').animate({right: '+=' + $('.' + thisClass + ' .item').outerWidth(true)*n + 'px'}, scrollSpeed, function(){
						// Enables scrolling
						blockScroll = false;
						// Toggles buttons
						if(!reachedStart(thisClass, 0)) toggleButton(thisClass, '.scrollLeft', 1);
					});
					// Animate for the rest of the items in the slider
					$('.' + thisClass + ' .item:not(:first)').animate({right: '+=' + $('.' + thisClass + ' .item').outerWidth(true)*n + 'px'}, scrollSpeed, function(){
						if(reachedEnd(thisClass, 0)) toggleButton(thisClass, '.scrollRight', 0);
					});
				}
			}
		});
		
		// Sets margin width based on container parameters
		function setMargins() {
			$('.itemContainer').each(function(){
				var thisClass = $(this).parent().attr('class');
				// Width of one item element without padding
				var itemInnerWidth = $('.item:not(.highlight)').outerWidth();
				// Keeps track of the slider offset in terms of items
				var itemIndex = - Math.round(($('.' + thisClass + ' .item:first').position().left - 1) / $(this).children('.item').outerWidth(true));
				// Number of item elements in current class
				var itemNum = $(this).children('.item').length;
				// Width of the item container element
				var containerWidth = $(this).innerWidth();
				
				var margins = calculateMargins(itemNum, itemInnerWidth, containerWidth);
				
				// Sets item margins based on max num of items in container and remaining space
				$(this).children('.item').css('margin-left', margins);
				$(this).children('.item').css('margin-right', margins);
				
				// Width of one item element with padding
				var itemOuterWidth = $(this).children('.item').outerWidth(true);
				
				// Keeps the same item offset on container resize
				if(Math.round((itemNum - itemIndex) * itemOuterWidth) < containerWidth) itemIndex--;
				$(this).children('.item').css('right', Math.abs(itemIndex * itemOuterWidth));
				
				// Toggles right button if end is reached
				if(reachedEnd(thisClass, 0)) toggleButton(thisClass, '.scrollRight', 0);
				else toggleButton(thisClass, '.scrollRight', 1);
				
				// Toggles left button if start is reached
				if(reachedStart(thisClass, 0)) toggleButton(thisClass, '.scrollLeft', 0);
				else toggleButton(thisClass, '.scrollLeft', 1);
			})
		}
		
		// Calculates item margins based on number of items, item width, and container width
		function calculateMargins(bn, bw, cw) {
			// Number of items
			var i = 0;
			// Remaining space in container
			var r = 0;
			// Finds maximum number of items that can fit in container at once
			do {
				i++;
				r = cw - (bw * i);					
			} while (r > bw && i < bn);
			return (r / i / 2) + 'px';
		}

		// Checks if container reached end
		function reachedEnd(thisClass, offset) {
			var itemOuterWidth = $('.' + thisClass + ' .item').outerWidth(true);
			var itemPos = $('.' + thisClass + ' .item:last').position().left;
			var containerWidth = $('.' + thisClass + ' .itemContainer').innerWidth();
			
			if(Math.round(itemPos + itemOuterWidth * (1 - offset) - containerWidth) <= 0){
				return true;
			} else {
				return false;
			}
		}
		
		// Checks if container reached start
		function reachedStart(thisClass, offset) {
			var itemOuterWidth = $('.' + thisClass + ' .item').outerWidth(true);
			var itemPos = $('.' + thisClass + ' .item:first').position().left - 1;
			
			if(Math.round(itemPos + itemOuterWidth * (offset + 1)) > 0){
				return true;
			} else {
				return false;
			}
		}
		
		// Toggles specified slider button on/off
		function toggleButton(thisClass, button, opacity){
			$('.' + thisClass + " " + button).animate({opacity: opacity}, {queue: false}, 'fast', function(){
				if(opacity == 1) $('.' + thisClass + " " + button).css('cursor', 'pointer');
				else if(opacity == 0) $('.' + thisClass + " " + button).css('cursor', 'default');
			});
		}
		
		// Adds highlight effect to item on click
		$('.item').on('click touchstart', function(){
			var $this = $(this);
			$this.addClass('highlight').siblings().removeClass('highlight');
		});
		
		$('#langButton').click(function(){
			console.log("hello?");
			var en = '\/en\/';
			var ru = '\/ru\/';
			
			var url = window.location.href;
			
			if(url.match(/\/ru\//g)){
				var newUrl = url.replace(ru, en);
				window.location = newUrl;
			}
			
			if(url.match(/\/en\//g)){
				var newUrl = url.replace(en, ru);
				window.location = newUrl;
			}
		});
	});
	
	// Displays information of item in the itemInfo element
	$scope.displayItemInfo = function(thisClass, item, lang){
		var newHTML = '';
		// Used to track if the preceding attribute is there to be separated from
		var separatorFlag = false;
		
		if(lang == 'en'){
			var pages = ' pg.';
			var hardCover = 'Hardcover';
			var softCover = 'Paperback';
		} else {
			var pages = ' стр.';
			var hardCover = 'Твердая обложка';
			var softCover = 'Мягкая обложка';
		}
		
		// Title
		if(item.title){
			newHTML = newHTML + '<span class="title"><strong>' + item.title + '</strong></span><br>';
		}
		
		if(item.type == "book"){
			// Author
			if(item.author){
				newHTML = newHTML + '<span class="author"><strong>' + item.author + '</strong></span>';
				separatorFlag = item.author && item.author.length > 0;
			}
			
			// Release year
			if(item.year) {
				if(separatorFlag) newHTML = newHTML + ' | ';
				newHTML = newHTML + '<span class="year">' + item.year + '</span>';
				separatorFlag = separatorFlag || item.year;
			}
			
			// Genre
			if(item.genre) {
				if(separatorFlag) newHTML = newHTML + ' | ';
				newHTML = newHTML + '<span class="year">' + item.genre + '</span>';
				separatorFlag = separatorFlag || item.genre;
			}
			
			// Publisher
			if(item.publisher){
				if(separatorFlag) newHTML = newHTML + ' | ';
				newHTML = newHTML + '<span class="cover">' + item.publisher + '</span>';
				separatorFlag = separatorFlag || item.publisher;
			}
			
			// Cover type
			if(angular.isDefined(item.hardCover)){
				if(separatorFlag) newHTML = newHTML + ' | ';
				if(item.hardCover){
					newHTML = newHTML + '<span class="cover">' + hardCover + '</span>';
				} else {
					newHTML = newHTML + '<span class="cover">' + softCover + '</span>';
				}
				separatorFlag = separatorFlag || angular.isDefined(item.year);
			}
			
			//Pages
			if(item.pages && item.pages > 0) {
				if(separatorFlag) newHTML = newHTML + ' | ';
				newHTML = newHTML + '<span class="pages">' + item.pages + pages + '</span>';
				separatorFlag = separatorFlag || item.pages > 0;
			}
		} else {
			// Manufacturer
			if(item.manufacturer) {
				newHTML = newHTML + '<span class="manufacturer"><strong>' + item.manufacturer + '</strong></span>';
				separatorFlag = item.manufacturer && item.manufacturer.length > 0;
			}
			
			// Size
			if(item.size) {
				if(separatorFlag) newHTML = newHTML + ' | ';
				newHTML = newHTML + '<span class="size">' + item.size + '</span>';
				separatorFlag = separatorFlag || item.size;
			}
		}
		
		if(separatorFlag) newHTML = newHTML + '<br>';
		
		// Price
		if(item.price){
			if(angular.isDefined(item.sale) && item.sale > 0){
				newHTML = newHTML + '<b class="salePrice">$' + parseFloat(Math.round((item.price - item.price * item.sale) * 100)/100).toFixed(2) + ' </b><span class="regPrice">$' + parseFloat(item.price).toFixed(2) + '</span>';
			} else {
				newHTML = newHTML + '<b class="price">$' + parseFloat(item.price).toFixed(2) + '</b>';
			}
		}
		
		// Description
		if(item.desc){
			newHTML = newHTML + '<p class="desc">' + item.desc  + '</p>';
		}
		
		var div = $('.' + thisClass + ' .itemInfo');
		var currentHeight = div.height();
		
		// Sets image
		$('.' + thisClass + ' .coverImg').html('<img src="../images/items/' + item.ISBN + '.jpg">');
		// Sets text
		$('.' + thisClass + ' .text').html(newHTML);
		
		if(div.css('max-height') != '1000px'){
			var autoHeight = div.css('height', 'auto').height() + 20;
			div.height(currentHeight).animate({height: autoHeight + 2}, 1000, function(){ div.height('auto'); });
		}
		
		$('.' + thisClass + ' .itemInfo').css('max-height', '2000px');
	};
	
	// Categories in order to display on Russian version
	$scope.categoriesRu = [
	{
		class_Name: 'topSellers',
		key: 'Top Sellers',
		title: 'ЛИДЕРЫ ПРОДАЖ'
	},
	{
		class_Name: 'newArrivals',
		key: 'New Arrivals',
		title: 'НОВИНКИ'
	},
	{
		class_Name: 'souvenirs',
		key: 'Souvenirs',
		title: 'СУВЕНИРЫ'
	},
	{
		class_Name: 'toys',
		key: 'Toys',
		title: 'ИГРУШКИ'
	},
	{
		class_Name: 'englishBooks',
		key: 'English Books',
		title: 'КНИГИ НА АНГЛИЙСКОМ'
	}];
	
	// Categories in order to display on English version
	$scope.categoriesEn = [
	{
		class_Name: 'souvenirs',
		key: 'Souvenirs',
		title: 'SOUVENIRS'
	},
	{
		class_Name: 'englishBooks',
		key: 'English Books',
		title: 'ENGLISH BOOKS'
	},
	{
		class_Name: 'toys',
		key: 'Toys',
		title: 'TOYS'
	},
	{
		class_Name: 'topSellers',
		key: 'Top Sellers',
		title: 'TOP SELLERS'
	},
	{
		class_Name: 'newArrivals',
		key: 'New Arrivals',
		title: 'NEW ARRIVALS'
	}];
	
	// Promotional slides
	$scope.promos = [
  	{ 
		title: 'storePromo', 
		startDate: new Date('2018-07-11'),
		endDate: new Date('2019-09-12'),
		lang: 'en',
		importance: 3
  	},
	{ 
		title: 'ryabinoviyKlin', 
		startDate: new Date('2018-08-06'),
		endDate: new Date('2018-08-31'),
		lang: 'ru',
		importance: 3
  	},
	{ 
		title: 'damaIzSugroba', 
		startDate: new Date('2018-08-06'),
		endDate: new Date('2018-08-31'),
		lang: 'ru',
		importance: 3
  	}];

	// Items to be displayed in containers
	$scope.items = [
	{
		ISBN: '9785171076443',
		title: 'Дама из сугроба',
		author: 'Вильмонт Екатерина',
		price: 13,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 320,
		hardCover: true,
		desc: 'Роман Екатерины Вильмонт "Дама из сугроба" несет в себе частичку тепла, доброты и ностальгии. Автору удалось в полной мере передать зимнюю сказочную атмосферу, так что от этой книги поневоле ждешь каких-то чудес. Но чудеса эти должны быть не сверхъестественными, а самыми обычными, человеческими. Во время чтения возникает какое-то приподнятое, праздничное настроение. Рассчитано на широкий круг читателей.<br>Главный герой романа "Дама из сугроба", Тимур. Когда-то, много лет назад, он поругался с отцом после смерти матери и решил навсегда покинуть Россию. Эмигрировав в США, Тимур особо не вспоминает о своей предыдущей жизни, предаваясь всевозможным удовольствиям. Он становится профессиональным игроком. Однако с возрастом, герой осознает, что в жизни важны и другие вещи, а не только сиюминутные желания. Тимур открывает свой бизнес и ведет вполне степенное существование. Но все-таки чего-то ему все равно не хватает. Вещи, которые раньше были не важны, стали восприниматься совсем по-другому. Приехав в Париж на Рождество, Тимур еще отчетливее почувствовал свое одиночество. Неожиданно для себя, повинуясь мимолетному желанию, он звонит своему отцу, которого не видел уже восемнадцать лет, а затем едет в Москву. Что ожидает героя на родине? Обретет ли он наконец так давно ускользающее счастье? Имеет ли прошлое власть над настоящим?',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785170825721',
		title: 'История Российского государства. Царь Петр Алексеевич. Азиатская европеизация',
		author: 'Акунин Борис',
		price: 39,
		year: 2017,
		publisher: 'АСТ',
		genre: '',
		pages: 384,
		hardCover: true,
		desc: 'Продолжение самого масштабного и амбициозного проекта десятилетия от Бориса Акунина! История Отечества в фактах и человеческих судьбах! Уникальный формат: мегатекст состоит из параллельных текстов: история России в восьми томах + исторические авантюрные повести. Суммарный тираж изданных за четыре года книг проекта - более 1 500 000 экземпляров! Тома серии богаты иллюстрациями: цветные в исторических томах, стильная графика - в художественных! Велик ли был Петр Великий? Есть лишь четыре крупных исторических деятеля, отношение к которым окрашено сильными эмоциями: Иван Грозный, Ленин, Сталин - и Петр I. Доблести Петра восхвалялись и при монархии, и в СССР, и в постсоветской России. "Государственникам" этот правитель импонирует как создатель мощной военной державы, "либералам" - как западник, повернувший страну лицом к Европе. Тридцатилетие, в течение которого царь Петр Алексеевич проводил свои преобразования, повлияло на ход всей мировой истории. Обстоятельства его личной жизни, умственное устройство, пристрастия и фобии стали частью национальной матрицы и сегодня воспринимаются миром как нечто исконно российское. И если русская литература "вышла из гоголевской шинели", то Российское государство до сих пор донашивает петровские ботфорты. Эта книга про то, как русские учились не следовать за историей, а творить ее, как что-то у них получилось, а что-то нет. И почему. "Проект будет моей основной работой в течение десяти лет. Речь идет о чрезвычайно нахальной затее, потому что у нас в стране есть только один пример беллетриста, написавшего историю Отечества, - Карамзин. Пока только ему удалось заинтересовать историей обыкновенных людей".Борис АкунинОб авторе: Борис Акунин (настоящее имя Григорий Шалвович Чхартишвили) - русский писатель, ученый-японист, литературовед, переводчик, общественный деятель. Также публиковался под литературными псевдонимами Анна Борисова и Анатолий Брусникин. Борис Акунин является автором нескольких десятков романов, повестей, литературных статей и переводов японской, американской и английской литературы. Художественные произведения Акунина переведены, как утверждает сам писатель, более чем на 30-ть языков мира. По версии российского издания журнала Forbes Акунин, заключивший контракты с крупнейшими издательствами Европы и США, входит в десятку российских деятелей культуры, получивших признание за рубежом. "Комсомольская правда" по итогам первого десятилетия XXI века признала Акунина самым популярным писателем России. Согласно докладу Роспечати "Книжный рынок России" за 2010 год, его книги входят в десятку самых издаваемых. О серии: Первый том "История Российского Государства. От истоков до монгольского нашествия" вышел в ноябре 2013 года. Вторая историческая книга серии появилась через год. Исторические тома проекта "История Российского Государства" выходят каждый год, поздней осенью, став таким образом определенной традицией. Третий том "От Ивана III до Бориса Годунова. Между Азией и Европой" был издан в декабре 2015 года.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785170825769',
		title: 'Ореховый Будда',
		author: 'Акунин Борис',
		price: 24,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 288,
		hardCover: true,
		desc: '"Побегай по Руси в одиночку, поищи ветра в поле. Сколь изобретателен и ловок ни будь один человек, а государственный невод всегда ухватистей. Царь Петр тем и велик, что понял эту истину: решил превратить расхристанную, беспорядочную страну в стройный бакуфу, как это сделал сто лет назад в Японии великий Иэясу. Конечно, России еще далеко до японского порядка. Там от самого сияющего верха до самого глухого низа расходятся лучи государственного присмотра, вплоть до каждого пятидворья, за которым бдит свой наблюдатель. Однако ж и русские учатся, стараются…" Повесть "Ореховый Будда" описывает приключения священной статуэтки, которая по воле случая совершила длинное путешествие из далекой Японии в не менее далекую Московию. Будда странствует по взбудораженной петровскими потрясениями Руси, освещая души светом сатори и помогая путникам найти дорогу к себе…Пять причин купить 1.Новая книга Бориса Акунина. 2.Художественный том проекта «История российского государства». 3.Исторический приключенческий роман Акунина, продолжающий традиции бестеллера «Алмазная колесница». 4.Что роднит Петровскую Русь и Японию? Ответ – в новом романе Бориса Акунина! 5.Захватывающие приключения священной статуэтки, совершившей путешествие из Японии в Московию.',
		type: 'book',
		category: ['New Arrivals', 'Top Sellers']
	},
	{
		ISBN: '9785040916245',
		title: 'Призрак Канта',
		author: 'Устинова Татьяна',
		price: 14,
		year: 2018,
		publisher: 'Эксмо',
		genre: '',
		pages: 320,
		hardCover: false,
		desc: 'Что может быть лучше отпуска… с приключениями! Однако инженер Василий Меркурьев, так мечтавший о холодном море и осеннем лесе, не желает никаких приключений!.. Но они начинаются, как только он приезжает в небольшой отель на взморье. Хозяин знакомит его с постояльцами, среди которых студентка, скучающий юноша, девица, явно вышедшая на охоту, и… молодая ведьма. Меркурьев, разумеется, ни в каких ведьм не верит. И тут, словно в насмешку, окружающая действительность начинает шутить с ним странные шутки: старинную книгу о жизни философа Канта словно кто-то читает, огонь в камине загорается сам собой, а на заброшенном маяке происходит… убийство. Василий Меркурьев точно знает, что не существует ни ведьм, ни призраков, ни духов – и все время натыкается на тайные или явные следы их присутствия. Даже любовь с молодой ведьмой – или не ведьмой?.. – ему словно напророчили потусторонние силы… Иногда на самом деле бывает трудно поверить. Еще труднее осознать и принять! Но если разрешить себе поверить – жизнь оказывается полна чудес, и не выдуманных, а самых настоящих!',
		type: 'book',
		category: ['New Arrivals', 'Top Sellers']
	},
	{
		ISBN: '9785815914773',
		title: 'Не прощаюсь',
		author: 'Акунин Борис',
		price: 24,
		year: 2018,
		publisher: 'Захаров',
		genre: 'Исторический детектив',
		pages: 0,
		hardCover: false,
		desc: 'За окном 1918 год. Эраст Петрович Фандорин провел последние три года своей жизни в коме. На протяжении этого периода времени рядом с ним находился Маса. Последняя реабилитация у китайского целителя Чанга, длившаяся пять месяцев, не осталась безрезультатной. Теперь господин и его верный прислужник возвращаются домой. Эраст чувствует улучшения, он набрал вес и сумел пошевелить губами. Но медицинские сотрудники не спешат делать поспешных выводов. Статский советник может вернуться к прежней жизни, но как поменяется он сам после выздоровления и возможно ли полное восстановление всех утраченных функций, никто сказать не может.',
		type: 'book',
		category: ['New Arrivals', 'Top Sellers']
		
	},
	{
		ISBN: '9785171088583',
		title: 'Огонь и агония',
		author: 'Веллер Михаил Иосифович',
		price: 19,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 416,
		hardCover: true,
		desc: 'Новая книга Михаила Веллера – ироничная по форме и скандальная по существу – о том, почему классика уродует сознание интеллигенции, как пили шампанское герои золотого периода советской культуры, где найти правду о войне и кто такой великий русский поэт Владимир Высоцкий.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171077662',
		title: 'Дети мои',
		author: 'Яхина Гузель Шамилевна',
		price: 24,
		year: 2018,
		publisher: 'Редакция Елены Шубиной',
		genre: '',
		pages: 496,
		hardCover: false,
		desc: '"Дети мои" — новый роман Гузель Яхиной, самой яркой дебютантки в истории российской литературы новейшего времени, лауреата премий "Большая книга" и "Ясная Поляна" за бестселлер "Зулейха открывает глаза". "В первом романе, стремительно прославившемся и через год после дебюта жившем уже в тридцати переводах и на верху мировых литературных премий, Гузель Яхина швырнула нас в Сибирь и при этом показала татарщину в себе, и в России, и, можно сказать, во всех нас. А теперь она погружает читателя в холодную волжскую воду, в волглый мох и торф, в зыбь и слизь, в Этель–Булгу–Су, и ее “мысль народная”, как Волга, глубока, и она прощупывает неметчину в себе, и в России, и, можно сказать, во всех нас. В сюжете вообще-то на первом плане любовь, смерть, и история, и политика, и война, и творчество..." Елена Костюкович Поволжье, 1920–1930-е годы. Якоб Бах – российский немец, учитель в колонии Гнаденталь. Он давно отвернулся от мира, растит единственную дочь Анче на уединенном хуторе и пишет волшебные сказки, которые чудесным и трагическим образом воплощаются в реальность. "Я хотела рассказать о мире немецкого Поволжья – ярком, самобытном, живом – о мире, когда-то созданном пришлыми людьми в чужой стране, а сегодня затерянном в прошлом. Но это еще и история о том, как большая любовь порождает страхи в нашем сердце и одновременно помогает их превозмочь"',
		type: 'book',
		category: ['New Arrivals', 'Top Sellers']
	},
	{
		ISBN: '9785171004200',
		title: 'Тобол. Много званых',
		author: 'Алексей Иванов',
		price: 22,
		year: 2016,
		publisher: 'АСТ',
		genre: '',
		pages: 702,
		hardCover: true,
		desc: 'В эпоху великих реформ Петра I «Россия молодая» закипела даже в дремучей Сибири. Нарождающаяся империя крушила в тайге воеводское средневековье. Народы и веры перемешались. Пленные шведы, бухарские купцы, офицеры и чиновники, каторжники, инородцы, летописцы и зодчие, китайские контрабандисты, беглые раскольники, шаманы, православные миссионеры и воинственные степняки джунгары – все они вместе, враждуя между собой или спасая друг друга, творили судьбу российской Азии. Эти обжигающие сюжеты Алексей Иванов сложил в роман-пеплум «Тобол». «Тобол. Много званых» – первая книга романа.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171005665',
		title: 'Вафли по-шпионски',
		author: 'Вильмонт Е.Н.',
		price: 13,
		year: 2017,
		publisher: 'АСТ',
		genre: '',
		pages: 320,
		hardCover: false,
		desc: 'Новый роман от признанного мастера современного женского романа!- История с продолжением!- "Книги Екатерины Вильмонт помогают жить и относиться ко многим вещам с юмором", - характеризуют ее творчество поклонники.Бобров помог Марте, не назвавшись, не спросив ее имени. Она при встрече не узнала его, а он не спешит напомнить ей о том случае. Однако судьба вновь и вновь сталкивает их и погружает в водоворот событий, в корне изменивших их жизнь.И вот тут Бобров вдруг поверил, что все правда и этому типу действительно кто-то заказал его жену. Он вытащил из бумажника купюру в пятьсот евро.- Вот, держи и рассказывай!Что же это значит? Неужели конец всему? - с тоской подумал Бобров. - А как удивительно и счастливо начиналась наша история...Об авторе:Екатерина Вильмонт - один из самых известных авторов современного женского романа. Екатерина Николаевна почти тридцать лет своей жизни посвятила переводам и, как признается, никогда не мечтала о писательской популярности, а за перо взялась случайно. Эксперимент удался. И теперь, из года в год, автор сохраняет уверенные позиции в ТОП-10 самых издаваемых, читаемых и известных в России писателей. Романы Вильмонт любят за динамичные, захватывающие сюжеты, простой и яркий язык."В своих книгах не надо ориентироваться на другого автора, на его стиль - я сама себе хозяйка. И какое счастье, что публике нравится читать то, что мне нравится писать!" Екатерина Вильмонт.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785040893942',
		title: 'iPhuck 10',
		author: 'Пелевин В.О.',
		price: 23,
		sale: 0,
		publisher: 'Эксмо',
		genre: '',
		pages: 416,
		hardCover: true,
		desc: 'Порфирий Петрович – литературно-полицейский алгоритм. Он расследует преступления и одновременно пишет об этом детективные романы, зарабатывая средства для Полицейского Управления. Маруха Чо – искусствовед с большими деньгами и баба с яйцами по официальному гендеру. Ее специальность – так называемый «гипс», искусство первой четверти XXI века. Ей нужен помощник для анализа рынка. Им становится взятый в аренду Порфирий. «iPhuck 10» – самый дорогой любовный гаджет на рынке и одновременно самый знаменитый из 244 детективов Порфирия Петровича. Это настоящий шедевр алгоритмической полицейской прозы конца века – энциклопедический роман о будущем любви, искусства и всего остального.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171016418',
		title: 'Дальше жить',
		author: 'Абгарян Наринэ Юрьевна',
		price: 17,
		year: 2017,
		publisher: 'АСТ',
		genre: '',
		pages: 256,
		hardCover: false,
		desc: 'Книга о тех, кто пережил войну. И тех, кто нет. «Писать о войне – словно разрушать в себе надежду. Словно смотреть смерти в лицо, стараясь не отводить взгляда. Ведь если отведешь – предашь самое себя. Я старалась, как могла. Не уверена, что у меня получилось. Жизнь справедливее смерти, в том и кроется ее несокрушимая правда. В это нужно обязательно верить, чтобы дальше – жить».',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785040924455',
		title: 'Самые родные, самые близкие',
		author: 'Метлицкая М.',
		price: 15,
		year: 2018,
		publisher: 'Эксмо',
		genre: '',
		pages: 384,
		hardCover: false,
		desc: 'Три девочки смотрят со старой фотографии: ситцевые сарафаны, пыльные ноги в разбитых сандалиях. Они веселы и беззаботны - так, как бывает лишь в детстве, когда еще не знаешь, что ждет впереди.<br>Годы летят быстро - и вот уже не очень молодая женщина разглядывает это фото, тоскуя по юности, по несбывшимся надеждам, по искренней дружбе, когда верили в горячие клятвы, когда не сомневались, что готовы друг за друга в огонь и в воду, когда ради любви совершали безумства, за которые расплачивались всю жизнь, а иногда - самой жизнью.<br>Каждая из трех девчонок на фото страстно мечтала о счастье. И все три по-своему распорядились своей судьбой, потому что счастье у каждого свое.',
		type: 'book',
		category: ['New Arrivals', 'Top Sellers']
	},
	{
		ISBN: '9785171076726',
		title: 'Про девушку, которая была бабушкой',
		author: 'Нестерова Наталья',
		price: 12,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 352,
		hardCover: false,
		desc: 'Однажды утром пенсионерка Александра Калинкина обнаружила, что чудесным образом помолодела почти на сорок лет! Теперь можно примерять модные платья, а не бесформенные балахоны, взыскать многолетний долг с работодателя и даже взглянуть в глаза бывшему мужу, который четверть века назад бросил ее одну с маленьким ребенком. Вскоре выясняется, что минусов у волшебного превращения не меньше, чем плюсов. Ни документов, ни семьи у юной Калинкиной больше нет, да и сама вторая молодость явно дана ей судьбой отнюдь не задаром и не навсегда. Нужно распорядиться ею правильно, а времени, чтобы найти верное решение, осталось в обрез…25,8*200',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785179826842',
		title: 'Тобол. Мало избранных',
		author: 'Иванов Алексей Викторович',
		price: 23,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 832,
		hardCover: false,
		desc: '«Тобол. Мало избранных» – вторая книга романа-пеплума Алексея Иванова «Тобол». Причудливые нити человеческих судеб, протянутые сквозь первую книгу романа, теперь завязались в узлы.<br>Реформы царя Петра перепахали Сибирь, и все, кто «были званы» в эти вольные края, поверяют: «избранны» ли они Сибирью? Беглые раскольники воздвигают свой огненный Корабль – но вознесутся ли в небо души тех, кто проклял себя на земле? Российские полки идут за золотом в далёкий азиатский город Яркенд – но одолеют ли они пространство степей и сопротивление джунгарских полчищ? Упрямый митрополит пробивается к священному идолу инородцев сквозь злой морок таёжного язычества. Тобольский зодчий по тайным знакам старины выручает из неволи того, кого всем сердцем ненавидит. Всемогущий сибирский губернатор оказывается в лапах государя, которому надо решить, что важнее: своя гордыня или интерес державы?<br>…Истории отдельных людей сплетаются в общую историю страны. А история страны движется силой яростной борьбы старого с новым. И её глубинная энергия – напряжение вечного спора Поэта и Царя.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785699964062',
		title: 'Бабий ветер',
		author: 'Д. Рубина',
		price: 19,
		year: 2017,
		publisher: 'Издательство "Э"',
		genre: '',
		pages: 352,
		hardCover: true,
		desc: 'В центре повествования этой, подчас шокирующей, резкой и болевой книги — Женщина. Героиня, в юности — парашютистка и пилот воздушного шара, пережив личную трагедию, вынуждена заняться совсем иным делом в другой стране, можно сказать, в зазеркалье: она косметолог, живет и работает в Нью-Йорке. Целая вереница странных персонажей проходит перед ее глазами, ибо по роду своей нынешней профессии героиня сталкивается с фантастическими, на сегодняшний день почти обыденными «гендерными перевертышами», с обескураживающими, а то и отталкивающими картинками жизни общества. И, как ни странно, из этой гирлянды, по выражению героини, «калек» вырастает гротесковый, трагический, ничтожный и высокий образ современной любви. «Эта повесть, в которой нет ни одного матерного слова, должна бы выйти под грифом 18+, а лучше 40+… — ибо все в ней настолько обнажено и беззащитно, цинично и пронзительно интимно, что во многих сценах краска стыда заливает лицо и плещется в сердце — растерянное человеческое сердце, во все времена отважно и упрямо мечтающее только об одном: о любви…»',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785699937851',
		title: 'Русская фантастика-2017. Том первый',
		author: 'Головачёв Василий Васильевич, Бессонов Алексей Игоревич, Дашков Андрей Георгиевич, Минаков Игорь Вал',
		price: 15,
		year: 2017,
		publisher: 'Издательство "Э"',
		genre: '',
		pages: 512,
		hardCover: true,
		desc: 'Бродячего кота прозвали Чумой, но Максим назвал его Рыжим, приютил, обогрел, накормил. И не прогадал! Вскоре выяснилось, что только кот Рыжий способен выручить человека из беды, в ситуации, находящейся явно за пределами человеческих возможностей… Мир слетел с катушек еще очень давно, но по-настоящему лишь восьмого июля 2054 года, когда африканские страны захлестнул огонь протестов и революций, низвергнув и без того неспокойный континент в пучину хаоса и ярости, да так, что границы размыло и народы смешались. Но, как выяснил Томас О’Двайер, сотрудник одной из британских компаний, размыло не только государственные границы… Есть ли жизнь на Марсе, русский астроном Беляев всерьез не задумывался. Хотя петербуржскую публику начала ХХ века этот вопрос сильно интересовал. Пришлось Беляеву прочитать ряд популярных лекций на эту тему. Если бы он знал, чем для него это обернется… Василий Головачёв, Алексей Бессонов, Ярослав Веров, Игорь Минаков и другие звезды отечественной фантастики в традиционном ежегодном сборнике «Русская фантастика»!',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785699908615',
		title: 'Погребенный великан',
		author: 'Кадзуо Исигуро',
		price: 17,
		year: 2017,
		publisher: 'Издательство "Э"',
		genre: '',
		pages: 416,
		hardCover: true,
		desc: 'Каждое произведение Кадзуо Исигуро — событие в мировой литературе. Его романы переведены более чем на сорок языков. Тиражи книг «Остаток дня» и «Не отпускай меня» составили свыше миллиона экземпляров. «Погребенный великан» — роман необычный, завораживающий. Автор переносит нас в Средневековую Англию, когда бритты воевали с саксами, а землю окутывала хмарь, заставляющая забывать только что прожитый час так же быстро, как утро, прожитое много лет назад. Пожилая пара, Аксель и Беатриса, покидают свою деревушку и отправляются в полное опасностей путешествие — они хотят найти сына, которого не видели уже много лет. Исигуро рассказывает историю о памяти и забвении, о мести и войне, о любви и прощении. Но главное — о людях, о том, как все мы по большому счету одиноки.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171005986',
		title: 'Шпионы тоже лохи',
		author: 'Вильмонт Екатерина Николаевна',
		price: 13,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 320,
		hardCover: true,
		desc: 'Бобров и Марта по-прежнему вместе. Но это обстоятельство не дает покоя многим. Удастся ли доброжелателям разрушить их идеальный союз? Продолжение романа «Вафли по-шпионски»!',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785040903771',
		title: 'Джек Ричер, или Без второго имени',
		author: 'Ли Чайлд',
		price: 18,
		year: 2018,
		publisher: 'Эксмо',
		genre: '',
		pages: 384,
		hardCover: false,
		desc: 'Где бы ни появился этот крупный, угрожающего вида мужчина, всем бросается в глаза, но, когда нужно, он умеет быть совершенно незаметным. Человек этот не ищет неприятностей – те сами находят его; но он их не боится. Его никто не сможет найти, если он этого не захочет; но, когда нужно, он находится сам. Он – по-настоящему хороший парень, хотя большинство людей считает его плохим. Его зовут Ричер. Джек Ричер. И у него нет второго имени… В нашей библиотеке вы можете бесплатно почитать книгу « Джек Ричер, или Без второго имени ». Чтобы читать онлайн книгу « Джек Ричер, или Без второго имени » перейдите по указанной ссылке. Приятного Вам чтения.',
		type: 'book',
		category: ['New Arrivals', 'Top Sellers']
	},
	{
		ISBN: '9785751614522',
		title: 'Мой дикий сад',
		author: 'Шалев Меир',
		price: 24,
		year: 2018,
		publisher: 'Текст',
		genre: '',
		pages: 254,
		hardCover: true,
		desc: 'Новая книга давно полюбившегося русским читателям израильского писателя Меира Шалева - описание сада, который автор посадил собственными руками. Сад этот - "дикий", в нем есть только растения, созданные самой природой, а не выведенные искусственно.Это не книга советов садоводам, хотя и они здесь есть. Шалев словно разговаривает со своим садом, и читатель погружается в состояние, которое испытывает человек, оставивший позади суетливый грохочущий мир и погрузившийся в девственную природу. Эта простая на первый взгляд книга о диком саде, который возделывает увлеченный человек, оказывается глубоким размышлением о самом серьезном и важном - одиночестве и любви, радости и скорби, о нашем месте в мироздании.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171079659',
		title: 'Желтые розы для актрисы',
		author: 'Соболева Лариса Павловна',
		price: 13,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 384,
		hardCover: false,
		desc: 'Саша – актриса небольшого провинциального театра. Многие коллеги завидуют ее успехам на сцене, но для Саши это мелочи – она любит свою работу и в целом очень довольна жизнью.<br>Однажды у Саши появляется тайный поклонник, который регулярно присылает ей в подарок желтые розы. Не сразу замечает Саша, что цветы в букетах перевязаны траурной лентой, не сразу понимает, что это нехороший знак… И то, что казалось лишь странностями ее воздыхателя, превращается в страшный сон наяву.<br>Ей страшно находиться в театре, играть на сцене, ходить по улицам – отовсюду может прийти смерть. Саша пытается выяснить, кто присылает букеты, но тщетно. А что, если тот, кто желает ей зла, – человек из недалекого прошлого? Саша вспоминает о непростой ситуации, в которой когда-то находилась, и понимает, что отголоски тех событий могут привести ее прямо в руки убийце.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171090883',
		title: 'Крайон. Обретение счастья. Победа над страхами, тревогами, сомнениями',
		author: 'Шмидт Тамара',
		price: 15,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 256,
		hardCover: true,
		desc: 'Если вы держите в руках эту книгу — значит, тревоги и страхи волнуют вас. И самое главное — вы ищете пути освобождения от них.Крайон — величественная ангельская энергия, светлый Дух, безмерно любящий человечество, уже много лет с любовью дает нам необходимую информацию. Эта книга посланий Крайона посвящена самой актуальной сейчас проблеме — страху и его преодолению. Мы на пороге грандиозных перемен, и именно страх мешает перейти невидимую границу, отделяющую нас от нового светлого мира. Этот мир уже существует, его энергии уже здесь, на Земле! И лишь наши внутренние препятствия, из которых главное — страх, не позволяют нам понять и почувствовать, что они уже здесь, рядом, и готовы войти в нашу жизнь, как мы только разрешим это.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785389145399',
		title: 'Всё та же я. Цикл До встречи с тобой. Кн.3',
		author: 'Джоджо Мойес',
		price: 19,
		year: 2018,
		publisher: 'Азбука-Аттикус',
		genre: '',
		pages: 576,
		hardCover: true,
		desc: 'Луиза Кларк приезжает в Нью-Йорк, готовая начать новую жизнь. И попадает в другой мир, в чужой дом, полный секретов. Радужные мечты разбиваются о жестокую реальность, но Луиза со свойственным ей чувством юмора не унывает. Она твердо знает, что рано или поздно найдет способ обрести себя. А еще обязательно получит ответ на вопрос: кого же она на самом деле любит?..Впервые на русском языке!',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171092801',
		title: 'Очаг',
		author: 'Лукьяненко Сергей Васильевич, Холмогоров Валентин',
		price: 14,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 320,
		hardCover: true,
		desc: 'Каждая история когда-нибудь заканчивается. Бывшему командиру 16-й пограничной заставы по прозвищу Ударник предстоит решить непростую задачу: агенты Очага грозят катастрофой его родному миру, а времени, чтобы предотвратить ее, осталось совсем немного. Он должен преодолеть множество препятствий, проникнуть в самое логово врага, разгадать его планы, и, возможно, пожертвовать всем, чтобы добиться главной цели – спасти Землю от неминуемой гибели.Тогда у человечества появится шанс, единственный и последний шанс выжить.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785170974597',
		title: 'След лисицы на камнях',
		author: 'Михалкова Е.И. ',
		price: 14,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 384,
		hardCover: false,
		desc: 'Перед вами еще одно расследование Бабкина и Илюшина. Очередное дело, необычный клиент и преступление – более запутанное, чем когда-либо. Самое удивительное: заказчик и есть предполагаемый преступник, убийца. Однако для начала нужно понять, случилось ли убийство вообще… Или это чей-то хитрый замысел, чтобы подставить невиновного человека?<br>Самое сложное в этой детективной игре – найти жертву, которой, возможно, и не было. Расследование идет непросто. И каждый из детективов имеет на все собственную точку зрения. На этот раз Бабкин и Илюшин почти не соглашаются друг с другом и все время спорят. И если что-то произойдет, смогут ли они действовать поодиночке, находясь по разные стороны баррикад? Вполне возможно, это дело станет последним для дуэта Бабкина и Илюшина. Если только они не смогут прийти к единому решению…<br>Чем же закончится эта запутанная история? Кто за ней стоит? Купите, скачайте или читайте онлайн книгу «След лисицы на камнях» Елены Михалковой в сервисе электронных и аудиокниг ЛитРес, чтобы узнать правду.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171062644',
		title: 'Я признаюсь',
		author: 'Гавальда Анна ',
		price: 17,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 320,
		hardCover: false,
		desc: '"Я признаюсь" – сборник новелл популярной французской писательницы Анны Гавальда, автора бестселлеров "Просто вместе", "Мне бы хотелось, чтобы меня кто-нибудь где-нибудь ждал…", "Утешительная партия игры в петанк" и многих других. В книгу вошли пронзительные, искренние рассказы о простых людях и их жизнях. ',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785040938179',
		title: 'Девушка не нашего круга',
		author: 'Литвинова А.В., Литвинов С.В.',
		price: 14,
		year: 2018,
		publisher: 'Издательство "Э"',
		genre: '',
		pages: 352,
		hardCover: false,
		desc: 'Артём – популярный блогер. Он из хорошей московской семьи, красивый и обеспеченный. Настя – тоже красавица, но она провинциальная девчонка, да вдобавок к тому – воровка. Казалось, что может быть между ними общего? Однако между парнем и девушкой вспыхивает любовь. Та, что не знает преград, ничего не требует и всем готова пожертвовать. Чем может закончиться столь неравный союз? Над парой сгущаются тучи. Родители Артёма, представители высшего общества, твердо намерены помешать браку. В довершение всего по следу Насти уже идет полиция. Однако в прошлой жизни девушки имеется еще одна тайна – та, что может радикально поменять ситуацию…',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171081867',
		title: 'Союз радости и печали',
		author: 'Ахмадулина Белла Ахатовна ',
		price: 19,
		year: 2018,
		publisher: 'АСТ',
		genre: '',
		pages: 400,
		hardCover: true,
		desc: 'На протяжении многих лет Белла Ахмадулина писала литературные портреты людей, которые, как она говорила, "повлияли на ход и склад моей жизни". А среди них А. Ахматова, Б. Пастернак, П. Антокольский, Б. Окуджава, В. Набоков, Вен. Ерофеев, С. Довлатов, В. Высоцкий, А. Тышлер, М. Плисецкая… На страницах же этой книги не только современники поэта, но и его предшественники – А. Пушкин, М. Лермонтов, Ф. Тютчев, М. Цветаева. И о каждом, с кем была знакома или лишь мечтала иметь знакомство, Б. Ахмадулина рассказывает с восхищением и любовью, бесконечно радуясь тому, что природа одарила их уникальным талантом."Я из тех, кто считает дар другого человека даром всем нам и мне", – пишет она, щедро делясь с читателями воспоминаниями и размышлениями о чудесных встречах, незабываемых поездках, той уникальной культурной атмосфере, в которой она жила и которая сегодня перешла в вечность.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785040936373',
		title: 'Запасной выход из комы',
		author: 'Донцова Дарья ',
		price: 14,
		sale: 0,
		year: 2018,
		publisher: 'Эксмо',
		genre: '',
		pages: 320,
		hardCover: false,
		desc: 'Новая книга! Уже 12 лет подряд Дарья Донцова по данным опроса ВЦИОМ признается "Писателем года"В книгах Дарьи Донцовой все правда! Ее героиня отчасти списана с нее самой: кошки, собаки, дети, мужья… Ее хобби вязать и печь пироги, а между делом – придумывать преступления.Дарья Донцова• Лауреат премии "Писатель года"• Лауреат премии "Бестселлер года" (учреждена газетой "Книжное обозрение")• Лауреат премии Торгового дома "Библио-Глобус" в номинациях "Автор года" и "Имя года"• Лауреат ежегодного открытого конкурса "Книга года" (Министерства по делам печати, телерадиовещания и средств массовой коммуникации России) в номинации "Бестселлер года"• В честь Дарьи Донцовой заложена звезда на литературной Площади звезд в Москве на Страстном бульваре• В 2005 году Дарье Донцовой был вручен Орден Петра Великого 1-й степени с лентой за большой личный вклад и выдающиеся заслуги в области литературы• в 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017 годах по данным опросов ВЦИОМ признавалась "Писателем года"• в феврале 2009 года занесена Книгу Рекордов России как самый плодовитый автора детективных романов (100 детективов за 10 лет)Ну кто бы мог подумать, что путешествия во времени возможны?... Начальница особой детективной бригады Татьяна Сергеева во чтобы то ни стало должна разыскать свою исчезнувшую коллегу Лизу Трифонову. Та взялась за совершенно глухое дело, которое еще много лет назад зашло в тупик: загадочное похищение младенца. Татьяна уверенно шла по следам пропавшей, и вдруг… все провалилось во мрак глубокой комы. Сергеева очнулась в таинственной лечебнице, окруженная излишне-заботливым персоналом. Невероятно, но память у Татьяны словно ластиком стерли! Через распахнутое больничное окно она мило беседует со своей "свекровью Этти", напрочь позабыв, что та давно умерла. И Таню ничуть не смущает, что календарь на ресепшен клиники, датирован еще прошлым веком…',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785040927807',
		title: 'Венец демона',
		author: 'Роллинс Дж.',
		price: 21,
		year: 2018,
		publisher: 'Эксмо',
		genre: '',
		pages: 416,
		hardCover: false,
		desc: 'Оно обитает на далеком острове, где-то в океане. Оно древнее, как сама Земля. Оно уничтожило все вокруг себя – и бешено рвется в широкий мир. Оно – вселенское зло, уготовившее для людей мучительную, адскую гибель. Этот демон никогда не насытится – и никогда не остановится. Если его не остановить…',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785389147638',
		title: 'Север и Юг',
		author: 'Гаскелл Э.',
		price: 12,
		year: 2018,
		publisher: 'Азбука-Аттикус; Махаон',
		genre: '',
		pages: 480,
		hardCover: true,
		desc: 'Роман Элизабет Гаскелл "Север и Юг" – это история любви, рассказанная в лучших традициях викторианской литературы. Главная героиня, уроженка Южной Англии Маргарет Хейл, вынуждена переехать в северные промышленные районы. Впечатлительная девушка глубоко возмущена ужасными условиями, в которых живут рабочие, однако ее негодование против владельца фабрики Джона Торнтона невольно перерастает в нежное чувство. Героям на протяжении романа приходится преодолевать множество предрассудков, учиться более широко и полно видеть мир, не деля его на черное и белое, на север и юг, учиться доброте и человечности.',
		type: 'book',
		category: ['New Arrivals']
	},
	{
		ISBN: '9785171061500',
		title: 'Происхождение',
		author: 'Дэн Браун',
		price: 25,
		year: 2017,
		publisher: 'АСТ',
		genre: '',
		pages: 576,
		hardCover: true,
		desc: 'Роберт Лэнгдон прибывает в музей Гуггенхайма в Бильбао по приглашению друга и бывшего студента Эдмонда Кирша. Миллиардер и компьютерный гуру, он известен своими удивительными открытиями и предсказаниями. И этим вечером Кирш собирается «перевернуть все современные научные представления о мире», дав ответ на два главных вопроса, волнующих человечество на протяжении всей истории:<br>Откуда мы? Что нас ждет?<br>Однако прежде, чем Эдмонд успевает сделать заявление, роскошный прием превращается в хаос. Лэнгдону и директору музея, красавице Амбре Видаль, чудом удается бежать.<br>Теперь их путь лежит в Барселону, где Кирш оставил для своего учителя закодированный ключ к тайне, способной потрясти сами основы представлений человечества о себе. Тайне, которая была веками похоронена во тьме забвения. Тайне, которой, возможно, лучше бы никогда не увидеть света, – по крайней мере, так считают те, кто преследует Лэнгдона и Видаль и готов на все, чтобы помешать им раскрыть истину.',
		type: 'book',
		category: ['Top Sellers']
	},
	{
		ISBN: '608225',
		title: 'Ручка с женским именем, в бархатном мешочке',
		price: 10,
		desc: '- Анастасия<br>- Анна<br>- Валерия<br>- Дарья<br>- Екатерина<br>- Любовь<br>- Маргарита<br>- Мария<br>- Оксана<br>- Ольга<br>- Полина<br>- Юлия',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '608217',
		title: 'Ручка с мужским именем, в бархатном мешочке',
		price: 10,
		desc: '- Антон<br>- Артём<br>- Владислав<br>- Денис<br>- Илья<br>- Роман<br>- Максим<br>- Николай<br>- Олег<br>- Павел',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '1527397',
		title: 'Фляжка "Герб СССР"',
		price: 24,
		desc: '240 мл, красная',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '1129752',
		title: 'Фляжка с эмблемой "Двуглавый орёл"',
		price: 20,
		desc: '240 мл, чёрная',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '2058670',
		title: 'Скатерть "Доляна"',
		price: 25,
		desc: 'Полевые цветы 144x144 см, 100% хлопок, рогожка, 164 г/м2',
		type: 'textile',
		category: []
	},
	{
		ISBN: '2369719',
		title: 'Скатерть DomoVita',
		price: 25,
		desc: 'рис 4734-1, 110х150 см, п/лен 146 г/м',
		type: 'textile',
		category: []
	},
	{
		ISBN: '2369717',
		title: 'Скатерть DomoVita',
		price: 25,
		desc: 'рис 4734-3 110х150 см, п/лен 146 г/м',
		type: 'textile',
		category: []
	},
	{
		ISBN: '2369700',
		title: 'Скатерть DomoVita',
		price: 25,
		desc: 'рис 10432 110х150 см, п/лен 146 г/м',
		type: 'textile',
		category: []
	},
	{
		ISBN: '2998082',
		title: 'Палантин Этель "Нора"',
		price: 15,
		desc: '60х180 см, цвет зеленый, 100 % вискоза',
		type: 'clothes',
		category: []
	},
	{
		ISBN: '2998084',
		title: 'Палантин Этель "Нора"',
		price: 15,
		desc: '60х180 см, цвет коралловый, 100 % вискоза',
		type: 'clothes',
		category: []
	},
	//SOLD OUT
	{
		ISBN: '2582391',
		title: 'Комбинезон детский "Мармелад"',
		price: 0,
		desc: 'рост 50-56 см, цвет розовый 11401 _М',
		type: 'clothes',
		category: []
	},
	{
		ISBN: '2582405',
		title: 'Комбинезон детский "Карамелька"',
		price: 34,
		desc: 'рост 50-56 см, цвет голубой 11331 _М',
		type: 'clothes',
		category: []
	},
	{
		ISBN: '2582526',
		title: 'Комплект детский "Мишка в кармане"',
		price: 39,
		desc: 'рост 62-68 см,цвет голубой 10411 _М',
		type: 'clothes',
		category: []
	},
	// THERE IS A PINK ONE ALSO FOR 74-80cm
	{
		ISBN: '2582319',
		title: 'Жакет детский "Совята"',
		price: 29,
		desc: 'рост 62-68 см, цвет голубой 02405 _М',
		type: 'clothes',
		category: []
	},
	{
		ISBN: '603316',
		title: 'Бочонок',
		price: 65,
		size: '16х12cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '603318',
		title: 'Бочонок № 2 роспись',
		price: 20,
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '603317',
		title: 'Бочонок',
		price: 35,
		size: '9х8cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '2607800003545',
		title: 'Ваза "Первоцветы"',
		price: 25,
		size: '10x6cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '603370',
		title: 'Ваза "Фантазия"',
		price: 29,
		size: '12x7cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '2607800013124',
		title: 'Солонка "Престольная"',
		price: 32,
		size: '95x150cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '4606088000374',
		title: 'Русское Лото',
		price: 28,
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '4607070166610',
		title: 'Сахарница',
		price: 35,
		size: '11х12cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '4610007433013',
		title: 'Мягкая игрушка мишка из м/ф "Маша и медведь"',
		price: 45,
		manufacturer: 'Мульти-пульти',
		size: '',
		desc: 'озвуч. русс. чип в',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '4690590010808',
		title: 'Мягкая игрушка Маша из м/ф "Маша и медведь"',
		price: 39,
		manufacturer: 'Мульти-пульти',
		size: '29сm',
		desc: 'пласт. лицо',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '631877',
		title: 'Мягкая игрушка кот с сосисками из м/ф "Возвращение блудного попугая"',
		price: 29,
		manufacturer: 'Мульти-пульти',
		size: '',
		desc: '',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '4640001717505',
		title: 'Мягкая игрушка Буратино',
		price: 25,
		manufacturer: 'Мульти-пульти',
		size: '30cm',
		desc: 'озвуч. русс. чип в пак. ',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '4620002038632',
		title: 'Мягкая игрушка волк из м/ф "Ну, погоди!"',
		price: 29,
		manufacturer: 'Мульти-пульти',
		size: '',
		desc: 'озвуч. русс. чип в пак.',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '4640001711435',
		title: 'Мягкая игрушка Чебурашка',
		price: 29,
		manufacturer: 'Мульти-пульти',
		size: '',
		desc: 'пласт. мордочкой, озвуч. русс. чип в',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '4620005410138',
		title: 'Музыкальная игрушка неваляшка',
		price: 14,
		size: '12cm',
		desc: '',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '4620005410015',
		title: 'Музыкальная игрушка неваляшка',
		price: 14,
		size: '12cm',
		desc: '',
		type: 'toy',
		category: ['Toys']
	},
	{
		ISBN: '10000606',
		title: 'Матрёшка Семеновская',
		price: 23,
		desc: '5 pieces',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '10000607',
		title: 'Матрёшка Семеновская',
		price: 29,
		desc: '6 pieces',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '4603720129455',
		title: 'Часы "Весна" Хохлома',
		price: 120,
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '4607036495112',
		title: 'Кружка',
		price: 12,
		size: '7х6cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '4607036495150',
		title: 'Кружка',
		price: 15,
		size: '9х7.5cm',
		desc: '',
		type: 'souvenir',
		category: ['Souvenirs']
	},
	{
		ISBN: '9785938939455',
		title: 'Russian Cuisine',
		price: 49,
		year: 2015,
		publisher: 'Медный всадник',
		genre: '',
		pages: 240,
		hardCover: true,
		desc: 'The illustrated art book "Russian Cuisine" features the most characteristic dishes created by the Russians throughout their history. The detailed recipes and full-colour illustrations will introduce you to a wide range of national accomplishments in the art of cookery. The book enables you to create culinary masterpieces with your own hands anywhere on our planet.',
		type: 'book',
		category: ['English Books']
	},
	{
		ISBN: '9485938938670',
		title: "Pushkin's Fairy Tales",
		author: 'Alexander Pushkin',
		price: 49,
		year: 2016,
		publisher: 'Медный всадник',
		genre: '',
		pages: 152,
		hardCover: true,
		desc: "Alexander Pushkin (1799-1837) is a great Russian poet and novelist, the creator of modern literary Russian. A genius of poetry, he embodied Russian national consciousness and became the pride of his country. An important part of Pushkin's literary heritage is his fairy tales, which are based on Russian folklore. Pushkin's tales have always been a favourite subject matter for the painting school of Palekh, a famous old centre of icon-painting and lacquer miniature.",
		type: 'book',
		category: ['English Books']
	},
	{
		ISBN: '9785938933750',
		title: 'The Golden Ring',
		price: 45,
		year: 2007,
		genre: '',
		pages: 135,
		hardCover: true,
		desc: 'The “Golden Ring” is a tourist route running through a series of cities and towns in central Russia, which are remarkable for their ancient history and abundance of historical and cultural monuments. The area they occupy became the centre of Russia in the twelfth century.<br><br>Natural environment was a major significance in the emergence and flowering of the present-day “Golden Ring” area, which strikes even the present-day traveller’s imagination by a variety of its landscapes. Since time immemorial it has attracted people by the abundance of waterways, vast fields devoid of forests and having a fertile soil, large resources of building timber and deposits of so-called “white stone” – the beautiful architectural material called the “marble of ancient Russia”.<br><br>The cities of the “Golden Ring” grew to become the capitals of the principalities where religious life and arts were thriving. They were also important points on the trade routes between the North and the South, Europe and Asia. Many churches and fortified structures, swelling houses and trade buildings have survived to this day in the area. Museum collections preserve true masterpieces of icon-painting and applied arts, and the interiors of churches are decorated with magnificent frescoes. A visit to these places will enable tourists to form a fairly good idea of the specific mode of life and culture of ancient and present-day Russia.',
		type: 'book',
		category: ['English Books']
	},
	{
		ISBN: '9785938933033',
		title: 'Russian Tsars: The Rurikids, The Romanovs',
		author: 'Boris Antonov',
		price: 49,
		year: 2005,
		publisher: 'Медный всадник',
		genre: '',
		pages: 176,
		hardCover: true,
		desc: 'We know the names of the leaders of popular revolts, kings and khans, but we often know very little about the personalities of the Russian tsars. These men and women were exceptional in many ways. Bedsides ruling one of the greatest empires that the world has ever known, many were fascinating personalities in their own right. Not all of them were ideal rulers. Like all human beings, they had their own faults, passions, feelings and habits. The only difference is that private individuals control only their own fats or those of their friends and relatives. The personal whims of a sovereign, however, can have enormous consequences of the history of the entire nation and the fates of his or her subjects and their descendants. This helps to explain our fascination with the people who, for many centuries, ruled over the Russian lands.',
		type: 'book',
		category: ['English Books']
	}];
}]);
