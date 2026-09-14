"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  FolderKanban,
  Layers3,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { apiClient, ApiError } from "@/lib/api-client";
import { PaginatedResponse, Project } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient<PaginatedResponse<Project>>("/projects");
      setProjects(response.items);
    } catch (err: unknown) {
      setError(
        err instanceof ApiError
          ? `${err.code}: ${err.message}`
          : err instanceof Error
            ? err.message
            : "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) fetchProjects();
    else if (!authLoading) setLoading(false);
  }, [authLoading, user, fetchProjects]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (showModal && !dialog.open) dialog.showModal();
    if (!showModal && dialog.open) {
      dialog.close();
      createButtonRef.current?.focus();
    }
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setCreateError(null);
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    try {
      await apiClient<Project>("/projects", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });
      setName("");
      setDescription("");
      closeModal();
      await fetchProjects();
    } catch (err: unknown) {
      setCreateError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  const visibleProjects = projects.filter((project) =>
    `${project.name} ${project.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <p className="flex items-center gap-3 text-sm text-slate-400">
          <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
          <span>Verifying authentication session…</span>
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-20 sm:px-6 lg:px-8">
        <section className="glass-card w-full p-8 sm:p-12 text-center">
          <div className="mx-auto max-w-lg space-y-4">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-teal-400/30 bg-teal-400/10 text-teal-300 shadow-glow-teal">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div className="badge-teal">Authenticated Workspace</div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Connect Your Dependency Inventories
            </h1>
            <p className="text-sm leading-relaxed text-slate-400">
              Sign in to manage projects, upload private CycloneDX SBOM snapshots, and execute real OSV advisory scans. Or explore our synthetic fixture sandbox with zero authentication.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link href="/login" className="btn-primary">
                Sign In to Workspace
              </Link>
              <Link href="/demo" className="btn-secondary">
                <Sparkles className="h-4 w-4 text-teal-400" />
                <span>Try Synthetic Demo</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-navy-850">
        <div>
          <div className="badge-teal mb-2">Project Observatory</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage applications, environments, and immutable dependency snapshots.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="btn-secondary !p-2.5"
            title="Refresh projects"
            aria-label="Refresh projects"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-teal-400" : "text-slate-300"}`}
            />
          </button>
          <button
            ref={createButtonRef}
            onClick={() => setShowModal(true)}
            className="btn-primary !text-xs !py-2.5 !px-4"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active Projects",
            value: projects.length,
            note: "Across your organization",
            icon: FolderKanban,
          },
          {
            label: "Monitored Assets",
            value: projects.reduce((sum, p) => sum + p.asset_count, 0),
            note: "Production, internal & staging",
            icon: ShieldCheck,
          },
          {
            label: "CycloneDX Snapshots",
            value: projects.reduce((sum, p) => sum + p.snapshot_count, 0),
            note: "Immutable SBOM graph models",
            icon: Layers3,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="glass-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{label}</span>
              <Icon className="h-4 w-4 text-teal-400" />
            </div>
            <div className="text-3xl font-mono font-bold text-white mt-2">
              {loading || error ? "—" : value}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{note}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-navy-750 bg-navy-950/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none transition-colors"
            placeholder="Search projects..."
            aria-label="Filter projects"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {loading ? "Syncing..." : `${visibleProjects.length} of ${projects.length} displayed`}
        </span>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchProjects} className="btn-secondary !text-xs !py-1 !px-3">
            Retry
          </button>
        </div>
      )}

      {/* Project Cards Grid */}
      <div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl border border-navy-800 bg-navy-900/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? null : projects.length === 0 ? (
          <div className="glass-card p-12 text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-navy-800 text-slate-400 mx-auto flex items-center justify-center">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-white">No projects yet</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first project to begin uploading CycloneDX software bill of materials and mapping dependency risks.
            </p>
            <button onClick={() => setShowModal(true)} className="btn-primary !text-xs !py-2.5">
              <Plus className="h-4 w-4" />
              <span>Create First Project</span>
            </button>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="glass-card p-10 text-center space-y-2">
            <Search className="h-6 w-6 text-slate-500 mx-auto" />
            <div className="text-sm font-bold text-white">No matching projects found</div>
            <p className="text-xs text-slate-400">Try adjusting your filter search term.</p>
            <button onClick={() => setQuery("")} className="text-xs text-teal-400 hover:underline pt-2">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="glass-card-hover p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {project.name}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-navy-850 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <FolderKanban className="h-3 w-3 text-teal-400" />
                      {project.asset_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers3 className="h-3 w-3 text-teal-400" />
                      {project.snapshot_count}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-500">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Native Creation Modal */}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          if (!creating) closeModal();
        }}
        onClose={() => setShowModal(false)}
        className="rounded-2xl border border-navy-700/80 bg-navy-900/95 p-6 text-white backdrop-blur-2xl shadow-2xl w-full max-w-md m-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-navy-800">
          <div>
            <div className="badge-teal mb-1.5">New Inventory</div>
            <h2 className="text-lg font-bold text-white">Create Project</h2>
          </div>
          <button
            disabled={creating}
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {createError && (
          <div className="mt-4 p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-200">
            {createError}
          </div>
        )}

        <form onSubmit={handleCreateProject} className="mt-5 space-y-4">
          <div>
            <label htmlFor="projectName" className="text-xs font-semibold text-slate-300 block mb-1.5">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="projectName"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core API Service"
              className="w-full rounded-xl border border-navy-750 bg-navy-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="projectDesc" className="text-xs font-semibold text-slate-300 block mb-1.5">
              Description <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              id="projectDesc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of applications and dependencies in this project..."
              className="w-full rounded-xl border border-navy-750 bg-navy-950 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-teal-400 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="pt-4 border-t border-navy-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={creating}
              onClick={closeModal}
              className="btn-secondary !text-xs !py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="btn-primary !text-xs !py-2"
            >
              {creating ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
