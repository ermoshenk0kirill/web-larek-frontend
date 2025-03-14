# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка

```

interface ICard {
  title: string; // название
  description: string; // описание
  image: string; // картинка
  category: string; // категория
  price: number | null; // цена
  buttonText: boolean; // название кнопки
  id: string; // id карточки
}

```

Главная страница

```

interface ICardsData {
  cards: ICard[], // массив карточек
  setPreview(cardId: ICard): void; // метод показа превью
  getCard(id: string): ICard; // метод получения карточки по id
}

```

Данные пользователя

```
interface IOrderForm {
  email: string;
  phone: string;
  address: string;
  payment: string;
}

```

Корзина

```

export interface IBasketData {
  basketCards: IBasket[]; // массив карточек в корзине
  addCard(card: ICard): void; // добавить карточку в корзину
  removeCard(card: IBasket): void; // удалить карточку из корзины
  getCards(): IBasket[]; // получить карточки корзины
  getTotalPrice(): number; // получить цену корзины
  checkCard(card: IBasket): boolean; // проверка наличия карточки
  getCount(): number; // получить количество карточек
  getCardsId(): string[]; // получить массив карточек в корзине
  clearBasket(): void; // очистить корзину
}

```

Список карточек

```

interface IBasketView {
  items: HTMLElement[];
  total: string;
  itemsBasket: string[];
}

```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,

- слой данных, отвечает за хранение и изменение данных

- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер

- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

  

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие

- `emit` - инициализация события

- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

  

### Слой данных

#### Класс CardData

Класс за работу с карточками и списком карточек.\

В полях класса хранятся следующие данные:
 - protected _cards: ICard[]; // массив карточек 
 - protected _preview: string | null; // превью карточки
 - protected events: IEvents; // брокер событий

В классе используются следующие методы:

методы:
- set cards - устанавливает список карточек
- get cards - возвращает список карточек
- getCard - возвращает карточку по ее id
- setPreview - устанавливает превью карточки
- getPreview - возвращает превью карточки

////////////////////////////////////////////////////

#### Класс BasketData

Класс отвечает за хранение и логику работы с данными корзины.\

Конструктор класса принимает инстант брокера событий.\

В полях хранятся следующие данные:

- basketCards: IBasket[]; // список карточек в корзине
- events: IEvents; // брокер событий

В классе используются следующие методы:

- `addCard(card: ICard)`: добавляет карточку в корзину

- `removeCard(card: IBasket)`: удаляет карточку из корзины

- `getCards()`: возвращает массив карточек в корзине

- `getTotalPrice()`: возвращает общую стоимость корзины

- `checkCard(card: ICard)`: проверка наличия (есть такой товар в корзине или нет)

- `getCount`: возвращает количество товаров в корзине

- `getCardIds`: возвращает список id карточек в корзине

= `clearBasket`: полная очистка корзины



/////////////////////////////////////////////////////

#### Класс UserData

Класс отвечает за хранение и логику работы с данными пользователя.\

Конструктор класса принимает инстант брокера событий.\

В классе хранятся следующие данные:

  данные пользователя: 

- `order` - объект с данными пользователя (способ оплаты, номер телефона и т.д.)
- `events` - брокер событий


Класс использует следующие методы:

- `saveUsesetInputFieldrData`: сохранение данных пользователя (для каждого поля отдельно)

- `getUserInfo`: передача данных пользователя на сервер

- `validation`: валидация

- `clearUser`: очистка данных пользователя
  

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.


#### Класс Modal
Реализует модальное окно.\
Реализует методы:\
- `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.  \

- constructor(container: HTMLElement, protected events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна
- events: IEvents - брокер событий
- _closeButton: HTMLButtonElement - кнопка закрытия модального окна

#### Класс StartPage
Реализует страницу главного меню.\
Реализует поля:\
 - _wrapper: HTMLElement; // контейнер страницы
 - _basket: HTMLElement; // коризна
 - _counter: HTMLElement; // счетчик
 - _catalog: HTMLElement; // каталог 

Реализует методы:\
 - catalog(value: HTMLElement[]): установка каталога
 - setCounter(value: number): установка счетчика
 - locked(value: boolean): установка блокировки корзины

#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, изображения, катеогрии товара, цены и описания товара. Класс используется для отображения модального окна карточки на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы отвечают за установку данных в карточке.

#### Класс Basket 
Отвечает за отображение модального окна корзины покупок, возвращая массив выбранных товаров, кнопки удаления товаров из корзины и показывает общую сумму заказа. Класс используется для отображения модального окна корзины на странице сайта.
Поля:\
- `items: ICard[]` - массив карточек в корзине.\
- `total: number` - общая стоимость корзины.\
-  `button`: HTMLButtonElement - кнопка оформления заказа.
Методы:\
- `items(value: ICard[]): void` - установка массива карточек
- `total(value: number): void` - установка общей стоимости
- `clearBasket(): void` - очистка корзины\

#### Класс PaymentInfo
Отвечает за информацию о способе оплаты и адресе пользователя. Класс используется для отображения модального окна на странице сайта.
Поля:\
- `paymentMethod: string` - способ оплаты.\
- `address: string` - адрес пользователя.
Методы:\
- `payment(value: string): void` - установка способа оплаты
- `address(value: string): void` - установка адреса
- `clearAll(): void` - очистка полей
- `validation(): void` - валидация полей

#### Класс UserInfo
Отвечает за информацию о пользователе. Класс используется для отображения модального окна на странице сайта.
Поля:
 - phoneNumber: HTMLInputElement; // поле ввода номера телефона
 - _email: HTMLInputElement; // поле ввода почты

Методы:
- `phone(value: string): void` - установка номера телефона
- `email(value: string): void` - установка почты
- `clearAll(): void` - очистка полей
- `validateForm(): void` - валидация полей

#### Класс Form
Отвечает за валидацию полей формы. Класс используется для отображения модального окна на странице сайта.
Поля:\
- `valid: boolean` - флаг валидности формы
- `validateForm(): void` - валидация полей
- `clearForm(): void` - очистка полей
- `updateForm(): void` - обновление полей
- `render: (state: Partial<T> & IFormState)` => HTMLElement


#### Класс Successe
Отвечает за отображение модального окна с информацией о одобреннии заказа. Класс используется для отображения модального окна на странице сайта.
Поля:\
 - _total: HTMLElement; // элемент, содержащий общую сумму заказа
- _button: HTMLButtonElement; // кнопка закрытия модального окна

Методы:\
- `total(value: number): void` - установка общей суммы заказа


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*

1. События, связанные с модальными окнами:
- `modal:open` — Открытие любого модального окна (например, корзины, карточки, оформления заказа).
- `modal:close` — Закрытие модального окна.

2. События взаимодействия с карточками:
- `cards:render` — Просмотр полной информации о карточке товара.
- `card:open` — Открытие карточки товара.
- `card:loaded` — Загрузка карточки товара.
- `counter:update` — Обновление счетчика товаров в корзине.


3. События, связанные с корзиной:
- `basket:open` — Открытие корзины.
- `basket:add` — Добавление товара в корзину.
- `basket:remove` — Удаление товара из корзины.
- `basket:update` — Изменение количества товара в корзине.

- `order:open` - Открытие моадльного кона с адресо и способом оплаты товара
- `user:changed` - Обновление информации о пользователе
- `contacts:open` - Открытие модального окна с контактными данными пользователя(почта, телефон)
- `contacts:submit` - Оформление покупки
- `success:close` - Закрытие моадльного окна успешной покупки