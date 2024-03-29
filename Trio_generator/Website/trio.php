<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <!--popup styles (Modal)-->
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
    }

    /* The Modal (background) */
    .modal {
      display: none;
      /* Hidden by default */
      position: fixed;
      /* Stay in place */
      z-index: 1;
      /* Sit on top */
      padding-top: 50px;
      /* Location of the box */
      left: 0;
      top: 0;
      width: 100%;
      /* Full width */
      height: 150%;
      /* Full height */
      overflow: auto;
      /* Enable scroll if needed */
      background-color: rgb(0, 0, 0);
      /* Fallback color */
      background-color: rgba(0, 0, 0, 0.4);
      /* Black w/ opacity */
    }

    /* Modal Content */
    .modal-content {
      max-height: calc(115vh - 200px);
      overflow-y: auto;
      position: relative;
      background-color: #fefefe;
      margin: auto;
      padding: 0;
      border: 1px solid #888;
      width: 80%;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      -webkit-animation-name: animatetop;
      -webkit-animation-duration: 0.4s;
      animation-name: animatetop;
      animation-duration: 0.4s
    }

    /* Add Animation */
    @-webkit-keyframes animatetop {
      from {
        top: -300px;
        opacity: 0
      }

      to {
        top: 0;
        opacity: 1
      }
    }

    @keyframes animatetop {
      from {
        top: -300px;
        opacity: 0
      }

      to {
        top: 0;
        opacity: 1
      }
    }

    /* The Close Button */
    .close {
      color: white;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }

    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }

    .modal-header {
      padding: 2px 16px;
      background-color: #65C965;
      color: white;
    }

    .modal-body {
      padding: 2px 16px;
    }

    .modal-footer {
      padding: 2px 16px;
      background-color: #65C965;
      color: white;
    }

    .collapsible {
      background-color: #65C965;
      color: white;
      cursor: pointer;
      padding: 18px;
      width: 100%;
      border: none;
      text-align: left;
      outline: none;
      font-size: 15px;
    }

    .active,
    .collapsible:hover {
      background-color: #85BF85;
    }

    .content {
      padding: 0 18px;
      display: none;
      overflow: hidden;
      background-color: #f1f1f1;
    }
  </style>

  <!-- Required meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <link rel="stylesheet" src="../trio.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script type="text/javascript" src="trio.js"></script>
  <title>Trio</title>
</head>

