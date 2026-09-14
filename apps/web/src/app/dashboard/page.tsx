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
            : "Failed to load projects.",
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
            : "Failed to create project.",
      );
    } finally {
      setCreating(false);
    }
  };
  const visibleProjects = projects.filter((project) =>
    `${project.name} ${project.description ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  if (authLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="flex items-center gap-3 text-sm text-slate-400">
          <RefreshCw className="h-4 w-4 animate-spin text-teal-300" /> Verifying
          authentication session…
        </p>
      </div>
    );
  if (!user)
    return (
      <div className="mx-auto flex w-full max-w-[1320px] flex-1 items-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="callout-panel w-full text-center">
          <div className="mx-auto max-w-lg">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-teal-400/25 bg-teal-400/10 text-teal-300">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <p className="eyebrow mt-5">Protected workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Bring your own inventory.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to create projects and manage private CycloneDX dependency
              snapshots. The public synthetic laboratory stays available without
              an account.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/login" className="button-primary justify-center">
                Sign in
              </Link>
              <Link href="/demo" className="button-secondary justify-center">
                Try synthetic demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    );

  return (
    <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <section className="dashboard-head">
        <div>
          <p className="eyebrow">Security workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">
            Your security workspace.
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your applications, environments, and dependency snapshots in
            one place.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProjects}
            className="icon-button"
            title="Refresh projects"
            aria-label="Refresh projects"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-teal-300" : ""}`}
            />
          </button>
          <button
            ref={createButtonRef}
            onClick={() => setShowModal(true)}
            className="button-primary"
          >
            <Plus className="h-4 w-4" /> New project
          </button>
        </div>
      </section>
      <section
        aria-label="Loaded project overview"
        className="mt-6 grid gap-3 sm:grid-cols-3"
      >
        {[
          {
            label: "Projects in view",
            value: projects.length,
            note: "Your loaded project inventory",
            icon: FolderKanban,
          },
          {
            label: "Application assets",
            value: projects.reduce(
              (sum, project) => sum + project.asset_count,
              0,
            ),
            note: "Across loaded projects",
            icon: ShieldCheck,
          },
          {
            label: "Dependency snapshots",
            value: projects.reduce(
              (sum, project) => sum + project.snapshot_count,
              0,
            ),
            note: "Across loaded projects",
            icon: Layers3,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <article key={label} className="workspace-panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">{label}</p>
              <Icon className="h-4 w-4 text-teal-300" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {loading || error ? "—" : value}
            </p>
            <p className="mt-2 text-[11px] text-slate-400">{note}</p>
          </article>
        ))}
      </section>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="workspace-input pl-9"
            placeholder="Filter loaded projects"
            aria-label="Filter projects"
          />
        </div>
        <p className="text-xs text-slate-400">
          {loading
            ? "Loading projects…"
            : `${projects.length} loaded ${projects.length === 1 ? "project" : "projects"}`}
        </p>
      </div>
      {error ? (
        <section
          role="alert"
          className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-100"
        >
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
            <div>
              <h2 className="font-semibold">Projects could not be loaded</h2>
              <p className="mt-1 text-xs text-rose-200/90">{error}</p>
            </div>
          </div>
          <button
            onClick={fetchProjects}
            className="button-secondary border-rose-300/30 px-3 py-2 text-rose-100"
          >
            Retry
          </button>
        </section>
      ) : null}
      <section className="mt-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl border border-navy-800 bg-navy-900/55"
              />
            ))}
          </div>
        ) : error ? null : projects.length === 0 ? (
          <EmptyState create={() => setShowModal(true)} />
        ) : visibleProjects.length === 0 ? (
          <div className="workspace-panel p-10 text-center">
            <Search className="mx-auto h-6 w-6 text-slate-500" />
            <h2 className="mt-3 font-semibold text-white">
              No matching projects
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Clear the filter or use a different project name.
            </p>
            <button
              onClick={() => setQuery("")}
              className="quiet-link mt-4 text-xs"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
      <dialog
        ref={dialogRef}
        onCancel={(event) => {
          event.preventDefault();
          if (!creating) closeModal();
        }}
        onClose={() => setShowModal(false)}
        aria-labelledby="create-project-heading"
        aria-describedby="create-project-description"
        className="project-dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">New workspace</p>
            <h2
              id="create-project-heading"
              className="mt-1 text-xl font-semibold text-white"
            >
              Create a project
            </h2>
            <p
              id="create-project-description"
              className="mt-2 text-xs leading-5 text-slate-400"
            >
              Projects group applications and their immutable dependency
              snapshots.
            </p>
          </div>
          <button
            disabled={creating}
            onClick={closeModal}
            className="icon-button"
            aria-label="Close create project dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {createError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-100"
          >
            {createError}
          </div>
        )}
        <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
          <div>
            <label htmlFor="projectName" className="input-label">
              Project name <span aria-hidden="true">*</span>
            </label>
            <input
              id="projectName"
              autoFocus
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="workspace-input"
              placeholder="e.g. Payments platform"
            />
          </div>
          <div>
            <label htmlFor="projectDescription" className="input-label">
              Description{" "}
              <span className="font-normal text-slate-500">optional</span>
            </label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="workspace-input min-h-24 resize-y"
              placeholder="What this project contains"
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-navy-700/70 pt-5">
            <button
              type="button"
              disabled={creating}
              onClick={closeModal}
              className="button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !name.trim()}
              className="button-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

function EmptyState({ create }: { create: () => void }) {
  return (
    <div className="workspace-panel p-10 text-center sm:p-16">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-navy-800 text-slate-400">
        <FolderKanban className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-white">No projects yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-400">
        Create a project before adding applications and CycloneDX inventories.
        Nothing has been scanned or scored yet.
      </p>
      <button onClick={create} className="button-primary mx-auto mt-6">
        <Plus className="h-4 w-4" /> Create first project
      </button>
    </div>
  );
}
function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="project-card group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="line-clamp-1 text-lg font-semibold text-white group-hover:text-teal-200">
            {project.name}
          </h2>
          <p className="mt-2 min-h-10 line-clamp-2 text-xs leading-5 text-slate-400">
            {project.description || "No project description provided."}
          </p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-teal-300" />
      </div>
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-navy-700/70 pt-4 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <FolderKanban className="h-3.5 w-3.5 text-teal-300" />{" "}
          {project.asset_count} {project.asset_count === 1 ? "asset" : "assets"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Layers3 className="h-3.5 w-3.5 text-teal-300" />{" "}
          {project.snapshot_count}{" "}
          {project.snapshot_count === 1 ? "snapshot" : "snapshots"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />{" "}
          {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
