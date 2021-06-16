import java.util.Random; //<>//
import java.awt.datatransfer.StringSelection;
import java.awt.Toolkit;
import java.awt.datatransfer.Clipboard;
import java.util.Arrays;
import java.util.Collections;

public static boolean draw=true;
import java.awt.Point;

public static boolean use_fullscreen=true;
public static int labeled=1;
public static boolean minimalistic=false;

public static final int roundboxes = 10;
public ArrayList<button> buttons = new ArrayList<button>();

//colors
public static int seed_green_fade=255;

//numbers
public static ArrayList<Integer> random_numbs = new ArrayList<Integer>();
public static ArrayList<Integer> used_random_numbs=new ArrayList<Integer>();
public static ArrayList<Integer> clicked_box=new ArrayList<Integer>();
public static int grid_min =0;
public static int grid_max =10;
public static int min=grid_min+1;
public static int max=grid_max*grid_max-1;
public static int current_random_numb=0;
public static int r_seed=0;
public static String Hex_r_seed="0000";
public static Random gen;


//grid_setup
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
public static int column_width=0;
public static int column_height=0;
public static int X_offset=0;
public static int site_distance=2;
public static int max_columns=40;
public static int min_columns=5;


boolean buttons_init = false;

void setup() {
  fullScreen();
  rand();
}

void mousePressed() {
  //disselect selected boxes
  if (!(mouseX>site_distance*column_width && mouseX<(site_distance+columns)*column_width && mouseY>(site_distance/2)*column_height && mouseY<(site_distance/2+rows)*column_height)) {
    clicked_box.removeAll(clicked_box);
  }

  if (!minimalistic) {
    //use_fullscreen
    if (buttons.get(0).isPushed()) {
      use_fullscreen = !use_fullscreen;
    }

    //rem row
    if (rows>min_columns) {
      if (buttons.get(1).isPushed()) {
        rows-=1;
        rand();
      }
    }

    //add row
    if (rows<max_columns) {
      if (buttons.get(2).isPushed()) {
        rows+=1;
        rand();
      }
    }

    //rem column
    if (columns>min_columns) {
      if (buttons.get(3).isPushed()) {
        columns-=1;
        rand();
      }
    }

    //add column
    if (columns<max_columns) {
      if (buttons.get(4).isPushed()) {
        columns+=1;
        rand();
      }
    }

    //reset_button
    if (buttons.get(5).isPushed()) {
      clicked_box.removeAll(clicked_box);
      rows=10;
      columns=10;
      r_seed=0;
      rand();
    }

    //reroll-button
    if (buttons.get(6).isPushed()) {
      rerand();
    }
  } else {
    //reroll-field
    if (buttons.get(7).isPushed()) {
      rerand();
    }
  }

  //label
  if (buttons.get(8).isPushed()) {
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

  //seed-button
  if (buttons.get(9).isPushed()) {
    String myString = r_seed+"";
    StringSelection stringSelection = new StringSelection(myString);
    Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    clipboard.setContents(stringSelection, null);
    seed_green_fade=0;
  }

  //minimalistic
  if (buttons.get(10).isPushed()) {
    minimalistic=!minimalistic;
    buttons.get(0).set_lastPressed(System.currentTimeMillis()+5);
  }

  //clickable boxes
  if (mouseX>=column_width*(site_distance)+X_offset && mouseX<=column_width*(columns+site_distance)+X_offset && mouseY>=column_height*(site_distance/2) && mouseY<=column_height*(rows+site_distance/2)+column_height) {
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
        boolean test=false;
        if(!test){
          //if (!(rows/columns==1)) {
            //System.out.println("Case 1: " + getCoordinatesForIndex(clicked_box.get(0)).toString());
            //Point
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
              //System.out.println("Nothing found");
              clicked_box.removeAll(clicked_box);
              clicked_box.add(getIndexForPoint(newPoint));
              break;
            }

            if (newNewPoint.equals(new Point())) {
              System.out.println("No valid third point");
              break;
            }
            if (getIndexForPoint(newPoint) == -1 || getIndexForPoint(newNewPoint) == -1) {
              //System.out.println("Out of bounce");
              break;
            }
            if (newnewIstAussen) {
              //System.out.println("NewNew ist außen");
              //System.out.println("NewNew ist außen");
              clicked_box.add(getIndexForPoint(newPoint));
              clicked_box.add(getIndexForPoint(newNewPoint));
            } else {
              //System.out.println("NewNew ist innen");
              clicked_box.add(getIndexForPoint(newNewPoint));
              clicked_box.add(getIndexForPoint(newPoint));
            }
          } else {
            if (clicked_box.get(0)==index-1||clicked_box.get(0)==index+1||clicked_box.get(0)==index-columns||clicked_box.get(0)==index-columns-1||clicked_box.get(0)==index-columns+1||clicked_box.get(0)==index+columns||clicked_box.get(0)==index+columns+1||clicked_box.get(0)==index+columns-1) {
              clicked_box.add(index);
              if (index-(clicked_box.get(0)-clicked_box.get(1))<0 || (index-(clicked_box.get(0)-clicked_box.get(1))>=random_numbs.size())) {
                clicked_box.removeAll(clicked_box);
              } else {
                clicked_box.add(index-(clicked_box.get(0)-clicked_box.get(1)));
              }
            } else if (clicked_box.get(0)==index-2||clicked_box.get(0)==index+2||clicked_box.get(0)==index-columns*2||clicked_box.get(0)==index-columns*2-2||clicked_box.get(0)==index-columns*2+2||clicked_box.get(0)==index+columns*2||clicked_box.get(0)==index+columns*2+2||clicked_box.get(0)==index+columns*2-2) {
              clicked_box.add(index+(clicked_box.get(0)-index)/2);
              clicked_box.add(index);
            } else {
              clicked_box.removeAll(clicked_box);
              clicked_box.add(index);
            }
            break;
          }
        }
      } else {
        clicked_box.removeAll(clicked_box);
        clicked_box.add(index);
      }
    }
  }
}

