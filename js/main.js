"use strict";

const ROOM_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const ROOM_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const ROOM_PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TIME = [`12:00`, `13:00`, `14:00`];
const NUMBER_OF_ROOMS = 4;
const NUMBER_OF_GUESTS = 3;
const ROOMS_COUNT = 8;
const PRICE = 10000;

const mapSize = {
  MAP_WIDTH: 1200,
  MAP_HEIGHT: 704
};

const pinSize = {
  PIN_WIDTH: 40,
  PIN_HEIGHT: 40,
  MAIN_PIN_WIDTH: 65,
  MAIN_PIN_HEIGHT: 65,
  MAIN_PIN_NEEDLE: 22
};

const roomType = {
  FLAT: `flat`,
  BUNGALOW: `bungalow`,
  HOUSE: `house`,
  PALACE: `palace`
};

const roomTypeValue = {
  [roomType.FLAT]: `Квартира`,
  [roomType.BUNGALOW]: `Бунгало`,
  [roomType.HOUSE]: `Дом`,
  [roomType.PALACE]: `Дворец`
};

const eventValue = {
  MOUSE_LEFT: 1,
  KEY_ENTER: `Enter`
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

const toggleDisabledAtribute = (element) => {
  if (element.length) {
    element.forEach((filter) => {
      filter.toggleAttribute(`disabled`);
    });
  } else {
    element.toggleAttribute(`disabled`);
  }
};

const fillingFunctiontoggle = () => {
  toggleDisabledAtribute(filters);
  toggleDisabledAtribute(filterFeatures);
  toggleDisabledAtribute(formFieldset);
};

const activeMap = () => {
  const mainAddress = document.querySelector(`#address`);
  map.classList.remove(`map--faded`);
  fillingForm.classList.remove(`ad-form--disabled`);
  fillingFunctiontoggle();
  mainAddress.value = `${mapPinMain.offsetLeft + pinSize.MAIN_PIN_WIDTH / 2},${mapPinMain.offsetTop + pinSize.MAIN_PIN_HEIGHT + pinSize.MAIN_PIN_NEEDLE}`;
};

mapPinMain.addEventListener(`mousedown`, function (e) {
  if (e.which === eventValue.MOUSE_LEFT) {
    activeMap();
    showPins();
  }
});

mapPinMain.addEventListener(`keydown`, function (e) {
  if (e.key === eventValue.KEY_ENTER) {
    activeMap();
    showPins();
  }
});

fillingForm.addEventListener(`change`, function (e) {
  const roomNumber = fillingForm.querySelector(`#room_number`);
  const capacity = fillingForm.querySelector(`#capacity`);
  switch (e.target.id) {
    case `room_number`:
      capacity.querySelectorAll(`option`).forEach(function (option) {
        option.removeAttribute(`selected`);
        option.setAttribute(`disabled`, `disabled`);

        if ((option.value <= roomNumber.value) && (option.value !== `0`)) {
          option.setAttribute(`selected`, `selected`);
          option.removeAttribute(`disabled`);
        } else if ((roomNumber.value === `100`) && (option.value === `0`)) {
          option.setAttribute(`selected`, `selected`);
          option.removeAttribute(`disabled`);
        }

      });
      break;
    case `capacity`:
      if (capacity.value > roomNumber.value) {
        capacity.setCustomValidity(`Ожидалось большее количество комнат`);
      }
  }
});

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
        address: `${getRandomInt(mapSize.MAP_WIDTH)}, ${getRandomInt(mapSize.MAP_HEIGHT)}`,
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
        x: getRandomInt(map.offsetWidth - pinSize.PIN_WIDTH),
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
    pinElement.setAttribute(`style`, `left: ${rooms[i].location.x - pinSize.PIN_WIDTH / 2}px; top: ${rooms[i].location.y - pinSize.PIN_HEIGHT}px`);
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
  cardElement.querySelector(`.popup__type`).textContent = roomTypeValue[room.offer.type];
  cardElement.querySelector(`.popup__text--capacity`).textContent = `${room.offer.rooms} комнат для  ${room.offer.guests} гостей`;
  cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${room.offer.checkin}, выезд до ${room.offer.checkout}`;
  cardElement.querySelector(`.popup__description`).textContent = room.offer.description;
  renderFeatures(cardElement.querySelector(`.popup__features`), room.offer.features);
  renderPhotos(cardElement.querySelector(`.popup__photos`), room.offer.photos);
  // return cardElement; в следующих заданиях убрать этот комментарий
};

const loadAd = () => {
  fillingFunctiontoggle();
  showCard();
};

loadAd();
