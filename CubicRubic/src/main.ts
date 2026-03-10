import './style.css';

const canvas = document.getElementById('graph') as HTMLCanvasElement | null;
const ctx = canvas?.getContext('2d');

// very simple grid: draw lines every `step` pixels
if (ctx) {
    const { width, height } = ctx.canvas;
    const step = 20;

    // grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    // draw axes (X and Y) through center
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    // vertical (Y) axis
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    // horizontal (X) axis
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}



const form = document.getElementById("quad-form") as HTMLFormElement;

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const a: number = Number(formData.get("a"));
    const b: number = Number(formData.get("b"));
    const c: number = Number(formData.get("c"));

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        (document.getElementById("result") as HTMLInputElement).value = "No Roots";
    } else if (discriminant > 0) {
        const rootOne = (-b + Math.sqrt(discriminant)) / (2 * a);
        const rootTwo = (-b - Math.sqrt(discriminant)) / (2 * a);
        (document.getElementById("result") as HTMLInputElement).value = `x1=${rootOne}, x2=${rootTwo}`;
    } else {
        const rootOne = (-b + Math.sqrt(discriminant)) / (2 * a);
        (document.getElementById("result") as HTMLInputElement).value = `x=${rootOne}`;
    }
});

