import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

// --- Configuration ---
const app = express();
const port = process.env.PORT;

// --- IMPORTANT: PASTE YOUR API KEYS HERE ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
// ----------------------------------------------------

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Initialize Gemini ---
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Helper Functions ---
const getImageUrl = async (query) => {
    if (!PEXELS_API_KEY || PEXELS_API_KEY === PEXELS_API_KEY) {
        return `https://placehold.co/600x400/e2e8f0/64748b?text=${query.replace(/\s/g, '+')}`;
    }
    try {
        const response = await axios.get(`https://api.pexels.com/v1/search`, {
            params: { query: query, per_page: 1, orientation: 'landscape' },
            headers: { Authorization: PEXELS_API_KEY }
        });
        if (response.data.photos && response.data.photos.length > 0) { return response.data.photos[0].src.large; }
    } catch (error) { console.error(`Failed to fetch image from Pexels for "${query}":`, error.message); }
    return `https://placehold.co/600x400/e2e8f0/64748b?text=${query.replace(/\s/g, '+')}`;
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- API Route ---
app.post('/api/itinerary', async (req, res) => {
    console.log('Received final PRO request:', req.body);
    const maxRetries = 3;
    let lastError = null;
    const USD_TO_INR_RATE = 83.5;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { source, destination, startDate, endDate, people, budget, transport } = req.body;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            if (tripDays <= 0) { return res.status(400).json({ message: "End date must be after start date." }); }
             const budgetInINR = Math.round(parseFloat(budget) * USD_TO_INR_RATE);
            // --- FINAL, STRICTEST PROMPT ---
            const prompt = `
                You are a travel agent AI that ONLY responds in perfect JSON.
                Generate a detailed itinerary based on these details:
                - Origin: ${source}, Destination: ${destination}
                - Dates: ${startDate} to ${endDate} (${tripDays} days)
                - Travelers: ${people}
                - Budget: ₹${budgetInINR} INR per person.
                - Transport Preference: ${transport}.

                **CRITICAL INSTRUCTIONS FOR JSON STRUCTURE:**
                1.  The top-level object must have keys: "title", "details", "days", "suggested_hotels", "suggested_transport".
                2.  Each object inside the "days" array MUST have the keys: "day" (a number), "title" (a string), "activities" (an array), and "foodSuggestion" (a string).
                3.  Each object inside the "activities" array MUST have keys: "time", "name", "description", "rating", "positive_review", "negative_review".
                4.  Each object inside "suggested_hotels" MUST have keys: "name", "price_per_night" (as a number, e.g., 150), and "rating".
                5.  Each object inside "suggested_transport" MUST have keys: "name" (be specific, e.g., "IndiGo 6E-2045"), "price_per_person" (as a number), "rating", and "duration"
                6.All monetary values MUST be in Indian Rupees (INR).
.
                
                Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const rawText = response.text();
            
            console.log("--- RAW AI RESPONSE ---");
            console.log(rawText);
            console.log("-----------------------");
            
            let itinerary = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

            if (!itinerary || !Array.isArray(itinerary.days)) {
                throw new Error("Received invalid data structure from AI: 'days' array is missing.");
            }

            for (const day of itinerary.days) {
                if (day && Array.isArray(day.activities)) {
                    for (const activity of day.activities) {
                        activity.image_url = await getImageUrl(activity.name);
                    }
                }
            }
            if (itinerary.suggested_hotels && Array.isArray(itinerary.suggested_hotels)) {
                for (const hotel of itinerary.suggested_hotels) {
                    hotel.image_url = await getImageUrl(hotel.name);
                }
            }
            return res.json(itinerary);

        } catch (error) {
            lastError = error;
            if (error.message && (error.message.includes('503') || error.message.includes("invalid data structure"))) {
                console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying...`);
                await sleep(attempt * 2000);
            } else {
                console.error("A non-retryable error occurred:", error);
                break;
            }
        }
    }
    console.error("All retries failed. Sending error to client.", lastError);
    res.status(500).json({ message: "Failed to generate itinerary. The AI may be returning an unexpected format. Please try a different query." });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});