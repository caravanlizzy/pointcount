function Graphics(manager) {
    this.manager = manager;
    this.pointDistanceTolerance = 11;
    this.colorPool = [
        '#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed',
        '#4f46e5', '#2563eb', '#0284c7', '#0891b2', '#0d9488',
        '#059669', '#16a34a', '#65a30d', '#ca8a04', '#d97706',
        '#ea580c', '#dc2626', '#b91c1c', '#991b1b', '#1e40af',
        '#3730a3', '#5b21b6', '#6b21a8', '#86198f', '#9f1239',
        '#115e59', '#065f46', '#166534', '#3f6212', '#854d0e',
        '#92400e', '#9a3412', '#7f1d1d', '#1e3a8a', '#312e81'
    ];
}

Graphics.prototype.init = function() {
    this.setupSliders();
    this.setupEventListeners();
    this.updateNumberBoxes();
};

Graphics.prototype.setupSliders = function() {
    const sliders = [
        { id: "image-visible-time", output: "imvi" },
        { id: "min-point-amount", output: "pumi" },
        { id: "max-point-amount", output: "puma" },
        { id: "series-image-amount", output: "anzbi" }
    ];

    sliders.forEach(s => {
        const el = document.getElementById(s.id);
        const out = document.getElementById(s.output);
        out.innerHTML = el.value;
        el.oninput = () => {
            out.innerHTML = el.value;
            this.updateNumberBoxes();
        };
    });
};

Graphics.prototype.setupEventListeners = function() {
    document.querySelector('.start-button-outside').onclick = () => {
        if (this.manager.startButtonState === 'idle') {
            this.manager.startSeries();
        }
    };
    document.getElementById('cancel-button').onclick = () => {
        this.manager.cancelSeries();
    };
};

Graphics.prototype.updateNumberBoxes = function() {
    const container = document.querySelector('.number-container');
    container.innerHTML = '';
    const minInput = document.getElementById("min-point-amount");
    const maxInput = document.getElementById("max-point-amount");
    
    if (!minInput || !maxInput) return;
    
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);

    for (let i = min; i <= max; i++) {
        const btn = document.createElement('div');
        btn.className = 'number-button';
        btn.textContent = i;
        btn.onclick = () => {
            if (this.manager.gameState === 'running') {
                this.manager.processUserInput(i, btn);
            }
        };
        container.appendChild(btn);
    }
};

Graphics.prototype.animateStartButton = function(callback) {
    const button = document.querySelector('.start-button-outside');
    document.querySelector('.start-button-container').style.display = 'block';
    
    let count = 3;
    button.textContent = count;
    this.manager.audio.playTick();
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            button.textContent = count;
        } else if (count === 0) {
            button.textContent = 'LOS';
        } else {
            clearInterval(interval);
            document.querySelector('.start-button-container').style.display = 'none';
            callback();
        }
    }, 1000);
};

Graphics.prototype.generatePoints = function(amount) {
    const parent = document.getElementById('point-container');
    const positions = this.createDistinctPositions(amount);
    const color = this.colorPool[Math.floor(Math.random() * this.colorPool.length)];

    positions.forEach(pos => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = pos.left + '%';
        dot.style.top = pos.top + '%';
        dot.style.backgroundColor = color;
        parent.appendChild(dot);
    });
};

Graphics.prototype.deletePoints = function() {
    document.querySelectorAll('.dot').forEach(e => e.remove());
};

Graphics.prototype.createDistinctPositions = function(amount) {
    const positions = [];
    const border = 5;
    let attempts = 0;

    while (positions.length < amount && attempts < 500) {
        const newP = {
            left: Math.random() * (100 - border * 2 - 7) + border,
            top: Math.random() * (100 - border * 2 - 7) + border
        };

        const tooClose = positions.some(p => {
            const dx = p.left - newP.left;
            const dy = p.top - newP.top;
            return Math.sqrt(dx * dx + dy * dy) < this.pointDistanceTolerance;
        });

        if (!tooClose) {
            positions.push(newP);
        }
        attempts++;
    }
    return positions;
};

Graphics.prototype.updateProgressBar = function(percentage) {
    const bar = document.querySelector('#progress-current');
    bar.style.width = percentage + '%';
    if (percentage === 100) {
        bar.textContent = `Fertig! ${Math.floor(this.manager.statistics.getCorrectsRoundPercentage())}% richtig.`;
    }
};

Graphics.prototype.updateFeedback = function(text, isCorrect, pointAmount, guessElement) {
    const feedback = document.querySelector('#feedback');
    const extra = document.querySelector('#feedback-extra');
    
    feedback.style.display = 'block';
    feedback.className = 'feedback-container feedback-text';
    feedback.textContent = text;
    
    if (guessElement) {
        guessElement.classList.add(isCorrect ? 'num-pressed-correct' : 'num-pressed-wrong');
    }

    if (!isCorrect) {
        extra.style.display = 'block';
        extra.className = 'feedback-container feedback-extra';
        extra.textContent = `Richtig waren: ${pointAmount} Punkte.`;
    } else {
        extra.style.display = 'none';
        extra.textContent = '';
    }
};

Graphics.prototype.clearImage = function() {
    this.deletePoints();
    this.showHint(false);
    document.querySelectorAll('.feedback-container').forEach(e => {
        e.style.display = 'none';
        e.textContent = '';
    });
    document.querySelectorAll('.number-button').forEach(btn => {
        btn.classList.remove('num-pressed-correct', 'num-pressed-wrong');
    });
};

Graphics.prototype.resetSeries = function() {
    const bar = document.querySelector('#progress-current');
    bar.style.width = '0%';
    bar.textContent = '';
    this.clearImage();
    this.showStartButton();
    this.showCancelButton(false);
    this.updateNumberBoxes();
};

Graphics.prototype.showStartButton = function() {
    const btn = document.querySelector('.start-button-outside');
    btn.textContent = 'Start';
    document.querySelector('.start-button-container').style.display = 'block';
};

Graphics.prototype.showCancelButton = function(show) {
    document.getElementById('cancel-button').style.display = show ? 'block' : 'none';
};

Graphics.prototype.showHint = function(show) {
    document.getElementById('interaction-hint').style.display = show ? 'block' : 'none';
};

Graphics.prototype.openNav = function() {
    document.getElementById("mySidenav").style.width = "250px";
};

Graphics.prototype.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
};


