import java.awt.datatransfer.StringSelection;  //<>//
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.util.Arrays;
import java.util.Collections;
import java.awt.Point;

public static int draw = 8;

//label
public static ArrayList<button> x_buttons = new ArrayList<button>();
public static ArrayList<button> y_buttons = new ArrayList<button>();
public static int labeledint = 1;
public static boolean labeledbool = true;
public static ArrayList<ArrayList<button>> labelbuttons = new ArrayList<ArrayList<button>>();
public static boolean label_init = true;

public static boolean minimalistic = false;

public static final int roundboxes = 10;
public ArrayList<button> buttons = new ArrayList<button>();

public static init_numbers r;
public static init_numbers r2;

//colors
public static color right_color = #00FF00;
public static color wrong_color = #FF0000;
public static color pending_color = #0000FF;
public static int seed_green_fade = 255;

//numbers
public static boolean extreme_calc = true;
public static ArrayList<Integer> clicked_box = new ArrayList<Integer>();
//seed
public static String Hex_r_seed = "0000";

//grid_setup
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
public static int column_width = 0;
public static int column_height = 0;
public static int X_offset = 0;
public static int site_distance = 2;
public static int max_columns = 40;
public static int min_columns = 5;

public static ScriptEngineManager mgr = new ScriptEngineManager();
public static ScriptEngine engine = mgr.getEngineByName("JavaScript");
boolean buttons_init = false;

void setup() {
  r = new init_numbers(Integer.parseInt(Hex_r_seed, 16));
  r.rand();
  fullScreen();
}

