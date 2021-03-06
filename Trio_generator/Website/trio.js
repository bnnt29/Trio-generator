var urlp = []; if (location.toString().indexOf('?') != -1) { s = location.toString().split('?'); s = s[1].split('&'); for (i = 0; i < s.length; i++) { if (s[i].indexOf('=') != -1) { u = s[i].split('='); urlp[u[0]] = u[1]; } else { urlp[s[i]] = ""; } } }
//label
var xlabeled = urlp['xcord'] || false;
var ylabeled = urlp['ycord'] || true;

var color = false;

var darkmode = false;
var used_calcs = [];
var calculation_bools = ((urlp['calcs'] != null || urlp['calcs'] != "") ? urlp['calcs'] : "111111") || "111111";
var font_size = ((parseInt(urlp['font_size']) == null || parseInt(urlp['font_size']) == "" || !Number.isNaN(parseInt(urlp['font_size']))) ? (parseInt(urlp['font_size']) <= 100 ? ((parseInt(urlp['font_size']) >= 0) ? parseInt(urlp['font_size']) : 0) : 100) : 40) || 40;
var prefont = font_size;

var teams = ((parseInt(urlp['teams']) == null || parseInt(urlp['teams']) == "" || !Number.isNaN(parseInt(urlp['teams']))) ? (parseInt(urlp['teams']) <= 12 ? ((parseInt(urlp['teams']) >= 0) ? parseInt(urlp['teams']) : 0) : 12) : 0) || 0;
var team_names = (urlp['names'] != null) ? ((urlp['names'].indexOf('$') != -1) ? urlp['names'].split('$') : []) : [];
team_names = team_names.splice(0, team_names.length - 1);
var team_count = (urlp['points'] != null) ? ((urlp['points'].indexOf('$') != -1) ? urlp['points'].split('$').map(Number) : []) : [];

var preteams = teams;

//colors
var right_color = "#00FF00";
var wrong_color = "#FF0000";
var pending_color = "#0000FF";
var darkmode_black = "#141414";

var mode = ((parseInt(urlp['mode']) == null || parseInt(urlp['mode']) == "" || !Number.isNaN(parseInt(parseInt(urlp['mode'])))) ? (parseInt(urlp['mode']) <= 5 ? ((parseInt(urlp['mode']) >= 1) ? parseInt(urlp['mode']) : 1) : 5) : 2) || 2;
var premode = mode;
var setmodalcalcs = false;

//numbers
var extreme_calc = true;
var clicked_box = [];
var possible_box = [];
var box = [];
var clicked_rows = [];
var clicked_columns = [];
//seed
var Hex_r_seed = urlp['seed'] || "0000";

//grid_setup
var rows = ((parseInt(urlp['rows']) == null || parseInt(urlp['rows']) == "" || !Number.isNaN(parseInt(urlp['rows']))) ? (parseInt(urlp['rows']) <= 100 ? ((parseInt(urlp['rows']) >= 3) ? parseInt(urlp['rows']) : 3) : 100) : 10) || 10; //Zeilen
var columns = ((parseInt(urlp['columns']) == null || parseInt(urlp['columns']) == "" || !Number.isNaN(parseInt(parseInt(urlp['columns'])))) ? (parseInt(urlp['columns']) <= 100 ? ((parseInt(urlp['columns']) >= 3) ? parseInt(urlp['columns']) : 3) : 100) : 10) || 10; //Spalten
var prerow = rows;
var precol = columns;
var clickedrow = -1;
var clickedcol = -1;
var objects = [];
var black = false;
var help = false;
var helps = 0;

//audio
var sounds = (urlp['sounds'] != null) ? ((urlp['sounds'].indexOf('$') != -1) ? urlp['sounds'].split('$') : []) : [];
var events = ["Wuerfeln", "Rechnung - falsch", "Rechnung - richtig", "Sieges Bedingung", "Punkt"];
var wincon = (urlp['sounds'] != null) ? ((urlp['sounds'].indexOf('$') != -1) ? urlp['sounds'].split('$')[0] : 10) : 10;
var music_files = [];

var coll = document.getElementsByClassName("collapsible");

var buttons_init = false;

function play(path) {
  new Audio(path).play();
}

function playindex(index) {
  if (index >= 0 && index <= sounds.length) {
    if (sounds[index] != null) {
      if (sounds[index].indexOf(".mp3") != -1) {
        play("Media/" + sounds[index]);
      } else if (sounds[index] === "random") {
        let files = music_files;
        for (let i = 0; i < files.length; i++) {
          if (!files[i].endsWith(".mp3")) {
            files.splice(i, 1);
          }
        }
        play("Media/" + files[Math.round(Math.random() * files.length)]);
      } else if (sounds[index].indexOf("frequence") != -1) {
        playstand(sounds[index].split('!')[1]);
      }
    }
  }
}

function setup() {
  sounds.splice(0, 1);
  if (Hex_r_seed.length > 4) {
    let s = location.toString().substring(0, location.toString().indexOf("seed=") + 5) + Hex_r_seed.substring(0, 4);
    if (location.toString().lastIndexOf('&') > location.toString().indexOf("seed=")) {
      s += location.toString().substring(location.toString().lastIndexOf("&"), location.toString().length);
    }
    location.href = s;
  }
  r = new init_numbers(parseInt(Hex_r_seed, 16), this);
  r.rand();
  gen_html_fields();

  if (urlp['darkmode'] === "") {
    dark_switch();
  }

  if (urlp['color'] === "") {
    color = true;
  }
  Array.prototype.forEach.call(document.getElementsByClassName("clear_b"), (data) => {
    data.onclick = function () {
      clickedBoxClear(); if (help) { show_help(); } else {
        box.forEach((data) => {
          togglebtn(document.getElementById(data), false);
        });
      }
    }
  });

  if (teams != team_count.length) {
    close_settings(null);
  }

  teamssetup();

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.display === "block") {
        content.style.display = "none";
      } else {
        content.style.display = "block";
      }
    });
  }

  document.getElementById("wait").style.display = "none";
  document.getElementsByClassName("container-fluid")[0].style.display = "block";

  document.addEventListener('keydown', (e) => {
    if (document.getElementById("instructions_modal").style.display === "none") {
      switch (e.code) {
        case "Escape":
          clickedBoxClear(); if (help) { show_help(); } else {
            box.forEach((data) => {
              togglebtn(document.getElementById(data), false);
            });
          }
          break;
        case "Digit1" || "Numpad1":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(0);
            } else {
              clicked_column(0);
            }
          }
          break;
        case "Digit2" || "Numpad2":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(1);
            } else {
              clicked_column(1);
            }
          }
          break;
        case "Digit3" || "Numpad3":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(2);
            } else {
              clicked_column(2);
            }
          }
          break;
        case "Digit4" || "Numpad4":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(3);
            } else {
              clicked_column(3);
            }
          }
          break;
        case "Digit5" || "Numpad5":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(4);
            } else {
              clicked_column(4);
            }
          }
          break;
        case "Digit6" || "Numpad6":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(5);
            } else {
              clicked_column(5);
            }
          }
          break;
        case "Digit7" || "Numpad7":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(6);
            } else {
              clicked_column(6);
            }
          }
          break;
        case "Digit8" || "Numpad8":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(7);
            } else {
              clicked_column(7);
            }
          }
          break;
        case "Digit9" || "Numpad9":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(8);
            } else {
              clicked_column(8);
            }
          }
          break;
        case "Digit0" || "Numpad0":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((xlabeled === true || xlabeled === "true" ? true : false)) {
              clicked_row(9);
            } else {
              clicked_column(9);
            }
          }
          break;
        case "KeyA":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(0);
            } else {
              clicked_column(0);
            }
          }
          break;
        case "KeyB":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(1);
            } else {
              clicked_column(1);
            }
          }
          break;
        case "KeyC":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(2);
            } else {
              clicked_column(2);
            }
          }
          break;
        case "KeyD":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(3);
            } else {
              clicked_column(3);
            }
          }
          break;
        case "KeyE":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(4);
            } else {
              clicked_column(4);
            }
          }
          break;
        case "KeyF":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(5);
            } else {
              clicked_column(5);
            }
          }
          break;
        case "KeyG":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(6);
            } else {
              clicked_column(6);
            }
          }
          break;
        case "KeyH":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(7);
            } else {
              clicked_column(7);
            }
          }
          break;
        case "KeyI":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(8);
            } else {
              clicked_column(8);
            }
          }
          break;
        case "KeyJ":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(9);
            } else {
              clicked_column(9);
            }
          }
          break;
        case "KeyK":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(10);
            } else {
              clicked_column(10);
            }
          }
          break;
        case "KeyL":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(11);
            } else {
              clicked_column(11);
            }
          }
          break;
        case "KeyM":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(12);
            } else {
              clicked_column(12);
            }
          }
          break;
        case "KeyN":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(13);
            } else {
              clicked_column(13);
            }
          }
          break;
        case "KeyO":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(14);
            } else {
              clicked_column(14);
            }
          }
          break;
        case "KeyP":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(15);
            } else {
              clicked_column(15);
            }
          }
          break;
        case "KeyQ":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(16);
            } else {
              clicked_column(16);
            }
          }
          break;
        case "KeyR":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(17);
            } else {
              clicked_column(17);
            }
          }
          break;
        case "KeyS":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(18);
            } else {
              clicked_column(18);
            }
          }
          break;
        case "KeyT":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(19);
            } else {
              clicked_column(19);
            }
          }
          break;
        case "KeyU":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(20);
            } else {
              clicked_column(20);
            }
          }
          break;
        case "KeyV":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(21);
            } else {
              clicked_column(21);
            }
          }
          break;
        case "KeyW":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(22);
            } else {
              clicked_column(22);
            }
          }
          break;
        case "KeyX":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(23);
            } else {
              clicked_column(23);
            }
          }
          break;
        case "KeyY":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(24);
            } else {
              clicked_column(24);
            }
          }
          break;
        case "KeyZ":
          if (!(xlabeled === true || xlabeled === "true" ? true : false) === (ylabeled === true || ylabeled === "true" ? true : false)) {
            if ((ylabeled === true || ylabeled === "true" ? true : false)) {
              clicked_row(25);
            } else {
              clicked_column(25);
            }
          }
          break;
        case "ArrowUp":
          if (clicked_box.length > 0) {
            field_pressed(clicked_box[0][0] - 1, clicked_box[0][1]);
          }
          break;
        case "ArrowDown":
          if (clicked_box.length > 0) {
            field_pressed(clicked_box[0][0] + 1, clicked_box[0][1]);
          }
          break;
        case "ArrowLeft":
          if (clicked_box.length > 0) {
            field_pressed(clicked_box[0][0], clicked_box[0][1] - 1);
          }
          break;
        case "ArrowRight":
          if (clicked_box.length > 0) {
            field_pressed(clicked_box[0][0], clicked_box[0][1] + 1);
          }
          break;
      }
    }
  });

  modal();
}

