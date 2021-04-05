if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

// Get pesky elements
const maxVol = document.getElementById("maxVol");
const minVol = document.getElementById("minVol");
const volStep = document.getElementById("volStep");

const maxVolLabel = document.getElementById("maxVolLabel");
const minVolLabel = document.getElementById("minVolLabel");
const volStepLabel = document.getElementById("volStepLabel");

const onButton = document.getElementById("on");
const offButton = document.getElementById("off");

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
      // TODO show success!
    })
    .catch((e) => {
      // TODO show fail!
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
