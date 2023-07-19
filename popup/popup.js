// popup scripts control the behavior of the extension's popup window

window.onload = function () {
  updateBlockedWebsitesSection();
  var blockButton = document.getElementById("blockButton");
  blockButton.onclick = function () {
    getWebsiteInput();
  };
};

function getWebsiteInput() {
  var websiteInput = document.getElementById("websiteInput").value;
  // If user clicks the -Block- button without entering input -> Alert Error
  if (!websiteInput) {
    alert("Error: please enter a website URL");
  } else {
    // Retrieve the blockedWebsitesArray from Chrome browser, or initialize a new one
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      var blockedWebsitesArray = data.blockedWebsitesArray || [];
      // If: there is data in the array
      // Then: Alert Error
      // Else: Add the new input to the array
      const isInputInArray = blockedWebsitesArray.some(
        (item) => item === websiteInput
      );
      if (isInputInArray === true) {
        alert("Error: URL is already blocked");
      } else {
        blockedWebsitesArray.push(websiteInput);
        chrome.storage.sync.set(
          { blockedWebsitesArray: blockedWebsitesArray },
          function () {
            // Update the UI after the storage operation is complete
            updateBlockedWebsitesSection();
            document.getElementById("websiteInput").value = "";
            document.getElementById("websiteInput").focus();
          }
        );
      }
    });
  }
}

// Update the Popup's 'Blocked Websites' Section to current state
function updateBlockedWebsitesSection() {
  // Retrieve the blockedWebsitesDiv
  const blockedWebsitesDiv = document.getElementById("blockedWebsitesDiv");
  // Clear the blockedWebsitesDiv by removing all its child elements
  while (blockedWebsitesDiv.firstChild) {
    blockedWebsitesDiv.removeChild(blockedWebsitesDiv.firstChild);
  }
  // Get the stored array of blocked websites
  chrome.storage.sync.get("blockedWebsitesArray", function (data) {
    const blockedWebsitesArray = data.blockedWebsitesArray;
    // Check if the array is empty
    if (blockedWebsitesArray && blockedWebsitesArray.length > 0) {
      // If the array is not empty, remove the message that says 'No websites have been blocked' (if it exists)
      const nothingBlockedDiv = document.querySelector(".nothingBlocked");
      if (nothingBlockedDiv != null) {
        blockedWebsitesDiv.removeChild(nothingBlockedDiv);
      }
      // then iterate through each item in the stored array of Blocked Websites
      blockedWebsitesArray.forEach((website, index) => {
        // Create a new div for each URL
        const websiteDiv = document.createElement("div");
        // Add class (for styling) to websiteDiv block
        websiteDiv.classList.add("websiteDiv");
        // Create div for 'website text'
        const websiteDivText = document.createElement("div");
        websiteDivText.classList.add("websiteDivText");
        websiteDivText.textContent = website;
        // Append the websiteDivText to websiteDiv
        websiteDiv.appendChild(websiteDivText);
        // Create the unblock button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete"); // Add your CSS class for styling the red button
        // Create an id value for the array item
        deleteButton.setAttribute("id", index);
        // Create the trash icon (using Font Awesome)
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fas", "fa-trash");
        trashIcon.setAttribute("id", index);
        // Append the trash icon to the delete button
        deleteButton.appendChild(trashIcon);
        // Add onClick function to each delete button
        deleteButton.addEventListener("click", unblockURL);
        // Append the red button to the websiteDiv
        websiteDiv.appendChild(deleteButton);
        // Append the websiteDiv to the blockedWebsitesDiv
        blockedWebsitesDiv.appendChild(websiteDiv);
      });
    } else {
      // If the array is empty, create the message element
      const nothingBlocked = document.createElement("div");
      nothingBlocked.textContent = "No websites have been blocked";
      nothingBlocked.classList.add("nothingBlocked");
      blockedWebsitesDiv.appendChild(nothingBlocked);
    }
  });
}

function unblockURL(event) {
  const clickedButtonId = event.target.id;
  // Get the blockedWebsitesArray
  chrome.storage.sync.get("blockedWebsitesArray", function (data) {
    let blockedWebsitesArray = data.blockedWebsitesArray;
    for (let i = 0; i < blockedWebsitesArray.length; i++) {
      if (clickedButtonId == i) {
        blockedWebsitesArray.splice(i, 1);
        break; // Exit the loop after removing the element
      }
    }
    // Save the updated array back to Chrome storage
    chrome.storage.sync.set({ blockedWebsitesArray: blockedWebsitesArray });
    updateBlockedWebsitesSection();
  });
}
