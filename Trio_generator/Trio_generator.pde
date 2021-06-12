/*TODO: //<>// //<>//
 //1. Button for current_random_numb 
 //2. Button to reset numbers in grid
 //3. show row and colum numbers
 //4. resizable grid (change rows and columns)
 //5. clickable grid and automated calculation of clicked box (1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3) (if it is right)
 //6. Button use_fullscreen
 7. optimisation, etc.....
 */

public static boolean use_fullscreen=true;
public static int recursiv=0;

public static final int roundboxes = 10;

//numbers
public static ArrayList<Integer> random_numbs = new ArrayList<Integer>();
public static ArrayList<Integer> used_random_numbs=new ArrayList<Integer>();
public static ArrayList<Integer> clicked_box=new ArrayList<Integer>();
public static int grid_min =0;
public static int grid_max =10;
public static int min=grid_min+1;
public static int max=grid_max*grid_max-1;
public static int current_random_numb=0;

//grid_setup
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
public static int column_width=0;
public static int column_height=0;
public static int X_offset=0;
public static int site_distance=0;

//colors
public static int button_colorR=255;
public static int button_colorG=0;
public static int button_colorB=0;

void setup() {
  fullScreen();
  rand();
}

void mousePressed() {
  //reroll-button
  if (mouseX>=column_width-column_width/1.5+X_offset/2 && mouseX<=column_width-column_width/1.5+column_width+X_offset/2 && mouseY>=column_width*1.3 && mouseY<=column_height*3.5+column_height/2) {
    used_random_numbs.add(gen_current_random_numb(0));
    clicked_box.removeAll(clicked_box);
  }

  //reset_button
  if (mouseX>=column_width-column_width/1.5+X_offset/2 && mouseX<=column_width-column_width/1.5+column_width+X_offset/2 && mouseY>=height-site_distance*column_height && mouseY<=height-site_distance*column_height+column_height/2) {
    clicked_box.removeAll(clicked_box);
    rows=10;
    columns=10;
    rand();
  }
  //use_fullscreen
  if (mouseX>=column_width-column_width/1.5+X_offset/2 && mouseX<=column_width-column_width/1.5+column_width+X_offset/2 && mouseY>=column_height && mouseY<=column_height+column_height/2) {
    if (use_fullscreen) {
      use_fullscreen=false;
    } else {
      use_fullscreen=true;
    }
  }

  //clickable boxes
  if (mouseX>=column_width*(site_distance)+X_offset && mouseX<=column_width*(columns+site_distance)+X_offset && mouseY>=column_height*(site_distance/2) && mouseY<=column_height*(rows+site_distance/2)+column_height) {
    int column = ((mouseX-X_offset)/column_width)-site_distance;
    int row = ((mouseY)/column_height)-(site_distance/2);
    int index = row*columns+column;
    //println(column+", "+row+", "+index);
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
          if (clicked_box.get(0)==index-1||clicked_box.get(0)==index+1||clicked_box.get(0)==index-columns||clicked_box.get(0)==index-columns-1||clicked_box.get(0)==index-columns+1||clicked_box.get(0)==index+columns||clicked_box.get(0)==index+columns+1||clicked_box.get(0)==index+columns-1) {
            clicked_box.add(index);
            clicked_box.add(index-(clicked_box.get(0)-clicked_box.get(1)));
          } else if (clicked_box.get(0)==index-2||clicked_box.get(0)==index+2||clicked_box.get(0)==index-columns*2||clicked_box.get(0)==index-columns*2-2||clicked_box.get(0)==index-columns*2+2||clicked_box.get(0)==index+columns*2||clicked_box.get(0)==index+columns*2+2||clicked_box.get(0)==index+columns*2-2) {
            clicked_box.add(index+(clicked_box.get(0)-index)/2);
            clicked_box.add(index);
          } else {
            clicked_box.removeAll(clicked_box);
          }
          break;
        }
      } else {
        clicked_box.removeAll(clicked_box);
      }
    }
  }

  //add column
  if (columns<50) {
    if (mouseX>=column_width*(columns+site_distance)+X_offset+10 && mouseX<=column_width*(columns+site_distance)+X_offset+10+column_width && mouseY>=column_height/2&&mouseY<=column_height/2+column_height/2) {
      columns+=1;
      rand();
    }
  }

  //rem column
  if (columns>5) {
    if (mouseX>=column_width*(columns+site_distance)+X_offset+10 && mouseX<=column_width*(columns+site_distance)+X_offset+10+column_width && mouseY>=0&&mouseY<=0+column_height/2) {
      columns-=1;
      rand();
    }
  }

  //add row
  if (rows<50) {
    if (mouseX>=column_width*(columns+site_distance)+X_offset+10 && mouseX<=column_width*(columns+site_distance)+X_offset+10+column_width && mouseY>=column_height*(rows+site_distance/2)&&mouseY<=column_height*(rows+site_distance/2)+column_height/2) {
      rows+=1;
      rand();
    }
  }

  //rem row
  if (rows>5) {
    if (mouseX>=column_width*(columns+site_distance)+X_offset+10 && mouseX<=column_width*(columns+site_distance)+X_offset+10+column_width && mouseY>=column_height*(rows+site_distance/2)+column_height/2&&mouseY<=column_height*(rows+site_distance/2)+column_height/2+column_height/2) {
      rows-=1;
      rand();
    }
  }
}

