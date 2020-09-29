"use strict";

const ROOM_TYPE = [`palace`, `flat`, `house`, `bungalow`];
const ROOM_FEATURES = [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`];
const ROOM_PHOTOS = [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`];
const TIME = [`12:00`, `13:00`, `14:00`];
const MAP_WIDTH = 1200;
const MAP_HEIGHT = 704;
const PIN_WIDTH = 40;
const PIN_HEIGHT = 40;
const NUMBER_OF_ROOMS = 4;
const NUMBER_OF_GUESTS = 3;
const ROOMS_COUNT = 8;
const PRICE = 10000;

const map = document.querySelector(`.map`);
const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const pinContainer = document.querySelector(`.map__pins`);


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomArr(constArr) {
  const length = getRandomInt(constArr.length);
  let helpArr = constArr;
  let newArr = [];
  while (newArr.length <= length) {
    const index = getRandomInt(helpArr.length);
    newArr.push(helpArr[index]);
    helpArr.splice(index, 1);
  }
  return newArr;
}

function getRandomElement(arr) {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
}

function getRooms() {
  const rooms = [];
  for (let i = 1; i <= ROOMS_COUNT; i++) {
    const room = {
      author: {
        avatar: `img/avatars/user0${i}.png`
      },
      offer: {
        title: `Title${i}`,
        address: `${getRandomInt(MAP_WIDTH)}, ${getRandomInt(MAP_HEIGHT)}`,
        price: getRandomInt(PRICE),
        type: ROOM_TYPE[getRandomInt(ROOM_TYPE.length)],
        rooms: getRandomInt(NUMBER_OF_ROOMS),
        guests: getRandomInt(NUMBER_OF_GUESTS),
        checkin: `${getRandomElement(TIME)}`,
        checkout: `${getRandomElement(TIME)}`,
        features: getRandomArr(ROOM_FEATURES),
        description: `description${i}`,
        photos: getRandomArr(ROOM_PHOTOS)
      },
      location: {
        x: getRandomInt(map.offsetWidth - PIN_WIDTH),
        y: 130 + getRandomInt(500)
      }
    };
    rooms.push(room);
  }
  return rooms;
}

function getTemplate(rooms) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < rooms.length; i++) {
    const pinElement = pinTemplate.cloneNode(true);
    pinElement.setAttribute(`style`, `left: ${rooms[i].location.x - PIN_WIDTH / 2}px; top: ${rooms[i].location.y - PIN_HEIGHT}px`);
    pinElement.querySelector(`img`).src = rooms[i].author.avatar;
    pinElement.querySelector(`img`).alt = rooms[i].offer.title;
    fragment.appendChild(pinElement);
  }
  return fragment;
}

function showPins() {
  const rooms = getRooms();
  const template = getTemplate(rooms);
  pinContainer.appendChild(template);
}

function loadAd() {
  map.classList.remove(`map--faded`);
  showPins();
}

loadAd();
