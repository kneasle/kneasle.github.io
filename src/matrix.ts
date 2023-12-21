// Code for the matrix-style scrolling text on the home page

let matrices: Matrix[] = [];

function main() {
  makeMatrix(
    "matrix-1",
    "https://raw.githubusercontent.com/kneasle/ringing/master/monument/lib/src/parameters.rs",
    4
  );
  makeMatrix(
    "matrix-2",
    "https://raw.githubusercontent.com/kneasle/ringing/master/monument/lib/src/composition.rs",
    3
  );
  makeMatrix(
    "matrix-3",
    "https://raw.githubusercontent.com/kneasle/ringing/master/monument/lib/src/composition.rs",
    2
  );

  frame();
}

function makeMatrix(id: string, url: string, distance: number) {
  const elem = document.getElementById(id)!;
  fetch(url)
    .then((response: Response) => response.text())
    .then((code: string) => {
      const speed = 50 + 50 * Math.random();
      matrices.push(new Matrix(code, elem, speed, distance));
    });
}

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

  constructor(
    code: string,
    element: HTMLElement,
    speed: number,
    distance: number
  ) {
    this.code_left_to_type = code;
    this.dom_element = element;
    this.speed = speed;
    this.distance = distance;

    // Initialise everything such that we haven't typed any code yet
    this.start_time = Date.now();
    this.chars_typed = 0;
    this.code_on_screen = "";

    // Configure DOM element
    this.dom_element.style.left = `${Math.random() * 30}%`;
    this.dom_element.style.top = "-10px";
    this.dom_element.style.fontSize = `${this.font_size()}px`;
    this.dom_element.style.color = this.color();
  }

  max_num_lines(): number {
    let height = 0.8 * window.innerHeight;
    return Math.floor((height / this.font_size()) * 0.8);
  }

  font_size(): number {
    return this.scale() * 50;
  }

  scale(): number {
    return 1 / this.distance;
  }

  color(): string {
    let col_scale = 1 - this.distance / 9;
    return `rgb(0, ${col_scale * 128}, ${col_scale * 255})`;
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
