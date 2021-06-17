

class button {

  private int x, y, w, h;
  private String text = "";
  private color mc = #FFFFFF;
  private color tc = #000000;//tc=textColor, mc=MainColor
  private float ts = -1;
  private long lastPressed;
  private static final long DELAY_TIME = 150;

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
  
  public button(int x, int y, int w, int h, float ts) {
    this(x, y, w, h);
    this.ts = ts;
  }

  public button(int x, int y, int w, int h, String text, color tc, color mc) {
    this(x, y, w, h, text);
    this.tc = tc;
    this.mc = mc;
  }

  public button(int x, int y, int w, int h, String text, color mc) {
    this(x, y, w, h, text);
    this.mc = mc;
  }

  public button(int x, int y, int w, int h, String text, color tc, color mc, float ts) {
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
      textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
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
   public void update(color mc) {
    this.mc = mc;
  }
  public void update(int x, int y, int w, int h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  public void update(int x, int y, int w, int h, color tc, color mc) {
    update(x, y, w, h, mc);
    this.tc = tc;
  }

  public void update(int x, int y, int w, int h, color tc, String text, color mc) {
    update(x, y, w, h, tc, mc);
    this.text = text;
  }

  public void update(int x, int y, int w, int h, color mc) {
    update(x, y, w, h);
    update(mc);
  }

  public void update(int x, int y, int w, int h, String text, float ts, color tc) {
    update(x, y, w, h);
    this.text = text;
    this.ts = ts;
    this.tc = tc;
  }
  
  public void update(int x, int y, int w, int h, String text, float ts, color tc, color mc) {
    update(x, y, w, h, text, ts, tc);
    update(mc);
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }
  public int getW() {
    return w;
  }

  public int getH() {
    return h;
  }
  
  public void set_lastPressed(long lastPressed){
    this.lastPressed=lastPressed;
  }
}
