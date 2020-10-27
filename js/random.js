"use strict";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const getRandomArr = (constArr) => {
  const length = getRandomInt(constArr.length);
  let helpArr = constArr.slice(0);
  let newArr = [];
  while (newArr.length <= length) {
    const index = getRandomInt(helpArr.length);
    newArr.push(helpArr[index]);
    helpArr.splice(index, 1);
  }
  return newArr;
};

const getRandomElement = (arr) => {
  const rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

window.random = {
  getRandomInt,
  getRandomArr,
  getRandomElement
};
