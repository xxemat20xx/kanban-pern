import { useEffect, useState } from "react";
import {
    FolderKanban,
    Plus,
    Trash2,
    Search,
} from "lucide-react";

import useBoardStore from "../store/boardStore";
import useAuthStore from "../store/authStore";

import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";

const DashboardPage = () => {
    const {
        projects,
        fetchProjects,
        createTask,
        createProject,
        deleteProject,
    } = useBoardStore();

    const { logout, user } = useAuthStore();

    const [selectedProject, setSelectedProject] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newProjectName, setNewProjectName] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    // ✅ AUTO SELECT FIRST PROJECT WHEN PROJECTS LOAD
    useEffect(() => {
        if (!selectedProject && projects.length > 0) {
            setSelectedProject(projects[0]);
        }
    }, [projects, selectedProject]);

    const handleAddTask = () => {
        if (!selectedProject || !newTaskTitle.trim()) return;

        createTask(selectedProject.id, {
            title: newTaskTitle,
            status: "todo",
            tagNames: ["Frontend"],
            assignee_id: user.id,
        });

        setNewTaskTitle("");
    };

    const handleAddProject = async () => {
        if (!newProjectName.trim()) return;

        const project = await createProject(newProjectName);

        setSelectedProject(project);
        setNewProjectName("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            <Navbar onLogout={logout} />

            <div className="flex h-[calc(100vh-80px)] overflow-hidden">
                {/* Sidebar */}
                <aside className="w-80 border-r border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Projects
                        </h2>

                        <p className="text-sm text-gray-500">
                            {projects.length} Project
                            {projects.length !== 1 && "s"}
                        </p>
                    </div>

                    {/* Add Project */}
                    <div className="mb-6">
                        <div className="relative">
                            <FolderKanban
                                size={18}
                                className="absolute left-3 top-3.5 text-gray-400"
                            />

                            <input
                                value={newProjectName}
                                onChange={(e) =>
                                    setNewProjectName(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    handleAddProject()
                                }
                                placeholder="New project..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        <button
                            onClick={handleAddProject}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
                        >
                            <Plus size={18} />
                            Create Project
                        </button>
                    </div>

                    {/* Project List */}
                    <div className="space-y-3 overflow-y-auto">
                        {projects.length === 0 ? (
                            <div className="rounded-2xl bg-white p-6 text-center text-gray-400 shadow">
                                No projects yet.
                            </div>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() =>
                                        setSelectedProject(project)
                                    }
                                    className={`
                                        group cursor-pointer rounded-2xl border p-4 transition
                                        ${selectedProject?.id === project.id
                                            ? "border-blue-500 bg-blue-50 shadow-lg"
                                            : "border-transparent bg-white hover:shadow-md"
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-3 text-white">
                                                <FolderKanban size={18} />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Project
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                if (
                                                    window.confirm(
                                                        "Delete this project?"
                                                    )
                                                ) {
                                                    deleteProject(project.id);

                                                    if (
                                                        selectedProject?.id ===
                                                        project.id
                                                    ) {
                                                        setSelectedProject(null);
                                                    }
                                                }
                                            }}
                                            className="rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 overflow-hidden p-8">
                    {selectedProject ? (
                        <>
                            {/* Toolbar */}
                            <div className="mb-6 rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-xl">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800">
                                            {selectedProject.name}
                                        </h1>
                                        <p className="text-gray-500">
                                            Welcome back, {user?.email}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="relative">
                                            <Search
                                                size={18}
                                                className="absolute left-3 top-3 text-gray-400"
                                            />

                                            <input
                                                value={newTaskTitle}
                                                onChange={(e) =>
                                                    setNewTaskTitle(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    e.key === "Enter" &&
                                                    handleAddTask()
                                                }
                                                placeholder="New task..."
                                                className="w-80 rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <button
                                            onClick={handleAddTask}
                                            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <KanbanBoard
                                projectId={selectedProject.id}
                            />
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="rounded-3xl bg-white p-16 text-center shadow-xl">
                                <FolderKanban
                                    size={70}
                                    className="mx-auto text-blue-500"
                                />
                                <h2 className="mt-6 text-3xl font-bold text-gray-800">
                                    No Project Selected
                                </h2>
                                <p className="mt-3 text-gray-500">
                                    Create a new project or select one
                                    from the sidebar.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;