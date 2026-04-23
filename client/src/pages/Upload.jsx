import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import { FiUploadCloud, FiX, FiHash, FiMusic, FiFilm } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Upload() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [musicTitle, setMusicTitle] = useState('');
  const [musicArtist, setMusicArtist] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) return toast.error('Please select a video file');
    if (file.size > 100 * 1024 * 1024) return toast.error('Max file size is 100MB');
    setVideoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace('#', '').toLowerCase();
    if (tag && !hashtags.includes(tag) && hashtags.length < 10) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return toast.error('Please select a video');
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('caption', caption);
    formData.append('hashtags', JSON.stringify(hashtags));
    formData.append('music', JSON.stringify({ title: musicTitle, artist: musicArtist }));

    try {
      await API.post('/reels/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });
      toast.success('Reel uploaded! 🎬');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-2xl font-display font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
            <FiFilm className="inline mr-2" /> Upload Reel
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            {!preview ? (
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => fileRef.current?.click()}
                className={`aspect-[9/16] max-h-[500px] rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center transition-colors
                  ${dark ? 'border-dark-500 bg-dark-800 hover:border-primary-500/50 hover:bg-dark-700' : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-gray-100'}`}
              >
                <FiUploadCloud size={48} className={`mb-4 ${dark ? 'text-dark-400' : 'text-gray-400'}`} />
                <p className={`font-semibold ${dark ? 'text-dark-200' : 'text-gray-600'}`}>Click to upload video</p>
                <p className={`text-xs mt-1 ${dark ? 'text-dark-400' : 'text-gray-400'}`}>MP4, MOV, WebM · Max 100MB · Up to 60s</p>
              </motion.div>
            ) : (
              <div className="relative aspect-[9/16] max-h-[500px] rounded-2xl overflow-hidden bg-black">
                <video src={preview} className="w-full h-full object-contain" controls />
                <button type="button" onClick={() => { setVideoFile(null); setPreview(''); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70">
                  <FiX size={18} />
                </button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />

            {/* Caption */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${dark ? 'text-dark-200' : 'text-gray-700'}`}>Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={2200}
                rows={3}
                placeholder="Write a caption..."
                className={`w-full p-4 rounded-xl text-sm outline-none resize-none transition-all
                  ${dark ? 'bg-dark-700 text-white placeholder-dark-400 focus:ring-2 focus:ring-primary-500/40' : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/40'}`}
              />
              <span className={`text-xs ${dark ? 'text-dark-400' : 'text-gray-400'}`}>{caption.length}/2200</span>
            </div>

            {/* Hashtags */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${dark ? 'text-dark-200' : 'text-gray-700'}`}>
                <FiHash className="inline mr-1" /> Hashtags
              </label>
              <div className="flex gap-2">
                <input
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  placeholder="Add hashtag"
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm outline-none
                    ${dark ? 'bg-dark-700 text-white placeholder-dark-400' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
                />
                <button type="button" onClick={addHashtag}
                  className="px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium">Add</button>
              </div>
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map(tag => (
                    <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${dark ? 'bg-primary-500/20 text-primary-300' : 'bg-primary-50 text-primary-600'}`}>
                      #{tag}
                      <button type="button" onClick={() => setHashtags(hashtags.filter(t => t !== tag))}><FiX size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Music */}
            <div>
              <label className={`text-sm font-medium mb-2 block ${dark ? 'text-dark-200' : 'text-gray-700'}`}>
                <FiMusic className="inline mr-1" /> Music (optional)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)} placeholder="Song title"
                  className={`px-4 py-2.5 rounded-xl text-sm outline-none ${dark ? 'bg-dark-700 text-white placeholder-dark-400' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`} />
                <input value={musicArtist} onChange={(e) => setMusicArtist(e.target.value)} placeholder="Artist"
                  className={`px-4 py-2.5 rounded-xl text-sm outline-none ${dark ? 'bg-dark-700 text-white placeholder-dark-400' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`} />
              </div>
            </div>

            {/* Upload Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!videoFile || uploading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold disabled:opacity-50 glow-primary"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block" />
                  Uploading... {progress}%
                </span>
              ) : 'Upload Reel 🚀'}
            </motion.button>

            {/* Progress Bar */}
            {uploading && (
              <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? 'bg-dark-700' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                />
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
