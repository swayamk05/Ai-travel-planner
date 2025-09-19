
import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ItineraryResult from './components/ItineraryResult';
// Notice: We no longer need to import ItineraryForm here.

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  // This function handles the API call
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setItinerary(null); // Clear previous results
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); // Scroll to bottom
    try {
      const response = await fetch('http://localhost:5000/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* The Hero component now handles rendering the form internally. */}
        {/* We just pass the submit handler function to it as a prop. */}
        <Hero onItinerarySubmit={handleFormSubmit} />

        {/* The result section */}
        <div className="container mx-auto px-4 py-12">
          {loading && (
            <div className="text-center text-white">
              <p className="text-xl">Generating your perfect trip...</p>
              {/* Optional: Add a spinner here later */}
            </div>
          )}
          {itinerary && <ItineraryResult data={itinerary} />}
        </div>
      </main>
    </div>
  );
}

export default App;