function copyclip() {
  /* Get the text field */
  var copyText = document.getElementById("seed");

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.innerHTML);

  /* Alert the copied text */
  tempAlert("Copied the field seed: " + copyText.innerHTML, 1000);
}

function tempAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute("style", "position:absolute;top:33%;left:0%;background-color:white;");
  el.innerHTML = msg;
  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}

function loadFolder(folderPath) {
  return new Promise(function (resolve, reject) {
    let result;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", folderPath, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else if (this.status >= 400 && this.status <= 405) {
          let entries = document.getElementById("folder_entries").innerHTML;
          let save = entries.toString().split("/");
          entries = [];
          for (let i = 1; i < save.length - 1; i++) {
            if (!(save[i] === '')) {
              entries = [...entries, save[i]];
            }
          }
          music_files = entries;
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
          return result;
        }
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
      return result;
    };
    xhr.send(() => {
      if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
      }
      return result;
    });
  });
}

async function loadFiles(folderPath) {
  let folder = [];
  try {
    folder = await loadFolder(folderPath);
    if (folder == null || folder.length <= 0) {
      folder = await loadFolder(folderPath);
      if (folder == null || folder.length <= 0) {
        return null;
      }
    }
  }
  catch (e) {
    folder = [];
  }
  if (folder == null || folder.length <= 0) {
    presetup();
    return null;
  }
  let folderentries = folder.split("href=");
  folderentries.splice(0, 6);
  for (let i = 0; i < folderentries.length; i++) {
    folderentries[i] = folderentries[i].split('"')[1];
  }
  music_files = folderentries;
  presetup();
}

function presetup() {
  let files = music_files.slice(0, music_files.length);
  if (files != null && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      if (!files[i].endsWith(".mp3")) {
        files.splice(i, 1);
      }
    }
    files = ["------------", ...files];
    files = [...files, "frequence"];
    if (files.length > 2) {
      files = [...files, "random"];
    }
  } else {
    files = ["------------"];
    files = [...files, "frequence"];
  }
  soundsetup(files);
}

function createevents() {
  let events2 = events.slice(0, events.length);
  for (let i = 0; i < preteams; i++) {
    events2.splice(events2.indexOf("Punkt") + i + 1, 0, "Punkt Team: ");
    if (team_names[i] == null || team_names[i] == "") {
      events2[events2.length - 1] += (i + 1);
    } else {
      events2[events2.length - 1] += team_names[i];
    }
  }
  return events2;
}

function updatesound(a, b, c) {
  sounds[a] = b;
  if (b === "frequence") {
    try {
      sounds[a] += "!";
      sounds[a] += document.getElementById("freq_input_" + c).value;
    } catch (e) {
      console.log(e);
    }
  }
}

function soundsetup(files) {
  let container = document.getElementById("sound_container");
  container.innerHTML = null;
  let events2 = createevents();
  events2.forEach((data) => {
    if (!((data === "Sieges Bedingung" || data === "Punkt") && preteams < 1)) {
      let row1 = document.createElement("div");
      row1.classList.add("row");
      row1.style.marginTop = "1rem";
      let col1 = document.createElement("div");
      col1.classList.add("col-lg-3");
      let p1 = document.createElement("p");
      p1.classList.add("titel");
      p1.innerHTML = data + " :";
      p1.id = data;
      if (data.startsWith("Punkt Team:")) {
      }
      if (data.startsWith("Punkt Team:")) {
        document.getElementById("name Team " + (events2.indexOf(data) - events2.indexOf("Punkt"))).oninput = function () {
          if (this.value === null || this.value === "") {
            p1.innerHTML = "Punkt Team: " + this.placeholder + " : ";
          } else {
            p1.innerHTML = "Punkt Team: " + this.value + " : ";
          }
          team_names[(events2.indexOf(data) - events2.indexOf("Punkt")) - 1] = this.value;
        }
        document.getElementById("name Team " + (events2.indexOf(data) - events2.indexOf("Punkt"))).addEventListener('propertychange', () => {
          if (this.value === null || this.value === "") {
            p1.innerHTML = "Punkt Team: " + this.placeholder + " : ";
          } else {
            p1.innerHTML = "Punkt Team: " + this.value + " : ";
          }
          team_names[(events2.indexOf(data) - events2.indexOf("Punkt")) - 1] = this.value;
        });
      }
      col1.appendChild(p1);
      p1.style.textAlign = "center";
      let col2 = document.createElement("div");
      col2.classList.add("col-lg-6");
      col2.style.display = "block";
      col2.style.textAlign = "center";
      let sel = document.createElement("select");
      sel.id = "sound_select_" + data;
      sel.title = "sound " + data;
      files.forEach((file) => {
        let opt = document.createElement("option");
        opt.value = file;
        if (file.indexOf(".mp3") != -1) {
          opt.innerHTML = file.substring(0, file.length - 4);
        } else {
          opt.innerHTML = file;
        }
        sel.appendChild(opt);
      });
      if (sounds.length > events2.indexOf(data) && sounds[events2.indexOf(data)] != null && sounds[events2.indexOf(data)] != "") {
        let inde = files.indexOf(sounds[events2.indexOf(data)].split('!')[0]);
        if (inde <= 0) {
          sel.value = "------------";
        } else {
          sel.value = files[inde];
        }
      } else {
        sel.value = "------------";
      }

      let div = document.createElement("div");
      div.style.display = "inline";
      div.id = "div_sound_select_" + data;

      if (sel.value === "frequence") {
        addinputforfreq(div, data, events2);
      }
      sel.onchange = function () {
        if (sel.value === "frequence") {
          addinputforfreq(div, data, events2);
          if (sel.id.endsWith("Wuerfeln")) {
            document.getElementById("sound_checkbox").checked = true;
          }
        } else if (sel.id.endsWith("Wuerfeln")) {
          if (sel.value === "------------") {
            div.innerHTML = null;
            document.getElementById("sound_checkbox").checked = false;
          } else {
            div.innerHTML = null;
            document.getElementById("sound_checkbox").checked = true;
          }
        } else {
          div.innerHTML = null;
        }
        updatesound((events2.indexOf(data)), sel.value, data);
      };

      let col3 = document.createElement("div");
      col3.classList.add("col-lg-3");
      col3.style.textAlign = "center";
      if (data === "Sieges Bedingung") {
        let p = document.createElement("p");
        p.innerHTML = "Punkte: ";
        p.classList.add("titel");
        col3.appendChild(p);
        let input = document.createElement("input");
        input.type = "number";
        input.placeholder = wincon;
        input.style.marginLeft = "1rem";
        input.id = "wincon_input"
        col3.appendChild(input);
      }

      let play1 = document.createElement("button");
      play1.setAttribute("onclick", "playsel('" + data + "')");
      play1.innerHTML = "&#9654";
      play1.style.margin = "0.5rem";
      col2.appendChild(sel);
      col2.appendChild(play1);
      col2.appendChild(div);
      row1.appendChild(col1);
      row1.appendChild(col3);
      row1.appendChild(col2);
      container.appendChild(row1);
      if (data === "Sieges Bedingung" || (data.indexOf("6") != -1 && preteams > 6)) {
        let hr = document.createElement("hr");
        hr.style.borderWidth = "0.5rem";
        container.appendChild(hr);
      }
    }
  });
}

function addinputforfreq(div, data, events) {
  let input = document.createElement("input");
  input.type = "range";
  input.min = 20;
  input.max = 3000;
  input.width = "60%";
  if (sounds.length > createevents().indexOf(data) && sounds[createevents().indexOf(data)] != null && sounds[createevents().indexOf(data)] != "" && sounds[createevents().indexOf(data)].indexOf("frequence") != -1) {
    input.value = sounds[createevents().indexOf(data)].split('!')[1];
  } else {
    input.value = 450;
  }
  input.style.marginLeft = "1rem";
  input.id = "freq_input_" + data;
  let p = document.createElement("p");
  p.classList.add("titel");
  p.innerHTML = "Frequenz (Hz): " + input.value;
  if (black) {
    p.style.color = "#FFFFFF";
  } else {
    p.style.color = "#000000";
  }
  input.onchange = function () {
    p.innerHTML = "Frequenz (Hz): " + this.value;
    sounds[createevents().indexOf(data)] = "frequence!" + this.value;
  }
  div.appendChild(p);
  div.appendChild(input);
  div.addEventListener('dblclick', () => {
    input.value = 450;
    p.innerHTML = "Frequenz (Hz): " + input.value;
  });
}

function playsel(datas) {
  let data = document.getElementById("sound_select_" + datas).value;
  if (data.indexOf(".mp3") != -1) {
    play("Media/" + data);
  } else {
    if (data === "frequence") {
      playstand(document.getElementById("freq_input_" + datas).value);
    } else if (data === "random") {
      let files = music_files;
      for (let i = 0; i < files.length; i++) {
        if (!files[i].endsWith(".mp3")) {
          files.splice(i, 1);
        }
      }
      play("Media/" + files[Math.round(Math.random() * files.length)]);
    }
  }
}

