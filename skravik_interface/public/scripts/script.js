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
  [0,  2935, 2935, "Conso max des équipements"],
  [0,  200, 200,   "Prod panneau solaire minimale"]
]//min, max, default, text

function round(x) {
    return Number.parseFloat(x).toFixed(1);
  }

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
  var vitesseVent = get(data,"anomometre.vitesseVent");
  var ventMax = localStorage.getItem('settingsVal0');
  var prodEOL1 = get(data,"sources.eolienne1.production");
  var prodEOL2 = get(data,"sources.eolienne2.production");
  var sourcesTotales = get(data,"sommes.sommeSources");
  var consosTotales = get(data,"sommes.sommeSources");
  var prodVersBat = get(data,"transferts.sourcesVersBatteries");
  var chargeBat1 = get(data,"batteries.batterie1");// a changer pour la charge totale ?
  //var tempPS1 = data;
  //var tempPS2 = data;
  //var tempPS3 = data;
  //var tempPS4 = data;
  var tempMaxPS = localStorage.getItem('settingsVal1');
  var prodPS1 = get(data,"sources.panneauSolaire1.production");
  var prodPS2 = get(data,"sources.panneauSolaire2.production");
  var prodPS3 = get(data,"sources.panneauSolaire3.production");
  var prodPS4 = get(data,"sources.panneauSolaire4.production");
  var prodMinPS = localStorage.getItem('settingsVal3');
  //var lum = data;
  //var vitBateau = data;
  //var hydroH240DansEau = data;
  //var hydroPOD600DansEau = data;
  var tempPileHG = get(data,"sources.pilehydrogene.temperature");
  //var tensionPileHG = data;
  //var consoPileHG = data;
  var consoEquip = get(data,"consos.equipements.conso");
  var consoMaxEquip = localStorage.getItem('settingsVal2');

  var warning = false;
  var warningPS1 = false;
  var warningPS2 = false;
  var warningPS3 = false;
  var warningPS4 = false;
  var warningHYD1 = false;
  var warningHYD2 = false;
  var warningPHG = false;

  //Verification de chaque alerte possible
  if (vitesseVent > ventMax){
    warning=true;
    warningShow("tropDeVent");
    document.getElementById("IMGeolienne1").setAttribute("src", "img/eolienne_alerte.gif");
    document.getElementById("IMGeolienne2").setAttribute("src", "img/eolienne_alerte.gif");
    document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne_alerte.gif");
  }
  else {
    warningHide("tropDeVent");
    
    if (vitesseVent > 2.5 && prodEOL1 == 0){
      document.getElementById("IMGeolienne1").setAttribute("src", "img/eolienne_alerte.gif");
      document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne_alerte.gif");
      warningShow("pbProdEol1");
      warning=true;
    }
    else {
      warningHide("pbProdEol1");
      document.getElementById("IMGeolienne1").setAttribute("src", "img/eolienne.png");
      document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne.png");
    }
    
    if (vitesseVent > 2.5 && prodEOL2 == 0){
      document.getElementById("IMGeolienne2").setAttribute("src", "img/eolienne_alerte.gif");
      document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne_alerte.gif");
      warningShow("pbProdEol2");
      warning=true;
    }
    else {
      warningHide("pbProdEol2");
      document.getElementById("IMGeolienne2").setAttribute("src", "img/eolienne.png");
      document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne.png");
    }
  }

  

  if (sourcesTotales > consosTotales && prodVersBat == 0 && chargeBat1 == 1)
      {warningShow("pbChargeBat");warning=true;}
  else warningHide("pbChargeBat");

  /*
  if (tempPS1 > tempMaxPS)
      {warningShow("chauffePS1");warning=true;warningPS1=true;}
  else warningHide("chauffePS1");

  if (tempPS2 > tempMaxPS)
      {warningShow("chauffePS2");warning=true;warningPS2=true;}
  else warningHide("chauffePS2");

  if (tempPS3 > tempMaxPS)
      {warningShow("chauffePS3");warning=true;warningPS3=true;}
  else warningHide("chauffePS3");

  if (tempPS4 > tempMaxPS)
      {warningShow("chauffePS4");warning=true;warningPS4=true;}
  else warningHide("chauffePS4");

  if (tempPS1 > 85)
      {warningShow("surchauffePS1");warning=true;warningPS1=true;}
  else warningHide("surchauffePS1");

  if (tempPS2 > 85)
      {warningShow("surchauffePS2");warning=true;warningPS2=true;}
  else warningHide("surchauffePS2");

  if (tempPS3 > 85)
      {warningShow("surchauffePS3");warning=true;warningPS3=true;}
  else warningHide("surchauffePS3");

  if (tempPS4 > 85)
      {warningShow("surchauffePS4");warning=true;warningPS4=true;}
  else warningHide("surchauffePS4");

  if (prodPS1 < prodMinPS && lum > 200)
      {warningShow("pbProdPS1");warning=true;warningPS1=true;}
  else warningHide("pbProdPS1");

  if (prodPS2 < prodMinPS && lum > 200)
      {warningShow("pbProdPS2");warning=true;warningPS2=true;}
  else warningHide("pbProdPS2");

  if (prodPS3 < prodMinPS && lum > 200)
      {warningShow("pbProdPS3");warning=true;warningPS3=true;}
  else warningHide("pbProdPS3");

  if (prodPS4 < prodMinPS && lum > 200)
      {warningShow("pbProdPS4");warning=true;warningPS4=true;}
  else warningHide("pbProdPS4");

  if (vitBateau > 10 && hydroH240DansEau)
      {warningShow("pbVitHYD1");warning=true;warningHYD1=true;}
  else warningHide("pbVitHYD1");

  if (vitBateau > 12 && hydroPOD600DansEau)
      {warningShow("pbVitHYD2");warning=true;warningHYD2=true;}
  else warningHide("pbVitHYD2");
  */

  if (tempPileHG > 45)
      {warningShow("surchauffePileHG");warning=true;}
  else warningHide("surchauffePileHG");

  if (tempPileHG < 5)
      {warningShow("tropFroidPileHG");warning=true;}
  else warningHide("tropFroidPileHG");

  /*
  if (tensionPileHG < 52 || tensionPileHG > 80)
      {warningShow("pbProdPileHG");warning=true;warningPHG=true;}
  else warningHide("pbProdPileHG");

  if (consoPileHG > 65)
      {warningShow("pbConsoPileHG");warning=true;warningPHG=true;}
  else warningHide("pbConsoPileHG");
  */

  if (consoEquip > consoMaxEquip)
      {warningShow("pbConsosEquip");warning=true;}
  else warningHide("pbConsosEquip");

  //Changement des icones
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

