import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { Mail, MapPin, Phone, Loader2, Check, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const settings = storageService.getSettings();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    
    setStatus('submitting');

    try {
      const response = await fetch("https://formspree.io/f/xeobbowk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          message: formData.message,
          _subject: `New submission from ${settings.siteName}`
        })
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-200px)] animate-fade-in">
       <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">We'd love to hear from you.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Info Section */}
          <div className="space-y-8">
            <div className="prose prose-lg text-slate-700 whitespace-pre-wrap">
               {settings.contactContent || "Reach out to us for any inquiries."}
            </div>
            
            <div className="space-y-6 mt-8">
               <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                     <Mail size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-900">Email Us</h3>
                     <p className="text-slate-500 mb-1">Our friendly team is here to help.</p>
                     <a href={`mailto:${settings.contactEmail}`} className="text-blue-600 font-medium hover:underline">{settings.contactEmail || "hello@bloggetway.com"}</a>
                  </div>
               </div>
               
               <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                     <MapPin size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-900">Office</h3>
                     <p className="text-slate-500 mb-1">Come say hello at our office HQ.</p>
                     <p className="text-slate-800">100 AI Boulevard, Tech City, TC 90210</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">First name</label>
                     <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Jane" 
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Last name</label>
                     <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Doe" 
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="you@company.com" 
                    required
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none" 
                    placeholder="Tell us how we can help..."
                    required
                  ></textarea>
               </div>
               
               <button 
                  disabled={status === 'submitting' || status === 'success'}
                  className={`w-full py-4 font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                     status === 'success' 
                       ? 'bg-green-600 hover:bg-green-700 text-white'
                       : status === 'error'
                       ? 'bg-red-600 hover:bg-red-700 text-white'
                       : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
               >
                  {status === 'submitting' ? (
                     <><Loader2 className="animate-spin" size={20}/> Sending...</>
                  ) : status === 'success' ? (
                     <><Check size={20}/> Message Sent!</>
                  ) : status === 'error' ? (
                     <><AlertCircle size={20}/> Failed to Send</>
                  ) : (
                     'Send Message'
                  )}
               </button>
               
               {status === 'success' && (
                  <p className="text-green-600 text-sm text-center mt-2 font-medium">
                     Thank you! We have received your message and will get back to you shortly.
                  </p>
               )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;