function teamssetup() {
  if (teams >= 2) {
    for (let i = 1; i <= teams; i++) {
      let col1 = document.createElement("div");
      col1.classList.add("col-lg-" + (12 / teams));
      col1.style.border = "solid";
      col1.style.borderTop = "none";
      col1.style.borderBottom = "none";
      if (i > 1) {
        col1.style.borderLeft = "3%";
      } else {
        col1.style.borderLeft = "none";
      }
      col1.style.borderRight = "none";
      col1.style.padding = "0px";
      col1.style.margin = "0px";
      let row1 = document.createElement("div");
      row1.classList.add("row");
      row1.setAttribute("onclick", "teampoints('+'," + (i - 1) + ")");
      col1.appendChild(row1);
      document.getElementById("points").appendChild(col1);
      col2 = document.createElement("div");
      col2.classList.add("col-lg-12");
      p1 = document.createElement("p");
      if (i > team_names.length || team_names[i - 1] == null || team_names[i - 1] == "") {
        p1.innerHTML = "Team " + i;
      } else {
        p1.innerHTML = team_names[i - 1].replaceAll('%20', ' ');
      }
      if (black) {
        p1.style.color = "#FFFFFF";
        col2.style.borderColor = "#FFFFFF";
      } else {
        p1.style.color = "#000000";
        col2.style.borderColor = "#000000";
      }
      p1.style.textAlign = "center";
      p1.classList.add("footer");
      col2.appendChild(p1);
      row1.appendChild(col2);
      row2 = document.createElement("div");
      row2.setAttribute("onclick", "teampoints('+'," + (i - 1) + ")");
      row2.classList.add("row");
      row2.style.height = "50px";
      col3 = document.createElement("div");
      col3.classList.add("col-lg-12");
      let p2 = document.createElement("p");
      p2.classList.add("footer");
      p2.id = "team" + i;
      if (i <= team_count.length) {
        p2.innerHTML = team_count[i - 1];
      } else {
        team_count[i - 1] = 0;
        p2.innerHTML = team_count[i - 1] + "";
      }
      if (black) {
        p2.style.color = "#FFFFFF";
        col3.style.borderColor = "#FFFFFF";
      } else {
        p2.style.color = "#000000";
        col3.style.borderColor = "#000000";
      }
      p2.style.textAlign = "center";
      col3.appendChild(p2);
      row2.appendChild(col3);
      col1.appendChild(row2);
      let row3 = document.createElement("div");
      row3.classList.add("row");
      let col4 = document.createElement("div");
      col4.classList.add("col-lg-12");
      let b = document.createElement("button");
      b.innerHTML = "-";
      objects = [...objects, b];
      b.setAttribute("team", i);
      b.onclick = function () { teampoints("-", (i - 1)); }
      b.style.textAlign = "center";
      button_styles(b, "10%", "100%");
      button_color(b);
      col4.align = "center";
      col4.appendChild(b);
      row3.appendChild(col4);
      col1.appendChild(row3);
    }
  }
}

function teampoints(e, i) {
  if (e === "+") {
    team_count[i] += 1;
    if (team_count[i] % wincon == 0) {
      playindex(3);
    } else {
      playindex(4);
      playindex(5 + i);
    }
  } else if (e === "-") {
    team_count[i] -= 1;
  }
  refreshpoints(i);
}

function refreshpoints(i) {
  document.getElementById("team" + (i + 1)).innerHTML = team_count[i];
  let s = location.toString().substring(location.toString().indexOf('/'), location.toString().indexOf('points=') + 7);
  team_count.forEach((data) => {
    s += data + "$";
  });
  s = s.substring(0, s.length - 1);
  let u = location.toString().substring(location.toString().indexOf('points=') + 7, location.toString().length);
  let e = u.indexOf("&");
  if (e > 0) {
    s += location.toString().substring(location.toString().indexOf('points=') + 7 + e, location.toString().length);
  }
  window.history.pushState("updated_Points", "Trio", "/" + s);
}

function reset_points() {
  team_count = [];
  for (let i = team_count.length; i < preteams; i++) {
    team_count[i] = 0;
  }
  for (let i = 0; i < teams; i++) {
    refreshpoints(i);
  }
}

function clicked_row(i) {
  if (i + 1 > rows || i < 0) {
    return;
  }
  if (clickedrow == -1) {
    document.getElementById("cord_r" + i).style.backgroundColor = "#F8A000";
    if (clicked_box.length == 0) {
      if (clickedcol == -1) {
        clickedrow = i;
      } else {
        field_pressed(i, clickedcol);
        clickedrow = -1;
        clickedcol = -1;
      }
    } else if (clicked_box.length < 2) {
      field_pressed(i, clicked_box[0][1]);
      clickedrow = -1;
      clickedcol = -1;
    } else {
      if (i != clicked_box[0][0]) {
        let save = clicked_box[0];
        clickedBoxClear();
        field_pressed(save[0], save[1]);
        if (!(i == clicked_box[0][0] + 1 || i == clicked_box[0][0] + 2 || i == clicked_box[0][0] - 1 || i == clicked_box[0][0] - 2)) {
          clicked_column(i);
        }
      } else {
        clickedBoxClear();
        box.forEach((data) => {
          togglebtn(document.getElementById(data), false);
        });
      }
    }
  } else if (i == clickedrow) {
    button_color(document.getElementById("cord_r" + i));
    clickedrow = -1;
  } else {
    button_color(document.getElementById("cord_r" + clickedrow));
    clickedrow = -1;
    clicked_row(i);
  }
}

