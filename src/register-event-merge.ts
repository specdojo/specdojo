// 統合 merge で登録簿の記帳ファイルが競合したときの解決処理。イベントファイルは追記型の記録なので、
// 両側のイベントの和集合（同一 id は 1 件）を時刻順に並べ、`previous_event_id` の連鎖を張り直す。
// 個票は exec branch 側を基準にし、統合先だけにあるイベントが変えたフィールドのうち、frontmatter の
// 単純な値へ写せるもの（type / priority / owner / due）だけをイベントから再構築する。

import {
  readRegisterEventsFromContent,
  serializeRegisterEvents,
  type RegisterEventChange,
  type RegisterEventV1,
} from "./register-events.js";
import {
  applyRegisterItemFields,
  CELL_NONE,
  CELL_TODO,
  REMOVE_REGISTER_ITEM_FIELD,
  type RegisterItemFieldUpdates,
} from "./register-item.js";

export type RegisterEventUnion =
  | {
      ok: true;
      content: string;
      events: RegisterEventV1[];
      // 統合先（ours）にだけあったイベントの id。個票の再構築で使う。
      oursOnlyIds: Set<string>;
    }
  | { ok: false; reason: string };

function hasStatusChange(event: RegisterEventV1): boolean {
  return event.changes.some((change) => change.field === "status");
}

// 両側とも古い順に並んでいる前提で、時刻順を保って 1 本にまとめる。同じ id は exec branch 側
// （theirs）の内容を採用して 1 件にする。同時刻の別イベントは、直前に出力したイベントを参照して
// いる側を優先し、判断できなければ統合先（ours）を先にする。
function interleaveEvents(
  ours: readonly RegisterEventV1[],
  theirs: readonly RegisterEventV1[],
): RegisterEventV1[] {
  const theirsById = new Map(theirs.map((event) => [event.id, event]));
  const emitted = new Set<string>();
  const merged: RegisterEventV1[] = [];
  let oursIndex = 0;
  let theirsIndex = 0;
  const emit = (event: RegisterEventV1): void => {
    emitted.add(event.id);
    merged.push(theirsById.get(event.id) ?? event);
  };
  while (oursIndex < ours.length || theirsIndex < theirs.length) {
    const left = ours[oursIndex];
    const right = theirs[theirsIndex];
    if (left && emitted.has(left.id)) {
      oursIndex += 1;
      continue;
    }
    if (right && emitted.has(right.id)) {
      theirsIndex += 1;
      continue;
    }
    if (!left || !right) {
      const next = left ?? right;
      if (!next) break;
      emit(next);
      if (left) oursIndex += 1;
      else theirsIndex += 1;
      continue;
    }
    if (left.id === right.id) {
      emit(right);
      oursIndex += 1;
      theirsIndex += 1;
      continue;
    }
    const lastId = merged.at(-1)?.id;
    const takeRight =
      right.ts < left.ts ||
      (right.ts === left.ts &&
        right.previous_event_id === lastId &&
        left.previous_event_id !== lastId);
    if (takeRight) {
      emit(right);
      theirsIndex += 1;
    } else {
      emit(left);
      oursIndex += 1;
    }
  }
  return merged;
}

// 和集合で並べたイベントの連鎖を張り直す。統合先だけにある状態を変えないイベント（`update` など）は、
// 並べ替え後の直前の状態を引き継ぐ。状態遷移の連続性が崩れる場合（統合先だけに状態遷移がある
// など）は、和集合では解決できないとして理由を返す。
function relinkEvents(
  events: readonly RegisterEventV1[],
  oursOnlyIds: ReadonlySet<string>,
  source: string,
): RegisterEventV1[] | string {
  const relinked: RegisterEventV1[] = [];
  let previous: RegisterEventV1 | undefined;
  for (const original of events) {
    const event: RegisterEventV1 = { ...original };
    delete event.previous_event_id;
    if (previous) {
      event.previous_event_id = previous.id;
      if (oursOnlyIds.has(event.id) && !hasStatusChange(event)) {
        event.from_status = previous.to_status;
        event.to_status = previous.to_status;
      }
      if (event.from_status !== previous.to_status) {
        return (
          `${source}: event ${event.id} starts at ${event.from_status ?? "null"} ` +
          `but follows ${previous.to_status} after the union`
        );
      }
    } else if (event.from_status !== null) {
      return `${source}: first event ${event.id} after the union is not an add event`;
    }
    relinked.push(event);
    previous = event;
  }
  return relinked;
}

