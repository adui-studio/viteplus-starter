import { realpathSync } from "node:fs";
import { tmpdir as systemTmpdir } from "node:os";

// Canonicalize only the OS-provided temporary root, not arbitrary output paths.
// macOS commonly reports /var/folders while /var is an alias for /private/var.
export function tmpdir(directory = systemTmpdir()) {
  return realpathSync(directory);
}
