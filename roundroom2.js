let debug = false;

let canvasWidth = 900;
let canvasHeight = 232;

let comets = [];

let minCometSize = 5;
let maxCometSize = 15;

let cometCD = 120;
let cometFire = 0;


let spaceBackground;
let notes, bgMusic, bgImage;


function preload() {
  bgMusic = loadSound('bgMusic.mp3');
  bgImage = loadImage('space.jpg');
}


function setup() {
  createCanvas(900, 600);

  notes = [ 
    440, 493.883, 523.251, 587.33,  659.255, 698.456, 783.991
  ];


  bgMusic.setVolume(0.6);
  bgMusic.loop();
}


function draw() {
  /////////// BACKGROUND ///////////////////////////
  // background(31, 37, 118);

  image(bgImage, 0, 0, 900, 232);
  
  // for (let i=0; i<width ; i+=spaceBetweenCircles) {
  //   for (let j=0; j<232; j+=spaceBetweenCircles) {

  //       let colorLerp = i/width;

  //       if (colorLerp < 0.5) {

  //         let lerpedColor = lerpColor(red, purple, colorLerp);
  
  //         fill(lerpedColor);
  //         ellipse(i, j, backgroundSize*sin(i+j+frameCount*blinkRate));
        
  //       } else {
  //         let lerpedColor = lerpColor(purple, red, colorLerp);
  
  //         fill(lerpedColor);
  //         ellipse(i, j, backgroundSize*sin(i+j+frameCount*blinkRate));
  //       }
  //   }
  
  fill(0);
  rect(0, 232, width, height-232);
  
  if (debug) {

    fill(125);
    stroke(255, 0, 0);
    rect(0, 0, 900, 128); //front size of ceiling
  
    rect(0, 128, 400, 104); //front side of wall
    rect(400, 128, 47, 28); //above front door
    rect(447, 128, 403, 104); //back side of wall
    rect(850, 128, 47, 28); //above back door
    rect(897, 128, 3, 104); //bit beside back door
  
    rect(0, 232, 900, 18); //space inbetween
  
    rect(0, 250, 900, 128); //back side of ceiling
  
    rect(0, 378, 400, 104); //front side of wall
    rect(400, 378, 47, 28); //above front door
    rect(447, 378, 403, 104); //back side of wall
    rect(850, 378, 47, 28); //above back door
    rect(897, 378, 3, 104); //bit beside back door

  }
  
  
  noStroke();
  fill(0);

  // ellipse(sin(frameCount*0.1), sin(frameCount*0.1), 50);

  if (frameCount - cometFire >= cometCD) {
    print("pushing comet");
    let c = new Comet();
    comets.push(c);

    cometFire = frameCount+random(60);

    if (comets.length > 1) {
      comets[comets.length-1].starOsc.stop();
    }
  }

  for (let i=0; i<comets.length; i++) {
    comets[i].display();
  };

  if (comets.length > 200) {
    comets.subset(comets, 1, comets.length-1);
  }
  
  
}

class Comet {
  constructor() {
    // this.initx = random(canvasWidth);
    // this.initY = random(canvasHeight);
    this.initPos = [random(canvasWidth), canvasHeight];
    this.size = random(minCometSize, maxCometSize);
    this.deathPoint = [random(900), random(232)];
    this.velocity = random(0.001, 0.02);
    this.posLerper = 0;
    this.blinkRate = random(0.001, 0.01);

    this.sound = int(random(0, notes.length-1));

    this.osc = new p5.Oscillator();
    this.osc.setType('triangle');
    this.osc.amp(0.3);
    this.osc.amp(0, 1);
    // this.osc.start();

    this.starSound = int(random(0, notes.length-1));

    this.starOsc = new p5.Oscillator();
    this.starOsc.setType('sine');
    this.starOsc.amp(0.8);
    this.starOsc.freq(notes[this.starSound]);

    this.playing = false;
  }

  display() {
    fill(255);

    if (this.posLerper < 1) {
      this.posLerper += this.velocity;
    } else {
      this.posLerper = 1;
    }

    

    let lerpPosX = lerp(this.initPos[0], this.deathPoint[0], this.posLerper);
    let lerpPosY = lerp(this.initPos[1], this.deathPoint[1], this.posLerper);
    let lerpSound = lerp(notes[this.sound], notes[this.sound+1], this.posLerper);
    let lerpSize = lerp(this.size, 0, this.posLerper);
    let lerpAlpha = lerp(255, 0, this.posLerpber);

    let mapPan = map(lerpPosX, 0, width, -1, 1);


    this.osc.freq(lerpSound);
    this.osc.pan(mapPan);

    ellipse(lerpPosX, lerpPosY, lerpSize);

    if (lerpSize <= 0) {
      this.createStar(this.deathPoint[0], this.deathPoint[1], mapPan);
      this.osc.stop();
    }

  }

  createStar(xPos, yPos, mapPan) {
    if(!this.playing) {
      this.starOsc.pan(mapPan);
      this.starOsc.amp(0, 0.5);
      
      this.starOsc.start();
      
      this.playing = true;

      if(cometCD > 20) {
        cometCD -= 2;
      } else {
        cometCD = 20;
      }
      print(cometCD);
      
    }


    fill(255);
    ellipse(xPos, yPos+250, sin(frameCount*this.blinkRate)*this.size+5);
    ellipse(xPos, yPos, sin(frameCount*this.blinkRate)*this.size);

    fill(255, 255, 85)
    ellipse(xPos, yPos, sin(frameCount*this.blinkRate)*this.size-5);

    
  }

}
