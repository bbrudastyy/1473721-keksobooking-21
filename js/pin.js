"use strict";
(function () {

  const PinSize = {
    PIN_WIDTH: 40,
    PIN_HEIGHT: 40
  };

  const pinContainer = document.querySelector(`.map__pins`);
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  const addPinEvent = (room, pinElement) => {
    pinElement.addEventListener(`click`, function (evt) {
      if (evt.target.classList.contains(`map__pin--main`)) {
        return;
      }

      window.card.show(room);
    });
  };

  const getPin = (room) => {
    const pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute(`style`, `left: ${room.location.x - PinSize.PIN_WIDTH / 2}px; top: ${room.location.y - PinSize.PIN_HEIGHT}px`);
    pinElement.querySelector(`img`).src = room.author.avatar;
    pinElement.querySelector(`img`).alt = room.offer.title;

    return pinElement;
  };

  const getPins = (rooms) => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const pinElement = getPin(room);

      addPinEvent(room, pinElement);

      fragment.appendChild(pinElement);
    }
    return fragment;
  };

  const show = () => {
    if (document.querySelectorAll(`.map__pin`).length === 1) {
      const onError = (message) => {
        throw Error(message);
      };

      const onSuccess = (data) => {
        pinContainer.appendChild(getPins(data));
      };

      window.load(onSuccess, onError);
    }
  };

  const close = () => {
    const pins = document.querySelectorAll(`.map__pin`);
    const main = document.querySelector(`.map__pin--main`);
    pins.forEach((pin) => {
      pinContainer.removeChild(pin);
    });
    pinContainer.appendChild(main);
  };


  window.pin = {
    show,
    close,
    pinContainer
  };

})();

