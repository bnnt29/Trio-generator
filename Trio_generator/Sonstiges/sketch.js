import java.awt.datatransfer.StringSelection; //<>//
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.util.Arrays;
import java.util.Collections;

public static boolean draw=true;
import java.awt.Point;

public static int labeled=1;
public static boolean minimalistic=false;

public static final int roundboxes = 10;
public ArrayList<button> buttons = new ArrayList<button>();

public static init_numbers r;

//colors
public static color right_color=#00FF00;
public static color wrong_color=#FF0000;
public static color pending_color=#0000FF;
public static int seed_green_fade = 255;

//numbers
public static boolean extreme_calc=true;
public static ArrayList<Integer> clicked_box=new ArrayList<Integer>();
//seed
public static String Hex_r_seed="0000";

//grid_setup
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
public static int column_width=0;
public static int column_height=0;
public static int X_offset=0;
public static int site_distance=2;
public static int max_columns=40;
public static int min_columns=5;

public static ScriptEngineManager mgr = new ScriptEngineManager();
public static ScriptEngine engine = mgr.getEngineByName("JavaScript");
boolean buttons_init = false;

void setup() {
  fullScreen();
  r=new init_numbers(Integer.parseInt(Hex_r_seed, 16));
  r.rand();
}

void mousePressed() {
  //disselect selected boxes
  boolean clicked_button=false;

  if (!minimalistic) {
    //rem row
    if (rows>min_columns) {
      if (buttons.get(1).isPushed()) {
        rows-=1;
        r.rand();
      }
    }

    //add row
    if (rows<max_columns) {
      if (buttons.get(2).isPushed()) {
        rows+=1;
        r.rand();
      }
    }

    //rem column
    if (columns>min_columns) {
      if (buttons.get(3).isPushed()) {
        columns-=1;
        r.rand();
      }
    }

    //add column
    if (columns<max_columns) {
      if (buttons.get(4).isPushed()) {
        columns+=1;
        r.rand();
      }
    }

    //reset_button
    if (buttons.get(5).isPushed()) {
      clicked_box.removeAll(clicked_box);
      rows=10;
      columns=10;
      r.setSeed(0);
      r.setthreadfin(false);
      r.setprogress(0);
      r.setfound(false);
      r.rand();
    }

    //label
    if (buttons.get(8).isPushed()) {
      clicked_button=true;
      switch(labeled) {
      case 0:
        labeled=1;
        break;
      case 1:
        labeled=2;
        break;
      case 2:
        labeled=0;
        break;
      default:
        labeled=0;
        break;
      }
    }

    //reroll-button
    if (buttons.get(6).isPushed()) {
      r.rerand();
    }
  } else {
    //reroll-field
    if (buttons.get(7).isPushed()) {
      r.rerand();
    }
  }


  //seed-button
  if (buttons.get(9).isPushed()) {
    String myString = r.getSeed()+"";
    StringSelection stringSelection = new StringSelection(myString);
    Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    clipboard.setContents(stringSelection, null);
    System.out.println("SEED: "+r.getSeed());
    seed_green_fade=0;
    clicked_button=true;
  }

  //minimalistic
  if (buttons.get(10).isPushed()) {
    minimalistic=!minimalistic;
    buttons.get(0).set_lastPressed(System.currentTimeMillis()+5);
    clicked_button=true;
  }

  //clickable boxes
  if (mouseX>=column_width*(site_distance)+X_offset && mouseX<=column_width*(columns+site_distance)+X_offset && mouseY>=column_height*(site_distance/2) && mouseY<=column_height*(rows+site_distance/2)+column_height) {
    clicked_button=true;
    int column = ((mouseX-X_offset)/column_width)-site_distance;
    int row = ((mouseY)/column_height)-(site_distance/2);
    int index = row*columns+column;
    if (clicked_box.contains(index)) {
      if (clicked_box.indexOf(index)==0) {
        clicked_box.removeAll(clicked_box);
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
            System.out.println("Second point is not valid");
            break;
          }
          //Auf x daneben
          if (newPoint.getX() == origin.getX()+1 && newPoint.getY() == origin.getY()) {
            newNewPoint.setLocation(origin.getX()+2, origin.getY());
            newnewIstAussen = true;
          } else if (newPoint.getX() == origin.getX()+2 && newPoint.getY() == origin.getY()) {
            newNewPoint.setLocation(origin.getX()+1, origin.getY());
          } else if (newPoint.getX() == origin.getX()-1 && newPoint.getY() == origin.getY()) {
            newNewPoint.setLocation(origin.getX()-2, origin.getY());  
            newnewIstAussen = true;
          } else if (newPoint.getX() == origin.getX()-2 && newPoint.getY() == origin.getY()) {
            newNewPoint.setLocation(origin.getX()-1, origin.getY());

            //Auf y daneben
          } else if (newPoint.getY() == origin.getY()+1 && newPoint.getX() == origin.getX()) {
            newNewPoint.setLocation(origin.getX(), origin.getY()+2);
            newnewIstAussen = true;
          } else if (newPoint.getY() == origin.getY()+2 && newPoint.getX() == origin.getX()) {
            newNewPoint.setLocation(origin.getX(), origin.getY()+1);
          } else if (newPoint.getY() == origin.getY()-1 && newPoint.getX() == origin.getX()) {
            newNewPoint.setLocation(origin.getX(), origin.getY()-2);
            newnewIstAussen = true;
          } else if (newPoint.getY() == origin.getY()-2 && newPoint.getX() == origin.getX()) {
            newNewPoint.setLocation(origin.getX(), origin.getY()-1);

            //Diagonal positiv
          } else if (newPoint.getY() == origin.getY()+1 && newPoint.getX() == origin.getX()+1) {
            newNewPoint.setLocation(origin.getX()+2, origin.getY()+2);
            newnewIstAussen = true;
          } else if (newPoint.getY() == origin.getY()+2 && newPoint.getX() == origin.getX()+2) {
            newNewPoint.setLocation(origin.getX()+1, origin.getY()+1);

            //Diagonal negativ
          } else if (newPoint.getY() == origin.getY()-1 && newPoint.getX() == origin.getX()-1) {
            newNewPoint.setLocation(origin.getX()-2, origin.getY()-2);
            newnewIstAussen = true;
          } else if (newPoint.getY() == origin.getY()-2 && newPoint.getX() == origin.getX()-2) {
            newNewPoint.setLocation(origin.getX()-1, origin.getY()-1);

            //Diagonal positiv negativ
          } else if (newPoint.getY() == origin.getY()+1 && newPoint.getX() == origin.getX()-1) {
            newNewPoint.setLocation(origin.getX()-2, origin.getY()+2);
            newnewIstAussen = true;
          } else if (newPoint.getY() == origin.getY()+2 && newPoint.getX() == origin.getX()-2) {
            newNewPoint.setLocation(origin.getX()-1, origin.getY()+1);

            //Diagonal negativ positiv
          } else if (newPoint.getY() == origin.getY()-1 && newPoint.getX() == origin.getX()+1) {
            newNewPoint.setLocation(origin.getX()+2, origin.getY()-2);
            newnewIstAussen = true;
          } else if (newPoint.getY() == origin.getY()-2 && newPoint.getX() == origin.getX()+2) {
            newNewPoint.setLocation(origin.getX()+1, origin.getY()-1);
          } else {
            clicked_box.removeAll(clicked_box);
            clicked_box.add(getIndexForPoint(newPoint));
            break;
          }

          if (newNewPoint.equals(new Point())) {
            System.out.println("No valid third point");
            break;
          }
          if (getIndexForPoint(newPoint) == -1 || getIndexForPoint(newNewPoint) == -1) {
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
        clicked_box.removeAll(clicked_box);
        clicked_box.add(index);
      }
    }
  }
  if (!clicked_button) {
    clicked_box.removeAll(clicked_box);
  }
}

