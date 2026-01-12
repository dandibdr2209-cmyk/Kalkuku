// ==================================================
// GLOBAL STATE
// ==================================================
let currentMode = "MAIN";
let currentExp = "";
let justCalculated = false;
let angleMode = "DEG"; // DEG | RAD

// ==================================================
// ELEMENTS
// ==================================================
const expression = document.getElementById("expression");
const result = document.getElementById("result");

const btnMain = document.getElementById("btn");
const btnSection = document.getElementById("btn-section");
const pageMain = document.getElementById("page");
const pageOther = document.getElementById("page-other");

// ==================================================
// DISPLAY
// ==================================================
function formatDisplay(exp) {
    return exp.replace(/\*/g, "x").replace(/\//g, ":");
}

function updateDisplay() {
    result.textContent = formatDisplay(currentExp) || "0";
}


// ==================================================
// OPERATOR
// ==================================================
document.querySelectorAll(".btn[data-op]").forEach(btn => {
    btn.onclick = () => {
        const op = btn.dataset.op;

        if (op === "+/-") {
            if (!currentExp) return;
            currentExp = currentExp.startsWith("-") ?
                currentExp.slice(1) :
                "-" + currentExp;
            updateDisplay();
            return;
        }

        if (op === "%") {
            if (!currentExp) return;
            currentExp = (parseFloat(currentExp) / 100).toString();
            updateDisplay();
            return;
        }

        const last = currentExp.slice(-1);
        if (["+", "-", "*", "/"].includes(last)) {
            currentExp = currentExp.slice(0, -1);
        }

        currentExp += op;
        justCalculated = false;
        updateDisplay();
    };
});

// ==================================================
// MODE TOGGLE
// ==================================================
btnMain.onclick = () => {
    currentMode = "MAIN";
    pageMain.classList.remove("active");
    pageOther.classList.remove("native");
    btnMain.classList.add("mode-active");
    btnSection.classList.remove("mode-active");
};

btnSection.onclick = () => {
    currentMode = "SECTION";
    pageMain.classList.add("active");
    pageOther.classList.add("native");
    btnSection.classList.add("mode-active");
    btnMain.classList.remove("mode-active");
};

// ==================================================
// TRIG FUNCTIONS
// ==================================================
function sin(x) {
    return Math.sin(angleMode === "DEG" ? x * Math.PI / 180 : x);
}

function cos(x) {
    return Math.cos(angleMode === "DEG" ? x * Math.PI / 180 : x);
}

function tan(x) {
    const rad = angleMode === "DEG" ? x * Math.PI / 180 : x;
    if (Math.abs(Math.cos(rad)) < 1e-10) throw "TAN undefined";
    return Math.tan(rad);
}

// ==================================================
// CALCULATE
// ==================================================
function calculate() {
    try {
        if (!currentExp) return;

        let exp = currentExp
            // perkalian implisit
            .replace(/\)(?=[a-z])/g, ")*")
            .replace(/(\d)(?=[a-z])/g, "$1*")
            .replace(/\)(?=\d)/g, ")*")
            // simbol display
            .replace(/x/g, "*")
            .replace(/:/g, "/");

        const value = eval(exp);

        expression.textContent = formatDisplay(currentExp) + " =";

        // ===== CEK INFINITY & NaN =====
        if (!isFinite(value) || isNaN(value)) {
            result.textContent = "Tak Terdefinisi";
            currentExp = "";
            justCalculated = true;
            return;
        }

        const fixedValue = parseFloat(value.toFixed(9));
        result.textContent = fixedValue;

        currentExp = fixedValue.toString();
        justCalculated = true;

    } catch {
        result.textContent = "Error";
    }
}


// ==================================================
// GLOBAL BUTTON HANDLER (AMAN UNTUK DUPLIKAT)
// ==================================================
document.addEventListener("click", e => {
    const btn = e.target.closest(".btn, .num-btn");
    if (!btn) return;

    const text = btn.textContent.trim();

    // ===== EQUAL =====
    if (text === "=") return calculate();

    // ===== CLEAR =====
    if (text === "C") {
        currentExp = "";
        expression.textContent = "";
        result.textContent = "0";
        justCalculated = false;
        return;
    }

    // ===== BACKSPACE =====
    if (btn.querySelector("i")) {
        currentExp = currentExp.slice(0, -1);
        updateDisplay();
        return;
    }

    // ===== NUMBER =====
    if (/^\d$/.test(text)) {
        currentExp = justCalculated ? text : currentExp + text;
        justCalculated = false;
        updateDisplay();
        return;
    }

    // ===== DOT =====
    if (text === ".") {
        if (!currentExp.endsWith(".")) currentExp += ".";
        updateDisplay();
        return;
    }

    // ===== OPERATOR =====
    if (["+", "-", "x", ":"].includes(text)) {
        const op = text === "x" ? "*" : text === ":" ? "/" : text;
        if (["+", "-", "*", "/"].includes(currentExp.slice(-1))) {
            currentExp = currentExp.slice(0, -1);
        }
        currentExp += op;
        updateDisplay();
        return;
    }

    // ===== PLUS MINUS =====
    if (text === "+/-") {
        if (!currentExp) return;
        currentExp = currentExp.startsWith("-") ?
            currentExp.slice(1) :
            "-" + currentExp;
        updateDisplay();
        return;
    }

    // ===== PERCENT =====
    if (text === "%") {
        if (!currentExp) return;
        currentExp = (parseFloat(currentExp) / 100).toString();
        updateDisplay();
        return;
    }

    // ===== PARENTHESES =====
    if (text === "()") {
        const open = (currentExp.match(/\(/g) || []).length;
        const close = (currentExp.match(/\)/g) || []).length;
        currentExp += open > close ? ")" : "(";
        updateDisplay();
        return;
    }

    // ===== TRIG BUTTON =====
    if (["SIN", "COS", "TAN"].includes(text)) {
        if (justCalculated) currentExp = "";
        currentExp += text.toLowerCase() + "(";
        justCalculated = false;
        updateDisplay();
    }
});

// ==================================================
// SWITCH PAGE ⇄
// ==================================================
const switchPage = document.getElementById("switch-page");
if (switchPage) switchPage.onclick = () => btnMain.click();

// ==================================================
// KEYBOARD SUPPORT
// ==================================================
document.addEventListener("keydown", e => {
    if (/[0-9]/.test(e.key)) {
        currentExp += e.key;
        updateDisplay();
    }
    if (["+", "-", "*", "/"].includes(e.key)) {
        currentExp += e.key;
        updateDisplay();
    }
    if (e.key === ".") {
        if (!currentExp.endsWith(".")) currentExp += ".";
        updateDisplay();
    }
    if (e.key === "Enter" || e.key === "=") calculate();
    if (e.key === "Backspace") {
        currentExp = currentExp.slice(0, -1);
        updateDisplay();
    }
});
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// cek tema terakhir
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
    } else {
        localStorage.setItem("theme", "light");
        toggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
    }
});