#!/usr/bin/env -S deno run --allow-env

import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import * as jsonc from "https://deno.land/std@0.210.0/jsonc/parse.ts";
import { copySync } from "https://deno.land/std@0.211.0/fs/copy.ts";
import { walkSync } from "https://deno.land/std@0.207.0/fs/walk.ts";
import { parse as parseToml } from "https://deno.land/std@0.207.0/toml/mod.ts";
import Handlebars from "npm:handlebars@4.7.8";
import { marked } from "npm:marked@11.1.1";
import { clear as clearTerm } from "https://deno.land/x/clear@v1.3.0/mod.ts";
import { parse as parseArgs } from "https://deno.land/std@0.207.0/flags/mod.ts";
import sass from "https://deno.land/x/denosass@1.0.6/mod.ts";
import { debounce } from "https://deno.land/std@0.207.0/async/debounce.ts";
import { serveDir } from "https://deno.land/std@0.207.0/http/file_server.ts";

const OUT_DIR = "rendered/";
const TEMPLATE_DIR = "templates/";

/////////////////////
// TOP-LEVEL BUILD //
/////////////////////

// Call `serve` or `build` depending on the args inputted:
// `deno task build` --> `Deno.args = []` --> calls `build`
// `deno task serve` --> `Deno.args = ["--serve"]` --> calls `serve`
const args = parseArgs(Deno.args, { boolean: ["serve"] });
if (args.serve) {
  await serve();
} else {
  build();
}

// Serve a HTTP server and rebuild when files change
async function serve() {
  // Do an initial build
  buildAndLog();

  // Run an HTTP server in the background
  Deno.serve((request: Request) => serveDir(request, { fsRoot: OUT_DIR }));

  // Set up debounced build function
  const debouncedBuild = debounce(buildAndLog, 200);
  // Rebuild if the file system changes
  const outputPath = path.join(Deno.cwd(), OUT_DIR);
  const watcher = Deno.watchFs("");
  for await (const event of watcher) {
    if (event.kind == "access") continue; // File accesses don't matter
    for (const path of event.paths) {
      if (path.startsWith(outputPath)) continue;
      debouncedBuild();
    }
  }
}

function buildAndLog(): void {
  clearTerm(true);
  try {
    build();
  } catch (exception) {
    console.log(
      "%cBuild failed with this exception:",
      "color: red; font-weight: bold;",
    );
    console.error(exception);
  }
  console.log();
  console.log("Awaiting file changes to rebuild...");
}

// Build the site, writing the result to `OUT_DIR`
function build() {
  // Prepare output directory
  console.log();
  console.log();
  console.log();
  console.log("Preparing output directory");
  removeIfExists(OUT_DIR);
  ensureDirExists(OUT_DIR);

  // Render and collect the subpages
  const subPages: Page[] = [];
  const allCategories: Category[] = ["blog", "project", "art"];
  for (const cat of allCategories) {
    subPages.push(...renderCategoryDirectory(cat));
  }

  // Render the main page
  renderMainPage(subPages);
}

function renderMainPage(unsortedSubPages: Page[]) {
  const pagesAtTop = ["wheatley", "this-site"];

  let sortedSubPages: Page[] = [];
  // Copy pages which we've forced to the top
  for (const p of pagesAtTop) {
    const pageIdx = unsortedSubPages.findIndex((page: Page) => page.slug == p);
    const page = unsortedSubPages.splice(pageIdx, 1)[0];
    sortedSubPages.push(page);
  }
  // Add the remaining subpages, sorted by date
  unsortedSubPages.sort((a: Page, b: Page) => b.date.valueOf() - a.date.valueOf());
  sortedSubPages.push(...unsortedSubPages);

  // Filter drafts.
  // TODO: Arg for this
  sortedSubPages = sortedSubPages.filter((page) => !page.draft);

  console.log("Rendering main page");
  const mainPageDir = "main-page/";

  // Render the main page
  const aboutMeMarkdown = Deno.readTextFileSync(path.join(mainPageDir, "about.md"));
  const templateData = {
    subPages: sortedSubPages,
    aboutMe: renderMarkdown(aboutMeMarkdown),
  };
  const rendered = renderTemplate("main-page", templateData);
  Deno.writeTextFileSync(path.join(OUT_DIR, "index.html"), rendered);

  // Copy the page-icons directory
  copySync("content/page-icons", path.join(OUT_DIR, "page-icons"));

  // Render the rest of the directory contents
  copyOrCompileDirectory(mainPageDir, ".", ["about.md"]);
}

function renderCategoryDirectory(category: Category): Page[] {
  const categoryDir = path.join("content", category);
  console.log(`Rendering pages in '${categoryDir}'`);

  const pages: Page[] = [];
  function addPage(markdownPath: string, slug: string) {
    console.log(`    Rendering '${slug}'`);
    const [page] = renderFrontmatteredMarkdown(markdownPath, slug, category);
    pages.push(page);
  }

  for (const entry of Deno.readDirSync(categoryDir)) {
    if (entry.isDirectory) {
      // Render `${entry.name}/index.md` as the main markdown file
      const pageDir = path.join(categoryDir, entry.name);
      const markdownPath = path.join(pageDir, "index.md");
      const slug = entry.name;
      addPage(markdownPath, slug);
      // Render the rest of the directory as usual
      copyOrCompileDirectory(pageDir, slug, ["index.md"]);
    } else if (entry.name.endsWith(".md")) {
      // Render this page without any other files
      const slug = path.basename(entry.name, ".md");
      addPage(path.join(categoryDir, entry.name), slug);
    }
  }
  return pages;
}

