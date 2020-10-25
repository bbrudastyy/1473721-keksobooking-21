"use strict";
(function () {
  const fillingForm = document.querySelector(`.ad-form`);
  const formFieldset = fillingForm.querySelectorAll(`fieldset`);
  const formReset = fillingForm.querySelector(`.ad-form__reset`);
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

  const setAddress = (valueX, valueY) => {
    document.querySelector(`#address`).value = `${Math.floor(valueX)}, ${Math.floor(valueY)}`;
  };

  const isRoomValid = (roomValue, capacityValue) => {
    return roomCapacityValues[roomValue].includes(capacityValue);
  };

  const validateRoom = (roomElement, capacityElement) => {
    let message = ``;

    const roomValue = parseInt(roomElement.value, 10);
    const capacityValue = parseInt(capacityElement.value, 10);

    if (!isRoomValid(roomValue, capacityValue)) {
      message = `Неверное кол-во гостей`;
    }

    roomElement.setCustomValidity(message);
    fillingForm.reportValidity();
  };

  const validateTitle = (element) => {
    element.addEventListener(`invalid`, function () {
      if (element.validity.valueMissing) {
        element.setCustomValidity(`Обязательное поле`);
      } else {
        element.setCustomValidity(``);
      }
    });

    element.addEventListener(`input`, function () {
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

  const validateType = (typeElement, priceElement) => {
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
      // window.map.getIsMapActive() ? filter.removeAttribute(`disabled`) : filter.setAttribute(`disabled`, ``);
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
    validateTitle(titleElement);
    changePlaceholder(typeElement, priceElement);
    validateRoom(roomElement, capacityElement);

    fillingForm.addEventListener(`change`, function (e) {
      switch (e.target.id) {
        case roomElement.id:
          validateRoom(roomElement, capacityElement);
          break;
        case priceElement.id:
          validateType(typeElement, priceElement);
          break;
        case typeElement.id:
          validateType(typeElement, priceElement);
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
    document.addEventListener(`keydown`, function (e) {
      if (formMessageOk) {
        if (e.key === window.card.eventValue.KEY_ESCAPE || e.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
          e.preventDefault();
          main.removeChild(formMessageOk);
        }
      }
    });
  };

  const removePopupError = () => {
    const errorButton = document.querySelector(`.error__button`);
    if (formMessageError) {
      const remove = (e) => {
        e.preventDefault();
        if (e.key === window.card.eventValue.KEY_ESCAPE || e.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED || e.which === window.card.eventValue.MOUSE_LEFT) {
          main.removeChild(formMessageError);
          errorButton.removeEventListener(`mousedown`, remove);
          document.removeEventListener(`click`, remove);
          document.removeEventListener(`keydown`, remove);
        }
      };

      document.addEventListener(`keydown`, remove);
      errorButton.addEventListener(`mousedown`, remove);
      document.addEventListener(`click`, remove);
    }
  };

  const onError = (error) => {
    showMessage(formMessageError);
    removePopupError();
    throw error;
  };

  const setDefault = () => {
    window.pin.clear();
    window.map.deactivate();
    fillingForm.reset();
    window.moving.setDefaultAddress();
  };

  const onSuccess = () => {
    setDefault();
    showMessage(formMessageOk);
    removePopupOk();
  };

  fillingForm.addEventListener(`submit`, function (e) {
    e.preventDefault();

    window.upload(new FormData(fillingForm), onSuccess, onError);
  });

  formReset.addEventListener(`click`, function () {
    setDefault();
  });

  window.form = {
    setAddress,
    fillingForm,
    formFieldset,
    addFormValidation,
    changeDisabled
  };

})();