void mousePressed() {
  //disselect selected boxes
  boolean clicked_button = false;

  if (!minimalistic) {
    //rem row
    if (rows>min_columns) {
      if (buttons.get(1).isPushed()) {
        rows -= 1;
        reset_action(true);
        labelbuttons.clear();
        label_init = true;
      }
    }

    //add row
    if (rows<max_columns) {
      if (buttons.get(2).isPushed()) {
        rows += 1;
        reset_action(true);
        labelbuttons.clear();
        label_init = true;
      }
    }

    //rem column
    if (columns>min_columns) {
      if (buttons.get(3).isPushed()) {
        columns -= 1;
        reset_action(true);
        labelbuttons.clear();
        label_init = true;
      }
    }

    //add column
    if (columns<max_columns) {
      if (buttons.get(4).isPushed()) {
        columns += 1;
        reset_action(true);
        labelbuttons.clear();
        label_init = true;
      }
    }

    //reset_button
    if (buttons.get(5).isPushed()) {
      if (rows!=10 || columns!=10) {
        rows = 10;
        columns = 10;
        reset_action(true);
      }
      reset_action(false);
      labelbuttons.clear();
      label_init = true;
    }

    //label
    if (buttons.get(8).isPushed()) {
      clicked_button = true;
      switch(labeledint) {
      case 0:
        labeledint = 1;
        break;
      case 1:
        labeledint = 2;
        break;
      case 2:
        labeledbool = !labeledbool;
        labeledint = 0;
        break;
      default:
        labeledint = 0;
        break;
      }
    }

    //reroll-button
    if (buttons.get(6).isPushed()) {
      r.rerand();
      x_buttons.clear();
      y_buttons.clear();
    }

    //seed-button
    if (buttons.get(9).isPushed()) {
      String myString = r.getSeed()+"";
      StringSelection stringSelection = new StringSelection(myString);
      Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
      clipboard.setContents(stringSelection, null);
      System.out.println("SEED: "+r.getSeed());
      seed_green_fade = 0;
      clicked_button = true;
    }
  } else {
    //reroll-field
    if (buttons.get(7).isPushed()) {
      r.rerand();
    }
  }

  //minimalistic
  if (buttons.get(10).isPushed()) {
    minimalistic = !minimalistic;
    buttons.get(0).set_lastPressed(System.currentTimeMillis()+5);
    clicked_button = true;
  }

  //labels-buttons
  boolean clickedlabel=false;
  if (labelbuttons.size()>1) {
    int xkord;
    int ykord;
    for (button xb : labelbuttons.get(0)) {
      if (xb.isPushed()) {
        if (!x_buttons.remove(xb)) {
          if (clicked_box.size()<1 && x_buttons.size()>0) {
            x_buttons.clear();
          }
          x_buttons.add(xb);
          clicked_button = true;
        }
      }
    }
    for (button yb : labelbuttons.get(1)) {
      if (yb.isPushed()) {
        if (!y_buttons.remove(yb)) {
          if (clicked_box.size()<1 && y_buttons.size()>0) {
            y_buttons.clear();
          }
          y_buttons.add(yb);
          clicked_button = true;
        }
      }
    }
    if ((!x_buttons.isEmpty()) && (!y_buttons.isEmpty())) {
      xkord=labelbuttons.get(0).indexOf(x_buttons.get(x_buttons.size()-1))+1;
      ykord=labelbuttons.get(1).indexOf(y_buttons.get(y_buttons.size()-1))+1;
      Point p = new Point();
      p.setLocation(xkord, ykord);
      int index = getIndexForPoint(p);
      if (clicked_box.size()!=1) {
        clicked_box.clear();
      }
      clicked_box.add(index);
      clickedlabel=true;
      x_buttons.clear();
      y_buttons.clear();
    } else if (x_buttons.size()>0) {
      if (clicked_box.size()==1) {
        xkord=labelbuttons.get(0).indexOf(x_buttons.get(x_buttons.size()-1))+1;
        ykord=(int) getCoordinatesForIndex(clicked_box.get(0)).getY();
        Point p = new Point();
        p.setLocation(xkord, ykord);
        int index = getIndexForPoint(p);
        clicked_box.add(index);
        clickedlabel=true;
        x_buttons.clear();
        y_buttons.clear();
      }
    } else if (y_buttons.size()>0) {
      if (clicked_box.size()==1) {
        xkord=(int) getCoordinatesForIndex(clicked_box.get(0)).getX();
        ykord=labelbuttons.get(1).indexOf(y_buttons.get(y_buttons.size()-1))+1;
        Point p = new Point();
        p.setLocation(xkord, ykord);
        int index = getIndexForPoint(p);
        clicked_box.add(index);
        clickedlabel=true;
        x_buttons.clear();
        y_buttons.clear();
      }
    }
  }


  //clickable boxes
  boolean goForward = (mouseX >= column_width*(site_distance)+X_offset && mouseX <= column_width*(columns+site_distance)+X_offset && mouseY >= column_height*(site_distance/2) && mouseY <= column_height*(rows+site_distance/2)+column_height);
  if (labeledbool)
    goForward = (mouseX >= column_width*(site_distance+0.5)+X_offset && mouseX <= column_width*(columns+site_distance+0.5)+X_offset && mouseY >= column_height*(site_distance/2) && mouseY <= column_height*(rows+site_distance/2)+column_height);
  if (goForward || clicked_box.size()>1) {
    int index=-1;
    if (goForward) {
      clicked_button = true;
      int column = ((mouseX-X_offset)/column_width)-site_distance;
      if (labeledbool)
        column = (int)(((double)(mouseX-X_offset)/column_width)-(double)(site_distance+0.5));
      int row = ((mouseY)/column_height)-(site_distance/2);
      index = row*columns+column;
      x_buttons.clear();
      y_buttons.clear();
    }
    if (clickedlabel) {
      index = clicked_box.get(clicked_box.size()-1); 
      while (clicked_box.size()>1) {
        clicked_box.remove(clicked_box.size()-1);
      }
      clickedlabel=false;
    }
    if (index>=0) {
      if (clicked_box.contains(index)) {
        if (clicked_box.indexOf(index) == 0) {
          clicked_box.clear();
        } else {
          clicked_box.remove(2);
          clicked_box.remove(1);
        }
      } else {
        if (clicked_box.size()<3) {
          switch(clicked_box.size()) {
          case 0:
            clicked_box.add(index);
            break;
          case 1:
            Point origin = getCoordinatesForIndex(clicked_box.get(0));
            Point newPoint = getCoordinatesForIndex(index);
            Point newNewPoint = new Point();
            boolean newnewIstAussen = false;
            if (newPoint.equals(new Point()))
              break;
            if (newPoint.equals(new Point())) {
              System.err.println("Second point is not valid");
              break;
            }
            //Auf x daneben
            if (newPoint.getX() ==  origin.getX()+1 && newPoint.getY() ==  origin.getY()) {
              newNewPoint.setLocation(origin.getX()+2, origin.getY());
              newnewIstAussen = true;
            } else if (newPoint.getX() ==  origin.getX()+2 && newPoint.getY() ==  origin.getY()) {
              newNewPoint.setLocation(origin.getX()+1, origin.getY());
            } else if (newPoint.getX() ==  origin.getX()-1 && newPoint.getY() ==  origin.getY()) {
              newNewPoint.setLocation(origin.getX()-2, origin.getY());  
              newnewIstAussen = true;
            } else if (newPoint.getX() ==  origin.getX()-2 && newPoint.getY() ==  origin.getY()) {
              newNewPoint.setLocation(origin.getX()-1, origin.getY());

              //Auf y daneben
            } else if (newPoint.getY() ==  origin.getY()+1 && newPoint.getX() ==  origin.getX()) {
              newNewPoint.setLocation(origin.getX(), origin.getY()+2);
              newnewIstAussen = true;
            } else if (newPoint.getY() ==  origin.getY()+2 && newPoint.getX() ==  origin.getX()) {
              newNewPoint.setLocation(origin.getX(), origin.getY()+1);
            } else if (newPoint.getY() ==  origin.getY()-1 && newPoint.getX() ==  origin.getX()) {
              newNewPoint.setLocation(origin.getX(), origin.getY()-2);
              newnewIstAussen = true;
            } else if (newPoint.getY() ==  origin.getY()-2 && newPoint.getX() ==  origin.getX()) {
              newNewPoint.setLocation(origin.getX(), origin.getY()-1);

              //Diagonal positiv
            } else if (newPoint.getY() ==  origin.getY()+1 && newPoint.getX() ==  origin.getX()+1) {
              newNewPoint.setLocation(origin.getX()+2, origin.getY()+2);
              newnewIstAussen = true;
            } else if (newPoint.getY() ==  origin.getY()+2 && newPoint.getX() ==  origin.getX()+2) {
              newNewPoint.setLocation(origin.getX()+1, origin.getY()+1);

              //Diagonal negativ
            } else if (newPoint.getY() ==  origin.getY()-1 && newPoint.getX() ==  origin.getX()-1) {
              newNewPoint.setLocation(origin.getX()-2, origin.getY()-2);
              newnewIstAussen = true;
            } else if (newPoint.getY() ==  origin.getY()-2 && newPoint.getX() ==  origin.getX()-2) {
              newNewPoint.setLocation(origin.getX()-1, origin.getY()-1);

              //Diagonal positiv negativ
            } else if (newPoint.getY() ==  origin.getY()+1 && newPoint.getX() ==  origin.getX()-1) {
              newNewPoint.setLocation(origin.getX()-2, origin.getY()+2);
              newnewIstAussen = true;
            } else if (newPoint.getY() ==  origin.getY()+2 && newPoint.getX() ==  origin.getX()-2) {
              newNewPoint.setLocation(origin.getX()-1, origin.getY()+1);

              //Diagonal negativ positiv
            } else if (newPoint.getY() ==  origin.getY()-1 && newPoint.getX() ==  origin.getX()+1) {
              newNewPoint.setLocation(origin.getX()+2, origin.getY()-2);
              newnewIstAussen = true;
            } else if (newPoint.getY() ==  origin.getY()-2 && newPoint.getX() ==  origin.getX()+2) {
              newNewPoint.setLocation(origin.getX()+1, origin.getY()-1);
            } else {
              clicked_box.clear();
              clicked_box.add(getIndexForPoint(newPoint));
              break;
            }

            if (newNewPoint.equals(new Point())) {
              System.err.println("No valid third point");
              break;
            }
            if (getIndexForPoint(newPoint) ==  -1 || getIndexForPoint(newNewPoint) ==  -1) {
              break;
            }
            if (newnewIstAussen) {
              clicked_box.add(getIndexForPoint(newPoint));
              clicked_box.add(getIndexForPoint(newNewPoint));
            } else {
              clicked_box.add(getIndexForPoint(newNewPoint));
              clicked_box.add(getIndexForPoint(newPoint));
            }
          }
        } else {
          clicked_box.clear();
          clicked_box.add(index);
        }
      }
    } else {
      clicked_box.clear();
    }
  }
  if (!clicked_button) {
    clicked_box.clear();
    x_buttons.clear();
    y_buttons.clear();
  }
}

