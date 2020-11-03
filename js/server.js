'use strict';

const TIMEOUT_STATUS = 10000;

const StatusCode = {
  OK: 200,
  BAD: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

const XhrMethod = {
  GET: `GET`,
  POST: `POST`
};

const interact = (method, onSuccess, onError, data) => {
  let urlAddress = `https://21.javascript.pages.academy/keksobooking`;

  if (method === XhrMethod.GET) {
    urlAddress = `https://21.javascript.pages.academy/keksobooking/data`;
  }
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    let error = ``;

    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD:
        error = `Неверный запрос`;
        break;
      case StatusCode.UNAUTHORIZED:
        error = `Пользователь не авторизован`;
        break;
      case StatusCode.NOT_FOUND:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });

  xhr.timeout = TIMEOUT_STATUS;

  xhr.open(`${method}`, urlAddress);
  xhr.send(data);
};

window.server =  {
  interact,
  XhrMethod
};
