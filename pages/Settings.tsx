import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storage';
import { SiteSettings, FooterLink } from '../types';
import { Save, Twitter, Facebook, Linkedin, Instagram, BarChart, Hash, Layout, Share2, Upload, ArrowLeft, Image as ImageIcon, DollarSign, FileText, Mail, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings>(storageService.getSettings());
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network: keyof SiteSettings['socialLinks'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value
      }
    }));
  };

  // Footer Link Handlers
  const handleLinkChange = (section: 'footerExploreLinks' | 'footerLegalLinks', index: number, field: keyof FooterLink, value: string) => {
    const newLinks = [...settings[section]];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleChange(section, newLinks);
  };

  const addLink = (section: 'footerExploreLinks' | 'footerLegalLinks') => {
    const newLinks = [...settings[section], { label: 'New Link', url: '#' }];
    handleChange(section, newLinks);
  };

  const removeLink = (section: 'footerExploreLinks' | 'footerLegalLinks', index: number) => {
    const newLinks = settings[section].filter((_, i) => i !== index);
    handleChange(section, newLinks);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('faviconUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    storageService.saveSettings(settings);
    // Notify other components (like Layout) that settings have changed
    window.dispatchEvent(new Event('settingsUpdated'));
    
    // Simple toast notification
    const btn = document.getElementById('save-btn');
    if(btn) {
       const originalText = btn.innerText;
       btn.innerText = "Saved!";
       btn.classList.add('bg-green-600');
       setTimeout(() => {
          btn.innerText = originalText;
          btn.classList.remove('bg-green-600');
       }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate('/admin')} 
             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold shadow-sm hover:shadow transition-all"
             title="Back to Dashboard"
           >
             <ArrowLeft size={18} />
             <span>Back to Dashboard</span>
           </button>
           <div className="hidden md:block h-8 w-px bg-slate-200"></div>
           <div>
             <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
           </div>
        </div>
        <button 
          id="save-btn"
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* General Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
             <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Layout size={20} /></div>
             <h2 className="text-xl font-bold text-slate-800">General Information</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Site Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="My Awesome Blog"
                />
              </div>
              
              {/* Enhanced Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Logo</label>
                <div className="flex gap-4 items-start">
                   <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => logoInputRef.current?.click()}
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                        >
                          <Upload size={16}/> Upload Image
                        </button>
                        <input 
                          type="file" 
                          ref={logoInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full pl-3 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-500 focus:outline-none"
                          value={settings.logoUrl}
                          onChange={(e) => handleChange('logoUrl', e.target.value)}
                          placeholder="Or paste image URL..."
                        />
                      </div>
                   </div>
                   {settings.logoUrl ? (
                      <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative p-2">
                        <img 
                          src={settings.logoUrl} 
                          alt="Logo Preview" 
                          className="w-full h-full object-contain" 
                          onError={(e) => (e.currentTarget.style.opacity = '0.3')}
                        />
                      </div>
                   ) : (
                     <div className="w-20 h-20 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center shrink-0">
                        <span className="text-xs text-slate-400">No Logo</span>
                     </div>
                   )}
                </div>
              </div>

               {/* Favicon Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Favicon</label>
                <div className="flex gap-4 items-start">
                   <div className="flex-1 space-y-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => faviconInputRef.current?.click()}
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                        >
                          <ImageIcon size={16}/> Upload Icon
                        </button>
                        <input 
                          type="file" 
                          ref={faviconInputRef} 
                          className="hidden" 
                          accept="image/png, image/jpeg, image/x-icon, image/vnd.microsoft.icon"
                          onChange={handleFaviconUpload}
                        />
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full pl-3 pr-3 py-2 text-xs border border-slate-200 rounded-lg text-slate-500 focus:outline-none"
                          value={settings.faviconUrl}
                          onChange={(e) => handleChange('faviconUrl', e.target.value)}
                          placeholder="Or paste icon URL..."
                        />
                      </div>
                   </div>
                   {settings.faviconUrl ? (
                      <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative p-4">
                        <img 
                          src={settings.faviconUrl} 
                          alt="Favicon" 
                          className="w-8 h-8 object-contain" 
                          onError={(e) => (e.currentTarget.style.opacity = '0.3')}
                        />
                      </div>
                   ) : (
                     <div className="w-20 h-20 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-center shrink-0">
                        <span className="text-xs text-slate-400">No Icon</span>
                     </div>
                   )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Site Description</label>
              <textarea 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                placeholder="A brief description of your blog for SEO..."
              />
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Brand Color</label>
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <input 
                      type="color" 
                      className="h-12 w-24 rounded-lg border border-slate-200 cursor-pointer overflow-hidden p-1 bg-white"
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                    />
                  </div>
                  <span className="text-slate-600 font-mono bg-slate-100 px-3 py-1 rounded-md">{settings.primaryColor}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Pages Content Configuration */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
             <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><FileText size={20} /></div>
             <h2 className="text-xl font-bold text-slate-800">Pages Content</h2>
          </div>
          
          <div className="space-y-6">
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">About Page Content</label>
                <textarea 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-40"
                  value={settings.aboutContent}
                  onChange={(e) => handleChange('aboutContent', e.target.value)}
                  placeholder="Tell your story here..."
                />
                <p className="text-xs text-slate-400 mt-2">Displayed on the /about page.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Page Content</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32"
                    value={settings.contactContent}
                    onChange={(e) => handleChange('contactContent', e.target.value)}
                    placeholder="Instructions for contacting you..."
                  />
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email</label>
                  <div className="relative">
                     <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
                     <input 
                       type="email" 
                       className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pl-10"
                       value={settings.contactEmail}
                       onChange={(e) => handleChange('contactEmail', e.target.value)}
                       placeholder="hello@example.com"
                     />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Footer Copyright</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={settings.footerText}
                    onChange={(e) => handleChange('footerText', e.target.value)}
                    placeholder="All rights reserved."
                  />
               </div>
             </div>
          </div>
        </div>

        {/* Footer Navigation Settings */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><LinkIcon size={20} /></div>
             <h2 className="text-xl font-bold text-slate-800">Footer Navigation</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Explore Section */}
            <div>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700">Explore Links</h3>
                  <button onClick={() => addLink('footerExploreLinks')} className="text-xs flex items-center text-blue-600 hover:text-blue-800 font-medium">
                     <Plus size={14} className="mr-1"/> Add Link
                  </button>
               </div>
               <div className="space-y-3">
                  {settings.footerExploreLinks?.map((link, idx) => (
                     <div key={idx} className="flex gap-2 items-start group">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                           <input 
                              type="text" 
                              placeholder="Label"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                              value={link.label}
                              onChange={(e) => handleLinkChange('footerExploreLinks', idx, 'label', e.target.value)}
                           />
                           <input 
                              type="text" 
                              placeholder="URL"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                              value={link.url}
                              onChange={(e) => handleLinkChange('footerExploreLinks', idx, 'url', e.target.value)}
                           />
                        </div>
                        <button 
                           onClick={() => removeLink('footerExploreLinks', idx)}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
                  {(!settings.footerExploreLinks || settings.footerExploreLinks.length === 0) && (
                     <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No links added.</p>
                  )}
               </div>
            </div>

            {/* Legal Section */}
            <div>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700">Legal Links</h3>
                  <button onClick={() => addLink('footerLegalLinks')} className="text-xs flex items-center text-blue-600 hover:text-blue-800 font-medium">
                     <Plus size={14} className="mr-1"/> Add Link
                  </button>
               </div>
               <div className="space-y-3">
                  {settings.footerLegalLinks?.map((link, idx) => (
                     <div key={idx} className="flex gap-2 items-start group">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                           <input 
                              type="text" 
                              placeholder="Label"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                              value={link.label}
                              onChange={(e) => handleLinkChange('footerLegalLinks', idx, 'label', e.target.value)}
                           />
                           <input 
                              type="text" 
                              placeholder="URL"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                              value={link.url}
                              onChange={(e) => handleLinkChange('footerLegalLinks', idx, 'url', e.target.value)}
                           />
                        </div>
                        <button 
                           onClick={() => removeLink('footerLegalLinks', idx)}
                           className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  ))}
                  {(!settings.footerLegalLinks || settings.footerLegalLinks.length === 0) && (
                     <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">No links added.</p>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
             <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Hash size={20} /></div>
             <h2 className="text-xl font-bold text-slate-800">Integrations</h2>
          </div>

          <div className="space-y-6">
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                   <BarChart size={16} className="text-orange-500"/> Google Analytics ID
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pl-10"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                  <div className="absolute left-3 top-3.5 text-slate-400 font-bold">G-</div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Enter your Measurement ID (starts with G-) to enable tracking.</p>
             </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                   <DollarSign size={16} className="text-green-600"/> Google AdSense
                </label>
                <div className="relative">
                  <textarea 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-xs"
                    value={settings.googleAdSenseCode}
                    onChange={(e) => handleChange('googleAdSenseCode', e.target.value)}
                    placeholder="<script async src=&quot;https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js&quot;></script>"
                    rows={4}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Paste your AdSense script code here. It will be injected into the site header.</p>
             </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
             <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><Share2 size={20} /></div>
             <h2 className="text-xl font-bold text-slate-800">Social Connections</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Twitter size={16} className="text-sky-500" /> Twitter Profile
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Facebook size={16} className="text-blue-700" /> Facebook Page
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="facebook.com/page"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Linkedin size={16} className="text-blue-600" /> LinkedIn URL
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Instagram size={16} className="text-pink-600" /> Instagram Profile
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;