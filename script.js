const CORRECT_CODE = "202608170";
const STORAGE_KEY = "photo-lock-shared-state-v1";
const AUTO_UNLOCK_AT = new Date("2026-08-17T14:34:00+07:00").getTime();

const inputs = [...document.querySelectorAll(".digit-input")];
const statusMessage = document.getElementById("status-message");
const body = document.body;

function showStatus(message, isError = true) {
  statusMessage.textContent = message;
  statusMessage.classList.add("visible");
  statusMessage.style.color = isError ? "var(--error)" : "var(--success)";
}

function hideStatus() {
  statusMessage.classList.remove("visible");
  statusMessage.textContent = "";
}

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { unlocked: false };
  } catch (error) {
    return { unlocked: false };
  }
}

function writeState(unlocked) {
  const payload = { unlocked, updatedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (window.BroadcastChannel) {
    const channel = new BroadcastChannel("photo-lock-shared-state");
    channel.postMessage(payload);
    channel.close();
  }
}

function unlockImage() {
  body.classList.add("unlocked");
  writeState(true);
  showStatus("เปิดภาพแล้ว", false);
  setTimeout(() => {
    hideStatus();
  }, 1200);
}

function evaluateCode() {
  const currentCode = inputs.map((input) => input.value).join("");

  if (currentCode.length !== 9) {
    return;
  }

  if (currentCode === CORRECT_CODE) {
    unlockImage();
    return;
  }

  showStatus("รหัสผิด");
  inputs.forEach((input) => {
    input.value = "";
  });
  inputs[0].focus();
  setTimeout(() => {
    hideStatus();
  }, 1100);
}

function applyState(state) {
  const unlocked = Boolean(state && state.unlocked);
  if (unlocked || Date.now() >= AUTO_UNLOCK_AT) {
    body.classList.add("unlocked");
  } else {
    body.classList.remove("unlocked");
  }
}

inputs.forEach((input, index) => {
  input.addEventListener("input", (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);
    event.target.value = value;
    hideStatus();

    if (value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }

    evaluateCode();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      inputs[index - 1].focus();
    }

    if (event.key === "Enter") {
      evaluateCode();
    }
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();
    const pasted = (event.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 9);

    if (!pasted) {
      return;
    }

    pasted.split("").forEach((digit, digitIndex) => {
      if (inputs[digitIndex]) {
        inputs[digitIndex].value = digit;
      }
    });

    const nextTarget = inputs[Math.min(pasted.length, inputs.length - 1)];
    if (nextTarget) {
      nextTarget.focus();
    }

    evaluateCode();
  });
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    const nextState = event.newValue ? JSON.parse(event.newValue) : { unlocked: false };
    applyState(nextState);
  }
});

if (window.BroadcastChannel) {
  const channel = new BroadcastChannel("photo-lock-shared-state");
  channel.addEventListener("message", (event) => {
    applyState(event.data);
  });
}

function start() {
  const initialState = readState();
  applyState(initialState);

  if (Date.now() >= AUTO_UNLOCK_AT && !initialState.unlocked) {
    unlockImage();
  }

  inputs[0].focus();
}

start();
