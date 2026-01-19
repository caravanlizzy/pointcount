function Manager(){
	this.audio = new AudioManager();
	this.graphics = new Graphics(this);
	this.statistics = new Statistics();
	this.resetGameState();
	this.graphics.init();
}

Manager.prototype.resetGameState = function(){
	this.gameState = 'idle'; 
	this.startButtonState = 'idle';
	this.finishedImages = 0;
	this.userGuess = null;
	this.pointAmount = null;
	this.visibleTime = 1500;
	this.imageAmount = 6;
	this.minPoints = 1;
	this.maxPoints = 8;
	this.timeToNextImage = 2000;
	this.timeBeforeInteraction = 4000;
}

Manager.prototype.loadInputSettings = function(){
	this.visibleTime = document.querySelector('#image-visible-time').value * 1000;
	this.imageAmount = parseInt(document.querySelector('#series-image-amount').value);
	this.minPoints = parseInt(document.querySelector('#min-point-amount').value);
	this.maxPoints = parseInt(document.querySelector('#max-point-amount').value);
}

Manager.prototype.startSeries = function(){
	this.loadInputSettings();
	this.graphics.resetSeries();
	this.statistics.resetSeriesStats(this.imageAmount);
	this.gameState = 'waiting';
	this.startButtonState = 'busy';
	this.graphics.showCancelButton(true);
	this.finishedImages = 0;
	this.graphics.animateStartButton(() => {
		this.gameState = 'running';
		this.processOneImage();
	});
}

Manager.prototype.cancelSeries = function(){
	this.resetGameState();
	this.graphics.resetSeries();
}

Manager.prototype.processOneImage = function(){
	if(this.gameState === 'running'){
		this.pointAmount = this.getRandomInt(this.minPoints, this.maxPoints);
		this.graphics.clearImage();
		this.graphics.showHint(false);
		this.graphics.generatePoints(this.pointAmount);
		this.audio.playAppear();
		setTimeout(() => {
			if (this.gameState === 'running') {
				this.graphics.deletePoints();
				this.audio.playDisappear();
				this.graphics.showHint(true);
			}
		}, this.visibleTime);
	}
}

Manager.prototype.processUserInput = function(guess, guessElement){
	if (this.gameState !== 'running') return;
	this.gameState = 'waiting';
	this.userGuess = guess;
	
	const isCorrect = (this.userGuess === this.pointAmount);
	if (isCorrect) {
		this.audio.playCorrect();
	} else {
		this.audio.playWrong();
	}
	this.finishedImages++;
	this.statistics.updateStats(isCorrect);
	
	const percentage = (this.finishedImages / this.imageAmount) * 100;
	this.graphics.updateProgressBar(percentage);
	
	const feedback = this.generateFeedback(isCorrect);
	this.graphics.updateFeedback(feedback, isCorrect, this.pointAmount, guessElement);
	this.graphics.deletePoints();

	const isFinished = this.finishedImages === this.imageAmount;
	setTimeout(() => {
		if (isFinished) {
			this.endSeries();
		} else {
			this.gameState = 'running';
			this.processOneImage();
		}
	}, this.timeToNextImage);
}

Manager.prototype.generateFeedback = function(isCorrect){
	const correct = [
		'Wow, super!', 
		'Volltreffer!', 
		'Spitzenmäßig!', 
		'Richtig, sehr gut!', 
		'Richtig, weiter so!', 
		'Genau getroffen!', 
		'Toll gemacht!',
		'Stark!', 
		'Wunderbar!', 
		'Klasse Leistung!',
		'Einfach perfekt!',
		'Du bist ein Naturtalent!',
		'Hervorragend!'
	];
	const wrong = [
		'Fast geschafft, bleib dran!', 
		'Knapp daneben, aber ein guter Versuch!', 
		'Du bist nah dran, beim nächsten Mal klappt es!', 
		'Guter Versuch, gleich noch mal!',
		'Das war fast richtig, weiter so!',
		'Nicht ganz, aber dein Gefühl ist gut!',
		'Knapp! Du wirst immer besser!',
		'Schade, aber fast erwischt!'
	];
	const list = isCorrect ? correct : wrong;
	return list[this.getRandomInt(0, list.length - 1)];
}

Manager.prototype.endSeries = function(){
	this.gameState = 'idle';
	this.startButtonState = 'idle';
	this.graphics.clearImage();
	this.graphics.showStartButton();
	this.graphics.showCancelButton(false);
	
	if (this.statistics.roundCorrect === this.statistics.roundTotal) {
		this.audio.playSuccess();
	}
}

Manager.prototype.getRandomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
