/**
 * Word Detail Page
 *
 * Phase 6: Complete word information view with all V2.0 features
 * Integrates all previous phases: ratings, audio player, examples
 */

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WordDetailContent } from "./word-detail-content";

export default async function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return notFound();
  }

  // Await params as required by Next.js 15
  const { id } = await params;

  // Fetch word with all related data
  const { data: word, error } = await supabase
    .from("word_bank")
    .select(
      `
      *,
      topics:word_topics(topic_slug)
      `
    )
    .eq("id", id)
    .single();

  if (error || !word) {
    console.error("Error fetching word:", error);
    return notFound();
  }

  return <WordDetailContent word={word} userId={session.user.id} />;
}
