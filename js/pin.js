"use strict";
(function () {
  const pinContainer = document.querySelector(`.map__pins`);

  const showPins = () => {
    if (document.querySelectorAll(`.map__pin`).length === 1) {
      const onError = (message) => {
        throw Error(message);
      };

      const onSuccess = (data) => {
        const rooms = data;
        const template = window.card.getTemplate(rooms);
        pinContainer.appendChild(template);
      };

      window.load(onSuccess, onError);
    }
  };
  window.pin = {
    showPins,
    pinContainer
  };

})();