function clicked_column(e) {
  if (e + 1 > columns || e < 0) {
    return;
  }
  if (clickedcol == -1) {
    document.getElementById("cord_ct" + e).style.backgroundColor = "#F8A000"
    document.getElementById("cord_cb" + e).style.backgroundColor = "#F8A000"
    if (clicked_box.length == 0) {
      if (clickedrow == -1) {
        clickedcol = e;
      } else {
        field_pressed(clickedrow, e);
        clickedrow = -1;
        clickedcol = -1;
      }
    } else if (clicked_box.length < 2) {
      field_pressed(clicked_box[0][0], e);
      clickedrow = -1;
      clickedcol = -1;
    } else {
      if (e != clicked_box[0][1]) {
        let save = clicked_box[0];
        clickedBoxClear();
        field_pressed(save[0], save[1]);
        if (!(e == clicked_box[0][1] + 1 || e == clicked_box[0][1] + 2 || e == clicked_box[0][1] - 1 || e == clicked_box[0][1] - 2)) {
          clicked_column(e);
        }
      } else {
        clickedBoxClear();
        box.forEach((data) => {
          togglebtn(document.getElementById(data), false);
        });
      }
    }
  } else if (e == clickedcol) {
    button_color(document.getElementById("cord_ct" + e));
    button_color(document.getElementById("cord_cb" + e));
    clickedcol = -1;
  } else {
    button_color(document.getElementById("cord_ct" + clickedcol));
    button_color(document.getElementById("cord_cb" + clickedcol));
    clickedcol = -1;
    clicked_column(e);
  }
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

  if (teams >= 2) {
    document.getElementById("teams_checkbox").checked = true;
    preteams = teams;
    Array.prototype.forEach.call(document.getElementsByClassName("team_element"), (data) => {
      data.style.display = "";
    });
    addfields(true);
    document.getElementById("teams_count").innerHTML = preteams;
  }

  // When the user clicks the button, open the modal 
  btn_settings.onclick = function () {
    if (black) {
      document.getElementById("settings_body").style.backgroundColor = darkmode_black;
      document.getElementById("sound_container").style.backgroundColor = darkmode_black;
      document.getElementById("row_count").style.color = "#FFFFFF";
      document.getElementById("col_count").style.color = "#FFFFFF";
      document.getElementById("font_size").style.color = "#FFFFFF";
      document.getElementById("current_seed").style.color = "#FFFFFF";
      document.getElementById("mode_count").style.color = "#FFFFFF";
      Array.prototype.forEach.call(document.getElementsByClassName("titel"), (data) => {
        data.style.color = "#FFFFFF";
      });
      for (let i = 0; i < r.getprecalcs().length; i += 2) {
        if (r.getprecalcs().length > i + 1) {
          document.getElementById("l_" + r.getprecalcs()[i]).style.color = "#FFFFFF";
        }
      }
    } else {
      document.getElementById("settings_body").style.backgroundColor = "#FFFFFF";
      document.getElementById("sound_container").style.backgroundColor = "#FFFFFF";
      document.getElementById("row_count").style.color = "#000000";
      document.getElementById("col_count").style.color = "#000000";
      document.getElementById("font_size").style.color = "#000000";
      document.getElementById("current_seed").style.color = "#000000";
      document.getElementById("mode_count").style.color = "#000000";
      Array.prototype.forEach.call(document.getElementsByClassName("titel"), (data) => {
        data.style.color = "#000000";
      });
      for (let i = 0; i < r.getprecalcs().length; i += 2) {
        if (r.getprecalcs().length > i + 1) {
          document.getElementById(r.getprecalcs()[i]).style.color = "#000000";
        }
      }
    }
    settings.style.display = "block";
  }
  if (!setmodalcalcs) {
    setmodalcalcs = true;
    for (let i = 0; i < r.getprecalcs().length; i += 4) {
      let col = document.createElement("div");
      col.classList.add("col-lg-3");
      col.style.width = "15%";
      col.style.margin = "0 auto";
      for (let e = i; e < (((4 * (i / 4 + 1)) > r.getprecalcs().length) ? r.getprecalcs().length : (4 * (i / 4 + 1))); e += 2) {
        if (r.getprecalcs().length > e + 1) {
          let input = document.createElement("input");
          input.setAttribute("type", "checkbox");
          input.id = r.getprecalcs()[e];
          input.name = r.getprecalcs()[e];
          input.value = r.getprecalcs()[e];
          col.appendChild(input);
          let label = document.createElement("label");
          label.style.marginLeft = "1rem";
          label.id = "l_" + r.getprecalcs()[e];
          label.for = r.getprecalcs()[e];
          label.style.marginRight = "2rem";
          label.innerHTML = r.getprecalcs()[e].charAt(0) + " und " + r.getprecalcs()[e].charAt(1);
          col.appendChild(label);
          if (e < 4 * (i / 4 + 1)) {
            col.appendChild(document.createElement("br"));
          }
        }
      }
      document.getElementById("calcs_container").appendChild(col);
    }
  }

  document.getElementById("color_checkbox").checked = (color === true || color === "true" ? true : false);
  if (sounds[0] != null && sounds[0].length > 0) {
    document.getElementById("sound_checkbox").checked = true;
  } else {
    document.getElementById("sound_checkbox").checked = false;
  }
  document.getElementById("sound_checkbox").onclick = function () {
    try {
      if (document.getElementById("sound_checkbox").checked) {
        document.getElementById("sound_select_Wuerfeln").value = "frequence";
        let div = document.getElementById("div_sound_select_Wuerfeln");
        addinputforfreq(div, "Wuerfeln", createevents());
      } else {
        document.getElementById("sound_select_Wuerfeln").value = "------------";
        document.getElementById("div_sound_select_Wuerfeln").innerHTML = null;
      }
      updatesound(0, document.getElementById("sound_select_Wuerfeln").value, "Wuerfeln");
    } catch (e) {
      console.log(e);
    }
  };


  button_styles(document.getElementById("row+"), "80%", "48%");
  document.getElementById("row+").style.fontSize = "150%";
  button_styles(document.getElementById("row-"), "80%", "48%");
  document.getElementById("row-").style.fontSize = "150%";
  button_styles(document.getElementById("col+"), "80%", "48%");
  document.getElementById("col+").style.fontSize = "150%";
  button_styles(document.getElementById("col-"), "80%", "48%");
  document.getElementById("col-").style.fontSize = "150%";
  button_styles(document.getElementById("font+"), "80%", "48%");
  document.getElementById("font+").style.fontSize = "150%";
  button_styles(document.getElementById("font-"), "80%", "48%");
  document.getElementById("font-").style.fontSize = "150%";
  button_styles(document.getElementById("mode+"), "80%", "48%");
  document.getElementById("mode+").style.fontSize = "150%";
  button_styles(document.getElementById("mode-"), "80%", "48%");
  document.getElementById("mode-").style.fontSize = "150%";
  button_styles(document.getElementById("teams+"), "80%", "48%");
  document.getElementById("teams+").style.fontSize = "150%";
  button_styles(document.getElementById("teams-"), "80%", "48%");
  document.getElementById("teams-").style.fontSize = "150%";

  document.getElementById("row_count").innerHTML = prerow;
  document.getElementById("col_count").innerHTML = precol;
  document.getElementById("font_size").innerHTML = prefont + "%";
  document.getElementById("mode_count").innerHTML = premode;
  document.getElementById("current_seed").innerHTML = Hex_r_seed

  if (xlabeled === true || xlabeled === "true") {
    document.getElementById("x123").checked = false;
    document.getElementById("xabc").checked = true;
  } else {
    document.getElementById("xabc").checked = false;
    document.getElementById("x123").checked = true;
  }
  if (ylabeled === true || ylabeled === "true") {
    document.getElementById("y123").checked = false;
    document.getElementById("yabc").checked = true;
  } else {
    document.getElementById("yabc").checked = false;
    document.getElementById("y123").checked = true;
  }
  for (let o = 0; o < r.getcalculationlist().length; o += 2) {
    if (r.getprecalcs().length > o + 1) {
      document.getElementById(r.getcalculationlist()[o]).checked = true;
    }
  }

  document.getElementById("seed_field").placeholder = Hex_r_seed;

  button_styles(document.getElementById("reset_url_b"), "100%", "100%");
  objects.splice(objects.indexOf("reset_url_b"), 1);
  document.getElementById("reset_url_b").style.fontSize = "100%";
  document.getElementById("reset_url_b").style.minWidth = "190px";
  document.getElementById("reset_url_b").style.minHeight = "10px";
  document.getElementById("reset_url_b").style.backgroundColor = "#EE6565";
  button_styles(document.getElementById("save_url_b"), "100%", "100%");
  objects.splice(objects.indexOf("save_url_b"), 1);
  document.getElementById("save_url_b").style.fontSize = "100%";
  document.getElementById("save_url_b").style.minWidth = "190px";
  document.getElementById("save_url_b").style.minHeight = "10px";
  document.getElementById("save_url_b").style.backgroundColor = "#65EE65";
  document.getElementById("save_url_b").onclick = function () {
    close_settings(settings);
  }
  // When the user clicks on <span> (x), close the modal
  span_settings.onclick = function () {
    close_settings(settings);
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == settings) {
      close_settings(settings);
    } else if (event.target == instruction) {
      instruction.style.display = "none";
    }
  }
  loadFiles("Media/", true);
}

function addfields(a) {
  document.getElementById("names_container").innerHTML = null;
  if (a) {
    for (let o = 0; o < preteams; o++) {
      let input = document.createElement("input");
      if (team_names.length <= o || team_names[o] == null || team_names[o] == "") {
        input.placeholder = "Team " + (o + 1);
      } else {
        input.placeholder = team_names[o];
      }
      input.id = "name " + "Team " + (o + 1);
      input.style.width = 100 / preteams + "%";
      document.getElementById("names_container").appendChild(input);
    }
  } else {
    document.getElementById("names_container").innerHTML = null;
  }
}

function teamsco(a) {
  if (a === '+') {
    if (preteams < 4) {
      preteams += 1;
      addfields(true);
    } else if (preteams == 4) {
      preteams = 6;
      addfields(true);
    } else if (preteams == 6) {
      preteams = 12;
      addfields(true);
    }
  } else if (a === '-') {
    if (preteams > 2 && preteams <= 4) {
      preteams -= 1;
      addfields(true);
    } else if (preteams <= 2) {
      toggleteam();
    } else if (preteams == 6) {
      preteams = 4;
      addfields(true);
    } else if (preteams == 12) {
      preteams = 6;
      addfields(true);
    }
  }
  document.getElementById("teams_count").innerHTML = preteams;
  presetup();
}

function toggleteam() {
  if (teams >= 2) {
    teams = 0;
    preteams = teams;
    Array.prototype.forEach.call(document.getElementsByClassName("team_element"), (data) => {
      data.style.display = "none";
    });
    document.getElementById("teams_checkbox").checked = false;
    addfields(false);
    team_names = [];
  } else {
    document.getElementById("teams_checkbox").checked = true;
    teams = 2;
    preteams = teams;
    Array.prototype.forEach.call(document.getElementsByClassName("team_element"), (data) => {
      data.style.display = "";
    });
    addfields(true);
  }
  document.getElementById("teams_count").innerHTML = preteams;
  presetup();
}

function reset_url() {
  location.href = location.toString().substring(0, location.toString().indexOf('?'));
}

function close_settings(settings) {
  if (settings != null) {
    settings.style.display = "none";
  }
  let yl;
  let xl;
  let colorc = document.getElementById("color_checkbox").checked;
  if (document.getElementById("xabc").checked) {
    xl = true;
  } else if (document.getElementById("x123").checked) {
    xl = false;
  }
  if (document.getElementById("yabc").checked) {
    yl = true;
  } else if (document.getElementById("y123").checked) {
    yl = false;
  }
  let sou = [];
  let value;
  if (document.getElementById("wincon_input") === null || document.getElementById("wincon_input") === 0 || document.getElementById("wincon_input").value === "" || document.getElementById("wincon_input").value === null) {
    if (document.getElementById("wincon_input") === null || document.getElementById("wincon_input") === 0 || document.getElementById("wincon_input").placeholder === "" || document.getElementById("wincon_input").placeholder === null) {
      value = 10;
    } else {
      value = document.getElementById("wincon_input").placeholder;
    }
  } else {
    value = document.getElementById("wincon_input").value;
  }

  if (value == null || value == 0) {
    value = 10;
  }

  sou = [value];
  createevents().forEach((eve) => {
    try {
      let choose = document.getElementById("sound_select_" + eve).value;
      if (choose.indexOf("-----") != -1) {
        choose = "";
      }
      if (choose === "frequence") {
        choose += '!';
        choose += document.getElementById("freq_input_" + eve).value;
      }
      sou.splice(sou.length, 0, choose);
    }
    catch (e) {
      console.log(e);
    }
  });
  let c = "";
  for (let i = 0; i < r.getprecalcs().length; i += 2) { if (r.getprecalcs().length > i + 1) { c += "1"; } }
  let u = "";
  for (let i = 0; i < r.getprecalcs().length; i += 2) {
    if (r.getprecalcs().length > i + 1) {
      if (document.getElementById(r.getprecalcs()[i]).checked) {
        u += "1";
      } else {
        u += "0";
      }
    }
  }
  let b = [];
  for (let i = 0; i < preteams; i++) {
    b = [...b, document.getElementById("name " + "Team " + (i + 1)).value];
  }
  for (let i = 0; i < b.length; i++) {
    if (b[i] == null || b[i] == "" || b[i] == '$') {
      if (team_names[i] == null || team_names[i] == "") {
        b[i] = "";
      } else {
        b[i] = team_names[i];
      }
    }
  }
  saveSettings(u, c, colorc, b, xl, yl, sou);
}

