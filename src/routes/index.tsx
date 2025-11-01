import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [goal, setGoal] = useState("hypertrophy");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [exercise, setExercise] = useState("Bench Press");
  const [load, setLoad] = useState<number>(60);
  const [reps, setReps] = useState<number>(8);
  const [rir, setRir] = useState<number>(2);

  const createRoom = useMutation(api.sets.createRoom);
  const logSet = useMutation(api.sets.logSet);

  // Convex: if args are undefined, the query is skipped (no request)
  const sets = useQuery(api.sets.getSets, roomId ? { roomId: roomId as any } : "skip");

  const onCreateRoom = async () => {
    const id = await createRoom({ goal });
    setRoomId(id as unknown as string);
  };

  const onLogSet = async () => {
    if (!roomId) return alert("Create a room first!");
    await logSet({
      roomId: roomId as any,
      exercise,
      load: Number(load),
      reps: Number(reps),
      rir: Number(rir),
    });
  };

  return (
    <div className="mx-auto max-w-xl p-4 space-y-6">
      {/* Create Room */}
      <section className="rounded-2xl border border-gray-200 bg-white/60 p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Create Room</h2>
        <div className="mt-3 flex items-center gap-3">
          <select
            className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            value={goal}
            onChange={(e) => setGoal(e.target.value as any)}
          >
            <option value="hypertrophy">Hypertrophy</option>
            <option value="strength">Strength</option>
          </select>

          <Button onClick={onCreateRoom} disabled={!!roomId} variant="outline">
            {roomId ? "Room Created ✅" : "Create Room"}
          </Button>
        </div>

        {roomId && (
          <p className="mt-2 text-xs text-gray-500 break-all">
            Room ID: <span className="font-mono">{roomId}</span>
          </p>
        )}
      </section>

      {/* Log Set */}
      <section className="rounded-2xl border border-gray-200 bg-white/60 p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Log Set</h2>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-gray-600">Exercise</span>
            <Input value={exercise} onChange={(e) => setExercise(e.target.value)} />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">Load (kg)</span>
              <Input type="number" value={String(load)} onChange={(e) => setLoad(Number(e.target.value))} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">Reps</span>
              <Input type="number" value={String(reps)} onChange={(e) => setReps(Number(e.target.value))} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-gray-600">RIR</span>
              <Input type="number" value={String(rir)} onChange={(e) => setRir(Number(e.target.value))} />
            </label>
          </div>

          <Button onClick={onLogSet} disabled={!roomId} variant="outline">
            Log Set
          </Button>
          {!roomId && <p className="text-xs text-red-500">Create a room first.</p>}
        </div>
      </section>

      {/* List Sets */}
      <section className="rounded-2xl border border-gray-200 bg-white/60 p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Sets in Room</h2>
        <div className="mt-3">
          {!roomId ? (
            <p className="text-sm text-gray-500">No room yet.</p>
          ) : sets === undefined ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : sets.length === 0 ? (
            <p className="text-sm text-gray-500">No sets logged.</p>
          ) : (
            <ul className="space-y-2">
              {sets.map((s: any) => (
                <li key={s._id} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.exercise}</span>
                    <span className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-700">
                    {s.load}kg × {s.reps} @RIR {s.rir}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
