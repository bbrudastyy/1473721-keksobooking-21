"use strict";

const ROOM_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const ROOM_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const ROOM_PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TIME = [`12:00`, `13:00`, `14:00`];
const NUMBER_OF_ROOMS = 4;
const NUMBER_OF_GUESTS = 3;
const ROOMS_COUNT = 8;
const PRICE = 10000;

const MapSize = {
  MAP_WIDTH: 1200,
  MAP_HEIGHT: 704
};

const PinSize = {
  PIN_WIDTH: 40,
  PIN_HEIGHT: 40,
  MAIN_PIN_WIDTH: 65,
  MAIN_PIN_HEIGHT: 65,
  MAIN_PIN_NEEDLE: 22
};

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
  KEY_ENTER: `Enter`
};

const RoomValue = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  HUNDER: 100
};

const CapacityValue = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  NOT_GUESTS: 0
};

const roomCapacityValues = {
  [RoomValue.ONE]: [CapacityValue.ONE],
  [RoomValue.TWO]: [CapacityValue.ONE, CapacityValue.TWO],
  [RoomValue.THREE]: [CapacityValue.ONE, CapacityValue.TWO, CapacityValue.THREE],
  [RoomValue.HUNDER]: [CapacityValue.NOT_GUESTS],
};

const MapState = {
  ACTIVE: `active`,
  DISABLED: `disabled`
};

const map = document.querySelector(`.map`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const pinContainer = document.querySelector(`.map__pins`);
const cardTemplate = document.querySelector(`#card`).content.querySelector(`.popup`);
const cardPhotoTemplate = document.querySelector(`#card`).content.querySelector(`.popup__photo`);
const filters = document.querySelectorAll(`.map__filter`);
const filterFeatures = document.querySelector(`.map__features`);
const mapPinMain = document.querySelector(`.map__pin--main`);
const fillingForm = document.querySelector(`.ad-form`);
const formFieldset = fillingForm.querySelectorAll(`fieldset`);

const changeDisabled = (elements) => {
  elements.forEach((filter) => {
    filter.toggleAttribute(`disabled`);
  });
};

const changeDisabledItems = () => {
  changeDisabled(filters);
  changeDisabled([filterFeatures]);
  changeDisabled(formFieldset);
};

const activationMap = () => {
  map.classList.remove(`map--faded`);
  fillingForm.classList.remove(`ad-form--disabled`);
  changeDisabledItems();
  pinAddress(MapState.ACTIVE);
};

const pinAddress = (state) => {
  switch (state) {
    case MapState.ACTIVE:
      document.querySelector(`#address`).value = `${mapPinMain.offsetLeft + PinSize.MAIN_PIN_WIDTH / 2},${mapPinMain.offsetTop + PinSize.MAIN_PIN_HEIGHT + PinSize.MAIN_PIN_NEEDLE}`;
      break;
    case MapState.DISABLED:
      document.querySelector(`#address`).value = `${mapPinMain.offsetLeft + PinSize.MAIN_PIN_WIDTH / 2},${mapPinMain.offsetTop + PinSize.MAIN_PIN_HEIGHT}`;
      break;
  }
};

mapPinMain.addEventListener(`mousedown`, function (e) {
  if (e.which === EventValue.MOUSE_LEFT) {
    activationMap();
    showPins();
  }
});

mapPinMain.addEventListener(`keydown`, function (e) {
  if (e.key === EventValue.KEY_ENTER) {
    activationMap();
    showPins();
  }
});

const isRoomValid = (romValue, capacityValue) => {
  return roomCapacityValues[romValue].includes(capacityValue);
};

const validateRoom = (form, roomElement, capacityElement) => {
  let message = ``;

  const roomValue = parseInt(roomElement.value, 10);
  const capacityValue = parseInt(capacityElement.value, 10);

  if (!isRoomValid(roomValue, capacityValue)) {
    message = `Неверное кол-во гостей`;
  }

  roomElement.setCustomValidity(message);
  form.reportValidity();
};

const addFormValidation = () => {
  const roomElement = fillingForm.querySelector(`#room_number`);
  const capacityElement = fillingForm.querySelector(`#capacity`);

  fillingForm.addEventListener(`change`, function (e) {
    switch (e.target.id) {
      case roomElement.id:

        validateRoom(fillingForm, roomElement, capacityElement);

        break;
    }
  });
};

addFormValidation();

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomArr = (constArr) => {
  const length = getRandomInt(constArr.length);
  let helpArr = constArr.slice(0);
  let newArr = [];
  while (newArr.length <= length) {
    const index = getRandomInt(helpArr.length);
    newArr.push(helpArr[index]);
    helpArr.splice(index, 1);
  }
  return newArr;
};

const getRandomElement = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

const getRooms = () => {
  const rooms = [];
  for (let i = 1; i <= ROOMS_COUNT; i++) {
    const room = {
      author: {
        avatar: `img/avatars/user0${i}.png`
      },
      offer: {
        title: `Title${i}`,
        address: `${getRandomInt(MapSize.MAP_WIDTH)}, ${getRandomInt(MapSize.MAP_HEIGHT)}`,
        price: getRandomInt(PRICE),
        type: ROOM_TYPE[getRandomInt(ROOM_TYPE.length)],
        rooms: getRandomInt(NUMBER_OF_ROOMS) + 1,
        guests: getRandomInt(NUMBER_OF_GUESTS) + 1,
        checkin: `${getRandomElement(TIME)}`,
        checkout: `${getRandomElement(TIME)}`,
        features: getRandomArr(ROOM_FEATURES),
        description: `description${i}`,
        photos: getRandomArr(ROOM_PHOTOS)
      },
      location: {
        x: getRandomInt(map.offsetWidth - PinSize.PIN_WIDTH),
        y: 130 + getRandomInt(500)
      }
    };
    rooms.push(room);
  }
  return rooms;
};

const getTemplate = (rooms) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rooms.length; i++) {
    const pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute(`style`, `left: ${rooms[i].location.x - PinSize.PIN_WIDTH / 2}px; top: ${rooms[i].location.y - PinSize.PIN_HEIGHT}px`);
    pinElement.querySelector(`img`).src = rooms[i].author.avatar;
    pinElement.querySelector(`img`).alt = rooms[i].offer.title;
    fragment.appendChild(pinElement);
  }
  return fragment;
};

