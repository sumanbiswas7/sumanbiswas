import { redis } from "@/lib/redis";

type Comment = { id: string; text: string; ts: number };

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const raw = await redis.lrange(`sumanv4:project:${id}:comments`, 0, 49);
  const comments: Comment[] = raw.flatMap((c: unknown) => {
    if (typeof c !== "string") return [c as Comment];
    if (!c) return [];
    try {
      return [JSON.parse(c)];
    } catch {
      return [];
    }
  });
  return Response.json({ comments });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { text } = await req.json() as { text: string };
  const trimmed = text?.trim();
  if (!trimmed) return Response.json({ error: "empty" }, { status: 400 });
  const comment: Comment = { id: Date.now().toString(), text: trimmed, ts: Date.now() };
  await redis.lpush(`sumanv4:project:${id}:comments`, JSON.stringify(comment));
  return Response.json({ comment });
}
