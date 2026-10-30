import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/app/lib/supabase/service";
import { purgeExpiredVideos } from "@/app/lib/production/purge";

// Daily clean-up of videos past their retention period (see vercel.json).
// Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; anything else is
// refused, and the job refuses to run at all without a secret configured.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return Response.json({ error: "SUPABASE_SECRET_KEY is not configured." }, { status: 503 });
  }

  const result = await purgeExpiredVideos(supabase);
  if (result.videosRemoved > 0) {
    revalidatePath("/");
    revalidatePath("/production/[code]", "page");
  }
  if (result.errors.length) console.error("[purge] completed with errors", result.errors);

  return Response.json(result, { status: result.errors.length ? 500 : 200 });
}