function saveSettings(u, c, colorc, b, xl, yl, sou) {
  let s = location.toString().substring(location.toString().indexOf('/'), location.toString().indexOf('?') + 1);
  if (location.toString().indexOf('&') == -1) {
    if (!(10 == prerow && 10 == precol && 2 == premode && u === c && sou.length <= 0 && !colorc && b.length == 0 && preteams == 0 && 40 == prefont && document.getElementById("seed_field").value == "" && !xl && yl)) {
      if (document.getElementById("seed_field").value != "") {
        s += "seed=" + document.getElementById("seed_field").value.toString().substring(0, 4);
      } else {
        s += "seed=" + Hex_r_seed;
      }
      if (colorc) {
        s += '&';
        s += "color";
      }
      if (prerow != 10) {
        s += '&';
        s += "rows=" + prerow;
      }
      if (precol != 10) {
        s += '&';
        s += "columns=" + precol;
      }
      if (premode != 2) {
        s += '&';
        s += "mode=" + premode;
      }
      if (prefont != 40) {
        s += '&';
        s += "font_size=" + prefont;
      }
      if (u != c) {
        s += '&';
        s += "calcs=" + u;
      }
      if (xl != false) {
        s += '&';
        s += "xcord=" + xl;
      }
      if (yl != true) {
        s += '&';
        s += "ycord=" + yl;
      }
      if (preteams != 0) {
        s += '&';
        s += "teams=" + preteams;
        s += '&';
        s += 'points=';
        for (let i = team_count.length; i < preteams; i++) {
          team_count[i] = 0;
        }
        team_count.splice(preteams, team_count.length - preteams);
        team_count.forEach((data) => {
          s += data + "$";
        });
        s = s.substring(0, s.length - 1);
      }
      if (b.length != 0) {
        s += '&';
        s += "names=";
        b.forEach((data) => {
          s += data + "$";
        });
      }
      if (sou.length > 0) {
        s += '&';
        s += "sounds=";
        sou.forEach((so) => {
          s += so;
          s += "$";
        });
      }
      location.href = s;
    }
  } else {
    if (!(rows == prerow && columns == precol && u === calculation_bools && sounds === sou && color === colorc && [b].contains(team_names) != -1 && preteams == teams && mode == premode && prefont == font_size && document.getElementById("seed_field").value == "" && ((xl).toString() === (xlabeled).toString()) && (yl).toString() === (ylabeled).toString())) {
      if (document.getElementById("seed_field").value != "") {
        s += "seed=" + document.getElementById("seed_field").value.toString().substring(0, 4);
      } else {
        s += "seed=" + Hex_r_seed;
      }
      if (colorc) {
        s += '&';
        s += "color";
      }
      if (prerow != 10) {
        s += '&';
        s += "rows=" + prerow;
      }
      if (precol != 10) {
        s += '&';
        s += "columns=" + precol;
      }
      if (premode != 2) {
        s += '&';
        s += "mode=" + premode;
      }
      if (prefont != 40) {
        s += '&';
        s += "font_size=" + prefont;
      }
      if (u != c) {
        s += '&';
        s += "calcs=" + u;
      }
      if (xl != false) {
        s += '&';
        s += "xcord=" + xl;
      }
      if (yl != true) {
        s += '&';
        s += "ycord=" + yl;
      }
      if (preteams != 0) {
        s += '&';
        s += "teams=" + preteams;
        s += '&';
        s += 'points=';
        for (let i = team_count.length; i < preteams; i++) {
          team_count[i] = 0;
        }
        team_count.splice(preteams, team_count.length - preteams);
        team_count.forEach((data) => {
          s += data + "$";
        });
        s = s.substring(0, s.length - 1);
      }
      if (b.length != 0) {
        s += '&';
        s += "names=";
        b.forEach((data) => {
          s += data + "$";
        });
      }
      if (sou.length > 0) {
        s += '&';
        s += "sounds=";
        sou.forEach((so) => {
          s += so;
          s += "$";
        });
      }
      location.href = s;
    }
  }
}

function row(a) {
  if (a === '+') {
    if (prerow < 100) {
      prerow += 1;
    }
  } else if (a === '-') {
    if (prerow > 3) {
      prerow -= 1;
    }
  }
  document.getElementById("row_count").innerHTML = prerow;
}

function col(a) {
  if (a === '+') {
    if (precol < 100) {
      precol += 1;
    }
  } else if (a === '-') {
    if (precol > 3) {
      precol -= 1;
    }
  }
  document.getElementById("col_count").innerHTML = precol;
}

function font(a) {
  if (a === '+') {
    if (prefont <= 95) {
      prefont += 5;
    } else {
      prefont = 100;
    }
  } else if (a === '-') {
    if (prefont >= 6) {
      prefont -= 5;
    } else {
      prefont = 1;
    }
  }
  document.getElementById("font_size").innerHTML = prefont + "%";
}

function mode_set(a) {
  if (a === '+') {
    if (premode < 5) {
      premode += 1;
    }
  } else if (a === '-') {
    if (premode > 1) {
      premode -= 1;
    }
  }
  document.getElementById("mode_count").innerHTML = premode;
}

function gen_html_fields() {
  let b;
  var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight || docElem.clientHeight || body.clientHeight;
  window.onresize = function () {
    var win = window,
      doc = document,
      docElem = doc.documentElement,
      body = doc.getElementsByTagName('body')[0],
      x = win.innerWidth || docElem.clientWidth || body.clientWidth,
      y = win.innerHeight || docElem.clientHeight || body.clientHeight;
    document.getElementById("container").style.height = y * 0.9 + "px";
  };
  let height = (100 / (rows + 1)) + "%";
  let width = ((100 / ((columns + 1) * 1.025))) - 0.2 + "%";
  let row = document.createElement("div");
  row.classList.add("row");
  row.style.margin = "0.1%";
  row.style.marginBottom = "0.5%";
  row.style.justifyContent = "center";
  row.style.height = (100 / (rows + 1)) / 2 + "%";
  document.getElementById("container").appendChild(row);
  b = document.createElement("button");
  button_styles(b, "100%", ((100 / ((columns + 1) * 1.025)) / 1.7) - 0.2 + "%");
  b.style.border = "none";
  b.style.outline = "none"
  b.id = "placeholdert";
  b.title = "placeholdert";
  b.onclick = function () {
    clickedBoxClear(); if (help) { show_help(); } else {
      box.forEach((data) => {
        togglebtn(document.getElementById(data), false);
      });
    }
  }
  row.appendChild(b);
  for (let i = 0; i < columns; i++) {
    let col = document.createElement("div");
    col.classList.add("col");
    col.style.justifyContent = "center";
    col.style.height = "50%";
    b = document.createElement("button");
    let xlabel = init_label_list((xlabeled === true || xlabeled === "true" ? true : false));
    b.id = "cord_ct" + i;
    b.setAttribute("c", i);
    b.onclick = function () { clicked_column(i); }
    b.innerHTML = xlabel[i];
    button_styles(b, "100%", width);
    b.style.border = "none";
    b.style.outline = "none"
    col.appendChild(b);
    row.appendChild(b);
  }
  for (let i = 0; i < rows; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    row.id = "r" + i;
    row.style.margin = "0.1%";
    row.style.justifyContent = "center";
    row.style.height = height;
    b = document.createElement("button");
    let ylabel = init_label_list((ylabeled === true || ylabeled === "true" ? true : false));
    b.id = "cord_r" + i;
    b.setAttribute("r", i);
    b.onclick = function () { clicked_row(i); }
    b.innerHTML = ylabel[i];
    button_styles(b, "100%", (100 / ((columns + 1) * 1.025)) / 1.7 + "%");
    b.style.border = "none";
    b.style.outline = "none"
    row.appendChild(b);
    for (let e = 0; e < columns; e++) {
      b = document.createElement("button");
      b.id = "r" + i + ",c" + e;
      box = [...box, "r" + i + ",c" + e];
      b.setAttribute("value", r.getrandomnumbs()[i * columns + e] + "");
      b.setAttribute("type", "button");
      b.setAttribute("r", i);
      b.setAttribute("c", e);
      b.style.padding = "1px";
      b.onclick = function () { field_pressed(i, e); }
      b.innerHTML = r.getrandomnumbs()[i * columns + e] + "";
      button_styles(b, "100%", width);
      row.appendChild(b);
    }
    document.getElementById("container").appendChild(row);
    document.getElementById("container").style.height = y * 0.9 + "px";
  }
  row = document.createElement("div");
  row.classList.add("row");
  row.style.margin = "0.1%";
  row.style.marginBottom = "0.5%";
  row.style.justifyContent = "center";
  row.style.height = (100 / (rows + 1)) / 2 + "%";
  document.getElementById("container").appendChild(row);
  b = document.createElement("button");
  button_styles(b, "100%", ((100 / ((columns + 1) * 1.025)) / 1.7) - 0.2 + "%");
  b.style.border = "none";
  b.style.outline = "none"
  b.id = "placeholderb";
  b.title = "placeholderb";
  b.onclick = function () {
    clickedBoxClear(); if (help) { show_help(); } else {
      box.forEach((data) => {
        togglebtn(document.getElementById(data), false);
      });
    }
  }
  row.appendChild(b);
  for (let i = 0; i < columns; i++) {
    let col = document.createElement("div");
    col.classList.add("col");
    col.style.justifyContent = "center";
    col.style.height = "50%";
    b = document.createElement("button");
    let xlabel = init_label_list((xlabeled === true || xlabeled === "true" ? true : false));
    b.id = "cord_cb" + i;
    b.setAttribute("c", i);
    b.onclick = function () { clicked_column(i); }
    b.innerHTML = xlabel[i];
    button_styles(b, "100%", width);
    b.style.border = "none";
    b.style.outline = "none"
    col.appendChild(b);
    row.appendChild(b);
  }
  other_buttons();
}

