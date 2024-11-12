import Popup from "./Popup.js"; // Import the base Popup class

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleConfirm) {
    super(popupSelector);
    this._handleConfirm = handleConfirm; // Function to call when confirmed

    // Make sure the popup element exists before querying
    if (this._popup) {
      this._confirmButton = this._popup.querySelector(".modal__submit");
      this._closeButton = this._popup.querySelector(".modal__close");
      this._setEventListeners();
    } else {
      console.error("Popup element not found:", popupSelector);
    }
  }

  _setEventListeners() {
    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", () => {
        const cardId = this._cardId; // Store the card ID to be deleted
        this._handleConfirm(cardId); // Call the confirm handler
        this.close(); // Close the popup
      });
    }

    if (this._closeButton) {
      // Add event listener for close button
      this._closeButton.addEventListener("click", () => {
        this.close(); // Close the popup when close button is clicked
      });
    }
  }

  open(cardId) {
    this._cardId = cardId; // Store the card ID to be deleted
    super.open(); // Call the open method from Popup class
  }
}