function get(data, path){
  try {
    var pathArray = path.split(".");
    var object = data;

    pathArray.forEach(function(item){
      object = object[item];
    });
    return object;
  } catch (error) {
    console.error("Note found : " + path);
    return "-";
  }
}

function updatePages(data) {

    console.log(data);
  //Page menu
//   document.getElementById("panneauxsolaires").innerHTML     = get(data, "sources.panneauxSolaires");
//   document.getElementById("eoliennes").innerHTML            = get(data, "sources.eoliennes");
//   document.getElementById("hydroliennes").innerHTML         = get(data, "sources.hydroliennes");
//   document.getElementById("groupeEletrogene").innerHTML     = get(data, "sources.groupeElectrogene.production");
//   document.getElementById("alternateur").innerHTML          = get(data, "sources.alternateur.production");
//   document.getElementById("moteur").innerHTML               = get(data, "consos.moteur.conso");
//   document.getElementById("equipements").innerHTML          = get(data, "consos.equipements.conso");
//   document.getElementById("sommeSources").innerHTML         = get(data, "sommes.sommeSources");
//   document.getElementById("sommeConsos").innerHTML          = get(data, "sommes.sommeConsos");
//   document.getElementById("batterie1").innerHTML            = get(data, "electrical.batteries[0].capacity.stateOfCharge.value");
//   document.getElementById("batterie2").innerHTML            = get(data, "electrical.batteries[1].capacity.stateOfCharge.value");
//   document.getElementById("batterie3").innerHTML            = get(data, "electrical.batteries[2].capacity.stateOfCharge.value");
//   document.getElementById("sourcesVersConsos").innerHTML    = get(data, "transferts.sourcesVersConsos");
//   document.getElementById("batteriesVersConsos").innerHTML  = get(data, "transferts.batteriesVersConsos");
//   document.getElementById("sourcesVersBatteries").innerHTML = get(data, "transferts.sourcesVersBatteries");

//   if (data.transferts.sourcesVersConsos == 0)
//        document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/grey_arrow_right.png"");
//   else document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/green_arrow_right.png"");

//   if (data.transferts.batteriesVersConsos == 0)
//        document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/grey_arrow_up.png"");
//   else document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/green_arrow_up.png"");

//   if (data.transferts.sourcesVersBatteries == 0)
//        document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/grey_arrow_right.png"");
//   else document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/green_arrow_right.png"");

  //Page panneaux solaires
  //document.getElementById("PANInclinaison1").innerHTML    = get(data, "electrical.solar.panneauSolaire1.tilt.value");
  document.getElementById("PANProduction1").innerHTML     = get(data, "electrical.solar.panneauSolaire1.power.value");
//   document.getElementById("PANRendement1").innerHTML      = get(data, "electrical.solar.panneauSolaire1.efficiency.value");
//   document.getElementById("PANEnsoleillement1").innerHTML = get(data, "electrical.solar.panneauSolaire1.illuminance.value");
//   document.getElementById("PANTemperature1").innerHTML = get(data, "electrical.solar.panneauSolaire1.temperature.value");

//   document.getElementById("PANInclinaison2").innerHTML    = get(data, "electrical.solar.panneauSolaire2.tilt.value");
  document.getElementById("PANProduction2").innerHTML     = get(data, "electrical.solar.panneauSolaire2.power.value");
//   document.getElementById("PANRendement2").innerHTML      = get(data, "electrical.solar.panneauSolaire2.efficiency.value");
//   document.getElementById("PANEnsoleillement2").innerHTML = get(data, "electrical.solar.panneauSolaire2.illuminance.value");
//   document.getElementById("PANTemperature2").innerHTML = get(data, "electrical.solar.panneauSolaire2.temperature.value");

  document.getElementById("PANInclinaison3").innerHTML    = get(data, "electrical.solar.panneauSolaire3.tilt.value");
  document.getElementById("PANProduction3").innerHTML     = get(data, "electrical.solar.panneauSolaire3.power.value");
  document.getElementById("PANRendement3").innerHTML      = get(data, "electrical.solar.panneauSolaire3.efficiency.value");
  document.getElementById("PANEnsoleillement3").innerHTML = get(data, "electrical.solar.panneauSolaire3.illuminance.value");
  //document.getElementById("PANTemperature3").innerHTML    = get(data, "electrical.solar.panneauSolaire3.temperature.value");

  document.getElementById("PANInclinaison4").innerHTML    = get(data, "electrical.solar.panneauSolaire4.tilt.value");
  document.getElementById("PANProduction4").innerHTML     = get(data, "electrical.solar.panneauSolaire4.power.value");
  document.getElementById("PANRendement4").innerHTML      = get(data, "electrical.solar.panneauSolaire4.efficiency.value");
  document.getElementById("PANEnsoleillement4").innerHTML = get(data, "electrical.solar.panneauSolaire4.illuminance.value");
  //document.getElementById("PANTemperature4").innerHTML    = get(data, "electrical.solar.panneauSolaire4.temperature.value");

  //Page Eoliennes
  document.getElementById("EOLProduction1").innerHTML     = get(data, "electrical.windTurbine.windTurbine1.power.value");
  document.getElementById("EOLVitesse1").innerHTML        = get(data, "electrical.windTurbine.windTurbine1.windTurbineSpeed.value");
  document.getElementById("EOLTemperature1").innerHTML    = get(data, "electrical.windTurbine.windTurbine1.temperature.value");
  
  document.getElementById("EOLProduction2").innerHTML     = get(data, "electrical.windTurbine.windTurbine2.power.value");
  document.getElementById("EOLVitesse2").innerHTML        = get(data, "electrical.windTurbine.windTurbine2.windTurbineSpeed.value");
  document.getElementById("EOLTemperature2").innerHTML    = get(data, "electrical.windTurbine.windTurbine2.temperature.value");
  
  document.getElementById("ANMVitesse").innerHTML         = get(data, "environment.wind.speedTrue.value");

  //Page Hydroliennes
  document.getElementById("HYDProduction1").innerHTML     = get(data, "electrical.waterdTurbine.waterTurbine1.power.value");
  document.getElementById("HYDVitesse1").innerHTML        = get(data, "electrical.waterdTurbine.waterTurbine1.waterTurbineSpeed.value");
  document.getElementById("HYDTemperature1").innerHTML    = get(data, "environment.water.temperature.value");
  
  document.getElementById("HYDProduction2").innerHTML     = get(data, "electrical.waterTurbine.waterTurbine2.power.value");
  document.getElementById("HYDVitesse2").innerHTML        = get(data, "electrical.waterdTurbine.waterTurbine2.waterTurbineSpeed.value");
  document.getElementById("HYDTemperature2").innerHTML    = get(data, "environment.water.temperature.value");

  //Page Groupe electrogene
  document.getElementById("GREProduction1").innerHTML     = get(data, "electrical.generators.generator1.power.value");
  document.getElementById("GRETemperature1").innerHTML    = get(data, "electrical.generators.generator1.temperature.value");
  
  //Page Alternateur
  document.getElementById("ALTProduction1").innerHTML     = get(data, "electrical.alternators.alternator1.power.value");
  document.getElementById("ALTTemperature1").innerHTML    = get(data, "electrical.alternators.alternator1.temperature.value"); 
}

function updateDisplay(event) {
  var json = event.target.responseText;

  const data = JSON.parse(json);

  updatePages(data);
  console.log("Data updated successfully.");

  checkWarnings(data);
  console.log("Warnings checked.");

  setTimeout(fetchDataFromRestApi, 1000);
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
