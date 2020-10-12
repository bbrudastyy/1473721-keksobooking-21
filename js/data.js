"use strict";

(function () {
  const ROOM_TYPE = [`palace`, `flat`, `house`, `bungalow`];
  const ROOM_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
  const ROOM_PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
  const TIME = [`12:00`, `13:00`, `14:00`];
  const NUMBER_OF_ROOMS = 4;
  const NUMBER_OF_GUESTS = 3;
  const ROOMS_COUNT = 8;
  const PRICE = 10000;

  const MapSize = {
    MAP_WIDTH: 1200,
    MAP_HEIGHT: 704
  };

  const getRooms = () => {
    const rooms = [];
    for (let i = 1; i <= ROOMS_COUNT; i++) {
      const room = {
        author: {
          avatar: `img/avatars/user0${i}.png`
        },
        offer: {
          title: `Title${i}`,
          address: `${window.random.getRandomInt(MapSize.MAP_WIDTH)}, ${window.random.getRandomInt(MapSize.MAP_HEIGHT)}`,
          price: window.random.getRandomInt(PRICE),
          type: ROOM_TYPE[window.random.getRandomInt(ROOM_TYPE.length)],
          rooms: window.random.getRandomInt(NUMBER_OF_ROOMS) + 1,
          guests: window.random.getRandomInt(NUMBER_OF_GUESTS) + 1,
          checkin: `${window.random.getRandomElement(TIME)}`,
          checkout: `${window.random.getRandomElement(TIME)}`,
          features: window.random.getRandomArr(ROOM_FEATURES),
          description: `description${i}`,
          photos: window.random.getRandomArr(ROOM_PHOTOS)
        },
        location: {
          x: window.random.getRandomInt(window.map.map.offsetWidth - window.card.PinSize.PIN_WIDTH),
          y: 130 + window.random.getRandomInt(500)
        }
      };
      rooms.push(room);
    }
    return rooms;
  };

  window.data = {
    getRooms
  };

})();
