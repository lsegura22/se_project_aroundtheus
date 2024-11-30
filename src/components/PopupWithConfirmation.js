import Popup from "./Popup.js"; // Import the base Popup class

export default class PopupWithConfirmation extends Popup {
  constructor(popupSelector, handleConfirm) {
    super(popupSelector);
    this._handleConfirm = handleConfirm; // Save the initial confirm handler
    if (this._popup) {
      this._confirmButton = this._popup.querySelector(".modal__submit");
      this._closeButton = this._popup.querySelector(".modal__close");
      this._overlay = this._popup.querySelector(".modal"); // Assuming '.modal' is the overlay
      this._setConfirmationEventListeners();
    } else {
      console.error("Popup element not found:", popupSelector);
    }
  }

  // Method to update the confirmation handler
  setHandleSubmit(newHandleConfirm) {
    this._handleConfirm = newHandleConfirm;
  }

  // Custom event listeners specific to the confirmation modal
  _setConfirmationEventListeners() {
    super.setEventListeners(); // Ensure base class event listeners are set up
    if (this._confirmButton) {
      this._confirmButton.addEventListener("click", () => {
        const cardId = this._cardId;
        this._handleConfirm(cardId); // Call the confirmation handler with the current card ID
      });
    }

    if (this._closeButton) {
      // Add event listener for close button
      this._closeButton.addEventListener("click", () => {
        this.close(); // Close the popup when close button is clicked
      });
    }
  }

  // Override the open method to pass the cardId
  open(cardId) {
    this._cardId = cardId; // Store the card ID to be deleted
    super.open(); // Call the open method from the Popup class
  }
}
