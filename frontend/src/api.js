export async function fetchMCQs(videoUrl) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: videoUrl }),
  });
  return await res.json();
}
