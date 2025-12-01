import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenTool, 
  Settings, 
  LogOut, 
  Globe, 
  MessageSquare, 
  Menu, 
  X,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { authService } from '../services/auth';
import { storageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState(storageService.getSettings());

  // Listen for settings updates from the Settings page
  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSettings(storageService.getSettings());
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  // Apply Favicon and AdSense
  useEffect(() => {
    // Update Favicon
    if (settings.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl;
    }

    // Inject AdSense
    if (settings.googleAdSenseCode) {
      // Very basic injection mechanism. In production use a library or dangerouslySetInnerHTML carefully.
      // This is a simulation of "applying" the code.
      // Check if already injected to avoid dupes
      if (!document.getElementById('adsense-script')) {
        const div = document.createElement('div');
        div.id = 'adsense-script';
        div.style.display = 'none';
        div.innerHTML = settings.googleAdSenseCode;
        document.body.appendChild(div);
        
        // Execute scripts inside the injected HTML
        const scripts = div.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const script = document.createElement('script');
          if (scripts[i].src) {
             script.src = scripts[i].src;
             script.async = true;
          } else {
             script.innerHTML = scripts[i].innerHTML;
          }
          document.head.appendChild(script);
        }
      }
    }
  }, [settings.faviconUrl, settings.googleAdSenseCode]);

  // If on login page, don't show admin sidebar/header, just content
  if (location.pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/posts', icon: PenTool, label: 'All Posts' },
    { to: '/admin/new-post', icon: Sparkles, label: 'Create Post' },
    { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/admin/chat', icon: MessageSquare, label: 'AI Assistant' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-slate-50 font-sans">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-white shadow-2xl z-20">
          <div className="p-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="w-8 h-8 rounded object-contain bg-white" 
                  onError={handleImageError}
                />
              ) : settings.faviconUrl ? (
                <img 
                  src={settings.faviconUrl} 
                  alt="Logo" 
                  className="w-8 h-8 rounded object-contain bg-white" 
                  onError={handleImageError}
                />
              ) : null}
              <div>
                <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {settings.siteName || 'BlogGetWay'}
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide uppercase">Admin Console</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  location.pathname === link.to 
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <link.icon size={20} className={location.pathname === link.to ? 'text-blue-400' : 'group-hover:text-white transition-colors'} />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
            
            <div className="my-8 border-t border-slate-800 mx-4"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3.5 text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded-xl transition-all group mt-2"
            >
              <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
          <div className="p-4 bg-slate-950 text-xs text-slate-600 text-center">
             v1.3.0 &bull; <span className="text-blue-500 font-semibold">Built with BlogGetWay</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          {/* Mobile Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden z-10 sticky top-0">
             <div className="flex items-center gap-2">
                {settings.logoUrl ? (
                   <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 object-contain" onError={handleImageError} />
                ) : settings.faviconUrl ? (
                   <img src={settings.faviconUrl} alt="Logo" className="w-6 h-6 object-contain" onError={handleImageError} />
                ) : null}
                <span className="font-bold text-slate-800 text-lg">{settings.siteName || 'BlogGetWay'} Admin</span>
             </div>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-slate-100 rounded-lg">
                {mobileMenuOpen ? <X /> : <Menu />}
             </button>
          </header>
          
          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
             <div className="md:hidden fixed inset-0 bg-slate-900/95 z-50 pt-20 px-6 backdrop-blur-sm">
                <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 text-white p-2">
                  <X size={24} />
                </button>
                <div className="space-y-4">
                  {adminLinks.map(link => (
                    <Link 
                      key={link.to} 
                      to={link.to} 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="flex items-center space-x-4 py-4 text-lg text-slate-300 border-b border-slate-800"
                    >
                      <link.icon size={24}/>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  <button onClick={handleLogout} className="w-full flex items-center space-x-4 py-4 text-lg text-red-400 border-b border-slate-800">
                    <LogOut size={24} />
                    <span>Logout</span>
                  </button>
                </div>
             </div>
          )}

          <div className="flex-1 overflow-auto p-6 md:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Public Layout
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-xl z-50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            {settings.logoUrl ? (
               <img src={settings.logoUrl} alt={settings.siteName} className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" onError={handleImageError} />
            ) : settings.faviconUrl ? (
               <img src={settings.faviconUrl} alt={settings.siteName} className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" onError={handleImageError} />
            ) : null}
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
              {settings.siteName || 'BlogGetWay'}
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-10">
            {publicLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                   location.pathname === link.to ? 'text-blue-600' : 'text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link 
              to="/admin" 
              className="hidden md:inline-flex items-center px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Admin Portal
            </Link>
            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-6 space-y-6 absolute w-full shadow-xl">
            {publicLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="block text-lg font-medium text-slate-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="block text-lg font-medium text-blue-600">Access Admin Dashboard</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                 {settings.logoUrl ? (
                   <img src={settings.logoUrl} alt="Logo" className="h-6 w-auto opacity-80" onError={handleImageError} />
                 ) : settings.faviconUrl ? (
                   <img src={settings.faviconUrl} alt="Logo" className="h-6 w-auto opacity-80" onError={handleImageError} />
                 ) : null}
                 <h3 className="font-bold text-xl text-slate-900 tracking-tight">{settings.siteName || 'BlogGetWay'}</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {settings.siteDescription || 'The ultimate AI-powered blogging platform built for the modern creator. Simple, fast, and intelligent.'}
              </p>
              <div className="flex space-x-4 text-slate-400">
                {/* Social icons */}
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-all cursor-pointer"><Globe size={14}/></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 mb-6">Explore</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                {settings.footerExploreLinks?.map((link, idx) => (
                   <li key={idx}>
                     <Link to={link.url} className="hover:text-blue-600 transition-colors">{link.label}</Link>
                   </li>
                ))}
                {(!settings.footerExploreLinks || settings.footerExploreLinks.length === 0) && (
                   <>
                     <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                     <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Latest Articles</Link></li>
                   </>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                {settings.footerLegalLinks?.map((link, idx) => (
                   <li key={idx}>
                     <a href={link.url} className="hover:text-blue-600 transition-colors">{link.label}</a>
                   </li>
                ))}
                {(!settings.footerLegalLinks || settings.footerLegalLinks.length === 0) && (
                   <>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                     <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                   </>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-900 mb-6">Stay Updated</h4>
              <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
                <button className="px-4 py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-md">
                  Subscribe to Newsletter
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-200 pt-8 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} {settings.siteName || 'BlogGetWay'}. {settings.footerText || 'All rights reserved.'}</p>
            <div className="flex space-x-6 mt-4 md:mt-0 items-center">
               <span className="font-semibold text-slate-700">Built with BlogGetWay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;