import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import * as jsonc from "https://deno.land/std@0.210.0/jsonc/parse.ts";
import { walkSync } from "https://deno.land/std@0.207.0/fs/walk.ts";
import { parse as parseToml } from "https://deno.land/std@0.207.0/toml/mod.ts";

const OUT_DIR = "rendered/";

/////////////////////
// TOP-LEVEL BUILD //
/////////////////////

function build() {
  // Prepare output directory
  console.log("Preparing output directory");
  removeIfExists(OUT_DIR);
  makeDirExist(OUT_DIR);

  // Render and collect the subpages
  const pages = buildBlogPages("content/blog");
  console.log(pages);

  // Render the main page
  console.log("Rendering main page");
  renderDirectory("main-page/", ".", []);
}

build();

function buildBlogPages(blogDir: string): Page[] {
  console.log("Building blog");

  const pages: Page[] = [];
  function addPage(markdownPath: string, slug: string) {
    console.log(`    ${slug}`);
    const [page] = renderFrontmatteredMarkdown(markdownPath, slug, "blog");
    pages.push(page);
  }

  for (const entry of Deno.readDirSync(blogDir)) {
    if (entry.isDirectory) {
      // Render `${entry.name}/index.md` as the main markdown file
      const dirPath = path.join(blogDir, entry.name);
      const markdownPath = path.join(dirPath, "index.md");
      const slug = entry.name;
      addPage(markdownPath, slug);
      // Render the rest of the directory as usual
      renderDirectory(dirPath, slug, ["index.md"]);
    } else if (entry.name.endsWith(".md")) {
      // Render this page without any other files
      const slug = path.basename(entry.name, ".md");
      addPage(path.join(blogDir, entry.name), slug);
    }
  }
  return pages;
}

function renderFrontmatteredMarkdown(mdFilePath: string, slug: string, category: Category): [Page] {
  // Read file into frontmatter and markdown.  They are split by the next occurrence of the first
  // line (usually `+++`)
  const fileContents = Deno.readTextFileSync(mdFilePath);
  const lines = fileContents.split("\n");
  const splitIndex = lines.indexOf(lines[0], 1);
  console.assert(splitIndex >= 0);
  const frontMatterToml = lines.slice(1, splitIndex).join("\n").trim();
  const markdown = lines.slice(splitIndex + 1).join("\n").trim();

  // Parse frontmatter as TOML
  const frontMatter = <FrontMatter> parseToml(frontMatterToml);
  const page: Page = { slug, category, ...frontMatter };

  // TODO: Render markdown

  return [page];
}

type FrontMatter = {
  title: string;
  description: string;

  date: Date;
  draft?: boolean;

  topics: string[];
  languages: string[];
};

type Page = FrontMatter & { slug: string; category: Category };
type Category = "project" | "blog";

///////////////
// RENDERING //
///////////////

function renderDirectory(in_dir: string, out_dir: string, ignorePaths: string[]): void {
  // Create output directory
  const output_path = path.join(OUT_DIR, out_dir);
  makeDirExist(output_path);
  // Handle files with a special meaning
  const pathsToNotCopy = ignorePaths;
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
