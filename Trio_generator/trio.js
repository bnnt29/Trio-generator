var draw = 8;

//label
var x_buttons = [];
var y_buttons = [];
var labeledint = 1;
var labeledbool = true;
var labelbuttons = [];
var label_init = true;

var minimalistic = false;

var roundboxes = 10;
var buttons = [];

var darkmode = false

var r;
var r2;

//colors
var right_color = "#00FF00";
var wrong_color = "#FF0000";
var pending_color = "#0000FF";
var seed_green_fade = 255;

//numbers
var extreme_calc = true;
var clicked_box = [];
var possible_box = [];
var box = [];
//seed
var Hex_r_seed = "0000";

//grid_setup
var rows = 10; //Zeilen
var columns = 10; //Spalten
var column_width = 0;
var column_height = 0;
var X_offset = 0;
var site_distance = 2;
var max_columns = 40;
var min_columns = 5;

var buttons_init = false;

//function setup(){r=new init_numbers(Integer.parseInt(Hex_r_seed,16));r.rand();fullScreen();}
function setup() {
  rand();
  gen_html_fields();
}

function gen_html_fields() {
  let b;
  var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight || docElem.clientHeight || body.clientHeight;
  console.log("1:" + rows);
  let height = (100 / (rows * 1.1)) + "%";
  let width = (100 / (columns * 1.1)) + "%";
  for (let i = 0; i < rows; i++) {
    //console.log("2:" + i + ", " + columns);
    let row = document.createElement("div");
    row.classList.add("row");
    row.id = "r" + i;
    row.style.justifyContent = "center";
    row.style.height = height;
    for (let e = 0; e < columns; e++) {
      //console.log("3:" + e);
      b = document.createElement("button");
      b.id = "r" + i + ",c" + e;
      box = [...box, "r" + i + ",c" + e];
      b.setAttribute("value", i * e);
      b.onclick = function () { field_pressed(i, e) };
      b.innerHTML = i * e;
      button_styles(b, height, width);
      row.appendChild(b);
    }
    document.getElementById("container").appendChild(row);
    document.getElementById("container").style.height = y + "px";
  }
  b = document.getElementById("current_rand");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = height;
  b = document.getElementById("reroll_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows * 1.1)) / 3 + "%";
  b.style.marginTop = "1rem";
  document.getElementById("buts_container").style.minHeight = "5rem";
}

function button_styles(b, height, width) {
  b.style.paddingLeft = 0;
  b.style.paddingRight = 0;
  if (height <= 0 || width <= 0) {
    height = 0;
    width = 0;
    b.style.borderLeftWidth = 0;
    b.style.borderRightWidth = 0;
  }
  b.style.fontSize = "90 vmin";
  b.style.minHeight = 0;
  b.style.minWidth = 0;
  b.style.whiteSpace = "nowrap";
  b.style.overflow = "hidden";
  b.style.height = "100%";
  b.style.width = width;
  b.style.backgroundColor = "#FFFFFF";
  b.style.borderRadius = "20%";
}

function field_pressed(i, e) {
  let b = document.getElementById("r" + i + ",c" + e);
  //console.log(i + ", " + e + ", " + b.style.backgroundColor);
  //b.style.backgroundColor = "#FF0000";

  let right = false;
  let possibilities = calculations_list;
  b.style.backgroundColor = "#FFFFFF";
  if (!clicked_box.includes("r" + i + ",c" + e)) {
    clicked_box = [...clicked_box, "r" + i + ",c" + e];
    if (clicked_box.length == 3) {
      let one = document.getElementById(clicked_box[0]).getAttribute("value");
      let sec = document.getElementById(clicked_box[1]).getAttribute("value");
      let thi = document.getElementById(clicked_box[2]).getAttribute("value");
      //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
      if (1 > 0) {
        for (let o = 0; o < possibilities.length; o++) {
          let out = -1; let s = possibilities[o]; calculations = [...calculations, s];
          if (s.charAt(0) == '/' && sec == 0 || s.charAt(1) == '/' && thi == 0) { continue; }
          //never use eval if with user input
          out = (eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
          if (out == 1) { clicked_box.forEach((data) => { document.getElementById(data).style.backgroundColor = right_color; }); right = true; } else { clicked_box.forEach((data) => { document.getElementById(data).style.backgroundColor = wrong_color; }); right = false; }
        }
      } if (right) { b.style.backgroundColor = right_color; } else { b.style.backgroundColor = wrong_color; }
    } else { b.style.backgroundColor = pending_color; }
  } else {
    clicked_box.splice(clicked_box.indexOf("r" + i + ",c" + e), clicked_box.indexOf("r" + i + ",c" + e) + 1);
    b.style.backgroundColor = "#FFFFFF";
    clicked_box.forEach((data) => { document.getElementById(data).style.backgroundColor = pending_color; });
  }
  // text(r.getrandomnumbs().get(i * columns + e) + "", column_width * (e + site_distance) + X_offset + column_width / 2 + x, column_height * (i + site_distance / 2) + column_height / 2);
}

function draw() {
  if (draw <= 0) {
    if (!buttons_init) {
      buttons_init = true;
      initButtons(buttons_init);
    }
    initButtons(false);

    //row+column numbers

    let abc = [];
    let x = 0;
    let tc;
    //x-buttons
    let maxx = 0;
    let xb;
    if (labelbuttons.size() > 0) { xb = labelbuttons.get(0); maxx = xb.size(); } else { xb = []; maxx = columns; }
    abc = init_label_list(false);
    for (let i = 0; i < maxx; i++) {
      tc = "#FFFFFF"; clicked_box.forEach((clb) => { if ((getCoordinatesForIndex(clb).getX() - 1 == i)) { if (clicked_box.size() == 1) { tc = pending_color; } else { tc = right_color; } } });
      if (labeledbool) { x = (column_width * (i + 0.5 + site_distance) + X_offset); } else { x = column_width * (i + site_distance) + X_offset; }
      if (label_init) { xb.add(new button(x + column_width / 4, column_height * (site_distance / 4), column_width / 2, column_height, abc.get(i) + "", tc, g.backgroundColor, ts)); } else { if (x_buttons.contains(xb.get(i)) && clicked_box.size() < 1) { tc = "#28B05C"; } xb.get(i).update(x + column_width / 4, column_height * (site_distance / 4), column_width / 2, column_height, abc.get(i) + "", ts, tc); }
    }
    if (label_init) { labelbuttons.add(xb); }
    //y-buttons
    let maxy = 0; let yb;
    if (labelbuttons.size() > 1) { yb = labelbuttons.get(1); maxy = yb.size(); } else { yb = []; maxy = rows; }
    if (labeledint == 1 && rows <= 24) { abc = init_label_list(true); } else { abc = init_label_list(false); }
    for (let i = 0; i < maxy; i++) {
      tc = "#FFFFFF"; clicked_box.forEach((clb) => { if ((getCoordinatesForIndex(clb).getY() - 1 == i)) { if (clicked_box.size() == 1) { tc = pending_color; } else { tc = right_color; } } });
      if (labeledbool) { x = (column_width * (site_distance) + X_offset); } else { x = (column_width * ((let)(columns + 0.2 + site_distance)) + X_offset); }
      if (label_init) { yb.add(new button(x - column_width / 8, column_height * (i + site_distance / 2), column_width / 2, column_height, abc.get(i) + "", tc, g.backgroundColor, ts)); } else { if (y_buttons.contains(yb.get(i)) && clicked_box.size() < 1) { tc = "#28B05C"; } yb.get(i).update(x - column_width / 8, column_height * (i + site_distance / 2), column_width / 2, column_height, abc.get(i) + "", ts, tc); }
    }
    if (label_init) { label_init = false; labelbuttons.add(yb); }

    labelbuttons.forEach((ab) => { ab.forEach((b) => { b.drawMe(); }); });
    if (labeledint == 2) { if (labeledbool) { text("y", column_width * (site_distance * 0.9) + X_offset, column_height * (0 + site_distance / 2) + column_height / 2); text("x", column_width * (site_distance) + X_offset + column_width / 2, column_height * site_distance / 2 - column_height / 2); } else { text("y", column_width * (columns + site_distance + 0.4) + X_offset + column_width / 2.5, column_height * (0 + site_distance / 2) + column_height / 2); text("x", column_width * (site_distance - 0.5) + X_offset + column_width / 2, column_height * site_distance / 2 - column_height / 2); } }

    if (!minimalistic) {
      buttons.forEach((b) => { b.drawMe(); });
    } else { buttons.get(7).drawMe(); buttons.get(10).drawMe(); }
    if (r.getthreadfin()) { draw = 3; } else { draw = 5; }
  } else { draw -= 1; }
}

function init_label_list(b) { let abc = []; if (b) { let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; alphabet.forEach((c) => { abc.add(c + ""); }); } else { for (let i = 0; i < ((rows < columns) ? columns : rows); i++) { abc.add(((i + 1) + "")); } } return abc; }

function reset_action(b) { if (b) { if (r2 != null) { r2.stopthread(); r2 = null; } if (r != null) { r.stopthread(); initpregen(); r = null; } } clicked_box.removeAll(clicked_box); x_buttons.clear(); y_buttons.clear(); if (r != null) { r.stopthread(); } if (r2 != null) { r = r2; r2 = null; initpregen(); } else { initpregen(); r = r2; r2 = null; } }

function initpregen() { if (r2 == null || r2 == r) { r2 = new init_numbers(0); r2.rand(); } }

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

var t;
var p;
var min_plays = 30;
var threadfin;
var progress = 0;

// grid
var grid_min = 0;
var grid_max = 10;
var min = grid_min + 1;
var max = (grid_max - 1) * (grid_max - 1) + grid_max - 1;

// numbers
var possible_numbs = [];
var calculations_list = ["*+", "+*", "/+", "+/", "*-", "-*", "/-", "-/", "*/", "/*", "+-", "-+"];
var calculations = [];
var random_numbs = [];
var current_random_numb;
var found_nothing = false;
var seed;
// random
var gen;

function init_numbers(seed) {
  this.seed = seed;
}

// public function reset() {
// setSeed(0);
// setthreadfin(false);
// setprogress(0);
// setfound(false);
// rand();
// }

function add_usedrandnumbs(i) {
  add_usedrandnumbs(i);
  if (possible_numbs.contains(i))
    possible_numbs.remove(new Integer(i));
}

function rerand() {
  clicked_box = [],
    current_random_numb = new_current_random_numb();
}

function rand() {
  // stopthread();
  if (seed == 0) {
    seed = (Math.random() * 10000 * Math.random());
  }
  possible_numbs = [];
  random_numbs = gen_random_numbs(rows, columns);
  if (extreme_calc) {
    p = new possiblenumbs().set_init_numbers(this);
    // t = new Thread(p);
    // t.start();
    // start_numb();
  } else {
    for (let i = min; i < max; i++) {
      possible_numbs.add(i);
      //setprogress(i / max);
    }
    //setprogress(100);
    getrandom_numb();
    // setthreadfin(true);
    clicked_box = [];
  }
  current_random_numb = new_current_random_numb();
}

function start_numb() {
  let index = (Math.random() * rows * columns);
  let s = calculations_list[(Math.random() * calculations_list.length)];
  let direction = (Math.random() * 8);
  let e = -1;
  let one = random_numbs.get(index);
  let sec = 1;
  let thi = 1;
  switch (direction) {
    case 1:
      if (index % rows < 8) {
        System.out.println(1);
        sec = random_numbs.get(index + 1);
        thi = random_numbs.get(index + 2);
      } else {
        start_numb();
      }
      break;
    case 2:
      if (index % rows < 9 && index % columns < 8) {
        System.out.println(2);
        sec = random_numbs.get(index + columns + 1);
        thi = random_numbs.get(index + columns * 2 + 2);
      } else {
        start_numb();
      }
      break;
    case 3:
      if (index % columns < 8) {
        System.out.println(3);
        sec = random_numbs.get(index + columns);
        thi = random_numbs.get(index + columns * 2);
      } else {
        start_numb();
      }
      break;
    case 4:
      if (index % rows > 2 && index % columns < 8) {
        System.out.println(4);
        sec = random_numbs.get(index + columns - 1);
        thi = random_numbs.get(index + columns * 2 - 2);
      } else {
        start_numb();
      }
      break;
    case 5:
      if (index % rows > 2) {
        System.out.println(5);
        sec = random_numbs.get(index - 1);
        thi = random_numbs.get(index - 2);
      } else {
        start_numb();
      }
      break;
    case 6:
      if (index % rows > 2 && index % columns > 2) {
        System.out.println(6);
        sec = random_numbs.get(index - columns - 1);
        thi = random_numbs.get(index - columns * 2 - 2);
      } else {
        start_numb();
      }
      break;
    case 7:
      if (index % columns > 2) {
        System.out.println(7);
        sec = random_numbs.get(index - columns);
        thi = random_numbs.get(index - columns * 2);
      } else {
        start_numb();
      }
      break;
    case 8:
      if (index % rows > 8 && index % columns > 2) {
        System.out.println(8);
        sec = random_numbs.get(index - columns + 1);
        thi = random_numbs.get(index - columns * 2 + 2);
      } else {
        start_numb();
      }
      break;
    default:
      if (index % rows < 8) {
        System.out.println(9);
        sec = random_numbs.get(index + 1);
        thi = random_numbs.get(index + 2);
      } else {
        start_numb();
      }
      break;
  }
  System.out.println("10: " + index + ", " + one + ", " + sec + ", " + thi + ", " + s);
  if (s.charAt(0) == '/' && sec == 0) {
    start_numb();
  } else if (s.charAt(1) == '/' && thi == 0) {
    start_numb();
  }
  try {
    // never use eval if with user input
    e = (engine.eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
    if (e <= r.getmin() && e >= r.getmax()) {
      e = -1;
    }
  } catch (q) {
  }
  System.out.println(e);
  if (e > 0) {
    current_random_numb = e;
  }
}

function new_current_random_numb() {
  // new current random Number (unique)
  if (possible_numbs.size() > 0) {
    possible_numbs.remove(new Integer(current_random_numb));
    let i = Math.random() * (possible_numbs.size() - 1);
    if (i < 0) {
      if (possible_numbs.size() >= 1 && (possible_numbs.get(0) > min && possible_numbs.get(0) < max)) {
        return possible_numbs.get(0);
      } else {
        found_nothing = true;
        return ((Math.random() * (max - min) + min));
      }
    }
    found_nothing = false;
    return possible_numbs.get(i);
  } else if (threadfin) {
    return ((Math.random() * (max - min) + min));
  } else {
    return -2;
  }
}

function gen_random_numbs(rows, columns) {
  // generates random Numbers
  gen = new Random(seed);
  let save = [];
  for (let i = 0; i < rows; i++) {
    for (let e = 0; e < columns; e++) {
      save.add((((gen.nextlet() * (grid_max - grid_min)) + grid_min)));
    }
  }
  return save;
}

function sfc32(a, b, c, d) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    var t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

var possible = [];
var n;
var stop = false;
// var m = System.currentTimeMillis();

function setstop() {
  this.stop = true;
}

function set_init_numbers(r) {
  n = r;
  return this;
}

function run() {
  n.setthreadfin(false);
  check();
  if (possible.size() > n.getmax() - n.getmin()) {
    n.setpossiblenumbs([]);
    initpregen();
  } else {
    n.setpossiblenumbs(possible);
    n.getrandom_numb();
    n.setthreadfin(true);
    n.setprogress(100);
    initpregen();
    // System.out.println("Thread finished in: " + (System.currentTimeMillis() - m) / 1000 + " sec and found: "
    //   + n.getpossiblenumbs().size() + " possibilities");
  }
}

function possibilities(one_, sec_, thi_) {
  let one = n.getrandomnumbs().get(one_);
  let sec = n.getrandomnumbs().get(sec_);
  let thi = n.getrandomnumbs().get(thi_);
  n.getcalculationlist().forEach((s) => {
    if (s.charAt(0) == '/' && sec == 0) {
    } else if (s.charAt(1) == '/' && thi == 0) {
    }
    try {
      // never use eval if with user input
      let e = (engine.eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
      if (e > r.getmin() && e < r.getmax())
        possible.add(e);
    } catch (q) {
    }
  });
}

function check() {
  let clomuns_t2 = columns << 1;
  for (let i = 0; i < rows; i++) {
    let index_ = i * columns;
    n.setthreadfin(false);
    for (let e = 0; e < columns; e++) {
      if (stop)
        return;
      let index = index_ + e;
      n.setprogress((index / (rows * columns)) * 100);

      if (i > 2 && i < rows - 2 && e > 2 && e < columns - 2) {
        possibilities(index, index + 1, index + 2);
        possibilities(index, index - 1, index - 2);
        possibilities(index, index - columns, index - clomuns_t2);
        possibilities(index, index + columns, index + clomuns_t2);
        possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
        possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
        possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
        possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
      } else {
        if (i < 2) {
          possibilities(index, index + columns, index + clomuns_t2);
          if (e > 2 && e < columns - 2) {
            possibilities(index, index + 1, index + 2);
            possibilities(index, index - 1, index - 2);
            possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
            possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
          }
        } else if (i > rows - 2) {
          possibilities(index, index - columns, index - clomuns_t2);
          if (e > 2 && e < columns - 2) {
            possibilities(index, index + 1, index + 2);
            possibilities(index, index - 1, index - 2);
            possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
            possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
          }
        }
        if (e < 2) {
          possibilities(index, index + 1, index + 2);
          if (i > 2 && i < rows - 2) {
            possibilities(index, index - columns, index - clomuns_t2);
            possibilities(index, index + columns, index + clomuns_t2);
            possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
            possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
          }
        } else if (e > columns - 2) {
          possibilities(index, index - 1, index - 2);
          if (i > 2 && i < rows - 2) {
            possibilities(index, index - columns, index - clomuns_t2);
            possibilities(index, index + columns, index + clomuns_t2);
            possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
            possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
          }
        }
      }
    }
  }
  possible = (removeDuplicates(possible));
}

// function removeDuplicates(list) {
//   if (list == null || list.size() == 0) {
//     return list;
//   }
//   Set set = new HashSet(list);
//   list.clear();
//   list.addAll(set);
//   return list;
// }
