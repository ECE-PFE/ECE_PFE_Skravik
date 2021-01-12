function show(elementID) {
   // try to find the requested page and alert if it's not found
   var ele = document.getElementById(elementID);
   if (!ele) {
       alert("no such element");
       return;
   }

   // get all pages, loop through them and hide them
   var pages = document.getElementsByClassName('page');
   for(var i = 0; i < pages.length; i++) {
       pages[i].style.display = 'none';
   }

   // then show the requested page
   ele.style.display = 'block';
}

function round(x) {
  return Number.parseFloat(x).toFixed(1);
}

(function () {
  var updateValues = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/values');

    xhr.onreadystatechange = function () {
      if (xhr.status === 200) {
        const json = xhr.responseText;
        if (json) {
          const obj = JSON.parse(json);

          //Page menu
          document.getElementById("panneauxsolaires").innerHTML = "+" + round(obj.data.sources.panneauxSolaires) + " kW";
          document.getElementById("eoliennes").innerHTML        = "+" + round(obj.data.sources.eoliennes) + " kW";
          document.getElementById("hydroliennes").innerHTML     = "+" + round(obj.data.sources.hydroliennes) + " kW";
          document.getElementById("groupeEletrogene").innerHTML = "+" + round(obj.data.sources.groupeElectrogene.production) + " kW";
          document.getElementById("alternateur").innerHTML      = "+" + round(obj.data.sources.alternateur.production) + " kW";
          document.getElementById("moteur").innerHTML           = round(obj.data.consos.moteur.conso) + " kW";
          document.getElementById("equipements").innerHTML      = round(obj.data.consos.equipements.conso) + " kW";
          document.getElementById("sommeSources").innerHTML     = "Production totale : " + round(obj.data.sommes.sommeSources) + " kW";
          document.getElementById("sommeConsos").innerHTML      = "Consommation totale : " + round(obj.data.sommes.sommeConsos) + " kW";
          //document.getElementById("sommeTotale").innerHTML      = round(obj.data.sommes.sommeTotale) + " kW";
          document.getElementById("batterie1").innerHTML = round(obj.data.batteries.batterie1) + " %";
          document.getElementById("batterie2").innerHTML = round(obj.data.batteries.batterie2) + " %";
          document.getElementById("batterie3").innerHTML = round(obj.data.batteries.batterie3) + " %";
          document.getElementById("sourcesVersConsos").innerHTML    = "+" + round(obj.data.transferts.sourcesVersConsos) + " kW";
          document.getElementById("batteriesVersConsos").innerHTML  = "+" + round(obj.data.transferts.batteriesVersConsos) + " kW";
          document.getElementById("sourcesVersBatteries").innerHTML = "+" + round(obj.data.transferts.sourcesVersBatteries) + " kW";

          if (obj.data.transferts.sourcesVersConsos == 0) {
            document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/grey_arrow_right.png");
          }
          else{
            document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/green_arrow_right.png");
          }

          if (obj.data.transferts.batteriesVersConsos == 0) {
            document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/grey_arrow_up.png");
          }
          else{
            document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/green_arrow_up.png");
          }

          if (obj.data.transferts.sourcesVersBatteries == 0) {
            document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/grey_arrow_right.png");
          }
          else{
            document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/green_arrow_right.png");
          }

          //Page panneaux solaires
          document.getElementById("PANProduction1").innerHTML     = "Production : " + round(obj.data.sources.panneauSolaire1.production) + " kW";
          document.getElementById("PANInclinaison1").innerHTML    = "Inclinaison : " + round(obj.data.sources.panneauSolaire1.inclinaison) + " °";
          document.getElementById("PANRendement1").innerHTML      = "Rendement : " + round(obj.data.sources.panneauSolaire1.rendement) + " %";
          document.getElementById("PANEnsoleillement1").innerHTML = "Ensoleillement : " + round(obj.data.sources.panneauSolaire1.ensoleillement) + " %";

          document.getElementById("PANProduction2").innerHTML     = "Production : " + round(obj.data.sources.panneauSolaire2.production) + " kW";
          document.getElementById("PANInclinaison2").innerHTML    = "Inclinaison : " + round(obj.data.sources.panneauSolaire2.inclinaison) + " °";
          document.getElementById("PANRendement2").innerHTML      = "Rendement : " + round(obj.data.sources.panneauSolaire2.rendement) + " %";
          document.getElementById("PANEnsoleillement2").innerHTML = "Ensoleillement : " + round(obj.data.sources.panneauSolaire2.ensoleillement) + " %";

          document.getElementById("PANProduction3").innerHTML     = "Production : " + round(obj.data.sources.panneauSolaire3.production) + " kW";
          document.getElementById("PANInclinaison3").innerHTML    = "Inclinaison : " + round(obj.data.sources.panneauSolaire3.inclinaison) + " °";
          document.getElementById("PANRendement3").innerHTML      = "Rendement : " + round(obj.data.sources.panneauSolaire3.rendement) + " %";
          document.getElementById("PANEnsoleillement3").innerHTML = "Ensoleillement : " + round(obj.data.sources.panneauSolaire3.ensoleillement) + " %";

          document.getElementById("PANProduction4").innerHTML     = "Production : " + round(obj.data.sources.panneauSolaire4.production) + " kW";
          document.getElementById("PANInclinaison4").innerHTML    = "Inclinaison : " + round(obj.data.sources.panneauSolaire4.inclinaison) + " °";
          document.getElementById("PANRendement4").innerHTML      = "Rendement : " + round(obj.data.sources.panneauSolaire4.rendement) + " %";
          document.getElementById("PANEnsoleillement4").innerHTML = "Ensoleillement : " + round(obj.data.sources.panneauSolaire4.ensoleillement) + " %";

          //Page Eoliennes
          document.getElementById("EOLProduction1").innerHTML     = "Production : " + round(obj.data.sources.eolienne1.production) + " kW";
          document.getElementById("EOLVitesse1").innerHTML        = "Vitesse : " + round(obj.data.sources.eolienne1.vitesse) + " m/s";
          document.getElementById("EOLTemperature1").innerHTML    = "Temperature : " + round(obj.data.sources.eolienne1.temperature) + " °C";
          
          document.getElementById("EOLProduction2").innerHTML     = "Production : " + round(obj.data.sources.eolienne2.production) + " kW";
          document.getElementById("EOLVitesse2").innerHTML        = "Vitesse : " + round(obj.data.sources.eolienne2.vitesse) + " m/s";
          document.getElementById("EOLTemperature2").innerHTML    = "Temperature : " + round(obj.data.sources.eolienne2.temperature) + " °C";
          
          document.getElementById("ANMVitesse").innerHTML         = "Vitesse du vent : " + round(obj.data.anomometre.vitesseVent) + " m/s";

          //Page Hydroliennes
          document.getElementById("HYDProduction1").innerHTML     = "Production : " + round(obj.data.sources.hydrolienne1.production) + " kW";
          document.getElementById("HYDVitesse1").innerHTML        = "Vitesse : " + round(obj.data.sources.hydrolienne1.vitesse) + " m/s";
          document.getElementById("HYDTemperature1").innerHTML    = "Temperature : " + round(obj.data.sources.hydrolienne1.temperature) + " °C";
          
          document.getElementById("HYDProduction2").innerHTML     = "Production : " + round(obj.data.sources.hydrolienne2.production) + " kW";
          document.getElementById("HYDVitesse2").innerHTML        = "Vitesse : " + round(obj.data.sources.hydrolienne2.vitesse) + " m/s";
          document.getElementById("HYDTemperature2").innerHTML    = "Temperature : " + round(obj.data.sources.hydrolienne2.temperature) + " °C";

          //Page Groupe electrogene
          document.getElementById("GREProduction1").innerHTML     = "Production : " + round(obj.data.sources.groupeElectrogene.production) + " kW";
          document.getElementById("GRETemperature1").innerHTML    = "Temperature : " + round(obj.data.sources.groupeElectrogene.temperature) + " °C";
          
          //Page Alternateur
          document.getElementById("ALTProduction1").innerHTML     = "Production : " + round(obj.data.sources.alternateur.production) + " kW";
          document.getElementById("ALTTemperature1").innerHTML    = "Temperature : " + round(obj.data.sources.alternateur.temperature) + " °C";
          
          console.log("Data updated successfully");
        }
      }
    };
    xhr.send();
  };

  window.setInterval(updateValues, 2000);
  updateValues();
})();


