/////////////////////////////////////////////
//////// Paramètres REST API SignalK ////////
/////////////////////////////////////////////
var host = "localhost";
var port = 3000;
var endpoint = "signalk/v1/api/vessels/self/";

/////////////////////////////////////////
//////// Paramètres des settings ////////
/////////////////////////////////////////

var settings =[
  [0,  33,   33,   "Vitesse de vent max"],
  [75, 80,   80,   "Temperature max des panneaux solaires"],
  [0,  2935, 2935, "Conso max des équipements"]
]//min, max, default, text


/////////////////////////////////////////////
//////// Gestion page avertissements ////////
/////////////////////////////////////////////
function warningShow(id){
  document.getElementById(id).style.display = 'block';
}

function warningHide(id){
  document.getElementById(id).style.display = 'none';
}

function checkWarnings(data) {
  //Vent trop rapide
  var vitesseVent = data.anomometre.vitesseVent;
  var valMax = localStorage.getItem('settingsVal0');

  var warning = false;

  //Verification de chaque alerte possible
  if (vitesseVent > valMax) {
    warningShow("warningTropDeVent");
    warning=true;
  }
  else warningHide("warningTropDeVent");

  //Changement de l'icone
  if (warning){
    document.getElementById("warningImg").setAttribute("src", "img/warning.gif");
    warningHide("warningOK");
  }
  else {
    document.getElementById("warningImg").setAttribute("src", "img/green_check.png");
    warningShow("warningOK");
  }
}



/////////////////////////////////////
//////// Gestion des données ////////
/////////////////////////////////////

function updatePages(data) {
  //Page menu
//   document.getElementById("panneauxsolaires").innerHTML     = round(data.sources.panneauxSolaires);
//   document.getElementById("eoliennes").innerHTML            = round(data.sources.eoliennes);
//   document.getElementById("hydroliennes").innerHTML         = round(data.sources.hydroliennes);
//   document.getElementById("groupeEletrogene").innerHTML     = round(data.sources.groupeElectrogene.production);
//   document.getElementById("alternateur").innerHTML          = round(data.sources.alternateur.production);
//   document.getElementById("moteur").innerHTML               = round(data.consos.moteur.conso);
//   document.getElementById("equipements").innerHTML          = round(data.consos.equipements.conso);
//   document.getElementById("sommeSources").innerHTML         = round(data.sommes.sommeSources);
//   document.getElementById("sommeConsos").innerHTML          = round(data.sommes.sommeConsos);
  document.getElementById("batterie1").innerHTML            = round(data.electrical.batteries[0].capacity.stateOfCharge.value);
  document.getElementById("batterie2").innerHTML            = round(data.electrical.batteries[1].capacity.stateOfCharge.value);
  document.getElementById("batterie3").innerHTML            = round(data.electrical.batteries[2].capacity.stateOfCharge.value);
//   document.getElementById("sourcesVersConsos").innerHTML    = round(data.transferts.sourcesVersConsos);
//   document.getElementById("batteriesVersConsos").innerHTML  = round(data.transferts.batteriesVersConsos);
//   document.getElementById("sourcesVersBatteries").innerHTML = round(data.transferts.sourcesVersBatteries);

  if (data.transferts.sourcesVersConsos == 0)
       document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/grey_arrow_right.png");
  else document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/green_arrow_right.png");

  if (data.transferts.batteriesVersConsos == 0)
       document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/grey_arrow_up.png");
  else document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/green_arrow_up.png");

  if (data.transferts.sourcesVersBatteries == 0)
       document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/grey_arrow_right.png");
  else document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/green_arrow_right.png");

  //Page panneaux solaires
  document.getElementById("PANInclinaison1").innerHTML    = round(data.electrical.solar.panneauSolaire1.tilt.value);
  document.getElementById("PANProduction1").innerHTML     = round(data.electrical.solar.panneauSolaire1.power.value);
  document.getElementById("PANRendement1").innerHTML      = round(data.electrical.solar.panneauSolaire1.efficiency.value);
  document.getElementById("PANEnsoleillement1").innerHTML = round(data.electrical.solar.panneauSolaire1.illuminance.value);
  document.getElementById("PANTemperature1").innerHTML = round(data.electrical.solar.panneauSolaire1.temperature.value);

  document.getElementById("PANInclinaison2").innerHTML    = round(data.electrical.solar.panneauSolaire2.tilt.value);
  document.getElementById("PANProduction2").innerHTML     = round(data.electrical.solar.panneauSolaire2.power.value);
  document.getElementById("PANRendement2").innerHTML      = round(data.electrical.solar.panneauSolaire2.efficiency.value);
  document.getElementById("PANEnsoleillement2").innerHTML = round(data.electrical.solar.panneauSolaire2.illuminance.value);
  document.getElementById("PANTemperature2").innerHTML = round(data.electrical.solar.panneauSolaire2.temperature.value);

  document.getElementById("PANInclinaison3").innerHTML    = round(data.electrical.solar.panneauSolaire3.tilt.value);
  document.getElementById("PANProduction3").innerHTML     = round(data.electrical.solar.panneauSolaire3.power.value);
  document.getElementById("PANRendement3").innerHTML      = round(data.electrical.solar.panneauSolaire3.efficiency.value);
  document.getElementById("PANEnsoleillement3").innerHTML = round(data.electrical.solar.panneauSolaire3.illuminance.value);
  document.getElementById("PANTemperature3").innerHTML = round(data.electrical.solar.panneauSolaire3.temperature.value);

  document.getElementById("PANInclinaison4").innerHTML    = round(data.electrical.solar.panneauSolaire4.tilt.value);
  document.getElementById("PANProduction4").innerHTML     = round(data.electrical.solar.panneauSolaire4.power.value);
  document.getElementById("PANRendement4").innerHTML      = round(data.electrical.solar.panneauSolaire4.efficiency.value);
  document.getElementById("PANEnsoleillement4").innerHTML = round(data.electrical.solar.panneauSolaire4.illuminance.value);
  document.getElementById("PANTemperature4").innerHTML = round(data.electrical.solar.panneauSolaire4.temperature.value);

  //Page Eoliennes
  document.getElementById("EOLProduction1").innerHTML     = round(data.electrical.windTurbine.windTurbine1.power.value);
  document.getElementById("EOLVitesse1").innerHTML        = round(data.electrical.windTurbine.windTurbine1.windTurbineSpeed.value);
  document.getElementById("EOLTemperature1").innerHTML    = round(data.electrical.windTurbine.windTurbine1.temperature.value);
  
  document.getElementById("EOLProduction2").innerHTML     = round(data.electrical.windTurbine.windTurbine2.power.value);
  document.getElementById("EOLVitesse2").innerHTML        = round(data.electrical.windTurbine.windTurbine2.windTurbineSpeed.value);
  document.getElementById("EOLTemperature2").innerHTML    = round(data.electrical.windTurbine.windTurbine2.temperature.value);
  
  document.getElementById("ANMVitesse").innerHTML         = round(data.environment.wind.speedTrue.value);

  //Page Hydroliennes
  document.getElementById("HYDProduction1").innerHTML     = round(data.electrical.windTurbine.waterTurbine1.power.value);
  document.getElementById("HYDVitesse1").innerHTML        = round(data.electrical.windTurbine.waterTurbine1.waterTurbineSpeed.value);
  document.getElementById("HYDTemperature1").innerHTML    = round(data.environment.water.temperature.value);
  
  document.getElementById("HYDProduction2").innerHTML     = round(data.electrical.windTurbine.waterTurbine2.power.value);
  document.getElementById("HYDVitesse2").innerHTML        = round(data.electrical.windTurbine.waterTurbine2.waterTurbineSpeed.value);
  document.getElementById("HYDTemperature2").innerHTML    = round(data.environment.water.temperature.value);

  //Page Groupe electrogene
  document.getElementById("GREProduction1").innerHTML     = round(data.electrical.generators.generator1.power.value);
  document.getElementById("GRETemperature1").innerHTML    = round(data.electrical.generators.generator1.temperature.value);
  
  //Page Alternateur
  document.getElementById("ALTProduction1").innerHTML     = round(data.electrical.alternators.alternator1.power.value);
  document.getElementById("ALTTemperature1").innerHTML    = round(data.electrical.alternators.alternator1.temperature.value); 
}

