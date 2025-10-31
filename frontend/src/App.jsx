import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ItineraryResult from './components/ItineraryResult';
import axios from 'axios'; // This is correct

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tripRequest, setTripRequest] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setItinerary(null);
    setError(null);
    setTripRequest(formData);

    // Smooth scroll
    setTimeout(() => {
      const resultSection = document.getElementById('result-section');
      if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // --- THIS IS THE FIX ---
      // axios.post(url, data, [config])
      // 1. The data (formData) is the second argument.
      // 2. You don't need to stringify it.
      const response = await axios.post(`${API_URL}/api/itinerary`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      // --- END OF FIX ---

      // --- THIS IS THE FIX ---
      // 3. The JSON data is already in response.data.
      // 4. You do not call response.json().
      setItinerary(response.data);
      // --- END OF FIX ---

    } catch (err) {
      console.error('Failed to fetch itinerary:', err);

      // --- IMPROVED ERROR HANDLING ---
      // Get the error message from the server (if it exists)
      let errorMessage = 'An unknown error occurred.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message; // Error from our backend
      } else if (err.message) {
        errorMessage = err.message; // General network error
      }
      setError(errorMessage);
      // --- END OF ERROR HANDLING ---

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero onItinerarySubmit={handleFormSubmit} />
        
        <div id="result-section" className="container mx-auto px-4 py-12">
          {loading && (
            <div className="text-center text-gray-700">
              <p className="text-xl font-semibold">Crafting your personalized journey...</p>
              <p className="text-sm text-gray-500">This can take a moment as the AI builds your trip.</p>
            </div>
          )}

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