import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ItineraryResult from './components/ItineraryResult';

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tripRequest, setTripRequest] = useState(null);
  // NEW: State to store and display error messages
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setItinerary(null);
    setError(null); // Clear previous errors
    setTripRequest(formData);
    
    // Smooth scroll to where the results will appear
    // Using a slight delay to ensure the UI updates before scrolling
    setTimeout(() => {
        const resultSection = document.getElementById('result-section');
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);

    try {
      const response = await fetch('http://localhost:5000/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // NEW: Check if the response from the server is successful
      if (!response.ok) {
        // If not, get the error message from the server's response
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred.');
      }

      const data = await response.json();
      setItinerary(data);

    } catch (err) {
      console.error('Failed to fetch itinerary:', err);
      // Set the user-friendly error message to be displayed on the screen
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Changed to bg-slate-50 to match the light theme of the results page
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero onItinerarySubmit={handleFormSubmit} />
        
        {/* Added an ID here for the scroll-to-view functionality */}
        <div id="result-section" className="container mx-auto px-4 py-12">
          {loading && (
            <div className="text-center text-gray-700">
              <p className="text-xl font-semibold">Crafting your personalized journey...</p>
              <p className="text-sm text-gray-500">This can take a moment as the AI builds your trip.</p>
            </div>
          )}

          {/* NEW: Display the error message if one occurs */}
          {error && (
            <div className="max-w-md mx-auto text-center bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
                <strong className="font-bold">Oops! </strong>
                <span className="block sm:inline">{error}</span>
            </div>
          )}

          {itinerary && tripRequest && <ItineraryResult data={itinerary} startDate={tripRequest.startDate} />}
        </div>
      </main>
    </div>
  );
}

export default App;

