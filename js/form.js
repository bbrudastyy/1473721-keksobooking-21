"use strict";

const fillingForm = document.querySelector(`.ad-form`);
const formFieldset = fillingForm.querySelectorAll(`fieldset`);
const formReset = fillingForm.querySelector(`.ad-form__reset`);
const formMessageOk = document.querySelector(`#success`).content.querySelector(`.success`);
const formMessageError = document.querySelector(`#error`).content.querySelector(`.error`);
const main = document.querySelector(`main`);
const body = document.querySelector(`body`);
const blockError = document.createElement(`div`);
const blockErrorText = document.createElement(`a`);

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

blockError.appendChild(blockErrorText);

blockError.style.display = `block`;
blockError.style.width = `100%`;
blockError.style.height = `100%`;
blockError.style.position = `absolute`;
blockError.style.zIndex = `100`;
blockError.style.top = `0`;
blockError.style.left = `0`;
blockError.style.backgroundColor = `rgb(173, 168, 168, 0.5)`;

blockErrorText.style.display = `inline-block`;
blockErrorText.style.width = `550px`;
blockErrorText.textContent = `Упс, произошла ошибка`;
blockErrorText.style.fontSize = `xx-large`;

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
  fillingForm.reportValidity();
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
  fillingForm.reportValidity();
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
  fillingForm.reportValidity();
};

const changePlaceholder = (typeElement, priceElement) => {
  const placeholder = typePriceValue[window.card.roomType[typeElement.value.toUpperCase()]];
  priceElement.placeholder = placeholder;
};

const syncTime = (firstTime, secondTime) => {
  secondTime.value = firstTime.value;
  fillingForm.reportValidity();
};

const changeDisabled = (elements) => {
  elements.forEach((filter) => {
    if (window.map.getIsMapActive()) {
      filter.removeAttribute(`disabled`);
    } else {
      filter.setAttribute(`disabled`, ``);
    }
  });
};

const addFormValidation = () => {
  const roomElement = fillingForm.querySelector(`#room_number`);
  const capacityElement = fillingForm.querySelector(`#capacity`);
  const titleElement = fillingForm.querySelector(`#title`);
  const typeElement = fillingForm.querySelector(`#type`);
  const priceElement = fillingForm.querySelector(`#price`);
  const addressElement = fillingForm.querySelector(`#address`);
  addressElement.setAttribute(`readonly`, ``);
  const timeInElement = fillingForm.querySelector(`#timein`);
  const timeOutElement = fillingForm.querySelector(`#timeout`);
  verifyTitle(titleElement);
  changePlaceholder(typeElement, priceElement);
  verifyRoom(roomElement, capacityElement);

  fillingForm.addEventListener(`change`, (evt) => {
    switch (evt.target.id) {
      case roomElement.id:
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
    const removePopupForKey = (evt) => {
      evt.preventDefault();
      if (evt.key === window.card.eventValue.KEY_ESCAPE || evt.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
        main.removeChild(formMessageOk);
        document.removeEventListener(`keydown`, removePopupForKey);
      }
    };

    const removePopupForClick = (evt) => {
      evt.preventDefault();
      if (evt.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageOk);
        document.removeEventListener(`click`, removePopupForClick);
      }
    };

    document.addEventListener(`keydown`, removePopupForKey);
    document.addEventListener(`click`, removePopupForClick);
  }
};

const removePopupError = () => {
  const errorButton = document.querySelector(`.error__button`);
  if (formMessageError) {
    const removePopupForKey = (evt) => {
      evt.preventDefault();
      if (evt.key === window.card.eventValue.KEY_ESCAPE || evt.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
        main.removeChild(formMessageError);
        document.removeEventListener(`keydown`, removePopupForKey);
      }
    };

    const removePopupForClick = (evt) => {
      evt.preventDefault();
      if (evt.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageError);
        document.removeEventListener(`click`, removePopupForClick);
      }
    };

    const removePopupForButtonClick = (evt) => {
      evt.preventDefault();
      if (evt.which === window.card.eventValue.MOUSE_LEFT) {
        main.removeChild(formMessageError);
        errorButton.removeEventListener(`mousedown`, removePopupForButtonClick);
      }
    };

    document.addEventListener(`keydown`, removePopupForKey);
    document.addEventListener(`click`, removePopupForClick);
    errorButton.addEventListener(`mousedown`, removePopupForButtonClick);
  }
};

const onLoadError = (error) => {
  setDefault();
  showMessage(formMessageError);
  removePopupError();
  body.appendChild(blockError);
  throw error;
};

const setDefault = () => {
  window.pin.clear();
  window.map.getStateDeactive();
  fillingForm.reset();
  window.filter.mapFilters.reset();
  window.filter.housingFeatures.reset();
  window.moving.setDefaultAddress();
};

const onLoadSuccess = () => {
  setDefault();
  showMessage(formMessageOk);
  removePopupOk();
};

fillingForm.addEventListener(`submit`, (evt) => {
  evt.preventDefault();

  window.upload(new FormData(fillingForm), onLoadSuccess, onLoadError);
});

formReset.addEventListener(`click`, () => {
  setDefault();
});

window.form = {
  setAddress,
  fillingForm,
  formFieldset,
  addFormValidation,
  changeDisabled
};