Point getCoordinatesForIndex(int i) {
  Point result = new Point();
  int index = i+1;
  int x = (int)(index-(Math.floor((float)index/(float)columns)*columns));
  int y = (int)(Math.floor((float)index/columns))+1;
  result.setLocation(x, y);
  if (x<1 || x>(columns) || y<1 || y>(rows))
    if (result.getX() ==  0) {
      result.setLocation(columns, result.getY()-1);
    }
  if (result.getX()<1 || result.getX()>(columns) || result.getY()<1 || result.getY()>(rows)) {
    System.err.println("Point not existent");
    return new Point();
  }
  return result;
}

int getIndexForPoint(Point p) {
  if (p.getX() < 1 || p.getX() > columns || p.getY() < 1 || p.getY() > rows)
    return -1;
  int result = (int)(p.getX()-1 + columns*(p.getY()-1));
  return result;
}

void draw() { 
  if (draw<= 0) {
    clear();
    background(50, 50, 50);
    fill(255, 255, 255);
    //grid setup
    column_height = height/(rows+site_distance);
    X_offset = 0;
    column_width = width/(columns+site_distance*2);
    if (!buttons_init) {
      buttons_init = true;
      initButtons(buttons_init);
    }
    initButtons(false);
    //grid
    for (int i = 0; i< rows; i++) {
      for (int e = 0; e< columns; e++) {
        boolean right = false;
        int possibilities = r.calculations_list.length;
        fill(#FFFFFF);
        if (clicked_box.contains(i*columns+e)) {
          textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs(buttons.get(5).getX()-(buttons.get(0).getX()+buttons.get(0).getX())))/possibilities+(site_distance*column_width*2))/11)*0.5f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
          if (clicked_box.size() == 3) {
            float xcord = 0;
            float y_add = 0;
            float y_mult = 0;
            if (minimalistic) {
              button ref_one = buttons.get(7);
              xcord = column_width*1.3-column_width/1.2+X_offset/2+column_width/2;
              y_add = (float)((ref_one.getY()+ref_one.getH())+(float)((float)((column_height+column_width)/2)*(site_distance-1.7)));
              y_mult = (float)(((height-column_height)-(ref_one.getY()+ref_one.getH()))/possibilities+5)*1.0f;
              textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs((height-column_height)-(ref_one.getX()+ref_one.getX())))/8+(site_distance*column_width*2))/11)*0.8f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
            } else {
              button ref_one = buttons.get(6);
              button ref_sec = buttons.get(5);
              xcord = column_width*1.3-column_width/1.2+X_offset/2+column_width/2;
              y_add = (float)((ref_one.getY()+ref_one.getH())+(float)((float)((column_height+column_width)/2)*(site_distance-1.7)));
              y_mult = (float)((ref_sec.getY()-(ref_one.getY()+ref_one.getH()))/(possibilities+7))*1.5f;
              textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs(ref_sec.getX()-(ref_one.getX()+ref_one.getX())))/8+(site_distance*column_width*2))/11)*0.8f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
            }

            int one = r.getrandomnumbs().get(clicked_box.get(0));
            int sec = r.getrandomnumbs().get(clicked_box.get(1));
            int thi = r.getrandomnumbs().get(clicked_box.get(2));
            //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
            if (r.getcurrent_random_numb()>0) {
              for (int o = 0; o<r.getcalculationlist().length; o++) {
                double out = -1;
                String s = r.getcalculationlist()[o];
                r.calculations.add(s);
                if (s.charAt(0) == '/' && sec == 0||s.charAt(1) == '/' && thi == 0) {
                  continue;
                }
                try {
                  try {
                    //never use eval if with user input
                    out = (double)(engine.eval(one+(s.charAt(0)+"")+sec+(s.charAt(1)+"")+thi));
                  }
                  catch(ClassCastException u) {
                    //never use eval if with user input
                    out = (int)(engine.eval(one+(s.charAt(0)+"")+sec+(s.charAt(1)+"")+thi));
                  }
                }
                catch(ScriptException q) {
                  q.printStackTrace();
                }
                catch(Exception q) {
                  //System.out.println(q);
                  q.printStackTrace();
                }
                if (out == r.getcurrent_random_numb()) {
                  fill(right_color);
                  right = true;
                } else {
                  fill(wrong_color);
                }
                text((one+(s.charAt(0)+"")+sec+(s.charAt(1)+"")+thi), xcord, (float)(y_mult*o)+y_add);
              }
            }
            if (right) {
              fill(right_color);
            } else {
              fill(wrong_color);
            }
          } else {
            fill(pending_color);
          }
        }
        int x = 0;
        if (labeledbool) {
          x = column_width/2;
        } else {
          x = 0;
        }
        int rand = 1;
        rect(column_width*(e+site_distance)+X_offset+x+rand, column_height*(i+site_distance/2)+rand, column_width-rand, column_height-rand, roundboxes);
        if (clicked_box.size()>0&&clicked_box.size()<2) {
          if (clicked_box.get(0) == i*columns+e) {
            fill(#FFFFFF);
          } else {
            fill(0, 0, 0);
          }
        } else {
          fill(0, 0, 0);
        }
        textAlign(CENTER, CENTER);
        textSize((float)Math.floor((float)((column_width+column_height)/2)*0.5f));
        text(r.getrandomnumbs().get(i*columns+e)+"", column_width*(e+site_distance)+X_offset+column_width/2+x, column_height*(i+site_distance/2)+column_height/2);
      }
    }

    //row+column numbers

    fill(#FFFFFF);
    float ts = 0;
    if (minimalistic) {
      ts = (float)Math.floor((float)((column_height+column_width)/2)*0.6f);
    } else {
      ts = (float)Math.floor((float)((column_height+column_width)/2)*0.4f);
    }
    ArrayList<String> abc = new ArrayList<String>();
    int x = 0;
    color tc;
    //x-buttons
    int maxx = 0;
    ArrayList<button> xb;
    if (labelbuttons.size()>0) {
      xb = labelbuttons.get(0);
      maxx = xb.size();
    } else {
      xb = new ArrayList<button>();
      maxx = columns;
    }
    abc = init_label_list(false);
    for (int i = 0; i<maxx; i++) {
      tc=#FFFFFF;
      for (Integer clb : clicked_box) {
        if ((getCoordinatesForIndex(clb).getX()-1==i)) {
          if (clicked_box.size()==1) {
            tc=pending_color;
          } else {
            tc=right_color;
          }
        }
      }
      if (labeledbool) {
        x =  (int)(column_width*(i+0.5+site_distance)+X_offset);
      } else {
        x =  column_width*(i+site_distance)+X_offset;
      }
      if (label_init) {
        xb.add(new button(x+column_width/4, column_height*(site_distance/4), column_width/2, column_height, abc.get(i)+"", tc, g.backgroundColor, ts));
      } else {
        if (x_buttons.contains(xb.get(i))&&clicked_box.size()<1) {
          tc=#28B05C;
        }
        xb.get(i).update(x+column_width/4, column_height*(site_distance/4), column_width/2, column_height, abc.get(i)+"", ts, tc);
      }
    }
    if (label_init) {
      labelbuttons.add(xb);
    }
    //y-buttons
    int maxy = 0;
    ArrayList<button> yb;
    if (labelbuttons.size()>1) {
      yb = labelbuttons.get(1);
      maxy = yb.size();
    } else {
      yb = new ArrayList<button>();
      maxy = rows;
    }
    if (labeledint == 1 && rows <= 24) {
      abc = init_label_list(true);
    } else {
      abc = init_label_list(false);
    } 
    for (int i = 0; i<maxy; i++) {
      tc=#FFFFFF;
      for (Integer clb : clicked_box) {
        if ((getCoordinatesForIndex(clb).getY()-1==i)) {
          if (clicked_box.size()==1) {
            tc=pending_color;
          } else {
            tc=right_color;
          }
        }
      }
      if (labeledbool) {
        x = (int)(column_width*(site_distance)+X_offset);
      } else {
        x = (int)(column_width*((double)(columns+0.2+site_distance))+X_offset);
      }
      if (label_init) {
        yb.add(new button(x-column_width/8, column_height*(i+site_distance/2), column_width/2, column_height, abc.get(i)+"", tc, g.backgroundColor, ts));
      } else {
        if (y_buttons.contains(yb.get(i))&&clicked_box.size()<1) {
          tc=#28B05C;
        }
        yb.get(i).update(x-column_width/8, column_height*(i+site_distance/2), column_width/2, column_height, abc.get(i)+"", ts, tc);
      }
    }
    if (label_init) {
      label_init = false;
      labelbuttons.add(yb);
    }

    for (ArrayList<button> ab : labelbuttons) {
      for (button b : ab) {
        b.drawMe();
      }
    }
    if (labeledint == 2) {
      if (labeledbool) {
        text("y", column_width*(site_distance*0.9)+X_offset, column_height*(0+site_distance/2)+column_height/2); 
        text("x", column_width*(site_distance)+X_offset+column_width/2, column_height*site_distance/2-column_height/2);
      } else {
        text("y", column_width*(columns+site_distance+0.4)+X_offset+column_width/2.5, column_height*(0+site_distance/2)+column_height/2); 
        text("x", column_width*(site_distance-0.5)+X_offset+column_width/2, column_height*site_distance/2-column_height/2);
      }
    }

    if (!minimalistic) {
      for (button b : buttons) {
        b.drawMe();
      }
    } else {
      buttons.get(7).drawMe(); 
      buttons.get(10).drawMe();
    }
    if (r.getthreadfin()) {
      draw = 3;
    } else {
      draw = 5;
    }
  } else {
    draw -= 1;
  }
}

