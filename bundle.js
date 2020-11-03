/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
(() => {
/*!********************!*\
  !*** ./js/load.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const URL_ADDRESS = ` https://21.javascript.pages.academy/keksobooking/data`;
const TIMEOUT_STATUS = 10000;

const StatusCode = {
  OK: 200,
  BAD: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

window.load = (onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    let error = ``;

    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD:
        error = `Неверный запрос`;
        break;
      case StatusCode.UNAUTHORIZED:
        error = `Пользователь не авторизован`;
        break;
      case StatusCode.NOT_FOUND:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });

  xhr.timeout = TIMEOUT_STATUS;

  xhr.open(`GET`, URL_ADDRESS);
  xhr.send();
};

})();

(() => {
/*!***************************!*\
  !*** ./js/customError.js ***!
  \***************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const body = document.querySelector(`body`);
const blockError = document.createElement(`div`);
const blockErrorText = document.createElement(`a`);

const show = () => {

  body.appendChild(blockError);

  blockError.style.display = `block`;
  blockError.style.width = `100%`;
  blockError.style.height = `100%`;
  blockError.style.position = `fixed`;
  blockError.style.zIndex = `100`;
  blockError.style.top = `0`;
  blockError.style.left = `0`;
  blockError.style.backgroundColor = `rgb(173, 168, 168, 0.5)`;

  blockErrorText.style.display = `inline-block`;
  blockErrorText.style.width = `550px`;
  blockErrorText.textContent = `Упс, произошла ошибка`;
  blockErrorText.style.fontSize = `xx-large`;

  blockError.appendChild(blockErrorText);

  hide();
};

const hide = () => {
  const onDocumentClick = (evt) => {
    if (evt.key === window.card.eventValue.KEY_ESCAPE || evt.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
      if (blockError) {
        evt.preventDefault();
        blockError.remove();
        document.removeEventListener(`keydown`, onDocumentClick);
      }
    }
  };

  document.addEventListener(`keydown`, onDocumentClick);
};

window.customError = {
  show
};

})();

(() => {
/*!************************!*\
  !*** ./js/debounce.js ***!
  \************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const DEBOUNCE_INTERVAL = 500;

window.debounce = (cb) => {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

})();

(() => {
/*!********************!*\
  !*** ./js/card.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


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


})();

(() => {
/*!**********************!*\
  !*** ./js/filter.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const MAX_LENGTH = 5;
const ANY_VALUE = `any`;

const mapFilters = document.querySelector(`.map__filters`);
const housingType = mapFilters.querySelector(`#housing-type`);
const housingPrice = mapFilters.querySelector(`#housing-price`);
const housingRooms = mapFilters.querySelector(`#housing-rooms`);
const housingGuests = mapFilters.querySelector(`#housing-guests`);
const housingFeatures = mapFilters.querySelector(`#housing-features`);
const featuresContent = housingFeatures.cloneNode(true);

let pins = [];

const pricesValueTranslate = {
  any: {
    min: Number.NEGATIVE_INFINITY,
    max: Number.POSITIVE_INFINITY
  },
  middle: {
    min: 10000,
    max: 50000
  },
  low: {
    min: Number.NEGATIVE_INFINITY,
    max: 10000
  },
  high: {
    min: 50000,
    max: Number.POSITIVE_INFINITY
  }
};

const FilterName = {
  TYPE: `housing-type`,
  GUESTS: `housing-guests`,
  ROOMS: `housing-rooms`,
  PRICE: `housing-price`,
  FEATURES: `features`
};

const Filter = {
  TYPE: `type`,
  PRICE: `price`,
  ROOMS: `rooms`,
  GUESTS: `guests`,
  FEATURES: `features`
};

const changeFilter = (evt) => {
  switch (evt.target.name) {
    case FilterName.TYPE:
    case FilterName.GUESTS:
    case FilterName.ROOMS:
    case FilterName.PRICE:
    case FilterName.FEATURES:
      window.pin.show(getFiltredPins(pins));
      break;
  }
};

const onChange = () => {
  mapFilters.addEventListener(`change`, window.debounce(changeFilter));
};

const getMatchPin = (pin, value, typeFilter) => {

  if (value === ANY_VALUE) {
    return true;
  }

  switch (typeFilter) {
    case Filter.TYPE:
      return pin.offer.type === value;
    case Filter.PRICE:
      return (pin.offer.price >= pricesValueTranslate[value].min && pin.offer.price < pricesValueTranslate[value].max);
    case Filter.ROOMS:
      return pin.offer.rooms === parseInt(value, 10);
    case Filter.GUESTS:
      return pin.offer.guests === parseInt(value, 10);
  }

  return false;
};

const checkMatchFeatures = (pin, features) => {

  if (!features.length) {
    return true;
  }

  return features.every((feature) => pin.offer.features.includes(feature));
};

const getArrayFeatures = () => {
  const features = housingFeatures.querySelectorAll(`input[type=checkbox]:checked`);
  return Array.from(features).map((feature) => feature.value);
};

const getIsPinAvaliable = (pin) => {
  return getMatchPin(pin, housingType.value, Filter.TYPE) &&
    getMatchPin(pin, housingPrice.value, Filter.PRICE) &&
    getMatchPin(pin, housingRooms.value, Filter.ROOMS) &&
    getMatchPin(pin, housingGuests.value, Filter.GUESTS) &&
    checkMatchFeatures(pin, getArrayFeatures());
};

const getFiltredPins = (pinsArray) => {
  window.card.hide();
  window.pin.clear();

  const result = [];

  for (let i = 0; i < pinsArray.length; i++) {
    const pin = pinsArray[i];

    const isPinAvaliable = getIsPinAvaliable(pin);

    if (isPinAvaliable) {
      result.push(pin);
    }


    if (result.length === MAX_LENGTH) {
      break;
    }
  }

  return result;
};

const setDefault = () => {
  mapFilters.reset();
};

const onLoadSuccess = (data) => {
  pins = data.slice();
  window.pin.show(getFiltredPins(pins));
};

const onLoadError = (error) => {
  window.customError.show();
  throw error;
};

const loadData = () => {
  window.load(onLoadSuccess, onLoadError);
};

window.filter = {
  loadData,
  mapFilters,
  housingFeatures,
  featuresContent,
  onChange,
  setDefault
};

})();

(() => {
/*!*******************!*\
  !*** ./js/map.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const map = document.querySelector(`.map`);

const filters = document.querySelectorAll(`.map__filter`);
const filterFeatures = document.querySelector(`.map__features`);

let isMapActive = false;

const getIsMapActive = () => {
  return isMapActive;
};

const changeDisabled = (elements) => {
  elements.forEach((filter) => {
    if (getIsMapActive()) {
      filter.removeAttribute(`disabled`);
    } else {
      filter.setAttribute(`disabled`, ``);
    }
  });
};

const changeDisabledItems = () => {
  changeDisabled(filters);
  changeDisabled([filterFeatures]);
  window.form.changeDisabled();
};

const activate = () => {
  window.moving.updateAddress();
  map.classList.remove(`map--faded`);
  window.form.changeMapActive();
  changeDisabledItems();
};

const getStateActive = () => {
  if (isMapActive) {
    return;
  }

  isMapActive = true;
  activate();
  window.filter.loadData();
};

const deactivate = () => {
  window.moving.updateAddress();
  map.classList.add(`map--faded`);
  window.form.changeMapActive();
  changeDisabledItems();
};

const getStateDeactive = () => {
  if (!isMapActive) {
    return;
  }

  isMapActive = false;
  deactivate();
};

window.map = {
  changeDisabledItems,
  getIsMapActive,
  getStateActive,
  getStateDeactive
};

})();

(() => {
/*!*******************!*\
  !*** ./js/pin.js ***!
  \*******************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


let pins = [];

const PinSize = {
  PIN_WIDTH: 40,
  PIN_HEIGHT: 40
};

const pinContainer = document.querySelector(`.map__pins`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

const addPinEvent = (room, pinElement) => {
  pinElement.addEventListener(`click`, (evt) => {
    if (evt.target.classList.contains(`map__pin--main`)) {
      return;
    }

    window.card.show(room);
  });
};

const getElement = (room) => {
  const {
    location: {
      x,
      y
    },
    author: {
      avatar
    },
    offer: {
      title
    }
  } = room;
  const pinElement = pinTemplate.cloneNode(true);
  pinElement.setAttribute(`style`, `left: ${x - PinSize.PIN_WIDTH / 2}px; top: ${y - PinSize.PIN_HEIGHT}px`);
  pinElement.querySelector(`img`).src = avatar;
  pinElement.querySelector(`img`).alt = title;

  return pinElement;
};

const getElements = (rooms) => {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const pinElement = getElement(room);

    pins.push(pinElement);

    addPinEvent(room, pinElement);

    fragment.appendChild(pinElement);
  }
  return fragment;
};

const show = (data) => {
  pinContainer.appendChild(getElements(data));
};

const clear = () => {
  pins.forEach((pin) => {
    pin.remove();
  });

  pins = [];
};


window.pin = {
  show,
  clear
};

})();

(() => {
/*!**********************!*\
  !*** ./js/upload.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const URL_ADDRESS = `https://21.javascript.pages.academy/keksobooking`;
const TIMEOUT_STATUS = 10000;

const StatusCode = {
  OK: 200,
  BAD: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

window.upload = (data, onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    let error = ``;

    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD:
        error = `Неверный запрос`;
        break;
      case StatusCode.UNAUTHORIZED:
        error = `Пользователь не авторизован`;
        break;
      case StatusCode.NOT_FOUND:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });

  xhr.timeout = TIMEOUT_STATUS;

  xhr.open(`POST`, URL_ADDRESS);
  xhr.send(data);
};

})();

(() => {
/*!********************!*\
  !*** ./js/form.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const filling = document.querySelector(`.ad-form`);
const formFieldset = filling.querySelectorAll(`fieldset`);
const formReset = filling.querySelector(`.ad-form__reset`);
const formMessageOk = document.querySelector(`#success`).content.querySelector(`.success`);
const formMessageError = document.querySelector(`#error`).content.querySelector(`.error`);
const main = document.querySelector(`main`);

const FormValue = {
  MIN_TITLE_LENGTH: 30,
  MAX_TITLE_LENGTH: 100
};

const RoomValue = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  HUNDRED: 100
};

const CapacityValue = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  NOT_GUESTS: 0
};

const PriceValue = {
  ZERO: 0,
  ONE_THOUSAND: 1000,
  FIVE_THOUSAND: 5000,
  TEN_THOUSAND: 10000,
  MORE: 1000000
};

const typePriceValue = {
  [window.card.roomType.FLAT]: PriceValue.ONE_THOUSAND,
  [window.card.roomType.BUNGALOW]: PriceValue.ZERO,
  [window.card.roomType.HOUSE]: PriceValue.FIVE_THOUSAND,
  [window.card.roomType.PALACE]: PriceValue.TEN_THOUSAND,
};

const roomCapacityValues = {
  [RoomValue.ONE]: [CapacityValue.ONE],
  [RoomValue.TWO]: [CapacityValue.ONE, CapacityValue.TWO],
  [RoomValue.THREE]: [CapacityValue.ONE, CapacityValue.TWO, CapacityValue.THREE],
  [RoomValue.HUNDRED]: [CapacityValue.NOT_GUESTS],
};

const changeMapActive = () => {
  filling.classList.add(`ad-form--disabled`);

  if (window.map.getIsMapActive()) {
    filling.classList.remove(`ad-form--disabled`);
  }
};

const setAddress = (valueX, valueY) => {
  document.querySelector(`#address`).value = `${Math.floor(valueX)}, ${Math.floor(valueY)}`;
};

const isRoomValid = (roomValue, capacityValue) => {
  return roomCapacityValues[roomValue].includes(capacityValue);
};

const verifyRoom = (roomElement, capacityElement) => {
  let message = ``;

  const roomValue = parseInt(roomElement.value, 10);
  const capacityValue = parseInt(capacityElement.value, 10);

  if (!isRoomValid(roomValue, capacityValue)) {
    message = `Неверное кол-во гостей`;
  }

  roomElement.setCustomValidity(message);
  filling.reportValidity();
};

const verifyTitle = (element) => {
  element.addEventListener(`invalid`, () => {
    if (element.validity.valueMissing) {
      element.setCustomValidity(`Обязательное поле`);
    } else {
      element.setCustomValidity(``);
    }
  });

  element.addEventListener(`input`, () => {
    const valueLength = element.value.length;

    if (valueLength < FormValue.MIN_TITLE_LENGTH) {
      element.setCustomValidity(`Ещё ${FormValue.MIN_TITLE_LENGTH - valueLength} симв.`);
    } else if (valueLength > FormValue.MAX_TITLE_LENGTH) {
      element.setCustomValidity(`Удалите лишние ${valueLength - FormValue.MAX_TITLE_LENGTH} симв.`);
    } else {
      element.setCustomValidity(``);
    }
  });
  filling.reportValidity();
};

const verifyType = (typeElement, priceElement) => {
  let message = ``;

  const priceValue = parseInt(priceElement.value, 10);
  let dictionaryVar = typeElement.value.toUpperCase();

  const isPriceValid = (typeValuePrice, price) => {
    return price >= typeValuePrice;
  };

  if (!isPriceValid(typePriceValue[window.card.roomType[dictionaryVar]], priceValue)) {
    message = `Ожидалась цена выше ${typePriceValue[window.card.roomType[dictionaryVar]]}`;
  }

  if (priceElement.value > PriceValue.MORE) {
    message = `Максимальная цена за жилье 100000 (1 миллион)`;
  } else if (priceElement.value < PriceValue.ZERO) {
    message = `Ожидалась положительная цена`;
  }

  priceElement.setCustomValidity(message);
  filling.reportValidity();
};

const changePlaceholder = (typeElement, priceElement) => {
  const placeholder = typePriceValue[window.card.roomType[typeElement.value.toUpperCase()]];
  priceElement.placeholder = placeholder;
};

const syncTime = (firstTime, secondTime) => {
  secondTime.value = firstTime.value;
  filling.reportValidity();
};

const changeDisabled = () => {
  formFieldset.forEach((filter) => {
    if (window.map.getIsMapActive()) {
      filter.removeAttribute(`disabled`);
    } else {
      filter.setAttribute(`disabled`, ``);
    }
  });
};

const addFormValidation = () => {
  const roomElement = filling.querySelector(`#room_number`);
  const capacityElement = filling.querySelector(`#capacity`);
  const titleElement = filling.querySelector(`#title`);
  const typeElement = filling.querySelector(`#type`);
  const priceElement = filling.querySelector(`#price`);
  const addressElement = filling.querySelector(`#address`);
  addressElement.setAttribute(`readonly`, ``);
  const timeInElement = filling.querySelector(`#timein`);
  const timeOutElement = filling.querySelector(`#timeout`);
  verifyTitle(titleElement);
  changePlaceholder(typeElement, priceElement);
  verifyRoom(roomElement, capacityElement);

  filling.addEventListener(`change`, (evt) => {
    switch (evt.target.id) {
      case roomElement.id:
        verifyRoom(roomElement, capacityElement);
        break;
      case capacityElement.id:
        verifyRoom(roomElement, capacityElement);
        break;
      case priceElement.id:
        verifyType(typeElement, priceElement);
        break;
      case typeElement.id:
        verifyType(typeElement, priceElement);
        changePlaceholder(typeElement, priceElement);
        break;
      case timeInElement.id:
        syncTime(timeInElement, timeOutElement);
        break;
      case timeOutElement.id:
        syncTime(timeOutElement, timeInElement);
        break;
    }
  });
};

const showMessage = (message) => {
  main.appendChild(message);
};

const removePopupOk = () => {
  if (formMessageOk) {
    const onDocumentKeyDown = (evt) => {
      evt.preventDefault();
      if (evt.key === window.card.eventValue.KEY_ESCAPE || evt.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
        main.removeChild(formMessageOk);
        document.removeEventListener(`keydown`, onDocumentKeyDown);
        document.removeEventListener(`click`, onDocumentClick);
      }
    };

    const onDocumentClick = (evt) => {
      evt.preventDefault();
      if (evt.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageOk);
        document.removeEventListener(`click`, onDocumentClick);
        document.removeEventListener(`keydown`, onDocumentKeyDown);
      }
    };

    document.addEventListener(`keydown`, onDocumentKeyDown);
    document.addEventListener(`click`, onDocumentClick);
  }
};

const removePopupError = () => {
  const errorButton = document.querySelector(`.error__button`);
  if (formMessageError) {
    const onDocumentKeyDown = (evt) => {
      evt.preventDefault();
      if (evt.key === window.card.eventValue.KEY_ESCAPE || evt.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
        main.removeChild(formMessageError);
        document.removeEventListener(`keydown`, onDocumentKeyDown);
        document.removeEventListener(`click`, onDocumentClick);
        errorButton.removeEventListener(`mousedown`, onButtonMouseDown);
      }
    };

    const onDocumentClick = (evt) => {
      evt.preventDefault();
      if (evt.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageError);
        document.removeEventListener(`keydown`, onDocumentKeyDown);
        document.removeEventListener(`click`, onDocumentClick);
        errorButton.removeEventListener(`mousedown`, onButtonMouseDown);
      }
    };

    const onButtonMouseDown = (evt) => {
      evt.preventDefault();
      if (evt.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageError);
        document.removeEventListener(`keydown`, onDocumentKeyDown);
        document.removeEventListener(`click`, onDocumentClick);
        errorButton.removeEventListener(`mousedown`, onButtonMouseDown);
      }
    };

    document.addEventListener(`keydown`, onDocumentKeyDown);
    document.addEventListener(`click`, onDocumentClick);
    errorButton.addEventListener(`mousedown`, onButtonMouseDown);
  }
};

const onLoadError = (error) => {
  showMessage(formMessageError);
  removePopupError();
  throw error;
};

const setDefault = () => {
  window.pin.clear();
  window.map.getStateDeactive();
  window.card.hide();
  filling.reset();
  window.form.addFormValidation();
  window.filter.setDefault();
  window.moving.setDefaultAddress();
  window.photo.setDefault();
};

const onLoadSuccess = () => {
  setDefault();
  showMessage(formMessageOk);
  removePopupOk();
};

filling.addEventListener(`submit`, (evt) => {
  evt.preventDefault();

  window.upload(new FormData(filling), onLoadSuccess, onLoadError);
});

formReset.addEventListener(`click`, () => {
  setDefault();
});

window.form = {
  setAddress,
  changeMapActive,
  formFieldset,
  addFormValidation,
  changeDisabled
};

})();

(() => {
/*!*********************!*\
  !*** ./js/photo.js ***!
  \*********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const DEFAULT_SRC = `img/muffin-grey.svg`;

const fileChooserPin = document.querySelector(`.ad-form__field input[type=file]`);
const previewPin = document.querySelector(`.ad-form-header__preview img`);
const fileChooserAd = document.querySelector(`.ad-form__upload input[type=file]`);
const previewAd = document.querySelector(`.ad-form__photo`);

const onChange = () => {
  fileChooserPin.addEventListener(`change`, () => {
    const file = fileChooserPin.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        previewPin.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  fileChooserAd.addEventListener(`change`, () => {
    const file = fileChooserAd.files[0];
    const fileName = file.name.toLowerCase();
    const fileImgage = document.createElement(`img`);

    fileImgage.width = `70`;
    fileImgage.height = `70`;
    fileImgage.alt = `Фотография жилья`;
    previewAd.appendChild(fileImgage);

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        fileImgage.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
};

const setDefault = () => {
  previewPin.src = `${DEFAULT_SRC}`;
  previewPin.alt = ``;
  previewAd.innerHTML = ``;
};

window.photo = {
  onChange,
  setDefault
};

})();

(() => {
/*!**********************!*\
  !*** ./js/moving.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


const mapPinMain = document.querySelector(`.map__pin--main`);

const MainPinSize = {
  MAIN_PIN_WIDTH: 65,
  MAIN_PIN_HEIGHT: 65,
  MAIN_PIN_NEEDLE: 22
};

const RestrictionCoords = {
  MIN_CORD_Y: 130,
  MAX_CORD_Y: 630,
  MIN_CORD_X: 0,
  MAX_CORD_X: 1201
};

const InitialValuesPinAddress = {
  LEFT: 570,
  TOP: 375
};

const addMainPinEvent = () => {

  mapPinMain.addEventListener(`mousedown`, (evt) => {
    evt.preventDefault();

    if (evt.which === window.card.eventValue.MOUSE_LEFT) {
      window.map.getStateActive();
    }

    let startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();

      const shift = {
        x: startCoords.x - moveEvent.clientX,
        y: startCoords.y - moveEvent.clientY
      };

      startCoords = {
        x: moveEvent.clientX,
        y: moveEvent.clientY
      };

      const valueX = mapPinMain.offsetLeft - shift.x;
      const valueY = mapPinMain.offsetTop - shift.y;

      const address = getAddressValue(valueX, valueY);

      if (address.valueY >= RestrictionCoords.MIN_CORD_Y && address.valueY <= RestrictionCoords.MAX_CORD_Y && address.valueX >= RestrictionCoords.MIN_CORD_X && address.valueX <= RestrictionCoords.MAX_CORD_X) {
        mapPinMain.style.left = `${valueX}px`;
        mapPinMain.style.top = `${valueY}px`;
        updateAddress();
      }
    };

    const onMouseUp = (upEvent) => {
      upEvent.preventDefault();

      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  });

  mapPinMain.addEventListener(`keydown`, (evt) => {
    if (evt.key === window.card.eventValue.KEY_ENTER) {
      window.map.getStateActive();
    }
  });
};

const getAddressValue = (left, top) => {
  const valueX = left + MainPinSize.MAIN_PIN_WIDTH / 2;
  const valueY = top + (!window.map.getIsMapActive() ? MainPinSize.MAIN_PIN_HEIGHT / 2 : MainPinSize.MAIN_PIN_HEIGHT + MainPinSize.MAIN_PIN_NEEDLE);
  return {
    valueX,
    valueY
  };
};

const updateAddress = () => {
  const address = getAddressValue(mapPinMain.offsetLeft, mapPinMain.offsetTop);
  window.form.setAddress(address.valueX, address.valueY);
};

const setDefaultAddress = () => {
  mapPinMain.style.left = `${InitialValuesPinAddress.LEFT}px`;
  mapPinMain.style.top = `${InitialValuesPinAddress.TOP}px`;
  updateAddress();
};

const init = () => {
  updateAddress();
  addMainPinEvent();
};

window.moving = {
  init,
  updateAddress,
  setDefaultAddress
};

})();

(() => {
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */


window.moving.init();
window.filter.onChange();
window.map.changeDisabledItems();
window.form.addFormValidation();
window.photo.onChange();

})();

/******/ })()
;