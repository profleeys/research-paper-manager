import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { papersApi } from '../services/api';
import DeleteModal from '../components/DeleteModal';
import { STATUS_STYLES, PRIORITY_STYLES } from '../components/PaperCard';
import {
  ArrowLeft,
  Calendar,
  Users,
  Tag,
  Clock,
  Edit3,
  Trash2,
  FileText,
  Bookmark,
} from 'lucide-react';

export default function PaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadPaper() {
      try {
        setLoading(true);
        setError('');
        const data = await papersApi.getById(id);
        setPaper(data);
      } catch (err) {
        setError(err.message || 'Paper not found');
      } finally {
        setLoading(false);
      }
    }
    loadPaper();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await papersApi.delete(id);
      navigate('/papers');
    } catch (err) {
      alert(err.message || 'Failed to delete paper');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">載入論文詳情中...</p>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center">
          <p className="text-rose-600 font-medium mb-4">{error || 'Paper not found'}</p>
          <Link
            to="/papers"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> 返回論文列表
          </Link>
        </div>
      </div>
    );
  }

  const statusClass = STATUS_STYLES[paper.status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const priorityClass = PRIORITY_STYLES[paper.priority] || 'bg-slate-100 text-slate-600 border-slate-200';

  const formattedDate = paper.created_at
    ? new Date(paper.created_at).toLocaleString()
    : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/papers"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Paper List</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header Action Row: Edit & Delete buttons */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Tag className="w-3 h-3" />
                {paper.category || 'Other'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClass}`}>
                {paper.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityClass}`}>
                {paper.priority} Priority
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {paper.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
            <Link
              to={`/papers/${paper.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Edit Paper</span>
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Paper Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-slate-100 text-sm">
          <div className="flex items-start gap-2.5">
            <Users className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Authors</p>
              <p className="font-medium text-slate-800 mt-0.5">
                {paper.authors || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Year</p>
              <p className="font-medium text-slate-800 mt-0.5">
                {paper.year || 'Unknown'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Created Date</p>
              <p className="font-medium text-slate-800 mt-0.5">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Research Notes & Summary</h2>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm sm:text-base leading-relaxed text-slate-700 whitespace-pre-wrap">
            {paper.notes || (
              <span className="italic text-slate-400">尚無筆記內容。可點擊上方「Edit Paper」補充摘要與研究心得。</span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        title={paper.title}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

