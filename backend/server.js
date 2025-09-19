    import express from 'express';
    import cors from 'cors';
    
    const app = express();
    const port = process.env.PORT || 5000;
    
    // Middleware
    app.use(cors());
    app.use(express.json());
    
    // Mock AI function to generate an itinerary
    const generateMockItinerary = (travelDetails) => {
        const { destination, days, people, transport } = travelDetails;
    
        // A simple mock response for demonstration
        const itinerary = {
            title: `Your Custom AI-Generated Trip to ${destination}`,
            details: `A wonderful ${days}-day journey for ${people} people, traveling by ${transport}.`,
            days: Array.from({ length: days }, (_, i) => ({
                day: i + 1,
                title: `Day ${i + 1}: Exploring the Heart of ${destination}`,
                activities: [
                    "Morning: Visit a famous local landmark.",
                    "Afternoon: Enjoy lunch at a highly-rated restaurant.",
                    "Evening: Experience the local culture and nightlife."
                ]
            }))
        };
        return itinerary;
    };
    
    // API Route
    app.post('/api/itinerary', (req, res) => {
        console.log('Received itinerary request:', req.body);
        try {
            const itinerary = generateMockItinerary(req.body);
            res.json(itinerary);
        } catch (error) {
            console.error("Error generating itinerary:", error);
            res.status(500).json({ message: "Failed to generate itinerary. Please try again." });
        }
    });
    
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
    

