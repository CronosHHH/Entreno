import { TiltedScroll } from "@/components/ui/tilted-scroll";

export function TiltedScrollDemo() {
  const customItems = [
    { id: "1", text: "Certeza Oficial" },
    { id: "2", text: "ADN Legal" },
    { id: "3", text: "Blindaje Dinámico" },
    { id: "4", text: "IA Confiable" },
    { id: "5", text: "Sistema de agentes" },
  ];

  return (
    <div className="space-y-8">
      <TiltedScroll 
        items={customItems}
        className="mt-8"
      />
    </div>
  );
} 