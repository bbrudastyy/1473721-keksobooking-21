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

const XhrUrl = {
  LOAD: `https://21.javascript.pages.academy/keksobooking/data`,
  UPDATE: `https://21.javascript.pages.academy/keksobooking`
};

const getXhrInstance = (onSuccess, onError) => {
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

  return xhr;
};

const load = (onSuccess, onError) => {
  const xhr = getXhrInstance(onSuccess, onError);

  xhr.open(XhrMethod.GET, XhrUrl.LOAD);
  xhr.send();
}

const update = (onSuccess, onError, data) => {
  const xhr = getXhrInstance(onSuccess, onError);

  xhr.open(XhrMethod.POST, XhrUrl.UPDATE);
  xhr.send(data);
}

window.server = {
  load,
  update
};

