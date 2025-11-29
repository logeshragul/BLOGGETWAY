import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { storageService } from '../services/storage';
import { Calendar, User, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const PostPreview: React.FC = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    // Initial load
    const loadedPost = storageService.getPreviewPost();
    if (loadedPost) {
      setPost(loadedPost);
    }

    // Listen for changes in local storage (realtime update if user saves/previews again in editor)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bloggetway_preview_post' && e.newValue) {
        setPost(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const nextSlide = () => {
    if (!post?.galleryImages) return;
    setGalleryIndex((prev) => (prev + 1) % post.galleryImages!.length);
  };

  const prevSlide = () => {
    if (!post?.galleryImages) return;
    setGalleryIndex((prev) => (prev - 1 + post.galleryImages!.length) % post.galleryImages!.length);
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Preview Banner */}
      <div className="bg-indigo-600 text-white py-3 px-4 text-center sticky top-0 z-50 shadow-md flex items-center justify-center gap-2">
         <Eye size={18} />
         <span className="font-bold text-sm uppercase tracking-wide">Preview Mode</span>
         <span className="opacity-75 text-xs">- This content is not yet published.</span>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
        <header className="mb-10 text-center">
          {post.category && (
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold tracking-wide uppercase rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title || 'Untitled Post'}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {post.coverImage && !post.galleryImages?.length && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Gallery Slider */}
        {post.galleryImages && post.galleryImages.length > 0 && (
          <div className="mb-12 relative group rounded-2xl overflow-hidden shadow-lg bg-black">
             <div className="h-[500px] w-full relative">
                <img 
                  src={post.galleryImages[galleryIndex]} 
                  alt={`Slide ${galleryIndex}`} 
                  className="w-full h-full object-contain md:object-cover transition-opacity duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                   {post.galleryImages.map((_, idx) => (
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
           {post.content ? post.content.split('\n').map((para, idx) => (
             <p key={idx} className="mb-4">{para}</p>
           )) : (
             <p className="text-gray-400 italic text-center">No content yet...</p>
           )}
        </div>

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
    </div>
  );
};

export default PostPreview;