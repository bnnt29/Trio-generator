import java.util.Random;
import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import java.util.Arrays;
import java.util.Collections;

class init_numbers {

  private int min_plays=30;
  private boolean threadfin;

  //grid
  private int grid_min =0;
  private int grid_max =10;
  private int min=grid_min+1;
  private int max=(grid_max-1)*(grid_max-1)+grid_max-1;

  //numbers  
  private ArrayList<Integer> possible_numbs=new ArrayList<Integer>();
  private String[] calculations_list = {"*+", "+*", "/+", "+/", "*-", "-*", "/-", "-/", "*/", "/*", "+-", "-+"};
  private ArrayList<String> calculations = new ArrayList<String>();
  private ArrayList<Integer> random_numbs = new ArrayList<Integer>();
  private int current_random_numb=0;
  private boolean found_nothing=false;
  private int seed;
  //random
  private Random gen;

  public init_numbers() {
  }
  public init_numbers(int seed) {
    this.seed=seed;
  }

  public void add_usedrandnumbs(int i) {
    add_usedrandnumbs(i);
    if (possible_numbs.contains(i)) possible_numbs.remove(new Integer(i));
  }

  public void rerand() {
    clicked_box.removeAll(clicked_box);
  }

  public void rand() {
    wait=true;
    if (seed==0) {
      seed=(int)((double)Math.random()*10000*Math.random());
    }
    gen=new Random(seed);
    clicked_box.removeAll(clicked_box);
    possible_numbs.removeAll(possible_numbs);
    random_numbs = gen_random_numbs(rows, columns);
    possible_numbs = gen_possible_numbs();
    if (possible_numbs.size()<min_plays) {
      rand();
    }
    current_random_numb=new_current_random_numb();
    wait=false;
  }

  public ArrayList<Integer> gen_possible_numbs() {
    ArrayList<Integer> s=new ArrayList<Integer>();
    for (int i=min; i<max; i++) {
      long m=System.currentTimeMillis();
      System.out.println("1: "+i+", "+m);
      if (check(i)) {
        System.out.println("2: "+i+", "+(System.currentTimeMillis()-m));
        s.add(i);
      }
    }
    return s;
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
    for (int o=0; o<calculations_list.length; o++) {
      String s=calculations_list[o];
      if (s.substring(0, 1).equals("/") && sec==0||s.substring(1, 2).equals("/") && thi==0) {
        continue;
      }
      try {
        //never use eval if with user input
        if (engine.eval(one+s.substring(0, 1)+sec+s.substring(1, 2)+thi) instanceof Integer) {
          if ((int)(engine.eval(one+s.substring(0, 1)+sec+s.substring(1, 2)+thi))==current_random_numb) return true;
        } else if (engine.eval(one+s.substring(0, 1)+sec+s.substring(1, 2)+thi) instanceof Double) {
          if ((double)(engine.eval(one+s.substring(0, 1)+sec+s.substring(1, 2)+thi))==(double)current_random_numb)return true;
        } else {
          System.out.println("unexpected class: "+engine.eval(one+s.substring(0, 1)+sec+s.substring(1, 2)+thi).getClass());
        }
      }
      catch(Exception q) {
        System.out.println(q);
        return false;
      }
    }
    return false;
  }

  public int new_current_random_numb() {
    //new current random Number (unique)
    return possible_numbs.get((int)((int)Math.random()*possible_numbs.size()-1));
  }


  public ArrayList<Integer> gen_random_numbs(int rows, int columns) {
    //generates random Numbers
    gen = new Random(seed);
    ArrayList<Integer> save =new ArrayList<Integer>(rows*columns);
    for (int i =0; i < rows; i++) {
      for (int e =0; e < columns; e++) {
        save.add((int)(((double)gen.nextDouble()*grid_max)+grid_min));
      }
    }
    return save;
  }

  public void setSeed(int seed) {
    this.seed=seed;
  }

  public int getSeed() {
    return seed;
  }

  public void setfound(boolean found) {
    this.found_nothing=found;
  }

  public boolean getfound() {
    return found_nothing;
  }

  public ArrayList<Integer> getrandomnumbs() {
    return random_numbs;
  }

  public Integer getrandom_numb() {
    return current_random_numb;
  }

  public String[] getcalculationlist() {
    return calculations_list;
  }
  
  public boolean getthreadfin(){
   return threadfin; 
  }
}