Point getCoordinatesForIndex(int i) {
  Point result = new Point();
  int index = i+1;
  int x = (int)(index-(Math.floor((float)index/(float)columns)*columns));
  int y = (int)(Math.floor((float)index/columns))+1;
  result.setLocation(x, y);
  if (x<1 || x>(columns) || y<1 || y>(rows))
    if (result.getX() == 0) {
      result.setLocation(columns, result.getY()-1);
    }
  if (result.getX()<1 || result.getX()>(columns) || result.getY()<1 || result.getY()>(rows)) {
    System.out.println("Point not existent");
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
  if (draw) {
    clear();
    background(50, 50, 50);
    fill(255, 255, 255);

    //grid setup
    column_height=height/(rows+site_distance);
    X_offset=0;
    column_width=width/(columns+site_distance*2);
    if (!buttons_init) {
      buttons_init = true;
      initButtons(buttons_init);
    }
    initButtons(false);

    //grid
    for (int i=0; i< rows; i++) {
      for (int e=0; e< columns; e++) {
        boolean right=false;
        int possibilities=r.calculations_list.length;
        fill(#FFFFFF);
        if (clicked_box.contains(i*columns+e)) {
          textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs(buttons.get(5).getX()-(buttons.get(0).getX()+buttons.get(0).getX())))/possibilities+(site_distance*column_width*2))/11)*0.5f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
          if (clicked_box.size()==3) {
            float xcord=0;
            float y_add=0;
            float y_mult=0;
            if (minimalistic) {
              button ref_one=buttons.get(7);
              xcord=column_width*1.3-column_width/1.2+X_offset/2+column_width/2;
              y_add=(float)((ref_one.getY()+ref_one.getH())+(float)((float)((column_height+column_width)/2)*(site_distance-1.7)));
              y_mult=(float)(((height-column_height)-(ref_one.getY()+ref_one.getH()))/possibilities+5)*1.0f;
              textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs((height-column_height)-(ref_one.getX()+ref_one.getX())))/8+(site_distance*column_width*2))/11)*0.8f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
            } else {
              button ref_one=buttons.get(6);
              button ref_sec=buttons.get(5);
              xcord=column_width*1.3-column_width/1.2+X_offset/2+column_width/2;
              y_add=(float)((ref_one.getY()+ref_one.getH())+(float)((float)((column_height+column_width)/2)*(site_distance-1.7)));
              y_mult=(float)((ref_sec.getY()-(ref_one.getY()+ref_one.getH()))/(possibilities+7))*1.5f;
              textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs(ref_sec.getX()-(ref_one.getX()+ref_one.getX())))/8+(site_distance*column_width*2))/11)*0.8f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
            }

            int one=r.getrandomnumbs().get(clicked_box.get(0));
            int sec=r.getrandomnumbs().get(clicked_box.get(1));
            int thi=r.getrandomnumbs().get(clicked_box.get(2));
            //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
            if (r.getcurrent_random_numb()>0) {
              for (int o=0; o<r.getcalculationlist().length; o++) {
                double out=-1;
                String s=r.getcalculationlist()[o];
                r.calculations.add(s);
                if (s.charAt(0)=='/' && sec==0||s.charAt(1)=='/' && thi==0) {
                  continue;
                }
                try {
                  try {
                    //never use eval if with user input
                    out=(double)(engine.eval(one+(s.charAt(0)+"")+sec+(s.charAt(1)+"")+thi));
                  }
                  catch(ClassCastException u) {
                    //never use eval if with user input
                    out=(int)(engine.eval(one+(s.charAt(0)+"")+sec+(s.charAt(1)+"")+thi));
                  }
                }
                catch(ScriptException q) {
                }
                catch(Exception q) {
                  System.out.println(q);
                }
                if (out==r.getcurrent_random_numb()) {
                  fill(right_color);
                  right=true;
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
        rect(column_width*(e+site_distance)+X_offset, column_height*(i+site_distance/2), column_width, column_height, roundboxes);
        if (clicked_box.size()>0&&clicked_box.size()<2) {
          if (clicked_box.get(0)==i*columns+e) {
            fill(#FFFFFF);
          } else {
            fill(0, 0, 0);
          }
        } else {
          fill(0, 0, 0);
        }
        textAlign(CENTER, CENTER);
        textSize((float)Math.floor((float)((column_width+column_height)/2)*0.5f));
        text(r.getrandomnumbs().get(i*columns+e)+"", column_width*(e+site_distance)+X_offset+column_width/2, column_height*(i+site_distance/2)+column_height/2);
      }
    }


    //row+column numbers
    fill(255, 255, 255);
    if (minimalistic) {
      textSize((float)Math.floor((float)((column_height+column_width)/2)*0.5f));
    } else {
      textSize((float)Math.floor((float)((column_height+column_width)/2)*0.4f));
    }
    if (labeled==2) {
      text("y", column_width*(columns+site_distance)+X_offset+column_width/2.5+column_width/3, column_height*(0+site_distance/2)+column_height/2); 
      text("x", column_width*(0+site_distance)+X_offset+column_width/2.5, column_height*site_distance/2-column_height/3-column_height/3);
    }
    for (int i=0; i<rows; i++) {
      ArrayList<Character> abc = init_abc_list();
      if (labeled==1 && rows<=abc.size()) {
        text(abc.get(i), column_width*(columns+site_distance)+X_offset+column_width/2.5, column_height*(i+site_distance/2)+column_height/2);
      } else {
        text(i+1, column_width*(columns+site_distance)+X_offset+column_width/2.5, column_height*(i+site_distance/2)+column_height/2);
      }
    }
    for (int i=0; i<columns; i++) {
      text(i+1, column_width*(i+site_distance)+X_offset+column_width/2, column_height*site_distance/2-column_height/3);
    }



    if (!minimalistic) {
      for (button b : buttons) {
        b.drawMe();
      }
    } else {
      buttons.get(7).drawMe(); 
      buttons.get(10).drawMe();
    }
    draw=!draw;
  } else {
    draw=!draw;
  }
}

