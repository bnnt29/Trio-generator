urlp = []; if (location.toString().indexOf('?') != -1) { s = location.toString().split('?'); s = s[1].split('&'); for (i = 0; i < s.length; i++) { u = s[i].split('='); urlp[u[0]] = u[1]; } }
//label
var x_buttons = [];
var y_buttons = [];
var labeledint = 1;
var labeledbool = true;
var labelbuttons = [];
var label_init = true;

var roundboxes = 10;
var buttons = [];

var darkmode = urlp['darkmode'] || false;

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
var Hex_r_seed = parseInt(urlp['seed']) || 0000;

//grid_setup
var rows = parseInt(urlp['rows']) || 10; //Zeilen
var columns = parseInt(urlp['columns']) || 10; //Spalten
console.log(rows + ", " + columns);
var column_width = 0;
var column_height = 0;
var X_offset = 0;
var site_distance = 2;

var objects = [];
var black = false;
var help = false;
var helps = 0;

var buttons_init = false;

//function setup(){r=new init_numbers(Integer.parseInt(Hex_r_seed,16));r.rand();fullScreen();}
function setup() {
  r = new init_numbers(parseInt(Hex_r_seed, 16), this);
  let rands = r.rand();
  gen_html_fields();
  modal();
}

function modal() {
  //modal instructions
  var instruction = document.getElementById("instructions_modal");
  var btn_instruction = document.getElementById("instructions_b");
  var span_instruction = document.getElementById("instructions_close");

  // When the user clicks the button, open the modal 
  btn_instruction.onclick = function () {
    instruction.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span_instruction.onclick = function () {
    instruction.style.display = "none";
  }

  //modal settings
  var settings = document.getElementById("settings_modal");
  var btn_settings = document.getElementById("settings_b");
  var span_settings = document.getElementById("settings_close");

  // When the user clicks the button, open the modal 
  btn_settings.onclick = function () {
    settings.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span_settings.onclick = function () {
    settings.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == settings || event.target == instruction) {
      settings.style.display = "none";
      instruction.style.display = "none";
    }
  }
}

function gen_html_fields() {
  let b;
  var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight || docElem.clientHeight || body.clientHeight;
  let height = (100 / (rows + 1)) + "%";
  let width = (100 / ((columns + 1) * 1.025)) + "%";
  let row = document.createElement("div");
  row.classList.add("row");
  row.style.justifyContent = "center";
  row.style.height = (100 / (rows + 1)) / 2 + "%";
  document.getElementById("container").appendChild(row);
  let col = document.createElement("div");
  col.classList.add("col");
  col.style.justifyContent = "center";
  col.style.height = "50%";
  b = document.createElement("button");
  // b.onclick = function () { field_pressed(i, e) };
  button_styles(b, height, (100 / ((columns + 1) * 1.025)) / 1.7 + "%");
  b.style.border = "none";
  b.style.outline = "none"
  col.appendChild(b);
  row.appendChild(b);
  for (let i = 0; i < columns; i++) {
    let col = document.createElement("div");
    col.classList.add("col");
    col.style.justifyContent = "center";
    col.style.height = "50%";
    b = document.createElement("button");
    // b.onclick = function () { field_pressed(i, e) };
    b.innerHTML = i;
    button_styles(b, height, width);
    b.style.border = "none";
    b.style.outline = "none"
    col.appendChild(b);
    row.appendChild(b);
  }
  for (let i = 0; i < rows; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.id = "r" + i;
    row.style.justifyContent = "center";
    row.style.height = height;
    b = document.createElement("button");
    b.innerHTML = i;
    button_styles(b, height, (100 / ((columns + 1) * 1.025)) / 1.7 + "%");
    b.style.border = "none";
    b.style.outline = "none"
    row.appendChild(b);
    for (let e = 0; e < columns; e++) {
      b = document.createElement("button");
      b.id = "r" + i + ",c" + e;
      box = [...box, "r" + i + ",c" + e];
      b.setAttribute("value", r.getrandomnumbs()[i * columns + e] + "");
      b.onclick = function () { field_pressed(i, e) };
      b.innerHTML = r.getrandomnumbs()[i * columns + e] + "";
      button_styles(b, height, width);
      row.appendChild(b);
    }
    document.getElementById("container").appendChild(row);
    document.getElementById("container").style.height = y * 0.9 + "px";
  }
  other_buttons();
}

function other_buttons() {
  let height = (100 / (rows)) + "%";
  let width = (100 / (columns * 1.025)) + "%";
  b = document.getElementById("current_rand");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = height;
  r.getrandom_numb();
  b.innerHTML = r.getcurrent_random_numb();
  b = document.getElementById("reroll_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
  b = document.getElementById("reset_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
  b = document.getElementById("darkmode_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
  b = document.getElementById("instructions_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
  b = document.getElementById("settings_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
  b = document.getElementById("help_b");
  button_styles(b, height, width);
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
}

function button_styles(b, height, width) {
  if (objects.indexOf(b) == -1) {
    objects = [...objects, b];
  }
  b.style.paddingLeft = 0;
  b.style.paddingRight = 0;
  if (height <= 0 || width <= 0) {
    height = 0;
    width = 0;
    b.style.borderLeftWidth = 0;
    b.style.borderRightWidth = 0;
  }
  b.style.fontSize = "90 vmin";
  // b.style.minHeight = 0;
  b.style.minWidth = 0;
  b.style.whiteSpace = "nowrap";
  b.style.overflow = "hidden";
  b.style.height = "100%";
  b.style.width = width;
  b.style.borderRadius = "20%";
  if (black) {
    b.style.backgroundColor = "#000000";
    b.style.borderColor = "#FFFFFF";
    b.style.color = "#FFFFFF";
  } else {
    b.style.backgroundColor = "#FFFFFF";
    b.style.borderColor = "#000000";
    b.style.color = "#000000";
  }
}

function button_color(b) {
  if (black) {
    b.style.backgroundColor = "#000000";
    b.style.borderColor = "#FFFFFF";
    b.style.color = "#FFFFFF";
  } else {
    b.style.backgroundColor = "#FFFFFF";
    b.style.borderColor = "#000000";
    b.style.color = "#000000";
  }
}

function togglebtn(b, bol) {
  b.disabled = bol;
  if (bol) {
    if (black) {
      b.style.backgroundColor = "#333333";
      b.style.borderColor = "#666666";
      b.style.color = "#BBBBBB";
    } else {
      b.style.backgroundColor = "#BBBBBB";
      b.style.borderColor = "#666666";
      b.style.color = "#333333";
    }
  } else {
    if (black) {
      b.style.backgroundColor = "#000000";
      b.style.borderColor = "#FFFFFF";
      b.style.color = "#FFFFFF";
    } else {
      b.style.backgroundColor = "#FFFFFF";
      b.style.borderColor = "#000000";
      b.style.color = "#000000";
    }
  }
}

function field_pressed(i, e) {
  let b = document.getElementById("r" + i + ",c" + e);
  document.getElementById("calculation_list").innerHTML = "";
  let right = false;
  let possibilities = r.getcalculationlist();
  if (clicked_box.contains([i, e]) == -1) {
    if (clicked_box.length < 3) {
      clicked_box = [...clicked_box, [i, e]];
      if (clicked_box.length == 3) {
        let one = document.getElementById("r" + clicked_box[0][0] + ",c" + clicked_box[0][1]).getAttribute("value");
        let sec = document.getElementById("r" + clicked_box[1][0] + ",c" + clicked_box[1][1]).getAttribute("value");
        let thi = document.getElementById("r" + clicked_box[2][0] + ",c" + clicked_box[2][1]).getAttribute("value");
        //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
        if (1 > 0) {
          let calcs = document.getElementById("calculation_list");
          for (let o = 0; o < possibilities.length; o++) {
            let out = -1;
            let s = possibilities[o];
            r.calculations = [...r.calculations, s];
            let p = document.createElement("p");
            if (s.charAt(0) == '/' && sec == 0 || s.charAt(1) == '/' && thi == 0) { continue; }
            p.innerHTML = one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi;
            p.style.color = wrong_color;
            p.style.textAlign = "center";
            calcs.appendChild(p);
            //never use eval if with user input
            out = (eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
            if (out == r.getcurrent_random_numb()) {
              p.style.color = right_color;
              right = true;
            } else {
              p.style.color = wrong_color;
            }
          }
          if (right) {
            b.style.backgroundColor = right_color; b.style.color = '#000000';
            clicked_box.forEach((data) => {
              document.getElementById("r" + data[0] + ",c" + data[1]).style.backgroundColor = right_color;
              document.getElementById("r" + data[0] + ",c" + data[1]).style.color = '#000000';
            });
          } else {
            b.style.backgroundColor = wrong_color;
            b.style.color = '#FFFFFF';
            clicked_box.forEach((data) => {
              document.getElementById("r" + data[0] + ",c" + data[1]).style.backgroundColor = wrong_color;
              document.getElementById("r" + data[0] + ",c" + data[1]).style.color = '#FFFFFF';
            });
          }
        }
      } else {
        b.style.backgroundColor = pending_color;
        b.style.color = '#FFFFFF';
        if (clicked_box.length == 1) {
          box.forEach((data) => {
            togglebtn(document.getElementById(data), true);
          });
          clicked_box.forEach((data) => {
            document.getElementById("r" + data[0] + ",c" + data[1]).disabled = false;
            document.getElementById("r" + data[0] + ",c" + data[1]).style.backgroundColor = pending_color;
            document.getElementById("r" + data[0] + ",c" + data[1]).style.color = "#FFFFFF";
          });
          possible_box = [...possible_box, [(i), (e + 1)], [(i), (e - 1)], [(i + 1), (e)], [(i - 1), (e)], [(i + 1), (e + 1)], [(i + 1), (e - 1)], [(i - 1), (e + 1)], [(i - 1), (e - 1)]];
          possible_box = [...possible_box, [(i), (e + 2)], [(i), (e - 2)], [(i + 2), (e)], [(i - 2), (e)], [(i + 2), (e + 2)], [(i + 2), (e - 2)], [(i - 2), (e + 2)], [(i - 2), (e - 2)]];
          let save = [];
          possible_box.forEach((value) => {
            let data = "r" + value[0] + ",c" + value[1];
            if (document.getElementById(data) == null) {
              save = [...save, value];
              data = "";
              let values = [];
              if (value[0] != i) {
                if (i > value[0]) {
                  if (value[0] + 1 == i) {
                    values = [(value[0] - 1)];
                  } else {
                    values = [(value[0] + 1)];
                  }
                } else {
                  if (value[0] - 1 == i) {
                    values = [(value[0] + 1)];
                  } else {
                    values = [(value[0] - 1)];
                  }
                }
              } else {
                values = [value[0]];
              }
              if (value[1] != e) {
                if (e > value[1]) {
                  if (value[1] + 1 == e) {
                    values = [values[0], (value[1] - 1)];
                  } else {
                    values = [values[0], (value[1] + 1)];
                  }
                } else {
                  if (value[1] - 1 == e) {
                    values = [values[0], (value[1] + 1)];
                  } else {
                    values = [values[0], (value[1] - 1)];
                  }
                }
              } else {
                values = [values[0], value[1]];
              }
              save = [...save, values];
            }
          });
          possible_box.forEach((value) => {
            let tr = true;
            save.forEach((data) => { if (data.equals(value)) { tr = false; } });
            if (tr) {
              let data = "r" + value[0] + ",c" + value[1];
              togglebtn(document.getElementById(data), false);
            }
          });
          possible_box = [];
        } else if (clicked_box.length == 2) {
          if (i == clicked_box[0][0] && e == clicked_box[0][1]) {
            clicked_box = [];
          } else {
            let ico = clicked_box[0][0];
            let eco = clicked_box[0][1];
            if (clicked_box[0][0] > clicked_box[1][0]) {
              if (clicked_box[0][0] - clicked_box[1][0] == 2) {
                ico = clicked_box[0][0] - 1;
              } else if (clicked_box[0][0] - clicked_box[1][0] == 1) {
                ico = clicked_box[0][0] - 2;
              }
            } else {
              if (clicked_box[1][0] - clicked_box[0][0] == 2) {
                ico = clicked_box[0][0] + 1;
              } else if (clicked_box[1][0] - clicked_box[0][0] == 1) {
                ico = clicked_box[0][0] + 2;
              }
            }
            if (clicked_box[0][1] > clicked_box[1][1]) {
              if (clicked_box[0][1] - clicked_box[1][1] == 2) {
                eco = clicked_box[0][1] - 1;
              } else if (clicked_box[0][1] - clicked_box[1][1] == 1) {
                eco = clicked_box[0][1] - 2;
              }
            } else {
              if (clicked_box[1][1] - clicked_box[0][1] == 2) {
                eco = clicked_box[0][1] + 1;
              } else if (clicked_box[1][1] - clicked_box[0][1] == 1) {
                eco = clicked_box[0][1] + 2;
              }
            }
            document.getElementById("r" + ico + ",c" + eco).click();
          }
        }
      }
    }
  } else {
    if (clicked_box.contains([i, e]) != 0) {
      button_color(document.getElementById("r" + clicked_box[1][0] + ",c" + clicked_box[1][1]));
      button_color(document.getElementById("r" + clicked_box[2][0] + ",c" + clicked_box[2][1]));
      clicked_box = [clicked_box[0]];
    } else {
      clicked_box.forEach((data) => {
        button_color(document.getElementById("r" + data[0] + ",c" + data[1]));
      });
      clicked_box = [];
      box.forEach((data) => {
        togglebtn(document.getElementById(data), false);
      });
    }
    clicked_box.forEach((data) => {
      document.getElementById("r" + data[0] + ",c" + data[1]).style.backgroundColor = pending_color; document.getElementById("r" + data[0] + ",c" + data[1]).style.color = '#FFFFFF';
    });
  }
  // text(r.getrandomnumbs().get(i * columns + e) + "", column_width * (e + site_distance) + X_offset + column_width / 2 + x, column_height * (i + site_distance / 2) + column_height / 2);
}

// function draw() {
//   if (draw <= 0) {
//     if (!buttons_init) {
//       buttons_init = true;
//       initButtons(buttons_init);
//     }
//     initButtons(false);

//     //row+column numbers

//     let abc = [];
//     let x = 0;
//     let tc;
//     //x-buttons
//     let maxx = 0;
//     let xb;
//     if (labelbuttons.size() > 0) { xb = labelbuttons.get(0); maxx = xb.size(); } else { xb = []; maxx = columns; }
//     abc = init_label_list(false);
//     for (let i = 0; i < maxx; i++) {
//       tc = "#FFFFFF"; clicked_box.forEach((clb) => { if ((getCoordinatesForIndex(clb).getX() - 1 == i)) { if (clicked_box.size() == 1) { tc = pending_color; } else { tc = right_color; } } });
//       if (labeledbool) { x = (column_width * (i + 0.5 + site_distance) + X_offset); } else { x = column_width * (i + site_distance) + X_offset; }
//       if (label_init) { xb.add(new button(x + column_width / 4, column_height * (site_distance / 4), column_width / 2, column_height, abc.get(i) + "", tc, g.backgroundColor, ts)); } else { if (x_buttons.contains(xb.get(i)) && clicked_box.size() < 1) { tc = "#28B05C"; } xb.get(i).update(x + column_width / 4, column_height * (site_distance / 4), column_width / 2, column_height, abc.get(i) + "", ts, tc); }
//     }
//     if (label_init) { labelbuttons.add(xb); }
//     //y-buttons
//     let maxy = 0; let yb;
//     if (labelbuttons.size() > 1) { yb = labelbuttons.get(1); maxy = yb.size(); } else { yb = []; maxy = rows; }
//     if (labeledint == 1 && rows <= 24) { abc = init_label_list(true); } else { abc = init_label_list(false); }
//     for (let i = 0; i < maxy; i++) {
//       tc = "#FFFFFF"; clicked_box.forEach((clb) => { if ((getCoordinatesForIndex(clb).getY() - 1 == i)) { if (clicked_box.size() == 1) { tc = pending_color; } else { tc = right_color; } } });
//       if (labeledbool) { x = (column_width * (site_distance) + X_offset); } else { x = (column_width * ((columns + 0.2 + site_distance)) + X_offset); }
//       if (label_init) { yb.add(new button(x - column_width / 8, column_height * (i + site_distance / 2), column_width / 2, column_height, abc.get(i) + "", tc, g.backgroundColor, ts)); } else { if (y_buttons.contains(yb.get(i)) && clicked_box.size() < 1) { tc = "#28B05C"; } yb.get(i).update(x - column_width / 8, column_height * (i + site_distance / 2), column_width / 2, column_height, abc.get(i) + "", ts, tc); }
//     }
//     if (label_init) { label_init = false; labelbuttons.add(yb); }

//     labelbuttons.forEach((ab) => { ab.forEach((b) => { b.drawMe(); }); });
//     if (labeledint == 2) { if (labeledbool) { text("y", column_width * (site_distance * 0.9) + X_offset, column_height * (0 + site_distance / 2) + column_height / 2); text("x", column_width * (site_distance) + X_offset + column_width / 2, column_height * site_distance / 2 - column_height / 2); } else { text("y", column_width * (columns + site_distance + 0.4) + X_offset + column_width / 2.5, column_height * (0 + site_distance / 2) + column_height / 2); text("x", column_width * (site_distance - 0.5) + X_offset + column_width / 2, column_height * site_distance / 2 - column_height / 2); } }

//     if (!minimalistic) {
//       buttons.forEach((b) => { b.drawMe(); });
//     } else { buttons.get(7).drawMe(); buttons.get(10).drawMe(); }
//     if (r.getthreadfin()) { draw = 3; } else { draw = 5; }
//   } else { draw -= 1; }
// }

function init_label_list(b) { let abc = []; if (b) { let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; alphabet.forEach((c) => { abc.add(c + ""); }); } else { for (let i = 0; i < ((rows < columns) ? columns : rows); i++) { abc.add(((i + 1) + "")); } } return abc; }

function reset_action(b) { if (b) { if (r2 != null) { r2.stopthread(); r2 = null; } if (r != null) { r.stopthread(); initpregen(); r = null; } } clicked_box.removeAll(clicked_box); x_buttons.clear(); y_buttons.clear(); if (r != null) { r.stopthread(); } if (r2 != null) { r = r2; r2 = null; initpregen(); } else { initpregen(); r = r2; r2 = null; } }

function initpregen() { if (r2 == null || r2 == r) { r2 = new init_numbers(0); r2.rand(); } }

function setclicked_box(array) { clicked_box = array; }

function show_help() {
  if (help) {
    help = false;
    helps = 0;
    box.forEach((data) => {
      togglebtn(document.getElementById(data), false);
    });
    document.getElementById("calculation_list").innerHTML = null;
  } else {
    clicked_box = [];
    box.forEach((data) => {
      togglebtn(document.getElementById(data), true);
    });
    help = true;
    let success = false;
    for (let i = 0; i < rows; i++) {
      for (let e = 0; e < columns; e++) {
        let index = "r" + i + ",c" + e;
        if (i > 2 && i < rows - 2 && e > 2 && e < columns - 2) {
          help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
          help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
          help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
          help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
          help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
          help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
          help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
          help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
        } else {
          if (i < 2) {
            help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
            if (e > 2 && e < columns - 2) {
              help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
              help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
              help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
              help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
            }
          } else if (i > rows - 2) {
            help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
            if (e > 2 && e < columns - 2) {
              help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
              help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
              help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
              help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
            }
          }
          if (e < 2) {
            help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
            if (i > 2 && i < rows - 2) {
              help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
              help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
              help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
              help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
            }
          } else if (e > columns - 2) {
            help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
            if (i > 2 && i < rows - 2) {
              help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
              help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
              help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
              help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
            }
          }
        }
      }
    }
  }
}

function help_calc(one_, sec_, thi_) {
  let one = document.getElementById(one_).getAttribute("value");
  let sec = document.getElementById(sec_).getAttribute("value");
  let thi = document.getElementById(thi_).getAttribute("value");
  r.calculations_list.forEach((s) => {
    if (s.charAt(0) == '/' && sec == 0) {
      return;
    } else if (s.charAt(1) == '/' && thi == 0) {
      return;
    }
    // never use eval if with user input
    let e = eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi + "");
    if (e != Number.parseFloat(e).toFixed(0)) { return; }
    if (e > r.getmin() && e < r.getmax()) {
      if (e == r.current_random_numb) {
        document.getElementById(one_).style.backgroundColor = right_color;
        document.getElementById(one_).style.color = '#000000';
        document.getElementById(sec_).style.backgroundColor = right_color;
        document.getElementById(sec_).style.color = '#000000';
        document.getElementById(thi_).style.backgroundColor = right_color;
        document.getElementById(thi_).style.color = '#000000';
        if (helps <= 20) {
          let p = document.createElement("p");
          p.innerHTML = one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi + "";
          document.getElementById("calculation_list").appendChild(p);
          if (black) {
            p.style.color = "#FFFFFF";
          } else {
            p.style.color = "#000000";
          }
          p.style.textAlign = "center";
          helps += 1;
        }
      }
    }
  });
}

function rerand() { r.rerand(); document.getElementById("current_rand").innerHTML = r.getcurrent_random_numb(); }

function reset() { location.reload(); }

function dark_switch() {
  clicked_box = [];
  document.getElementById("calculation_list").innerHTML = null;
  helps = 0;
  help = false;
  box.forEach((data) => {
    togglebtn(document.getElementById(data), false);
  });
  if (black) {
    black = false;
    objects.forEach((data) => { button_color(data); });
    document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#FFFFFF";
    Array.prototype.forEach.call(document.getElementsByClassName("footer"), (data) => { data.style.color = "#000000" });
    document.getElementById("darkmode_b").innerHTML = "&#xf186;";
  } else {
    black = true;
    objects.forEach((data) => { button_color(data); });
    document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#000000";
    Array.prototype.forEach.call(document.getElementsByClassName("footer"), (data) => { data.style.color = "#FFFFFF" });
    document.getElementById("darkmode_b").innerHTML = "&#xf185;";
    document.getElementById("calculation_list").innerHTML = null;
  }
}
function opensettings() { /* TODO*/ }

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

class init_numbers {
  constructor(seed, trio) {
    // this.t;
    // this.p;
    this.min_plays = 30;
    // this.threadfin;
    // this.progress = 0;

    this.trio = trio;

    // grid
    this.grid_min = 0;
    this.grid_max = 10;
    this.min = this.grid_min + 1;
    this.max = (this.grid_max - 1) * (this.grid_max - 1) + this.grid_max - 1;

    // numbers
    this.possible_numbs = [];
    this.calculations_list = ["*+", "+*", "/+", "+/", "*-", "-*", "/-", "-/", "*/", "/*", "+-", "-+"];
    this.calculations = [];
    this.random_numbs = [];
    this.current_random_numb;
    this.found_nothing = false;
    this.seed = seed;
    // random
    this.gen;
  }

  reset() {
    this.seed = 0;
    this.found = false;
    rand();
  }

  add_usedrandnumbs(i) {
    if (possible_numbs.contains(i))
      possible_numbs.remove(new Integer(i));
  }

  rerand() {
    clicked_box = [];
    document.getElementById("calculation_list").innerHTML = null;
    helps = 0;
    help = false;
    box.forEach((data) => {
      togglebtn(document.getElementById(data), false);
    });
    this.trio.setclicked_box([]);
    this.current_random_numb = this.new_current_random_numb();
    if (this.current_random_numb == null || this.current_random_numb <= 0) {
      this.rerand();
    }
  }

  rand() {
    if (this.seed == 0) {
      this.seed = (Math.random() * 10000 * Math.random());
    }
    this.possible_numbs = [];
    this.random_numbs = this.gen_random_numbs(rows, columns);
    if (this.trio.extreme_calc) {
      this.p = new possiblenumbs(this, this.calculations_list, this.trio);
      this.p.run();
    } else {
      for (let i = this.min; i < this.max - 1; i++) {
        this.possible_numbs = [...this.possible_numbs, i];
      }
      this.getrandom_numb();
      this.clicked_box = [];
    }
    this.current_random_numb = this.new_current_random_numb();
    return this.current_random_numb;
  }

  start_numb() {
    let index = Math.round(Math.random() * rows * columns);
    let s = this.calculations_list[Math.round(Math.random() * this.calculations_list.length)];
    let direction = (Math.random() * 8);
    let e = -1;
    let one = this.random_numbs[index];
    let sec = 1;
    let thi = 1;
    switch (direction) {
      case 1:
        if (index % rows < 8) {
          sec = this.random_numbs[index + 1];
          thi = this.random_numbs[index + 2];
        } else {
          this.start_numb();
        }
        break;
      case 2:
        if (index % rows < 9 && index % columns < 8) {
          sec = this.random_numbs[index + columns + 1];
          thi = this.random_numbs[index + columns * 2 + 2];
        } else {
          this.start_numb();
        }
        break;
      case 3:
        if (index % columns < 8) {
          sec = this.random_numbs[index + columns];
          thi = this.random_numbs[index + columns * 2];
        } else {
          this.start_numb();
        }
        break;
      case 4:
        if (index % rows > 2 && index % columns < 8) {
          sec = this.random_numbs[index + columns - 1];
          thi = this.random_numbs[index + columns * 2 - 2];
        } else {
          this.start_numb();
        }
        break;
      case 5:
        if (index % rows > 2) {
          sec = this.random_numbs[index - 1];
          thi = this.random_numbs[index - 2];
        } else {
          this.start_numb();
        }
        break;
      case 6:
        if (index % rows > 2 && index % columns > 2) {
          sec = this.random_numbs[index - columns - 1];
          thi = this.random_numbs[index - columns * 2 - 2];
        } else {
          this.start_numb();
        }
        break;
      case 7:
        if (index % columns > 2) {
          sec = this.random_numbs[index - columns];
          thi = this.random_numbs[index - columns * 2];
        } else {
          this.start_numb();
        }
        break;
      case 8:
        if (index % rows > 8 && index % columns > 2) {
          sec = this.random_numbs[index - columns + 1];
          thi = this.random_numbs[index - columns * 2 + 2];
        } else {
          this.start_numb();
        }
        break;
      default:
        if (index % rows < 8) {
          sec = this.random_numbs[index + 1];
          thi = this.random_numbs[index + 2];
        } else {
          this.start_numb();
        }
        break;
    }
    // System.out.println("10: " + index + ", " + one + ", " + sec + ", " + thi + ", " + s);
    if (s.charAt(0) == '/' && sec == 0) {
      this.start_numb();
    } else if (s.charAt(1) == '/' && thi == 0) {
      this.start_numb();
    }
    // never use eval if with user input
    e = (eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
    if (e <= this.getmin() && this.e >= this.getmax()) {
      e = -1;
    }
    if (e > 0) {
      this.current_random_numb = e;
    }
  }

  new_current_random_numb() {
    // new current random Number (unique)
    if (this.possible_numbs.length > 0) {
      let save = [];
      this.possible_numbs.forEach((data) => {
        if (data != this.current_random_numb) {
          save = [...save, data];
        }
      });
      this.possible_numbs = save;
      let i = Math.round(Math.random() * (this.possible_numbs.length - 1));
      if (i < 0) {
        if (this.possible_numbs.length >= 1 && (this.possible_numbs[0] > this.min && this.possible_numbs[0] < this.max)) {
          return this.possible_numbs.get(0);
        } else {
          this.found_nothing = true;
          return ((Math.random() * (this.max - this.min) + this.min));
        }
      }
      this.found_nothing = false;
      return this.possible_numbs[i];
    } else {
      return (Math.round((Math.random() * (this.max - this.min) + this.min)));
    }
  }

  gen_random_numbs(rows, columns) {
    // generates random Numbers
    this.gen = new Random(this.seed);
    let save = [];
    for (let i = 0; i < rows; i++) {
      for (let e = 0; e < columns; e++) {
        save = [...save, Math.round((((this.gen.nextFloat() * ((this.grid_max - 1) - this.grid_min)) + this.grid_min)))];
      }
    }
    return save;
  }

  setSeed(seed) {
    this.seed = seed;
  }

  getSeed() {
    return this.seed;
  }

  setfound(found) {
    this.found_nothing = found;
  }

  getfound() {
    return this.found_nothing;
  }

  getrandomnumbs() {
    return this.random_numbs;
  }

  getpossiblenumbs() {
    return this.possible_numbs;
  }

  setpossiblenumbs(p) {
    this.possible_numbs = p;
  }

  getrandom_numb() {
    if (this.current_random_numb <= 0) {
      this.current_random_numb = this.new_current_random_numb();
    }
  }

  getcalculationlist() {
    return this.calculations_list;
  }

  getmin() {
    return this.min;
  }

  getminplays() {
    return this.min_plays;
  }

  getmax() {
    return this.max;
  }

  getcurrent_random_numb() {
    return this.current_random_numb;
  }

}

class possiblenumbs {
  constructor(r, c, tri) {
    this.possible = [];
    this.n = r;
    this.stop = false;
    this.calcs = c;
    this.trio = tri;
    // var m = System.currentTimeMillis();
  }

  run() {
    this.check();
    if (this.possible.length > this.n.getmax() - this.n.getmin()) {
      this.n.setpossiblenumbs([]);
      // this.trio.initpregen();
    } else {
      this.n.setpossiblenumbs(this.possible);
      this.n.getrandom_numb();
      // this.trio.initpregen();
      // System.out.println("Thread finished in: " + (System.currentTimeMillis() - m) / 1000 + " sec and found: "
      //   + n.getpossiblenumbs().size() + " possibilities");
    }
  }

  possibilities(one_, sec_, thi_) {
    let one = this.n.random_numbs[one_];
    let sec = this.n.random_numbs[sec_];
    let thi = this.n.random_numbs[thi_];
    this.calcs.forEach((s) => {
      if (s.charAt(0) == '/' && sec == 0) {
        return;
      } else if (s.charAt(1) == '/' && thi == 0) {
        return;
      }
      // never use eval if with user input
      let e = eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi + "");
      if (e != Number.parseFloat(e).toFixed(0)) { return; }
      if (e > this.n.getmin() && e < this.n.getmax()) {
        this.possible = [...this.possible, e];
      }
    });
  }

  check() {
    let clomuns_t2 = columns << 1;
    for (let i = 0; i < rows; i++) {
      let index_ = i * columns;
      for (let e = 0; e < columns; e++) {
        if (this.stop)
          return;
        let index = index_ + e;

        if (i > 2 && i < rows - 2 && e > 2 && e < columns - 2) {
          this.possibilities(index, index + 1, index + 2);
          this.possibilities(index, index - 1, index - 2);
          this.possibilities(index, index - columns, index - clomuns_t2);
          this.possibilities(index, index + columns, index + clomuns_t2);
          this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
          this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
          this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
          this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
        } else {
          if (i < 2) {
            this.possibilities(index, index + columns, index + clomuns_t2);
            if (e > 2 && e < columns - 2) {
              this.possibilities(index, index + 1, index + 2);
              this.possibilities(index, index - 1, index - 2);
              this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
              this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
            }
          } else if (i > rows - 2) {
            this.possibilities(index, index - columns, index - clomuns_t2);
            if (e > 2 && e < columns - 2) {
              this.possibilities(index, index + 1, index + 2);
              this.possibilities(index, index - 1, index - 2);
              this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
              this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
            }
          }
          if (e < 2) {
            this.possibilities(index, index + 1, index + 2);
            if (i > 2 && i < rows - 2) {
              this.possibilities(index, index - columns, index - clomuns_t2);
              this.possibilities(index, index + columns, index + clomuns_t2);
              this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
              this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
            }
          } else if (e > columns - 2) {
            this.possibilities(index, index - 1, index - 2);
            if (i > 2 && i < rows - 2) {
              this.possibilities(index, index - columns, index - clomuns_t2);
              this.possibilities(index, index + columns, index + clomuns_t2);
              this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
              this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
            }
          }
        }
      }
    }
    this.possible = (this.removeDuplicates(this.possible));
  }

  removeDuplicates(list) {
    if (list == null || list.length == 0) {
      return list;
    }
    let set = new Set(list);
    list = [...set];
    return list;
  }
}

const p2_16 = 0x0000000010000;
const p2_24 = 0x0000001000000;
const p2_27 = 0x0000008000000;
const p2_31 = 0x0000080000000;
const p2_32 = 0x0000100000000;
const p2_48 = 0x1000000000000;
const p2_53 = Math.pow(2, 53);	// NB: exceeds Number.MAX_SAFE_INTEGER

const m2_16 = 0xffff;

//
// multiplicative term for the PRNG
//
const [c2, c1, c0] = [0x0005, 0xdeec, 0xe66d];
class Random {
  constructor(seedval) {

    let s2, s1, s0;
    let nextNextGaussian;
    let haveNextNextGaussian = false;

    //
    // 53-bit safe version of
    // seed = (seed * 0x5DEECE66DL + 0xBL) & ((1L << 48) - 1)
    //
    const _next = () => {

      let carry = 0xb;

      let r0 = (s0 * c0) + carry;
      carry = r0 >>> 16;
      r0 &= m2_16;

      let r1 = (s1 * c0 + s0 * c1) + carry;
      carry = r1 >>> 16;
      r1 &= m2_16;

      let r2 = (s2 * c0 + s1 * c1 + s0 * c2) + carry;
      r2 &= m2_16;

      [s2, s1, s0] = [r2, r1, r0];

      return s2 * p2_16 + s1;
    }

    const next_signed = (bits) => {
      return _next() >> (32 - bits);
    }

    const next = (bits) => {
      return _next() >>> (32 - bits);
    }

    const checkIsNumber = (n) => {
      if (typeof n !== 'number') {
        throw TypeError();
      }
    }

    const checkIsPositiveInt = (n, r = Number.MAX_SAFE_INTEGER) => {
      checkIsNumber(n);
      if (n < 0 || n > r) {
        throw RangeError();
      }
    }

    //
    // 53-bit safe version of
    // seed = (seed ^ 0x5DEECE66DL) & ((1L << 48) - 1)
    //
    function setSeed(n) {
      checkIsPositiveInt(n);
      s0 = ((n) & m2_16) ^ c0;
      s1 = ((n / p2_16) & m2_16) ^ c1;
      s2 = ((n / p2_32) & m2_16) ^ c2;
    }

    function nextInt(bound) {
      if (bound === undefined) {
        return next_signed(32);
      }

      checkIsPositiveInt(bound, 0x7fffffff);

      // special case if bound is a power of two
      if ((bound & -bound) === bound) {
        let r = next(31) / p2_31;
        return ~~(bound * r);
      }

      var bits, val;
      do {
        bits = next(31);
        val = bits % bound;
      } while (bits - val + (bound - 1) < 0);
      return val;
    }

    function nextLong() {
      if (typeof BigInt !== 'function') {
        throw Error('BigInt unsupported');
      }
      let msb = BigInt(next_signed(32));
      let lsb = BigInt(next_signed(32));
      const p2_32n = BigInt(p2_32);
      return msb * p2_32n + lsb;
    }

    function nextBoolean() {
      return next(1) != 0;
    }

    function nextFloat() {
      return next(24) / p2_24;
    }

    function nextDouble() {
      return (p2_27 * next(26) + next(27)) / p2_53;
    }

    function nextBytes(bytes) {
      if (!Array.isArray(bytes)) {
        throw TypeError;
      }

      for (let i = 0; i < bytes.length;) {
        for (let rnd = nextInt(), n = Math.min(bytes.length - i, 4);
          n-- > 0;
          rnd >>= 8) {
          // double shift extends bit sign in bit 7
          bytes[i++] = (rnd << 24) >> 24;
        }
      }
    }

    function nextGaussian() {
      if (haveNextNextGaussian) {
        haveNextNextGaussian = false;
        return nextNextGaussian;
      } else {
        let v1, v2, s;
        do {
          v1 = 2 * nextDouble() - 1.0;
          v2 = 2 * nextDouble() - 1.0;
          s = v1 * v1 + v2 * v2;
        } while (s >= 1 || s === 0);
        let multiplier = Math.sqrt(-2 * Math.log(s) / s);
        nextNextGaussian = v2 * multiplier;
        haveNextNextGaussian = true;
        return v1 * multiplier;
      }
    }

    //
    // stream functions replaced with JS generators
    //
    function checkStreamSize(streamSize) {
      if (streamSize === undefined) {
        return undefined;
      }

      checkIsPositiveInt(streamSize);

      return streamSize;
    }

    function* ints(streamSize) {
      streamSize = checkStreamSize(streamSize);
      let forever = streamSize === undefined;
      while (forever || (streamSize-- > 0)) {
        yield nextInt();
      }
    }

    function* longs(streamSize) {
      streamSize = checkStreamSize(streamSize);
      let forever = streamSize === undefined;
      while (forever || (streamSize-- > 0)) {
        yield nextLong();
      }
    }

    function* doubles(streamSize) {
      streamSize = checkStreamSize(streamSize);
      let forever = streamSize === undefined;
      while (forever || (streamSize-- > 0)) {
        yield nextDouble();
      }
    }

    // list of functions to export, using ES6 scoped-variable keys
    const functions = {
      setSeed,
      nextInt, nextBoolean, nextLong, nextBytes,
      nextFloat, nextDouble, nextGaussian,
      ints, longs, doubles
    };

    // remove BigInt support if not available
    if (typeof BigInt !== 'function') {
      delete functions.nextLong;
      delete functions.longs;
    }

    // convert into Property Descriptors
    for (let f in functions) {
      functions[f] = { value: functions[f] };
    }

    // add them to the current object
    Object.defineProperties(this, functions);

    // perform seed initialisation
    if (seedval === undefined) {
      seedval = Math.floor(Math.random() * p2_48);
    }
    setSeed(seedval);
  }
};

// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;

  // compare lengths - can save a lot of time 
  if (this.length != array.length)
    return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

// Warn if overriding existing method
if (Array.prototype.contains)
  console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.contains = function (array) {
  if (this.length == 0)
    return -1;

  if (this == null)
    return -1;

  if (!this)
    return -1;

  if (array == null)
    return -1;

  if (!array)
    return -1;

  let e = -1;
  let b = false;
  let o = 0;
  this.forEach((data) => {
    let set = false;
    if (b)
      return;

    if (data.length != array.length)
      return;

    for (let i = 0; i < data.length; i++) {
      if (data[i] == array[i]) {
        if (!set) {
          b = true;
          e = o;
        }
      } else {
        b = false;
        set = true;
      }
    }
    o += 1;
  });
  if (b && e != -1)
    return e;

  return -1;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "contains", { enumerable: false });