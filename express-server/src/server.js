const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());

// Endpoint for bar chart data
app.get("/bar-chart", (req, res) => {
  const dataPath = path.join(__dirname, "data", "barChart.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint for pie chart data
app.get("/pie-chart", (req, res) => {
  const dataPath = path.join(__dirname, "data", "pieChart.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint for sunburst chart data
app.get("/sunburst-chart", (req, res) => {
  const dataPath = path.join(__dirname, "data", "sunburst.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
