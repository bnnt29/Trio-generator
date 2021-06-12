/*TODO: //<>//
 //1. Button for current_random_numb 
 //2. Button to reset numbers in grid
 //3. show row and colum numbers //<>//
 4. resizable grid (change rows and columns)
 5. clickable grid and automated calculation of clicked box (1.*2.+3., 1./2.+3., 1.*2.-3., 1./2.-3.) (if it is right)
 6. Button use_fullscreen
 7. optimisation, etc.....
 */
public static ArrayList<Integer> random_numbs = new ArrayList<Integer>();
public static ArrayList<Integer> used_random_numbs=new ArrayList<Integer>();
public static int grid_min =0;
public static int grid_max =10;
public static int min=grid_min+1;
public static int max=grid_max*grid_max-1;
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
public static int current_random_numb=0;
public static boolean use_fullscreen=true;
public static int column_width=0;
public static int column_height=0;
public static int X_offset=0;
public static int site_distance=0;

public static int button_colorR=255;
public static int button_colorG=0;
public static int button_colorB=0;

void setup() {
  fullScreen();
  random_numbs = gen_random_numbs(rows, columns);
  used_random_numbs.add(gen_current_random_numb());
}

void mousePressed() {
  //reroll-button
  if (mouseX>=column_width-column_width/1.5+X_offset/2 && mouseX<=column_width-column_width/1.5+column_width+X_offset/2 && mouseY>=column_width*1.3 && mouseY<=column_height*3.5+column_height/2) {
    used_random_numbs.add(gen_current_random_numb());
  }

  //reset_button
  if (mouseX>=column_width-column_width/1.5+X_offset/2 && mouseX<=column_width-column_width/1.5+column_width+X_offset/2 && mouseY>=height-site_distance*column_height && mouseY<=height-site_distance*column_height+column_height/2) {
    random_numbs = gen_random_numbs(rows, columns);
    used_random_numbs.add(gen_current_random_numb());
  }
  println(4);
  //use_fullscreen
  if (mouseX>=column_width-column_width/1.5+X_offset/2 && mouseX<=column_width-column_width/1.5+column_width+X_offset/2 && mouseY>=column_height && mouseY<=column_height+column_height/2) {
    println(1);
   if(use_fullscreen){
     println(2);
     use_fullscreen=false;
   }else{
     println(3);
     use_fullscreen=true;
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
  int nts = (int)Math.round(0.7*column_height);
  textSize(nts);//(int)Math.sqrt((column_width*column_height)/site_distance));


  //grid
  int array=0;
  for (int i=0; i< rows; i++) {
    for (int e=0; e< columns; e++) {
      fill(255, 255, 255);
      rect(column_width*(e+site_distance)+X_offset, column_height*(i+site_distance/2), column_width, column_height);
      fill(0, 0, 0);
      text(random_numbs.get(array)+"", column_width*(e+site_distance)+column_width/3+X_offset, column_height*(i+site_distance/2)+column_height/1.15);
      array+=1;
    }
  }
  //row+column numbers
  fill(255, 255, 255);
  textSize(nts/2);
  for(int i=0;i<rows;i++){
    text(i+1,column_width*(columns+site_distance)+X_offset+column_width/5,column_height*(i+site_distance/2)+column_height/2);
  }
   for(int i=0;i<columns;i++){
    text(i+1,column_width*(i+site_distance)+X_offset+column_width/2.5,column_height*site_distance/2-column_height/3);
  }

  //random number + field
  fill(255, 255, 255);
  rect(column_width-column_width/1.5+X_offset/2, column_height*2, column_width*1.3, column_height*1.3);
  fill(0, 0, 0);
  textSize(nts*1.2);
  text(current_random_numb, column_width*1.3-column_width/1.3+X_offset/2, column_height*2+column_height*1.05);

  //reroll_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width-column_width/1.5+X_offset/2, column_height*3.5, column_width*1.3, column_height/2);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0,0,0);
  } else {
    fill(255,255,255);
  }
  textSize(nts/2);
  text("reroll", column_width*1.3-column_width/1.5+X_offset/2, column_height*2.8+column_height*1.05);

  //reset_button
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width-column_width/1.5+X_offset/2, height-site_distance*column_height, column_width*1.3, column_height/2);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0,0,0);
  } else {
    fill(255,255,255);
  }
  textSize(nts/2);
  text("reset", column_width*1.3-column_width/1.5+X_offset/2, height-site_distance*column_height+column_height/3);
  
  //use fullscreen
  fill(button_colorR, button_colorG, button_colorB);
  rect(column_width-column_width/1.5+X_offset/2, column_height, column_width*1.3, column_height/2);
  if (button_colorR + button_colorG + button_colorB>255) {
    fill(0,0,0);
  } else {
    fill(255,255,255);
  }
  if(use_fullscreen){
    textSize(nts/3);
  }else{
    textSize(nts/4.5);
  }
  
  text("use fullscreen", column_width*1.3-column_width/1.2+X_offset/2, column_height*1.32);
}

public int gen_current_random_numb() {
  //gen current random Number (unique)
  current_random_numb=(int)(((double)Math.random()*max)+min);
  if (used_random_numbs.contains(current_random_numb)) {
    gen_current_random_numb();
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
