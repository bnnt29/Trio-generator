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
var pending_color = "#0000F";
var seed_green_fade = 255;

//numbers
var extreme_calc = true;
var clicked_box = [];
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
  b.style.height = "100%";
  b = document.getElementById("reroll_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.parentElement.style.height = "100%";
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
  let possibilities = calculations_list.length;
  b.style.backgroundClip = "#FFFFFF";
  if (clicked_box.contains("r" + i + ",c" + e)) {
    if (clicked_box.size() == 3) {
      let one = r.getrandomnumbs().get(clicked_box.get(0));
      let sec = r.getrandomnumbs().get(clicked_box.get(1));
      let thi = r.getrandomnumbs().get(clicked_box.get(2));
      //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
      if (r.getcurrent_random_numb() > 0) {
        for (let o = 0; o < r.getcalculationlist().length; o++) {
          let out = -1; let s = r.getcalculationlist()[o]; r.calculations.add(s);
          if (s.charAt(0) == '/' && sec == 0 || s.charAt(1) == '/' && thi == 0) { continue; }
          //never use eval if with user input
          out = (eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
          if (out == r.getcurrent_random_numb()) { fill(right_color); right = true; } else { fill(wrong_color); }
          text((one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi), xcord, (y_mult * o) + y_add);
        }
      } if (right) { fill(right_color); } else { fill(wrong_color); }
    } else { fill(pending_color); }
  }
  let x = 0;
  if (labeledbool) { x = column_width / 2; } else { x = 0; }
  let rand = 1;
  rect(column_width * (e + site_distance) + X_offset + x + rand, column_height * (i + site_distance / 2) + rand, column_width - rand, column_height - rand, roundboxes);
  if (clicked_box.size() > 0 && clicked_box.size() < 2) { if (clicked_box.get(0) == i * columns + e) { fill("#FFFFFF"); } else { fill(0, 0, 0); } } else { fill(0, 0, 0); }
  textAlign(CENTER, CENTER);
  textSize(Math.floor(((column_width + column_height) / 2) * 0.5));
  text(r.getrandomnumbs().get(i * columns + e) + "", column_width * (e + site_distance) + X_offset + column_width / 2 + x, column_height * (i + site_distance / 2) + column_height / 2);
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
// function initButtons(init) {
//   let fx = 0; 
//   let fy = 0; 
//   let fw = 0; 
//   let fh = 0; 
//   let ts = 0; 
//   let mc; 
//   let tc; 
//   let tf; 
//   let t;

//   fx = 0; 
//   fy = 0; 
//   fw = 0; 
//   fh = 0; 
//   if (init) { buttons.add(new button(fx, fy, fw, fh, 1)); }

//   //rem_row_button
//   let x = 0; 
//   if (labeledbool) { x = column_width / 2; } else { x = 0; } 
//   fx = Math.round(column_width * (columns + site_distance) + X_offset + 10 + x); 
//   fy = Math.round(column_height * (rows + site_distance / 2) + column_height / 2); 
//   fw = Math.round(column_width); 
//   fh = Math.round(column_height / 2); 
//   mc = "#28B05C"; 
//   tf = createFont("Lucida Sans Typewriter Bold", 1); 
//   if (init) { buttons.add(new button(fx, fy, fw, fh, "-", "#FFFFFF", mc, tf)); } else { if (rows <= min_columns) { buttons.get(1).update(fx, fy, fw, fh, "#FF0000"); } else { buttons.get(1).update(fx, fy, fw, fh, mc); } }

//   //add_row_button
//   fy = Math.round(column_height * (rows + site_distance / 2)); fw = Math.round(column_width); fh = Math.round(column_height / 2); tf = createFont("Lucida Sans Typewriter Bold", 1); mc = "#28B05C"; if (init) { buttons.add(new button(fx, fy, fw, fh, "+", "#FFFFFF", mc, tf)); } else { if (rows >= max_columns) { buttons.get(2).update(fx, fy, fw, fh, "#FF0000"); } else { buttons.get(2).update(fx, fy, fw, fh, mc); } }

//   //rem_column_button
//   fy = Math.round(0); fw = Math.round(column_width); fh = Math.round(column_height / 2); tf = createFont("Lucida Sans Typewriter Bold", 1); mc = "#28B05C"; if (init) { buttons.add(new button(fx, fy, fw, fh, "-", "#FFFFFF", mc, tf)); } else { if (columns <= min_columns) { buttons.get(3).update(fx, fy, fw, fh, "#FF0000"); } else { buttons.get(3).update(fx, fy, fw, fh, mc); } }

//   //add_column_button
//   fy = Math.round(column_height / 2); fw = Math.round(column_width); fh = Math.round(column_height / 2); tf = createFont("Lucida Sans Typewriter Bold", 1); mc = "#28B05C"; if (init) { buttons.add(new button(fx, fy, fw, fh, "+", "#FFFFFF", mc, tf)); } else { if (columns >= max_columns) { buttons.get(4).update(fx, fy, fw, fh, "#FF0000"); } else { buttons.get(4).update(fx, fy, fw, fh, mc); } }

//   //reset_button
//   fx = Math.round(column_width - column_width / 1.5 + X_offset / 2); fy = Math.round(height - column_height / 1.5); fw = Math.round(column_width * 1.3); fh = Math.round(column_height / 2); mc = "#7d2835"; if (init) { buttons.add(new button(fx, fy, fw, fh, "reset", "#FFFFFF", mc)); } else { buttons.get(5).update(fx, fy, fw, fh); }

//   //reroll_button
//   fx = Math.round(column_width - column_width / 1.5 + X_offset / 2); fy = Math.round(column_height * 3.5); fw = Math.round(column_width * 1.3); fh = Math.round(column_height / 2); mc = "#7d2835"; if (init) { buttons.add(new button(fx, fy, fw, fh, "reroll", "#FFFFFF", mc)); } else { buttons.get(6).update(fx, fy, fw, fh); }

//   //random number + field
//   fx = Math.round(column_width - column_width / 1.16 + X_offset / 2); fy = Math.round(column_height * 2f); fw = Math.round(column_width * 1.5f); fh = Math.round(column_height * 1.3); ts = Math.floor((((column_height + column_width) / 2) * 0.2) * 3.6);
//   // System.out.println("10: "+r.getcurrent_random_numb()+", "+r.getthreadfin()+", "+((let )(  (r.getprogress()*10))/10)+", "+r.getpossiblenumbs().size());
//   if (r.getcurrent_random_numb() > r.getmin() && r.getcurrent_random_numb() < r.getmax()) { if ((let)((r.getprogress() * 10)) / 10 > 99) { if (!r.getfound()) { tc = "#000000"; mc = "#FFFFFF"; } else { tc = "#FFFFFF"; mc = "#0000FF"; } } else { tc = "#000000"; mc = "#FFFFFF"; } t = r.getcurrent_random_numb() + ""; } else { tc = "#000000"; mc = "#FF0000"; ts = Math.floor((((column_height + column_width) / 2) * 0.2) * 2.5); t = (let)((r.getprogress() * 10)) / 10 + "%"; } if (init) { buttons.add(new button(fx, fy, fw, fh, t, tc, mc, ts)); } else { buttons.get(7).update(fx, fy, fw, fh, t, ts, tc, mc); }

//   //label
//   fx = Math.round(column_width - column_width / 1.5f + X_offset / 2); fy = Math.round(column_height / 3); fw = Math.round(column_width * 1.3); fh = Math.round(column_height / 2); mc = "#464f75"; if (init) { buttons.add(new button(fx, fy, fw, fh, "label", "#FFFFFF", mc)); } else { buttons.get(8).update(fx, fy, fw, fh); }

//   //seed
//   fx = Math.round(width / 2); fy = Math.round(height / 100); fw = Math.round(column_width * 1.2); fh = Math.round(column_height / 4); tc = color(seed_green_fade, 255, seed_green_fade); mc = "#000000"; if (init) { buttons.add(new button(fx, fy, fw, fh, "seed: " + Integer.toHexString(r.getSeed()), tc, g.backgroundColor)); } else { buttons.get(9).update(fx, fy, fw, fh, tc, "seed: " + Integer.toHexString(r.getSeed()), g.backgroundColor); if (seed_green_fade < 255) { seed_green_fade += 3; } }

//   //minimalistic
//   fx = Math.round(column_width - column_width / 1.5f + X_offset / 2); fy = Math.round(column_height); fw = Math.round(column_width * 1.3); fh = Math.round(column_height / 2); mc = "#464f75"; if (init) { buttons.add(new button(fx, fy, fw, fh, "minimal", "#FFFFFF", mc)); } else { buttons.get(10).update(fx, fy, fw, fh); } fill(255, 255, 255); stroke(255, 255, 255); if (init) { for (let b: buttons) { b.lastPressed = System.currentTimeMillis() + 5; }
// }



// var x;
// var y;
// var w;
// var h;
// var text = "";
// var mc = "#FFFFFF";
// var tc = "#000000";//tc = textColor, mc = MainColor
// var ts = -1;
// var lastPressed;
// var DELAY_TIME = 150;
// var tf; // tf = textFont

// function button(x, y, w, h) {
//   this.x = x;
//   this.y = y;
//   this.w = w;
//   this.h = h;
// }

// function button(x, y, w, h, text) {
//   this(x, y, w, h);
//   this.text = text;
// }

// function button(x, y, w, h, ts) {
//   this(x, y, w, h);
//   this.ts = ts;
// }

// function button(x, y, w, h, text, tc, mc) {
//   this(x, y, w, h, text);
//   this.tc = tc;
//   this.mc = mc;
// }

// function button(x, y, w, h, text, tc, mc, tf) {
//   this(x, y, w, h, text, tc, mc);
//   this.tf = tf;
// }

// function button(x, y, w, h, text, mc) {
//   this(x, y, w, h, text);
//   this.mc = mc;
// }

// function button(x, y, w, h, text, tc, mc, ts) {
//   this(x, y, w, h, text, tc, mc);
//   this.ts = ts;
// }

// function drawMe() {
//   fill(mc);
//   stroke(g.backgroundColor);
//   strokeWeight(0);
//   // stroke("#FFFFFF");
//   // strokeWeight(0);
//   rect(x, y, w, h, roundboxes);

//   textAlign(CENTER, CENTER);

//   if (tf == null)
//     textFont(createFont("Lucida Sans Typewriter", 20));
//   else {
//     textFont(tf);
//   }

//   if (ts == -1)
//     textSize(Math.floor(((h / 2 + (w * 2)) / 2) * 0.2));
//   else
//     textSize(ts);

//   fill(tc);
//   stroke(tc);
//   strokeWeight(0);

//   text(text, x + w / 2, y + h / 2);
// }

// function isPushed() {
//   if (mousePressed && (lastPressed + DELAY_TIME) < System.currentTimeMillis() && mouseX > x && mouseX < (x + w)
//     && mouseY > y && mouseY < (y + h)) {
//     lastPressed = System.currentTimeMillis();
//     return true;
//   }
//   return false;
// }

// function update(mc) {
//   this.mc = mc;
// }

// function update(x, y, w, h) {
//   this.x = x;
//   this.y = y;
//   this.w = w;
//   this.h = h;
// }

// function update(x, y, w, h, tc, mc) {
//   update(x, y, w, h, mc);
//   this.tc = tc;
// }

// function update(x, y, w, h, tc, text, mc) {
//   update(x, y, w, h, tc, mc);
//   this.text = text;
// }

// function update(x, y, w, h, mc) {
//   update(x, y, w, h);
//   update(mc);
// }

// function update(x, y, w, h, text, ts, tc) {
//   update(x, y, w, h);
//   this.text = text;
//   this.ts = ts;
//   this.tc = tc;
// }

// function update(x, y, w, h, text, ts, tc, mc) {
//   update(x, y, w, h, text, ts, tc);
//   update(mc);
// }

// function getX() {
//   return x;
// }

// function getY() {
//   return y;
// }

// function getW() {
//   return w;
// }

// function getH() {
//   return h;
// }

// function set_lastPressed(lastPressed) {
//   this.lastPressed = lastPressed;
// }

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
  clicked_box.removeAll(clicked_box);
  current_random_numb = new_current_random_numb();
}

function rand() {
  stopthread();
  if (seed == 0) {
    seed = (Math.random() * 10000 * Math.random());
  }
  possible_numbs.removeAll(possible_numbs);
  random_numbs = gen_random_numbs(rows, columns);
  if (extreme_calc) {
    p = new possiblenumbs().set_init_numbers(this);
    t = new Thread(p);
    t.start();
    start_numb();
  } else {
    for (let i = min; i < max; i++) {
      possible_numbs.add(i);
      setprogress(i / max);
    }
    setprogress(100);
    getrandom_numb();
    setthreadfin(true);
    clicked_box.removeAll(clicked_box);
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

function setSeed(seed) {
  this.seed = seed;
}

function getSeed() {
  return seed;
}

function setfound(found) {
  this.found_nothing = found;
}

function getfound() {
  return found_nothing;
}

function getrandomnumbs() {
  return random_numbs;
}

function getpossiblenumbs() {
  return possible_numbs;
}

function setpossiblenumbs(p) {
  this.possible_numbs = p;
}

function getrandom_numb() {
  if (current_random_numb <= 0) {
    current_random_numb = new_current_random_numb();
  }
}

function getcalculationlist() {
  return calculations_list;
}

function getthreadfin() {
  return threadfin;
}

function setthreadfin(b) {
  threadfin = b;
}

function getmin() {
  return min;
}

function getminplays() {
  return min_plays;
}

function getmax() {
  return max;
}

function getcurrent_random_numb() {
  return current_random_numb;
}

function stopthread() {
  if (t != null) {
    p.setstop();
  }
  t = null;
}

function setprogress(p) {
  this.progress = p;
}

function getprogress() {
  return progress;
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
