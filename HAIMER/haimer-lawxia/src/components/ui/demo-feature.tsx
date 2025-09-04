import { FeatureSteps } from "@/components/blocks/feature-section"

const features = [
  { 
    step: 'Misión', 
    title: 'Creamos agentes de IA',
    content: 'Creamos agentes de IA que optimizan procesos y decisiones, liberando tiempo para lo estratégico y creativo.', 
    image: 'https://images.unsplash.com/photo-1723958929247-ef054b525153?q=80&w=2070&auto=format&fit=crop' 
  },
  { 
    step: 'Ideología',
    title: 'La IA como aliado invisible',
    content: 'La IA es un aliado invisible: simplifica, conecta y potencia sin reemplazar el talento humano.',
    image: 'https://images.unsplash.com/photo-1723931464622-b7df7c71e380?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    step: 'Visión',
    title: 'Liderar la integración de IA',
    content: 'Liderar la integración de IA que transforma industrias y multiplica la creatividad.',
    image: 'https://images.unsplash.com/photo-1725961476494-efa87ae3106a?q=80&w=2070&auto=format&fit=crop'
  },
]

export function FeatureStepsDemo() {
  return (
      <FeatureSteps 
        features={features}
        title="Nuestra esencia"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
  )
}


