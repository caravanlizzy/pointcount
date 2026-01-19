function Statistics(){
	this.globalCorrect = 0;
	this.roundCorrect = 0;
	this.total = 0;
	this.roundTotal = 0;
}

Statistics.prototype.updateStats = function(result){
	if(result){
		this.globalCorrect += 1;
		this.roundCorrect += 1;
	}
	this.total += 1;
}

Statistics.prototype.getCorrectsPercentage = function(){
	return (this.total === 0) ? 0 : (this.globalCorrect / this.total * 100);
}

Statistics.prototype.getCorrectsRoundPercentage = function(){
	return (this.roundTotal === 0) ? 0 : (this.roundCorrect / this.roundTotal * 100);
}

Statistics.prototype.resetSeriesStats = function(roundTotal){
	this.roundTotal = roundTotal;
	this.roundCorrect = 0;
}
