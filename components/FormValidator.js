class FormValidator {
  constructor(settings, formSelector) {
    this._settings = settings;
    this._inputSelector = settings.inputSelector;
    this._inputErrorClass = settings.inputErrorClass; // modal__input_error comes from settings.inputErrorClass
    this._errorClass = settings.errorClass;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._form = formSelector;
    this._inputEls = [...this._form.querySelectorAll(this._inputSelector)];
    this._button = this._form.querySelector(this._submitButtonSelector);
  }

  // Show the error message and apply red underline for invalid input
  _showInputError(inputEl) {
    const errorMessageEl = this._form.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.add(this._inputErrorClass); // Use inputErrorClass from settings
    errorMessageEl.classList.add(this._errorClass);
    errorMessageEl.textContent = inputEl.validationMessage;
  }

  // Hide the error message and remove red underline for valid input
  _hideInputError(inputEl) {
    const errorMessageEl = this._form.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.remove(this._inputErrorClass); // Use inputErrorClass from settings
    errorMessageEl.classList.remove(this._errorClass);
    errorMessageEl.textContent = "";
  }

  // Toggle the submit button state based on input validity
  _toggleButtonState() {
    if (!this._hasInvalidInput()) {
      this._button.classList.remove(this._inactiveButtonClass);
      this._button.disabled = false;
    } else {
      this.disabledButtonState(); // Use disabledButtonState to keep consistency
    }
  }

  // Disable the submit button and apply inactive styles
  disabledButtonState() {
    this._button.classList.add(this._inactiveButtonClass);
    this._button.disabled = true;
  }

  // Check if any input field is invalid
  _hasInvalidInput() {
    return this._inputEls.some((inputEl) => !inputEl.validity.valid);
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
      e.preventDefault(); // Prevent default form submission behavior
    });

    this._setEventListeners();
  }

  // Reset all validation states and error messages, disable the button
  resetValidation() {
    this._inputEls.forEach((inputEl) => {
      this._hideInputError(inputEl); // Hide all input errors
    });

    this.disabledButtonState(); // Disable the button after reset
  }
}

export default FormValidator;
