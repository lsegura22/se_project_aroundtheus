import Popup from "./Popup.js"; // Import the base Popup class

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleConfirm) {
    super(popupSelector);
    this._handleConfirm = handleConfirm; // Save the initial confirm handler
    if (this._popup) {
      this._confirmButton = this._popup.querySelector(".modal__submit");
    } else {
      console.error("Popup element not found:", popupSelector);
    }
  }

  // Method to update the confirmation handler
  setHandleSubmit(newHandleConfirm) {
    this._handleConfirm = newHandleConfirm;
  }

  // Override setEventListeners to include custom listeners
  setEventListeners() {
    super.setEventListeners(); // Call the parent method to ensure base listeners are added
    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", () => {
        const cardId = this._cardId;
        this._handleConfirm(cardId); // Call the confirmation handler with the current card ID
      });
    }
  }

  // Override the open method to pass the cardId
  open(cardId) {
    this._cardId = cardId; // Store the card ID to be deleted
    super.open(); // Call the open method from the Popup class
  }
}
