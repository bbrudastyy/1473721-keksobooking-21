"use strict";
(function () {
  const pinContainer = document.querySelector(`.map__pins`);

  const showPins = () => {
    if (document.querySelectorAll(`.map__pin`).length === 1) {
      const rooms = window.data.getRooms();
      const template = window.card.getTemplate(rooms);
      pinContainer.appendChild(template);
    }
  };
  window.pin = {
    showPins,
    pinContainer
  };

})();

