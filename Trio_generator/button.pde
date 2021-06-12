

class button {

  private int x, y, w, h;
  private String text = "";
  private color tc = #000000;
  private color mc = #FF0000;//tc=textColor, mc=MainColor
  private int ts = -1;
  private long lastPressed;
  private static final long DELAY_TIME = 200;

  public button(int x, int y, int w, int h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  public button(int x, int y, int w, int h, String text) {
    this(x, y, w, h);
    this.text = text;
  }

  public button(int x, int y, int w, int h, String text, color tc, color mc) {
    this(x, y, w, h, text);
    this.tc = tc;
    this.mc = mc;
  }

  public button(int x, int y, int w, int h, String text, color tc, color mc, int ts) {
    this(x, y, w, h, text, tc, mc);
    this.ts = ts;
  }

  public void drawMe() {
    fill(mc);
    stroke(mc);
    strokeWeight(0);
    rect(x, y, w, h, roundboxes);

    textAlign(CENTER, CENTER);
    if (ts == -1)
      textSize((float)Math.floor((float)h*0.8f));
    else
      textSize(ts);
    fill(tc);
    stroke(tc);
    strokeWeight(0);

    text(text, x+w/2, y+h/2);
  }

  public boolean isPushed() {
    if (mousePressed && (lastPressed+DELAY_TIME) < System.currentTimeMillis() && mouseX>x && mouseX < (x+w) && mouseY > y && mouseY < (y+h)) {
      lastPressed = System.currentTimeMillis();
      return true;
    }
    return false;
  }
}
