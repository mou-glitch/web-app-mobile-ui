// Constants for the target location and radius
const TARGET_LOCATION = {
  lat: 33.552252,
  lng: -7.633616,
};
const ALLOWED_RADIUS = 1; // in kilometers
const TOKEN_EXPIRY_MINUTES = 2;

// Function to calculate the distance between two latitude/longitude points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Function to check the user's location
function checkLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const distance = calculateDistance(
          userLat,
          userLon,
          TARGET_LOCATION.lat,
          TARGET_LOCATION.lng
        );

        if (distance <= ALLOWED_RADIUS) {
          // Redirect if within the allowed radius
          window.location.href = "/new-page.html";
        } else {
          // Show notification if user is further than the allowed radius
          const notification = document.getElementById("notification");
          notification.textContent = `You are ${distance.toFixed(
            1
          )} km away from the target location.`;
          notification.classList.remove("hidden");

          // Restore home screen elements
          document.getElementById("header").style.opacity = "1";
          document.getElementById("content").style.opacity = "1";
          document.getElementById("button-container").style.opacity = "1";
          document.getElementById("searching").style.opacity = "0";
          document.getElementById("searching").style.pointerEvents = "none";
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

// Event listener for the "Verify Location" button
document
  .getElementById("verify-location")
  .addEventListener("click", function () {
    // Hide main content and show searching div
    document.getElementById("header").style.opacity = "0";
    document.getElementById("content").style.opacity = "0";
    document.getElementById("button-container").style.opacity = "0";
    document.getElementById("searching").style.opacity = "1";
    document.getElementById("searching").style.pointerEvents = "auto";

    // Start location check after a slight delay to show the searching animation
    setTimeout(checkLocation, 2000);
  });
