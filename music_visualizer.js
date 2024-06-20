
let vocal_history = [];
let drum_history = [];
let bass_history = [];
let other_history = [];

let all_history = [];

let firstRun = true;

let particles = [];
let fft = new p5.FFT(0.1);
let waveXZ = fft.waveform();
let amp;
let factor;


//adds each channel to an array
function add_to_history(history, d) {
  history.push(d);
  if(history.length >= (width-1)/4) {
    history.shift();
  }
}

let f =1;

//draws the wave line off of the FFT
function drawCircleLine(history) {
   let waveXZ = fft.waveform();

  angleMode(DEGREES);
  //angleMode(RADIANS);

  fft.analyze();
  this.amp = fft.getEnergy(20,200);


  noFill();
  strokeWeight(3);

  for(let j = -1; j <= 1; j+=2){
    beginShape();  //LINES
    for(let i=0; i<=180; i+=0.5) {
      var index = floor(map(i, 0, 180, 0, waveXZ.length-1));

      let r = map(waveXZ[index],-1,1,200,300);

      let x =  ((r*sin(i) ) * j) *f;        //i;
      let y = (r*cos(i) ) *f ;           //history[index] *6 ; // + height/2 ;
      vertex(x, y);
    }
    endShape();
  }

}


// function pba7(){
//    let rad = 25;
//   let xP = -600
//   for(let i = 1; i<6; i++){
//     fill(255,255,random(100,255));
//      ellipse(xP, 0, rad,rad);
//       xP += i*50;
//       rad+=20;
//   }
// }

//draws the wave lines off the array from the song
function drawCircleLine02(history, factor){
let waveXZ = fft.waveform();
  noFill();

  for(let j = -1; j <= 1; j+=2){
    beginShape();  //LINES
    for(let i=0; i<=180; i+=6) {
      var index = floor(map(i, 0, 180, 0, history.length-1));

      let r = map(history[index],-1,1,200,300);

  //if(this.amp>210){factor= factor* 0.01;}else{factor= factor*0.03;}

      let x =  ((r*sin(i) ) * j )*factor;        //i;
      let y = (r*cos(i) )*factor ;           //history[index] *6 ; // + height/2 ;
      vertex(x, y);
    }
    endShape();
  }
}

//goes through my particle array and draws all pf them and updates their position
function drawParticles(){
translate(width/2, height/2);
  let p = new Particle();
  particles.push(p);
  for(let i = particles.length-1; i>=0; i--){
    if(!particles[i].edges()){
      particles[i].show();
      particles[i].update(this.amp>210);
    }else{
      particles.splice(i,1);
    }
  }
}

//draw function
function draw_one_frame(vocal, drum, bass, other, visualizer) {

if(firstRun){
let fft = new p5.FFT();
  firstRun = false;
}

  add_to_history(vocal_history, vocal);
  add_to_history(drum_history, drum);
  add_to_history(bass_history, bass);
  add_to_history(other_history, other);

     background(20);


 drawParticles();
  stroke("#89FFC7");
  stroke("#E73C83");
drawCircleLine(all_history);

stroke("#3DEF68");  //FFF9FC
drawCircleLine02(other_history,0.02);
stroke("#40BD8D"); //FFE8F2
drawCircleLine02(bass_history,0.03);
stroke("#FF89C3"); //FFACD5
drawCircleLine02(vocal_history,0.04);
stroke("#34EFA7");//FF89C3
drawCircleLine02(drum_history,0.05);



}//***************************draw loop***********************


//where the particles are defined
class Particle {
  constructor(){
  this.pos = p5.Vector.random2D().mult(250);
  this.vel = createVector(0,0);
  this.acc = this.pos.copy().mult(random(0.0001,0.00001));
  this.width = random(3,18) ;
  this.colour= color(255,random(100,255),255);
}
update(cond){
  this.vel.add(this.acc);
  this.pos.add(this.vel);
  if(cond){
    this.pos.add(this.vel);
    this.pos.add(this.vel);
    this.pos.add(this.vel);
  }
}
show(){
noStroke();
fill(this.colour);
ellipse(this.pos.x,this.pos.y, this.width);

}
edges(){
  if(this.pos.x<-width/2||this.pos.x>width/2||this.pos.y<-height/2||this.pos.y>height/2){
    return true;
  }else{
    return false;
  }
}
}
