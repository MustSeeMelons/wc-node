// Get pesky elements
const maxVol = document.getElementById("maxVol");
const minVol = document.getElementById("minVol");
const volStep = document.getElementById("volStep");

const maxVolLabel = document.getElementById("maxVolLabel");
const minVolLabel = document.getElementById("minVolLabel");
const volStepLabel = document.getElementById("volStepLabel");

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
