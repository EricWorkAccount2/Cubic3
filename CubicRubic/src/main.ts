import './style.css';

// this probably was the biggest struggle I had ever face with using typescript, 
// albiet I have 12 new assignments from night school kinesiology just this week//
// ====================== BUTTON ======================//

const solveBtn = document.getElementById("solve-btn") as HTMLButtonElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;

solveBtn.addEventListener("click", () => {

    // get values
    const a = Number((document.getElementById("a") as HTMLInputElement).value);
    const b = Number((document.getElementById("b") as HTMLInputElement).value);
    const c = Number((document.getElementById("c") as HTMLInputElement).value);
    const d = Number((document.getElementById("d") as HTMLInputElement).value);

    // cubic cmd
    const roots = solveCubicSimple(a, b, c, d);
    
    let extraInfo = "";
    // had to consult chatgpt for adding the remaining values
    if (a !== 0) {
        const A = b / a;
        const B = c / a;
        const C = d / a;

        const p = (3 * B - A * A) / 3;
        const q = (2 * A * A * A - 9 * A * B + 27 * C) / 27;
        const disc = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3);

        extraInfo = `p = ${p.toFixed(3)}, q = ${q.toFixed(3)}, discriminant = ${disc.toFixed(3)}\n`;
    }


    resultDiv.textContent = extraInfo + roots.join("\n");

    graphCubic(a, b, c, d);
});

// ====================== Formula ======================//

function solveCubicSimple(a: number, b: number, c: number, d: number): string[] {

    const roots: string[] = [];
    if (a === 0) {
        return ["Not a cubic equation"];
    }

    const A = b / a;
    const B = c / a;
    const C = d / a;

    const p = (3 * B - A * A) / 3;
    const q = (2 * A * A * A - 9 * A * B + 27 * C) / 27;

    const disc = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3);

    if (disc > 0) {

        const sqrtDisc = Math.sqrt(disc);

        const u = Math.cbrt(-q / 2 + sqrtDisc);
        const v = Math.cbrt(-q / 2 - sqrtDisc);

        const x = (u + v) - A / 3;
        // adds the roots to the result-container
        roots.push("Root 1 = " + x.toFixed(3));
        roots.push("Root 2 = Complex");
        roots.push("Root 3 = Complex");
    }
    else if (Math.abs(disc) < 0.000001) {

        const u = Math.cbrt(-q / 2);

        const x1 = 2 * u - A / 3;
        const x2 = -u - A / 3;

        roots.push("Root 1 = " + x1.toFixed(3));
        roots.push("Root 2 = " + x2.toFixed(3));
        roots.push("Root 3 = " + x2.toFixed(3));
    }
    else {

        const r = Math.sqrt(-p / 3);
        const phi = Math.acos(-q / (2 * r * r * r));

        const x1 = 2 * r * Math.cos(phi / 3) - A / 3;
        const x2 = 2 * r * Math.cos((phi + 2 * Math.PI) / 3) - A / 3;
        const x3 = 2 * r * Math.cos((phi + 4 * Math.PI) / 3) - A / 3;

        roots.push("Root 1 = " + x1.toFixed(3));
        roots.push("Root 2 = " + x2.toFixed(3));
        roots.push("Root 3 = " + x3.toFixed(3));
    }

    return roots;
}


// ====================== AXIS POLES ======================//

const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const scaleX = 20;
const scaleY = 20;
function Axis() {

    ctx.beginPath();

    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);

    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
}

Axis();


// ====================== GRAPH CANVAS ======================//

function graphCubic(a: number, b: number, c: number, d: number) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Axis();

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    for (let px = 0; px <= canvas.width; px++) {

        const x = (px - canvas.width / 2) / scaleX;

        const y = a * x * x * x + b * x * x + c * x + d;

        const canvasY = canvas.height / 2 - y * scaleY;

        if (px === 0) ctx.moveTo(px, canvasY);
        else ctx.lineTo(px, canvasY);
    }

    ctx.stroke();
}