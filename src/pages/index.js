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

      api
        .updateProfile(updatedData)
        .then((userData) => {
          userInfo.setUserInfo({
            name: userData.name,
            job: userData.about,
          });
          const avatarImage = document.querySelector(".profile__image");
          avatarImage.src = userData.avatar;
          avatarImage.alt = userData.name;
          profileEditPopup.close();
        })
        .catch((error) => {
          console.error("Error updating profile information:", error);
        })
        .finally(() => {
          // Reset the button text after the update (whether it was successful or not)
          saveButton.textContent = "Save";
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

    console.log("Sending card data:", cardData); // Log the card data being sent

    api
      .createCard(cardData)
      .then((newCard) => {
        console.log("Card added successfully:", newCard); // Log successful response
        const cardElement = createCard(newCard, api); // Pass api to Card
        cardSection.addItem(cardElement);
        addCardPopup.close();
        addCardForm.reset();
        addCardFormValidator.disableButton();
      })
      .catch((error) => {
        console.error("Error adding new card:", error); // Log any errors
      })
      .finally(() => {
        saveButton.textContent = "Create"; // Reset the button text after the action
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
          console.log("Card deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting card:", error);
        });
    }
  );

  const profileFormValidator = new FormValidator(settings, profileEditForm);
  const addCardFormValidator = new FormValidator(settings, addCardForm);
  profileFormValidator.enableValidation();
  addCardFormValidator.enableValidation();

  // Select avatar form and initialize its validator
  const avatarForm = document.querySelector("#profile-avatar-form");
  const avatarFormValidator = new FormValidator(settings, avatarForm);
  avatarFormValidator.enableValidation(); // Now correctly initialized

  // Function to create a card
  function createCard(cardData, api) {
    const card = new Card(
      cardData,
      "#card-template",
      handleImageClick,
      api,
      deleteConfirmationPopup
    ); // Pass api to Card
    const cardElement = card.getView(); // Get the card view correctly
    cardElement.dataset.id = cardData._id;
    // Attach event listener for the delete button after the card has been created
    cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        deleteConfirmationPopup.open(cardData._id);
      });

    return cardElement; // Return the correctly initialized card element
  }

  function handleImageClick(data) {
    popupWithImage.open(data);
  }

  // Open profile edit popup
  profileEditButton.addEventListener("click", () => {
    const userData = userInfo.getUserInfo();
    nameInput.value = userData.name;
    descriptionInput.value = userData.job;
    profileEditPopup.open();
    profileFormValidator.resetValidation();
  });

  // Open add card popup
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
      });
      const avatarImage = document.querySelector(".profile__image");
      avatarImage.src = userData.avatar;
      avatarImage.alt = userData.name;
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });

  // Fetch initial cards
  api
    .getInitialCards()
    .then((cards) => {
      cards.forEach((cardData) => {
        const cardElement = createCard(cardData, api); // Pass api to Card
        cardSection.addItem(cardElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching cards:", error);
    });

  // Handling avatar modal and avatar update
  const editAvatarButton = document.querySelector("#edit-avatar-button");
  const profileAvatarModal = document.querySelector("#profile-avatar-modal");
  const closeAvatarModalButton = document.querySelector(
    "#modal-close-button-avatar"
  );
  const avatarLinkInput = document.querySelector("#avatar-link");

  // Open the avatar modal when the edit button is clicked
  editAvatarButton.addEventListener("click", () => {
    profileAvatarModal.classList.add("modal_opened");
  });

  // Close the avatar modal when the close button is clicked
  closeAvatarModalButton.addEventListener("click", () => {
    profileAvatarModal.classList.remove("modal_opened");
  });

  // Handle the form submission to update the profile avatar
  avatarForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newAvatarUrl = avatarLinkInput.value;

    // Change the button text to "Saving..."
    const saveButton = document.querySelector("#modal-avatar-button");
    saveButton.textContent = "Saving...";

    // Send PATCH request to update avatar
    api
      .updateProfileAvatar({ avatar: newAvatarUrl })
      .then((userData) => {
        const avatarImage = document.querySelector(".profile__image");
        avatarImage.src = userData.avatar; // Update the avatar image
        avatarImage.alt = "Profile Avatar"; // Update alt text
        profileAvatarModal.classList.remove("modal_opened"); // Close the modal
      })
      .catch((error) => {
        console.error("Error updating avatar:", error);
      })
      .finally(() => {
        // Reset the button text after the update (whether it was successful or not)
        saveButton.textContent = "Save";
      });
  });
});
