import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogPost, PostStatus } from '../types';
import { storageService } from '../services/storage';
import { geminiService } from '../services/geminiService';
import { Save, Image as ImageIcon, Sparkles, ArrowLeft, Wand2, Search, BrainCircuit, Camera, Upload, X, Loader2, Plus, Trash2, Images, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const PostEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [post, setPost] = useState<BlogPost>({
    id: '',
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    galleryImages: [],
    author: 'Admin',
    category: '',
    tags: [],
    status: PostStatus.DRAFT,
    publishedAt: '',
    views: 0
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [deepThink, setDeepThink] = useState(false);
  
  // Camera & Upload States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const existing = storageService.getPost(id);
      if (existing) setPost(existing);
    } else {
      setPost(prev => ({ ...prev, id: uuidv4() }));
    }

    return () => {
      stopCamera();
    };
  }, [id]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const handleChange = (field: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    storageService.savePost(post);
    navigate('/admin/posts');
  };

  const handlePreview = () => {
    storageService.savePreviewPost(post);
    window.open('/#/preview', '_blank');
  };

  // AI Actions
  const handleAiAction = async (action: 'fix' | 'expand' | 'summarize' | 'research') => {
    setAiLoading(true);
    try {
      let result = '';
      const prompt = aiPrompt || post.content;

      if (action === 'research') {
        const research = await geminiService.researchTopic(aiPrompt);
        result = `**Research Findings for: ${aiPrompt}**\n\n${research.text}\n\n*Sources:*\n${research.sources.map((s: any) => `- [${s.web?.title || 'Link'}](${s.web?.uri})`).join('\n')}`;
      } else if (action === 'fix') {
         result = await geminiService.generateFastText(`Fix grammar and improve flow of this text:\n\n${post.content}`);
      } else if (action === 'expand') {
         result = await geminiService.generateComplexText(`Expand on the following content, adding more detail and professional tone:\n\n${post.content}`, deepThink);
      } else if (action === 'summarize') {
         result = await geminiService.generateFastText(`Summarize this into a short excerpt:\n\n${post.content}`);
      }

      if (action === 'summarize') {
        handleChange('excerpt', result);
      } else if (action === 'research') {
        handleChange('content', post.content + '\n\n' + result);
      } else {
        handleChange('content', result);
      }
      setShowAiModal(false);
      setAiPrompt('');
    } catch (err) {
      alert("AI Error. Check console.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateCoverImage = async () => {
    if (!post.title) return alert("Enter a title first");
    setAiLoading(true);
    try {
      const img = await geminiService.generateBlogImage(
        `A professional, modern, artistic blog header image for a post titled: "${post.title}". High quality, 4k, digital art style.`,
        "16:9",
        "1K"
      );
      handleChange('coverImage', img);
    } catch (err) {
      alert("Image Generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  // File Upload Logic (Cover Image)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('coverImage', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Gallery Logic
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPost(prev => ({
            ...prev,
            galleryImages: [...(prev.galleryImages || []), reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setPost(prev => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index)
    }));
  };

  // Camera Logic
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      alert("Could not access camera. Please ensure you have granted permissions.");
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        handleChange('coverImage', dataUrl);
        stopCamera();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/posts')} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Posts
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            <Eye size={18} />
            <span>Preview</span>
          </button>
          <button 
            onClick={() => setShowAiModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-medium hover:bg-purple-100 transition-colors"
          >
            <Sparkles size={18} />
            <span>AI Assistant</span>
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
          >
            <Save size={18} />
            <span>Save Post</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <input
            type="text"
            placeholder="Post Title"
            className="w-full text-4xl font-bold border-none placeholder-gray-300 focus:ring-0 text-gray-900 bg-transparent p-0"
            value={post.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          
          <div className="relative">
            <textarea
              placeholder="Write your story..."
              className="w-full h-[600px] p-4 text-lg leading-relaxed text-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-serif shadow-sm"
              value={post.content}
              onChange={(e) => handleChange('content', e.target.value)}
            />
             <div className="absolute bottom-4 right-4 text-xs text-gray-400 font-mono bg-white/80 px-2 py-1 rounded">
                {post.content.length} chars
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Publishing Status */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Publishing</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                  value={post.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value={PostStatus.DRAFT}>Draft</option>
                  <option value={PostStatus.PUBLISHED}>Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                  value={post.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  placeholder="e.g. Technology"
                />
              </div>
            </div>
          </div>

          {/* Featured Image Section - Enhanced */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Cover Image</h3>
              <button 
                onClick={generateCoverImage}
                disabled={aiLoading}
                className="text-xs flex items-center text-purple-600 font-medium hover:text-purple-800 bg-purple-50 px-2 py-1 rounded-md transition-colors"
              >
                {aiLoading ? <Loader2 size={12} className="animate-spin mr-1"/> : <Wand2 size={12} className="mr-1" />}
                Generate AI
              </button>
            </div>
            
            {/* Camera Viewport */}
            {isCameraOpen && (
              <div className="relative mb-3 rounded-lg overflow-hidden bg-black aspect-video">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                   <button 
                      onClick={takePhoto}
                      className="w-12 h-12 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:bg-gray-100 shadow-lg"
                   >
                     <div className="w-10 h-10 rounded-full bg-red-500 border-2 border-white"></div>
                   </button>
                   <button 
                      onClick={stopCamera}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                   >
                     <X size={20} />
                   </button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* Image Preview */}
            {!isCameraOpen && post.coverImage ? (
              <div className="relative group mb-3">
                <img src={post.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-lg shadow-sm" />
                <button 
                  onClick={() => handleChange('coverImage', '')}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                >
                  <X size={14} />
                </button>
              </div>
            ) : !isCameraOpen && (
              // Drag & Drop Area
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                  <Upload size={20} className="text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-600">Click to upload</span>
                <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            )}

            {/* Action Buttons */}
            {!isCameraOpen && (
              <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                 >
                    <Upload size={14} /> Upload File
                 </button>
                 <button 
                    onClick={startCamera}
                    className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                 >
                    <Camera size={14} /> Take Photo
                 </button>
              </div>
            )}
            
            <div className="mt-3 relative">
               <span className="text-[10px] text-gray-400 uppercase font-bold absolute -top-2 left-2 bg-white px-1">OR</span>
               <input 
                  type="text"
                  placeholder="Paste Image URL"
                  className="w-full text-xs border-gray-300 rounded-lg py-2 pl-3"
                  value={post.coverImage.startsWith('data:') ? '' : post.coverImage}
                  onChange={(e) => handleChange('coverImage', e.target.value)}
               />
            </div>
          </div>

          {/* Image Gallery Section */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                 <Images size={16} className="text-blue-600"/> Image Gallery
               </h3>
               <span className="text-xs text-gray-500">{post.galleryImages?.length || 0} images</span>
             </div>

             <div className="grid grid-cols-3 gap-2 mb-3">
                {post.galleryImages?.map((img, idx) => (
                   <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                ))}
                <button 
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-300 transition-all"
                >
                   <Plus size={24} />
                   <span className="text-[10px] font-medium mt-1">Add</span>
                </button>
             </div>
             
             <input 
                type="file" 
                ref={galleryInputRef} 
                multiple 
                accept="image/*"
                className="hidden"
                onChange={handleGallerySelect}
             />
             <p className="text-xs text-gray-400">Images will be shown as a slider in the post.</p>
          </div>

          {/* SEO Settings */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-3">
               <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Slug</label>
                  <input 
                    type="text" 
                    className="w-full text-sm border-gray-300 rounded-lg"
                    value={post.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Meta Description</label>
                  <textarea 
                    className="w-full text-sm border-gray-300 rounded-lg h-24 resize-none"
                    value={post.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                  />
                  <button 
                    onClick={() => handleAiAction('summarize')}
                    className="text-xs flex items-center text-blue-600 mt-2 hover:underline font-medium"
                  >
                    <Sparkles size={12} className="mr-1" /> Auto-generate from content
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Sparkles className="text-purple-500" /> AI Assistant</h3>
               <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
             </div>
             
             <div className="space-y-5">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to do?</label>
                 <textarea 
                    className="w-full border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm p-3 resize-none"
                    placeholder="e.g. Research the latest trends in renewable energy..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                 />
               </div>

               <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={deepThink} onChange={e => setDeepThink(e.target.checked)} className="rounded text-purple-600 focus:ring-purple-500" />
                    <span className="text-sm text-gray-700 flex items-center gap-1 group-hover:text-purple-700 transition-colors"><BrainCircuit size={16}/> Deep Thinking Mode</span>
                  </label>
               </div>

               <div className="grid grid-cols-2 gap-3 pt-2">
                 <button 
                    onClick={() => handleAiAction('fix')}
                    disabled={aiLoading}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 transition-all"
                 >
                    Fix Grammar
                 </button>
                 <button 
                    onClick={() => handleAiAction('expand')}
                    disabled={aiLoading}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 transition-all"
                 >
                    Expand Text
                 </button>
                 <button 
                    onClick={() => handleAiAction('summarize')}
                    disabled={aiLoading}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 transition-all"
                 >
                    Summarize
                 </button>
                 <button 
                    onClick={() => handleAiAction('research')}
                    disabled={aiLoading || !aiPrompt}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-all ${!aiPrompt ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                 >
                    {aiLoading ? <Loader2 size={16} className="animate-spin"/> : <Search size={16} />} Research
                 </button>
               </div>
               
               {aiLoading && (
                 <div className="flex items-center justify-center gap-2 text-sm text-purple-600 mt-2 bg-purple-50 py-2 rounded-lg animate-pulse">
                    <Sparkles size={14} /> Gemini is working on it...
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEditor;