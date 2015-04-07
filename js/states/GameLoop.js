/**
Project: SlapEm Happy
File: GameLoop.js
Date: March 27, 2015
By: Scott Henley
Description:
Simple point and click target style game. Make the unhappy targets happy before the level ends.
**/

var SlapEmHappy = SlapEmHappy || {}; // create SlapEmHappy namespace

SlapEmHappy.GameLoop = function() {};

SlapEmHappy.GameLoop.prototype = {
  /**
  preload: function() {
  }, // end of preload function
  **/
  create: function() {
    level++; // increase the level by one
    
    this.temp; // temp variable for debug 
    
    this.levelTimer = this.game.time.create(true); // create a level timer
    this.levelTimer.add(Phaser.Timer.SECOND * 30, function () { this.game.state.start('Intermission'); }, this); // add 5 seconds to the level timer
    
    this.targetsHitArray = []; // array for holding the hits for each target
    
    this.targetActiveFrame = 0; // current frame of the target hit
    this.targetActiveName = ''; // name of the the target hit
    this.targetHitCount = 0; // number of times the targets has been hit    
    
    this.targetCreate(); // calls the targetCreate() function which creates the targets
    
    this.hudGroup = this.game.add.group();
    
    this.levelTimer.start(); // start the level timer
    
    this.pauseGameHUD();
  }, // end of create function
  
  update: function() {
  }, // end of update function
  
  render: function() {
    this.debugInfo(); // display the debug info
  }, // end of render function
  
  // --== My Functions ==-- //
  targetCreate: function() {
    for (var i = 0; i < level; i++) { // loop to create multiple targets
      this.target = this.game.add.sprite(-256, -256, 'emoticons'); // add target sprite sheet to this.target off screen

      this.target.name = i; // give each target a name based on the loop index
      
      this.setupTarget(this.target); // set the position, rotation of the targets

      this.target.inputEnabled = true; // allow input on sprite
      this.target.input.pixelPerfectClick = true; // ignore the transparent area around the sprite
      this.target.events.onInputDown.add(this.inputOnTarget, this); // listen for input on the sprite
      
      this.targetsHitArray[i] = 0; // set the number of hits for the target to 0
    }
  }, // end of targetSetup function
  
  inputOnTarget: function(selectedTarget) {
    var tweenFade = this.game.add.tween(selectedTarget).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false, 0, 0, false); // fade the happy face away after the final hit
    
    this.targetActiveFrame = selectedTarget.frame; // set the frame of selected target to this.targetActiveFrame for use outside this function
    this.targetActiveName = selectedTarget.name; // set the frame of selected target to this.targetActiveName for use outside this function
    
    //this.temp = tweenFade.properties;
    
    if (selectedTarget.frame == 0) { // check if the target is displaying the first frame, frame 0 in the spritesheet
      tweenFade.start(); // start the tween fade
     
      tweenFade.onComplete.add(this.setupTarget, selectedTarget); // when the fade is complete reposition the target
      
      this.targetsHitArray[selectedTarget.name] = 0; // reset hit counter, used to count the number of hits for each frame

      playerScore++; // increase player's score, they've made a target happy
    } else if (this.targetsHitArray[selectedTarget.name] == (selectedTarget.frame)) { // if the target isn't happy change it on input
      this.targetsHitArray[selectedTarget.name] = 0; // reset hit counter, used to count the number of hits for each frame
      
      selectedTarget.frame--; // change to the pervious target
    } else {
      this.targetsHitArray[selectedTarget.name]++; // increase the hit count for the specific target insde the array
    }
  }, // end of inputOnTarget function
  
  setupTarget: function(thisTarget) {
    if (thisTarget.alpha == 0) { // determine if the alpha is 0 and...
      this.game.add.tween(thisTarget).to({ alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, false); // fade the target in to view
    } else {
      thisTarget.alpha = 1; // if alpha isn't 0 set it to 1
    }
    
    thisTarget.frame = this.game.rnd.integerInRange(1, 4); // randomly pick a frame from neutral to angry
    
    thisTarget.anchor.set(0.5); // set anchor to the centre of the sprite
    thisTarget.scale.set(0.75); // scale sprite down
    
    thisTarget.x = this.game.rnd.integerInRange(thisTarget.width / 2, this.game.world.width - (thisTarget.width / 2)); // randomly position target along X within the game world
    thisTarget.y = this.game.rnd.integerInRange(thisTarget.height / 2, this.game.world.height - (thisTarget.height / 2)); // randomly position target along Y within the game world
    
    thisTarget.angle = this.game.rnd.angle(); // randomly set the angle of the target
  }, // end of setupTarget function
  
  pauseGameHUD: function() {    
    var buttonPause = this.game.make.button(this.game.width, 0, 'buttonPause', function() { this.game.paused = true; }, this, 0, 1, 2);

    buttonPause.anchor.set(1.0, 0.0); // set the play button anchor in the middle 
    buttonPause.scale.set(0.5); // scale pause button to 50%
    
    this.hudGroup.add(buttonPause);
    
    this.game.input.onDown.add(function () { if (this.game.paused) this.game.paused = false; }, this);
  }, // end of gamePlayHUD function
  
  debugInfo: function() {
    // --== Debug Info ==-- //
    this.game.debug.text('Player\'s Score: ' + playerScore, 16, 16); // display player's score
    this.game.debug.text('Level: ' + level, 16, 32); // display current level achieved
    this.game.debug.text('Time: ' + this.game.time.totalElapsedSeconds().toFixed(0), 16, 48); // display time
    this.game.debug.text('Level Time: ' + this.levelTimer.duration.toFixed(0), 16, 64); // display level time
    this.game.debug.text('-', 16, 80); // empty debug text line
    this.game.debug.text('-', 16, 96); // empty debug text line    
    this.game.debug.text('Target\'s Name: ' + this.targetActiveName, 16, 112); // display name of the target hit
    this.game.debug.text('Target\'s Frame: ' + this.targetActiveFrame, 16, 128); // display the current frame of the target hit
    this.game.debug.text('Target\'s Hit Count: ' + this.targetsHitArray[this.targetActiveName], 16, 144); // display how many hits on the target hit
    this.game.debug.text('Target\'s Width: ' + this.target.width, 16, 160); // empty debug text line
    this.game.debug.text('Target\'s Height: ' + this.target.height, 16, 176); // empty debug text line
    this.game.debug.text('Tween is Running: ' + this.temp, 16, 192); // empty debug text line
    this.game.debug.text('Targets Total: ' + this.targetsHitArray.length, 16, 208); // display total number of targets    
    this.game.debug.text('Targets Hit Array: ' + this.targetsHitArray, 16, 224); // display the array of hits on all the targets
    // --== End of Debug Info ==-- //
  }, // end of debugInfo function
  // --== End of My Functions ==--// 
};