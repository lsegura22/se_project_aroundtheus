import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".modal__form");
  }

  _getInputValues() {
    const inputList = this._form.querySelectorAll(".modal__input");
    const formValues = {};
    inputList.forEach((input) => {
      formValues[input.name] = input.value;
    });
    return formValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
      this._form.reset(); // Reset the form only after successful submission
    });
  }

  close() {
    super.close();
    // Removed form reset from close method to avoid clearing data on accidental close
  }
}
