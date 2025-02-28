import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { CardData } from './components/model/CardData';
import { BasketData } from './components/model/BasketData';
import { UserData } from './components/model/UserData';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Card } from './components/view/Card';
import { StartPage } from './components/view/StartPage';
import { cloneTemplate, ensureElement, addIndexToCard } from './utils/utils';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { PaymentInfo } from './components/view/PaymentInfo';
import { UserInfo } from './components/view/UserInfo';
import { Success } from './components/view/Success';
import { ICard, IOrderForm} from "./types";

const events = new EventEmitter();
const api = new AppApi(API_URL, CDN_URL, settings);

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardData = new CardData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);

const page = new StartPage(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const paymentInfo = new PaymentInfo(cloneTemplate(paymentTemplate), events);
const user = new UserInfo(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);
const renderedCards = new Map<string, Card>();

events.onAll((event) => {
	console.log(event.eventName, event.data);
})

// получаем список карточек с сервера
api
	.getCardList()
	.then((cards) => {
		cardData.cards = cards; // Сохраняем в CardData
		events.emit('cards:loaded');
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

events.on('card:open', (cardId: ICard) => {
	const card = cardData.getCard(cardId.id);
	if (card) {
			console.log('выбрана карточка:', card);
			cardData.setPreview(card);
}});

events.on('preview:render', (card: ICard) => {
	const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
	
	const isInBasket = basketData.getCards().some((item) => item.id === card.id);
	cardPreview.valid = !isInBasket;

	cardPreview.titleValue = card.title;
	cardPreview.descriptionValue = card.description;
	cardPreview.imageValue = card.image;
	cardPreview.priceValue = card.price;
	cardPreview.categoryValue = card.category;

	modal.render({ content: cardPreview.render(card) });
});

// Обработчик для открытия корзины
events.on('basket:open', () => {
	modal.render({ content: basket.render() });
});

events.on('counter:update', () => {
	page.setCounter(basketData.getCount());
})

// Добавление карточки в корзину
events.on('basket:add', (data: { id: string }) => {
    const card = cardData.getCard(data.id);
    if (card) {
        basketData.addCard(card);
        events.emit('basket:update');
        events.emit('counter:update');
        const renderedCard = renderedCards.get(data.id);
        if (renderedCard) {
            renderedCard.updateButtonName();
        }
    }
});

// Удаление карточки из корзины
events.on('basket:remove', (data: { id: string }) => {
    const card = cardData.getCard(data.id);
    if (card) {
        basketData.removeCard(card);
        events.emit('basket:update');
        events.emit('counter:update');
        const renderedCard = renderedCards.get(data.id);
        if (renderedCard) {
            renderedCard.updateButtonName();  // Меняем текст обратно
        }
    }
});

	// Обработчик для обновления корзины
events.on('basket:update', () => {
	const cards = basketData.getCards();
	const totalPrice = basketData.getTotalPrice();
	
	const basketItems = cards.map((card, index) => {
			const cardElement = new Card(cloneTemplate(cardBasketTemplate), events);
			cardElement.titleValue = card.title;
			cardElement.priceValue = card.price;
			cardElement.idValue = card.id;
	
			addIndexToCard(cardElement.container, index);

			return cardElement.render(card);
		});
	
		basket.items = basketItems;
		basket.total = totalPrice;
	});

events.on('order:open', () => {
	const { address: addressError, payment: paymentError } = userData.validation();
	const { address, payment } = userData.getUserInfo();
  modal.render({
      content: paymentInfo.render({
        address: userData.getUserInfo().address,
        payment: userData.getUserInfo().payment,
        valid: !(addressError || paymentError),
        errors: !(address || payment) ? '' : Object.values({paymentError, addressError}).filter(i => !!i).join('; ')
    })
  });
});


// Открыть форму заказа
events.on('contacts:open', () => {
  const { phone: phoneError, email: mailError } = userData.validation();
  const { phone, email } = userData.getUserInfo();
	modal.render({
      content: user.render({
        phone: userData.getUserInfo().phone,
        email: userData.getUserInfo().email,
        valid: !(phoneError && mailError),
        errors: !(phone && email) ? '' : Object.values({phoneError, mailError}).filter(i => !!i).join('; ')
    })
  });
})

// Изменилось состояние валидации формы
events.on('user:changed', (errors: Partial<IOrderForm>) => {
  const { address, payment, phone, email } = userData.validation();
  paymentInfo.valid = !(address || payment);
  paymentInfo.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
  paymentInfo.valid = !(phone || email);
  paymentInfo.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	userData.setInputField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
	userData.setInputField(data.field, data.value);
	user.validateForm();
});

events.on('contacts:submit', () => {
	let totalAmountFinall = 0
	const cardsInOrder: string[] = []
	basketData.basketCards.forEach((card) => cardsInOrder.push(card.id))
	api.orderLots({
			payment: userData.getUserInfo().payment,
			address: userData.getUserInfo().address,
			email: userData.getUserInfo().email,
			phone: userData.getUserInfo().phone,
			total: basketData.getTotalPrice(),
			items: cardsInOrder,
	})
			.then((answerOrder) => {
					totalAmountFinall = answerOrder.total
					modal.render({ content: success.render({ total: totalAmountFinall }) })
					basketData.clearBasket();
					paymentInfo.clearAll();
					user.clearAll();
					page.setCounter(basketData.basketCards.length);
					paymentInfo.clearForm();
					user.clearForm();
					basket.clearBasket();
			})
			.catch((err) => {
					console.log('Ошибка оформления заказа', err)
			})
})

events.on('success:close', () => {
	modal.close();
})