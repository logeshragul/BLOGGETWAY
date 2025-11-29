import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ImageAspectRatio, ImageSize } from '../types';
import { ImageIcon, Loader, Download, Copy, AlertCircle } from 'lucide-react';

const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>("16:9");
  const [size, setSize] = useState<ImageSize>("1K");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setGeneratedImage(null);

    try {
      const imgData = await geminiService.generateBlogImage(prompt, aspectRatio, size);
      setGeneratedImage(imgData);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Generator</h1>
      <p className="text-gray-500 mb-8">Create stunning visuals for your blog posts using Gemini Nano Banana Pro.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Describe the image you want..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="3:4">3:4 (Portrait)</option>
                <option value="9:16">9:16 (Story)</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
              <div className="flex gap-2">
                 {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
                   <button
                     key={s}
                     onClick={() => setSize(s)}
                     className={`flex-1 py-2 text-sm rounded-lg border ${size === s ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                   >
                     {s}
                   </button>
                 ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={`w-full mt-6 py-3 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${loading || !prompt ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <ImageIcon size={20} />}
              <span>{loading ? 'Generating...' : 'Generate'}</span>
            </button>
            {error && <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
          </div>
        </div>

        <div className="md:col-span-2">
           <div className="bg-gray-100 rounded-2xl h-[500px] flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative group">
             {generatedImage ? (
               <>
                 <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <a href={generatedImage} download="generated-image.png" className="p-3 bg-white rounded-full text-gray-900 hover:bg-blue-50">
                       <Download size={24} />
                    </a>
                 </div>
               </>
             ) : (
               <div className="text-center text-gray-400">
                 <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                 <p>Your masterpiece will appear here</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGen;