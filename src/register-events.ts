// Register の現在値は個票 frontmatter、変更履歴は events/pjr-XXXX.yaml が正本である。
// イベントは項目ごとの YAML 配列へ古い順に追記し、個票本文の変更と監査履歴の差分を分離する。

import { createHash, randomUUID } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import {
  CELL_NONE,
  displayIdFromTicketFilename,
  readRegisterItemContent,
  readSpecdojoFields,
  toDisplayItem,
  updateSpecdojoFields,
  VALID_STATUSES,
} from "./register-item.js";
import { isUtcIsoSeconds, nowUtcIsoSeconds } from "./exec-shared.js";

export const REGISTER_EVENTS_DIRNAME = "events";
export const REGISTER_EVENTS_SCHEMA_MODELINE =
  "# yaml-language-server: $schema=../../../../../../specdojo/schemas/v1/register-events.schema.yaml";

export const REGISTER_EVENT_FIELDS = [
  "status",
  "title",
  "description",
  "type",
  "priority",
  "owner",
  "registered",
  "due",
  "completed",
  "conclusion",
  "block_reason",
] as const;

export type RegisterEventField = (typeof REGISTER_EVENT_FIELDS)[number];

export type RegisterEventChange = {
  field: RegisterEventField | "id";
  from: string;
  to: string;
};

export const REGISTER_EVENT_ACTIONS = [
  "add",
  "start",
  "wait",
  "review",
  "close",
  "reject",
  "defer",
  "reopen",
  "update",
  "renumber",
  "migrate",
] as const;

export type RegisterEventAction = (typeof REGISTER_EVENT_ACTIONS)[number];

export type RegisterEventV1 = {
  v: 1;
  id: string;
  ts: string;
  action: RegisterEventAction;
  actor: string;
  from_status: string | null;
  to_status: string;
  reason: string;
  changes: RegisterEventChange[];
  previous_event_id?: string;
  legacy_commit?: string;
};

export const REGISTER_EVENT_ID_RE = /^reg_[a-f0-9]{32}$/;
const REGISTER_EVENT_FILENAME_RE = /^pjr-([0-9abcdefghjkmnpqrstvwxyz]{4})\.yaml$/;

type RegisterFieldValues = Record<RegisterEventField, string>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function registerEventFilename(displayId: string): string {
  return `${displayId.toLowerCase()}.yaml`;
}

export function displayIdFromRegisterEventFilename(filename: string): string | undefined {
  const match = REGISTER_EVENT_FILENAME_RE.exec(filename);
  return match ? `PJR-${match[1].toUpperCase()}` : undefined;
}

export function registerEventFilePath(projectRegisterPath: string, displayId: string): string {
  return join(projectRegisterPath, REGISTER_EVENTS_DIRNAME, registerEventFilename(displayId));
}

export function registerEventFieldValues(
  content: string | undefined,
  filename: string,
  timeZone: string,
): RegisterFieldValues | undefined {
  if (content === undefined) return undefined;
  const parsed = readRegisterItemContent(content, filename);
  if (!parsed) return undefined;
  const item = toDisplayItem(parsed.item, timeZone);
  return {
    status: item.status,
    title: item.title,
    description: item.description,
    type: item.type,
    priority: item.priority,
    owner: item.owner,
    registered: item.registered,
    due: item.due,
    completed: item.completed,
    conclusion: item.conclusion,
    block_reason: parsed.blockReason,
  };
}

function isUnsetFieldValue(value: string): boolean {
  return value === "" || value === CELL_NONE;
}

export function diffRegisterEventFields(
  before: RegisterFieldValues | undefined,
  after: RegisterFieldValues | undefined,
): RegisterEventChange[] {
  const changes: RegisterEventChange[] = [];
  for (const field of REGISTER_EVENT_FIELDS) {
    const from = before?.[field] ?? "";
    const to = after?.[field] ?? "";
    if (isUnsetFieldValue(from) && isUnsetFieldValue(to)) continue;
    if (from !== to) changes.push({ field, from, to });
  }
  return changes;
}

function randomEventId(): string {
  return `reg_${randomUUID().replaceAll("-", "")}`;
}

export function deterministicRegisterEventId(seed: string): string {
  return `reg_${createHash("sha256").update(seed).digest("hex").slice(0, 32)}`;
}

export function buildRegisterEvent(opts: {
  beforeContent?: string;
  afterContent: string;
  filename: string;
  timeZone: string;
  action: RegisterEventAction;
  actor: string;
  reason: string;
  ts?: string;
  id?: string;
  legacyCommit?: string;
  extraChanges?: RegisterEventChange[];
}): RegisterEventV1 | undefined {
  const before = registerEventFieldValues(opts.beforeContent, opts.filename, opts.timeZone);
  const after = registerEventFieldValues(opts.afterContent, opts.filename, opts.timeZone);
  if (!after) throw new Error(`cannot build register event for invalid item: ${opts.filename}`);
  const changes = [...(opts.extraChanges ?? []), ...diffRegisterEventFields(before, after)];
  if (changes.length === 0) return undefined;

  const actor = opts.actor.trim();
  const reason = opts.reason.trim();
  if (actor === "") throw new Error("register event actor must not be empty");
  if (reason === "") throw new Error("register event reason must not be empty");

  const event: RegisterEventV1 = {
    v: 1,
    id: opts.id ?? randomEventId(),
    ts: opts.ts ?? nowUtcIsoSeconds(),
    action: opts.action,
    actor,
    from_status: before?.status ?? null,
    to_status: after.status,
    reason,
    changes,
  };
  if (opts.legacyCommit) event.legacy_commit = opts.legacyCommit;
  return event;
}

