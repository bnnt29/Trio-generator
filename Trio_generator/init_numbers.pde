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

  public int new_current_random_numb() {
    //new current random Number (unique)
    if (possible_numbs.size()>0) {
      if (possible_numbs.contains(new Integer(current_random_numb))) possible_numbs.remove(new Integer(current_random_numb));
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
