import { redis } from "@/lib/redis";

export async function GET() {
  const count = (await redis.get<number>("sumanv4:views")) ?? 0;
  return Response.json({ count });
}

export async function POST() {
  const count = await redis.incr("sumanv4:views");
  return Response.json({ count });
}