export function validateRegisterEventShape(value: unknown, source: string): string[] {
  const errors: string[] = [];
  const error = (message: string): void => {
    errors.push(`${source}: ${message}`);
  };
  if (!isRecord(value)) {
    error("event must be an object");
    return errors;
  }
  if (value.v !== 1) error("v must be 1");
  if (typeof value.id !== "string" || !REGISTER_EVENT_ID_RE.test(value.id)) {
    error("id must match reg_<32 lowercase hex characters>");
  }
  if (typeof value.ts !== "string" || !isUtcIsoSeconds(value.ts)) {
    error("ts must be UTC ISO seconds like 2026-03-05T03:10:00Z");
  }
  if (
    typeof value.action !== "string" ||
    !(REGISTER_EVENT_ACTIONS as readonly string[]).includes(value.action)
  ) {
    error(`action must be one of ${REGISTER_EVENT_ACTIONS.join(", ")}`);
  }
  if (typeof value.actor !== "string" || value.actor.trim() === "") {
    error("actor must be a non-empty string");
  }
  if (
    value.from_status !== null &&
    (typeof value.from_status !== "string" ||
      !(VALID_STATUSES as readonly string[]).includes(value.from_status))
  ) {
    error(`from_status must be null or one of ${VALID_STATUSES.join(", ")}`);
  }
  if (
    typeof value.to_status !== "string" ||
    !(VALID_STATUSES as readonly string[]).includes(value.to_status)
  ) {
    error(`to_status must be one of ${VALID_STATUSES.join(", ")}`);
  }
  if (typeof value.reason !== "string" || value.reason.trim() === "") {
    error("reason must be a non-empty string");
  }
  if (!Array.isArray(value.changes) || value.changes.length === 0) {
    error("changes must be a non-empty array");
  } else {
    value.changes.forEach((change, index) => {
      if (!isRecord(change)) {
        error(`changes[${index}] must be an object`);
        return;
      }
      if (
        typeof change.field !== "string" ||
        ![...REGISTER_EVENT_FIELDS, "id"].includes(change.field as RegisterEventField)
      ) {
        error(`changes[${index}].field is invalid`);
      }
      if (typeof change.from !== "string") error(`changes[${index}].from must be a string`);
      if (typeof change.to !== "string") error(`changes[${index}].to must be a string`);
    });
  }
  if (
    value.previous_event_id !== undefined &&
    (typeof value.previous_event_id !== "string" ||
      !REGISTER_EVENT_ID_RE.test(value.previous_event_id))
  ) {
    error("previous_event_id must be a register event id");
  }
  if (value.legacy_commit !== undefined && typeof value.legacy_commit !== "string") {
    error("legacy_commit must be a string");
  }
  return errors;
}

