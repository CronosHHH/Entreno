"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";

// Type definitions
interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

// Initial task data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Preparación para la Declaración de la Renta",
    description:
      "Preparar toda la información necesaria para la declaración de la renta",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Contactar con los responsables fiscales",
        description:
          "Contactar con los responsables fiscales de la empresa para recopilar información",
        status: "completed",
        priority: "high",
        tools: [],
      },
      {
        id: "1.2",
        title: "Revisar la documentación contable existente",
        description:
          "Revisar toda la documentación contable disponible y extraer los datos relevantes",
        status: "completed",
        priority: "medium",
        tools: [],
      },
      {
        id: "1.3",
        title: "Elaborar informe con los datos fiscales recopilados",
        description:
          "Elaborar un informe con todos los datos fiscales recopilados para la declaración",
        status: "need-help",
        priority: "medium",
        tools: [],
      },
    ],
  },
  {
    id: "2",
    title: "Revisión del Marco Fiscal de la Empresa",
    description: "Revisar el marco fiscal aplicable a la empresa",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [],
  },
  {
    id: "3",
    title: "Planificación del Proceso de Declaración",
    description: "Planificar el proceso y los pasos para la declaración de la renta",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["1", "2"],
    subtasks: [],
  },
  {
    id: "4",
    title: "Configuración del Entorno Contable-Fiscal",
    description: "Configurar las herramientas y el entorno para la gestión contable y fiscal",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [],
  },
  {
    id: "5",
    title: "Presentación de la Declaración en la Agencia Tributaria",
    description: "Presentar la declaración de la renta ante la Agencia Tributaria",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["4"],
    subtasks: [],
  },
];

export default function Plan() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["1"]);
  const [expandedSubtasks, setExpandedSubtasks] = useState<{
    [key: string]: boolean;
  }>({});

  // Toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  // Toggle subtask expansion
  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle task status
  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const statuses = ["completed", "in-progress", "pending", "need-help", "failed"];
          const currentIndex = Math.floor(Math.random() * statuses.length);
          const newStatus = statuses[currentIndex];

          const updatedSubtasks = task.subtasks.map((subtask) => ({
            ...subtask,
            status: newStatus === "completed" ? "completed" : subtask.status,
          }));

          return {
            ...task,
            status: newStatus,
            subtasks: updatedSubtasks,
          };
        }
        return task;
      }),
    );
  };

  // Toggle subtask status
  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              const newStatus =
                subtask.status === "completed" ? "pending" : "completed";
              return { ...subtask, status: newStatus };
            }
            return subtask;
          });

          const allSubtasksCompleted = updatedSubtasks.every(
            (s) => s.status === "completed",
          );

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: allSubtasksCompleted ? "completed" : task.status,
          };
        }
        return task;
      }),
    );
  };

  return (
    <div className="w-full max-w-full">
      <div className="w-full">
        <ul className="space-y-1 w-full">
          {tasks.map((task, index) => {
            const isExpanded = expandedTasks.includes(task.id);
            const isCompleted = task.status === "completed";

            return (
              <li
                key={task.id}
                className={`${index !== 0 ? "mt-1 pt-2" : ""}`}
              >
                {/* Task row */}
                <div className="group flex items-start px-3 py-1.5 rounded-md w-full">
                  <div
                    className="mr-2 flex-shrink-0 cursor-pointer mt-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskStatus(task.id);
                    }}
                  >
                    <div>
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                      ) : task.status === "in-progress" ? (
                        <CircleDotDashed className="h-4.5 w-4.5 text-blue-500" />
                      ) : task.status === "need-help" ? (
                        <CircleAlert className="h-4.5 w-4.5 text-yellow-500" />
                      ) : task.status === "failed" ? (
                        <CircleX className="h-4.5 w-4.5 text-red-500" />
                      ) : (
                        <Circle className="text-muted-foreground h-4.5 w-4.5" />
                      )}
                    </div>
                  </div>

                  <div
                    className="flex min-w-0 flex-grow cursor-pointer items-start justify-between w-full"
                    onClick={() => toggleTaskExpansion(task.id)}
                  >
                    <div className="mr-2 flex-1 break-words">
                      <span
                        className={`${isCompleted ? "text-muted-foreground line-through" : ""}`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex flex-shrink-0 items-center space-x-2 text-xs">
                      {task.dependencies.length > 0 && (
                        <div className="flex items-center mr-2">
                          <div className="flex flex-wrap gap-1">
                            {task.dependencies.map((dep, idx) => (
                              <span
                                key={idx}
                                className="bg-secondary/40 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm"
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <span
                        className={`rounded px-1.5 py-0.5 ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : task.status === "need-help"
                                ? "bg-yellow-100 text-yellow-700"
                                : task.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                {isExpanded && task.subtasks.length > 0 && (
                  <div className="relative w-full">
                    <div className="absolute top-0 bottom-0 left-[20px] border-l-2 border-dashed border-muted-foreground/30" />
                    <ul className="border-muted mt-1 mr-2 mb-1.5 ml-3 space-y-0.5 w-full">
                      {task.subtasks.map((subtask) => {
                        const subtaskKey = `${task.id}-${subtask.id}`;
                        const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                        return (
                          <li
                            key={subtask.id}
                            className="group flex flex-col py-0.5 pl-6"
                            onClick={() =>
                              toggleSubtaskExpansion(task.id, subtask.id)
                            }
                          >
                            <div className="flex flex-1 items-start rounded-md p-1 w-full">
                              <div
                                className="mr-2 flex-shrink-0 cursor-pointer mt-0.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubtaskStatus(task.id, subtask.id);
                                }}
                              >
                                <div>
                                  {subtask.status === "completed" ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                  ) : subtask.status === "in-progress" ? (
                                    <CircleDotDashed className="h-3.5 w-3.5 text-blue-500" />
                                  ) : subtask.status === "need-help" ? (
                                    <CircleAlert className="h-3.5 w-3.5 text-yellow-500" />
                                  ) : subtask.status === "failed" ? (
                                    <CircleX className="h-3.5 w-3.5 text-red-500" />
                                  ) : (
                                    <Circle className="text-muted-foreground h-3.5 w-3.5" />
                                  )}
                                </div>
                              </div>

                              <span
                                className={`cursor-pointer text-sm break-words flex-1 ${subtask.status === "completed" ? "text-muted-foreground line-through" : ""}`}
                              >
                                {subtask.title}
                              </span>
                            </div>

                            {isSubtaskExpanded && (
                              <div className="text-muted-foreground border-foreground/20 mt-1 ml-1.5 border-l border-dashed pl-5 text-xs w-full">
                                <p className="py-1 break-words">{subtask.description}</p>
                                {subtask.tools && subtask.tools.length > 0 && (
                                  <div className="mt-0.5 mb-1 flex flex-wrap items-center gap-1.5">
                                    <span className="text-muted-foreground font-medium">
                                      MCP Servers:
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {subtask.tools.map((tool, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-secondary/40 text-secondary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium shadow-sm"
                                        >
                                          {tool}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
