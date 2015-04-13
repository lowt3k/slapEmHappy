/**
Project: SlapEm Happy
File: Intermission.js
Date: March 30, 2015
By: Scott Henley
Description:
Simple point and click target style game. Make the unhappy targets happy before the level ends.
**/

var SlapEmHappy = SlapEmHappy || {}; // create SlapEmHappy namespace

SlapEmHappy.Intermission = function() {};

SlapEmHappy.Intermission.prototype = {
  
  init: function(score, level, targetTotal, targetFrameLimit) {
    this.playerScore = score;    
    
    this.level = level;
    
    this.targetsTotal = targetTotal;
    
    this.targetFrameLimit = targetFrameLimit;
    
//    this.targetMinFrame = targetMinFrame;
//    this.targetMaxFrame = targetMaxFrame;
  }, // end of init function
  
  /**
  preload: function() {
  }, // end of preload function
  **/
  create: function() {
    
    this.coolDownTimer = 0; // timer for cool down period between each gameplay level
    this.coolDownDuration = 4; // the lenght of the cool down period
    this.coolDownStartTime = this.game.time.totalElapsedSeconds(); // when the cool down period started
    
    var hudTextStyle = { font: "144px Arial", fill: "#dddddd", align: "center" };
    
    this.coolDownTimerText = this.game.add.text(this.game.width / 2, this.game.height / 2, this.level, hudTextStyle); 
    this.coolDownTimerText.anchor.set(0.5);
  }, // end of create function

  update: function() {
    this.coolDownTimer = this.coolDownDuration - (this.game.time.totalElapsedSeconds() - this.coolDownStartTime); // level timer    
    
    if (this.coolDownTimer <= 4 && this.coolDownTimer >= 2) {
      this.coolDownTimerText.text = this.coolDownTimer.toFixed(0) - 1;
    } else if (this.coolDownTimer <= 1) {
      this.coolDownTimerText.text = "GO";
    }
    
    //this.coolDownTimerText.text.toString
    
    if (this.coolDownTimer <= 0) { 
      this.game.state.start('GameLoop', true, false, this.playerScore, this.level, this.targetsTotal, this.targetFrameLimit);
    }
  }, // end of update function

  render: function() {
//    this.debugInfo(); // call the debug info function
  }, // end of render function
  
  // --== My Functions ==-- //
  debugInfo: function() {
    // --== Debug Info ==-- //
    this.game.debug.text('Player\'s Score: ' + this.playerScore, 16, 16); // display player's score
    this.game.debug.text('Level: ' + this.level, 16, 32); // display current level achieved
    this.game.debug.text('Time: ' + this.game.time.totalElapsedSeconds().toFixed(3), 16, 48); // display time
    this.game.debug.text('Cool Down Timer: ' + this.coolDownTimer.toFixed(3), 16, 64); // display level time
    this.game.debug.text('Targets Total: ' + this.targetsTotal, 16, 80); // empty debug text line
    this.game.debug.text('-', 16, 96); // empty debug text line    
    this.game.debug.text('-', 16, 112); // display name of the target hit
    this.game.debug.text('Target Frame Limit: '  + this.targetFrameLimit, 16, 128); // display the current frame of the target hit
    this.game.debug.text('-', 16, 144); // display how many hits on the target hit
    this.game.debug.text('-', 16, 160); // empty debug text line
    this.game.debug.text('-', 16, 176); // empty debug text line
    this.game.debug.text('-', 16, 192); // empty debug text line
    this.game.debug.text('-', 16, 208); // display total number of targets    
    this.game.debug.text('-', 16, 224); // display the array of hits on all the targets
    // --== End of Debug Info ==-- //
  }, // end of debugInfo function
  // --== End of My Functions ==--//
};