function updateDisplay(event) {
  var json = event.target.responseText;

  const data = JSON.parse(json);

  updatePages(data);
  console.log("Data updated successfully.");

  checkWarnings(data);
  console.log("Warnings checked.");

  setTimeout(fetchDataFromRestApi, 5000);
}

function fetchDataFromRestApi()  {
  console.log("Getting data...");
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", updateDisplay);
  oReq.open("GET", "http://" + host + ":" + port + "/" + endpoint);
  oReq.send();
}

//First call
fetchDataFromRestApi();


//////////////////////////////////////////////////
//////// Gestion de l'affichage des pages ////////
//////////////////////////////////////////////////

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


/////////////////////////////////////////
//////// Gestion page paramètres ////////
/////////////////////////////////////////
function round(x) {
  return Number.parseFloat(x).toFixed(1);
}


/////////////////////////////////////////
//////// Gestion page paramètres ////////
/////////////////////////////////////////

if (localStorage.getItem("settingsVal0") === null) { // si pas encore initialisé
  console.log("Application des paramètres par defaut.")
  settings.forEach(function(element, index, array) {
    var tmp = 'settingsVal' + index;
    localStorage.setItem(tmp, element[2]);
    console.log(tmp + " <- " + element[2] + " (ecriture)");
  });
}

function updateSlider(slider) {
  var id = slider.id.replace( /^\D+/g, '');
  var val = slider.value;
  var name = settings[id][3];

  document.getElementById("sliderTxt" + id).innerHTML = name + " : " + val;
  var IDname = 'settingsVal' + id;
  localStorage.setItem(IDname, val);

  console.log(IDname + " <- " + val + " (ecriture)");
}

function pullSettings() {
  console.log("Recuperation des parametres actuels");
  settings.forEach(function(element, index, array) {
    var IDname = 'settingsVal' + index;
    var val = localStorage.getItem(IDname);
    var min = settings[index][0];
    var max = settings[index][1];

    document.getElementById("sliderTxt" + index).innerHTML = element[3] + " : " + val;
    document.getElementById("slider" + index).value = val;
    document.getElementById("slider" + index).min   = min;
    document.getElementById("slider" + index).max   = max;

    console.log("settingsVal" + index + " : " + val + " (lecture)");
  });
}
