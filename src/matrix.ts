// Code for the matrix-style scrolling text on the home page

const MIN_START_HEIGHT = 0.6; // Factor of window height
const MAX_START_HEIGHT = 0.8; // Factor of window height

let matrices: Matrix[] = [];

function main() {
  let urls = [
    "https://raw.githubusercontent.com/kneasle/ringing/master/monument/lib/src/parameters.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/monument/lib/src/composition.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/monument/lib/src/lib.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/bellframe/src/row/borrowed.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/bellframe/src/row/owned.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/bellframe/src/lib.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/bellframe/src/method/mod.rs",
    "https://raw.githubusercontent.com/kneasle/ringing/master/bellframe/src/method/class.rs",
  ];

  const parent = document.getElementById("matrix-container")!;
  let num_codes = 8;
  for (let i = 0; i < num_codes; i++) {
    makeMatrix(parent, urls[i], 1.1 + 6 * (1 - i / num_codes));
  }

  frame();
}

function makeMatrix(parent: HTMLElement, url: string, distance: number) {
  let elem = document.createElement("p");
  elem.className = "matrix";
  parent.appendChild(elem);

  fetch(url)
    .then((response: Response) => response.text())
    .then((code: string) => {
      const speed = 30 + 20 * Math.random();
      matrices.push(new Matrix(code, elem, speed, distance));
    });
}

document.onscroll = () => {
  for (const m of matrices) {
    m.update_y_pos();
  }
};

function frame() {
  for (const m of matrices) {
    m.type_code();
  }

  requestAnimationFrame(frame);
}

class Matrix {
  code_on_screen: string;
  code_left_to_type: string;
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
    this.dom_element.style.color = this.color();
  }

  max_num_lines(): number {
    let height = this.start_height * window.innerHeight;
    return Math.floor((height / this.font_size()) * 0.85);
  }

  font_size(): number {
    return this.scale() * 50;
  }

  scale(): number {
    return 1 / this.distance;
  }

  color(): string {
    let color_factor = Math.pow(this.distance - 1, -0.8);
    let color_scale = 0.1 + color_factor * 0.7;
    return `rgb(0, ${color_scale * 128}, ${color_scale * 255})`;
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
  }

  is_finished(): boolean {
    return this.code_left_to_type == "";
  }
}

main();
