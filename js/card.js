"use strict";

(function () {
  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
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

  const PinSize = {
    PIN_WIDTH: 40,
    PIN_HEIGHT: 40
  };

  const getTemplate = (rooms) => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const pinElement = pinTemplate.cloneNode(true);

      window.map.addPinEvent(room, pinElement);

      pinElement.setAttribute(`style`, `left: ${room.location.x - PinSize.PIN_WIDTH / 2}px; top: ${room.location.y - PinSize.PIN_HEIGHT}px`);
      pinElement.querySelector(`img`).src = room.author.avatar;
      pinElement.querySelector(`img`).alt = room.offer.title;
      fragment.appendChild(pinElement);
    }
    return fragment;
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

    return cardElement;
  };

  window.card = {
    RoomType,
    getTemplate,
    getItemCard,
    PinSize
  };

})();
