import { redis } from "@/lib/redis";

const PROJECT_IDS = [1, 2, 3, 4, 5, 7];

type Comment = { id: string; text: string; ts: number };

export async function GET() {
  const pipeline = redis.pipeline();
  for (const id of PROJECT_IDS) {
    pipeline.get(`sumanv4:project:${id}:likes`);
    pipeline.lrange(`sumanv4:project:${id}:comments`, 0, 49);
  }
  const results = await pipeline.exec();

  const data: Record<number, { likes: number; comments: Comment[] }> = {};
  PROJECT_IDS.forEach((id, i) => {
    const likes = (results[i * 2] as number | null) ?? 0;
    const rawComments = (results[i * 2 + 1] as unknown[]) ?? [];
    const comments: Comment[] = rawComments.flatMap((c) => {
      if (typeof c !== "string") return [c as Comment];
      if (!c) return [];
      try {
        return [JSON.parse(c)];
      } catch {
        return [];
      }
    });
    data[id] = { likes, comments };
  });

  return Response.json(data);
}
