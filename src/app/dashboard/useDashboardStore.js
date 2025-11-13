// "use client";

// import { create } from "zustand";

// const API_BASE_URL = process.env.NEXT_PUBLIC_N8N_API_URL || "http://localhost:5678";

// async function fetchJson(path, { signal, method = "GET", body } = {}) {
//   const response = await fetch(`${API_BASE_URL}${path}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     credentials: "include",
//     signal,
//     body,
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
//   }

//   return response.json();
// }

// function computeDashboardStats(workflows, executions) {
//   const totalWorkflows = workflows.length;
//   const activeRuns = executions.filter((execution) => execution.status === "running").length;

//   const now = new Date();
//   const errorsToday = executions.filter((execution) => {
//     if (execution.status !== "error") return false;
//     const startedAt = execution?.startedAt ? new Date(execution.startedAt) : null;
//     if (!startedAt) return false;
//     return (
//       startedAt.getFullYear() === now.getFullYear() &&
//       startedAt.getMonth() === now.getMonth() &&
//       startedAt.getDate() === now.getDate()
//     );
//   }).length;

//   return {
//     totalWorkflows,
//     activeRuns,
//     errorsToday,
//   };
// }

// const initialState = {
//   selectedView: "dashboard",
//   workflows: [],
//   executions: [],
//   webhooks: [],
//   loading: {
//     workflows: false,
//     executions: false,
//     webhooks: false,
//     refresh: false,
//   },
//   error: null,
//   stats: {
//     totalWorkflows: 0,
//     activeRuns: 0,
//     errorsToday: 0,
//   },
//   hasInitialized: false,
// };

// // Cache the server snapshot to avoid infinite loops
// let cachedServerSnapshot = null;
// const getServerSnapshot = () => {
//   if (!cachedServerSnapshot) {
//     cachedServerSnapshot = initialState;
//   }
//   return cachedServerSnapshot;
// };

// export const useDashboardStore = create((set, get) => ({
//   ...initialState,
//   setSelectedView: (selectedView) => set({ selectedView }),

//   refresh: async () => {
//     const { loading } = get();
//     if (loading.refresh) return;

//     const abortController = new AbortController();

//     set({
//       loading: { workflows: true, executions: true, webhooks: true, refresh: true },
//       error: null,
//     });

//     try {
//       const [workflowsPayload, executionsPayload, webhooksPayload] = await Promise.all([
//         fetchJson("/rest/workflows", { signal: abortController.signal }),
//         fetchJson("/rest/executions", { signal: abortController.signal }),
//         fetchJson("/rest/webhooks", { signal: abortController.signal }),
//       ]);

//       // n8n returns collections in { data: [] } shape
//       const workflows = Array.isArray(workflowsPayload?.data) ? workflowsPayload.data : workflowsPayload || [];
//       const executions = Array.isArray(executionsPayload?.data) ? executionsPayload.data : executionsPayload || [];
//       const webhooks = Array.isArray(webhooksPayload?.data) ? webhooksPayload.data : webhooksPayload || [];

//       set({
//         workflows,
//         executions,
//         webhooks,
//         stats: computeDashboardStats(workflows, executions),
//         loading: { workflows: false, executions: false, webhooks: false, refresh: false },
//         hasInitialized: true,
//       });
//     } catch (error) {
//       if (error.name === "AbortError") {
//         return;
//       }

//       set({
//         error: error.message || "Failed to load data from n8n",
//         loading: { workflows: false, executions: false, webhooks: false, refresh: false },
//       });
//     }
//   },
//   runWorkflow: async (workflowId) => {
//     try {
//       await fetchJson("/rest/workflows/run", {
//         method: "POST",
//         body: JSON.stringify({ workflowId }),
//       });
//     } catch (error) {
//       console.error("Unable to run workflow", error);
//       throw error;
//     }
//   },
//   toggleWorkflowActivation: async (workflowId, activate) => {
//     const { workflows } = get();

//     try {
//       await fetchJson(`/rest/workflows/${workflowId}/activate`, {
//         method: "POST",
//         body: JSON.stringify({ activate }),
//       });

//       const updatedWorkflows = workflows.map((workflow) =>
//         workflow.id === workflowId ? { ...workflow, active: activate } : workflow
//       );

