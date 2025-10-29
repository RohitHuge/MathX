export async function runCCode(source, stdin = "") {
  const url = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      language_id: 50,
      source_code: source,
      stdin,
      compiler_options: "-lm"
    }),
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error("Failed to parse Judge0 response");
  }

  if (!res.ok) {
    throw new Error(json?.message || "Judge0 request failed");
  }

  return json;
}