public ArrayList<String> init_label_list(boolean b) {
  ArrayList<String> abc = new ArrayList<String>();
  if (b) {
    Character[] alphabet = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
    for (Character c : alphabet) {
      abc.add(c+"");
    }
  } else {
    for (int i = 0; i<((rows<columns)?columns:rows); i++) {
      abc.add(((i+1)+""));
    }
  }
  return abc;
}

public void reset_action(boolean b) {
  if (b) {  
    if (r2!=null) {
      r2.stopthread();  
      r2=null;
    }
    if (r!=null) {
      r.stopthread();  
      initpregen();     
      r=null;
    }
  }
  clicked_box.removeAll(clicked_box);
  x_buttons.clear();
  y_buttons.clear();
  if (r != null) {
    r.stopthread();
  }
  if (r2!= null) {
    r = r2;
    r2 = null;
    initpregen();
  } else {
    initpregen();
    r = r2;
    r2 = null;
  }
}

public void initpregen() {
  if (r2 == null || r2 ==  r) {
    r2 = new init_numbers(0);
    r2.rand();
  }
}

/*
 0. zero
 1.-row
 2.+row
 3.-column
 4.+column
 5.reset
 6.reroll
 7.random number field
 8.label
 9.seed
 10.minimalistic
 */
public void initButtons(boolean init) {
  int fx = 0;
  int fy = 0;
  int fw = 0;
  int fh = 0;
  float ts = 0;
  color mc;
  color tc;
  PFont tf;
  String t;

  fx = 0;
  fy = 0;
  fw = 0;
  fh = 0;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, 1));
  }

  //rem_row_button
  int x = 0;
  if (labeledbool) {
    x = column_width/2;
  } else {
    x = 0;
  }
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10+x);
  fy = (int)Math.round((float)column_height*((float)rows+(float)site_distance/2)+column_height/2);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  mc = #28B05C;
  tf = createFont("Lucida Sans Typewriter Bold", 1);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "-", #FFFFFF, mc, tf));
  } else {
    if (rows <= min_columns) {
      buttons.get(1).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(1).update(fx, fy, fw, fh, mc);
    }
  }

  //add_row_button
  fy = (int)Math.round((float)column_height*((float)rows+(float)site_distance/2));
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  tf = createFont("Lucida Sans Typewriter Bold", 1);
  mc = #28B05C;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "+", #FFFFFF, mc, tf));
  } else {
    if (rows >= max_columns) {
      buttons.get(2).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(2).update(fx, fy, fw, fh, mc);
    }
  }

  //rem_column_button
  fy = (int)Math.round(0);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  tf = createFont("Lucida Sans Typewriter Bold", 1);
  mc = #28B05C;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "-", #FFFFFF, mc, tf));
  } else {
    if (columns <= min_columns) {
      buttons.get(3).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(3).update(fx, fy, fw, fh, mc);
    }
  }

  //add_column_button
  fy = (int)Math.round((float)column_height/2);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2); 
  tf = createFont("Lucida Sans Typewriter Bold", 1);
  mc = #28B05C;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "+", #FFFFFF, mc, tf));
  } else {
    if (columns >= max_columns) {
      buttons.get(4).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(4).update(fx, fy, fw, fh, mc);
    }
  }

  //reset_button
  fx = (int)Math.round((float)column_width-(float)column_width/1.5+(float)X_offset/2);
  fy = (int)Math.round((float)height-(float)column_height/1.5);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  mc = #7d2835;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "reset", #FFFFFF, mc));
  } else {
    buttons.get(5).update(fx, fy, fw, fh);
  }

  //reroll_button
  fx = (int)Math.round((float)column_width-(float)column_width/1.5+(float)X_offset/2);
  fy = (int)Math.round((float)column_height*3.5f);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  mc = #7d2835;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "reroll", #FFFFFF, mc));
  } else {
    buttons.get(6).update(fx, fy, fw, fh);
  }


  //random number + field
  fx = (int)Math.round((float)column_width-(float)column_width/1.16+(float)X_offset/2);
  fy = (int)Math.round((float)column_height*2f);
  fw = (int)Math.round((float)column_width*1.5f);
  fh = (int)Math.round((float)column_height*1.3f);
  ts = (float)Math.floor(((float)((column_height+column_width)/2)*0.2f)*3.6);
  // System.out.println("10: "+r.getcurrent_random_numb()+", "+r.getthreadfin()+", "+((double)((int)(r.getprogress()*10))/10)+", "+r.getpossiblenumbs().size());
  if (r.getcurrent_random_numb()>r.getmin() && r.getcurrent_random_numb()<r.getmax()) {
    if ((double)((int)(r.getprogress()*10))/10>99) {
      if (!r.getfound()) {
        tc = #000000;
        mc = #FFFFFF;
      } else {
        tc = #FFFFFF;
        mc = #0000FF;
      }
    } else {
      tc = #000000;
      mc = #FFFFFF;
    }
    t = r.getcurrent_random_numb()+"";
  } else {
    tc = #000000;
    mc = #FF0000;
    ts = (float)Math.floor(((float)((column_height+column_width)/2)*0.2f)*2.5);
    t = (double)((int)(r.getprogress()*10))/10+"%";
  }
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, t, tc, mc, ts));
  } else {
    buttons.get(7).update(fx, fy, fw, fh, t, ts, tc, mc);
  }



  //label
  fx = (int)Math.round((float)column_width-(float)column_width/1.5f+(float)X_offset/2);
  fy = (int)Math.round((float)column_height/3);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  mc = #464f75;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "label", #FFFFFF, mc));
  } else {
    buttons.get(8).update(fx, fy, fw, fh);
  }

  //seed
  fx = (int)Math.round(width/2);
  fy = (int)Math.round(height/100);
  fw = (int)Math.round((float)column_width*1.2f);
  fh = (int)Math.round((float)column_height/4);
  tc = color(seed_green_fade, 255, seed_green_fade);
  mc = #000000;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "seed: "+Integer.toHexString(r.getSeed()), tc, g.backgroundColor));
  } else {
    buttons.get(9).update(fx, fy, fw, fh, tc, "seed: "+Integer.toHexString(r.getSeed()), g.backgroundColor);
    if (seed_green_fade<255) {
      seed_green_fade += 3;
    }
  }

  //minimalistic
  fx = (int)Math.round((float)column_width-(float)column_width/1.5f+(float)X_offset/2);
  fy = (int)Math.round((float)column_height);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  mc = #464f75;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "minimal", #FFFFFF, mc));
  } else {
    buttons.get(10).update(fx, fy, fw, fh);
  }
  fill(255, 255, 255);
  stroke(255, 255, 255);
  if (init) {
    for (button b : buttons) {
      b.lastPressed = System.currentTimeMillis()+5;
    }
  }
}



