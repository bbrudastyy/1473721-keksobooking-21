"use strict";
(function () {
  const pinContainer = document.querySelector(`.map__pins`);

  const showPins = () => {
    if (document.querySelectorAll(`.map__pin`).length === 1) {
      const rooms = getRooms();
      const template = getTemplate(rooms);
      pinContainer.appendChild(template);
    }
  };
})();

