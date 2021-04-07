// Get pesky elements
const maxVol = document.getElementById("maxVol");
const minVol = document.getElementById("minVol");
const volStep = document.getElementById("volStep");

const maxVolLabel = document.getElementById("maxVolLabel");
const minVolLabel = document.getElementById("minVolLabel");
const volStepLabel = document.getElementById("volStepLabel");

const onButton = document.getElementById("on");
const offButton = document.getElementById("off");

const notification = document.getElementById("notification");
notification.onanimationend = () => {
  notification.classList.remove(
    "notify",
    "alert-success",
    "alert-danger",
    "alert-warning"
  );
};

// Set pesky label values
maxVolLabel.innerText = `Max Volume: ${maxVol.value}`;
minVolLabel.innerText = `Min Volume: ${minVol.value}`;
volStepLabel.innerText = `Volume Step: ${volStep.value}`;

const applyVolume = (type, value) => {
  fetch("volume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      value,
    }),
  })
    .then((response) => {
      if (response.status !== 200) {
        showNotification("Something is a foot!", ["alert-danger"]);
      } else {
        showNotification("Applied!", ["alert-success"]);
      }
    })
    .catch((e) => {
      showNotification("Something is a foot!", ["alert-danger"]);
    });
};

const toggleState = (value) => {
  fetch("state", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value,
    }),
  })
    .then((response) => {
      if (response.status !== 200) {
        showNotification("Something is a foot!", ["alert-danger"]);
      } else {
        showNotification("Toggled!", ["alert-success"]);
      }
    })
    .catch((e) => {
      showNotification("Something is a foot!", ["alert-danger"]);
    });
};

// Add pesky change listeners
maxVol.addEventListener("change", (e) => {
  const val = e.target.value;
  maxVolLabel.innerText = `Max Volume: ${val}`;
  applyVolume("max", val);
});

minVol.addEventListener("change", (e) => {
  const val = e.target.value;
  minVolLabel.innerText = `Min Volume: ${val}`;
  applyVolume("min", val);
});

volStep.addEventListener("change", (e) => {
  const val = e.target.value;
  volStepLabel.innerText = `Volume Step: ${val}`;
  applyVolume("step", val);
});

onButton.addEventListener("click", () => {
  toggleState(true);
});

offButton.addEventListener("click", () => {
  toggleState(false);
});

const notifConfig = {
  success: {
    text: "Success",
    classList: ["alert-success"],
  },
  fail: {
    text: "Fail",
    classList: ["alert-danger"],
  },
};

const showNotification = (text, styleClasses) => {
  notification.innerText = text;
  notification.classList.add("notify", ...styleClasses);
};

if (window.location.hash) {
  const val = window.location.hash.replace("#", "");

  const conf = notifConfig[val];

  if (conf) {
    showNotification(conf.text, conf.classList);
  } else {
    showNotification("I just borked.", ["alert-warning"]);
  }
}
