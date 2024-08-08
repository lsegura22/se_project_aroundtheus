// form validation
const formValidationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

// Enable validation
function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));
  forms.forEach((form) => {
    form.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(form, config);
  });
}

function setEventListeners(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);
  toggleButtonState(inputs, submitButton, config);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(input, config);
      toggleButtonState(inputs, submitButton, config);
    });
  });
}

function checkInputValidity(input, config) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  if (!input.validity.valid) {
    showInputError(input, errorElement, config);
  } else {
    hideInputError(input, errorElement, config);
  }
}

function showInputError(input, errorElement, config) {
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = input.validationMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(input, errorElement, config) {
  input.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = "";
}

function toggleButtonState(inputs, button, config) {
  const hasInvalidInput = inputs.some((input) => !input.validity.valid);
  if (hasInvalidInput) {
    button.classList.add(config.inactiveButtonClass);
    button.disabled = true;
  } else {
    button.classList.remove(config.inactiveButtonClass);
    button.disabled = false;
  }
}

enableValidation(formValidationConfig);
