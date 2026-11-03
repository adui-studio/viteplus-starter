import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pendingRecovery } from "../packages/create/src/recovery.mjs";

export async function writeVpShim(directory, script) {
  if (process.platform === "win32") {
    await writeFile(
      join(directory, "vp.cmd"),
      `@echo off\r\n"${process.execPath}" "${script}" %*\r\n`,
    );
  } else {
    const [invocation] = pendingRecovery([{ command: process.execPath, args: [script] }]);
    await writeFile(join(directory, "vp"), `#!/bin/sh\nexec ${invocation.posix} "$@"\n`, {
      mode: 0o755,
    });
  }
}
