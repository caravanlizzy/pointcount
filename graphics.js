function graphics(){
	this.pointDistanceTolerance = 11;
	this.colorPool = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
}

graphics.prototype.createRandomPointPosition = function(){
    let borderTolerance = 3;
	let left = this.getRandomNumber(borderTolerance, 100 - borderTolerance - 6);
 	let top = this.getRandomNumber(borderTolerance, 100 - borderTolerance - 6);
	let position = {left:left, top:top};
	return position;	
}

graphics.prototype.animateStartButton = function(){
	let button = document.querySelector('.start-button-outside');
	let buttonContainer = document.querySelector('.start-button-container');
	this.setDisplayBlock(buttonContainer);
	let timestep = 1000;
	let self = this;
	button.innerHTML = '3';
	setTimeout(function(){
		button.innerHTML = '2';
	}, timestep);
	setTimeout(function(){
		button.innerHTML = '1';
	}, timestep*2);
	setTimeout(function(){
		button.innerHTML = 'LOS';
	}, timestep*3);
	setTimeout(function(){
		self.hideStartButton();
	}, timestep*4);
}



graphics.prototype.makeInvisible = function(element){
	element.style.visibility = 'hidden';
}

graphics.prototype.makeVisible = function(element){
	element.style.visibility = 'visible';
}

graphics.prototype.setDisplayNone = function(element){
	element.style.display = 'none';
}

graphics.prototype.showStartButton = function(){
	let startButton = document.querySelector('.start-button-container');
	startButton.style.display = 'block';	
}

graphics.prototype.hideStartButton = function(){
	let startButton = document.querySelector('.start-button-container');
	startButton.style.display = 'none';	
}

graphics.prototype.setDisplayBlock = function(element){
	element.style.display = 'block';
}

graphics.prototype.getRandomNumber = function(low, high){
	let gap = high-low;
	let rndNum = Math.random();
	let num = gap*rndNum + low;
	return num;
}

graphics.prototype.drawPoint = function(position, parent, color){
	let point = document.createElement('div');
	point.classList.add('dot');
	point.style.left = position.left + '%';
	point.style.top = position.top + '%';
	point.style.backgroundColor = color;
	parent.appendChild(point);
}




graphics.prototype.generatePoints = function(){
	let amount = this.manager.pointAmount;
    let parent = document.getElementById('point-container');
    this.deletePoints();
	let positions = this.createDistinctPositions(amount);
	let color = this.drawNewColor();
	for(let i = 0; i < amount; i++){
		this.drawPoint(positions[i], parent, color);
	}
}

graphics.prototype.deletePoints = function(){
	let parent = document.getElementById('point-container');
	document.querySelectorAll('.dot').forEach(e => e.remove());
}

graphics.prototype.createDistinctPositions = function(amount){ /*return an array with #amount of points that all have the minimal required distance (pointDistanceToleranc) to all the other points  */
	let positions = [];
	let p1 = this.createRandomPointPosition();
	positions.push(p1);
	while(positions.length != amount){
		let newP = this.createRandomPointPosition();
		let distances = this.getDistances(positions, newP);
		if(Math.min(...distances) > this.pointDistanceTolerance){
			positions.push(newP);
		}
	}
	return positions;
}

graphics.prototype.getRandomElement = function(list){
	let len = list.length;
	let randInt = Math.floor(Math.random()*(len));
	return list[randInt];	
}


graphics.prototype.getDistances = function(allPoints, singlePoint){ // returns distances from one point to all the other points
	let distances = [];
	let pointsAmount = allPoints.length;
	for(let i = 0; i < pointsAmount; i++){
		let distance = this.getDistance(allPoints[i], singlePoint)
		distances.push(distance);
	}
	return distances;
}

graphics.prototype.getDistance = function(p1, p2){ //returns distance of two points
	let d1 = p1.left - p2.left;
	let d2 = p1.top - p2.top;
	let distance = Math.sqrt(Math.pow(d1,2) + Math.pow(d2,2));
	return distance;
}