void draw() {
  clear();
  background(0, 0, 0);
  fill(255, 255, 255);

  //grid setup
  site_distance=2;
  column_height=height/(rows+site_distance);
  if (use_fullscreen) {
    X_offset=0;
    column_width=width/(columns+site_distance*2);
  } else {
    X_offset=width/8;
    column_width=column_height;
  }
  int nts = (int)Math.round(0.7*(column_height+column_width)/2);
  textSize(nts);//(int)Math.sqrt((column_width*column_height)/site_distance));


  //grid
  for (int i=0; i< rows; i++) {
    for (int e=0; e< columns; e++) {
      boolean rigth=false;
      fill(255, 255, 255);
      if (clicked_box.contains(i*columns+e)) {
        textSize(nts/3);
        if (clicked_box.size()==3) {
          int one=random_numbs.get(clicked_box.get(0));
          int sec=random_numbs.get(clicked_box.get(1));
          int thi=random_numbs.get(clicked_box.get(2));
          //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
          if (one*sec+thi==current_random_numb) {
            fill(0, 255, 0);
            text(one+" * "+sec+" + "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*5);
            rigth=true;
          } else {
            fill(255, 0, 0);
            text(one+" * "+sec+" + "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*5);
          }
          if (one+sec*thi==current_random_numb) {
            fill(0, 255, 0);
            text(one+" + "+sec+" * "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*5.5);
            rigth=true;
          } else {
            fill(255, 0, 0);
            text(one+" + "+sec+" * "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*5.5);
          }
          if (sec!=0) {
            if (one/sec+thi==current_random_numb) {
              fill(0, 255, 0);
              text(one+" / "+sec+" + "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*6);
              rigth=true;
            } else {
              fill(255, 0, 0);
              text(one+" / "+sec+" + "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*6);
            }
          }
          if (thi!=0) {
            if (one+sec/thi==current_random_numb) {
              fill(0, 255, 0);
              text(one+" + "+sec+" / "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*6.5);
              rigth=true;
            } else {
              fill(255, 0, 0);
              text(one+" + "+sec+" / "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*6.5);
            }
          }
          if (one*sec-thi==current_random_numb) {
            fill(0, 255, 0);
            text(one+" * "+sec+" - "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*7);
            rigth=true;
          } else {
            fill(255, 0, 0);
            text(one+" * "+sec+" - "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*7);
          }
          if (one-sec*thi==current_random_numb) {
            fill(0, 255, 0);
            text(one+" - "+sec+" * "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*7.5);
            rigth=true;
          } else {
            fill(255, 0, 0);
            text(one+" - "+sec+" * "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*7.5);
          }
          if (sec!=0) {
            if (one/sec-thi==current_random_numb) {
              fill(0, 255, 0);
              text(one+" / "+sec+" - "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*8);
              rigth=true;
            } else {
              fill(255, 0, 0);
              text(one+" / "+sec+" - "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*8);
            }
          }
          if (thi!=0) {
            if (one-sec/thi==current_random_numb) {
              fill(0, 255, 0);
              text(one+" - "+sec+" / "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*8.5);
              rigth=true;
            } else {
              fill(255, 0, 0);
              text(one+" - "+sec+" / "+thi, column_width*1.3-column_width/1.2+X_offset/2, column_height*8.5);
            }
          }
          if (rigth) {
            fill(0, 255, 0);
          } else {
            fill(255, 0, 0);
          }
        } else {
          fill(0, 0, 255);
        }
      }
      rect(column_width*(e+site_distance)+X_offset, column_height*(i+site_distance/2), column_width, column_height,roundboxes);
      fill(0, 0, 0);
      textSize(nts);
      text(random_numbs.get(i*columns+e)+"", column_width*(e+site_distance)+column_width/3+X_offset, column_height*(i+site_distance/2)+column_height/1.15);
    }
  }
  //row+column numbers
  fill(255, 255, 255);
  textSize(nts/2);
  for (int i=0; i<rows; i++) {
    text(i+1, column_width*(columns+site_distance)+X_offset+column_width/5, column_height*(i+site_distance/2)+column_height/2);
  }
  for (int i=0; i<columns; i++) {
    text(i+1, column_width*(i+site_distance)+X_offset+column_width/2.5, column_height*site_distance/2-column_height/3);
  }

  //random number + field
  fill(255, 255, 255);
  rect(column_width-column_width/1.5+X_offset/2, column_height*2, column_width*1.3, column_height*1.3,roundboxes);
  fill(0, 0, 0);
  textSize(nts*1.2);
  text(current_random_numb, column_width*1.3-column_width/1.3+X_offset/2, column_height*2+column_height*1.05);

  //reroll_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width-column_width/1.5+X_offset/2, column_height*3.5, column_width*1.3, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  textSize(nts/2);
  text("reroll", column_width*1.3-column_width/1.5+X_offset/2, column_height*2.8+column_height*1.05);

  //reset_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width-column_width/1.5+X_offset/2, height-site_distance*column_height, column_width*1.3, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  textSize(nts/2);
  text("reset", column_width*1.3-column_width/1.5+X_offset/2, height-site_distance*column_height+column_height/3);

  //add_column_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width*(columns+site_distance)+X_offset+10, column_height/2, column_width, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  textSize(nts/2);
  text("+", column_width*(columns+site_distance)+X_offset+column_width/2.2, column_height/2+column_height/2.7);

  //rem_column_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width*(columns+site_distance)+X_offset+10, 0, column_width, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  textSize(nts/2);
  text("-", column_width*(columns+site_distance)+X_offset+column_width/2.2, 0+column_height/2.7);

  //add_row_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width*(columns+site_distance)+X_offset+10, column_height*(rows+site_distance/2), column_width, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  textSize(nts/2);
  text("+", column_width*(columns+site_distance)+X_offset+column_width/2.2, column_height*(rows+site_distance/2)+column_height/2.7);

  //rem_row_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width*(columns+site_distance)+X_offset+10, column_height*(rows+site_distance/2)+column_height/2, column_width, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  textSize(nts/2);
  text("-", column_width*(columns+site_distance)+X_offset+column_width/2.2, column_height*(rows+site_distance/2)+column_height/2+column_height/2.7);


  //use fullscreen
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width-column_width/1.5+X_offset/2, column_height, column_width*1.3, column_height/2,roundboxes);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
  if (use_fullscreen) {
    textSize(nts/3);
  } else {
    textSize(nts/4.5);
  }

  text("use fullscreen", column_width*1.3-column_width/1.02+X_offset/2, column_height*1.32);
}

public void rand() {
  clicked_box.removeAll(clicked_box);
  random_numbs = gen_random_numbs(rows, columns);
  used_random_numbs.add(gen_current_random_numb(0));
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
  }
  return current_random_numb;
}


public ArrayList<Integer> gen_random_numbs(int rows, int columns) {
  //generates random Numbers
  ArrayList<Integer> save =new ArrayList<Integer>(rows*columns);
  for (int i =0; i < rows; i++) {
    for (int e =0; e < columns; e++) {
      save.add((int)(((double)Math.random()*grid_max)+grid_min));
    }
  }
  return save;
}
