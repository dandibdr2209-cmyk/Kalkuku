// Ambil elemen tampilan
const expression = document.getElementById('expression');
const result = document.getElementById('result');

let currentExp = "";
let justCalculated = false;

// Fungsi untuk menampilkan operator * sebagai ×
function formatDisplay(exp) {
    return exp.replace(/\*/g, '×');
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
                // Evaluasi ekspresi
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

        // Tombol angka normal
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
        const oper = op.getAttribute('data-op');

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

        // Operator matematika umum
        const lastChar = currentExp.slice(-1);

        // Cegah operator ganda
        if (['+', '-', '*', '/'].includes(lastChar)) {
            currentExp = currentExp.slice(0, -1);
        }

        if (justCalculated) justCalculated = false;

        currentExp += oper; // tetap simpan "*" (bukan ×)
        updateDisplay();
    });
});

// === TOMBOL CLEAR (C) ===
document.getElementById('clear').addEventListener('click', () => {
    currentExp = "";
    expression.textContent = "";
    result.textContent = "0";
    justCalculated = false;
});

// === TOMBOL BACKSPACE (←) ===
document.getElementById('back-delete').addEventListener('click', () => {
    if (!justCalculated) {
        currentExp = currentExp.slice(0, -1);
        updateDisplay();
    }
});

// === DUKUNG INPUT KEYBOARD ===
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (/[0-9]/.test(key)) {
        if (justCalculated) currentExp = "";
        currentExp += key;
        updateDisplay();
        justCalculated = false;
    }

    else if (['+', '-', '*', '/'].includes(key)) {
        const lastChar = currentExp.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) return;

        currentExp += key;  // tetap gunakan "*"
        updateDisplay();
    }

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

    else if (key === 'Backspace') {
        currentExp = currentExp.slice(0, -1);
        updateDisplay();
    }

    else if (key === 'Escape') {
        currentExp = "";
        expression.textContent = "";
        result.textContent = "0";
    }

    else if (key === '.') {
        currentExp += '.';
        updateDisplay();
    }
});
