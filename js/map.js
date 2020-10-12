"use strict";

(function () {
  const map = document.querySelector(`.map`);

  const EventValue = {
    MOUSE_LEFT: 1,
    KEY_ENTER: `Enter`,
    KEY_ESCAPE: `Escape`,
    KEY_ESCAPE_ABBREVIATED: `Esc`
  };

  let card = null;

  const addPinEvent = (room, pinElement) => {
    pinElement.addEventListener(`click`, function (evt) {

      if (evt.target.classList.contains(`map__pin--main`)) {
        return;
      }

      showCard(room);
    });
  };

  const closeCard = () => {
    if (card !== null) {
      card.remove();
      card = null;
    }
  };

  const showCard = (pin) => {
    closeCard();
    card = window.card.getItemCard(pin);
    const mapFilter = document.querySelector(`.map__filters-container`);
    const mapFilterParent = mapFilter.parentNode;
    mapFilterParent.insertBefore(card, mapFilter);
    addCloseCardEvent();
  };

  const addCloseCardEvent = () => {
    const popupClose = card.querySelector(`.popup__close`);
    popupClose.addEventListener(`click`, function () {
      closeCard();
    });

    document.addEventListener(`keydown`, function (e) {
      if (e.key === EventValue.KEY_ESCAPE || e.key === EventValue.KEY_ESCAPE_ABBREVIATED) {
        e.preventDefault();
        closeCard();
      }
    });
  };

  window.map = {
    eventValue: EventValue,
    map,
    addPinEvent
  };

})();
