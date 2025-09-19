import { Star, ThumbsUp, ThumbsDown, Hotel, Plane, Clock, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to format time to 12-hour AM/PM format
const formatTime12Hour = (timeString) => {
    if (!timeString || !timeString.includes(':')) return 'All Day';
    const [hour, minute] = timeString.split(':');
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
};

// Helper for star ratings
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 text-amber-500 fill-current" />)}
            {halfStar && <Star key="half" className="w-4 h-4 text-amber-500 fill-current" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />)}
        </div>
    );
};

// Main Itinerary Result Component
const ItineraryResult = ({ data, startDate }) => {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

    return (
        <div className="bg-slate-50 font-sans">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-12 py-16 px-4">
                <motion.div variants={itemVariants} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-teal-500"></div>
                    <h1 className="text-4xl font-extrabold mb-2 text-gray-800">{data.title}</h1>
                    <p className="text-md text-gray-500">{data.details}</p>
                </motion.div>

                <div className="space-y-10">
                    {data.days.map((day, dayIndex) => {
                        // Calculate the date for the current day
                        const currentDate = new Date(startDate);
                        currentDate.setDate(currentDate.getDate() + dayIndex);
                        const formattedDate = currentDate.toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        });

                        return (
                            <motion.div variants={itemVariants} key={dayIndex}>
                                <div className="text-center mb-6">
                                    <h2 className="text-3xl font-bold text-gray-700">{`Day ${dayIndex + 1}: ${day.title || 'A Day of Adventure'}`}</h2>
                                    <p className="text-md text-teal-600 font-semibold">{formattedDate}</p>
                                </div>
                                <div className="relative border-l-2 border-gray-200 ml-4">
                                    {day.activities.map((activity, activityIndex) => (
                                        <div key={activityIndex} className="mb-8 ml-8 relative">
                                            <div className="absolute -left-[1.2rem] top-1 h-5 w-5 rounded-full bg-teal-500 flex items-center justify-center ring-8 ring-slate-50">
                                                <Clock className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                                                <div className="flex flex-col md:flex-row gap-5">
                                                    <img src={activity.image_url} alt={activity.name} className="w-full md:w-44 h-40 object-cover rounded-lg" onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Found'}/>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-teal-600 text-sm mb-1">{formatTime12Hour(activity.time)}</p>
                                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{activity.name}</h3>
                                                        <div className="flex items-center mb-2 gap-2"><StarRating rating={activity.rating} /><span className="text-xs font-semibold text-gray-500">{activity.rating} / 5</span></div>
                                                        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                                                        <div className="text-xs space-y-2 text-gray-600">
                                                            <div className="flex items-start gap-2"><ThumbsUp className="w-4 h-4 text-green-500 flex-shrink-0" /><p><span className="font-semibold">Pro:</span> {activity.positive_review}</p></div>
                                                            <div className="flex items-start gap-2"><ThumbsDown className="w-4 h-4 text-red-500 flex-shrink-0" /><p><span className="font-semibold">Con:</span> {activity.negative_review}</p></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {day.foodSuggestion && <motion.div variants={itemVariants} className="mt-4 ml-8"><div className="inline-flex items-center gap-2 bg-teal-50 text-teal-800 py-2 px-4 rounded-full text-sm font-medium"><Utensils className="w-4 h-4" /><span>{day.foodSuggestion}</span></div></motion.div>}
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div variants={itemVariants} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-5 text-center flex items-center justify-center gap-2 text-gray-700"><Hotel /> Hotel Suggestions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.suggested_hotels.map((hotel, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg overflow-hidden border border-gray-200 hover:border-teal-400 transition-colors duration-300"><img src={hotel.image_url} alt={hotel.name} className="w-full h-36 object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Error'} /><div className="p-3"><h3 className="font-bold text-md text-gray-800 truncate">{hotel.name}</h3><div className="flex items-center my-1 gap-2"><StarRating rating={hotel.rating} /><span className="text-xs font-semibold text-gray-500">{hotel.rating}</span></div><p className="text-lg font-semibold text-teal-600">${hotel.price_per_night} <span className="text-sm text-gray-500 font-normal">/ night</span></p></div></div>
                        ))}
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-5 text-center flex items-center justify-center gap-2 text-gray-700"><Plane /> Transport Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.suggested_transport.map((transport, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-lg border border-gray-200 hover:border-teal-400 transition-colors duration-300"><h3 className="font-bold text-md text-gray-800">{transport.name}</h3><p className="text-gray-500 text-xs mb-1">{transport.duration}</p><div className="flex items-center gap-2"><StarRating rating={transport.rating} /><span className="text-xs font-semibold text-gray-500">{transport.rating}</span></div><p className="text-lg font-semibold text-teal-600 mt-2 text-right">${transport.price_per_person} <span className="text-sm text-gray-500 font-normal">/ person</span></p></div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ItineraryResult;

