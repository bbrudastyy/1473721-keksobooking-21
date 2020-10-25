"use strict";

(function () {
  const URL = `https://21.javascript.pages.academy/keksobooking`;

  const StatusCode = {
    OK: 200,
    BAD: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
  };

  const TIMEOUT_STATUS = 10000;

  window.upload = (data, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
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

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
    });

    xhr.timeout = TIMEOUT_STATUS;

    xhr.open(`POST`, URL);
    xhr.send(data);
  };
})();