//       set({
//         workflows: updatedWorkflows,
//         stats: computeDashboardStats(updatedWorkflows, get().executions),
//       });
//     } catch (error) {
//       console.error("Unable to update workflow activation", error);
//       throw error;
//     }
//   },
// }), {
//   getServerSnapshot,
// });

"use client";

import { create } from "zustand";

const API_BASE_URL = process.env.NEXT_PUBLIC_N8N_API_URL || "http://localhost:5678";

async function fetchJson(path, { signal, method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    // REMOVED: credentials: "include", // This is the primary auth-related removal
    signal,
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function computeDashboardStats(workflows, executions) {
  const totalWorkflows = workflows.length;
  const activeRuns = executions.filter((execution) => execution.status === "running").length;

  const now = new Date();
  const errorsToday = executions.filter((execution) => {
    if (execution.status !== "error") return false;
    const startedAt = execution?.startedAt ? new Date(execution.startedAt) : null;
    if (!startedAt) return false;
    return (
      startedAt.getFullYear() === now.getFullYear() &&
      startedAt.getMonth() === now.getMonth() &&
      startedAt.getDate() === now.getDate()
    );
  }).length;

  return {
    totalWorkflows,
    activeRuns,
    errorsToday,
  };
}

const initialState = {
  selectedView: "dashboard",
  workflows: [],
  executions: [],
  webhooks: [],
  loading: {
    workflows: false,
    executions: false,
    webhooks: false,
    refresh: false,
  },
  error: null,
  stats: {
    totalWorkflows: 0,
    activeRuns: 0,
    errorsToday: 0,
  },
  hasInitialized: false,
};

// Cache the server snapshot to avoid infinite loops
let cachedServerSnapshot = null;
const getServerSnapshot = () => {
  if (!cachedServerSnapshot) {
    cachedServerSnapshot = initialState;
  }
  return cachedServerSnapshot;
};

export const useDashboardStore = create((set, get) => ({
  ...initialState,
  setSelectedView: (selectedView) => set({ selectedView }),

  refresh: async () => {
    const { loading } = get();
    if (loading.refresh) return;

    const abortController = new AbortController();

    set({
      loading: { workflows: true, executions: true, webhooks: true, refresh: true },
      error: null,
    });

    try {
      const [workflowsPayload, executionsPayload, webhooksPayload] = await Promise.all([
        fetchJson("/rest/workflows", { signal: abortController.signal }),
        fetchJson("/rest/executions", { signal: abortController.signal }),
        fetchJson("/rest/webhooks", { signal: abortController.signal }),
      ]);

      // n8n returns collections in { data: [] } shape
      const workflows = Array.isArray(workflowsPayload?.data) ? workflowsPayload.data : workflowsPayload || [];
      const executions = Array.isArray(executionsPayload?.data) ? executionsPayload.data : executionsPayload || [];
      const webhooks = Array.isArray(webhooksPayload?.data) ? webhooksPayload.data : webhooksPayload || [];

      set({
        workflows,
        executions,
        webhooks,
        stats: computeDashboardStats(workflows, executions),
        loading: { workflows: false, executions: false, webhooks: false, refresh: false },
        hasInitialized: true,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      set({
        error: error.message || "Failed to load data from n8n",
        loading: { workflows: false, executions: false, webhooks: false, refresh: false },
      });
    }
  },
  runWorkflow: async (workflowId) => {
    try {
      await fetchJson("/rest/workflows/run", {
        method: "POST",
        body: JSON.stringify({ workflowId }),
      });
    } catch (error) {
      console.error("Unable to run workflow", error);
      throw error;
    }
  },
  toggleWorkflowActivation: async (workflowId, activate) => {
    const { workflows } = get();

    try {
      await fetchJson(`/rest/workflows/${workflowId}/activate`, {
        method: "POST",
        body: JSON.stringify({ activate }),
      });

      const updatedWorkflows = workflows.map((workflow) =>
        workflow.id === workflowId ? { ...workflow, active: activate } : workflow
      );

      set({
        workflows: updatedWorkflows,
        stats: computeDashboardStats(updatedWorkflows, get().executions),
      });
    } catch (error) {
      console.error("Unable to update workflow activation", error);
      throw error;
    }
  },
}), {
  getServerSnapshot,
});