class button {

  private int x, y, w, h;
  private String text = "";
  private color mc = #FFFFFF;
  private color tc = #000000;//tc = textColor, mc = MainColor
  private float ts = -1;
  private long lastPressed;
  private static final long DELAY_TIME = 150;
  private PFont tf; //tf = textFont

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
  public button(int x, int y, int w, int h, String text, color tc, color mc, PFont tf) {
    this(x, y, w, h, text, tc, mc);
    this.tf = tf;
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
    stroke(g.backgroundColor);
    strokeWeight(0);
    //stroke(#FFFFFF);
    //strokeWeight(0);
    rect(x, y, w, h, roundboxes);

    textAlign(CENTER, CENTER);

    if (tf == null)
      textFont(createFont("Lucida Sans Typewriter", 20));
    else {
      textFont(tf);
    }

    if (ts ==  -1)
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

  public void set_lastPressed(long lastPressed) {
    this.lastPressed = lastPressed;
  }
}

import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import java.util.*;

class init_numbers {
  private Thread t;
  private possiblenumbs p;
  private int min_plays=30;
  private boolean threadfin;
  private double progress=0;

  //grid
  private int grid_min =0;
  private int grid_max =10;
  private int min=grid_min+1;
  private int max=(grid_max-1)*(grid_max-1)+grid_max-1;

