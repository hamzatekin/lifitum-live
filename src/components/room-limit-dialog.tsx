import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCustomer } from "autumn-js/react";

interface RoomLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  remainingRooms: number | null;
}

export function RoomLimitDialog({ open, onOpenChange, remainingRooms }: RoomLimitDialogProps) {
  const { openPaywall } = useCustomer();

  const handleUpgrade = () => {
    openPaywall();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Room Creation Limit Reached</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've reached your limit of 100 workout sessions on the free plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Plan</span>
              <span className="text-sm font-bold">Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sessions Used</span>
              <span className="text-sm">100 / 100</span>
            </div>
          </div>

          <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Pro Plan</h3>
              <span className="text-2xl font-bold text-primary">$9.99/mo</span>
            </div>

            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <span className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm">Unlimited workout sessions</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm">Volume tracking per muscle group</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm">Advanced analytics & insights</span>
              </li>
              <li className="flex items-start">
                <span className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-sm">Priority support</span>
              </li>
            </ul>

            <Button
              onClick={handleUpgrade}
              className="w-full"
              size="lg"
            >
              Upgrade to Pro
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

