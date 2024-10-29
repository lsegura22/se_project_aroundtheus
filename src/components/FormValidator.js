class FormValidator {
  constructor(settings, formSelector) {
    this._settings = settings;
    this._inputSelector = settings.inputSelector;
    this._inputErrorClass = settings.inputErrorClass;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._form = formSelector;
    this._inputEls = [...this._form.querySelectorAll(this._inputSelector)];
    this._button = this._form.querySelector(this._submitButtonSelector);
  }

  // Show the error message and apply red underline for invalid input
  _showInputError(inputEl) {
    const errorMessageEl = this._form.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.add(this._inputErrorClass);
    errorMessageEl.classList.add(this._settings.errorClass);
    errorMessageEl.textContent = inputEl.validationMessage;
  }

  // Hide the error message and remove red underline for valid input
  _hideInputError(inputEl) {
    const errorMessageEl = this._form.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.remove(this._inputErrorClass);
    errorMessageEl.classList.remove(this._settings.errorClass);
    errorMessageEl.textContent = "";
  }

  // Toggle the submit button state based on input validity and empty fields
  _toggleButtonState() {
    if (!this._hasInvalidInput()) {
      this._button.classList.remove(this._inactiveButtonClass);
      this._button.disabled = false;
    } else {
      this._disableButtonState();
    }
  }

  // Disable the submit button and apply inactive styles
  _disableButtonState() {
    this._button.classList.add(this._inactiveButtonClass);
    this._button.disabled = true;
  }

  // Check if any input field is invalid or if any are empty
  _hasInvalidInput() {
    return this._inputEls.some((inputEl) => {
      return !inputEl.validity.valid || inputEl.value.trim() === ""; // Checks for invalid or empty inputs
    });
  }

  // Check input validity and display/hide error messages
  _checkInvalidValidity(inputEl) {
    if (!inputEl.validity.valid) {
      this._showInputError(inputEl);
    } else {
      this._hideInputError(inputEl);
    }
  }

  // Attach input event listeners to toggle button state and validate fields
  _setEventListeners() {
    this._inputEls.forEach((inputEl) => {
      inputEl.addEventListener("input", () => {
        this._checkInvalidValidity(inputEl);
        this._toggleButtonState();
      });
    });
  }

  // Enable form validation on initialization
  enableValidation() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
    });

    this._setEventListeners();

    // Call toggleButtonState at initialization to disable the button if form is invalid or empty
    this._toggleButtonState();
  }

  // Reset all validation states and error messages, disable the button
  resetValidation() {
    this._inputEls.forEach((inputEl) => {
      this._hideInputError(inputEl);
    });

    this._disableButtonState(); // Ensures button is disabled when form is reset
  }
}

export default FormValidator;
