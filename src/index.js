export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== /api/load : KVからデータを読み込む =====
    if (url.pathname === "/api/load" && request.method === "GET") {
      const data = await env.DEV_PROMPT_VAULT_KV.get("prompt-vault-v1");
      return new Response(data ?? "null", {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ===== /api/save : KVへデータを保存する =====
    if (url.pathname === "/api/save" && request.method === "POST") {
      const body = await request.text();
      await env.DEV_PROMPT_VAULT_KV.put("prompt-vault-v1", body);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // ===== それ以外は静的アセット（public/）にフォールバック =====
    return env.ASSETS.fetch(request);
  }
};
