"use strict";

const ROOM_TYPE = ['palace', 'flat', 'house', 'bungalow'];
const ROOM_FEATURES = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];
const ROOM_PHOTOS = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];
const MAP = document.querySelector(`.map`);
const PIN_TEMPLATE = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const PIN_WIDTH = 40;
const PIN_HEIGHT = 40;
const PIN_CONTAINER = document.querySelector(`.map__pins`);

let rooms = [];
let fragments = [];

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

function fillRoomsInfo() {
  for (let i = 1; i < 9; i++) {
    let room = {
      author: {
        avatar: `img/avatars/user0${i}.png`
      },
      offer: {
        title: `Title${i}`,
        address: `${getRandomInt(600)}, ${getRandomInt(350)}`,
        price: getRandomInt(10000),
        type: ROOM_TYPE[i % 4],
        rooms: getRandomInt(4),
        guests: getRandomInt(3),
        checkin: `${12 + getRandomInt(2)}+ :00`,
        checkout: `${12 + getRandomInt(2)}+ :00`,
        features: getRandomArr(ROOM_FEATURES),
        description: `description${i}`,
        photos: getRandomArr(ROOM_PHOTOS)
      },
      location: {
        x: getRandomInt(MAP.offsetWidth - 40),
        y: 130 + getRandomInt(500)
      }
    };
    rooms.push(room);
  }
}

function fillTemplate() {
  for (let i = 0; i < rooms.length; i++) {
    let fragment = PIN_TEMPLATE.cloneNode(true);
    fragment.setAttribute(`style`, `left: ${rooms[i].location.x + PIN_WIDTH / 2}px; top: ${rooms[i].location.y + PIN_HEIGHT / 2}px`);
    fragment.querySelector('img').src = rooms[i].author.avatar;
    fragment.querySelector('img').alt = rooms[i].offer.title;
    fragments.push(fragment);
  }
}

function showPins() {
  for (let i = 0; i < fragments.length; i++) {
    PIN_CONTAINER.appendChild(fragments[i]);
  }
}

function loadAd() {
  MAP.classList.remove(`map--faded`);
  fillRoomsInfo();
  fillTemplate();
  showPins();
}

loadAd();
