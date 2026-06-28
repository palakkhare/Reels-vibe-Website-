import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Download, Filter, X, FileText, BookOpen, Clock, User, ChevronDown, Eye, Star, Plus } from 'lucide-react';

const DEPARTMENTS = ['All Departments', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Mathematics', 'Physics'];

const SUBJECTS = ['All', 'Data Structures', 'Machine Learning', 'Operating Systems', 'Digital Circuits', 'Thermodynamics', 'Linear Algebra', 'Quantum Physics'];

const RESOURCE_TYPES = [
  { label: 'All', icon: '📁' },
  { label: 'Notes', icon: '📄' },
  { label: 'Assignment', icon: '📝' },
  { label: 'Past Paper', icon: '📋' },
  { label: 'Book', icon: '📚' },
  { label: 'Video', icon: '🎥' },
];

const MOCK_RESOURCES = [
  {
    id: 1,
    title: 'Data Structures Complete Notes',
    description: 'Comprehensive notes covering arrays, linked lists, trees, graphs, and hashing with examples.',
    type: 'Notes',
    icon: '📄',
    subject: 'Data Structures',
    department: 'Computer Science',
    uploader: 'Prof. Alan Turing',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=11',
    uploadDate: 'Jun 15, 2026',
    downloads: 1240,
    rating: 4.8,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    title: 'ML Assignment 3 — Neural Networks',
    description: 'Implement a feedforward neural network from scratch. Includes starter code and test cases.',
    type: 'Assignment',
    icon: '📝',
    subject: 'Machine Learning',
    department: 'Computer Science',
    uploader: 'Sarah Jenkins',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=47',
    uploadDate: 'Jun 20, 2026',
    downloads: 340,
    rating: 4.5,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 3,
    title: 'OS Midterm 2025 Question Paper',
    description: 'Previous year midterm paper with process scheduling, deadlocks, and memory management.',
    type: 'Past Paper',
    icon: '📋',
    subject: 'Operating Systems',
    department: 'Computer Science',
    uploader: 'Raj Patel',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=52',
    uploadDate: 'Jun 10, 2026',
    downloads: 890,
    rating: 4.9,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 4,
    title: 'Digital Electronics — Karnaugh Maps Guide',
    description: 'Step-by-step tutorial on K-Maps for simplifying Boolean expressions with solved examples.',
    type: 'Notes',
    icon: '📄',
    subject: 'Digital Circuits',
    department: 'Electrical Engineering',
    uploader: 'Emily Chen',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=23',
    uploadDate: 'Jun 18, 2026',
    downloads: 560,
    rating: 4.6,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 5,
    title: 'Introduction to Thermodynamics (Textbook)',
    description: 'Y. A. Cengel — Comprehensive textbook covering the laws of thermodynamics and applications.',
    type: 'Book',
    icon: '📚',
    subject: 'Thermodynamics',
    department: 'Mechanical Engineering',
    uploader: 'Marcus Johnson',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=60',
    uploadDate: 'May 28, 2026',
    downloads: 2100,
    rating: 4.7,
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 6,
    title: 'Linear Algebra Video Lectures — MIT OCW',
    description: 'Full playlist of Gilbert Strang\'s legendary linear algebra lectures. 34 lectures total.',
    type: 'Video',
    icon: '🎥',
    subject: 'Linear Algebra',
    department: 'Mathematics',
    uploader: 'Priya Sharma',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=44',
    uploadDate: 'Jun 05, 2026',
    downloads: 1800,
    rating: 5.0,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 7,
    title: 'Quantum Physics Final Exam 2024',
    description: 'Previous year final exam with Schrödinger equation, wave functions, and quantum entanglement problems.',
    type: 'Past Paper',
    icon: '📋',
    subject: 'Quantum Physics',
    department: 'Physics',
    uploader: 'David Kim',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=14',
    uploadDate: 'Jun 22, 2026',
    downloads: 420,
    rating: 4.4,
    color: 'from-sky-500 to-indigo-500',
  },
  {
    id: 8,
    title: 'Graph Algorithms Cheat Sheet',
    description: 'Quick reference for BFS, DFS, Dijkstra, Floyd-Warshall, and Kruskal\'s algorithm with complexities.',
    type: 'Notes',
    icon: '📄',
    subject: 'Data Structures',
    department: 'Computer Science',
    uploader: 'Sarah Jenkins',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=47',
    uploadDate: 'Jun 25, 2026',
    downloads: 670,
    rating: 4.9,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 9,
    title: 'ML Assignment 4 — CNNs & Image Classification',
    description: 'Build a convolutional neural network using TensorFlow/Keras for CIFAR-10 classification.',
    type: 'Assignment',
    icon: '📝',
    subject: 'Machine Learning',
    department: 'Computer Science',
    uploader: 'Prof. Alan Turing',
    uploaderAvatar: 'https://i.pravatar.cc/150?img=11',
    uploadDate: 'Jun 27, 2026',
    downloads: 210,
    rating: 4.3,
    color: 'from-fuchsia-500 to-purple-500',
  },
];

function UploadModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900">Upload Resource</h2>
              <p className="text-sm text-slate-500 mt-0.5">Share your study materials with the campus.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                placeholder="e.g., Data Structures Notes — Chapter 5"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="What's in this resource?"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white">
                  {DEPARTMENTS.slice(1).map((dept) => (
                    <option key={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white">
                  {RESOURCE_TYPES.slice(1).map((type) => (
                    <option key={type.label}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="e.g., Machine Learning"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              />
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-brand-400 hover:bg-brand-50/30 transition-all cursor-pointer group">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-500 mx-auto mb-2 transition-colors" />
              <p className="text-sm text-slate-600 font-medium">
                Drag & drop your file here or <span className="text-brand-600">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, PPTX, MP4, ZIP up to 50MB</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200/60 bg-slate-50/50">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all">
              Upload Resource
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const filteredResources = MOCK_RESOURCES.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'All Departments' || resource.department === selectedDepartment;
    const matchesType = selectedType === 'All' || resource.type === selectedType;
    const matchesSubject = selectedSubject === 'All' || resource.subject === selectedSubject;
    return matchesSearch && matchesDept && matchesType && matchesSubject;
  });

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 max-w-6xl mx-auto py-8 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Academic Resources</h1>
              <p className="text-slate-500 mt-1">Browse notes, assignments, past papers, and more from your peers.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Resource</span>
            </motion.button>
          </div>

          {/* Search & Filters Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search resources by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                />
              </div>

              {/* Department Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm hover:bg-slate-100 transition-colors w-full md:w-auto"
                >
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{selectedDepartment}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <AnimatePresence>
                  {showDeptDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200/60 py-1 z-20"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => { setSelectedDepartment(dept); setShowDeptDropdown(false); }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            selectedDepartment === dept
                              ? 'bg-brand-50 text-brand-700 font-medium'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Subject Pills */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSubject === subject
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Type Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
            {RESOURCE_TYPES.map((type) => (
              <button
                key={type.label}
                onClick={() => setSelectedType(type.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === type.label
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
                }`}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Resource Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredResources.map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  {/* Card Top Gradient */}
                  <div className={`h-2 bg-gradient-to-r ${resource.color}`} />

                  <div className="p-5">
                    {/* Type badge and rating */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                        <span>{resource.icon}</span>
                        {resource.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {resource.rating}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <h3 className="font-display font-bold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-brand-700 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{resource.description}</p>

                    {/* Subject Tag */}
                    <span className="inline-block px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-medium mb-4">
                      {resource.subject}
                    </span>

                    {/* Uploader Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <img src={resource.uploaderAvatar} alt="" className="w-6 h-6 rounded-full" />
                        <div>
                          <p className="text-xs font-medium text-slate-700">{resource.uploader}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resource.uploadDate}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg text-xs font-medium shadow-sm shadow-brand-500/20 hover:shadow-brand-500/40 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {resource.downloads}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900 mb-1">No resources found</h3>
              <p className="text-sm text-slate-500">Try adjusting your filters or search query.</p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <UploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </div>
  );
}