export function readRegisterEventsFromContent(content: string, source: string): RegisterEventV1[] {
  let parsed: unknown;
  try {
    parsed = yaml.load(content);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${source}: invalid register event YAML: ${detail}`);
  }
  if (!Array.isArray(parsed)) throw new Error(`${source}: register event file must be an array`);
  const events: RegisterEventV1[] = [];
  parsed.forEach((event, index) => {
    const errors = validateRegisterEventShape(event, `${source}[${index}]`);
    if (errors.length > 0) throw new Error(errors.join("; "));
    events.push(event as RegisterEventV1);
  });
  return events;
}

export function serializeRegisterEvents(events: readonly RegisterEventV1[]): string {
  return `${REGISTER_EVENTS_SCHEMA_MODELINE}\n${yaml.dump([...events], {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
  })}`;
}

export function appendRegisterEvent(content: string | undefined, event: RegisterEventV1): string {
  const events = content ? readRegisterEventsFromContent(content, "register event file") : [];
  if (events.some((existing) => existing.id === event.id))
    return content ?? serializeRegisterEvents(events);
  const previous = events.at(-1);
  const next: RegisterEventV1 = previous
    ? { ...event, previous_event_id: previous.id }
    : { ...event };
  return serializeRegisterEvents([...events, next]);
}

export function readEmbeddedRegisterEvents(content: string, source: string): RegisterEventV1[] {
  const fields = readSpecdojoFields(content);
  if (fields.register_events === undefined) return [];
  if (!Array.isArray(fields.register_events)) {
    throw new Error(`${source}: register_events must be an array`);
  }
  const events: RegisterEventV1[] = [];
  fields.register_events.forEach((event, index) => {
    const errors = validateRegisterEventShape(event, `${source}: register_events[${index}]`);
    if (errors.length > 0) throw new Error(errors.join("; "));
    events.push(event as RegisterEventV1);
  });
  return events;
}

export function removeEmbeddedRegisterEvents(content: string): string {
  return updateSpecdojoFields(content, (fields) => {
    delete fields.register_events;
  });
}

export function validateRegisterEventLog(
  ticketContent: string,
  eventContent: string,
  ticketFilename: string,
  eventFilename: string,
  timeZone: string,
): string[] {
  let events: RegisterEventV1[];
  try {
    events = readRegisterEventsFromContent(eventContent, eventFilename);
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
  if (events.length === 0) return [`${eventFilename}: event log must not be empty`];

  const errors: string[] = [];
  const ids = new Set<string>();
  let previous: RegisterEventV1 | undefined;
  for (const event of events) {
    if (ids.has(event.id)) errors.push(`${eventFilename}: duplicate register event id ${event.id}`);
    ids.add(event.id);
    if (previous) {
      if (event.previous_event_id !== previous.id) {
        errors.push(
          `${eventFilename}: event ${event.id} does not reference previous event ${previous.id}`,
        );
      }
      if (event.ts < previous.ts) {
        errors.push(`${eventFilename}: event ${event.id} timestamp precedes the previous event`);
      }
      if (event.from_status !== previous.to_status) {
        errors.push(
          `${eventFilename}: event ${event.id} starts at ${event.from_status ?? "null"}, expected ${previous.to_status}`,
        );
      }
    } else if (event.previous_event_id !== undefined) {
      errors.push(`${eventFilename}: first event must not have previous_event_id`);
    }
    const statusChange = event.changes.find((change) => change.field === "status");
    if (statusChange) {
      const expectedFrom = event.from_status ?? "";
      if (statusChange.from !== expectedFrom || statusChange.to !== event.to_status) {
        errors.push(
          `${eventFilename}: event ${event.id} status change disagrees with transition fields`,
        );
      }
    } else if (event.from_status !== event.to_status) {
      errors.push(
        `${eventFilename}: event ${event.id} changes status without a status change entry`,
      );
    }
    previous = event;
  }

  const current = registerEventFieldValues(ticketContent, ticketFilename, timeZone);
  if (!current) return [...errors, `${ticketFilename}: cannot read current register item state`];
  if (previous?.to_status !== current.status) {
    errors.push(
      `${eventFilename}: latest event status ${previous?.to_status ?? CELL_NONE} does not match ${ticketFilename} item_status ${current.status}`,
    );
  }
  return errors;
}

export function validateRegisterEventDocs(projectRegisterPath: string, timeZone: string): string[] {
  if (!existsSync(projectRegisterPath)) return [];
  const errors: string[] = [];
  const eventIds = new Map<string, string>();
  const tickets = new Map<string, { filename: string; content: string }>();
  for (const entry of readdirSync(projectRegisterPath, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const id = displayIdFromTicketFilename(entry.name);
    if (!id) continue;
    const content = readFileSync(join(projectRegisterPath, entry.name), "utf8");
    if (readSpecdojoFields(content).register_events !== undefined) {
      errors.push(
        `${entry.name}: register_events must be stored in events/${registerEventFilename(id)}`,
      );
    }
    tickets.set(id, { filename: entry.name, content });
  }

  const eventsPath = join(projectRegisterPath, REGISTER_EVENTS_DIRNAME);
  if (!existsSync(eventsPath)) {
    return tickets.size > 0
      ? [...errors, `${REGISTER_EVENTS_DIRNAME}/: register event directory not found`]
      : errors;
  }
  const seenItems = new Set<string>();
  const entries = readdirSync(eventsPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const id = displayIdFromRegisterEventFilename(entry.name);
    if (!id) {
      if (entry.name.endsWith(".yaml"))
        errors.push(`${entry.name}: invalid register event filename`);
      continue;
    }
    seenItems.add(id);
    const ticket = tickets.get(id);
    if (!ticket) {
      errors.push(`${entry.name}: no matching register item for ${id}`);
      continue;
    }
    const content = readFileSync(join(eventsPath, entry.name), "utf8");
    errors.push(
      ...validateRegisterEventLog(
        ticket.content,
        content,
        ticket.filename,
        `${REGISTER_EVENTS_DIRNAME}/${entry.name}`,
        timeZone,
      ),
    );
    let events: RegisterEventV1[];
    try {
      events = readRegisterEventsFromContent(content, entry.name);
    } catch {
      continue;
    }
    for (const event of events) {
      const previous = eventIds.get(event.id);
      if (previous) {
        errors.push(`${event.id}: duplicate register event ID in ${previous} and ${entry.name}`);
      } else {
        eventIds.set(event.id, entry.name);
      }
    }
  }
  for (const [id, ticket] of tickets) {
    if (!seenItems.has(id)) {
      errors.push(
        `${ticket.filename}: missing register event file events/${registerEventFilename(id)}`,
      );
    }
  }
  return errors;
}
