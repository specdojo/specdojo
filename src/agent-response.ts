// agent の最終応答から JSON 本体を取り出す。
//
// plan で「JSON だけを出力する」と契約しても、provider やモデルによって前後に
// 文字列が付く。実測では claude と gemma がコードフェンスで囲み、qwen が作業経過の
// 前置きを残した。生の応答をそのまま JSON.parse すると、判定内容が妥当でも解析に
// 失敗する。
//
// Ollama の format 指定など provider 固有の出力強制は、他 provider へ適用できず、
// thinking を有効化した agent とも競合しうるため採らない。呼び出し側は抽出後の
// 文字列を検証するため、抽出に失敗しても不正な内容を受け入れることはない。

/**
 * agent の生応答から JSON オブジェクトの本文を取り出す。
 * 取り出せない場合は入力をそのまま返し、解析の失敗は呼び出し側の検証に委ねる。
 */
export function extractJsonText(raw: string): string {
  const unfenced = stripCodeFence(raw.trim());
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) return unfenced;
  return unfenced.slice(start, end + 1);
}

/**
 * agent の生応答から JSON 配列の本文を取り出す。
 * 配列内の文字列にオブジェクト記号が含まれていても、配列全体を優先する。
 */
export function extractJsonArrayText(raw: string): string {
  const unfenced = stripCodeFence(raw.trim());
  for (let start = unfenced.indexOf("["); start >= 0; start = unfenced.indexOf("[", start + 1)) {
    for (
      let end = unfenced.lastIndexOf("]");
      end > start;
      end = unfenced.lastIndexOf("]", end - 1)
    ) {
      const candidate = unfenced.slice(start, end + 1);
      try {
        if (Array.isArray(JSON.parse(candidate))) return candidate;
      } catch {
        // 別の角括弧または不完全な配列を飛ばし、次の候補を試す。
      }
    }
  }
  return unfenced;
}

// 最初のコードフェンスの中身を返す。フェンスが無ければ入力をそのまま返す。
function stripCodeFence(text: string): string {
  const fenced = /```[a-z]*\r?\n([\s\S]*?)```/i.exec(text);
  return fenced ? fenced[1].trim() : text;
}
