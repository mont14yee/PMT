import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  FileCode,
} from 'lucide-react';
import type { DocumentItem, DocumentCategory, DocumentStatus } from '../types/index.ts';

export const DocumentRegisterScreen: React.FC = () => {
  const { activeProject, addDocument, openDrawer } = useProject();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Document Form
  const [docNumber, setDocNumber] = useState('');
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('Structural');
  const [category, setCategory] = useState<DocumentCategory>('drawing');
  const [revision, setRevision] = useState('Rev A');
  const [author, setAuthor] = useState('');

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim() || !title.trim()) return;

    addDocument({
      projectId: activeProject.id,
      documentNumber: docNumber,
      title,
      discipline,
      category,
      revision,
      status: 'under_review',
      author: author || 'Project Engineering Team',
      releaseDate: new Date().toISOString().split('T')[0],
      fileSizeBytes: 14500000,
      fileType: 'PDF',
    });

    setDocNumber('');
    setTitle('');
    setShowUploadModal(false);
  };

  const filteredDocs = activeProject.documents.filter((d) => {
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.documentNumber.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q) ||
        d.discipline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'approved_for_construction':
        return <StatusBadge label="AFC Approved" variant="success" />;
      case 'under_review':
        return <StatusBadge label="Under Review" variant="warning" />;
      case 'revise_and_resubmit':
        return <StatusBadge label="Revise & Resubmit" variant="critical" />;
      default:
        return <StatusBadge label="Superseded" variant="neutral" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Document & Drawing Register
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Engineering drawings, specifications, structural calculations, and permit vault
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document number (e.g. S-201), title, discipline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="all">All Document Types</option>
          <option value="drawing">Drawings (CAD/BIM)</option>
          <option value="specification">Specifications</option>
          <option value="submittal">Shop Submittals</option>
          <option value="structural_calc">Engineering Calculations</option>
        </select>
      </div>

      {/* Document Table */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#192231]/70 text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#273244]">
            <tr>
              <th className="py-3 px-4">Doc #</th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4 text-center">Revision</th>
              <th className="py-3 px-4">Authoring Firm</th>
              <th className="py-3 px-4 text-center">Release Date</th>
              <th className="py-3 px-4 text-center">Approval Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#273244]/80">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#94A3B8]">
                  No documents found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => openDrawer('document', doc)}
                  className="hover:bg-[#192231]/40 transition cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#F59E0B]">
                    {doc.documentNumber}
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="font-semibold text-[#F8FAFC] block">{doc.title}</span>
                    <span className="text-[10px] text-[#94A3B8] capitalize font-mono">
                      {doc.category.replace('_', ' ')} · {formatFileSize(doc.fileSizeBytes)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{doc.discipline}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                    <span className="bg-[#192231] border border-[#273244] px-2 py-0.5 rounded">
                      {doc.revision}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#F8FAFC]">{doc.author}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-[#94A3B8]">
                    {doc.releaseDate}
                  </td>
                  <td className="py-3.5 px-4 text-center">{getStatusBadge(doc.status)}</td>
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => alert(`Simulating secure download for ${doc.documentNumber} (${doc.revision})`)}
                      className="p-1.5 rounded text-[#3B82F6] hover:bg-[#192231] border border-[#273244] transition"
                      title="Download Controlled PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Register Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Register Engineering Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Doc Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S-301 or CALC-09"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Initial Revision *</label>
                  <input
                    type="text"
                    required
                    value={revision}
                    onChange={(e) => setRevision(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#94A3B8] block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seismic Lateral Bracing Connection Detail"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  >
                    <option value="drawing">Drawing (CAD/BIM)</option>
                    <option value="specification">Specification</option>
                    <option value="submittal">Shop Submittal</option>
                    <option value="structural_calc">Structural Calculations</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#94A3B8] block mb-1">Discipline</label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                  >
                    <option value="Structural">Structural</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Architectural">Architectural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#94A3B8] block mb-1">Authoring Firm</label>
                <input
                  type="text"
                  placeholder="e.g. Simpson Gumpertz & Heger"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
