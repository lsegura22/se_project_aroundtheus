import FormValidator from "../components/FormValidator.js";
import { settings } from "../utils/constants.js";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import "../vendor/fonts.css";
import "../vendor/normalize.css";
import "../pages/index.css";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "55f75f9b-43cd-4f65-a141-e29dd49200ac",
    "Content-Type": "application/json",
  },
});

function handleApiError(error) {
  console.error("An error occurred during the API request:", error);
}

document.addEventListener("DOMContentLoaded", () => {
  const profileEditButton = document.querySelector(".profile__edit-button");
  const addButton = document.querySelector("#profile-add-button");
  const nameInput = document.querySelector(".modal__input-title");
  const descriptionInput = document.querySelector(".modal__input-description");
  const profileEditForm = document.querySelector("#profile-form");
  const addCardForm = document.querySelector("#add-form");

  const userInfo = new UserInfo({
    nameSelector: ".profile__title",
    jobSelector: ".profile__description",
    avatarSelector: ".profile__image",
  });

  const cardSection = new Section(
    {
      items: [],
      renderer: (cardData) => {
        const cardElement = createCard(cardData, api); // Pass api to Card
        cardSection.addItem(cardElement);
      },
    },
    ".cards__list-content"
  );

  const popupWithImage = new PopupWithImage("#modal-image-preview");
  popupWithImage.setEventListeners();

  const profileEditPopup = new PopupWithForm(
    "#profile-edit-modal",
    (formData) => {
      const updatedData = {
        name: formData.name,
        about: formData.job,
      };

      // Change the button text to "Saving..."
      const saveButton = document.querySelector("#modal-button");
      saveButton.textContent = "Saving...";
      saveButton.disabled = true;

      api
        .updateProfile(updatedData)
        .then((userData) => {
          userInfo.setUserInfo({
            name: userData.name,
            job: userData.about,
          });
          profileEditPopup.close();
          saveButton.disabled = true;
        })
        .catch(handleApiError)
        .finally(() => {
          // Reset the button text after the update (whether it was successful or not)
          saveButton.textContent = "Save";
          saveButton.disabled = false;
        });
    }
  );
  profileEditPopup.setEventListeners();

  const addCardPopup = new PopupWithForm("#profile-add-modal", (formData) => {
    const cardData = {
      name: formData["add-title"],
      link: formData["link-type"],
    };

    // Change the button text to "Saving..."
    const saveButton = document.querySelector("#modal-submit-button");
    saveButton.textContent = "Saving...";
    saveButton.disabled = true;

    console.log("Sending card data:", cardData); // Log the card data being sent

    api
      .createCard(cardData)
      .then((newCard) => {
        console.log("Card added successfully:", newCard); // Log successful response
        const cardElement = createCard(newCard, api); // Pass api to Card
        cardSection.addItem(cardElement);
        addCardPopup.close();
        addCardForm.reset();
      })
      .catch(handleApiError)
      .finally(() => {
        saveButton.textContent = "Create";
        saveButton.disabled = false;
      });
  });
  addCardPopup.setEventListeners();

  const deleteConfirmationPopup = new PopupWithConfirmation(
    "#delete-confirmation-modal",
    (cardId) => {
      api
        .deleteCard(cardId)
        .then(() => {
          const cardElement = document.querySelector(`[data-id='${cardId}']`);
          if (cardElement) {
            cardElement.remove();
          }
          deleteConfirmationPopup.close();
        })
        .catch(handleApiError);
    }
  );

  deleteConfirmationPopup.setEventListeners();

  const profileFormValidator = new FormValidator(settings, profileEditForm);
  const addCardFormValidator = new FormValidator(settings, addCardForm);
  profileFormValidator.enableValidation();
  addCardFormValidator.enableValidation();

  // Select avatar form and initialize its validator
  const avatarForm = document.querySelector("#profile-avatar-form");
  const avatarFormValidator = new FormValidator(settings, avatarForm);
  avatarFormValidator.enableValidation(); // Now correctly initialized

  function createCard(cardData, api) {
    const card = new Card(
      cardData,
      "#card-template",
      handleImageClick,
      api,
      () => {
        deleteConfirmationPopup.open(cardData._id); // Pass the delete logic as a function
      }
    ); // Create a new card instance with delete logic encapsulated
    return card.getView(); // Return the card's DOM element
  }

  function handleImageClick(data) {
    popupWithImage.open(data);
  }

  profileEditButton.addEventListener("click", () => {
    const userData = userInfo.getUserInfo();
    nameInput.value = userData.name;
    descriptionInput.value = userData.job;
    profileEditPopup.open();
    profileFormValidator.resetValidation();
  });

  addButton.addEventListener("click", () => {
    addCardFormValidator.disableButton();
    addCardPopup.open();
  });

  // Update profile info
  api
    .getUserInfo()
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        job: userData.about,
        avatar: userData.avatar,
      });
    })
    .catch(handleApiError);

  // Fetch initial cards
  api
    .getInitialCards()
    .then((cards) => {
      cards.forEach((cardData) => {
        const cardElement = createCard(cardData, api); // Pass api to Card
        cardSection.addItem(cardElement);
      });
    })
    .catch(handleApiError);

  // Handling avatar modal and avatar update
  // Initialize the avatar modal with the Popup class
  const avatarPopup = new PopupWithForm("#profile-avatar-modal", (formData) => {
    const newAvatarUrl = formData.avatar;
    console.log("Avatar URL is submitted:", newAvatarUrl);

    // Change the button text to "Saving..."
    const saveButton = document.querySelector("#modal-avatar-button");
    saveButton.textContent = "Saving...";
    saveButton.disabled = true;

    api
      .updateProfileAvatar({ avatar: newAvatarUrl })
      .then((userData) => {
        userInfo.setUserInfo({
          avatar: userData.avatar,
        });
        avatarPopup.close();
        saveButton.disabled = true;
      })
      .catch(handleApiError)
      .finally(() => {
        saveButton.textContent = "Save";
        saveButton.disabled = false;
      });
  });
  avatarPopup.setEventListeners();

  // Event listener to open the avatar modal
  const editAvatarButton = document.querySelector("#edit-avatar-button");
  editAvatarButton.addEventListener("click", () => {
    avatarPopup.open();
    avatarFormValidator.resetValidation();
  });
});
