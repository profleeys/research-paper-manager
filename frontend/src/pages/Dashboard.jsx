import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { papersApi } from '../services/api';
import StatCard from '../components/StatCard';
import PaperCard from '../components/PaperCard';
import DeleteModal from '../components/DeleteModal';
import { BookOpen, BookMarked, CheckCircle, Flame, Plus, ArrowRight, Library } from 'lucide-react';

export default function Dashboard() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const totalCount = papers.length;
  const readingCount = papers.filter((p) => p.status === 'Reading').length;
  const completedCount = papers.filter((p) => p.status === 'Completed').length;
  const importantCount = papers.filter((p) => p.priority === 'High').length;
  const recentPapers = papers.slice(0, 5);

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
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Research Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            文獻閱讀進度概覽與重要研究成果追蹤
          </p>
        </div>

        <Link
          to="/papers/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Paper</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          title="Total Papers"
          count={loading ? '-' : totalCount}
          icon={BookOpen}
          bgClass="bg-indigo-50"
          colorClass="text-indigo-600"
          description="總收錄論文數量"
        />
        <StatCard
          title="Reading"
          count={loading ? '-' : readingCount}
          icon={BookMarked}
          bgClass="bg-sky-50"
          colorClass="text-sky-600"
          description="目前研讀中的論文"
        />
        <StatCard
          title="Completed"
          count={loading ? '-' : completedCount}
          icon={CheckCircle}
          bgClass="bg-emerald-50"
          colorClass="text-emerald-600"
          description="已完成研讀的文獻"
        />
        <StatCard
          title="Important Papers"
          count={loading ? '-' : importantCount}
          icon={Flame}
          bgClass="bg-rose-50"
          colorClass="text-rose-600"
          description="標註為 High 重要程度"
        />
      </div>

      {/* Recent Papers Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <Library className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Recent Papers</h2>
            <span className="text-xs text-slate-400 font-normal">最近新增的 5 篇論文</span>
          </div>

          <Link
            to="/papers"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
          >
            <span>View All Papers ({totalCount})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm">載入資料中...</p>
          </div>
        ) : recentPapers.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-sm">尚未新增任何論文。</p>
            <Link
              to="/papers/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline"
            >
              <Plus className="w-4 h-4" /> 立即新增第一篇論文
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPapers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                onDeleteClick={(p) => setPaperToDelete(p)}
              />
            ))}
          </div>
        )}
      </div>

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

