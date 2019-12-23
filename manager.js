function manager(){
	this.initGraphics();
	this.loadInputSettings();
    this.finishedImages = 0;  //wieviele bilder schongesehen
	this.userGuess = null;
    this.pointAmount = null;
	this.timeToNextImage = 2000;
	this.gameState = 'idle'; //idle, running, waiting
	this.ageMode = 'child'; // children, adult, fun
	this.lastFeedback = '';
	this.timeBeforeInteraction = 5000;
	this.startButtonState = 'idle'; //idle busy
	this.graphics.updateNumberBoxes();
}


	
manager.prototype.resetSeriesSettings = function(){
	this.loadInputSettings();
	this.graphics.resetSeries();
	this.statistics.resetSeriesStats(this.imageAmount);
	this.setGameState('waiting');
	this.setStartButtonState('busy');
	this.finishedImages = 0;
	this.graphics.animateStartButton();
}


manager.prototype.startSeries = function(){
	this.resetSeriesSettings();
	let self = this;
	setTimeout(function(){
		self.setGameState('running');
		self.processOneImage();
		}, self.timeBeforeInteraction);
}

manager.prototype.processOneImage = function(){
	if(this.gameState == 'running'){
		this.determinePointAmount();
		this.graphics.clearImage();
		this.graphics.generatePoints();
		let self = this;
		let timer = this.visibleTime;
		setTimeout(function(){self.roundTimeOut()},timer);
	}
}

manager.prototype.roundTimeOut = function(){
	this.graphics.deletePoints();
}

manager.prototype.determinePointAmount = function(){
	this.pointAmount = this.getRandomInt(this.minPoints, this.maxPoints);
}


manager.prototype.processUserInput = function(){
	this.setGameState('waiting');
	let inputResult = (this.userGuess == this.pointAmount);
	this.finishedImages += 1;
	let percentage = this.finishedImages/this.imageAmount*100;
	this.statistics.updateStats(inputResult);
	this.graphics.updateProgressBar(percentage);
	let feedback = this.generateFeedbackWords(inputResult);
	this.graphics.updateFeedback(feedback, inputResult, this.pointAmount);
	this.graphics.deletePoints();
	if(this.finishedImages == this.imageAmount){
		let self = this;
		setTimeout(function(){
			self.resetGameState()}, self.timeToNextImage);
	}
	else{
		let self = this;
		setTimeout(function(){
			self.setGameState('running');
			self.processOneImage();
		}, self.timeToNextImage);
	}
}




manager.prototype.generateFeedbackWords = function(result){
	let feedback = '';
	let correct = '';
	let wrong = '';
	if(this.ageMode == 'child'){
		correct = ['Wow, super!', 'Volltreffer!', 'Super!', 'Richtig, sehr gut!', 'Richtig, weiter so!', 'Genau!', 'Spitzenmäßig!', 'Toll!', 'Stark!', 'Wunderbar!', 'Klasse!'];
		wrong = ['Nahe dran, weiter so!', 'Fast, du bist gut!', 'Gut, da fehlt nicht viel!', 'Das war knapp!'];
	}
	if(result){
		let randomInt = this.getRandomInt(0, correct.length - 1);
		feedback = correct[randomInt];
	}
	else{
		let randomInt = this.getRandomInt(0, wrong.length - 1);
		feedback = wrong[randomInt];
	}	
	return feedback;
}

manager.prototype.resetGameState = function(){
	this.setStartButtonState('idle');
	this.setGameState('idle');;
	this.imageAmount = 0;
	this.graphics.clearImage();
	this.graphics.showStartButton();
}

manager.prototype.initGraphics = function(){
	this.graphics = new graphics();
	this.statistics = new statistics();
	this.graphics.manager = this;
	this.graphics.initGraphics();
}

manager.prototype.setMinPoints = function(minPoints){
	this.minPoints = minPoints;
}

manager.prototype.setMaxPoints = function(maxPoints){
	this.maxPoints = maxPoints;
}

manager.prototype.getMaxPoints = function(){
	return this.maxPoints;
}

manager.prototype.getMinPoints = function(){
	return this.minPoints;
}

manager.prototype.setAgeMode = function(ageMode){
	this.ageMode = ageMode;
}

manager.prototype.readInputAgeMode = function(){
	this.ageMode = document.querySelector('#ageMode-selection').value;
}


manager.prototype.setGameState = function(state){
	this.gameState = state;
}

manager.prototype.setStartButtonState = function(state){
	this.startButtonState = state;
}


manager.prototype.getRandomInt = function(lowest, highest){
    let randInt = Math.floor(Math.random() * (highest - lowest + 1)) + lowest;
    return randInt;
}

manager.prototype.getUserGuess = function(){
	return this.userGuess;
}

manager.prototype.getUserGuessElement = function(){
	return this.userGuessElement;
}

manager.prototype.setUserGuess = function(guess, e){
	this.userGuess = guess;
	this.userGuessElement = e;
}


manager.prototype.loadInputSettings = function(){
	this.visibleTime = document.querySelector('#image-visible-time').value * 1000;
	this.imageAmount = parseInt(document.querySelector('#series-image-amount').value);
	this.minPoints = parseInt(document.querySelector('#min-point-amount').value);
	this.maxPoints = parseInt(document.querySelector('#max-point-amount').value);
}