public ArrayList<Character> init_abc_list() {
  Character[] alphabet = {'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
  ArrayList<Character> abc = new ArrayList<Character>();
  for (Character c : alphabet) {
    abc.add(c);
  }
  return abc;
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
  float ts=0;
  color mc;
  color tc;

  fx = 0;
  fy = 0;
  fw = 0;
  fh = 0;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, 1));
  }

  //rem_row_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round((float)column_height*((float)rows+(float)site_distance/2)+column_height/2);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "-", #000000, #FFFFFF));
  } else {
    if (rows<=5) {
      buttons.get(1).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(1).update(fx, fy, fw, fh, #FFFFFF);
    }
  }

  //add_row_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round((float)column_height*((float)rows+(float)site_distance/2));
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "+", #000000, #FFFFFF));
  } else {
    if (rows>=max_columns) {
      buttons.get(2).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(2).update(fx, fy, fw, fh, #FFFFFF);
    }
  }

  //rem_column_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round(0);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "-", #000000, #FFFFFF));
  } else {
    if (columns<=min_columns) {
      buttons.get(3).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(3).update(fx, fy, fw, fh, #FFFFFF);
    }
  }

  //add_column_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round((float)column_height/2);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "+", #000000, #FFFFFF));
  } else {
    if (columns>=max_columns) {
      buttons.get(4).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(4).update(fx, fy, fw, fh, #FFFFFF);
    }
  }

  //reset_button
  fx = (int)Math.round((float)column_width-(float)column_width/1.5+(float)X_offset/2);
  fy = (int)Math.round((float)height-(float)column_height/1.5);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "reset"));
  } else {
    buttons.get(5).update(fx, fy, fw, fh);
  }

  //reroll_button
  fx = (int)Math.round((float)column_width-(float)column_width/1.5+(float)X_offset/2);
  fy = (int)Math.round((float)column_height*3.5f);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "reroll"));
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
  if (r.getcurrent_random_numb()>0) {
    if (r.getthreadfin()) {
      if ((double)((int)(r.getprogress()*10))/10>99) {
        if (!r.getfound()) {
          tc = #000000;
          mc=#FFFFFF;
        } else {
          tc = #FFFFFF;
          mc=#0000FF;
        }
      } else {
        tc=#000000;
        mc=#FFFFFF;
      }
      if (init) {
        buttons.add(new button(fx, fy, fw, fh, r.getcurrent_random_numb()+"", tc, mc, ts));
      } else {
        buttons.get(7).update(fx, fy, fw, fh, r.getcurrent_random_numb()+"", ts, tc, mc);
      }
    } else {
      tc = #000000;
      mc = #FF0000;
      ts =(float)Math.floor(((float)((column_height+column_width)/2)*0.2f)*2.5);
      if (init) {
        buttons.add(new button(fx, fy, fw, fh, (double)((int)(r.getprogress()*10))/10+"%", tc, mc, ts));
      } else {
        buttons.get(7).update(fx, fy, fw, fh, (double)((int)(r.getprogress()*10))/10+"%", ts, tc, mc);
      }
    }
  } else {
    r.getrandom_numb();
    tc = #000000;
    mc = #FF0000;
    ts =(float)Math.floor(((float)((column_height+column_width)/2)*0.2f)*2.5);
    if (init) {
      buttons.add(new button(fx, fy, fw, fh, (double)((int)(r.getprogress()*10))/10+"%", tc, mc, ts));
    } else {
      buttons.get(7).update(fx, fy, fw, fh, (double)((int)(r.getprogress()*10))/10+"%", ts, tc, mc);
    }
  }



  //label
  fx = (int)Math.round((float)column_width-(float)column_width/1.5f+(float)X_offset/2);
  fy = (int)Math.round((float)column_height/3);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "label"));
  } else {
    buttons.get(8).update(fx, fy, fw, fh);
  }

  //seed
  fx = (int)Math.round(width/2);
  fy = (int)Math.round(height/100);
  fw = (int)Math.round((float)column_width*1.2f);
  fh = (int)Math.round((float)column_height/4);
  tc =color(seed_green_fade, 255, seed_green_fade);
  mc=#000000;
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "seed: "+Integer.toHexString(r.getSeed()), tc, g.backgroundColor));
  } else {
    buttons.get(9).update(fx, fy, fw, fh, tc, "seed: "+Integer.toHexString(r.getSeed()), g.backgroundColor);
    if (seed_green_fade<255) {
      seed_green_fade+=3;
    }
  }

  //minimalistic
  fx = (int)Math.round((float)column_width-(float)column_width/1.5f+(float)X_offset/2);
  fy = (int)Math.round((float)column_height);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "minimal"));
  } else {
    //buttons.get(10).update(fx, fy, fw, fh);
  }
  fill(255, 255, 255);
  stroke(255, 255, 255);
  if (init) {
    for (button b : buttons) {
      b.lastPressed=System.currentTimeMillis()+5;
    }
  }
}