//parametrage des valeurs par defaut
var settingsTxt = ["Vitesse de vent max", "Seuil 2"];
var settingsMins = [0 , 0];
var settingsMaxs = [33, 100];

if (localStorage.getItem("settingsVal0") === null) { // si pas deja initialisé
  var defaultValues = [50,50];
  defaultValues.forEach(function(val, index, array) {
    var tmp = 'settingsVal' + index;
    localStorage.setItem(tmp, val);
  });
}

function updateSlider(slider) {
  var id = slider.id.replace( /^\D+/g, '');
  var val = slider.value;
  var name = settingsTxt[id];

  document.getElementById("sliderTxt" + id).innerHTML = name + " : " + val;
  var tmp = 'settingsVal' + id;
  localStorage.setItem(tmp, val);

  console.log(tmp + " <- " + val + " (ecriture)");
}

function pullSettings() {
  console.log("on recupere tout");
  settingsTxt.forEach(function(name, index, array) {
    var tmp = 'settingsVal' + index;
    var val = localStorage.getItem(tmp);
    var min = settingsMins[index];
    var max = settingsMaxs[index];

    document.getElementById("sliderTxt" + index).innerHTML = name + " : " + val;
    document.getElementById("slider" + index).value = val;
    document.getElementById("slider" + index).min   = min;
    document.getElementById("slider" + index).max   = max;

    console.log("settingsVal" + index + " : " + val + " (lecture)");
  });
}
