import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distRoot = join(projectRoot, 'dist');
const serverRoot = join(distRoot, 'server');
const hostingRoot = join(distRoot, '.openai');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'server' || entry.name === '.openai') continue;
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolute));
    else files.push(absolute);
  }
  return files;
}

const files = {};
for (const absolute of await listFiles(distRoot)) {
  const path = `/${relative(distRoot, absolute).split(sep).join('/')}`;
  const bytes = await readFile(absolute);
  files[path] = {
    body: bytes.toString('base64'),
    contentType: contentTypes[extname(absolute).toLowerCase()] || 'application/octet-stream',
  };
}

const workerSource = `const FILES = ${JSON.stringify(files)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function resolvePath(pathname) {
  if (pathname === "/" || pathname === "") return "/index.html";
  if (pathname === "/dashboard" || pathname === "/dashboard/") return "/dashboard.html";
  return pathname;
}

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    const pathname = resolvePath(url.pathname);
    const file = FILES[pathname];
    if (!file) return new Response("Not found", { status: 404 });

    const headers = new Headers({
      "content-type": file.contentType,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "cache-control": pathname.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate",
    });

    return new Response(
      request.method === "HEAD" ? null : decodeBase64(file.body),
      { status: 200, headers },
    );
  },
};
`;

await mkdir(serverRoot, { recursive: true });
await mkdir(hostingRoot, { recursive: true });
await writeFile(join(serverRoot, 'index.js'), workerSource, 'utf8');
await copyFile(
  join(projectRoot, '.openai', 'hosting.json'),
  join(hostingRoot, 'hosting.json'),
);

console.log(`Prepared Sites worker with ${Object.keys(files).length} static assets.`);
