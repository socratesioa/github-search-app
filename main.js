const modeToggle = document.getElementById("modeToggle");
const body = document.body;
const iconSun = document.getElementById("iconSun");
const iconMoon = document.getElementById("iconMoon");
const modeText = document.getElementById("modeText");

const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (prefersLight) {
  body.classList.add("light");
  modeText.textContent = "Dark";
  iconSun.style.display = "none";
  iconMoon.style.display = "inline";
  modeToggle.setAttribute("aria-label", "Toggle dark mode");
  modeToggle.setAttribute("aria-pressed", "true");
} else {
  modeText.textContent = "Light";
  iconSun.style.display = "inline";
  iconMoon.style.display = "none";
  modeToggle.setAttribute("aria-label", "Toggle light mode");
  modeToggle.setAttribute("aria-pressed", "false");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("light");

  if (body.classList.contains("light")) {
    modeText.textContent = "Dark";
    iconSun.style.display = "none";
    iconMoon.style.display = "inline";
    modeToggle.setAttribute("aria-label", "Toggle dark mode");
    modeToggle.setAttribute("aria-pressed", "true");
  } else {
    modeText.textContent = "Light";
    iconSun.style.display = "inline";
    iconMoon.style.display = "none";
    modeToggle.setAttribute("aria-label", "Toggle light mode");
    modeToggle.setAttribute("aria-pressed", "false");
  }
});

const form = document.querySelector('form[role="search"]');
const input = document.getElementById("search");

form.addEventListener("focus", (e) => {
  if (e.target === form) {
    input.focus();
  }
});

const searchForm = document.querySelector("form");
const searchInput = document.getElementById("search");
const profileContainer = document.getElementById("profile-container");
const userNotFound = document.getElementById("user-not-found");

async function fetchGitHubUser(username) {
  try {
    const res = await fetch(
      `/.netlify/functions/get-github-user?username=${username}`
    );

    if (!res.ok) {
      if (res.status === 404) {
        document.getElementById("error").textContent = "No results";
      }
      profileContainer.style.display = "none";
      userNotFound.style.display = "flex";
      userNotFound.style.opacity = "1";
      return;
    }

    const data = await res.json();
    document.getElementById("error").textContent = "";
    searchInput.placeholder = "Search GitHub username…";

    userNotFound.style.display = "none";
    userNotFound.style.opacity = "0";
    profileContainer.style.display = "grid";
    console.log("GitHub user data:", data);
    updateProfileUI(data);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("error").textContent = "No results";
    profileContainer.style.display = "none";
    userNotFound.style.display = "flex";
    userNotFound.style.opacity = "1";
  }
}

function updateProfileUI(data) {
  // Name & Username
  document.getElementById("github-name").textContent = data.name || data.login;
  document.getElementById("github-username").textContent = "@" + data.login;

  // Join Date
  const createdAt = new Date(data.created_at);
  const options = { day: "numeric", month: "short", year: "numeric" };
  document.getElementById("github-date").textContent =
    "Joined " + createdAt.toLocaleDateString("en-GB", options);

  // Bio
  const bioDisplay = document.getElementById("bio");
  if (data.bio) {
    bioDisplay.textContent = data.bio;
    bioDisplay.classList.remove("bio-not-available");
  } else {
    bioDisplay.textContent = "This profile has no bio";
    bioDisplay.classList.add("bio-not-available");
  }

  // Repos / Followers / Following
  document.getElementById("repos").textContent = data.public_repos;
  document.getElementById("followers").textContent = data.followers;
  document.getElementById("following").textContent = data.following;

  // Location
  const locationDisplay = document.getElementById("location");
  const locationIcon = document.querySelector(".location-label svg");

  locationIcon.classList.remove("not-available");
  if (data.location) {
    locationDisplay.textContent = data.location;
    locationDisplay.classList.remove("not-available");
  } else {
    locationDisplay.textContent = "Not Available";
    locationDisplay.classList.add("not-available");
    locationIcon.classList.add("not-available");
  }

  // Website
  const websiteUrl = data.blog;
  const websiteContainer = document.getElementById("website");
  const websiteIcon = document.querySelector(".website-label svg");

  websiteIcon.classList.remove("not-available");
  websiteContainer.classList.remove("not-available");
  websiteContainer.innerHTML = "";

  if (websiteUrl) {
    const websiteLink = document.createElement("a");
    websiteLink.href = websiteUrl;
    websiteLink.target = "_blank";
    websiteLink.rel = "noopener noreferrer";
    websiteLink.textContent = websiteUrl;
    websiteContainer.appendChild(websiteLink);
  } else {
    websiteContainer.textContent = "Not Available";
    websiteIcon.classList.add("not-available");
    websiteContainer.classList.add("not-available");
  }

  // Twitter
  const twitterUsername = data.twitter_username;
  const twitterContainer = document.getElementById("twitter");
  const twitterIcon = document.querySelector(".twitter-label svg");

  twitterIcon.classList.remove("not-available");
  twitterContainer.classList.remove("not-available");
  twitterContainer.innerHTML = "";

  if (twitterUsername) {
    const twitterLink = document.createElement("a");
    twitterLink.href = "https://x.com/" + twitterUsername;
    twitterLink.target = "_blank";
    twitterLink.rel = "noopener noreferrer";
    twitterLink.textContent = "@" + twitterUsername;
    twitterContainer.appendChild(twitterLink);
  } else {
    twitterContainer.textContent = "Not Available";
    twitterContainer.classList.add("not-available");
    twitterIcon.classList.add("not-available");
  }

  // Company
  const company = data.company;
  const companyContainer = document.getElementById("company");
  const companyIcon = document.querySelector(".company-label svg");

  // Reset previous state
  companyIcon.classList.remove("not-available");
  companyContainer.classList.remove("not-available");
  companyContainer.innerHTML = "";

  if (company) {
    const companyHandle = company.startsWith("@") ? company.slice(1) : company;
    const companyLink = document.createElement("a");
    companyLink.href = "https://github.com/" + companyHandle;
    companyLink.target = "_blank";
    companyLink.rel = "noopener noreferrer";
    companyLink.textContent = company;
    companyContainer.appendChild(companyLink);
  } else {
    companyContainer.textContent = "Not Available";
    companyContainer.classList.add("not-available");
    companyIcon.classList.add("not-available");
  }

  // Avatar
  const avatarUrl = data.avatar_url;
  const profileImageWrapper = document.getElementById("profile-image-wrapper");
  profileImageWrapper.style.backgroundImage = `url(${avatarUrl})`;
  profileImageWrapper.style.backgroundSize = "cover";
  profileImageWrapper.style.backgroundPosition = "center";
}

// On page load, fetch default user
document.addEventListener("DOMContentLoaded", () => {
  fetchGitHubUser("octocat");
});

// Search form submission

searchForm.addEventListener("input", () => {
  const errorSpan = document.getElementById("error");
  errorSpan.textContent = "";
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = searchInput.value.trim();
  const errorSpan = document.getElementById("error");

  errorSpan.textContent = "";
  searchInput.placeholder = "Search GitHub username…";

  if (!username) {
    errorSpan.textContent = "Enter a username";
    searchInput.placeholder = "";
    return;
  }

  fetchGitHubUser(username);
});
