import React from 'react';
import { storageService } from '../services/storage';

const About: React.FC = () => {
  const settings = storageService.getSettings();

  return (
    <div className="bg-white min-h-[calc(100vh-200px)]">
      <div className="bg-slate-50 py-16 border-b border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">About Us</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">{settings.siteName}</p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16 max-w-4xl animate-fade-in">
        <div className="prose prose-lg prose-blue mx-auto text-slate-700 leading-relaxed whitespace-pre-wrap">
          {settings.aboutContent || "Content coming soon..."}
        </div>
        
        {/* Simple Team/Mission Section Decoration */}
        <div className="mt-16 pt-16 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
           <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-slate-500 font-medium">Monthly Readers</div>
           </div>
           <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-slate-500 font-medium">Articles Published</div>
           </div>
           <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
              <div className="text-slate-500 font-medium">AI Powered</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default About;