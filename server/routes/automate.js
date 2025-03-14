import express from "express";
import { createTankController } from "../controller/createTankController.js";
import { configureSheets } from "../config/sheets.js";
import { createSheetService } from "../config/sheetService.js";
import dotenv from "dotenv";
dotenv.config();

// const automateRouter = express.Router();
// const app = express();
// app.use(express.json());

// automateRouter.post("/start-automation", async (req, res) => {
//     if (!automationRunning) {
//       automationRunning = true;
//       monitorInterval = setInterval(monitorTanks, 3000);
//       console.log("Automation Started");
//       res.json({ message: "Automation started" });
//     } else {
//       res.json({ message: "Already running" });
//     }
//   });

// automateRouter.post("/stop-automation", async (req, res) => {
// if (automationRunning) {
//     clearInterval(monitorInterval);
//     automationRunning = false;
//     console.log("Automation Stopped");
//     res.json({ message: "Automation stopped" });
// } else {
//     res.json({ message: "Already stopped" });
// }
// });

const sheets = configureSheets();
const sheetService = createSheetService(sheets, process.env.SPREADSHEET_ID);
const tankController = createTankController(sheetService);

// Verify controller methods exist
if (!tankController?.handleStartMonitoring) {
    throw new Error("Tank controller methods not properly initialized");
}

const automateRouter = express.Router();
// Start tank monitoring
automateRouter.post("/start", tankController.handleStartMonitoring);

// Stop tank monitoring
automateRouter.post("/stop", tankController.handleStopMonitoring);

// Get current tank system status
automateRouter.get("/status", (req, res) => {
  res.status(200).json({
    success: true,
    data: tankController.getState()
  });
});

export default automateRouter;