  //numbers  
  private ArrayList<Integer> possible_numbs = new ArrayList<Integer>();
  private String[] calculations_list = {"*+", "+*", "/+", "+/", "*-", "-*", "/-", "-/", "*/", "/*", "+-", "-+"};
  private ArrayList<String> calculations = new ArrayList<String>();
  private ArrayList<Integer> random_numbs = new ArrayList<Integer>();
  private int current_random_numb;
  private boolean found_nothing = false;
  private int seed;
  //random
  private Random gen;

  public init_numbers() {
  }
  public init_numbers(int seed) {
    this.seed = seed;
  }

  //public void reset() {
  //  setSeed(0);
  //  setthreadfin(false);
  //  setprogress(0);
  //  setfound(false);
  //  rand();
  //}

  public void add_usedrandnumbs(int i) {
    add_usedrandnumbs(i);
    if (possible_numbs.contains(i)) possible_numbs.remove(new Integer(i));
  }

  public void rerand() {
    clicked_box.removeAll(clicked_box);
    current_random_numb = new_current_random_numb();
  }

  public void rand() {
    stopthread();
    if (seed == 0) {
      seed = (int)((double)Math.random()*10000*Math.random());
    }
    possible_numbs.removeAll(possible_numbs);
    random_numbs = gen_random_numbs(rows, columns);
    if (extreme_calc) {
      p = new possiblenumbs().set_init_numbers(this);
      t = new Thread(p);
      t.start();
      start_numb();
    } else {
      for (int i = min; i<max; i++) {
        possible_numbs.add(i);
        setprogress((double)i/max);
      }
      setprogress(100);
      getrandom_numb();
      setthreadfin(true);
      clicked_box.removeAll(clicked_box);
    }
    current_random_numb = new_current_random_numb();
  }

