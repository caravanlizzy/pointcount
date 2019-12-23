function statistics(){
	this.globalCorrect = 0;
	this.roundCorrect = 0;
	this.total = 0;
	this.roundTotal = 0;
}

statistics.prototype.updateStats = function(result){
	if(result){
		this.globalCorrect += 1;
		this.roundCorrect += 1;
	}
	this.total += 1;
}

statistics.prototype.getCorrectsPercentage = function(){
	return this.globalCorrect/this.total*100;
}

statistics.prototype.getCorrectsRoundPercentage = function(){
	return this.roundCorrect/this.roundTotal*100;
}

statistics.prototype.resetSeriesStats = function(roundTotal){
	this.roundTotal = roundTotal;
	this.roundCorrect = 0;
}
