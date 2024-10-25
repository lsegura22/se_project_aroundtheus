import FormValidator from "../components/FormValidator.js";
import { settings, initialCards } from "../utils/constants.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";

// Import all CSS via index.css, which contains all @import statements
import "../vendor/fonts.css"; // Updated path to reflect the vendor folder inside src
import "../vendor/normalize.css"; // Updated path to reflect the vendor folder inside src
import "../pages/index.css"; // This path remains the same

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------- elements ----------------------------*/
  const profileEditButton = document.querySelector(".profile__edit-button");
  const addButton = document.querySelector("#profile-add-button");
  const nameInput = document.querySelector(".modal__input-title");
  const descriptionInput = document.querySelector(".modal__input-description");
  const profileEditForm = document.querySelector("#profile-form");
  const addCardForm = document.querySelector("#add-form");

  // Check if forms are correctly selected
  console.log(profileEditForm); // Should not log 'null'
  console.log(addCardForm); // Should not log 'null'

  /* ---------------------------- Instantiating Classes ----------------------------- */

  // UserInfo class manages displaying and updating user profile info
  const userInfo = new UserInfo({
    nameSelector: ".profile__title",
    jobSelector: ".profile__description",
  });

  // Section class handles rendering cards and adding them to the DOM
  const cardSection = new Section(
    {
      items: initialCards,
      renderer: (cardData) => {
        const cardElement = createCard(cardData);
        cardSection.addItem(cardElement); // Add card to the DOM
      },
    },
    ".cards__list-content"
  );

  // PopupWithImage for displaying full-size image in a modal
  const popupWithImage = new PopupWithImage("#modal-image-preview");
  popupWithImage.setEventListeners();

  // PopupWithForm for editing profile info
  const profileEditPopup = new PopupWithForm(
    "#profile-edit-modal",
    (formData) => {
      userInfo.setUserInfo(formData); // Update the user info on the page
      profileEditPopup.close(); // Close the modal after form submission
    }
  );
  profileEditPopup.setEventListeners();

  // PopupWithForm for adding a new card
  const addCardPopup = new PopupWithForm("#profile-add-modal", (formData) => {
    const cardData = {
      name: formData["add-title"],
      link: formData["link-type"],
    };
    const cardElement = createCard(cardData); // Create the new card
    cardSection.addItem(cardElement); // Add it to the DOM
    addCardPopup.close(); // Close the modal after adding the card
  });
  addCardPopup.setEventListeners();

  /* ---------------------------- Form Validation ----------------------------- */

  // Initialize form validators for both forms
  const profileFormValidator = new FormValidator(settings, profileEditForm);
  const addCardFormValidator = new FormValidator(settings, addCardForm);

  // Enable form validation
  profileFormValidator.enableValidation();
  addCardFormValidator.enableValidation();

  /* ---------------------------- Handlers ----------------------------- */

  // Function to create a new Card instance
  function createCard(cardData) {
    const card = new Card(cardData, "#card-template", handleImageClick);
    return card.getView();
  }

  // Handle image clicks to open the image preview popup
  function handleImageClick(data) {
    popupWithImage.open(data); // Open image popup with data (name and link)
  }

  // Handle opening the profile edit modal and populating it with current user data
  profileEditButton.addEventListener("click", () => {
    const userData = userInfo.getUserInfo();
    nameInput.value = userData.name;
    descriptionInput.value = userData.job;
    profileEditPopup.open(); // Open the modal
  });

  // Handle opening the modal for adding a new card
  addButton.addEventListener("click", () => {
    addCardForm.reset(); // Reset the form fields
    addCardFormValidator.resetValidation(); // Reset form validation and disable the button
    addCardPopup.open(); // Open the modal
  });

  /* Render all initial cards from initialCards array */
  cardSection.renderItems();
});
