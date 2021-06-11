public static ArrayList<Integer> random_numbs = new ArrayList<Integer>();
public static int grid_min =0;
public static int grid_max =10;
public static int min=grid_min+1;
public static int max=grid_max*grid_max-1;
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
public static int current_random_numb=0;
void setup(){
  fullScreen();
  random_numbs = gen_random_numbs(rows, columns);
  current_random_numb=(int)(((double)Math.random()*max)+min);
}

void mousePressed(){
  
}

void draw(){
  clear();
  background(0,0,0);
  fill(255, 255, 255);
 
  int site_distance=2;
  int column_width=width/(columns+site_distance*2);
  int column_height=height/(rows+site_distance);
  textSize((int)Math.sqrt((column_width*column_height)/site_distance));
  
  int array=0;
  for(int i=0; i< rows;i++){
    for(int e=0;e< columns;e++){
      fill(255, 255, 255);
      rect(column_width*(e+site_distance), column_height*(i+site_distance/2), column_width, column_height);
      fill(0,0,0);
      text(random_numbs.get(array)+"", column_width*(e+site_distance)+column_width/3, column_height*(i+site_distance/2)+column_height/1.15);
      array+=1;
    }
  }
  fill(255, 255, 255);
  rect(column_width-column_width/1.5, column_height*2, column_width*1.3, column_height*1.3);
  fill(0,0,0);
  textSize((int)Math.sqrt((column_width-column_width/1.5*column_height*2)/site_distance));
  text(current_random_numb, column_width-column_width/2.5, column_height*2+column_height*1.05);
   
}

public ArrayList<Integer> gen_random_numbs(int rows, int columns){
  //generates random Numbers
  ArrayList<Integer> save =new ArrayList<Integer>(rows*columns);
  for(int i =0; i < rows;i++){
    for(int e =0; e < columns;e++){
      save.add((int)(((double)Math.random()*grid_max)+grid_min));
    }
  }
  return save;
}
