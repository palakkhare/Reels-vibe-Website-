import { useState } from 'react';
import { Image, Video, FileText, Send } from 'lucide-react';

export default function CreatePost() {
  const [content, setContent] = useState('');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 mb-6">
      <div className="flex gap-4 mb-4">
        <img src="https://i.pravatar.cc/100?img=11" alt="Me" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
        <textarea
          placeholder="What's happening on campus?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none bg-slate-50 border-none rounded-xl p-3 text-slate-900 placeholder:text-slate-500 focus:ring-0 text-sm outline-none transition-all focus:bg-white focus:shadow-sm"
          rows={3}
        ></textarea>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-colors text-sm font-medium">
            <Image className="w-5 h-5 text-brand-500" />
            <span className="hidden sm:inline">Photo</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-colors text-sm font-medium">
            <Video className="w-5 h-5 text-indigo-500" />
            <span className="hidden sm:inline">Video</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition-colors text-sm font-medium">
            <FileText className="w-5 h-5 text-emerald-500" />
            <span className="hidden sm:inline">Project</span>
          </button>
        </div>
        
        <button 
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
            content.trim() 
              ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          disabled={!content.trim()}
        >
          <span>Post</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
