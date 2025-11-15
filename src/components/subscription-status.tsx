import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpgradeButton } from "@/components/upgrade-button";

interface SubscriptionStatusProps {
  subscriptionStatus: {
    tier: string;
    usage: {
      sessionsCompleted: number;
      setsLogged: number;
    };
  };
  onUpgrade: (tier: string) => Promise<void>;
}

export function SubscriptionStatus({
  subscriptionStatus,
  onUpgrade,
}: SubscriptionStatusProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          View Subscription Status
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md rounded-lg sm:w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Subscription Status</DialogTitle>
          <DialogDescription>
            View your current plan and upgrade if needed
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 py-4 px-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-medium">Current Plan:</span>
            <span className="text-primary font-bold uppercase text-lg">
              {subscriptionStatus.tier}
            </span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Sessions Completed: {subscriptionStatus.usage.sessionsCompleted}</p>
            <p>Sets Logged: {subscriptionStatus.usage.setsLogged}</p>
          </div>
          <div className="pt-2">
            <UpgradeButton currentTier={subscriptionStatus.tier} onUpgrade={onUpgrade} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

