import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { BlogPost } from '../types';
import { Calendar, User, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PublicBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    // In a real app, you'd filter by status=PUBLISHED
    setPosts(storageService.getPosts().filter(p => p.status === 'PUBLISHED' || true)); 
  }, []);

  useEffect(() => {
    setGalleryIndex(0); // Reset gallery index when post changes
  }, [selectedPost]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextSlide = () => {
    if (!selectedPost?.galleryImages) return;
    setGalleryIndex((prev) => (prev + 1) % selectedPost.galleryImages!.length);
  };

  const prevSlide = () => {
    if (!selectedPost?.galleryImages) return;
    setGalleryIndex((prev) => (prev - 1 + selectedPost.galleryImages!.length) % selectedPost.galleryImages!.length);
  };

  if (selectedPost) {
    return (
      <article className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <button 
          onClick={() => setSelectedPost(null)}
          className="text-gray-500 hover:text-blue-600 flex items-center mb-8 transition-colors"
        >
          <ArrowRight className="rotate-180 mr-2" size={20} /> Back to posts
        </button>
        
        <header className="mb-10 text-center">
          {selectedPost.category && (
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold tracking-wide uppercase rounded-full mb-4">
              {selectedPost.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {selectedPost.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{selectedPost.author}</span>
            </div>
            {selectedPost.publishedAt && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </header>

        {selectedPost.coverImage && !selectedPost.galleryImages?.length && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={selectedPost.coverImage} 
              alt={selectedPost.title} 
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}

        {/* Gallery Slider */}
        {selectedPost.galleryImages && selectedPost.galleryImages.length > 0 && (
          <div className="mb-12 relative group rounded-2xl overflow-hidden shadow-lg bg-black">
             <div className="h-[500px] w-full relative">
                <img 
                  src={selectedPost.galleryImages[galleryIndex]} 
                  alt={`Slide ${galleryIndex}`} 
                  className="w-full h-full object-contain md:object-cover transition-opacity duration-300"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* Navigation Buttons */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                   {selectedPost.galleryImages.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setGalleryIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === galleryIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        <div className="prose prose-lg prose-blue max-w-none text-gray-700">
           {/* Simple rendering of text/markdown - in production use a markdown renderer */}
           {selectedPost.content.split('\n').map((para, idx) => (
             <p key={idx} className="mb-4">{para}</p>
           ))}
        </div>

        {/* Contact/Newsletter Section embedded in post */}
        <div className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Enjoyed this article?</h3>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter to get more content like this delivered to your inbox.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Calculate Featured Posts for Hero Slider
  const featuredPosts = posts.slice(0, 3);
  
  return (
    <div className="bg-white pb-20">
      {/* Hero Section with Slider */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 z-0"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">BlogGetWay</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover stories, thinking, and expertise from writers on any topic. 
              Powered by next-generation AI.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative mt-8 transform hover:scale-105 transition-transform duration-300">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for articles..." 
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-slate-900">Latest Stories</h2>
           <div className="h-1 bg-slate-100 flex-1 ml-6 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-20 rounded-full"></div>
           </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 bg-white"
            >
              <div className="relative h-60 overflow-hidden">
                 <img 
                    src={post.coverImage || 'https://picsum.photos/seed/blog/800/400'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  
                  {post.galleryImages && post.galleryImages.length > 0 && (
                     <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        {post.galleryImages.length} Slides
                     </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-xs font-bold rounded-full uppercase tracking-wider text-slate-900 shadow-sm">
                      {post.category || 'General'}
                    </span>
                  </div>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
                  {post.excerpt || post.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                   <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2 text-slate-600 font-bold ring-2 ring-white shadow-sm">
                        {post.author[0]}
                      </div>
                      <span className="font-medium text-slate-600">{post.author}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Calendar size={12} />
                     <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No matches found</h3>
            <p className="text-slate-500">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBlog;