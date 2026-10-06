import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { papersApi } from '../services/api';
import PaperCard from '../components/PaperCard';
import DeleteModal from '../components/DeleteModal';
import { Search, Filter, Plus, RotateCcw, FileText, LayoutGrid, List } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Artificial Intelligence',
  'Machine Learning',
  'Explainable AI',
  'Computer Vision',
  'NLP',
  'Data Mining',
  'Other',
];

const STATUSES = ['All', 'To Read', 'Reading', 'Completed'];
const PRIORITIES = ['All', 'High', 'Medium', 'Low'];

export default function PaperList() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  // Deletion modal state
  const [paperToDelete, setPaperToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await papersApi.getAll();
      setPapers(data);
    } catch (err) {
      setError(err.message || 'Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // Filtered papers computation (Search and Filter can be used together)
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      // Search matching (Title or Authors)
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        (paper.title && paper.title.toLowerCase().includes(q)) ||
        (paper.authors && paper.authors.toLowerCase().includes(q));

      // Category matching
      const matchCategory =
        selectedCategory === 'All' || paper.category === selectedCategory;

      // Status matching
      const matchStatus =
        selectedStatus === 'All' || paper.status === selectedStatus;

      // Priority matching
      const matchPriority =
        selectedPriority === 'All' || paper.priority === selectedPriority;

      return matchSearch && matchCategory && matchStatus && matchPriority;
    });
  }, [papers, searchQuery, selectedCategory, selectedStatus, selectedPriority]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
  };

  const isFiltered =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedStatus !== 'All' ||
    selectedPriority !== 'All';

  const handleDeleteConfirm = async () => {
    if (!paperToDelete) return;
    try {
      setIsDeleting(true);
      await papersApi.delete(paperToDelete.id);
      setPaperToDelete(null);
      await fetchPapers();
    } catch (err) {
      alert(err.message || 'Failed to delete paper');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Research Papers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            文獻列表與搜尋篩選 · 共 {papers.length} 篇論文 (目前顯示 {filteredPapers.length} 篇)
          </p>
        </div>

        <Link
          to="/papers/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Paper</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-8 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by Title or Authors..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm transition"
          />
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Category 領域
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories (全部領域)' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Status 狀態
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses (全部狀態)' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Priority 重要度
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Priorities (全部重要度)' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              disabled={!isFiltered}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters (重設篩選)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paper List Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-sm">載入論文資料中...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            {isFiltered ? '找不到符合條件的論文' : '論文庫目前為空'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {isFiltered
              ? '請嘗試調整或重設您的搜尋關鍵字或篩選條件。'
              : '點擊上方按鈕立即新增您的第一篇研究文獻。'}
          </p>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
            >
              清除所有篩選條件
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              onDeleteClick={(p) => setPaperToDelete(p)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!paperToDelete}
        title={paperToDelete?.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPaperToDelete(null)}
      />
    </div>
  );
}

