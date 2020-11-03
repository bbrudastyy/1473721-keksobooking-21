'use strict';

const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const cardPhotoTemplate = document.querySelector(`#card`).content.querySelector(`.popup__photo`);

const RoomType = {
  FLAT: `flat`,
  BUNGALOW: `bungalow`,
  HOUSE: `house`,
  PALACE: `palace`
};

const RoomTypeValue = {
  [RoomType.FLAT]: `Квартира`,
  [RoomType.BUNGALOW]: `Бунгало`,
  [RoomType.HOUSE]: `Дом`,
  [RoomType.PALACE]: `Дворец`
};

const EventValue = {
  MOUSE_LEFT: 1,
  KEY_ENTER: `Enter`,
  KEY_ESCAPE: `Escape`,
  KEY_ESCAPE_ABBREVIATED: `Esc`
};

let card = null;

const addEventCloseCard = (cardElement) => {

  const onCardElementClick = (evt) => {
    evt.preventDefault();
    hide();
    cardElement.querySelector(`.popup__close`).removeEventListener(`click`, onCardElementClick);
    document.removeEventListener(`keydown`, onDocumentKeyDown);
  };

  const onDocumentKeyDown = (evt) => {
    if (evt.key === EventValue.KEY_ESCAPE || evt.key === EventValue.KEY_ESCAPE_ABBREVIATED) {
      evt.preventDefault();
      hide();
      document.removeEventListener(`keydown`, onDocumentKeyDown);
      cardElement.querySelector(`.popup__close`).removeEventListener(`click`, onCardElementClick);
    }
  };

  cardElement.querySelector(`.popup__close`).addEventListener(`click`, onCardElementClick);
  document.addEventListener(`keydown`, onDocumentKeyDown);
};

const hide = () => {
  if (card !== null) {
    card.remove();
    card = null;
  }
};

const show = (pin) => {
  hide();
  card = getItemCard(pin);
  const mapFilter = document.querySelector(`.map__filters-container`);
  const mapFilterParent = mapFilter.parentNode;
  mapFilterParent.insertBefore(card, mapFilter);
  addEventCloseCard(card);
};

const renderFeatures = (container, features) => {
  if (!features.length) {
    container.remove();
    return;
  }

  container.innerHTML = ``;

  for (let i = 0; i < features.length; i++) {
    let element;
    element = document.createElement(`li`);
    element.className = `popup__feature popup__feature--${features[i]}`;
    container.appendChild(element);
  }
};

const renderPhotos = (container, photos) => {
  if (!photos.length) {
    container.remove();
    return;
  }

  container.removeChild(container.querySelector(`.popup__photo`));

  for (let i = 0; i < photos.length; i++) {
    let element;
    element = cardPhotoTemplate.cloneNode(true);
    element.src = photos[i];
    container.appendChild(element);
  }
};

const getItemCard = (room) => {

  const {
    author: {
      avatar
    },
    offer: {
      title,
      address,
      price,
      type,
      rooms,
      guests,
      checkin,
      checkout,
      description,
      features,
      photos
    },
  } = room;

  const cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector(`.popup__avatar`).src = avatar;
  cardElement.querySelector(`.popup__title`).textContent = title;
  cardElement.querySelector(`.popup__text--address`).textContent = address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = RoomTypeValue[type];
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${rooms} комнат для  ${guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
  cardElement.querySelector(`.popup__description`).textContent = description;
  renderFeatures(cardElement.querySelector(`.popup__features`), features);
  renderPhotos(cardElement.querySelector(`.popup__photos`), photos);

  return cardElement;
};

window.card = {
  roomType: RoomType,
  show,
  hide,
  eventValue: EventValue
};

