"use client";
import { Calendar, Code, FileText, User, Clock, MessageSquare, ListTodo, Bell } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Tareas",
    date: "Jan 2024",
    content: "Establecimiento de cronogramas y asignación de responsabilidades.",
    category: "Planning",
    icon: ListTodo,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Calendario",
    date: "Feb 2024",
    content: "UI/UX design and system architecture.",
    category: "Design",
    icon: Calendar,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Notificaciones",
    date: "Mar 2024",
    content: "Core features implementation and testing.",
    category: "Development",
    icon: Bell,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "AI chat",
    date: "Apr 2024",
    content: "Asistente de IA que solo conoce el BOE",
    category: "AI",
    icon: MessageSquare,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Perfil",
    date: "May 2024",
    content: "Completa y gestiona la información de tu empresa.",
    category: "Perfil",
    icon: User,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={timelineData} />
    </>
  );
}

export default {
  RadialOrbitalTimelineDemo,
};
