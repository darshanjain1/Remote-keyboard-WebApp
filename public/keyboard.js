import "/socket.io/socket.io.js";
import recentKeyboardUsers from "../utils/getRecentKeyboardUsers.js";
import constants from "../utils/constants.js";

// Initialize socket connection
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  // Extract user identifier from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  let userIdentifier = Number(urlParams.get("user"));
  let activeKeyboardUser = null;
  let inactivityTimer = null;

  // DOM elements
  const takeControlBtn = document.getElementById("take-control-btn");
  const controlStatus = document.getElementById("control-status");
  const gridContainer = document.querySelector(".grid-container");
  const userColorHeading = document.querySelector(".user-color-heading");
  const userColorMapping = document.querySelector(".user-color-mapping");

  // Event listener for when a user acquires keyboard control
  socket.on("keyboard-control-acquired", ({ user }) => {
    if (takeControlBtn) takeControlBtn.disabled = true; // Disable the button when another user takes control
    if (controlStatus) controlStatus.textContent = user.name; // Display the current active user
    activeKeyboardUser = user;

    // Start inactivity timer for automatic control release
    startUserInactivityTimer(user.identifier);
  });

  // Event listener for key press updates
  socket.on("key-pressed", ({ data }) => {
    renderGrid(data); // Update the keyboard grid
    updateUserBadges(data); // Update the UI with active users
  });

  // Event listener for when keyboard control is released
  socket.on("keyboard-control-released", () => {
    if (takeControlBtn) takeControlBtn.disabled = false; // Enable the button when control is released
    if (controlStatus) controlStatus.textContent = "No"; // Indicate that no user is currently active
    activeKeyboardUser = null;
  });

  // Event listener for handling grid key clicks
  gridContainer?.addEventListener("click", (event) => {
    const clickedCell = event.target;
    // Check if the clicked cell is a valid key and if the user has control
    if (
      clickedCell.classList.contains("grid-item") &&
      userIdentifier === activeKeyboardUser?.identifier
    ) {
      const cellData = JSON.parse(clickedCell.getAttribute("data-object"));
      cellData && handleCellClick(cellData, userIdentifier);
    }
  });

  // Event listener for taking control of the keyboard
  takeControlBtn?.addEventListener("click", async () => {
    try {
      const response = await fetch("/keyboard/acquire-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdentifier: Number(urlParams.get("user")) }),
      });

      const { user } = await response.json();

      if (response.ok) {
        socket.emit("keyboard-control-acquired", { user }); // Notify all users about control acquisition
      } else {
        alert(`Error: ${user.error}`); // Show error if acquisition fails
      }
    } catch (error) {
      console.error("Error acquiring control:", error);
    }
  });

  // Handles a cell click event (when a key is pressed)
  async function handleCellClick(cellData, userIdentifier) {
    try {
      const response = await fetch("/keyboard/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdentifier, keyId: cellData.id }),
      });

      const { enabledKeysWithUserDetails: data } = await response.json();

      // Restart inactivity timer if key is pressed, otherwise release control
      cellData.is_pressed
        ? startUserInactivityTimer(userIdentifier)
        : releaseKeyboardControl(userIdentifier);

      socket.emit("key-pressed", { data }); // Notify all users about the key press
    } catch (error) {
      console.error("Error handling cell click:", error);
    }
  }

  // Releases keyboard control if the user becomes inactive
  async function releaseKeyboardControl(userIdentifier) {
    await fetch("/keyboard/release-control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIdentifier }),
    });

    socket.emit("keyboard-control-released"); // Notify all users about control release
  }

  // Starts an inactivity timer to release keyboard control if the user is inactive
  function startUserInactivityTimer(userIdentifier) {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/keyboard/user/${userIdentifier}`);
        const user = await response.json();

        if (isUserInactive(user.last_activity)) {
          releaseKeyboardControl(user.identifier); // Release control if the user is inactive
        }
      } catch (error) {
        console.error("Error checking user inactivity:", error);
      }
    }, constants.maxInactiveTimeInSeconds * 1000);
  }

  // Checks if the user is inactive based on the last activity timestamp
  function isUserInactive(lastActivity) {
    return (
      Date.now() - new Date(lastActivity).getTime() >
      constants.maxInactiveTimeInSeconds * 1000
    );
  }

  // Renders the keyboard grid with updated key statuses
  function renderGrid(data) {
    gridContainer.innerHTML = "";
    const columns = 5;
    const rows = Math.ceil(data.length / columns);
    const totalCells = rows * columns;

    for (let i = 0; i < totalCells; i++) {
      const item = data[i];
      const div = document.createElement("div");

      // Assign class based on whether the key is active or empty
      div.classList.add("grid-item", item ? "colored" : "empty");

      if (item) {
        div.style.setProperty("--dynamic-color", item.user.color || "white");
        div.setAttribute("data-key", item.key);
        div.setAttribute("data-object", JSON.stringify(item));
        div.textContent = item.key;
      }

      gridContainer.appendChild(div);
    }
  }

  // Updates user badges to show active users with colors
  function updateUserBadges(data) {
    userColorMapping.innerHTML = "";
    let users = recentKeyboardUsers(data);

    // Show or hide the "Currently Active Users" heading
    userColorHeading.style.display = users.length ? "block" : "none";

    users.forEach(({ color, name }) => {
      const span = document.createElement("span");
      span.classList.add("user-badge");
      span.style.backgroundColor = color;
      span.textContent = name;
      userColorMapping.appendChild(span);
    });
  }

  // Clear inactivity timer when the page is about to unload
  window.addEventListener("beforeunload", () => clearTimeout(inactivityTimer));
});
