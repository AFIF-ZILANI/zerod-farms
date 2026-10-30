import { getPublicClient } from "@/app/lib/supabase/public";
import { MEDIA_BUCKET } from "@/app/lib/supabase/env";

// Signed URLs live for an hour; the redirect itself is cached for much less,
// so unpublishing a batch cuts off its media within minutes.
const SIGNED_URL_TTL_SECONDS = 60 * 60;
const REDIRECT_CACHE_SECONDS = 5 * 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET(request: Request, ctx: RouteContext<"/media/[id]">) {
  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return notFound();

  const supabase = getPublicClient();
  if (!supabase) return notFound();

  const wantPoster = new URL(request.url).searchParams.has("poster");

  // Runs as an anonymous visitor: the RPC only resolves media of published
  // batches, and storage RLS only lets anon sign those same objects.
  const { data: path, error } = await supabase.rpc("public_media_object_path", {
    media_id: id,
    want_poster: wantPoster,
  });
  if (error || typeof path !== "string" || !path) return notFound();

  const { data: signed, error: signError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (signError || !signed?.signedUrl) return notFound();

  return new Response(null, {
    status: 302,
    headers: {
      Location: signed.signedUrl,
      "Cache-Control": `public, max-age=${REDIRECT_CACHE_SECONDS}, s-maxage=${REDIRECT_CACHE_SECONDS}`,
    },
  });
}
