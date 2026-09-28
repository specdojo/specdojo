import { describe, expect, it } from "vitest";
import {
  rebuildRegisterTicketFromEvents,
  unionRegisterEventLogs,
} from "../../src/register-event-merge.js";
import {
  readRegisterEventsFromContent,
  serializeRegisterEvents,
  validateRegisterEventLog,
  type RegisterEventChange,
  type RegisterEventV1,
} from "../../src/register-events.js";
import { readSpecdojoFields } from "../../src/register-item.js";

const TICKET_FILENAME = "pjr-0abc-sample.md";
const EVENT_FILENAME = "pjr-0abc.yaml";

function eventId(index: number): string {
  return `reg_${index.toString(16).padStart(32, "0")}`;
}

function event(
  index: number,
  ts: string,
  action: RegisterEventV1["action"],
  fromStatus: string | null,
  toStatus: string,
  changes: RegisterEventChange[] = [],
): RegisterEventV1 {
  const statusChanges: RegisterEventChange[] =
    fromStatus === toStatus ? [] : [{ field: "status", from: fromStatus ?? "", to: toStatus }];
  return {
    v: 1,
    id: eventId(index),
    ts,
    action,
    actor: "tester",
    from_status: fromStatus,
    to_status: toStatus,
    reason: action,
    changes: [...statusChanges, ...changes],
  };
}

function chain(events: RegisterEventV1[]): RegisterEventV1[] {
  return events.map((item, index) =>
    index === 0 ? item : { ...item, previous_event_id: events[index - 1]?.id },
  );
}

function ticket(status: string, due: string): string {
  return [
    "---",
    "specdojo:",
    "  id: prj-0001:pjr-0abc-sample",
    "  type: project",
    "  status: draft",
    `  item_type: todo`,
    `  item_status: ${status}`,
    "  priority: medium",
    "  owner: DEV",
    '  registered_at: "2026-09-28T01:00:00Z"',
    `  due_on: "${due}"`,
    "---",
    "",
    "# PJR-0ABC Sample",
    "",
  ].join("\n");
}

const add = event(1, "2026-09-28T01:00:00Z", "add", null, "open");
const start = event(2, "2026-09-28T02:00:00Z", "start", "open", "in-progress");
const wait = event(3, "2026-09-28T03:00:00Z", "wait", "in-progress", "waiting");
const base = [add, start, wait];

describe("unionRegisterEventLogs", () => {
  it("keeps a merge-target update made while waiting together with the resumed branch events", () => {
    const update = event(4, "2026-09-28T04:00:00Z", "update", "waiting", "waiting", [
      { field: "due", from: "2026-10-01", to: "2026-10-15" },
    ]);
    const resume = event(5, "2026-09-28T05:00:00Z", "start", "waiting", "in-progress");
    const review = event(6, "2026-09-28T06:00:00Z", "review", "in-progress", "review");
    const ours = serializeRegisterEvents(chain([...base, update]));
    const theirs = serializeRegisterEvents(chain([...base, resume, review]));

    const union = unionRegisterEventLogs(ours, theirs, EVENT_FILENAME);

    expect(union.ok).toBe(true);
    if (!union.ok) return;
    const merged = readRegisterEventsFromContent(union.content, EVENT_FILENAME);
    expect(merged.map((item) => item.id)).toEqual([1, 2, 3, 4, 5, 6].map(eventId));
    expect([...union.oursOnlyIds]).toEqual([eventId(4)]);
    expect(
      validateRegisterEventLog(
        ticket("review", "2026-10-15"),
        union.content,
        TICKET_FILENAME,
        EVENT_FILENAME,
        "UTC",
      ),
    ).toEqual([]);
  });

  it("carries the current status into a merge-target update ordered after a resumed transition", () => {
    const resume = event(5, "2026-09-28T04:00:00Z", "start", "waiting", "in-progress");
    const update = event(4, "2026-09-28T04:30:00Z", "update", "waiting", "waiting", [
      { field: "owner", from: "DEV", to: "PM" },
    ]);
    const review = event(6, "2026-09-28T05:00:00Z", "review", "in-progress", "review");
    const ours = serializeRegisterEvents(chain([...base, update]));
    const theirs = serializeRegisterEvents(chain([...base, resume, review]));

    const union = unionRegisterEventLogs(ours, theirs, EVENT_FILENAME);

    expect(union.ok).toBe(true);
    if (!union.ok) return;
    expect(union.events.map((item) => item.id)).toEqual([1, 2, 3, 5, 4, 6].map(eventId));
    expect(union.events[4]).toMatchObject({
      id: eventId(4),
      from_status: "in-progress",
      to_status: "in-progress",
      previous_event_id: eventId(5),
    });
    expect(union.events[5]?.previous_event_id).toBe(eventId(4));
  });

  it("reports a status transition that exists only on the merge target", () => {
    const reject = event(4, "2026-09-28T04:00:00Z", "reject", "waiting", "rejected");
    const resume = event(5, "2026-09-28T05:00:00Z", "start", "waiting", "in-progress");
    const ours = serializeRegisterEvents(chain([...base, reject]));
    const theirs = serializeRegisterEvents(chain([...base, resume]));

    const union = unionRegisterEventLogs(ours, theirs, EVENT_FILENAME);

    expect(union).toEqual({
      ok: false,
      reason: expect.stringMatching(/pjr-0abc\.yaml: event reg_0+5 starts at waiting/),
    });
  });
});

describe("rebuildRegisterTicketFromEvents", () => {
  it("applies fields changed only by merge-target events onto the exec branch ticket", () => {
    const update = event(4, "2026-09-28T04:00:00Z", "update", "waiting", "waiting", [
      { field: "due", from: "2026-10-01", to: "2026-10-15" },
      { field: "priority", from: "medium", to: "high" },
      { field: "title", from: "Sample", to: "Renamed" },
    ]);
    const resume = event(5, "2026-09-28T05:00:00Z", "start", "waiting", "in-progress");

    const rebuilt = rebuildRegisterTicketFromEvents(
      ticket("in-progress", "2026-10-01"),
      [...base, update, resume],
      new Set([eventId(4)]),
    );

    expect(rebuilt.appliedFields).toEqual(["due", "priority"]);
    expect(readSpecdojoFields(rebuilt.content)).toMatchObject({
      item_status: "in-progress",
      priority: "high",
      due_on: "2026-10-15",
    });
    expect(rebuilt.content).toContain("# PJR-0ABC Sample");
  });

  it("keeps a later exec branch change of the same field", () => {
    const update = event(4, "2026-09-28T04:00:00Z", "update", "waiting", "waiting", [
      { field: "owner", from: "DEV", to: "PM" },
    ]);
    const branchUpdate = event(5, "2026-09-28T05:00:00Z", "update", "waiting", "waiting", [
      { field: "owner", from: "DEV", to: "QA" },
    ]);
    const content = ticket("waiting", "2026-10-01");

    const rebuilt = rebuildRegisterTicketFromEvents(
      content,
      [...base, update, branchUpdate],
      new Set([eventId(4)]),
    );

    expect(rebuilt).toEqual({ content, appliedFields: [] });
  });
});