function other_buttons() {
  let height = (100 / (rows)) + "%";
  let width = (100 / (columns * 1.025)) + "%";
  b = document.getElementById("current_rand");
  button_styles(b, height * 2, width);
  b.style.fontSize = font_size * 5 + 30 + "%";
  b.style.minWidth = "72px";
  b.style.maxHeight = (100 / (columns * 1.025)) * 20 + "px";
  b.style.minHeight = "35px";
  b.style.width = "100%";
  b.style.height = height * 2;
  r.getrandom_numb();
  b.innerHTML = r.getcurrent_random_numb();
  b = document.getElementById("reroll_b");
  button_styles(b, height, width);
  b.style.fontSize = "89%";
  b.style.minWidth = "72px";
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "1rem";
  b = document.getElementById("reset_b");
  button_styles(b, height, width);
  b.style.fontSize = "89%";
  b.style.minWidth = "72px";
  b.style.width = "100%";
  b.style.height = (100 / (rows)) / 3 + "%";
  b.style.marginTop = "5rem";
  b = document.getElementById("reset_points_b");
  if (teams >= 2) {
    button_styles(b, height, width);
    b.style.fontSize = "89%";
    b.style.minWidth = "72px";
    b.style.width = "100%";
    b.style.height = (100 / (rows)) / 3 + "%";
    b.style.marginTop = "1rem";
    b.style.display = "block";
  } else {
    b.style.display = "none";
  }
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
  if (b.getAttribute("value") != null || b.id == "current_rand") {
    b.style.fontSize = font_size * 5 + "%";
  } else {
    b.style.fontSize = 200 + "%";
  }
  b.style.paddingLeft = 0;
  b.style.paddingRight = 0;
  if (height <= 0 || width <= 0) {
    height = 0;
    width = 0;
    b.style.borderLeftWidth = 0;
    b.style.borderRightWidth = 0;
  }
  // b.style.minHeight = 0;
  b.style.outline = false;
  b.style.minWidth = "5px";
  b.style.minHeight = "37px";
  b.style.whiteSpace = "nowrap";
  b.style.overflow = "hidden";
  b.style.height = height;
  b.style.width = width;
  b.style.border = "solid";
  b.style.borderWidth = "2px"
  b.style.borderRadius = "12px";
  b.style.margin = "0.1%";
  if (black) {
    b.style.backgroundColor = darkmode_black;
    b.style.borderColor = "#FFFFFF";
    b.style.color = "#FFFFFF";
  } else {
    b.style.backgroundColor = "#FFFFFF";
    b.style.borderColor = "#000000";
    b.style.color = "#000000";
  }
}

function highlight_toggle(b, bool) {
  if (bool) {
    b.style.backgroundColor = "#F8A000";
  } else {
    button_color(b);
  }
}

function button_color(b) {
  if (b.id != "" && b.id != "placeholdert" && b.id != "placeholderb") {
    if (b.getAttribute("value") != null) {
      if (black) {
        b.style.backgroundColor = darkmode_black;
        b.style.color = "#FFFFFF";
        b.style.border = "none";
      } else {
        b.style.border = "solid";
        b.style.backgroundColor = "#FFFFFF";
        b.style.borderColor = "#000000";
        b.style.color = "#000000";
        b.style.borderWidth = "2px"
        b.style.borderRadius = "12px";
      }
    } else {
      if (b.getAttribute("c") != null || b.getAttribute("r") != null) {
        if (black) {
          b.style.backgroundColor = "#000000";
          b.style.color = "#FFFFFF";
        } else {
          b.style.backgroundColor = "#FFFFFF";
          b.style.color = "#000000";
        }
      } else {
        if (black) {
          b.style.backgroundColor = darkmode_black;
          b.style.color = "#FFFFFF";
        } else {
          b.style.backgroundColor = "#FFFFFF";
          b.style.color = "#000000";
        }
      }
    }
  } else {
    if (b.getAttribute("team") != null) {
      if (black) {
        b.style.backgroundColor = darkmode_black;
        b.style.color = "#FFFFFF";
      } else {
        b.style.backgroundColor = "#FFFFFF";
        b.style.color = "#000000";
      }
    } else {
      if (black) {
        b.style.backgroundColor = "#000000";
      } else {
        b.style.backgroundColor = "#FFFFFF";
      }
    }
  }
}

function togglebtn(b, bol) {
  b.disabled = bol;
  b.onclick = function () { field_pressed((b.getAttribute("r")), (b.getAttribute("c"))); }
  if (bol) {
    b.onclick = function () {
      clickedBoxClear(); if (help) { show_help(); } else {
        box.forEach((data) => {
          togglebtn(document.getElementById(data), false);
        });
      }
    }
    b.disabled = false;
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
      b.style.backgroundColor = darkmode_black;
      b.style.borderColor = "#FFFFFF";
      b.style.color = "#FFFFFF";
    } else {
      b.style.backgroundColor = "#FFFFFF";
      b.style.borderColor = "#000000";
      b.style.color = "#000000";
    }
  }
}

function clickedBoxAdd(e) {
  clicked_box = [...clicked_box, e];
  clicked_rows = [...clicked_rows, e[0]];
  clicked_columns = [...clicked_columns, e[1]];
  clicked_row_column(true, clicked_rows, true, "#FFFFFF", pending_color);
  clicked_row_column(false, clicked_columns, true, "#FFFFFF", pending_color);
}

function clickedBoxClear() {
  if (help) {
    show_help();
  }
  document.getElementById("calculation_list").innerHTML = null;
  clicked_box = [];
  clicked_column(clickedcol);
  clicked_row(clickedrow);
  clicked_row_column(true, clicked_rows, false, "#FFFFFF", pending_color);
  clicked_row_column(false, clicked_columns, false, "#FFFFFF", pending_color);
  clicked_rows = [];
  clicked_columns = [];
  clickedcol = -1;
  clickedrow = -1;
}

function sortclicked() {
  let save = [clicked_box[0]];
  let i = clicked_box[0][0] - clicked_box[1][0];
  let e = clicked_box[0][1] - clicked_box[1][1];
  if (i == -2 || i == 2) {
    save = [...save, clicked_box[2], clicked_box[1]];
  } else if (i == -1 || i == 1) {
    save = [...save, clicked_box[1], clicked_box[2]];
  } else if (e == -2 || e == 2) {
    save = [...save, clicked_box[2], clicked_box[1]];
  } else if (e == -1 || e == 1) {
    save = [...save, clicked_box[1], clicked_box[2]];
  } else {
    console.log("error");
  }
  clicked_box = save;
}

function clicked_row_column(r, clicked, activate, color, backgroundColor) {
  clicked.forEach((i) => {
    if (i < columns && i >= 0) {
      let b;
      let b1;
      if (r) {
        b = document.getElementById("cord_r" + i);
      } else {
        b = document.getElementById("cord_ct" + i);
        b1 = document.getElementById("cord_cb" + i);
      }
      if (activate) {
        b.style.backgroundColor = backgroundColor;
        b.style.color = color;
        if (!r) {
          b1.style.backgroundColor = backgroundColor;
          b1.style.color = color;
        }
      } else {
        if (black) {
          b.style.backgroundColor = "#000000";
          b.style.color = "#FFFFFF";
          if (!r) {
            b1.style.backgroundColor = "#000000";
            b1.style.color = "#FFFFFF";
          }
        } else {
          b.style.backgroundColor = "#FFFFFF";
          b.style.color = "#000000";
          if (!r) {
            b1.style.backgroundColor = "#FFFFFF";
            b1.style.color = "#000000";
          }
        }
      }
    }
  });
}

