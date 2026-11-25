import { PassThrough } from "node:stream";
import { afterEach, describe, expect, it, vi } from "vitest";
import { exitQuietlyOnClosedStdout } from "../../../src/shared/stdout-epipe.js";

describe("exitQuietlyOnClosedStdout", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exits with code 0 when the reader closes the pipe (EPIPE)", () => {
    const exit = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
    const stream = new PassThrough();
    exitQuietlyOnClosedStdout(stream as unknown as NodeJS.WriteStream);

    stream.emit("error", Object.assign(new Error("write EPIPE"), { code: "EPIPE" }));

    expect(exit).toHaveBeenCalledWith(0);
  });

  it("rethrows other stream errors", () => {
    const exit = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
    const stream = new PassThrough();
    exitQuietlyOnClosedStdout(stream as unknown as NodeJS.WriteStream);

    expect(() => stream.emit("error", Object.assign(new Error("boom"), { code: "EIO" }))).toThrow(
      /boom/,
    );
    expect(exit).not.toHaveBeenCalled();
  });
});
