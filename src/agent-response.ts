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

// 最初のコードフェンスの中身を返す。フェンスが無ければ入力をそのまま返す。
function stripCodeFence(text: string): string {
  const fenced = /```[a-z]*\r?\n([\s\S]*?)```/i.exec(text);
  return fenced ? fenced[1].trim() : text;
}
