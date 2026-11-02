import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { chmodSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { after, test } from "node:test"
import { fileURLToPath } from "node:url"

const script = fileURLToPath(new URL("./build-pdf.sh", import.meta.url))
const bins = mkdtempSync(join(tmpdir(), "build-pdf-bin-"))
after(() => rmSync(bins, { recursive: true, force: true }))
symlinkSync("/usr/bin/dirname", join(bins, "dirname"))

// PATH holds only `dirname` and whatever the test stubs in, so the real toolchain
// on this machine can't satisfy the script.
const run = () => spawnSync("/bin/bash", [script], { env: { PATH: bins }, encoding: "utf8" })

test("names pandoc when it is missing, rather than exiting silently", () => {
  const result = run()
  assert.equal(result.status, 1)
  assert.match(result.stderr, /pandoc/)
})

test("names xelatex when it is missing, rather than exiting silently", () => {
  const stub = join(bins, "pandoc")
  writeFileSync(stub, "#!/bin/sh\nexit 0\n")
  chmodSync(stub, 0o755)
  const result = run()
  assert.equal(result.status, 1)
  assert.match(result.stderr, /xelatex/)
})
