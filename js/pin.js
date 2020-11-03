'use strict';

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