Point getCoordinatesForIndex(int i) {
  Point result = new Point();
  int index = i+1;
  int x = (int)(index-(Math.floor((float)index/(float)columns)*columns));
  int y = (int)(Math.floor((float)index/(float)rows))+1;
  System.out.println(x+", "+y);
  result.setLocation(x, y);
  if (x<1 || x>(columns) || y<1 || y>(rows))
    if (result.getX() == 0) {
      result.setLocation(columns, result.getY()-1);
      System.out.println("x = 0");
    }
  //System.out.println("Index: " + i + " " + result.toString());
  if (result.getX()<1 || result.getX()>(columns) || result.getY()<1 || result.getY()>(rows)) {
    System.out.println("Point not existent" + result.getX()+", "+columns+", "+result.getY()+", "+rows);
    return new Point();
  }
  return result;
}

int getIndexForPoint(Point p) {
  if (p.getX() < 1 || p.getX() > columns || p.getY() < 1 || p.getY() > rows)
    return -1;
  int result = (int)(p.getX()-1 + rows*(p.getY()-1));
  return result;
}

void draw() { 
  if (draw) {
    clear();
    background(0, 0, 0);
    fill(255, 255, 255);

    //grid setup
    column_height=height/(rows+site_distance);
    if (use_fullscreen) {
      X_offset=0;
      column_width=width/(columns+site_distance*2);
    } else {
      X_offset=width/8;
      column_width=column_height;
    }
    if (!buttons_init) {
      buttons_init = true;
      initButtons(buttons_init);
    }
    initButtons(false);

    //grid
    for (int i=0; i< rows; i++) {
      for (int e=0; e< columns; e++) {
        boolean right=false;
        fill(255, 255, 255);
        if (clicked_box.contains(i*columns+e)) {
          textSize((float)Math.floor((float)((float)((float)((float)((float)Math.abs(buttons.get(5).getX()-(buttons.get(0).getX()+buttons.get(0).getX())))/8+(site_distance*column_width*2))/11)*0.5f)));//textSize((float)Math.floor((float)((h/2+(w*2))/2)*0.2f));
          if (clicked_box.size()==3) {
            float xcord=column_width*1.3-column_width/1.2+X_offset/2+column_width/2;
            float y_add=(float)((buttons.get(0).getY()+buttons.get(0).getH())+(float)((float)((column_height+column_width)/2)*site_distance)/8);
            float y_mult=(float)((buttons.get(5).getY()-(buttons.get(0).getY()+buttons.get(0).getH()))/11)*1.0f;
            int one=random_numbs.get(clicked_box.get(0));
            int sec=random_numbs.get(clicked_box.get(1));
            int thi=random_numbs.get(clicked_box.get(2));
            //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
            if (Math.abs((double)one*sec+thi)==current_random_numb) {
              fill(0, 255, 0);
              right=true;
            } else {
              fill(255, 0, 0);
            }
            text(one+" * "+sec+" + "+thi, xcord, (float)(y_mult*0)+y_add);
            if (Math.abs((double)one+sec*thi)==current_random_numb) {
              fill(0, 255, 0);
              right=true;
            } else {
              fill(255, 0, 0);
            }
            text(one+" + "+sec+" * "+thi, xcord, (float)(y_mult*1)+y_add);
            if (sec!=0) {
              if (Math.abs((double)one/sec+thi)==current_random_numb) {
                fill(0, 255, 0);
                right=true;
              } else {
                fill(255, 0, 0);
              }
              text(one+" / "+sec+" + "+thi, xcord, (float)(y_mult*2)+y_add);
            }
            if (thi!=0) {
              if (Math.abs((double)one+sec/thi)==current_random_numb) {
                fill(0, 255, 0);
                right=true;
              } else {
                fill(255, 0, 0);
              }
              text(one+" + "+sec+" / "+thi, xcord, (float)(y_mult*3)+y_add);
            }
            if (Math.abs((double)one*sec-thi)==current_random_numb) {
              fill(0, 255, 0);
              right=true;
            } else {
              fill(255, 0, 0);
            }
            text(one+" * "+sec+" - "+thi, xcord, (float)(y_mult*4)+y_add);
            if (Math.abs((double)one-sec*thi)==current_random_numb) {
              fill(0, 255, 0);
              right=true;
            } else {
              fill(255, 0, 0);
            }
            text(one+" - "+sec+" * "+thi, xcord, (float)(y_mult*5)+y_add);
            if (sec!=0) {
              if (Math.abs((double)one/sec-thi)==current_random_numb) {
                fill(0, 255, 0);
                right=true;
              } else {
                fill(255, 0, 0);
              }
              text(one+" / "+sec+" - "+thi, xcord, (float)(y_mult*6)+y_add);
            }
            if (thi!=0) {
              if (Math.abs((double)one-sec/thi)==current_random_numb) {
                fill(0, 255, 0);
                right=true;
              } else {
                fill(255, 0, 0);
              }
              text(one+" - "+sec+" / "+thi, xcord, (float)(y_mult*7)+y_add);
            }
            if (Math.abs((double)one+sec-thi)==current_random_numb) {
              fill(0, 255, 0);
              right=true;
            } else {
              fill(255, 0, 0);
            }
            text(one+" + "+sec+" - "+thi, xcord, (float)(y_mult*8)+y_add);
            if (Math.abs((double)one-sec+thi)==current_random_numb) {
              fill(0, 255, 0);
              right=true;
            } else {
              fill(255, 0, 0);
            }
            text(one+" - "+sec+" + "+thi, xcord, (float)(y_mult*9)+y_add);
            if (right) {
              fill(0, 255, 0);
            } else {
              fill(255, 0, 0);
            }
          } else {
            fill(0, 0, 255);
          }
        }
        rect(column_width*(e+site_distance)+X_offset, column_height*(i+site_distance/2), column_width, column_height, roundboxes);
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        textSize((float)Math.floor((float)((column_width+column_height)/2)*0.5f));
        text(random_numbs.get(i*columns+e)+"", column_width*(e+site_distance)+X_offset+column_width/2, column_height*(i+site_distance/2)+column_height/2);
      }
    }

    //row+column numbers
    fill(255, 255, 255);
    textSize((float)Math.floor((float)((column_height+column_width)/2)*0.2f));
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

public void rerand() {
  used_random_numbs.add(gen_current_random_numb(0));
  clicked_box.removeAll(clicked_box);
}

public void rand() {
  used_random_numbs.removeAll(used_random_numbs);
  r_seed=Integer.parseInt(Hex_r_seed, 16);
  Hex_r_seed="0000";
  if (r_seed==0) {
    r_seed=(int)((double)Math.random()*(double)100000*(double)Math.random());
  }
  System.out.println(r_seed);
  gen=new Random(r_seed);
  clicked_box.removeAll(clicked_box);
  random_numbs = gen_random_numbs(rows, columns);
  used_random_numbs.add(gen_current_random_numb(0));
}

public boolean check(int r) {
  if (rows*columns>450) {
    return true;
  }
  for (int i=0; i<rows-0; i++) {
    for (int e=0; e<columns-0; e++) {
      int index=i*columns+e;
      if (i>2 && i<rows-2 && e>2 && e<columns-2) {
        if (possibilities(index, index+1, index+2, r)) return true;

        if (possibilities(index, index-1, index-2, r)) return true;

        if (possibilities(index, index-columns, index-columns*2, r)) return true;

        if (possibilities(index, index+columns, index+columns*2, r)) return true;

        if (possibilities(index, index-columns+1, index-columns*2+2, r)) return true;

        if (possibilities(index, index+columns+1, index+columns*2+2, r)) return true;

        if (possibilities(index, index-columns-1, index-columns*2-2, r)) return true;

        if (possibilities(index, index+columns-1, index+columns*2-2, r)) return true;
      } else {
        if (i<2) {
          if (possibilities(index, index+columns, index+columns*2, r)) return true;
          if (e>2&&e<columns-2) {
            if (possibilities(index, index+1, index+2, r)) return true;

            if (possibilities(index, index-1, index-2, r)) return true;

            if (possibilities(index, index+columns+1, index+columns*2+2, r)) return true;

            if (possibilities(index, index+columns-1, index+columns*2-2, r)) return true;
          }
        }
        if (i>rows-2) {
          if (possibilities(index, index-columns, index-columns*2, r)) return true;
          if (e>2&&e<columns-2) {
            if (possibilities(index, index+1, index+2, r)) return true;

            if (possibilities(index, index-1, index-2, r)) return true;

            if (possibilities(index, index-columns+1, index-columns*2+2, r)) return true;

            if (possibilities(index, index-columns-1, index-columns*2-2, r)) return true;
          }
        }
        if (e<2) {
          if (possibilities(index, index+1, index+2, r)) return true;
          if (i>2&&i<rows-2) {
            if (possibilities(index, index-columns, index-columns*2, r)) return true;

            if (possibilities(index, index+columns, index+columns*2, r)) return true;

            if (possibilities(index, index-columns+1, index-columns*2+2, r)) return true;

            if (possibilities(index, index+columns+1, index+columns*2+2, r)) return true;
          }
        }
        if (e>columns-2) {
          if (possibilities(index, index-1, index-2, r)) return true;
          if (i>2&&i<rows-2) {
            if (possibilities(index, index-columns, index-columns*2, r)) return true;

            if (possibilities(index, index+columns, index+columns*2, r)) return true;

            if (possibilities(index, index-columns-1, index-columns*2-2, r)) return true;

            if (possibilities(index, index+columns-1, index+columns*2-2, r)) return true;
          }
        }
      }
    }
  }
  return false;
}

public boolean possibilities(int one_, int sec_, int thi_, int current_random_numb) {
  double one=random_numbs.get(one_);
  double sec=random_numbs.get(sec_);
  double thi=random_numbs.get(thi_);

  if (Math.abs((double)one*sec+thi)==current_random_numb) return true;

  if (Math.abs((double)one+sec*thi)==current_random_numb) return true;

  if (sec!=0) if (Math.abs((double)one/sec+thi)==current_random_numb) return true;

  if (thi!=0) if (Math.abs((double)one+sec/thi)==current_random_numb)return true;

  if (Math.abs((double)one*sec-thi)==current_random_numb) return true;

  if (Math.abs((double)one-sec*thi)==current_random_numb) return true;

  if (sec!=0) if (Math.abs((double)one/sec-thi)==current_random_numb) return true;

  if (thi!=0) if (Math.abs((double)one-sec/thi)==current_random_numb) return true;

  if (Math.abs((double)one+sec-thi)==current_random_numb) return true;

  if (Math.abs((double)one-sec+thi)==current_random_numb) return true;

  return false;
}

public int gen_current_random_numb(int rec) {
  //gen current random Number (unique)
  rec+=1;
  if (rec>=1000) {
    current_random_numb=(int)(((double)Math.random()*max)+min);
    return current_random_numb;
  }
  current_random_numb=(int)(((double)Math.random()*max)+min);
  if (used_random_numbs.contains(current_random_numb)) {
    gen_current_random_numb(rec);
  } else if (check(current_random_numb)) {
    used_random_numbs.add(current_random_numb);
    return current_random_numb;
  } else {
    gen_current_random_numb(rec);
  }
  return  (int)(((double)Math.random()*max)+min);
}


public ArrayList<Integer> gen_random_numbs(int rows, int columns) {
  //generates random Numbers
  Random gen = new Random(r_seed);
  ArrayList<Integer> save =new ArrayList<Integer>(rows*columns);
  for (int i =0; i < rows; i++) {
    for (int e =0; e < columns; e++) {
      save.add((int)(((double)gen.nextDouble()*grid_max)+grid_min));
    }
  }
  return save;
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
0.fullscreen
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

  //use fullscreen
  fx = (int)Math.round((float)column_width-(float)column_width/1.5+(float)X_offset/2);
  fy = (int)Math.round((float)column_height*4.5f);
  fw = (int)Math.round((float)column_width*1.3f);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "fullscreen"));
  } else {
    buttons.get(0).update(fx, fy, fw, fh);
  }

  //rem_row_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round((float)column_height*((float)rows+(float)site_distance/2)+column_height/2);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "-", #FFFFFF, #00FF00));
  } else {
    if (rows<=5) {
      buttons.get(1).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(1).update(fx, fy, fw, fh, #00FF00);
    }
  }

  //add_row_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round((float)column_height*((float)rows+(float)site_distance/2));
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "+"));
  } else {
    if (rows>=max_columns) {
      buttons.get(2).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(2).update(fx, fy, fw, fh, #00FF00);
    }
  }

  //rem_column_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round(0);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "-"));
  } else {
    if (columns<=min_columns) {
      buttons.get(3).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(3).update(fx, fy, fw, fh, #00FF00);
    }
  }

  //add_column_button
  fx = (int)Math.round((float)column_width*((float)columns+(float)site_distance)+(float)X_offset+(float)10);
  fy = (int)Math.round((float)column_height/2);
  fw = (int)Math.round((float)column_width);
  fh = (int)Math.round((float)column_height/2);
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, "+"));
  } else {
    if (columns>=max_columns) {
      buttons.get(4).update(fx, fy, fw, fh, #FF0000);
    } else {
      buttons.get(4).update(fx, fy, fw, fh, #00FF00);
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
  ts = (float)Math.floor(((float)((column_height+column_width)/2)*0.2f)*3.5);
  if (used_random_numbs.size()<=max-min) {
    tc = #000000;
  } else {
    tc = #FF0000;
  }
  if (init) {
    buttons.add(new button(fx, fy, fw, fh, current_random_numb+"", tc, #FFFFFF, ts));
  } else {
    buttons.get(7).update(fx, fy, fw, fh, current_random_numb+"", ts, tc);
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
    buttons.add(new button(fx, fy, fw, fh, "seed: "+Integer.toHexString(r_seed), tc, mc));
  } else {
    buttons.get(9).update(fx, fy, fw, fh, tc, "seed: "+Integer.toHexString(r_seed), mc);
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
    buttons.add(new button(fx, fy, fw, fh, "minimalize"));
  } else {
    buttons.get(10).update(fx, fy, fw, fh);
  }
  fill(255, 255, 255);
  stroke(255, 255, 255);
}
