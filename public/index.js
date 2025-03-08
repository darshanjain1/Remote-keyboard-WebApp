// Add an event listener to the "submitUserId" button
document.getElementById("submitUserId").addEventListener("click", function () {
    // Get the input field and error message element
    const userIdInput = document.getElementById("userIdInput");
    const errorText = document.getElementById("errorText");
    
    // Retrieve the trimmed user ID value from the input field
    const userId = userIdInput.value.trim();

    // Check if the input is empty
    if (!userId) {
        errorText.style.display = "block"; // Show error message if input is empty
        return;
    }

    // Hide the error message if input is valid
    errorText.style.display = "none"; 

    // Construct the new URL with the user ID as a query parameter
    const newUrl = `${window.location.origin}/keyboard?user=${encodeURIComponent(userId)}`;
    
    // Redirect the user to the keyboard page with the user ID
    window.location.href = newUrl;
});
