const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const fileChooserPin = document.querySelector(`.ad-form__field input[type=file]`);
const previewPin = document.querySelector(`.ad-form-header__preview img`);

const fileChooserAd = document.querySelector(`.ad-form__field input[type=file]`);
const previewAd = document.querySelector(`.ad-form__upload img`);
console.log(previewAd);

fileChooserPin.addEventListener(`change`, () => {
  const file = fileChooserPin.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, function () {
      previewPin.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});

fileChooserAd.addEventListener(`change`, () => {
  const file = fileChooserAd.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, function () {
      previewAd.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
});
