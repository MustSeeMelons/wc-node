const maxVol = document.getElementById("maxVol");
const minVol = document.getElementById("minVol");
const volStep = document.getElementById("volStep");

const maxVolLabel = document.getElementById("maxVolLabel");
const minVolLabel = document.getElementById("minVolLabel");
const volStepLabel = document.getElementById("volStepLabel");

const playButton = document.getElementById("on");
const pauseButton = document.getElementById("off");

const sonarOnButton = document.getElementById("sonarOn");
const sonarOffButton = document.getElementById("sonarOff");

const notification = document.getElementById("notification");
notification.onanimationend = () => {
  notification.classList.remove(
    "notify",
    "alert-success",
    "alert-danger",
    "alert-warning"
  );
};

const simpleHandler = (successMsg = "Done!") => (response) => {
  if (response.status !== 200) {
    showNotification("Something is a foot!", ["alert-danger"]);
  } else {
    showNotification(successMsg, ["alert-success"]);
  }
};

const errHandler = (err) => {
  showNotification("Something is a foot!", ["alert-danger"]);
};

const rebootBtn = document.getElementById("reboot");
rebootBtn.addEventListener("click", () => {
  fetch("reboot")
    .then(simpleHandler)
    .then(() => {
      document.body.classList.add("no-scroll");
      document.getElementById("bg").style.display = "flex";
      document.getElementById("bb-msg").innerText = "Come back in 5 minutes!";
    })
    .catch(errHandler);
});

const shutdownBtn = document.getElementById("shutdown");
shutdownBtn.addEventListener("click", () => {
  fetch("shutdown")
    .then(simpleHandler)
    .then(() => {
      document.body.classList.add("no-scroll");
      document.getElementById("bg").style.display = "flex";
      document.getElementById("bb-msg").innerText = "Shutting down, bye.";
    })
    .catch(errHandler);
});

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
    .then(simpleHandler())
    .catch(errHandler);
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
    .then(simpleHandler())
    .catch(errHandler);
};

const toggleSonar = (value) => {
  fetch("sonar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value,
    }),
  })
    .then(simpleHandler())
    .catch(errHandler);
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

playButton.addEventListener("click", () => {
  toggleState(true);
});

pauseButton.addEventListener("click", () => {
  toggleState(false);
});

sonarOnButton.addEventListener("click", () => {
  toggleSonar(false);
});

sonarOffButton.addEventListener("click", () => {
  toggleSonar(true);
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

var socket = io();

const nowPlaying = document.getElementById("playing");
socket.on("song", (data) => {
  nowPlaying.innerText = data;
});

const onAddStream = () => {
  const name = document.getElementById("streamName").value;
  const url = document.getElementById("streamName").value;

  if (name && url) {
    return true;
  } else {
    showNotification("Invalid input!", ["alert-danger"]);
    return false;
  }
};

const streamSelect = document.getElementById("activeStream");
streamSelect.addEventListener("change", (event) => {
  fetch("active", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: event.target.value,
    }),
  })
    .then(simpleHandler())
    .catch(errHandler);
});
