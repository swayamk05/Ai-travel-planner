    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Menu, X } from 'lucide-react';
    
    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const navLinks = ["Explore", "Travel Guides", "Hotels", "Activities"];
    
      const menuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
      };
    
      const linkVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
      };
    
      return (
        <header className="absolute top-0 left-0 right-0 z-20">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-white"
            >
              TravelAI
            </motion.div>
    
            {/* Desktop Menu */}
            <motion.ul
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="hidden md:flex items-center space-x-8"
            >
              {navLinks.map((link) => (
                <motion.li key={link} variants={linkVariants}>
                  <a href="#" className="text-white hover:text-gray-200 transition-colors">
                    {link}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={linkVariants}>
                <button className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-all">
                  Start Planning
                </button>
              </motion.li>
            </motion.ul>
    
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
    
          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="md:hidden bg-white/10 backdrop-blur-md"
            >
              <ul className="flex flex-col items-center space-y-4 py-6">
                {navLinks.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>
                      {link}
                    </a>
                  </li>
                ))}
                <li>
                  <button className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full w-full">
                    Start Planning
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </header>
      );
    };
    
    export default Navbar;
    

