class TimerApp {
    constructor() {
        // Elementos del DOM
        this.elMainTime = document.getElementById('time-main');
        this.elMsTime = document.getElementById('time-ms');
        this.btnStart = document.getElementById('btn-start');
        this.btnClear = document.getElementById('btn-clear');
        this.tabs = document.querySelectorAll('.tab');
        this.countdownSetup = document.getElementById('countdown-setup');
        
        // Inputs de Countdown
        this.inH = document.getElementById('input-h');
        this.inM = document.getElementById('input-m');
        this.inS = document.getElementById('input-s');

        // Estado
        this.mode = 'stopwatch'; // 'stopwatch' | 'countdown'
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0; // Tiempo acumulado
        this.targetTime = 0;  // Para el countdown
        this.animationFrameId = null;

        this.initEvents();
    }

    initEvents() {
        this.btnStart.addEventListener('click', () => this.toggleStartPause());
        this.btnClear.addEventListener('click', () => this.clearTimer());
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchMode(e.currentTarget.dataset.mode));
        });
    }

    switchMode(newMode) {
        if (this.isRunning) return; // Evita cambiar de modo si está corriendo
        
        this.mode = newMode;
        this.clearTimer();

        // Actualizar UI de pestañas
        this.tabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-mode="${newMode}"]`).classList.add('active');

        // Mostrar/Ocultar inputs
        if (newMode === 'countdown') {
            this.countdownSetup.classList.add('visible');
            document.body.style.backgroundColor = 'var(--bg-countdown)';
        } else {
            this.countdownSetup.classList.remove('visible');
            document.body.style.backgroundColor = 'var(--bg-stopwatch)';
        }
    }

    toggleStartPause() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    start() {
        // Lógica de inicio para Countdown
        if (this.mode === 'countdown' && this.elapsedTime === 0) {
            const h = parseInt(this.inH.value || 0) * 3600000;
            const m = parseInt(this.inM.value || 0) * 60000;
            const s = parseInt(this.inS.value || 0) * 1000;
            this.targetTime = h + m + s;

            if (this.targetTime <= 0) {
                alert("Por favor establece un tiempo válido para el Countdown.");
                return;
            }
        }

        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.btnStart.textContent = 'Pausar';
        
        // Bloquear inputs durante el conteo
        this.toggleInputs(true);

        const tick = () => {
            this.updateDisplay();
            if (this.isRunning) {
                this.animationFrameId = requestAnimationFrame(tick);
            }
        };
        this.animationFrameId = requestAnimationFrame(tick);
    }

    pause() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.btnStart.textContent = 'Continuar';
    }

    clearTimer() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.elapsedTime = 0;
        this.targetTime = 0;
        this.btnStart.textContent = 'Iniciar';
        
        this.toggleInputs(false);
        this.renderTime(0);
    }

    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;

        if (this.mode === 'countdown') {
            let remaining = this.targetTime - this.elapsedTime;
            if (remaining <= 0) {
                remaining = 0;
                this.pause();
                this.btnStart.textContent = 'Iniciar';
                this.elapsedTime = 0;
            }
            this.renderTime(remaining);
        } else {
            this.renderTime(this.elapsedTime);
        }
    }

    renderTime(msTotal) {
        const ms = Math.floor(msTotal % 1000);
        const totalSeconds = Math.floor(msTotal / 1000);
        const s = totalSeconds % 60;
        const m = Math.floor(totalSeconds / 60) % 60;
        const h = Math.floor(totalSeconds / 3600);

        const pad = (num, size = 2) => num.toString().padStart(size, '0');

        this.elMainTime.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        this.elMsTime.textContent = `.${pad(ms, 3)}`;
    }

    toggleInputs(disabled) {
        this.inH.disabled = disabled;
        this.inM.disabled = disabled;
        this.inS.disabled = disabled;
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new TimerApp();
});