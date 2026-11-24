import { closeSync, mkdtempSync, openSync, readSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const READ_CHUNK_BYTES = 64 * 1024;

/**
 * Output of one parent validation written to a file instead of a pipe (PJR-6690).
 *
 * `exec run --parallel` runs every task in one process, and the preparation and integration of
 * other tasks block its event loop with spawnSync (`npm ci`, `specdojo build`, merges). A pipe
 * is drained only while the event loop runs, so a validation that prints more than the pipe
 * buffer (validate-schema prints about 450 KB) stopped writing and waited until the timeout.
 * The child writes to a file, which never blocks, and the runner reads the file afterwards.
 */
export class ValidationOutputFiles {
  readonly stdoutFd: number;
  readonly stderrFd: number;
  private readonly directory: string;
  private readonly offsets = { stdout: 0, stderr: 0 };
  private closed = false;

  constructor() {
    this.directory = mkdtempSync(join(tmpdir(), "specdojo-parent-validation-"));
    this.stdoutFd = openSync(join(this.directory, "stdout"), "w+");
    try {
      this.stderrFd = openSync(join(this.directory, "stderr"), "w+");
    } catch (error) {
      closeSync(this.stdoutFd);
      rmSync(this.directory, { recursive: true, force: true });
      throw error;
    }
  }

  /** Read what the child wrote since the previous call and pass it on in chunks. */
  drain(stream: "stdout" | "stderr", onChunk: (chunk: Buffer) => void): void {
    if (this.closed) return;
    const fd = stream === "stdout" ? this.stdoutFd : this.stderrFd;
    for (;;) {
      const buffer = Buffer.alloc(READ_CHUNK_BYTES);
      const bytesRead = readSync(fd, buffer, 0, buffer.length, this.offsets[stream]);
      if (bytesRead === 0) return;
      this.offsets[stream] += bytesRead;
      onChunk(buffer.subarray(0, bytesRead));
    }
  }

  /** Close the files and remove them. A descendant that still writes keeps only its own copy. */
  dispose(): void {
    if (this.closed) return;
    this.closed = true;
    closeSync(this.stdoutFd);
    closeSync(this.stderrFd);
    try {
      rmSync(this.directory, { recursive: true, force: true, maxRetries: 3 });
    } catch (error) {
      process.stderr.write(
        `  [parent-validation] warning: could not remove ${this.directory}: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    }
  }
}

// npm が script ごとに出す見出し（`> specdojo@0.9.2 validate:schema:glossary`）。
const NPM_SCRIPT_BANNER = /^> (?:@[^\s/]+\/)?[^\s@]+@\S+ (\S+)\s*$/u;
const MAX_PENDING_LINE = 16_384;

/** The npm script a validation was running, from the banners in its stdout. */
export class NpmScriptStageTracker {
  private pending = "";
  private last: string | undefined;

  observe(text: string): void {
    const lines = (this.pending + text).split("\n");
    this.pending = (lines.pop() ?? "").slice(-MAX_PENDING_LINE);
    for (const line of lines) {
      const match = NPM_SCRIPT_BANNER.exec(line);
      if (match) this.last = match[1];
    }
  }

  get stage(): string | undefined {
    return this.last;
  }
}
