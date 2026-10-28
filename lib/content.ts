import { promises as fs } from "node:fs";
import path from "node:path";
import type { BlogPost, Content, Service, TeamMember } from "@/lib/types";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

let queue: Promise<unknown> = Promise.resolve();

async function readContent(): Promise<Content> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(raw) as Content;
}

export async function getContent(): Promise<Content> {
  return readContent();
}

export async function updateContent(
  mutate: (content: Content) => Content | Promise<Content>,
): Promise<Content> {
  const run = queue.then(async () => {
    const content = await readContent();
    const next = await mutate(content);
    const temporary = `${CONTENT_PATH}.${process.pid}.tmp`;
    await fs.writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, "utf8");
    await fs.rename(temporary, CONTENT_PATH);
    return next;
  });

  queue = run.catch(() => undefined);
  return run;
}

export function sortTeam(team: TeamMember[]) {
  return [...team].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function sortServices(services: Service[]) {
  return [...services].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const left = new Date(a.publishedAt).getTime();
    const right = new Date(b.publishedAt).getTime();
    return right - left || a.title.localeCompare(b.title);
  });
}

export function getPublishedPosts(posts: BlogPost[]) {
  return sortPosts(posts.filter((post) => post.published));
}
