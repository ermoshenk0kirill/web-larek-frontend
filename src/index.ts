import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { CardData } from './components/model/CardData';
import { BasketData } from './components/model/BasketData';
import { UserData } from './components/model/UserData';
import { IUserData } from './types';

import { IApi } from './components/AppApi';
import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL, settings } from './utils/constants';

import { Card } from './components/view/Card';
import { StartPage } from './components/view/StartPage';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { PaymentInfo } from './components/view/PaymentInfo';
import { UserInfo } from './components/view/UserInfo';
import { Success } from './components/view/Success';
import {ICard} from "./types";
import {IEvents} from "./components/base/events";
import { ICardAction } from './types';
import { IBasket } from './types';
import {addIndexToCard} from "./utils/utils";

const events = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL, settings);

// шаблоны для представлений
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const gallery = new StartPage(document.querySelector('.gallery'), events);

//Модели данных
const cardData = new CardData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);

//
const page = new StartPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const payment = new PaymentInfo(cloneTemplate(paymentTemplate), events);
const user = new UserInfo(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);




// временно, отображение событий
events.onAll((event) => {
	console.log(event.eventName, event.data);
})

// получаем список карточек с сервера
api
	.getCardList()
	.then((cards) => {
		cardData.cards = cards; // Сохраняем в CardData
		events.emit('cards:loaded');
		console.log(cards)
	})
	.catch((error) => console.error('Ошибка загрузки карточек:', error));


	//рендеринг карточек товаров
	events.on('cards:render', () => {
		cardData.cards.forEach(item => {
			const card = new Card(cloneTemplate(cardTemplate), events)
			card.categoryValue = item.category;
			card.titleValue = item.title;
			card.descriptionValue = item.description;
			card.imageValue = item.image;
			card.priceValue = item.price;
			card.idValue = item.id;
			// Проверяем, есть ли карточка в корзине
			const isInBasket = basketData.checkCard({ id: item.id, title: item.title, price: item.price });
			card.updateButtonState(isInBasket); // Обновляем состояние кнопки
			ensureElement<HTMLElement>('.gallery').append(card.render(item));
		});
}
)

// если открыто модальное окно, то блокируем прокрутку страницы
events.on('modal:open', () => {
	page.locked = true;
})

// если модальное окно закрыто, то разблокируем прокрутку страницы
events.on('modal:close', () => {
	page.locked = false;
})




//---------------------------------------
// отправляем выбранную карточку в превью
events.on('card:open', (cardId: ICard) => {
	const card = cardData.getCard(cardId.id); // Находим карточку по id
	if (card) {
			console.log('выбрана карточка:', card);
			cardData.setPreview(card); // Передаем всю карточку
	} else {
			console.error('Карточка не найдена');
	}
});

events.on('preview:render', (card: ICard) => {
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
	
	cardPreview.titleValue = card.title;
	cardPreview.descriptionValue = card.description;
	cardPreview.imageValue = card.image;
	cardPreview.priceValue = card.price;
	cardPreview.categoryValue = card.category;
	
	console.log("Данные карточки для превью:", card);
	
	modal.render({ content: cardPreview.render(card) });
});





// Обработчик для открытия корзины
events.on('basket:open', () => {
	modal.render({ content: basket.render() });
	// events.emit('basket:update'); // Обновляем содержимое корзины
});

events.on('counter:update', () => {
	page.setCounter(basketData.getCount());
})

// Обработчик для добавления карточки в корзину
// Обработчик для добавления карточки в корзину
events.on('basket:add', (data: { id: string }) => {
	const card = cardData.getCard(data.id); // Ищем карточку по id
	if (card) {
			basketData.addCard(card); // Добавляем найденную карточку в корзину
			events.emit('basket:update');
			events.emit('counter:update');

			// Обновляем состояние кнопки у всех карточек
			cardData.cards.forEach(item => {
					const isInBasket = basketData.checkCard({ id: item.id, title: item.title, price: item.price });
					
					const cardInstance = new Card(cloneTemplate(cardTemplate), events);
					cardInstance.updateButtonState(isInBasket);
			});
	} else {
			console.error(`Карточка с id ${data.id} не найдена`);
	}
});

// Обработчик для удаления карточки из корзины
events.on('basket:remove', (card: ICard) => {
	basketData.removeCard(card);
	events.emit('basket:update'); // Обновляем корзину
	events.emit('counter:update');

	// Обновляем состояние кнопки у всех карточек
	cardData.cards.forEach(item => {
			const isInBasket = basketData.checkCard({ id: item.id, title: item.title, price: item.price });
			
			const cardInstance = new Card(cloneTemplate(cardTemplate), events);
			cardInstance.updateButtonState(isInBasket);
	});
});

	// Обработчик для обновления корзины
	events.on('basket:update', () => {
		const cards = basketData.getCards();
		const totalPrice = basketData.getTotalPrice();
	
		console.log('Текущие карточки в корзине:', cards); // Логируем текущие карточки
	
		// Рендерим карточки в корзине
		const basketItems = cards.map((card, index) => {
				const cardElement = new Card(cloneTemplate(cardBasketTemplate), events);
				cardElement.titleValue = card.title;
				cardElement.priceValue = card.price;
				cardElement.idValue = card.id;
	
				addIndexToCard(cardElement.container, index);

				return cardElement.render(card); // Возвращаем HTMLElement
		});
	
		basket.items = basketItems; // Устанавливаем элементы корзины
		basket.total = totalPrice; // Устанавливаем общую стоимость
	});