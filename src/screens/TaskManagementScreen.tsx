import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext.tsx';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  X,
  CheckCircle,
} from 'lucide-react';
import type { TaskItem, TaskStatus, TaskPriority } from '../types/index.ts';

export const TaskManagementScreen: React.FC = () => {
  const { activeProject, addTask, updateTaskStatus, openDrawer } = useProject();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discipline, setDiscipline] = useState<TaskItem['discipline']>('Structural');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeRole, setAssigneeRole] = useState('Field Engineer');
  const [dueDate, setDueDate] = useState('2026-03-31');
  const [estimatedHours, setEstimatedHours] = useState(16);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigneeName.trim()) return;

    addTask({
      projectId: activeProject.id,
      title,
      description,
      discipline,
      status: 'in_progress',
      priority,
      assigneeName,
      assigneeRole,
      dueDate,
      estimatedHours: Number(estimatedHours),
      actualHours: 0,
      isOverdue: false,
    });

    setTitle('');
    setDescription('');
    setAssigneeName('');
    setShowCreateModal(false);
  };

  const filteredTasks = activeProject.tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (disciplineFilter !== 'all' && t.discipline !== disciplineFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.assigneeName.toLowerCase().includes(q) ||
        t.discipline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'under_inspection':
        return 'warning';
      case 'blocked':
        return 'critical';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#273244] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
            Engineering & Site Task Management
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Operational action items, QA/QC testing, and trade assignments
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks, assignees, disciplines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="all">All Statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="under_inspection">Under Inspection</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
          <option value="backlog">Backlog</option>
        </select>

        {/* Discipline Filter */}
        <select
          value={disciplineFilter}
          onChange={(e) => setDisciplineFilter(e.target.value)}
          className="bg-[#111722] border border-[#273244] text-[#F8FAFC] text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#3B82F6]"
        >
          <option value="all">All Disciplines</option>
          <option value="Structural">Structural</option>
          <option value="Civil">Civil</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Electrical">Electrical</option>
          <option value="Architectural">Architectural</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div className="border border-[#273244] bg-[#111722] rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#192231]/70 text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#273244]">
            <tr>
              <th className="py-3 px-4">Task Scope</th>
              <th className="py-3 px-4">Discipline</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4 text-center">Due Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#273244]/80">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#94A3B8]">
                  No tasks found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-[#192231]/40 transition cursor-pointer"
                  onClick={() => openDrawer('task', task)}
                >
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-semibold text-[#F8FAFC] block">{task.title}</div>
                    <div className="text-[11px] text-[#94A3B8] line-clamp-1 mt-0.5">
                      {task.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] text-slate-300 bg-[#192231] px-2 py-0.5 rounded border border-[#273244]">
                      {task.discipline}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold font-mono uppercase ${
                        task.priority === 'urgent'
                          ? 'text-rose-400'
                          : task.priority === 'high'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#F8FAFC]">
                    <div>{task.assigneeName}</div>
                    <span className="text-[10px] text-[#94A3B8]">{task.assigneeRole}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className={task.isOverdue ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {task.dueDate} {task.isOverdue && '(Overdue)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge
                      label={task.status.replace('_', ' ')}
                      variant={getStatusVariant(task.status)}
                    />
                  </td>
                  <td
                    className="py-3.5 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {task.status !== 'completed' ? (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded transition"
                        title="Mark Task Complete"
                      >
                        Complete
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-mono text-[11px]">Finished</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#111722] border border-[#273244] rounded-xl p-6 text-[#F8FAFC] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#273244] pb-3 mb-4">
              <h3 className="text-base font-bold text-white">Create Engineering Task</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultrasonic weld inspection at Level 4 Grid 3B"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                  Description & Verification Standard
                </label>
                <textarea
                  rows={3}
                  placeholder="Include engineering standard, ASTM/AISC code, or inspection notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#192231] border border-[#273244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Discipline</label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as any)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="Structural">Structural</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Architectural">Architectural</option>
                    <option value="Safety">Safety</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">
                    Assignee Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance, PE"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#192231] border border-[#273244] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#273244]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
