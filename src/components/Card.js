export default class Card {
  constructor(cardData, cardSelector, handleImageClick) {
    this.name = cardData.name;
    this.link = cardData.link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  // Method to get the card template from the DOM
  _getTemplate() {
    return document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  // Method to set event listeners for like, delete, and image click actions
  _setEventListeners() {
    this._cardLikeButton.addEventListener("click", () =>
      this._handleLikeIcon()
    );

    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleImageClick({ name: this.name, link: this.link }); // Pass only the relevant data
      });

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => this._handleDeleteCard());
  }

  // Method to handle the like button toggle
  _handleLikeIcon() {
    this._cardLikeButton.classList.toggle("card__like-button_active");
  }

  // Method to delete the card from the DOM
  _handleDeleteCard() {
    this._element.remove();
    this._element = null;
  }

  // Method to generate and return the card's DOM element
  getView() {
    this._element = this._getTemplate(); // Get the card template
    this._element.querySelector(".card__image").src = this.link; // Set image source
    this._element.querySelector(".card__image").alt = this.name; // Set image alt text
    this._element.querySelector(".card__title").textContent = this.name; // Set the card title

    this._cardLikeButton = this._element.querySelector(".card__like-button"); // Like button reference

    this._setEventListeners(); // Attach event listeners

    return this._element;
  }
}