  public void start_numb() {
    int index = (int)(Math.random()*rows*columns); 
    String s = calculations_list[(int)(Math.random()*calculations_list.length)];
    int direction = (int)(Math.random()*8);
    double e=-1;
    int one=random_numbs.get(index);
    int sec=1;
    int thi=1;
    switch(direction) {
    case 1:
      if (index%rows<8) {
        System.out.println(1);
        sec = random_numbs.get(index+1);
        thi = random_numbs.get(index+2);
      } else {
        start_numb();
      }
      break;
    case 2:
      if (index%rows<9 && index%columns<8) {
        System.out.println(2);
        sec = random_numbs.get(index+columns+1);
        thi = random_numbs.get(index+columns*2+2);
      } else {
        start_numb();
      }
      break;
    case 3:
      if (index%columns<8) {
        System.out.println(3);
        sec = random_numbs.get(index+columns);
        thi = random_numbs.get(index+columns*2);
      } else {
        start_numb();
      }
      break;
    case 4:
      if (index%rows>2 && index%columns<8) {
        System.out.println(4);
        sec = random_numbs.get(index+columns-1);
        thi = random_numbs.get(index+columns*2-2);
      } else {
        start_numb();
      }
      break;
    case 5:
      if (index%rows>2) {
        System.out.println(5);
        sec = random_numbs.get(index-1);
        thi = random_numbs.get(index-2);
      } else {
        start_numb();
      }
      break;
    case 6:
      if (index%rows>2 && index%columns>2) {
        System.out.println(6);
        sec = random_numbs.get(index-columns-1);
        thi = random_numbs.get(index-columns*2-2);
      } else {
        start_numb();
      }
      break;
    case 7:
      if (index%columns>2) {
        System.out.println(7);
        sec = random_numbs.get(index-columns);
        thi = random_numbs.get(index-columns*2);
      } else {
        start_numb();
      }
      break;
    case 8:
      if (index%rows>8 && index%columns>2) {
        System.out.println(8);
        sec = random_numbs.get(index-columns+1);
        thi = random_numbs.get(index-columns*2+2);
      } else {
        start_numb();
      }
      break;
    default:
      if (index%rows<8) {
        System.out.println(9);
        sec = random_numbs.get(index+1);
        thi = random_numbs.get(index+2);
      } else {
        start_numb();
      }
      break;
    }
    System.out.println("10: "+index+", "+one+", "+sec+", "+thi+", "+s);
    if (s.charAt(0) == '/' && sec == 0) {
      start_numb();
    } else if (s.charAt(1) == '/' && thi == 0) {
      start_numb();
    }
    try {
      //never use eval if with user input
      e = (double)(engine.eval(one + (s.charAt(0)+"") + sec + (s.charAt(1)+"") + thi)); 
      if (e <= r.getmin() && e >= r.getmax()) {
        e=-1;
      }
    }
    catch(Exception q) {
    }
    System.out.println(e);
    if (e>0) {
      current_random_numb=(int)e;
    }
  }

  public int new_current_random_numb() {
    //new current random Number (unique)
    if (possible_numbs.size()>0) {
      possible_numbs.remove(new Integer(current_random_numb));
      double i = Math.random() * (possible_numbs.size()-1);
      if (i<0) {
        if (possible_numbs.size() >= 1 && (possible_numbs.get(0)>min && possible_numbs.get(0)<max)) {
          return possible_numbs.get(0);
        } else {
          found_nothing = true;
          return (int) ((double)((double)Math.random()*(double)(max-min)+min));
        }
      }
      found_nothing = false;
      return possible_numbs.get((int)i);
    } else if (threadfin) {
      return (int) ((double)((double)Math.random()*(double)(max-min)+min));
    } else {
      return -2;
    }
  }

  public ArrayList<Integer> gen_random_numbs(int rows, int columns) {
    //generates random Numbers
    gen = new Random(seed);
    ArrayList<Integer> save  = new ArrayList<Integer>(rows*columns);
    for (int i  = 0; i < rows; i++) {
      for (int e  = 0; e < columns; e++) {
        save.add((int)(((double)gen.nextDouble()*(grid_max-grid_min))+grid_min));
      }
    }
    return save;
  }

  public void setSeed(int seed) {
    this.seed = seed;
  }

  public int getSeed() {
    return seed;
  }

  public void setfound(boolean found) {
    this.found_nothing = found;
  }

  public boolean getfound() {
    return found_nothing;
  }

  public ArrayList<Integer> getrandomnumbs() {
    return random_numbs;
  }

  public ArrayList<Integer> getpossiblenumbs() {
    return possible_numbs;
  }

