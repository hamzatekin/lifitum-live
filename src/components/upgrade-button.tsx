import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UpgradeButtonProps {
  currentTier: string;
  onUpgrade: (tier: string) => void;
}

export function UpgradeButton({ currentTier, onUpgrade }: UpgradeButtonProps) {
  if (currentTier === "coach") return null;

  const plans = [
    {
      name: "Pro",
      price: "$9.99/month",
      features: [
        "Unlimited room creation",
        "Advanced analytics (30-day history)",
        "Workout templates",
        "Export data (CSV, PDF)",
        "Unlimited collaboration members",
      ],
      tier: "pro",
    },
    {
      name: "Coach",
      price: "$19.99/month",
      features: [
        "Everything in Pro",
        "Client management system",
        "Custom program creation",
        "Progress reports",
        "Video exercise library",
      ],
      tier: "coach",
    },
  ];

  return (
    <div className="space-y-4">
      {currentTier === "free" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upgrade Your Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You've reached the limits of our free plan. Upgrade to unlock more features!
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {plans.map((plan) => (
                <Card key={plan.tier} className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-center">{plan.name}</CardTitle>
                    <p className="text-2xl font-bold text-center text-primary">{plan.price}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" onClick={() => onUpgrade(plan.tier)}>
                      Upgrade to {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentTier === "pro" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upgrade to Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary text-center mb-4">$19.99/month</p>
            <ul className="space-y-2 text-sm mb-4">
              {plans[1].features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={() => onUpgrade("coach")}>
              Upgrade to Coach
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
