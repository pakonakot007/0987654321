const ACCESS_CODE = "111111";
const SECOND_ACCESS_CODE = "AOST";
const THIRD_ACCESS_CODE = "ODKNM";
const INVALID_FIFTH_CODE = "อะไรก็ได้";
const codeInput = document.getElementById("access-code");
const secondaryInput = document.getElementById("secondary-code");
const thirdInput = document.getElementById("third-code");
const fourthInput = document.getElementById("fourth-code");
const fifthInput = document.getElementById("fifth-code");
const unlockBtn = document.getElementById("unlock-btn");
const statusMessage = document.getElementById("status-message");
const lockScreen = document.getElementById("lock-screen");
const secretScreen = document.getElementById("secret-screen");

function sanitizeNumericInput(value) {
  return value.replace(/[^0-9]/g, "");
}

function sanitizeAlphaInput(value) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

codeInput.addEventListener("input", (event) => {
  const cleanValue = sanitizeNumericInput(event.target.value);
  event.target.value = cleanValue;
  statusMessage.textContent = "";
});

secondaryInput.addEventListener("input", (event) => {
  const cleanValue = sanitizeAlphaInput(event.target.value);
  event.target.value = cleanValue;
  statusMessage.textContent = "";
});

thirdInput.addEventListener("input", (event) => {
  const cleanValue = sanitizeAlphaInput(event.target.value);
  event.target.value = cleanValue;
  statusMessage.textContent = "";
});

fourthInput.addEventListener("input", () => {
  statusMessage.textContent = "";
});

fifthInput.addEventListener("input", () => {
  statusMessage.textContent = "";
});

function showStatus(message, isError = true) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "var(--danger)" : "var(--success)";
}

function unlock() {
  const code = codeInput.value.trim();
  const secondaryCode = secondaryInput.value.trim();
  const thirdCode = thirdInput.value.trim();
  const fourthCode = fourthInput.value.trim();
  const fifthCode = fifthInput.value.trim();

  if (
    code.length !== 6 ||
    secondaryCode.length !== 4 ||
    thirdCode.length !== 5 ||
    fourthCode.length === 0 ||
    fifthCode.length === 0 ||
    fifthCode === INVALID_FIFTH_CODE
  ) {
    showStatus("ACCESS DENIED — INVALID CODE");
    return;
  }

  if (
    code === ACCESS_CODE &&
    secondaryCode === SECOND_ACCESS_CODE &&
    thirdCode === THIRD_ACCESS_CODE
  ) {
    showStatus("ACCESS GRANTED", false);
    lockScreen.classList.add("hidden");
    secretScreen.classList.remove("hidden");
    codeInput.value = "";
    secondaryInput.value = "";
    thirdInput.value = "";
    fourthInput.value = "";
    fifthInput.value = "";
  } else {
    showStatus("ACCESS DENIED — INVALID CODE");
  }
}

unlockBtn.addEventListener("click", unlock);
codeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlock();
  }
});

secondaryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlock();
  }
});

thirdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlock();
  }
});

fourthInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlock();
  }
});

fifthInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlock();
  }
});
