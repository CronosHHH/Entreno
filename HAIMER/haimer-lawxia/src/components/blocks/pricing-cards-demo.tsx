import { PricingCards } from "@/components/ui/pricing-cards";

const tiers = [
    {
        name: "SELF",
        price: 299,
        description: "For small teams and growing businesses",
        features: [
            { name: "Up to 20 team members", included: true },
            { name: "Advanced analytics", included: true },
            { name: "24/7 email support", included: true },
            { name: "API access", included: true, highlight: true },
            { name: "Custom integrations", included: false },
            { name: "Enterprise features", included: false },
        ],
        cta: {
            text: "Get started",
            href: "/signup",
        }
    },
    {
        name: "TEAM",
        price: 999,
        interval: "monthly",
        description: "For large organizations and enterprises",
        highlight: true,
        features: [
            { name: "Unlimited team members", included: true },
            { name: "Advanced analytics", included: true },
            { name: "24/7 priority support", included: true },
            { name: "Unlimited API access", included: true, highlight: true },
            { name: "Custom integrations", included: true },
            { name: "Enterprise features", included: true },
        ],
        cta: {
            text: "Contact sales",
            onClick: () => console.log("Contact sales clicked"),
        }
    },
];

function PricingPage() {
    return (
        <PricingCards 
            tiers={tiers}
            className="gap-6"
            containerClassName="py-12"
        />
    );
}

export { PricingPage }; 