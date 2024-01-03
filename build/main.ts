import * as path from "https://deno.land/std@0.207.0/path/mod.ts";
import * as jsonc from "https://deno.land/std@0.210.0/jsonc/parse.ts";
import { walkSync } from "https://deno.land/std@0.207.0/fs/walk.ts";
import { parse as parseToml } from "https://deno.land/std@0.207.0/toml/mod.ts";
import Handlebars from "npm:handlebars@4.7.8";
import { marked } from "npm:marked@11.1.1";

const OUT_DIR = "rendered/";
const TEMPLATE_DIR = "templates/";

/////////////////////
// TOP-LEVEL BUILD //
/////////////////////

function build() {
  // Prepare output directory
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

build();

function renderMainPage(subPages: Page[]) {
  // Sort pages
  subPages.sort((a: Page, b: Page) => b.date.valueOf() - a.date.valueOf());
  // Filter drafts.
  // TODO: Arg for this
  subPages = subPages.filter((page) => !page.draft);

  console.log("Rendering main page");
  const mainPageDir = "main-page/";

  // Render the main page
  const aboutMeMarkdown = Deno.readTextFileSync(path.join(mainPageDir, "about.md"));
  const templateData = {
    subPages,
    aboutMe: renderMarkdown(aboutMeMarkdown),
  };
  const rendered = renderTemplate("main-page", templateData);
  Deno.writeTextFileSync(path.join(OUT_DIR, "index.html"), rendered);

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
};
type Category = "project" | "blog" | "art";

///////////////
// RENDERING //
///////////////

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
  const page: Page = {
    slug,
    category,
    dateString: frontMatter.formattedDate || formatDate(frontMatter.date),
    ...frontMatter,
  };

  // Render markdown
  const data = {
    title: page.title,
    category: page.category,
    content: renderMarkdown(markdown),
  };
  const renderedHtml = renderTemplate("blog", data);
  // Create subpage
  const pageDir = path.join(OUT_DIR, slug);
  ensureDirExists(pageDir);
  Deno.writeTextFileSync(path.join(pageDir, "index.html"), renderedHtml);

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

function copyOrCompileDirectory(inDir: string, outDir: string, ignorePaths: string[]): void {
  // Create output directory
  const outputPath = path.join(OUT_DIR, outDir);
  ensureDirExists(outputPath);
  // Handle files with a special meaning
  const pathsToNotCopy = ignorePaths;
  for (const entry of Deno.readDirSync(inDir)) {
    if (
      entry.isFile &&
      entry.name == "tsconfig.json"
    ) {
      const tsSourcePaths = buildTypescript(inDir, outputPath);
      pathsToNotCopy.push(entry.name, ...tsSourcePaths);
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

///////////
// UTILS //
///////////

function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

function renderTemplate(templateName: string, data: any) {
  // TODO: Write to `index.html` from within this function
  const source = Deno.readTextFileSync(path.join(TEMPLATE_DIR, `${templateName}.html`));
  const template = Handlebars.compile(source);
  return template(data);
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
