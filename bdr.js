// Ambil elemen tampilan
const expression = document.getElementById('expression');
const result = document.getElementById('result');

let currentExp = "";
let justCalculated = false;

// Fungsi untuk menampilkan operator * sebagai × dan / sebagai :
function formatDisplay(exp) {
    return exp
        .replace(/\*/g, '×')
        .replace(/\//g, ' : ');
}

// Fungsi utama untuk memperbarui tampilan
function updateDisplay() {
    result.textContent = formatDisplay(currentExp) || "0";
}

// === TOMBOL ANGKA ===
document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.textContent.trim();

        // Jika tombol "=" ditekan
        if (val === '=') {
            try {
                const calc = eval(currentExp);
                expression.textContent = formatDisplay(currentExp) + " =";
                result.textContent = calc;
                currentExp = calc.toString();
                justCalculated = true;
            } catch {
                result.textContent = "Error";
            }
        }

        // Jika tombol "." ditekan
        else if (val === '.') {
            if (!currentExp.endsWith('.')) {
                currentExp += val;
            }
            updateDisplay();
            justCalculated = false;
        }

        // Tombol angka biasa
        else {
            if (justCalculated && !isNaN(val)) {
                currentExp = val;
            } else {
                currentExp += val;
            }
            updateDisplay();
            justCalculated = false;
        }
    });
});

// === TOMBOL OPERATOR ===
document.querySelectorAll('.btn[data-op]').forEach(op => {
    op.addEventListener('click', () => {
        let oper = op.getAttribute('data-op');

        // Ubah tanda +/-
        if (oper === '+/-') {
            if (currentExp) {
                try {
                    const num = parseFloat(eval(currentExp));
                    currentExp = (-num).toString();
                    updateDisplay();
                } catch {
                    result.textContent = "Error";
                }
            }
            return;
        }

        // Persen
        if (oper === '%') {
            if (currentExp) {
                try {
                    const num = parseFloat(eval(currentExp));
                    currentExp = (num / 100).toString();
                    updateDisplay();
                } catch {
                    result.textContent = "Error";
                }
            }
            return;
        }

        const lastChar = currentExp.slice(-1);

        // Jika operator ganda → hapus yang sebelumnya
        if (['+', '-', '*', '/'].includes(lastChar)) {
            currentExp = currentExp.slice(0, -1);
        }

        if (justCalculated) justCalculated = false;

        // Jika user klik tombol ":" → tambahkan "/" ke ekspresi
        if (oper === ':') {
            currentExp += '/';
        } else {
            currentExp += oper;
        }

        updateDisplay();
    });
});

// === CLEAR ===
document.getElementById('clear').addEventListener('click', () => {
    currentExp = "";
    expression.textContent = "";
    result.textContent = "0";
    justCalculated = false;
});

// === BACKSPACE ===
document.getElementById('back-delete').addEventListener('click', () => {
    if (!justCalculated) {
        currentExp = currentExp.slice(0, -1);
        updateDisplay();
    }
});

// === INPUT KEYBOARD ===
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Angka
    if (/[0-9]/.test(key)) {
        if (justCalculated) currentExp = "";
        currentExp += key;
        updateDisplay();
        justCalculated = false;
    }

    // Operator dasar
    else if (['+', '-', '*', '/'].includes(key)) {
        const lastChar = currentExp.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) return;
        currentExp += key;
        updateDisplay();
    }

    // Keyboard ":" menjadi pembagian
    else if (key === ':') {
        const lastChar = currentExp.slice(-1);
        if (!['+', '-', '*', '/'].includes(lastChar)) {
            currentExp += '/';
            updateDisplay();
        }
    }

    // Enter = hitung
    else if (key === 'Enter' || key === '=') {
        try {
            const calc = eval(currentExp);
            expression.textContent = formatDisplay(currentExp) + " =";
            result.textContent = calc;
            currentExp = calc.toString();
            justCalculated = true;
        } catch {
            result.textContent = "Error";
        }
    }

    // Backspace
    else if (key === 'Backspace') {
        currentExp = currentExp.slice(0, -1);
        updateDisplay();
    }

    // Escape untuk clear
    else if (key === 'Escape') {
        currentExp = "";
        expression.textContent = "";
        result.textContent = "0";
    }

    // Titik desimal
    else if (key === '.') {
        currentExp += '.';
        updateDisplay();
    }
});