const showPins = () => {
  const rooms = getRooms();
  const template = getTemplate(rooms);
  pinContainer.appendChild(template);
};

const showCard = () => {
  const rooms = getRooms();
  const template = getItemCard(rooms[0]);
  const mapFilter = document.querySelector(`.map__filters-container`);
  const mapFilterParent = mapFilter.parentNode;
  mapFilterParent.insertBefore(template, mapFilter);
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

  const cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector(`.popup__avatar`).src = room.author.avatar;
  cardElement.querySelector(`.popup__title`).textContent = room.offer.title;
  cardElement.querySelector(`.popup__text--address`).textContent = room.offer.address;
  cardElement.querySelector(`.popup__text--price`).textContent = `${room.offer.price}₽/ночь`;
  cardElement.querySelector(`.popup__type`).textContent = RoomTypeValue[room.offer.type];
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${room.offer.rooms} комнат для  ${room.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${room.offer.checkin}, выезд до ${room.offer.checkout}`;
  cardElement.querySelector(`.popup__description`).textContent = room.offer.description;
  renderFeatures(cardElement.querySelector(`.popup__features`), room.offer.features);
  renderPhotos(cardElement.querySelector(`.popup__photos`), room.offer.photos);
  // return cardElement; в следующих заданиях убрать этот комментарий
};

const loadAd = () => {
  pinAddress(MapState.DISABLED);
  changeDisabledItems();
  showCard();
};

loadAd();
