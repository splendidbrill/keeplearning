"use client";

import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDashboardStore } from "../useDashboardStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Loader2,
  PauseCircle,
  PlayCircle,
  Rocket,
  Workflow,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-white/70 shadow-inner shadow-black/5 backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
      <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center shadow-inner shadow-rose-500/10 dark:border-rose-500/40 dark:bg-rose-500/10">
      <AlertTriangle className="h-8 w-8 text-rose-500" />
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Unable to load data</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-300">
          {message || "We ran into a problem connecting to your n8n instance. Check that it is running and try again."}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="default" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}

function DashboardOverview({ stats }) {
  const items = [
    {
      title: "Total Workflows",
      description: "Automation assets currently in your workspace",
      value: stats.totalWorkflows,
      icon: Workflow,
      accent: "from-indigo-500 to-sky-500",
    },
    {
      title: "Active Runs",
      description: "Workflows currently executing",
      value: stats.activeRuns,
      icon: Rocket,
      accent: "from-emerald-500 to-lime-500",
    },
    {
      title: "Errors Today",
      description: "Executions ended in error during the last 24 hours",
      value: stats.errorsToday,
      icon: AlertTriangle,
      accent: "from-rose-500 to-orange-500",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="relative overflow-hidden">
          <CardHeader>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-black/10", item.accent)}>
              <item.icon className="h-6 w-6" />
            </div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function WorkflowCard({ workflow, onRun, onToggleActivation, isActionLoading }) {
  return (
    <Card key={workflow.id} className="flex flex-col gap-4">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{workflow.name}</CardTitle>
          <CardDescription className="mt-1">
            {workflow?.tags?.length
              ? workflow.tags.map((tag) => `#${tag.name || tag}`).join(" • ")
              : "No tags"}
          </CardDescription>
        </div>
        <span
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            workflow.active
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"
              : "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200"
          )}
        >
          {workflow.active ? "Active" : "Paused"}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-wide text-slate-400">
          <div>
            Updated:{" "}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {formatDate(workflow.updatedAt)}
            </span>
          </div>
          <div>
            Created:{" "}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {formatDate(workflow.createdAt)}
            </span>
          </div>
          <div>
            ID:{" "}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{workflow.id}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            onClick={() => onRun(workflow.id)}
            disabled={isActionLoading}
          >
            <PlayCircle className="h-4 w-4" />
            Run
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleActivation(workflow.id, !workflow.active)}
            disabled={isActionLoading}
          >
            <PauseCircle className="h-4 w-4" />
            {workflow.active ? "Pause" : "Activate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowsView({ workflows, onRunWorkflow, onToggleWorkflowActivation }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [actionState, setActionState] = useState({ loading: false, workflowId: null });

  const filteredWorkflows = useMemo(() => {
    if (activeFilter === "all") return workflows;
    if (activeFilter === "active") return workflows.filter((workflow) => workflow.active);
    if (activeFilter === "paused") return workflows.filter((workflow) => !workflow.active);
    return workflows;
  }, [activeFilter, workflows]);

  async function handleRun(workflowId) {
    setActionState({ loading: true, workflowId });
    try {
      await onRunWorkflow(workflowId);
    } finally {
      setActionState({ loading: false, workflowId: null });
    }
  }

  async function handleToggle(workflowId, activate) {
    setActionState({ loading: true, workflowId });
    try {
      await onToggleWorkflowActivation(workflowId, activate);
    } finally {
      setActionState({ loading: false, workflowId: null });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Review every workflow in your workspace. Use the filters to narrow down active vs paused automations.
          </p>
        </TabsContent>
        <TabsContent value="active">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Workflows currently running or scheduled to run. Keep these healthy to prevent automation gaps.
          </p>
        </TabsContent>
        <TabsContent value="paused">
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Paused workflows remain in draft state and won’t execute until reactivated.
          </p>
        </TabsContent>
      </Tabs>

      {filteredWorkflows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-10 text-center shadow-inner shadow-black/5 dark:border-white/10 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No workflows found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Create your first workflow to start automating with n8n.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onRun={handleRun}
              onToggleActivation={handleToggle}
              isActionLoading={actionState.loading && actionState.workflowId === workflow.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExecutionsView({ executions }) {
  if (!executions.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-10 text-center shadow-inner shadow-black/5 dark:border-white/10 dark:bg-white/5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No execution logs yet</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Trigger a workflow to start capturing execution history.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Execution ID</TableHead>
          <TableHead>Workflow</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Started</TableHead>
          <TableHead>Finished</TableHead>
          <TableHead>Mode</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {executions.map((execution) => (
          <TableRow key={execution.id}>
            <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-300">{execution.id}</TableCell>
            <TableCell>#{execution.workflowId}</TableCell>
            <TableCell>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                  execution.status === "error"
                    ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200"
                    : execution.status === "success"
                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                )}
              >
                {execution.status}
              </span>
            </TableCell>
            <TableCell>{formatDate(execution.startedAt)}</TableCell>
            <TableCell>{formatDate(execution.stoppedAt)}</TableCell>
            <TableCell className="capitalize">{execution.mode}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WebhooksView({ webhooks }) {
  if (!webhooks.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-10 text-center shadow-inner shadow-black/5 dark:border-white/10 dark:bg-white/5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No webhooks configured</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Publish a workflow with webhook triggers to manage them here.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Path</TableHead>
          <TableHead>HTTP Method</TableHead>
          <TableHead>Workflow</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webhooks.map((webhook, index) => (
          <TableRow key={`${webhook.path}-${index}`}>
            <TableCell className="font-mono text-xs text-indigo-600 dark:text-indigo-200">{webhook.path || webhook.webhookPath}</TableCell>
            <TableCell className="uppercase">{webhook.httpMethod || webhook.method}</TableCell>
            <TableCell>{webhook.workflowId ? `#${webhook.workflowId}` : "—"}</TableCell>
            <TableCell>{formatDate(webhook.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function IntegrationsView() {
  const integrations = [
    { name: "Slack", description: "Deliver notifications to teams when automations run", status: "Connected" },
    { name: "GitHub", description: "Trigger workflows when issues or PRs change", status: "Connected" },
    { name: "Google Sheets", description: "Sync data for reporting and analytics", status: "Connected" },
    { name: "Airtable", description: "Keep structured data aligned across tools", status: "Available" },
  ];

  return (
    <div className="grid gap-4">
      {integrations.map((integration) => (
        <Card
          key={integration.name}
          className="flex flex-col justify-between gap-4 border-white/20 p-5 sm:flex-row sm:items-center"
        >
          <div>
            <CardTitle>{integration.name}</CardTitle>
            <CardDescription className="mt-1">{integration.description}</CardDescription>
          </div>
          <Button variant={integration.status === "Connected" ? "outline" : "default"}>
            {integration.status === "Connected" ? "Manage" : "Connect"}
          </Button>
        </Card>
      ))}
    </div>
  );
}

function SettingsView() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar fallback="JD" className="h-16 w-16" />
          <div>
            <CardTitle>Jane Doe</CardTitle>
            <CardDescription>workspace-admin@n8n.io</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workspace Role</h4>
            <p className="text-sm text-slate-500 dark:text-slate-300">Administrator</p>
          </div>
          <div className="flex gap-3">
            <Button size="sm">Manage Profile</Button>
            <Button size="sm" variant="ghost" className="text-rose-500 hover:text-rose-600">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage workspace access and authentication providers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">Session Timeout</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">30 minutes</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">Two-Factor Auth</span>
            <Button size="sm" variant="outline">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-300">Connected Providers</span>
            <span className="text-sm font-medium text-emerald-500">Google</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const VIEW_LABELS = {
  dashboard: "Dashboard",
  workflows: "My Workflows",
  executions: "Execution Logs",
  webhooks: "Webhooks",
  integrations: "Integrations",
  settings: "Settings",
};

function MobileNav() {
  const { selectedView, setSelectedView } = useDashboardStore(
    useShallow((state) => ({
      selectedView: state.selectedView,
      setSelectedView: state.setSelectedView,
    }))
  );

  return (
    <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-4 pt-2 lg:hidden">
      {Object.entries(VIEW_LABELS).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setSelectedView(id)}
          className={cn(
            "rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors",
            selectedView === id
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white"
              : "bg-white/70 text-slate-600 hover:bg-white dark:bg-white/10 dark:text-slate-200"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function DashboardContent() {
  const {
    selectedView,
    workflows,
    executions,
    webhooks,
    stats,
    loading,
    error,
    refresh,
    hasInitialized,
    runWorkflow,
    toggleWorkflowActivation,
  } = useDashboardStore(
    useShallow((state) => ({
      selectedView: state.selectedView,
      workflows: state.workflows,
      executions: state.executions,
      webhooks: state.webhooks,
      stats: state.stats,
      loading: state.loading,
      error: state.error,
      refresh: state.refresh,
      hasInitialized: state.hasInitialized,
      runWorkflow: state.runWorkflow,
      toggleWorkflowActivation: state.toggleWorkflowActivation,
    }))
  );

  useEffect(() => {
    if (!hasInitialized && !loading.refresh) {
      refresh();
    }
  }, [hasInitialized, loading.refresh, refresh]);

  let content = null;

  if (error) {
    content = <ErrorState message={error} onRetry={refresh} />;
  } else if (!hasInitialized && loading.refresh) {
    content = <LoadingState />;
  } else {
    switch (selectedView) {
      case "dashboard":
        content = <DashboardOverview stats={stats} />;
        break;
      case "workflows":
        content = (
          <WorkflowsView
            workflows={workflows}
            onRunWorkflow={runWorkflow}
            onToggleWorkflowActivation={toggleWorkflowActivation}
          />
        );
        break;
      case "executions":
        content = <ExecutionsView executions={executions} />;
        break;
      case "webhooks":
        content = <WebhooksView webhooks={webhooks} />;
        break;
      case "integrations":
        content = <IntegrationsView />;
        break;
      case "settings":
        content = <SettingsView />;
        break;
      default:
        content = (
          <div className="rounded-3xl border border-white/10 bg-white/70 p-10 text-center shadow-inner shadow-black/5 dark:bg-white/5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Coming Soon</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              This section is under construction. Choose another view from the sidebar.
            </p>
          </div>
        );
        break;
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col gap-6">
      <div className="lg:hidden">
        <MobileNav />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{VIEW_LABELS[selectedView]}</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading.refresh}>
            <Loader2 className={cn("h-4 w-4", loading.refresh && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {content}
    </div>
  );
}