<body class="body">
  <div id="wait" class="row">
    <div class="col-lg-12">
      <h2 style="text-align: center;">Bitte einen Moment Geduld. Die nötigen Informationen werden
        momentan berechnet.<br>
        Oder es gab einen Fehler bei der Initialisierung des Programms.</h2>
    </div>
  </div>
  <div class="container-fluid" style="display: none;">
    <!-- The Modal -->
    <div id="instructions_modal" class="modal">

      <!-- Modal content -->
      <div id="instructions_body" class="modal-content">
        <div class="modal-header">
          <h3>Anleitung</h3>
          <span class="close" id="instructions_close">&times;</span>

        </div>
        <div class="modal-body">
          <p style="text-align: center;">Vorbereitung</p><br>
          <p>Trio ist ein Spiel, welches mit 2 Teams gespielt wird. Zudem ist es zu empfehlen, das Spielfeld
            beispielsweise über einen Beamer so an die Tafel zu werfen, dass alle Spieler das Feld und die Zahl oben
            links (die "gesuchte Zahl") gut sehen können. Sollte euch das aktuelle Feld nicht gefallen, könnt ihr über
            den Knopf "neue Zahlen" ein neues Feld generieren. Außerdem könnt ihr in den Einstellungen z.B. die
            Schriftgröße und die Feldgröße einstellen, sollten die Zahlen zu klein sein.</p><br>
          <p style="text-align: center;">Wie gespielt wird</p><br>
          <p>Die Teams spielen parallel mit derselben "gesuchten Zahl". Es wird von einem Moderator eine neue
            "gesuchte
            Zahl" über den Knopf oben links ("würfeln") erstellt. Dann
            geht es darum,
            welche 3 Personen zuerst diese Zahl nach den folgenden Regeln im Feld finden.</p><br>
          <p>Die "gesuchte Zahl" muss:</p><br>
          <p>- ... durch genau 3 Zahlen aus dem Feld
            berechnet werden</p><br>
          <p> - ... durch die Grundrechenarten Rechenarten erreicht werden (+ , - ,* , /), welche aber nur
            jeweils einmal verwendet werden dürfen. Welche Rechenarten erlaubt sind, kann in den Einstellungen (Zahnrad)
            festgelegt werden.</p><br>
          <p>- Es gilt Punkt-vor-Strich</p><br>
          <p>- Die 3 Zahlen müssen in nebeneinanderliegenden Feldern sein (waagerecht - , senkrecht | oder diagonal / \)
          </p>
          <br>
          <p>Sobald sich 3 Personen melden, werden diese der Reihe nach vom Moderator aufgefordert, ihre
            Rechnungen zu nennen. Der Moderator überprüft das Ergebnis, indem er die entsprechenden Zahlen auf dem
            Feld antippt. Alternativ kann er auch die entsprechenden Koordinaten auf den Achsen antippen. Für jede
            richtige Rechnung bekommt das Team einen Punkt. Jede Rechnung zählt jedoch
            nur
            einmal, das bedeutet, wenn der dritte Spieler dieselbe Rechnung hatte wie der erste Spieler, dann bekommt
            nur
            der erste Spieler einen Punkt. Wenn die Punkte verteilt wurden, wird neu gewürfelt
            und
            eine neue Runde beginnt.</p><br>
          <p>Falls niemand auf eine Rechnung kommt, können mit dem Knopf ? mögliche Lösungen markiert werden. </p><br>
          <p style="text-align: center;">Wie man gewinnt</p><br>
          <p>Die Spiellänge kann vom Moderator festgelegt werden. Am Ende gewinnt dann das Team mit den meisten
            Punkten.
            Alternativ kann man auch bis zu einer vorher festgelegten Punktzahl spielen.</p>
        </div>
        <div class="modal-footer">
        </div>
      </div>
    </div>

    <div id="settings_modal" class="modal">

      <!-- Modal content -->
      <div id="settings_body" class="modal-content">
        <div class="modal-header">
          <h3>Einstellungen</h3>
          <span class="close" id="settings_close">&times;</span>

        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Zeilen</p>
            </div>
            <div class="col-lg-3">
              <p id="row_count" style="text-align: center;"></p>
            </div>
            <div class="col-lg-6">
              <button id="row+" onclick="row('+')" style="text-align: center;">+</button>
              <button id="row-" onclick="row('-')" style="text-align: center;">-</button>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Spalten</p>
            </div>
            <div class="col-lg-3">
              <p id="col_count" style="text-align: center;"></p>
            </div>
            <div class="col-lg-6">
              <button id="col+" onclick="col('+')" style="text-align: center;">+</button>
              <button id="col-" onclick="col('-')" style="text-align: center;">-</button>
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">X-Koordinate</p>
            </div>
            <div class="col-lg-3">
            </div>
            <div class="col-lg-6" style="width: 20%; margin: 0 auto;">
                <input type="radio" id="xabc" name="xcord" value="abc" style="text-align: center;">
                <label class="titel" for="abc" style="text-align: center;">ABC</label>
                <input type="radio" id="x123" name="xcord" value="123" style="text-align: center;">
                <label class="titel" for="123" style="text-align: center;">123</label>
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Y-Koordinate</p>
            </div>
            <div class="col-lg-3">
            </div>
            <div class="col-lg-6" style="width: 20%; margin: 0 auto;">
                <input type="radio" id="yabc" name="ycord" value="abc" style="text-align: center;">
                <label class="titel" for="abc" style="text-align: center;">ABC</label>
                <input type="radio" id="y123" name="ycord" value="123" style="text-align: center;">
                <label class="titel" for="123" style="text-align: center;">123</label>
            </div>
          </div>
          <div class="row" style="margin-bottom: 2rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">seed</p>
            </div>
            <div class="col-lg-3">
              <p id="current_seed" style="text-align: center;"></p>
            </div>
            <div class="col-lg-6" style="width: 30%; margin: 0 auto;">
                <input id="seed_field" style="text-align: center;">
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Schriftgröße</p>
            </div>
            <div class="col-lg-3">
              <p id="font_size" style="text-align: center;"></p>
            </div>
            <div class="col-lg-6">
              <button id="font+" onclick="font('+')" style="text-align: center;">+</button>
              <button id="font-" onclick="font('-')" style="text-align: center;">-</button>
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p id="dif_l" class="titel" style="text-align: center;">Schwierigkeit <abbr title='Je groeßer die Zahl, desto kleiner ist die hoechste gesuchte Zahl (Je kleiner die Schwierigkeit, desto Schwieriger)'>
                  ? </abbr>
              </p>
            </div>
            <div class="col-lg-3">
              <p id="mode_count" style="text-align: center;"></p>
            </div>
            <div class="col-lg-6">
              <button id="mode+" onclick="mode_set('+')" style="text-align: center;">+</button>
              <button id="mode-" onclick="mode_set('-')" style="text-align: center;">-</button>
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Rechenarten</p>
            </div>
            <div class="col-lg-3">
            </div>
            <div class="col-lg-6" style="justify-content: center;">
              <div class="row" id="calcs_container">

              </div>
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Würfel Indikatoren</p>
            </div>
            <div class="col-lg-3">
            </div>
            <div class="col-lg-3" style="text-align: center;">
              <input type="checkbox" id="color_checkbox"></input>
              <label class="titel" id="color_checkbox">Farbe</label>
            </div>
            <div class="col-lg-3" style="text-align: center;">
              <input type="checkbox" id="sound_checkbox"></input>
              <label class="titel" id="sound_checkbox">Ton</label>
            </div>
          </div>
          <div class="row" style="margin-bottom: 1rem;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Teams</p>
            </div>
            <div class="col-lg-3" style="text-align: center;">
              <input type="checkbox" id="teams_checkbox" onclick="toggleteam()"></input>
            </div>
            <div class="col-lg-6">
              <button id="teams+" class="team_element" onclick="teamsco('+')" style="text-align: center; display: none;">+</button>
              <button id="teams-" class="team_element" onclick="teamsco('-')" style="text-align: center; display: none;">-</button>
            </div>
          </div>
          <div class="row team_element" style="margin-bottom: 1rem; display: none;">
            <div class="col-lg-3">
              <p class="titel" style="text-align: center;">Team Namen</p>
            </div>
            <div class="col-lg-3">
              <p id="teams_count" class="team_element titel" style="display: none; margin: 1rem; text-align: center;">0
              </p>
            </div>
            <div class="col-lg-6" style="justify-content: center;" id="names_container">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button type="button" id="collapsible_settings_body" class="collapsible">Sound Effekte</button>
              <div id="sound_container" class="content">

              </div>
            </div>
          </div>
          <div class="row" style="justify-content: center; align-items: center; margin-top: 2rem;">
            <div class="col-lg-8">
              <button id="save_url_b" style="text-align: center;">Einstellungen
                speichern</button>
            </div>
            <div class="col-lg-4">
              <button id="reset_url_b" onclick="reset_url()" style="text-align: center;">Einstellungen
                zurücksetzen</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">

        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
      </div>
    </div>
    <div id="folder_entries" style="display: none;">
      <?php
      if ($handle = opendir('Media')) {
        while (false !== ($entry = readdir($handle))) {
          if ($entry != "." && $entry != "..") {
            echo "/";
            echo "$entry/";
          }
        }
        closedir($handle);
      }
      ?>
    </div>
    <div class="row">
      <div class="col-lg-1 clear_b" style="display: flex; padding-right: 0px; margin-top: 3rem;">
        <div class="row" style="justify-content: center; height: inherit; display: flex; width: 100%; margin-bottom: 1rem;">
          <div id="buts_container_left" class="col-lg-10" style="height: inherit; width: 100%; padding-right: 0px; margin-top: 1rem;">
            <button id="current_rand" onclick="rerand()" style="min-height: 30px;">Noch keine Zahl berechnet. Einen
              Moment bitte</button>
            <button id="reroll_b" onclick="rerand()" style="min-height: 30px;">würfeln</button>
            <button id="reset_b" onclick="reset()" style="min-height: 30px;">neue Zahlen</button>
            <button id="reset_points_b" onclick="reset_points()" style="min-height: 30px;">neue Punkte</button>
            <div class="row">
              <div class="col">
                <butto onclick="copyclip()" style="border: none;">
                  <p id="seed_label" style="text-align: center; margin-top: 1rem; ">seed:</p>
                  <p id="seed" style="text-align: center; margin-bottom: 2rem;"></p>
                </butto>
                <p id="finish" style="color: #FF0000; margin-bottom: 4rem;display: none;">Alle möglichen Spiele gespielt
                </p>
                <p id="no_calcs" style="color: #FF0000; display: none;">Mit den aktuellen Einstellungen ist aufgrund
                  keiner ausgewählten Rechenart kein Spiel möglich</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-10" style="margin-left: 0px; padding-left: 0px;">
        <div class="row">
          <div class="col-lg-12">
            <div class="row">
              <div id="container" class="col-lg-12" style="margin: 0px; padding: 0px;">

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-1" style="display: flex; padding-right: 0px; max-height: 100%; margin-top: 3rem;">
        <div class="row" style="justify-content: center; height: 100%; display: flex; width: 100%; margin-bottom: 1rem;">
          <div class="col-lg-12" style="margin-right: 0px; padding-right: 0px;">
            <div class="row">
              <div id="buts_container_right" class="col-lg-10" style="height: inherit; width: 100%; padding-right: 0px;">
                <button id="darkmode_b" onclick="dark_switch()" style="min-height: 30px;font-size:24px" class="fa">&#xf186;</button>
                <button id="settings_b" style="min-height: 30px;font-size:24px" class="fa">&#x2699;</button>
                <button id="instructions_b" style="min-height: 30px;font-size:24px" class="fa">&#128196;</button>
                <button id="help_b" onclick="show_help()" style="min-height: 30px;font-size:24px" class="fa">&#x3F;</button>
              </div>
            </div>
            <div class="row clear_b" style="justify-content: center; height: 100%; max-height: inherit; width: 100%; margin-bottom: 1rem;margin-top: 1.5rem; padding-right: 0px; margin-right: 0px;">
              <div id="calculation_list" class="col-lg-12">

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="row" style="margin-top: 3rem; margin-bottom: 2rem; margin-left: 2rem; margin-right: 2rem;">
      <div class="col-lg-12">
        <div id="points" class="row">

        </div>
      </div>
    </div>
    <div class="row" style="margin-top: 1rem;">
      <div class="col-lg-12 clear_b" style="text-align: center;">
        <h4 class="footer">Erstellt von</h4>
        <h6 class="footer">Bennet Richter</h6>
        <h6 class="footer">Mattis Negraszus</h6>
        <h6 class="footer">2021</h6>
        <h6 class="footer"><a href="https://martinum.de/" style="text-decoration: none;">Gymnasium Martinum</h6>
      </div>
    </div>
  </div>
  <script type="text/javascript">
    setup();
  </script>
  <!--Bootstrap JS-->
  <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
<footer>

</footer>

</html>