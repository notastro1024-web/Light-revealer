
import React from 'react';
import Icon from '../components/Icon';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black py-20 animate-fadeIn flex items-center">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-cinzel text-5xl font-bold text-white">Begin Your <span className="text-yellow-400">Creation</span></h1>
            <p className="text-gray-400 mt-4 max-w-lg">Have a question about a collection piece, or wish to start a bespoke commission? Our artisans are ready to assist you. Fill out the form, or for a more direct conversation, connect with us on WhatsApp.</p>
            <a 
              href="https://wa.me/1234567890" // Replace with actual number
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 px-8 py-3 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
            >
              <Icon name="whatsapp" className="h-6 w-6" />
              <span>Inquire on WhatsApp</span>
            </a>
          </div>
          <div className="bg-gray-900/50 p-8 border border-gray-800 rounded-lg glow-subtle">
            <form>
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" id="name" className="block w-full p-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="Your Name" required />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email Address</label>
                <input type="email" id="email" className="block w-full p-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="your.email@example.com" required />
              </div>
              <div className="mb-5">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">Your Message</label>
                <textarea id="message" rows={4} className="block w-full p-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" placeholder="Briefly describe your inquiry or desired art piece..."></textarea>
              </div>
              <button type="submit" className="w-full px-8 py-3 font-semibold text-black bg-yellow-400 rounded-md hover:bg-yellow-300 transition-colors duration-300">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
