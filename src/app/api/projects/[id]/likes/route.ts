import { redis } from "@/lib/redis";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const count = (await redis.get<number>(`sumanv4:project:${id}:likes`)) ?? 0;
  return Response.json({ count });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { action } = await req.json() as { action: "like" | "unlike" };
  const key = `sumanv4:project:${id}:likes`;
  const count = action === "like" ? await redis.incr(key) : await redis.decr(key);
  const safe = Math.max(0, count);
  if (count < 0) await redis.set(key, 0);
  return Response.json({ count: safe });
}
