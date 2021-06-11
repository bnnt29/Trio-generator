public static ArrayList<Integer> random_numbs = new ArrayList<Integer>();
public static int min =0;
public static int max =10;
public static int rows = 10; //Zeilen
public static int columns = 10; //Spalten
void setup(){
  fullScreen();
  random_numbs = gen_random_numbs(rows, columns);
 
}

void mousePressed(){
  
}

void draw(){
  clear();
  background(0,0,0);
  fill(255, 255, 255);
 
  int site_distance=2;
  int colum_width=width/(columns+site_distance*2);
  int column_height=height/(rows+site_distance);
  textSize((int)Math.sqrt((colum_width*column_height)/site_distance));
  
  int i=0;
  for(int i=0; i< rows;i++){
    for(int e=0;e< columns;e++){
      fill(255, 255, 255);
      rect(colum_width*(e+site_distance), column_height*(i+site_distance/2), colum_width, column_height);
      fill(0,0,0);
      text(random_numbs.get(i)+"", colum_width*(e+site_distance)+colum_width/3, column_height*(i+site_distance/2)+column_height/1.15);
      i+=1;
    }
  }
}

public ArrayList<Integer> gen_random_numbs(int rows, int columns){
  //generates random Numbers
  ArrayList<Integer> save =new ArrayList<Integer>(rows*columns);
  for(int i =0; i < rows;i++){
    for(int e =0; e < columns;e++){
      save.add((int)(((double)Math.random()*max)+min));
    }
  }
  return save;
}
