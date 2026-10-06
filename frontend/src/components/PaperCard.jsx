import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Eye, Edit3, Trash2, Tag } from 'lucide-react';

export const STATUS_STYLES = {
  'To Read': 'bg-amber-50 text-amber-700 border-amber-200',
  'Reading': 'bg-sky-50 text-sky-700 border-sky-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const PRIORITY_STYLES = {
  'High': 'bg-rose-50 text-rose-700 border-rose-200',
  'Medium': 'bg-orange-50 text-orange-700 border-orange-200',
  'Low': 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function PaperCard({ paper, onDeleteClick }) {
  const statusClass = STATUS_STYLES[paper.status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const priorityClass = PRIORITY_STYLES[paper.priority] || 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
      <div>
        {/* Top Badges: Category, Status, Priority */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Tag className="w-3 h-3" />
            {paper.category || 'Other'}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClass}`}>
            {paper.status}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityClass}`}>
            {paper.priority} Priority
          </span>
        </div>

        {/* Title */}
        <Link to={`/papers/${paper.id}`} className="block group-hover:text-indigo-600 transition">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
            {paper.title}
          </h3>
        </Link>

        {/* Authors & Year */}
        <div className="mt-2.5 space-y-1 text-xs sm:text-sm text-slate-600">
          {paper.authors && (
            <div className="flex items-center gap-1.5 line-clamp-1">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{paper.authors}</span>
            </div>
          )}
          {paper.year && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{paper.year}</span>
            </div>
          )}
        </div>

        {/* Notes preview */}
        {paper.notes && (
          <p className="mt-3 text-xs sm:text-sm text-slate-500 line-clamp-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            "{paper.notes}"
          </p>
        )}
      </div>

      {/* Action Buttons: View, Edit, Delete */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <Link
          to={`/papers/${paper.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 transition"
          title="View Details"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Link>

        <Link
          to={`/papers/${paper.id}/edit`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg border border-slate-200 transition"
          title="Edit Paper"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>

        <button
          onClick={() => onDeleteClick(paper)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition"
          title="Delete Paper"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

