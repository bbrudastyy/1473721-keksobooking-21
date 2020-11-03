'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const DEFAULT_SRC = `img/muffin-grey.svg`;

const fileChooserPin = document.querySelector(`.ad-form__field input[type=file]`);
const previewPin = document.querySelector(`.ad-form-header__preview img`);
const fileChooserAd = document.querySelector(`.ad-form__upload input[type=file]`);
const previewAd = document.querySelector(`.ad-form__photo`);

const ImageSize = {
  WIDTH: 70,
  HEIGHT: 70
};

const onChange = () => {
  fileChooserPin.addEventListener(`change`, () => {
    const file = fileChooserPin.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        previewPin.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  fileChooserAd.addEventListener(`change`, () => {
    const file = fileChooserAd.files[0];
    const fileName = file.name.toLowerCase();
    const fileImgage = document.createElement(`img`);

    fileImgage.width = `${ImageSize.WIDTH}`;
    fileImgage.height = `${ImageSize.HEIGHT}`;
    fileImgage.alt = `Фотография жилья`;
    previewAd.appendChild(fileImgage);

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        fileImgage.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
};

const setDefault = () => {
  previewPin.src = `${DEFAULT_SRC}`;
  previewPin.alt = ``;
  previewAd.innerHTML = ``;
};

window.photo = {
  onChange,
  setDefault
};