/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
graphics.prototype.openNav = function () {
  document.getElementById("mySidenav").style.width = "200px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
graphics.prototype.closeNav = function() {
  document.getElementById("mySidenav").style.width = "0";
} 

graphics.prototype.drawNewColor = function(){
	let color = this.getRandomElement(this.colorPool);
	this.colorPool.splice(this.colorPool.indexOf(color), 1 );
	return color;
}



graphics.prototype.createNumberBox = function(number, parent){
	let newBox = document.createElement('div');
	newBox.classList.add('number-button');
	newBox.innerHTML = number + '';
	let manager = this.manager;
	newBox.addEventListener('click', function(){
		if(manager.gameState == 'running'){
			manager.setUserGuess(number, this);
			manager.processUserInput();
			
		}
	});
	parent.appendChild(newBox);
}

graphics.prototype.drawAllNumberBoxes = function(){
	let numContainer = document.querySelector('.number-container');
	this.deleteAllNumberBoxes();
	let minPoints = this.manager.getMinPoints();
	let maxPoints = this.manager.getMaxPoints();
	for(let i = minPoints; i <= maxPoints ; i++){
		this.createNumberBox(i, numContainer);
	}
}

graphics.prototype.unpressNumButton = function(){
	let numContainer = document.querySelector('.number-container');
	for(let i = 0; i < numContainer.children.length; i++){
		numContainer.children[i].classList.remove('num-pressed-correct');	
		numContainer.children[i].classList.remove('num-pressed-wrong');	
	}
}

graphics.prototype.deleteAllSelectorChildren = function(selectorName, parent){
	document.querySelectorAll(selectorName + '').forEach(e => e.remove());
}

graphics.prototype.deleteAllNumberBoxes = function(){
	let numContainer = document.querySelector('.number-container');
	this.deleteAllSelectorChildren('.number-button', numContainer);
}

graphics.prototype.updateProgressBar = function(width){
	let bar = document.querySelector('#progress-current');
	bar.style.width = width + '%';
	if(width == 100){
		bar.innerHTML = 'Stark! ' + Math.floor(this.manager.statistics.getCorrectsRoundPercentage()) + '% richtig.';
	}
}


graphics.prototype.updateFeedback = function(sentence, correct, pointAmount){
	this.showFeedbackDisplay();
	let feedback = document.querySelector('#feedback');
	feedback.classList.add('feedback-text');
	feedback.innerHTML = sentence;
	if(correct == false){
		this.setNumButtonClass('num-pressed-wrong');
		let feedbackExtra = document.querySelector('#feedback-extra');
		feedbackExtra.classList.add('feedback-extra');
		feedbackExtra.innerHTML = 'Richtig waren: ' + pointAmount + ' Punkte.';
	}
	else{
		this.setNumButtonClass('num-pressed-correct');
	}
}

graphics.prototype.setNumButtonClass = function(className){
	this.manager.getUserGuessElement().classList.add(className);
}

graphics.prototype.clearFeedback = function(){
	document.querySelector('#feedback').innerHTML = '';
	document.querySelector('#feedback-extra').innerHTML = '';
}

graphics.prototype.resetSeries = function(){
	// console.log(document.querySelector('#max-point-amount').value);
	// this.manager.setMinPoints(document.querySelector('#min-point-amount').value);
	// this.manager.setMaxPoints(document.querySelector('#max-point-amount').value);
	document.querySelector('#progress-current').innerHTML = '';
	this.hideFeedbackDisplay();
	this.updateProgressBar(0);
	this.clearFeedback();
	this.unpressNumButton();
	this.showStartButton();
	this.updateNumberBoxes();
}

graphics.prototype.clearImage = function(){
		this.unpressNumButton();
		this.clearFeedback();
		this.hideFeedbackDisplay();
}

graphics.prototype.moveTimeBar = function(maxTime){
	let stepTime = maxTime*10;
	let timeBar = document.querySelector('#time-current');
	let self = this;
	let id = setInterval(function(){
		self.stepTimeBar(id);
		}, stepTime);
}

graphics.prototype.stepTimeBar = function(intervalId){
	let progressWidth = document.querySelector('#time-current').style.width;
	let progress = progressWidth.substring(-1, progressWidth.length - 1);
	if(progress == 100){
		clearInterval(intervalId);
	}
	else{
		progress++;
		this.updateTimeBar(progress);
	}
}

graphics.prototype.fillTimeBar = function(){
	let progressWidth = document.querySelector('#time-current').style.width;
	progressWidth = 100 + '%';
}

graphics.prototype.resetTimeBar = function(){
	document.querySelector('#time-current').style.width = 0 + '%';
}

graphics.prototype.updateTimeBar = function(width){
	let progress = document.querySelector('#time-current');
	progress.style.width = width + '%';
}


graphics.prototype.updateNumberBoxes = function(){
	this.drawAllNumberBoxes();
}

graphics.prototype.setStartButtonEvent = function(){
	let startButton = document.querySelector('.start-button-outside');
	let self = this;
	startButton.addEventListener('click', function(){
		if(self.manager.startButtonState == 'idle'){
			self.manager.startSeries();
		}
	});
}

graphics.prototype.hideFeedbackDisplay = function(){
	let e = document.querySelectorAll('.feedback-container');
	for(let i = 0; i < e.length; i++){
		e[i].style.display = 'none';
	}
}

graphics.prototype.showFeedbackDisplay = function(){
	let e = document.querySelectorAll('.feedback-container');
	for(let i = 0; i < e.length; i++){
		e[i].style.display = 'block';
	}
}


graphics.prototype.activateSlider = function(){
	var timeSlider = document.getElementById("image-visible-time");
	var timeOutput = document.getElementById("imvi");
	timeOutput.innerHTML = timeSlider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
    timeSlider.oninput = function() {
		timeOutput.innerHTML = this.value;
	} 	
	
	var timeSlider2 = document.getElementById("min-point-amount");
	var timeOutput2 = document.getElementById("pumi");
	timeOutput2.innerHTML = timeSlider2.value; 
    timeSlider2.oninput = function() {
		timeOutput2.innerHTML = this.value;
	} 	
	
	var timeSlider3 = document.getElementById("max-point-amount");
	var timeOutput3 = document.getElementById("puma");
	timeOutput3.innerHTML = timeSlider3.value; 
    timeSlider3.oninput = function() {
		timeOutput3.innerHTML = this.value;
	} 
	
	var timeSlider4 = document.getElementById("series-image-amount");
	var timeOutput4 = document.getElementById("anzbi");
	timeOutput4.innerHTML = timeSlider4.value;
    timeSlider4.oninput = function() {
		timeOutput4.innerHTML = this.value;
	} 
}


graphics.prototype.activateMaxPointsResponse = function(){
	let newMax = document.querySelector('#max-point-amount');
	let self = this;
		newMax.addEventListener("input", function(){
			let oldMin = self.manager.getMinPoints();
			let newMaxValue = parseInt(newMax.value);
			if(newMaxValue > oldMin && newMaxValue < 100){
				self.manager.setMaxPoints(newMaxValue);
				self.updateNumberBoxes();
		}
	});
}

graphics.prototype.activateMinPointsResponse = function(){
	let newMin = document.querySelector('#min-point-amount');
	let self = this;
		newMin.addEventListener("input", function(){
			let oldMax = self.manager.getMaxPoints();
			let newMinValue = parseInt(newMin.value);
			if(newMinValue < oldMax){
				self.manager.setMinPoints(newMinValue);
				self.updateNumberBoxes();
		}
	});
}

graphics.prototype.initGraphics = function(){
	// this.activateSliderInputResponse();
	this.activateSlider();
	this.activateMinPointsResponse();
	this.activateMaxPointsResponse();
	this.setStartButtonEvent();
	this.hideFeedbackDisplay();
	
}


