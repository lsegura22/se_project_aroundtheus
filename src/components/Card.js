export default class Card {
  constructor(
    cardData,
    cardSelector,
    handleImageClick,
    api,
    deleteConfirmationPopup
  ) {
    this._name = cardData.name;
    this._link = cardData.link;
    this._id = cardData._id;
    this._isLiked = cardData.isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._api = api; // Store the API instance for later use
    this._confirmationPopup = deleteConfirmationPopup; // Use the popup passed from index.js
    this._handleLikeIcon = this._handleLikeIcon.bind(this); // To handle the like toggle
  }

  _getTemplate() {
    return document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  _setEventListeners() {
    this._cardLikeButton.addEventListener("click", this._handleLikeIcon);
    this._element
      .querySelector(".card__image")
      .addEventListener("click", () => {
        this._handleImageClick({ name: this._name, link: this._link });
      });

    this._element
      .querySelector(".card__delete-button")
      .addEventListener("click", () => this._handleDeleteCard());
  }

  _handleLikeIcon() {
    if (this._isLiked) {
      this._removeLike();
    } else {
      this._addLike();
    }
  }

  _addLike() {
    this._api
      .addLike(this._id)
      .then((updatedCard) => {
        this._isLiked = updatedCard.isLiked;
        this._updateLikeButton();
      })
      .catch((error) => {
        console.error("Error adding like:", error);
      });
  }

  _removeLike() {
    this._api
      .removeLike(this._id)
      .then((updatedCard) => {
        this._isLiked = updatedCard.isLiked;
        this._updateLikeButton();
      })
      .catch((error) => {
        console.error("Error removing like:", error);
      });
  }

  _updateLikeButton() {
    if (this._isLiked) {
      this._cardLikeButton.classList.add("card__like-button_active");
    } else {
      this._cardLikeButton.classList.remove("card__like-button_active");
    }
  }

  _handleDeleteCard() {
    this._confirmationPopup.open(this._id);

    // Handling deletion inside confirmation popup
    this._confirmationPopup.setHandleSubmit(() => {
      this._api
        .deleteCard(this._id)
        .then(() => {
          this._element.remove();
          this._element = null; // Prevent memory leaks
          this._confirmationPopup.close();
        })
        .catch((error) => {
          console.error("Error deleting card:", error);
        });
    });
  }

  getView() {
    this._element = this._getTemplate();
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;
    this._element.querySelector(".card__title").textContent = this._name;

    this._cardLikeButton = this._element.querySelector(".card__like-button");
    this._updateLikeButton();

    this._setEventListeners();

    return this._element;
  }
}
