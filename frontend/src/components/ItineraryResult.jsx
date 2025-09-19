    import React from 'react';
    import { motion } from 'framer-motion';
    import { Calendar, Sun, Moon, MapPin } from 'lucide-react';
    
    const ItineraryResult = ({ data }) => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      };
    
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };
    
      if (!data) return null;
    
      return (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto mt-12"
        >
          <h2 className="text-3xl font-bold text-center mb-2">{data.title}</h2>
          <p className="text-center text-gray-500 mb-8">{data.details}</p>
    
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {data.days.map((day) => (
              <motion.div key={day.day} variants={itemVariants} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center text-xl font-semibold text-blue-600 mb-4">
                  <Calendar className="mr-3" size={24} />
                  <h3>Day {day.day}: {day.title}</h3>
                </div>
                <ul className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-3 mt-1">
                        {activity.toLowerCase().includes('morning') && <Sun size={20} className="text-yellow-500" />}
                        {activity.toLowerCase().includes('afternoon') && <MapPin size={20} className="text-green-500" />}
                        {activity.toLowerCase().includes('evening') && <Moon size={20} className="text-indigo-500" />}
                      </div>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      );
    };
    
    export default ItineraryResult;
    

