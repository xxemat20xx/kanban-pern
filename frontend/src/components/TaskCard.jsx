import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, User, GripVertical, Tag } from "lucide-react";

import useAuthStore from "../store/authStore";
import useBoardStore from "../store/boardStore";

const statusBorder = {
    todo: "border-l-slate-500",
    "in-progress": "border-l-blue-500",
    done: "border-l-emerald-500",
};

const TaskCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(task.id) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none", // ✅ Prevents browser interference
    };

    const { user } = useAuthStore();
    const { deleteTask } = useBoardStore();

    const assigneeDisplay = task.assignee_email
        ? user?.email === task.assignee_email
            ? "You"
            : task.assignee_email
        : "Unassigned";

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm("Delete this task?")) {
            deleteTask(task.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        group
        relative
        rounded-2xl
        border
        border-gray-200
        border-l-4
        ${statusBorder[task.status] || "border-l-slate-500"}
        bg-white/90
        backdrop-blur
        p-5
        shadow-sm
        transition-all
        duration-300
        cursor-grab
        active:cursor-grabbing
        ${isDragging ? "rotate-2 scale-105 shadow-2xl opacity-90 cursor-grabbing" : "hover:-translate-y-1 hover:shadow-xl"}
      `}
        >
            {/* Top Bar */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <GripVertical size={18} className="text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                </div>
                <button
                    onPointerDown={handleDelete}
                    className="rounded-lg p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    title="Delete task"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Description */}
            {task.description && (
                <p className="mb-4 text-sm leading-relaxed text-gray-600">{task.description}</p>
            )}

            {/* Tags */}
            {task.tags?.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                            <Tag size={12} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <User size={14} />
                    </div>
                    <span className="font-medium">{assigneeDisplay}</span>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    {task.status.replace("-", " ")}
                </span>
            </div>
        </div>
    );
};

export default TaskCard;