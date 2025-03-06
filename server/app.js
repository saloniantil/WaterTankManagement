import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use("/", authRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename) || path.resolve();

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './server/service-account.json';
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
if (!fs.existsSync(credentialsPath)) {
    console.error('Missing service-account.json file.');
    process.exit(1);
  }
// Authenticate Google Sheets API
const auth = new google.auth.GoogleAuth({
    keyFile: "service-account.json", 
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});


const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env.SPREADSHEET_ID;

async function updateSheet(range, values) {
    try {
        const formattedValues = values.flat(); 

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: formattedValues },
        });
    } catch (error) {
        console.error("Error updating Google Sheet:", error);
        throw error;
    }
}

async function getLastRow(sheetName) {
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetName}!A:A`, // Fetch only column A to determine the last row
        });

        const numRows = res.data.values ? res.data.values.length : 0;
        console.log(`Last row in ${sheetName}:`, numRows);
        return numRows;
    } catch (error) {
        console.error("Error fetching last row:", error);
        throw error;
    }
}

app.get("/get-last-row", async (req, res) => {
    try {
        const resData = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "status!A:A", // Get all values in column A (date/time)
        });

        const lastRow = resData.data.values ? resData.data.values.length : 0;
        res.status(200).json({ success: true, lastRow });

    } catch (error) {
        console.error("Error fetching last row:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post("/update-tank-status", async (req, res) => {

    if (!req.body || !req.body.range || !req.body.values) {
        return res.status(400).send({ success: false, message: "Missing required fields: range or values" });
    }

    try {

        const { range, values } = req.body; 
        await updateSheet(range, [values]);
        res.status(200).send({ success: true, message: "Sheet updated successfully" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
});

app.listen(3000, () => { 
    connectDB();
    console.log("server started at http://localhost:3000");
});
 