function field_pressed(o, u) {
  if (help) {
    show_help();
  }
  let i = parseInt(o);
  let e = parseInt(u);
  let b = document.getElementById("r" + i + ",c" + e);
  let right = false;
  let possibilities = r.getcalculationlist();
  if (clicked_box.contains([i, e]) == -1) {
    if (clicked_box.length < 3) {
      document.getElementById("calculation_list").innerHTML = "";
      clickedBoxAdd([i, e]);
      if (clicked_box.length == 3) {
        sortclicked();
        let one = document.getElementById("r" + clicked_box[0][0] + ",c" + clicked_box[0][1]).getAttribute("value");
        let sec = document.getElementById("r" + clicked_box[1][0] + ",c" + clicked_box[1][1]).getAttribute("value");
        let thi = document.getElementById("r" + clicked_box[2][0] + ",c" + clicked_box[2][1]).getAttribute("value");
        //(1*2+3, 1+2*3, 1/2+3, 1+2/3, 1*2-3, 1-2*3, 1/2-3, 1-2/3)
        let calcs = document.getElementById("calculation_list");
        for (let o = 0; o < possibilities.length; o++) {
          let out = -1;
          let s = possibilities[o];
          r.calculations = [...r.calculations, s];
          let p = document.createElement("p");
          if (s.charAt(0) == '/' && sec == 0 || s.charAt(1) == '/' && thi == 0) { continue; }
          p.style.color = wrong_color;
          p.style.textAlign = "center";
          p.innerHTML = "<nobr>" + one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi + "</nobr>";
          calcs.appendChild(p);
          //never use eval if with user input   
          out = (eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi));
          if (out == r.getcurrent_random_numb()) {
            p.style.color = right_color;
            right = true;
          } else {
            p.style.color = wrong_color;
          }
          p.style.fontSize = "140%";
          if (font_size <= 20) {
            p.style.fontSize = font_size * 4 + "%";
          } else if (font_size <= 40) {
            p.style.fontSize = font_size * 3.5 + "%";
          } else if (font_size <= 60) {
            p.style.fontSize = font_size * 3 + "%";
          } else if (font_size <= 80) {
            p.style.fontSize = font_size * 2.5 + "%";
          } else if (font_size <= 100) {
            p.style.fontSize = font_size * 2 + "%";
          }
        }
        if (right) {
          b.style.backgroundColor = right_color; b.style.color = '#000000';
          clicked_box.forEach((data) => {
            document.getElementById("r" + data[0] + ",c" + data[1]).style.backgroundColor = right_color;
            document.getElementById("r" + data[0] + ",c" + data[1]).style.color = '#000000';
          });
          clicked_row_column(true, clicked_rows, true, '#000000', right_color);
          clicked_row_column(false, clicked_columns, true, '#000000', right_color);
          playindex(2);
        } else {
          b.style.backgroundColor = wrong_color;
          b.style.color = '#FFFFFF';
          clicked_box.forEach((data) => {
            document.getElementById("r" + data[0] + ",c" + data[1]).style.backgroundColor = wrong_color;
            document.getElementById("r" + data[0] + ",c" + data[1]).style.color = '#FFFFFF';
          });
          clicked_row_column(true, clicked_rows, true, '#FFFFFF', wrong_color);
          clicked_row_column(false, clicked_columns, true, '#FFFFFF', wrong_color);
          playindex(1);
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
          clicked_row_column(true, clicked_rows, true, "#FFFFFF", pending_color);
          clicked_row_column(false, clicked_columns, true, "#FFFFFF", pending_color);
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
            clickedBoxClear();
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
            field_pressed(ico, eco);
          }
        }
      }
    } else {
      let save = clicked_box;
      if (help) { show_help(); } else {
        box.forEach((data) => {
          togglebtn(document.getElementById(data), false);
        });
      }
      clickedBoxClear();
      field_pressed(save[0][0], save[0][1]);
      field_pressed(i, e);
    }
  } else {
    if (clicked_box.contains([i, e]) != 0) {
      button_color(document.getElementById("r" + clicked_box[1][0] + ",c" + clicked_box[1][1]));
      button_color(document.getElementById("r" + clicked_box[2][0] + ",c" + clicked_box[2][1]));
      let save = clicked_box[0];
      clickedBoxClear();
      field_pressed(save[0], save[1]);
    } else {
      clicked_box.forEach((data) => {
        button_color(document.getElementById("r" + data[0] + ",c" + data[1]));
      });
      clickedBoxClear();
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

function init_label_list(b) {
  let abc = [];
  if (b && ((rows < columns) ? columns : rows) < 26) {
    abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  } else {
    for (let i = 0; i < ((rows < columns) ? columns : rows); i++) {
      abc = [...abc, ((i + 1) + "")];
    }
  }
  return abc;
}

function setclicked_box(array) { clickedBoxClear(); array.forEach((data) => { clickedBoxAdd(data); }); }

function show_help() {
  if (help) {
    help = false;
    helps = 0;
    box.forEach((data) => {
      document.getElementById(data).onmouseover = function () { };
      document.getElementById(data).onmouseout = function () { };
      togglebtn(document.getElementById(data), false);
    });
    document.getElementById("calculation_list").innerHTML = null;
  } else {
    used_calcs = [];
    document.getElementById("calculation_list").innerHTML = null;
    clickedBoxClear();
    box.forEach((data) => {
      togglebtn(document.getElementById(data), true);
    });
    help = true;
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
            if ((rows > 3 && i < 2) || (rows == 3 && i < 1)) {
              help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
              if (e > 2 && e < columns - 2) {
                help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
                help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
                help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
                help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
              } else {
                if (e < 2) {
                  if ((columns > 3 && e < 2) || (columns == 3 && e < 1)) {
                    help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
                  }
                } else if (e > columns - 2 && columns > 3) {
                  if ((rows > 3 && e >= columns - 2) || (rows == 3 && e >= columns - 1)) {
                    help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
                  }
                }
              }
            }
          } else if (i > rows - 2) {
            if ((rows > 3 && i >= rows - 2) || (rows == 3 && i >= rows - 1)) {
              help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
              if (e > 2 && e < columns - 2) {
                help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
                help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
                help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
                help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
              } else {
                if (e < 2) {
                  if ((columns > 3 && e < 2) || (columns == 3 && e < 1)) {
                    help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
                  }
                } else if (e > columns - 2 && columns > 3) {
                  if ((rows > 3 && e >= columns - 2) || (rows == 3 && e >= columns - 1)) {
                    help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
                  }
                }
              }
            }
          }
          if (e < 2) {
            if ((columns > 3 && e < 2) || (columns == 3 && e < 1)) {
              help_calc(index, "r" + i + ",c" + (e + 1), "r" + i + ",c" + (e + 2));
              if (i > 2 && i < rows - 2) {
                help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
                help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
                help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
                help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
              } else {
                if (i < 2) {
                  if ((rows > 3 && i < 2) || (rows == 3 && i < 1)) {
                    help_calc(index, "r" + (i + 1) + ",c" + (e + 1), "r" + (i + 2) + ",c" + (e + 2));
                  }
                } else if (i > rows - 2) {
                  if ((rows > 3 && i >= rows - 2) || (rows == 3 && i >= rows - 1)) {
                    help_calc(index, "r" + (i - 1) + ",c" + (e + 1), "r" + (i - 2) + ",c" + (e + 2));
                  }
                }
              }
            }
          } else if (e > columns - 2) {
            if ((rows > 3 && e >= columns - 2) || (rows == 3 && e >= columns - 1)) {
              help_calc(index, "r" + i + ",c" + (e - 1), "r" + i + ",c" + (e - 2));
              if (i > 2 && i < rows - 2) {
                help_calc(index, "r" + (i - 1) + ",c" + e, "r" + (i - 2) + ",c" + e);
                help_calc(index, "r" + (i + 1) + ",c" + e, "r" + (i + 2) + ",c" + e);
                help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
                help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
              } else {
                if (i < 2) {
                  if ((rows > 3 && i < 2) || (rows == 3 && i < 1)) {
                    help_calc(index, "r" + (i + 1) + ",c" + (e - 1), "r" + (i + 2) + ",c" + (e - 2));
                  }
                } else if (i > rows - 2) {
                  if ((rows > 3 && i >= rows - 2) || (rows == 3 && i >= rows - 1)) {
                    help_calc(index, "r" + (i - 1) + ",c" + (e - 1), "r" + (i - 2) + ",c" + (e - 2));
                  }
                }
              }
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
  for (let i = 0; i < r.calculations_list.length; i++) {
    let s = r.calculations_list[i];
    if (s.charAt(0) == '/' && sec == 0) {
      continue;
    } else if (s.charAt(1) == '/' && thi == 0) {
      continue;
    }
    // never use eval if with user input
    let e = eval(one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi + "");
    if (e != Number.parseFloat(e).toFixed(0)) { continue; }
    if (e > r.getmin() && e < r.getmax()) {
      if (e == r.current_random_numb) {
        document.getElementById(one_).style.backgroundColor = right_color;
        document.getElementById(one_).style.color = '#000000';
        document.getElementById(sec_).style.backgroundColor = right_color;
        document.getElementById(sec_).style.color = '#000000';
        document.getElementById(thi_).style.backgroundColor = right_color;
        document.getElementById(thi_).style.color = '#000000';
        var win = window,
          docElem = document.documentElement,
          body = document.getElementsByTagName('body')[0],
          y = win.innerHeight || docElem.clientHeight || body.clientHeight;
        if (helps < 20 && (y - 310 - (helps * 30)) >= 30) {
          let p = document.createElement("p");
          let t = 'x/y: ' + init_label_list(xlabeled)[(parseInt(document.getElementById(one_).getAttribute('c')))] + "/" + init_label_list(ylabeled)[(parseInt(document.getElementById(one_).getAttribute('r')))] + ', ' + init_label_list(xlabeled)[(parseInt(document.getElementById(sec_).getAttribute('c')))] + "/" + init_label_list(ylabeled)[(parseInt(document.getElementById(sec_).getAttribute('r')))] + ', ' + init_label_list(xlabeled)[(parseInt(document.getElementById(thi_).getAttribute('c')))] + "/" + init_label_list(ylabeled)[(parseInt(document.getElementById(thi_).getAttribute('r')))];
          if (used_calcs.contains(t) > -1) { continue; }
          used_calcs = [...used_calcs, t];
          p.innerHTML = "<nobr>" + one + (s.charAt(0) + "") + sec + (s.charAt(1) + "") + thi + "</nobr>";
          document.getElementById(one_).onmouseover = function () { p.style.color = "#F8A000"; highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          document.getElementById(one_).onmouseout = function () { if (black) { p.style.color = "#FFFFFF"; } else { p.style.color = "#000000" } document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
          document.getElementById(sec_).onmouseover = function () { p.style.color = "#F8A000"; highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          document.getElementById(sec_).onmouseout = function () { if (black) { p.style.color = "#FFFFFF"; } else { p.style.color = "#000000" } document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
          document.getElementById(thi_).onmouseover = function () { p.style.color = "#F8A000"; highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          document.getElementById(thi_).onmouseout = function () { if (black) { p.style.color = "#FFFFFF"; } else { p.style.color = "#000000" } document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
          p.onmouseover = function () { this.style.color = "#F8A000"; highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          p.onmouseout = function () { if (black) { this.style.color = "#FFFFFF"; } else { this.style.color = "#000000" } document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
          p.style.textDecoration = "none";
          document.getElementById("calculation_list").appendChild(p);
          if (black) {
            p.style.color = "#FFFFFF";
          } else {
            p.style.color = "#000000";
          }
          p.style.textAlign = "center";
          p.style.fontSize = "140%";
          if (font_size <= 20) {
            p.style.fontSize = font_size * 4 + "%";
          } else if (font_size <= 40) {
            p.style.fontSize = font_size * 3.5 + "%";
          } else if (font_size <= 60) {
            p.style.fontSize = font_size * 3 + "%";
          } else if (font_size <= 80) {
            p.style.fontSize = font_size * 2.5 + "%";
          } else if (font_size <= 100) {
            p.style.fontSize = font_size * 2 + "%";
          }
          helps += 1;
        } else {
          document.getElementById(one_).onmouseover = function () { highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          document.getElementById(one_).onmouseout = function () { document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
          document.getElementById(sec_).onmouseover = function () { highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          document.getElementById(sec_).onmouseout = function () { document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
          document.getElementById(thi_).onmouseover = function () { highlight_toggle(document.getElementById(one_), true); highlight_toggle(document.getElementById(sec_), true); highlight_toggle(document.getElementById(thi_), true); };
          document.getElementById(thi_).onmouseout = function () { document.getElementById(one_).style.backgroundColor = right_color; document.getElementById(sec_).style.backgroundColor = right_color; document.getElementById(thi_).style.backgroundColor = right_color; };
        }
      }
    }
  }
}

function playstand(freq) {
  let context = new AudioContext();
  let o = context.createOscillator();
  o.frequency.setValueAtTime(freq, context.currentTime);
  let g = context.createGain();
  let time = 1.5;
  o.connect(g);
  g.connect(context.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + time);
  o.stop(context.currentTime + time + 1);
}

function rerand() {
  playindex(0);
  r.rerand();
  if (color) {
    document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#F8A000";
    setTimeout(() => {
      if (black) {
        document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#000000";
      } else {
        document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#FFFFFF";
      }
      Array.prototype.forEach.call(document.getElementsByClassName("body"), (data) => {
        button_color(data);
      });
      setTimeout(() => { document.getElementById("current_rand").innerHTML = r.getcurrent_random_numb(); }, 80);
    }, 450);
  } else {
    setTimeout(() => { document.getElementById("current_rand").innerHTML = r.getcurrent_random_numb(); }, 150);
  }
}

function reset() {
  let seed = r.getRanHex(4);
  let s = location.toString().substring(0, location.toString().indexOf("seed=") + 5) + seed;
  s += location.toString().substring(location.toString().indexOf("seed=") + 5 + seed.length, location.toString().length);
  location.href = s;
}

function dark_switch() {
  if (help) {
    show_help();
  }
  clickedBoxClear();
  document.getElementById("calculation_list").innerHTML = null;
  helps = 0;
  box.forEach((data) => {
    togglebtn(document.getElementById(data), false);
  });
  if (black) {
    black = false;
    objects.forEach((data) => { button_color(data); });
    document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#FFFFFF";
    Array.prototype.forEach.call(document.getElementsByClassName("footer"), (data) => { data.style.color = "#000000" });
    document.getElementById("darkmode_b").innerHTML = "&#xf186;";
    document.getElementById("seed").style.color = "#000000";
    document.getElementById("seed_label").style.color = "#000000";
    document.getElementById("calculation_list").innerHTML = null;
  } else {
    black = true;
    objects.forEach((data) => { button_color(data); });
    document.getElementsByClassName("container-fluid")[0].style.backgroundColor = "#000000";
    Array.prototype.forEach.call(document.getElementsByClassName("footer"), (data) => { data.style.color = "#FFFFFF" });
    document.getElementById("darkmode_b").innerHTML = "&#xf185;";
    document.getElementById("calculation_list").innerHTML = null;
    document.getElementById("seed").style.color = "#FFFFFF";
    document.getElementById("seed_label").style.color = "#FFFFFF";
  }
}

function setextreme_calc(c) {
  extreme_calc = c;
}

class init_numbers {
  constructor(seed, trio) {
    this.trio = trio;

    // grid
    this.grid_min = 0;
    this.grid_max = 10;
    this.min = this.grid_min + 1;
    this.max = ((this.grid_max - 1) * (this.grid_max - 1) + this.grid_max - 1) - ((this.trio.mode - 1) * 10);

    // numbers
    this.possible_numbs = [];
    this.precalculations_list = ["*+", "+*", "/+", "+/", "*-", "-*", "/-", "-/", "*/", "/*", "+-", "-+"];
    this.calculations_list = [];
    this.calculations = [];
    this.random_numbs = [];
    this.current_random_numb;
    this.found_nothing = false;
    this.seed = seed;
    // random
    this.gen;
  }

  getRanHex = size => {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < size; n++) {
      result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
  }

  rerand() {
    if (this.trio.help) {
      this.trio.show_help();
    }
    this.trio.clickedBoxClear();
    document.getElementById("calculation_list").innerHTML = null;
    helps = 0;
    box.forEach((data) => {
      togglebtn(document.getElementById(data), false);
    });
    this.trio.clickedBoxClear();
    this.current_random_numb = this.new_current_random_numb();
    if (this.current_random_numb == null || this.current_random_numb <= 0) {
      this.rerand();
    }
  }

  rand() {
    let e = 0;
    for (let i = 0; i < (this.precalculations_list.length / 2); i++) {
      if (this.trio.calculation_bools.length > i) {
        if (this.trio.calculation_bools.split("")[i] === "1") {
          if (this.precalculations_list.length > e + 1) {
            this.calculations_list = [...this.calculations_list, this.precalculations_list[e], this.precalculations_list[e + 1]];
          }
        }
        e += 2;
      }
    }
    if (this.calculations_list.length <= 0) {
      document.getElementById("no_calcs").style.display = "block";
      this.trio.setextreme_calc(false);
    }
    if (this.seed == 0) {
      this.seed = this.getRanHex(4);
      if (location.toString().indexOf('?') == -1) {
        location.href = location + "?seed=" + this.seed;
      } else {
        location.href = location + "&seed=" + this.seed;
      }
    }
    document.getElementById("seed").innerHTML = this.trio.Hex_r_seed;
    document.getElementById("seed").style.fontSize = "120%"
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
      this.trio.clickedBoxClear();
    }
    this.current_random_numb = this.new_current_random_numb();
    return this.current_random_numb;
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
          return this.possible_numbs[0];
        } else {
          document.getElementById("finish").style.display = "block";
          this.found_nothing = true;
          return (Math.round((Math.random() * this.max)));
        }
      }
      this.found_nothing = false;
      return this.possible_numbs[i];
    } else {
      document.getElementById("finish").style.display = "block";
      this.found_nothing = true;
      return (Math.round((Math.random() * this.max)));
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

  getrandomnumbs() {
    return this.random_numbs;
  }

  getprecalcs() {
    return this.precalculations_list;
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

  getmax() {
    return this.max;
  }

  getcurrent_random_numb() {
    return this.current_random_numb;
  }

  getseed() {
    return this.seed;
  }
}

class possiblenumbs {
  constructor(r, c, tri) {
    this.possible = [];
    this.n = r;
    this.stop = false;
    this.calcs = c;
    this.length = this.calcs.length;
    this.trio = tri;
    // var m = System.currentTimeMillis();
  }

  run() {
    this.check();
    if (this.possible.length > this.n.getmax() - this.n.getmin()) {
      this.n.setpossiblenumbs([]);
    } else {
      this.n.setpossiblenumbs(this.possible);
      this.n.getrandom_numb();
    }
  }

  possibilities(one_, sec_, thi_) {
    let one = this.n.random_numbs[one_];
    let sec = this.n.random_numbs[sec_];
    let thi = this.n.random_numbs[thi_];
    for (let i = 0; i < this.length; i++) {
      let s = this.calcs[i];
      if (s.charAt(0) == '/' && sec == 0) {
        continue;
      } else if (s.charAt(1) == '/' && thi == 0) {
        continue;
      }
      let e = eval(one + s.charAt(0) + sec + s.charAt(1) + thi);
      if (e != Number.parseInt(e)) continue;
      if (!(e > this.n.getmin() && e < this.n.getmax())) continue;
      this.possible = [...this.possible, e];
    }
  }

  check() {
    let clomuns_t2 = columns * 2;
    for (let i = 0; i < rows; i++) {
      let index_ = i * columns;
      for (let e = 0; e < columns; e++) {
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
            if ((rows > 3 && i < 2) || (rows == 3 && i < 1)) {
              this.possibilities(index, index + columns, index + clomuns_t2);
              if (e > 2 && e < columns - 2) {
                this.possibilities(index, index + 1, index + 2);
                this.possibilities(index, index - 1, index - 2);
                this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
                this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
              } else {
                if (e < 2) {
                  if ((columns > 3 && e < 2) || (columns == 3 && e < 1)) {
                    this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
                  }
                } else if (e > columns - 2) {
                  if ((columns > 3 && e >= columns - 2) || (columns == 3 && e >= columns - 1)) {
                    this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
                  }
                }
              }
            }
          } else if (i > rows - 2) {
            if ((rows > 3 && i >= rows - 2) || (rows == 3 && i >= rows - 1)) {
              this.possibilities(index, index - columns, index - clomuns_t2);
              if (e > 2 && e < columns - 2) {
                this.possibilities(index, index + 1, index + 2);
                this.possibilities(index, index - 1, index - 2);
                this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
                this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
              } else {
                if (e < 2) {
                  if ((columns > 3 && e < 2) || (columns == 3 && e < 1)) {
                    this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
                  }
                } else if (e > columns - 2) {
                  if ((columns > 3 && e >= columns - 2) || (columns == 3 && e >= columns - 1)) {
                    this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
                  }
                }
              }
            }
          }
          if (e < 2) {
            if ((columns > 3 && e < 2) || (columns == 3 && e < 1)) {
              this.possibilities(index, index + 1, index + 2);
              if (i > 2 && i < rows - 2) {
                this.possibilities(index, index - columns, index - clomuns_t2);
                this.possibilities(index, index + columns, index + clomuns_t2);
                this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
                this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
              } else {
                if (i < 2) {
                  if ((rows > 3 && i < 2) || (rows == 3 && i < 1)) {
                    this.possibilities(index, index + columns + 1, index + clomuns_t2 + 2);
                  }
                } else if (i > rows - 2) {
                  if ((rows > 3 && i >= rows - 2) || (rows == 3 && i >= rows - 1)) {
                    this.possibilities(index, index - columns + 1, index - clomuns_t2 + 2);
                  }
                }
              }
            }
          } else if (e > columns - 2) {
            if ((rows > 3 && e >= columns - 2) || (rows == 3 && e >= columns - 1)) {
              this.possibilities(index, index - 1, index - 2);
              if (i > 2 && i < rows - 2) {
                this.possibilities(index, index - columns, index - clomuns_t2);
                this.possibilities(index, index + columns, index + clomuns_t2);
                this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
                this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
              } else {
                if (i < 2) {
                  if ((rows > 3 && i < 2) || (rows == 3 && i < 1)) {
                    this.possibilities(index, index + columns - 1, index + clomuns_t2 - 2);
                  }
                } else if (i > rows - 2) {
                  if ((rows > 3 && i >= rows - 2) || (rows == 3 && i >= rows - 1)) {
                    this.possibilities(index, index - columns - 1, index - clomuns_t2 - 2);
                  }
                }
              }
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

if (Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
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
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

if (Array.prototype.contains)
  console.warn("Overriding existing Array.prototype.contains. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
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
Object.defineProperty(Array.prototype, "contains", { enumerable: false });