type Page = FrontMatter & {
  slug: string;
  category: Category;
  dateString: string;
  imageFileName: string;
};
type Category = "project" | "blog" | "art";

///////////////
// RENDERING //
///////////////

function renderFrontmatteredMarkdown(
  mdFilePath: string,
  slug: string,
  category: Category,
): [Page] {
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
  const page: Page = {
    slug,
    category,
    imageFileName: getPageIconFileName(slug),
    dateString: frontMatter.formattedDate || formatDate(frontMatter.date),
    ...frontMatter,
  };

  // Render markdown
  // Create subpage
  const pageDir = path.join(OUT_DIR, slug);
  ensureDirExists(pageDir);
  const content = renderMarkdown(markdown);
  const html = renderTemplate("page-prose", { content });
  Deno.writeTextFileSync(path.join(pageDir, "index.html"), html);

  return [page];
}

type FrontMatter = {
  title: string;
  description: string;

  date: Date;
  formattedDate?: string;
  draft?: boolean;

  topics: string[];
  languages: string[];
};

function copyOrCompileDirectory(
  inDir: string,
  outDir: string,
  ignorePaths: string[],
): void {
  // Create output directory
  const outputPath = path.join(OUT_DIR, outDir);
  ensureDirExists(outputPath);
  // Handle files with a special meaning
  const pathsToNotCopy = ignorePaths;
  for (const entry of Deno.readDirSync(inDir)) {
    if (entry.isFile && entry.name == "tsconfig.json") {
      const tsSourcePaths = buildTypescript(inDir, outputPath);
      pathsToNotCopy.push(entry.name, ...tsSourcePaths);
    }
    if (entry.isDirectory && entry.name == "sass") {
      buildSass(path.join(inDir, entry.name), outputPath);
      pathsToNotCopy.push(entry.name);
    }
  }

  // Copy everything which isn't in `pathsNotToCopy`
  for (const entry of walkSync(inDir)) {
    if (!entry.isFile) continue; // Skip non-files
    const sourcePath = entry.path;

    // Remove `inDir` from the path
    let relativePath = sourcePath.slice(inDir.length);
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
      const destPath = path.join(outputPath, relativePath);
      ensureDirExists(path.dirname(destPath));
      Deno.copyFileSync(sourcePath, destPath);
    }
  }
}

function buildTypescript(tsDir: string, pageDir: string): string[] {
  // Type containing the parts of a `tsconfig.json` file that we care about
  type TsConfig = { include: string[]; compilerOptions: { outDir: string } };
  // Read tsconfig
  const tsConfigPath = path.join(tsDir, "tsconfig.json");
  const tsConfig = <TsConfig> jsonc.parse(Deno.readTextFileSync(tsConfigPath))!;
  const outDir = path.join(pageDir, tsConfig.compilerOptions.outDir);
  ensureDirExists(outDir);

  // Run the compiler
  console.log(`    Compiling ${tsConfigPath} with tsc...`);
  const command = new Deno.Command("tsc", {
    args: ["-p", tsConfigPath, "--outDir", outDir],
    stderr: "inherit",
    stdout: "inherit",
  });
  const result = command.outputSync();
  if (!result.success) {
    throw new Error(`TS compilation of '${tsConfigPath}' failed`);
  }
  console.log("    Compilation complete.");

  return tsConfig.include; // Don't copy any TS files because they've been compiled
}

function buildSass(inDir: string, outDir: string) {
  const outCssDir = path.join(outDir, "css");
  ensureDirExists(outCssDir);

  for (const entry of walkSync(inDir)) {
    if (entry.isFile && entry.name.endsWith(".scss")) {
      // Determine where to place the outputted CSS
      const subDirPath = path.relative(inDir, entry.path);
      const cssDirPath = path.join(outCssDir, path.dirname(subDirPath));
      const cssFilePath = path.join(cssDirPath, entry.name.replace(".scss", ".css"));
      // Compile the SASS
      const compiledCss = sass(Deno.readTextFileSync(entry.path)).to_string() as string;
      // Create the CSS
      ensureDirExists(cssDirPath);
      Deno.writeTextFileSync(cssFilePath, compiledCss);
    }
  }
}

///////////
// UTILS //
///////////

function renderMarkdown(markdown: string): string {
  // TODO: Add slug path to sub-page markdown
  return marked.parse(markdown, { async: false }) as string;
}

function renderTemplate(templateName: string, data: any): string {
  // TODO: Write to `index.html` from within this function
  const source = Deno.readTextFileSync(path.join(TEMPLATE_DIR, `${templateName}.html`));
  const template = Handlebars.compile(source);
  return template(data);
}

function getPageIconFileName(slug: string): string {
  for (const imgFile of Deno.readDirSync("content/page-icons")) {
    const fileWithoutExtension = imgFile.name.split(".")[0];
    if (fileWithoutExtension == slug) {
      return imgFile.name;
    }
  }
  return "default.png";
}

function formatDate(date: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function ensureDirExists(outputPath: string) {
  Deno.mkdirSync(outputPath, { recursive: true });
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
