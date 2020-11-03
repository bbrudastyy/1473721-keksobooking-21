'use strict';

const body = document.querySelector(`body`);
const blockError = document.createElement(`div`);
const blockErrorText = document.createElement(`a`);

const show = () => {

  body.appendChild(blockError);

  blockError.style.display = `block`;
  blockError.style.width = `100%`;
  blockError.style.height = `100%`;
  blockError.style.position = `fixed`;
  blockError.style.zIndex = `100`;
  blockError.style.top = `0`;
  blockError.style.left = `0`;
  blockError.style.backgroundColor = `rgb(173, 168, 168, 0.5)`;

  blockErrorText.style.display = `inline-block`;
  blockErrorText.style.width = `550px`;
  blockErrorText.textContent = `Упс, произошла ошибка`;
  blockErrorText.style.fontSize = `xx-large`;

  blockError.appendChild(blockErrorText);

  hide();
};

const hide = () => {
  const onDocumentClick = (evt) => {
    if (evt.key === window.card.eventValue.KEY_ESCAPE || evt.key === window.card.eventValue.KEY_ESCAPE_ABBREVIATED) {
      if (blockError) {
        evt.preventDefault();
        blockError.remove();
        document.removeEventListener(`keydown`, onDocumentClick);
      }
    }
  };

  document.addEventListener(`keydown`, onDocumentClick);
};

window.customError = {
  show
};