  public void setpossiblenumbs(ArrayList<Integer> p) {
    this.possible_numbs = p;
  }

  public void getrandom_numb() {
    if (current_random_numb <= 0) {
      current_random_numb = new_current_random_numb();
    }
  }

  public String[] getcalculationlist() {
    return calculations_list;
  }

  public boolean getthreadfin() {
    return threadfin;
  }

  public void setthreadfin(boolean b) {
    threadfin = b;
  }

  public int getmin() {
    return min;
  }

  public int getminplays() {
    return min_plays;
  }

  public int getmax() {
    return max;
  }

  public int getcurrent_random_numb() {
    return current_random_numb;
  }

  public void stopthread() {
    if (t != null) {
      p.setstop();
    }
    t = null;
  }

  public void setprogress(double p) {
    this.progress = p;
  }

  public double getprogress() {
    return progress;
  }
}


class possiblenumbs extends Thread {

  private ArrayList<Integer> possible = new ArrayList<Integer>(); 
  private init_numbers n; 
  private boolean stop = false; 
  private final long m = System.currentTimeMillis(); 

  public void setstop() {
    this.stop = true;
  }

  public possiblenumbs set_init_numbers(init_numbers r) {
    n = r; 
    return this;
  }

  public void run() {
    n.setthreadfin(false); 
    check(); 
    if (possible.size()>n.getmax()-n.getmin()) {
      n.setpossiblenumbs(new ArrayList<Integer>()); 
      initpregen();
    } else {
      n.setpossiblenumbs(possible); 
      n.getrandom_numb(); 
      n.setthreadfin(true); 
      n.setprogress(100); 
      initpregen(); 
      System.out.println("Thread finished in: "+((double)System.currentTimeMillis()-m)/1000+" sec and found: "+n.getpossiblenumbs().size()+" possibilities");
    }
  }

  public void possibilities(int one_, int sec_, int thi_) {
    double one = n.getrandomnumbs().get(one_); 
    double sec = n.getrandomnumbs().get(sec_); 
    double thi = n.getrandomnumbs().get(thi_); 
    for (String s : n.getcalculationlist()) {
      if (s.charAt(0) == '/' && sec == 0) {
        continue;
      } else if (s.charAt(1) == '/' && thi == 0) {
        continue;
      }
      try {
        //never use eval if with user input
        double e = (double)(engine.eval(one + (s.charAt(0)+"") + sec + (s.charAt(1)+"") + thi)); 
        if (e > r.getmin() && e < r.getmax()) possible.add((int)e); 
        continue;
      }
      catch(Exception q) {
      }
    }
  }

  public void check() {
    int clomuns_t2  = columns << 1; 
    for (int i = 0; i<rows; i++) {
      int index_ = i*columns; 
      n.setthreadfin(false);
      for (int e = 0; e<columns; e++) {
        if (stop) return;
        int index = index_ + e;
        n.setprogress(((double)index/(rows*columns))*100);

        if (i>2 && i<rows-2 && e>2 && e<columns-2) {
          possibilities(index, index+1, index+2);
          possibilities(index, index-1, index-2);
          possibilities(index, index-columns, index-clomuns_t2);
          possibilities(index, index+columns, index+clomuns_t2);
          possibilities(index, index-columns+1, index-clomuns_t2+2);
          possibilities(index, index+columns+1, index+clomuns_t2+2);
          possibilities(index, index-columns-1, index-clomuns_t2-2);
          possibilities(index, index+columns-1, index+clomuns_t2-2);
        } else {
          if (i<2) {
            possibilities(index, index+columns, index+clomuns_t2);
            if (e>2&&e<columns-2) {
              possibilities(index, index+1, index+2);
              possibilities(index, index-1, index-2);
              possibilities(index, index+columns+1, index+clomuns_t2+2);
              possibilities(index, index+columns-1, index+clomuns_t2-2);
            }
          } else if (i>rows-2) {
            possibilities(index, index-columns, index-clomuns_t2);
            if (e>2&&e<columns-2) {
              possibilities(index, index+1, index+2);
              possibilities(index, index-1, index-2);
              possibilities(index, index-columns+1, index-clomuns_t2+2);
              possibilities(index, index-columns-1, index-clomuns_t2-2);
            }
          }
          if (e<2) {
            possibilities(index, index+1, index+2);
            if (i>2&&i<rows-2) {
              possibilities(index, index-columns, index-clomuns_t2);
              possibilities(index, index+columns, index+clomuns_t2);
              possibilities(index, index-columns+1, index-clomuns_t2+2);
              possibilities(index, index+columns+1, index+clomuns_t2+2);
            }
          } else if (e>columns-2) {
            possibilities(index, index-1, index-2);
            if (i>2&&i<rows-2) {
              possibilities(index, index-columns, index-clomuns_t2);
              possibilities(index, index+columns, index+clomuns_t2);
              possibilities(index, index-columns-1, index-clomuns_t2-2);
              possibilities(index, index+columns-1, index+clomuns_t2-2);
            }
          }
        }
      }
    }
    possible = (removeDuplicates(possible));
  }
}

public ArrayList removeDuplicates(ArrayList list) 
{
  if (list ==  null || list.size() ==  0) {
    return list;
  }
  Set set = new HashSet(list);
  list.clear();
  list.addAll(set);
  return list;
}


