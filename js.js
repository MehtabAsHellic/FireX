let temperatureChart, humidityChart, statusPieChart, tempHistogram;
let allReadings = [];

const firebaseConfig = {
  apiKey: "AIzaSyBej-uMT-dT1WSO3Uyizl2qD1IlSJ1oWHo",
  authDomain: "firex-a0392.firebaseapp.com",
  databaseURL: "https://firex-a0392-default-rtdb.firebaseio.com",
  projectId: "firex-a0392",
  storageBucket: "firex-a0392.firebasestorage.app",
  messagingSenderId: "578053515636",
  appId: "1:578053515636:web:b0ea4597666bc01c93e421",
  measurementId: "G-TZ6WV5J2PY",
};

// Initialize Firebase and setup authentication
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Initialize Charts
function initCharts() {
  const tempCtx = document.getElementById("temperature-chart").getContext("2d");
  const humidityCtx = document
    .getElementById("humidity-chart")
    .getContext("2d");
  const statusCtx = document
    .getElementById("status-pie-chart")
    .getContext("2d");
  const histogramCtx = document
    .getElementById("temp-histogram")
    .getContext("2d");

  const chartConfig = {
    type: "line",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: "easeInOutQuart",
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  temperatureChart = new Chart(tempCtx, {
    ...chartConfig,
    data: {
      labels: [],
      datasets: [
        {
          label: "Temperature",
          borderColor: "#8B5CF6",
          data: [],
          fill: false,
        },
      ],
    },
  });

  humidityChart = new Chart(humidityCtx, {
    ...chartConfig,
    data: {
      labels: [],
      datasets: [
        {
          label: "Humidity",
          borderColor: "#1EAEDB",
          data: [],
          fill: false,
        },
      ],
    },
  });

  statusPieChart = new Chart(statusCtx, {
    type: "pie",
    data: {
      labels: ["Active", "Warning", "Error"],
      datasets: [
        {
          data: [3, 1, 1],
          backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  tempHistogram = new Chart(histogramCtx, {
    type: "bar",
    data: {
      labels: ["0-10", "11-20", "21-30", "31-40", "41-50", "50+"],
      datasets: [
        {
          label: "Temperature Distribution",
          data: [0, 0, 0, 0, 0, 0],
          backgroundColor: "#8B5CF6",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Authentication
firebase
  .auth()
  .signInWithEmailAndPassword("121mehtab2065@sjcem.edu.in", "IAMWINNER@100")
  .then(() => {
    console.log("Authenticated successfully");
    initCharts();
    setupRealtimeUpdates();
  })
  .catch((error) => {
    console.error("Authentication error:", error);
  });

function setupRealtimeUpdates() {
  const sensorRef = database.ref("sensor_data");

  sensorRef.on("value", (snapshot) => {
    const allData = snapshot.val();
    const readings = [];

    for (const deviceId in allData) {
      const deviceData = allData[deviceId];
      for (const pushId in deviceData) {
        const entry = deviceData[pushId];
        entry.timestamp = new Date(entry.timestamp).toLocaleString();
        readings.push(entry);
      }
    }

    readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    allReadings = readings;
    updateDashboard(readings);
    updateCharts(readings);
    updateHistogram(readings);
  });
}

function updateCharts(readings) {
  const recentReadings = readings.slice(0, 10).reverse();

  const labels = recentReadings.map((r) => {
    const date = new Date(r.timestamp);
    return date.toLocaleTimeString();
  });

  temperatureChart.data.labels = labels;
  temperatureChart.data.datasets[0].data = recentReadings.map(
    (r) => r.temperature
  );
  temperatureChart.update("none");

  humidityChart.data.labels = labels;
  humidityChart.data.datasets[0].data = recentReadings.map((r) => r.humidity);
  humidityChart.update("none");
}

function updateHistogram(readings) {
  const tempRanges = [0, 0, 0, 0, 0, 0];

  readings.forEach((reading) => {
    const temp = reading.temperature;
    if (temp <= 10) tempRanges[0]++;
    else if (temp <= 20) tempRanges[1]++;
    else if (temp <= 30) tempRanges[2]++;
    else if (temp <= 40) tempRanges[3]++;
    else if (temp <= 50) tempRanges[4]++;
    else tempRanges[5]++;
  });

  tempHistogram.data.datasets[0].data = tempRanges;
  tempHistogram.update("none");
}

function updateDashboard(readings) {
  const latest = readings[0];

  document.getElementById("temperature-card").querySelector("p").textContent =
    latest?.temperature?.toFixed(1) || "--";
  document.getElementById("humidity-card").querySelector("p").textContent =
    latest?.humidity?.toFixed(1) || "--";

  updateStatusIndicator("flame", latest?.flame);
  updateStatusIndicator("gas", latest?.gas);

  const alerts = [];
  if (latest?.flame) alerts.push("Flame detected!");
  if (latest?.gas) alerts.push("Gas detected!");
  if (latest?.temperature > 50) alerts.push("High temperature!");

  updateAlerts(alerts);

  const tbody = document.getElementById("sensor-history");
  tbody.innerHTML = readings
    .slice(0, 10)
    .map(
      (entry) => `
            <tr>
                <td>${entry.timestamp}</td>
                <td>${entry.temperature?.toFixed(1)}°C</td>
                <td>${entry.humidity?.toFixed(1)}%</td>
                <td>${getStatusIcon(entry.flame)}</td>
                <td>${getStatusIcon(entry.gas)}</td>
                <td>${getStatusIcon(entry.sound)}</td>
            </tr>
        `
    )
    .join("");
}

function updateStatusIndicator(type, status) {
  const indicator = document
    .getElementById(`${type}-card`)
    .querySelector(".status-indicator");
  indicator.className = `status-indicator ${status ? "danger" : "safe"}`;
}

function getStatusIcon(value) {
  return `<span class="status-indicator ${value ? "danger" : "safe"}"></span>`;
}

function updateAlerts(alerts) {
  const alertSection = document.getElementById("alerts");
  const alertList = document.getElementById("alert-list");

  if (alerts.length > 0) {
    alertSection.style.display = "block";
    alertList.innerHTML = alerts
      .map(
        (alert) => `
                <div class="alert-item">
                    <span class="alert-badge">!</span> ${alert}
                </div>
            `
      )
      .join("");
  } else {
    alertSection.style.display = "none";
  }
}

function exportData(format) {
  if (format === "json") {
    const dataStr = JSON.stringify(allReadings, null, 2);
    downloadFile(dataStr, "sensor-data.json", "application/json");
  } else if (format === "csv") {
    const headers = [
      "timestamp",
      "temperature",
      "humidity",
      "flame",
      "gas",
      "sound",
    ];
    const csvContent = [
      headers.join(","),
      ...allReadings.map((reading) =>
        headers.map((header) => reading[header]).join(",")
      ),
    ].join("\n");
    downloadFile(csvContent, "sensor-data.csv", "text/csv");
  }
}

function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
