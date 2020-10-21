`use strict`;

(function () {
  const URL = `https://21.javascript.pages.academy/keksobooking`;

  window.upload = (data, onSuccess, onError) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      onSuccess(xhr.response);
    });

    xhr.addEventListener(`error`, function () {
      console.log('до меня дошло');
      onError();
    });

    xhr.open(`POST`, URL);
    xhr.send(data);
  };
})();
