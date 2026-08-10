const ACCESS_CODE = "111111";
const codeInput = document.getElementById("access-code");
const unlockBtn = document.getElementById("unlock-btn");
const statusMessage = document.getElementById("status-message");
const lockScreen = document.getElementById("lock-screen");
const secretScreen = document.getElementById("secret-screen");

function sanitizeInput(value) {
  return value.replace(/[^0-9]/g, "");
}

codeInput.addEventListener("input", (event) => {
  const cleanValue = sanitizeInput(event.target.value);
  event.target.value = cleanValue;
  statusMessage.textContent = "";
});

function showStatus(message, isError = true) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? "var(--danger)" : "var(--success)";
}

function unlock() {
  const code = codeInput.value.trim();

  if (code.length !== 6) {
    showStatus("ACCESS DENIED — INVALID CODE");
    return;
  }

  if (code === ACCESS_CODE) {
    showStatus("ACCESS GRANTED", false);
    lockScreen.classList.add("hidden");
    secretScreen.classList.remove("hidden");
    codeInput.value = "";
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
