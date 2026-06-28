import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden mb-6"
    >
      {/* Post Header */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="w-11 h-11 rounded-full object-cover border border-slate-100" />
          <div>
            <h4 className="font-semibold text-slate-900">{post.author.name}</h4>
            <p className="text-xs text-slate-500">{post.author.headline} • {post.timeAgo}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-5 pb-3">
        <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Post Media (Optional) */}
      {post.image && (
        <div className="mt-2 w-full">
          <img src={post.image} alt="Post content" className="w-full max-h-96 object-cover" />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="bg-brand-100 p-1 rounded-full">
            <Heart className="w-3 h-3 text-brand-600 fill-brand-600" />
          </div>
          <span>{likesCount}</span>
        </div>
        <div className="flex gap-3">
          <span>{post.comments} comments</span>
          <span>{post.shares} shares</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-3 py-2 flex items-center justify-between">
        <button 
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-colors ${
            isLiked ? 'text-brand-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-brand-600' : ''}`} />
          <span>Like</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>
        
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
        
        <button className="flex items-center justify-center p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
