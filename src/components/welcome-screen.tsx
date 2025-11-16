import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function WelcomeScreen() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Liftium! 👋</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed">
            We're excited to have you here! Liftium is your science-based training companion designed to help you
            maximize your gains while managing fatigue intelligently.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-medium text-base">Smart Set Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Every set you log is analyzed for its Stimulus-to-Fatigue Ratio (SFR), helping you understand which
                  sets are most effective for muscle growth.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">🔬</span>
              <div>
                <p className="font-medium text-base">Evidence-Based Recommendations</p>
                <p className="text-sm text-muted-foreground">
                  Our feedback is backed by meta-analyses and research from PubMed. We provide direct links to the
                  studies that inform our recommendations.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <p className="font-medium text-base">Transparent & Opinionated</p>
                <p className="text-sm text-muted-foreground">
                  We give you our honest, science-backed verdicts for each set, complete with source citations so you
                  can verify the science yourself.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glossary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Key Terms to Know 📚</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="font-semibold text-base">Stimulus</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The muscle-building signal your training creates. Higher stimulus means more potential for growth. Sets
              closer to failure typically provide greater stimulus for hypertrophy.
            </p>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-1">
            <p className="font-semibold text-base">Fatigue</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The recovery cost of your training. All training creates fatigue, but some sets create more than others.
              Managing fatigue is key to sustainable progress and avoiding overtraining.
            </p>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-1">
            <p className="font-semibold text-base">RIR (Reps in Reserve)</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              How many more reps you could have done before reaching failure. RIR 0 = failure, RIR 1 = one rep left in
              the tank, RIR 2 = two reps left, etc. This helps track how close to failure you're training.
            </p>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-1">
            <p className="font-semibold text-base">SFR (Stimulus-to-Fatigue Ratio)</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The efficiency of your sets. Higher SFR means you're getting more muscle-building stimulus for less
              fatigue. Sets with moderate RIR (1-3) often have the best SFR.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Ready to start your first workout? Tap the button below to begin tracking your training with science on your
            side! 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
