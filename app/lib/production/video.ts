export type ExternalVideo =
  | { kind: "youtube"; id: string }
  | { kind: "file" }
  | { kind: "link"; host: string };

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

// Decides how an externally hosted video can be shown: YouTube gets a
// click-to-load embed, direct files play in <video>, anything else links out.
export function classifyExternalVideo(raw: string): ExternalVideo {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { kind: "link", host: raw };
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");
  let ytId: string | null = null;
  if (host === "youtu.be") ytId = url.pathname.slice(1).split("/")[0];
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    ytId =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1] ??
      null;
  }
  if (ytId && YT_ID.test(ytId)) return { kind: "youtube", id: ytId };

  if (/\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return { kind: "file" };

  return { kind: "link", host };
}
