import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import * as jsonc from "https://deno.land/std@0.210.0/jsonc/parse.ts";
import { walkSync } from "https://deno.land/std@0.207.0/fs/walk.ts";

const OUT_DIR = "rendered/";

/////////////////////
// TOP-LEVEL BUILD //
/////////////////////

function build() {
  // Prepare output directory
  console.log("Preparing output directory");
  removeIfExists(OUT_DIR);
  makeDirExist(OUT_DIR);

  // Render the main page
  console.log("Rendering main page");
  renderDirectory("main-page/", ".");
}

build();

///////////////
// RENDERING //
///////////////

function renderDirectory(in_dir: string, out_dir?: string): void {
  // Create output directory
  const output_path = path.join(OUT_DIR, out_dir || in_dir);
  makeDirExist(output_path);
  // Handle files with a special meaning
  const pathsToNotCopy: string[] = [];
  for (const entry of Deno.readDirSync(in_dir)) {
    if (
      entry.isFile &&
      entry.name == "tsconfig.json"
    ) {
      const tsSourcePaths = buildTypescript(in_dir, output_path);
      pathsToNotCopy.push(entry.name, ...tsSourcePaths);
    }
  }

  // Copy everything which isn't in `pathsNotToCopy`
  for (const entry of walkSync(in_dir)) {
    if (!entry.isFile) continue; // Skip non-files
    const sourcePath = entry.path;

    // Remove `in_dir` from the path
    let relativePath = sourcePath.slice(in_dir.length);
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }
    // Determine if this path should be ignored
    let shouldBeIgnored = false;
    for (const p of pathsToNotCopy) {
      if (relativePath.startsWith(p)) {
        shouldBeIgnored = true;
      }
    }
    // Copy if not ignored
    if (!shouldBeIgnored) {
      const destPath = path.join(output_path, relativePath);
      makeDirExist(path.dirname(destPath));
      Deno.copyFileSync(sourcePath, destPath);
      console.log(`    Copying ${sourcePath} to ${destPath}`);
    }
  }
}

function buildTypescript(ts_dir: string, page_dir: string): string[] {
  // Type containing the parts of a `tsconfig.json` file that we care about
  type TsConfig = { include: string[]; compilerOptions: { outDir: string } };
  // Read tsconfig
  const ts_config_path = path.join(ts_dir, "tsconfig.json");
  const ts_config = <TsConfig> jsonc.parse(Deno.readTextFileSync(ts_config_path))!;
  const out_dir = path.join(page_dir, ts_config.compilerOptions.outDir);
  makeDirExist(out_dir);

  // Run the compiler
  console.log(`    Compiling ${ts_config_path} with tsc...`);
  const command = new Deno.Command("tsc", {
    args: ["-p", ts_config_path, "--outDir", out_dir],
    stderr: "inherit",
  });
  const result = command.outputSync();
  if (!result.success) {
    throw new Error(`TS compilation of '${ts_config_path}' failed`);
  }
  console.log("    Compilation complete.");

  return ts_config.include; // Don't copy any TS files because they've been compiled
}

///////////
// UTILS //
///////////

function makeDirExist(output_path: string) {
  Deno.mkdirSync(output_path, { recursive: true });
}

function removeIfExists(dir: string): void {
  try {
    Deno.removeSync(dir, { recursive: true });
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err;
    }
  }
}
