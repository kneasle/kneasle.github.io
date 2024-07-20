// Code for the matrix-style scrolling text on the home page

const MIN_START_HEIGHT = 0.6; // Factor of window height
const MAX_START_HEIGHT = 0.8; // Factor of window height

const FADE_OUT_DURATION = 100; // Characters worth of time

let matrices: Matrix[] = [];

function main() {
  // Construct the first set of elements
  const parent = document.getElementById("matrix-container")!;
  let num_codes = 8;
  for (let i = 0; i < num_codes; i++) {
    let elem = document.createElement("p");
    elem.className = "matrix-text";
    parent.appendChild(elem);

    makeMatrix(elem, 1.1 + 6 * (1 - i / num_codes));
  }

  // Update the parallax when the user scrolls
  let scroll_down_elem = document.getElementById("scroll-down")!;
  document.onscroll = () => {
    // TODO: Handle parallax with CSS
    for (const m of matrices) {
      m.update_y_pos();
    }

    // Update the scroll
    let should_be_present = document.scrollingElement!.scrollTop == 0;
    let class_to_keep = should_be_present ? "scroll-down-present" : "scroll-down-faded";
    let class_to_remove = should_be_present ? "scroll-down-faded" : "scroll-down-present";
    if (!scroll_down_elem.classList.contains(class_to_keep)) {
      scroll_down_elem.classList.remove(class_to_remove);
      scroll_down_elem.classList.add(class_to_keep);
    }
  };

  // Begin the animation loop
  frame();
}

window.addEventListener("load", main);

function makeMatrix(elem: HTMLElement, distance: number) {
  const url = random_url();
  fetch(url)
    .then((response: Response) => response.text())
    .then((code: string) => {
      // Parse the URL to add a header line to the code
      const parts = /https:\/\/raw.githubusercontent.com\/kneasle\/(.+)\/[0-9a-f]+\/(.*)/.exec(url);
      const repoSlug = parts![1];
      const file = parts![2];
      const retabbedCode = code.replaceAll("\t", "    ");
      const textToDisplay =
        `[[Writing file: ${file} from github.com/kneasle/${repoSlug}]]\n\n${retabbedCode}`;

      // Create the matrix
      const speed = 30 + 20 * Math.random();
      matrices.push(new Matrix(textToDisplay, elem, speed, distance));
    });
}

function frame() {
  const is_matrix_in_view = document.scrollingElement!.scrollTop < window.innerHeight;
  if (is_matrix_in_view) {
    update_matrices();
  }

  requestAnimationFrame(frame);
}

function update_matrices() {
  let faded_indices = [];
  for (let i = 0; i < matrices.length; i++) {
    matrices[i].type_code();
    if (matrices[i].is_fully_faded()) {
      faded_indices.push(i);
    }
  }

  // Remove the finished arrays
  faded_indices.reverse();
  for (const idx of faded_indices) {
    makeMatrix(matrices[idx].dom_element, matrices[idx].distance);
    matrices.splice(idx, 1); // Remove the old matrix
  }
}

class Matrix {
  code_on_screen: string;
  code_left_to_type: string;
  code_length: number;
  dom_element: HTMLElement;

  start_time: number;
  chars_typed: number;
  distance: number;
  speed: number; // Chars per second
  start_height: number; // Factor of window height

  constructor(
    code: string,
    element: HTMLElement,
    speed: number,
    distance: number,
  ) {
    this.code_left_to_type = code;
    this.code_length = code.length;
    this.dom_element = element;
    this.speed = speed * Math.sqrt(distance);
    this.distance = distance;
    this.start_height = MIN_START_HEIGHT + (MAX_START_HEIGHT - MIN_START_HEIGHT) * Math.random();
    this.update_y_pos();

    // Initialise everything such that we haven't typed any code yet
    this.start_time = Date.now();
    this.chars_typed = 0;
    this.code_on_screen = "";
    for (let i = 0; i < this.max_num_lines() - 1; i++) {
      this.code_on_screen += "\n";
    }

    // Configure DOM element
    let position_variance = 1 - 1 / (this.distance - 0.5);
    this.dom_element.style.left = `${Math.random() * 100 * position_variance}%`;
    this.dom_element.style.fontSize = `${this.font_size()}px`;
    this.set_color();
  }

  max_num_lines(): number {
    let height = this.start_height * window.innerHeight;
    return Math.floor((height / this.font_size()) * 0.85);
  }

  font_size(): number {
    return Math.round(this.scale() * 50);
  }

  scale(): number {
    return 1 / this.distance;
  }

  set_color() {
    let color_factor = Math.pow(this.distance - 1, -0.8);
    let color_scale = 0.1 + color_factor * 0.7;
    let color = `rgb(0, ${color_scale * 128}, ${color_scale * 255}, ${this.opacity()})`;
    this.dom_element.style.color = color;
  }

  update_y_pos(): void {
    const y_pos = -10 + document.scrollingElement!.scrollTop * (1 - this.scale());
    this.dom_element.style.top = `${y_pos}px`;
  }

  type_code() {
    // Determine how many chars to type
    let secs_since_start = (Date.now() - this.start_time) / 1000;
    let expected_chars_typed = secs_since_start * this.speed;
    let chars_to_add = Math.round(expected_chars_typed - this.chars_typed);
    // Take the next `chars_to_add` chars to be typed
    let text_to_add = this.code_left_to_type.substring(0, chars_to_add);
    this.code_left_to_type = this.code_left_to_type.substring(chars_to_add);
    // Type these chars
    this.code_on_screen += text_to_add;
    this.chars_typed += chars_to_add; // These chars have now be typed
    // Truncate the code if it's too tall
    let lines = this.code_on_screen.split("\n");
    lines = lines.slice(-this.max_num_lines());
    this.code_on_screen = lines.join("\n");
    // Update the screen
    this.dom_element.textContent = this.code_on_screen;
    // Play fadeout animation
    if (this.is_finished_typing()) {
      this.set_color();
    }
  }

  opacity(): number {
    let chars_over_typed = this.chars_typed - this.code_length;
    let unclamped_factor = 1 - (chars_over_typed / FADE_OUT_DURATION);
    return Math.max(0, Math.min(1, unclamped_factor));
  }

  is_finished_typing(): boolean {
    return this.code_left_to_type.length == 0 && this.chars_typed > 0;
  }

  is_fully_faded(): boolean {
    return this.is_finished_typing() && this.opacity() == 0;
  }
}

function random_url() {
  const urls = CODE_URLS; // Comes from `codeUrls.ts`, generated by the build script
  let idx = Math.floor(Math.random() * urls.length);
  return urls[idx];
}
