import { useMutation, useQuery } from "convex/react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGlobalStore } from "@/store/global.store";
import { api } from "convex/_generated/api";
import { useState, useEffect } from "react";

export function HomePage() {
  const [goal, setGoal] = useState<"hypertrophy" | "strength">("hypertrophy");
  const [exercise, setExercise] = useState("Bench Press");
  const [load, setLoad] = useState<number>(60);
  const [reps, setReps] = useState<number>(8);
  const [rir, setRir] = useState<number>(2);

  const deviceId = useGlobalStore((s) => s.deviceId);
  const userId = useGlobalStore((s) => s.userId);
  const roomId = useGlobalStore((s) => s.roomId);
  const setUserId = useGlobalStore((s) => s.setUserId);
  const setRoomId = useGlobalStore((s) => s.setRoomId);

  const ensureUser = useMutation(api.users.ensureUser); // was React Query → now Convex
  const createRoom = useMutation(api.rooms.createRoom); // was React Query → now Convex
  const logSet = useMutation(api.sets.logSet); // was React Query → now Convex
  const sets = useQuery(api.sets.getSets, roomId ? { roomId: roomId as any } : "skip"); // live

  useEffect(() => {
    if (!deviceId || userId) return;
    ensureUser({ deviceId }).then((id: any) => setUserId(id));
  }, [deviceId, userId, ensureUser, setUserId]);

  const [creating, setCreating] = useState(false);
  const onCreateRoom = async () => {
    if (!userId || roomId) return;
    setCreating(true);
    try {
      const id = await createRoom({ ownerId: userId as any, goal });
      setRoomId(id as any);
    } finally {
      setCreating(false);
    }
  };

  const [logging, setLogging] = useState(false);
  const onLogSet = async () => {
    if (!roomId || !userId) return;
    setLogging(true);
    try {
      await logSet({
        roomId: roomId as any,
        userId: userId as any,
        exercise,
        load: Number(load),
        reps: Number(reps),
        rir: Number(rir),
      });
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User & Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {userId ? (
              <span className="break-all">
                <span className="font-medium text-foreground">User ID:</span> <code>{userId}</code>
              </span>
            ) : (
              "Creating anonymous user…"
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[180px]">
              <Label className="mb-1 block">Goal</Label>
              <Select defaultValue={goal} onValueChange={(v) => setGoal(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hypertrophy">Hypertrophy</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={onCreateRoom} disabled={!userId || !!roomId || creating} className="mt-6">
              {roomId ? "Room Created ✅" : creating ? "Creating…" : "Create Room"}
            </Button>
          </div>

          {roomId && (
            <div className="text-xs text-muted-foreground break-all">
              <span className="font-medium text-foreground">Room ID:</span> <code>{roomId}</code>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Log Set</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="mb-1 block">Exercise</Label>
            <Input value={exercise} onChange={(e) => setExercise(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="mb-1 block">Load (kg)</Label>
              <Input type="number" value={String(load)} onChange={(e) => setLoad(Number(e.target.value))} />
            </div>
            <div>
              <Label className="mb-1 block">Reps</Label>
              <Input type="number" value={String(reps)} onChange={(e) => setReps(Number(e.target.value))} />
            </div>
            <div>
              <Label className="mb-1 block">RIR</Label>
              <Input type="number" value={String(rir)} onChange={(e) => setRir(Number(e.target.value))} />
            </div>
          </div>

          <Button onClick={onLogSet} disabled={!roomId || !userId || logging}>
            {logging ? "Logging…" : "Log Set"}
          </Button>

          {!roomId && <p className="text-xs text-destructive">Create a room first.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sets in Room</CardTitle>
        </CardHeader>
        <CardContent>
          {!roomId ? (
            <p className="text-sm text-muted-foreground">No room yet.</p>
          ) : sets === undefined ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !sets || sets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sets logged.</p>
          ) : (
            <ul className="space-y-2">
              {sets.map((s: any) => (
                <li key={s._id} className="rounded-lg border bg-card px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.exercise}</span>
                    <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-foreground/90">
                    {s.load}kg × {s.reps} @RIR {s.rir}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
}