// 統合先（ours）と exec branch（theirs）のイベントファイルを和集合で合わせる。
export function unionRegisterEventLogs(
  oursContent: string,
  theirsContent: string,
  source: string,
): RegisterEventUnion {
  let ours: RegisterEventV1[];
  let theirs: RegisterEventV1[];
  try {
    ours = readRegisterEventsFromContent(oursContent, `${source} (ours)`);
    theirs = readRegisterEventsFromContent(theirsContent, `${source} (theirs)`);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const theirsIds = new Set(theirs.map((event) => event.id));
  const oursOnlyIds = new Set(
    ours.filter((event) => !theirsIds.has(event.id)).map((event) => event.id),
  );
  const relinked = relinkEvents(interleaveEvents(ours, theirs), oursOnlyIds, source);
  if (typeof relinked === "string") return { ok: false, reason: relinked };
  return {
    ok: true,
    content: serializeRegisterEvents(relinked),
    events: relinked,
    oursOnlyIds,
  };
}

// イベントの変更値を個票 frontmatter の値へ写す。本文（title / description）、状態遷移に伴う
// フィールド（status / block_reason / conclusion / completed）、表示用に暦日へ変換された
// registered は、イベントから元の値を復元できないため対象外とする。
function fieldUpdateFromChange(change: RegisterEventChange): RegisterItemFieldUpdates | undefined {
  const value = change.to.trim();
  const isUnset = value === "" || value === CELL_NONE || value === CELL_TODO;
  switch (change.field) {
    case "type":
      return isUnset ? undefined : { item_type: value };
    case "priority":
      return isUnset ? undefined : { priority: value };
    case "owner":
      return { owner: isUnset ? null : value };
    case "due":
      return {
        due_on:
          value === CELL_TODO
            ? REMOVE_REGISTER_ITEM_FIELD
            : value === CELL_NONE || value === ""
              ? null
              : value,
      };
    default:
      return undefined;
  }
}

export type RegisterTicketRebuild = {
  content: string;
  // 統合先のイベントから反映したフィールド名。
  appliedFields: string[];
};

// exec branch 側の個票へ、統合先だけにあるイベントの変更を反映する。同じフィールドを後から
// exec branch 側のイベントが変えている場合は、後の変更（exec branch 側）を残す。
export function rebuildRegisterTicketFromEvents(
  theirsTicketContent: string,
  events: readonly RegisterEventV1[],
  oursOnlyIds: ReadonlySet<string>,
): RegisterTicketRebuild {
  const lastWriter = new Map<string, { oursOnly: boolean; change: RegisterEventChange }>();
  for (const event of events) {
    for (const change of event.changes) {
      lastWriter.set(change.field, { oursOnly: oursOnlyIds.has(event.id), change });
    }
  }
  let updates: RegisterItemFieldUpdates = {};
  const appliedFields: string[] = [];
  for (const [field, writer] of lastWriter) {
    if (!writer.oursOnly) continue;
    const update = fieldUpdateFromChange(writer.change);
    if (!update) continue;
    updates = { ...updates, ...update };
    appliedFields.push(field);
  }
  if (appliedFields.length === 0) return { content: theirsTicketContent, appliedFields };
  return {
    content: applyRegisterItemFields(theirsTicketContent, updates),
    appliedFields: appliedFields.sort(),
  };
}
