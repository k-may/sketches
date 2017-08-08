/**
 * Storing Input. 
 * 
 * Move the mouse across the screen to change the position
 * of the circles. The positions of the mouse are recorded
 * into an array and played back every frame. Between each
 * frame, the newest value are added to the end of each array
 * and the oldest value is deleted. 
 */

int num = 60;
float mx[] = new float[num];
float my[] = new float[num];

boolean recording = false;
boolean started = false;
int frameCounter = 0;

void setup() {
  size(256, 256);
  noStroke();
  fill(255, 153);
}

void draw() {

  background(255); 

  if (started) {
    // Cycle through the array, using a different entry on each frame. 
    // Using modulo (%) like this is faster than moving all the values over.
    int which = frameCounter % num;
    mx[which] = mouseX;
    my[which] = mouseY;

    noFill();
    strokeWeight(2);
    stroke(0);
    beginShape();

    for (int i = 0; i < num; i++) {
      int index = (which+1 + i) % num;

      /*if (i == 0) {
        vertex(mx[index], my[index]);
      } else {*/
        curveVertex(mx[index], my[index]);
      //}
    }

    endShape();

    if (recording)
      saveFrame();

    frameCounter ++;
  }
}

void mouseDragged() {
  if (!started) {
    frameCounter = 0;

    for (int i = 0; i < num; i ++) {
      mx[i] = mouseX;
      my[i] = mouseY;
    }
  }
  started = true;
}

void mouseReleased() {
  started = false;
}

void keyPressed() {
  if (key == ' ')
    recording = true;
}

void keyReleased() {
  recording = false;
}