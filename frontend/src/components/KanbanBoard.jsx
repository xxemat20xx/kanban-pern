import { useEffect } from "react";
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import useBoardStore from "../store/boardStore";
import TaskCard from "./TaskCard";
import Column from "./Column";

const columns = ["todo", "in-progress", "done"];

const KanbanBoard = ({ projectId }) => {
    const { tasks, fetchTasks, updateTaskStatus } = useBoardStore();

    // ✅ Multi-sensor with activation constraints
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
        useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    );

    useEffect(() => {
        if (projectId) fetchTasks(projectId);
    }, [projectId]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        console.log("🔹 Drag ended:", { active, over });

        if (!over) return;

        const taskId = Number(active.id);

        // 1. Try to get status from the column (if dropped on a column)
        let newStatus = over.data.current?.status;

        // 2. If dropped on a task, derive status from that task's own status
        if (!newStatus) {
            const droppedOnTask = tasks.find((t) => t.id === Number(over.id));
            if (droppedOnTask) {
                newStatus = droppedOnTask.status;
            }
        }

        console.log("taskId:", taskId, "newStatus:", newStatus);

        if (!newStatus) return;

        const currentTask = tasks.find((task) => task.id === taskId);
        if (currentTask && currentTask.status !== newStatus) {
            updateTaskStatus(taskId, newStatus, currentTask.position);
        }
    };

    const todoCount = tasks.filter((t) => t.status === "todo").length;
    const progressCount = tasks.filter((t) => t.status === "in-progress").length;
    const doneCount = tasks.filter((t) => t.status === "done").length;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
            {/* Header – keep your existing header code */}
            <div className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-[1800px] items-center justify-between px-8 py-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
                        <p className="mt-1 text-gray-500">Drag and drop tasks between columns.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="rounded-2xl bg-white px-5 py-3 shadow-md">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
                        </div>
                        <div className="rounded-2xl bg-blue-50 px-5 py-3 shadow-md">
                            <p className="text-xs uppercase tracking-wide text-blue-600">Progress</p>
                            <p className="text-2xl font-bold text-blue-700">{progressCount}</p>
                        </div>
                        <div className="rounded-2xl bg-green-50 px-5 py-3 shadow-md">
                            <p className="text-xs uppercase tracking-wide text-green-600">Completed</p>
                            <p className="text-2xl font-bold text-green-700">{doneCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Board */}
            <div className="mx-auto max-w-[1800px] px-8 py-8">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex w-full gap-8 overflow-x-auto pb-4">
                        {columns.map((status) => (
                            <Column key={status} id={status} status={status}>
                                <SortableContext
                                    items={tasks
                                        .filter((task) => task.status === status)
                                        .map((task) => String(task.id))}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {tasks
                                        .filter((task) => task.status === status)
                                        .map((task) => (
                                            <TaskCard key={task.id} task={task} />
                                        ))}
                                </SortableContext>
                            </Column>
                        ))}
                    </div>
                </DndContext>
            </div>
        </div>
    );
};

export default KanbanBoard;