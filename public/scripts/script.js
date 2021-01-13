
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
  console.log(data);
  //Page menu
  document.getElementById("panneauxsolaires").innerHTML     = round(data.sources.panneauxSolaires);
  document.getElementById("eoliennes").innerHTML            = round(data.sources.eoliennes);
  document.getElementById("hydroliennes").innerHTML         = round(data.sources.hydroliennes);
  document.getElementById("groupeEletrogene").innerHTML     = round(data.sources.groupeElectrogene.production);
  document.getElementById("alternateur").innerHTML          = round(data.sources.alternateur.production);
  document.getElementById("pilehydrogene").innerHTML        = round(data.sources.pilehydrogene.production);
  document.getElementById("moteur").innerHTML               = round(data.consos.moteur.conso);
  document.getElementById("equipements").innerHTML          = round(data.consos.equipements.conso);
  document.getElementById("sommeSources").innerHTML         = round(data.sommes.sommeSources);
  document.getElementById("sommeConsos").innerHTML          = round(data.sommes.sommeConsos);
  document.getElementById("batterie1").innerHTML            = round(data.batteries.batterie1);
  document.getElementById("batterie2").innerHTML            = round(data.batteries.batterie2);
  document.getElementById("batterie3").innerHTML            = round(data.batteries.batterie3);
  document.getElementById("sourcesVersConsos").innerHTML    = round(data.transferts.sourcesVersConsos);
  document.getElementById("batteriesVersConsos").innerHTML  = round(data.transferts.batteriesVersConsos);
  document.getElementById("sourcesVersBatteries").innerHTML = round(data.transferts.sourcesVersBatteries);

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
  document.getElementById("PANProduction1").innerHTML     = round(data.sources.panneauSolaire1.production);
  document.getElementById("PANInclinaison1").innerHTML    = round(data.sources.panneauSolaire1.inclinaison);
  document.getElementById("PANRendement1").innerHTML      = round(data.sources.panneauSolaire1.rendement);
  document.getElementById("PANEnsoleillement1").innerHTML = round(data.sources.panneauSolaire1.ensoleillement);

  document.getElementById("PANProduction2").innerHTML     = round(data.sources.panneauSolaire2.production);
  document.getElementById("PANInclinaison2").innerHTML    = round(data.sources.panneauSolaire2.inclinaison);
  document.getElementById("PANRendement2").innerHTML      = round(data.sources.panneauSolaire2.rendement);
  document.getElementById("PANEnsoleillement2").innerHTML = round(data.sources.panneauSolaire2.ensoleillement);

  document.getElementById("PANProduction3").innerHTML     = round(data.sources.panneauSolaire3.production);
  document.getElementById("PANInclinaison3").innerHTML    = round(data.sources.panneauSolaire3.inclinaison);
  document.getElementById("PANRendement3").innerHTML      = round(data.sources.panneauSolaire3.rendement);
  document.getElementById("PANEnsoleillement3").innerHTML = round(data.sources.panneauSolaire3.ensoleillement);

  document.getElementById("PANProduction4").innerHTML     = round(data.sources.panneauSolaire4.production);
  document.getElementById("PANInclinaison4").innerHTML    = round(data.sources.panneauSolaire4.inclinaison);
  document.getElementById("PANRendement4").innerHTML      = round(data.sources.panneauSolaire4.rendement);
  document.getElementById("PANEnsoleillement4").innerHTML = round(data.sources.panneauSolaire4.ensoleillement);

  //Page Eoliennes
  document.getElementById("EOLProduction1").innerHTML     = round(data.sources.eolienne1.production);
  document.getElementById("EOLVitesse1").innerHTML        = round(data.sources.eolienne1.vitesse);
  document.getElementById("EOLTemperature1").innerHTML    = round(data.sources.eolienne1.temperature);
  
  document.getElementById("EOLProduction2").innerHTML     = round(data.sources.eolienne2.production);
  document.getElementById("EOLVitesse2").innerHTML        = round(data.sources.eolienne2.vitesse);
  document.getElementById("EOLTemperature2").innerHTML    = round(data.sources.eolienne2.temperature);
  
  document.getElementById("ANMVitesse").innerHTML         = round(data.anomometre.vitesseVent);

  //Page Hydroliennes
  document.getElementById("HYDProduction1").innerHTML     = round(data.sources.hydrolienne1.production);
  document.getElementById("HYDVitesse1").innerHTML        = round(data.sources.hydrolienne1.vitesse);
  document.getElementById("HYDTemperature1").innerHTML    = round(data.sources.hydrolienne1.temperature);
  
  document.getElementById("HYDProduction2").innerHTML     = round(data.sources.hydrolienne2.production);
  document.getElementById("HYDVitesse2").innerHTML        = round(data.sources.hydrolienne2.vitesse);
  document.getElementById("HYDTemperature2").innerHTML    = round(data.sources.hydrolienne2.temperature);

  //Page Groupe electrogene
  document.getElementById("GREProduction1").innerHTML     = round(data.sources.groupeElectrogene.production);
  document.getElementById("GRETemperature1").innerHTML    = round(data.sources.groupeElectrogene.temperature);
  
  //Page Alternateur
  document.getElementById("ALTProduction1").innerHTML     = round(data.sources.alternateur.production);
  document.getElementById("ALTTemperature1").innerHTML    = round(data.sources.alternateur.temperature); 

  //Page pile à hydrogène
  document.getElementById("PHDProduction1").innerHTML     = round(data.sources.pilehydrogene.production);
  document.getElementById("PHDTemperature1").innerHTML    = round(data.sources.pilehydrogene.temperature); 
}

function updateDisplay(event) {
  var json = event.target.responseText;

  const data = (JSON.parse(json)).data;

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
  oReq.open("GET", "http://localhost/values");
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
