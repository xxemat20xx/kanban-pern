import { create } from 'zustand';
import api from '../api/axiosInstance';

const useBoardStore = create((set, get) => ({
    projects: [],
    tasks: [],
    selectedProjectId: null,

    fetchProjects: async () => {
        try {
            const res = await api.get('/projects');
            set({ projects: res.data });
        } catch (error) {
            console.error('Fetch projects error:', error);
        }
    },
    fetchTasks: async (projectId) => {
        const res = await api.get(`/projects/${projectId}/tasks`);
        set({ tasks: res.data, selectedProjectId: projectId });
    },
    createProject: async (name, description = '') => {
        const res = await api.post('/projects', { name, description });
        // Add the new project to the list and select it automatically
        set((state) => ({
            projects: [...state.projects, res.data],
            selectedProjectId: res.data.id,
        }));
        return res.data;
    },
    createTask: async (projectId, taskData) => {
        const res = await api.post(`/projects/${projectId}/tasks`, taskData);
        set((state) => ({ tasks: [...state.tasks, res.data] }));
    },
    updateTaskStatus: async (taskId, status, position) => {
        const res = await api.put(`/projects/tasks/${taskId}`, { status, position });
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? res.data : t)),
        }));
    },
    deleteTask: async (taskId) => {
        console.log('📡 Sending DELETE for task:', taskId);
        await api.delete(`/projects/tasks/${taskId}`);
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId)
        }));
    },
    deleteProject: async (projectId) => {
        await api.delete(`/projects/${projectId}`);
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId),
            selectedProjectId: state.selectedProjectId === projectId ? null : state.selectedProjectId,
            tasks: state.selectedProjectId === projectId ? [] : state.tasks,
        }));
    },
    reset: () => set({ projects: [], tasks: [], selectedProjectId: null }),
}));
export default useBoardStore;