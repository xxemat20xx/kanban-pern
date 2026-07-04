import { useDroppable } from "@dnd-kit/core";
import {
    ClipboardList,
    Loader2,
    CheckCircle2,
} from "lucide-react";

const statusConfig = {
    todo: {
        title: "To Do",
        icon: ClipboardList,
        header: "from-slate-700 via-slate-800 to-slate-900",
        badge: "bg-white/20 text-white",
        dot: "bg-slate-300",
        empty: "📋",
    },
    "in-progress": {
        title: "In Progress",
        icon: Loader2,
        header: "from-blue-600 via-indigo-600 to-violet-700",
        badge: "bg-white/20 text-white",
        dot: "bg-blue-300",
        empty: "🚀",
    },
    done: {
        title: "Completed",
        icon: CheckCircle2,
        header: "from-emerald-500 via-green-600 to-teal-600",
        badge: "bg-white/20 text-white",
        dot: "bg-emerald-300",
        empty: "🎉",
    },
};

const Column = ({ id, status, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { status },
    });

    const config = statusConfig[status] || statusConfig.todo;
    const Icon = config.icon;

    const taskCount = Array.isArray(children)
        ? children.length
        : children
            ? 1
            : 0;

    return (
        <div
            ref={setNodeRef}
            className={`
                flex flex-col
                flex-1
                min-w-[350px]
                rounded-3xl
                overflow-hidden
                border
                border-white/50
                bg-white/80
                backdrop-blur-xl
                shadow-xl
                transition-all
                duration-300
                ${isOver
                    ? "scale-[1.02] ring-4 ring-blue-300 shadow-2xl"
                    : "hover:-translate-y-1 hover:shadow-2xl"
                }
            `}
        >
            {/* Header */}
            <div
                className={`
                    sticky
                    top-0
                    z-10
                    bg-gradient-to-r
                    ${config.header}
                    px-6
                    py-5
                    text-white
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                            <Icon size={24} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold tracking-wide">
                                {config.title}
                            </h2>

                            <div className="mt-1 flex items-center gap-2 text-white/80 text-sm">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${config.dot}`}
                                />
                                Active Tasks
                            </div>
                        </div>
                    </div>

                    <div
                        className={`
                            flex
                            h-10
                            min-w-[40px]
                            items-center
                            justify-center
                            rounded-full
                            px-4
                            text-sm
                            font-bold
                            backdrop-blur
                            ${config.badge}
                        `}
                    >
                        {taskCount}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div
                className={`
                    flex-1
                    overflow-y-auto
                    p-5
                    space-y-4
                    transition-all
                    duration-300
                    ${isOver
                        ? "bg-blue-50"
                        : "bg-gradient-to-b from-gray-50 via-white to-gray-50"
                    }
                `}
            >
                {taskCount > 0 ? (
                    children
                ) : (
                    <div
                        className={`
                            flex
                            h-full
                            min-h-[350px]
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border-2
                            border-dashed
                            ${isOver
                                ? "border-blue-400 bg-blue-100"
                                : "border-gray-200 bg-white/70"
                            }
                            transition-all
                            duration-300
                        `}
                    >
                        <div className="text-6xl">
                            {config.empty}
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-700">
                            No Tasks
                        </h3>

                        <p className="mt-2 max-w-[220px] text-center text-sm text-gray-500">
                            Drag and drop tasks into this column to organize your workflow.
                        </p>

                        {isOver && (
                            <div className="mt-6 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg animate-pulse">
                                Release to Drop
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;