// this file handles user input, computation, and drawing
// simple words so it's easy to follow

// coefficients a, b, c, d for the equation a*x^3 + b*x^2 + c*x + d = 0
interface Coeffs {
  a: number;
  b: number;
  c: number;
  d: number;
}

// when the button is clicked, read values, solve, show and draw
const button = document.getElementById("solve-btn");
button?.addEventListener("click", () => {
  const co = getValues();           // get numbers from the form
  const r = findRoots(co);         // compute the roots
  displayRoots(r);                 // put them on the page
  drawPolynomial(co);              // draw the curve
});

// read numbers from the four inputs
function getValues(): Coeffs {
  return {
    a: parseFloat((document.getElementById("coef-a") as HTMLInputElement).value),
    b: parseFloat((document.getElementById("coef-b") as HTMLInputElement).value),
    c: parseFloat((document.getElementById("coef-c") as HTMLInputElement).value),
    d: parseFloat((document.getElementById("coef-d") as HTMLInputElement).value),
  };
}

// helper for nice output
function formatNum(n: number): string {
  if (Math.abs(n) < 1e-12) return "0"; // treat tiny as zero
  return n.toFixed(5);
}

// main math: Cardano formula for cubic roots
// returns three values; non-real ones are the string "Complex Number".
function findRoots({ a, b, c, d }: Coeffs): (number | "Complex Number")[] {
  if (a === 0) {
    // we only handle true cubics here
    throw new Error("Coefficient a must not be zero");
  }
  // scale everything by a so that x^3 + px + q = 0
  const ba = b / a;
  const ca = c / a;
  const da = d / a;
  const p = (3 * ca - ba * ba) / 3;
  const q = (2 * ba * ba * ba - 9 * ba * ca + 27 * da) / 27;
  const disc = q * q / 4 + p * p * p / 27;
  const shift = ba / 3; // will subtract later to undo change of variable

  const out: (number | "Complex Number")[] = [];

  if (disc > 0) {
    // one real root, two complex
    const s = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + s);
    const v = Math.cbrt(-q / 2 - s);
    out.push(u + v - shift);
    out.push("Complex Number");
    out.push("Complex Number");
  } else if (Math.abs(disc) < 1e-12) {
    // double or triple root
    const u = Math.cbrt(-q / 2);
    out.push(2 * u - shift); // simple root
    out.push(-u - shift);    // repeated root
    out.push(-u - shift);
  } else {
    // three different real roots
    const r = Math.sqrt(-p * p * p / 27);
    const phi = Math.acos(-q / (2 * r));
    const m = 2 * Math.sqrt(-p / 3);
    for (let k = 0; k < 3; k++) {
      const y = m * Math.cos((phi + 2 * Math.PI * k) / 3);
      out.push(y - shift);
    }
  }
  return out;
}

// show the roots in the #results div
function displayRoots(roots: (number | "Complex Number")[]) {
  const div = document.getElementById("results");
  if (!div) return;
  div.innerHTML = "";
  roots.forEach((r, i) => {
    const p = document.createElement("p");
    p.textContent = `root ${i + 1}: ${typeof r === "number" ? formatNum(r) : r}`;
    div.appendChild(p);
  });
}

// draw the cubic curve on the canvas
function drawPolynomial({ a, b, c, d }: Coeffs) {
  const canvas = document.getElementById("graph") as HTMLCanvasElement;
  const ctx = canvas?.getContext("2d");
  if (!ctx) return;

  // clear entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // helpers to convert from math coords (-10..10) to pixels
  const toX = (x: number) => ((x + 10) / 20) * canvas.width;
  const toY = (y: number) => canvas.height - ((y + 10) / 20) * canvas.height;

  // draw axes in gray
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  ctx.moveTo(0, toY(0));
  ctx.lineTo(canvas.width, toY(0));
  ctx.moveTo(toX(0), 0);
  ctx.lineTo(toX(0), canvas.height);
  ctx.stroke();

  // now draw the curve in black
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  for (let i = 0; i <= 400; i++) {
    const x = (i / 400) * 20 - 10;
    const y = a * x * x * x + b * x * x + c * x + d;
    const px = toX(x);
    const py = toY(y);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

