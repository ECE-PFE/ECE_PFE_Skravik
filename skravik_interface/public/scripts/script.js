/////////////////////////////////////////////
//////// Paramètres REST API SignalK ////////
/////////////////////////////////////////////
const host = "localhost";
const port = 3000;
const endpoint = "signalk/v1/api/vessels/self/";


/////////////////////////////////////////
//////// Paramètres des settings ////////
/////////////////////////////////////////
const settings =[
  [0,  33,   33,   "Vitesse de vent max"],
  [75, 80,   80,   "Temperature max des panneaux solaires"],
  [0,  2935, 2935, "Conso max des équipements"],
  [0,  200, 200,   "Prod panneau solaire minimale"]
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

function checkWarnings(data) {// sommeSources, sommeConsos, sommeEquipements, sourcesVersBatteries sont dispo par effet de bord
  let vitesseVent = get(data,"environment.wind.speedTrue.value");
  let ventMax = localStorage.getItem('settingsVal0');
  let prodEOL1 = get(data,"electrical.windTurbine.windTurbine1.power.value");
  let prodEOL2 = get(data,"electrical.windTurbine.windTurbine2.power.value");
  let sourcesTotales = sommeSources;
  let consosTotales = sommeConsos;
  let prodVersBat = sourcesVersBatteries;
  let chargeBat1 = get(data,"electrical.batteries.0.capacity.stateOfCharge.value");// a changer pour la charge totale ?
  let tempPS1 = get(data, "electrical.solar.panneauSolaire1.temperature.value");
  let tempPS2 = get(data, "electrical.solar.panneauSolaire2.temperature.value");
  let tempPS3 = get(data, "electrical.solar.panneauSolaire3.temperature.value");
  let tempPS4 = get(data, "electrical.solar.panneauSolaire4.temperature.value");
  let tempMaxPS = localStorage.getItem('settingsVal1');
  let prodPS1 = get(data,"electrical.solar.panneauSolaire1.power.value");
  let prodPS2 = get(data,"electrical.solar.panneauSolaire2.power.value");
  let prodPS3 = get(data,"electrical.solar.panneauSolaire3.power.value");
  let prodPS4 = get(data,"electrical.solar.panneauSolaire4.power.value");
  let prodMinPS = localStorage.getItem('settingsVal3');
  let lum1 = get(data, "electrical.solar.panneauSolaire1.illuminance.value");;
  let lum2 = get(data, "electrical.solar.panneauSolaire2.illuminance.value");;
  let lum3 = get(data, "electrical.solar.panneauSolaire3.illuminance.value");;
  let lum4 = get(data, "electrical.solar.panneauSolaire4.illuminance.value");;
  let vitBateau = "-";
  let hydroH240DansEau = "-";
  let hydroPOD600DansEau = "-";
  let tempPileHG = get(data,"electrical.pileHydrogene.power.value");
  let tensionPileHG = "-";
  let consoPileHG = "-";
  let consoEquip = sommeEquipements;
  let consoMaxEquip = localStorage.getItem('settingsVal2');

  let warning = false;
  let warningEOL = false;
  let warningEOL1 = false;
  let warningEOL2 = false;
  let warningPS = false;
  let warningPS1 = false;
  let warningPS2 = false;
  let warningPS3 = false;
  let warningPS4 = false;
  let warningHYD = false;
  let warningHYD1 = false;
  let warningHYD2 = false;
  let warningPHG = false;

  //Verification de chaque alerte possible
  if (vitesseVent > 2.5 && prodEOL1 == 0 && vitesseVent < ventMax)
      {warningShow("pbProdEol1");warning=true;warningEOL=true;warningEOL1=true;}
  else warningHide("pbProdEol1");

  if (vitesseVent > 2.5 && prodEOL2 == 0 && vitesseVent < ventMax)
      {warningShow("pbProdEol2");warning=true;warningEOL=true;warningEOL2=true;}
  else warningHide("pbProdEol2");

  if (vitesseVent > ventMax)
      {warningShow("tropDeVent");warning=true;warningEOL=true;}
  else warningHide("tropDeVent");

  if (sourcesTotales > consosTotales && prodVersBat == 0 && chargeBat1 == 1)
      {warningShow("pbChargeBat");warning=true;}
  else warningHide("pbChargeBat");
  
  if (tempPS1 > tempMaxPS)
     {warningShow("chauffePS1");warning=true;warningPS=true;warningPS1=true;}
  else warningHide("chauffePS1");

  if (tempPS2 > tempMaxPS)
      {warningShow("chauffePS2");warning=true;warningPS=true;warningPS2=true;}
  else warningHide("chauffePS2");

  if (tempPS3 > tempMaxPS)
      {warningShow("chauffePS3");warning=true;warningPS=true;warningPS3=true;}
  else warningHide("chauffePS3");

  if (tempPS4 > tempMaxPS)
      {warningShow("chauffePS4");warning=true;warningPS=true;warningPS4=true;}
  else warningHide("chauffePS4");

  if (tempPS1 > 85)
      {warningShow("surchauffePS1");warning=true;warningPS=true;warningPS1=true;}
  else warningHide("surchauffePS1");

  if (tempPS2 > 85)
      {warningShow("surchauffePS2");warning=true;warningPS=true;warningPS2=true;}
  else warningHide("surchauffePS2");

  if (tempPS3 > 85)
      {warningShow("surchauffePS3");warning=true;warningPS=true;warningPS3=true;}
  else warningHide("surchauffePS3");

  if (tempPS4 > 85)
      {warningShow("surchauffePS4");warning=true;warningPS=true;warningPS4=true;}
  else warningHide("surchauffePS4");

  if (prodPS1 < prodMinPS && lum1 > 200)
      {warningShow("pbProdPS1");warning=true;warningPS=true;warningPS1=true;}
  else warningHide("pbProdPS1");

  if (prodPS2 < prodMinPS && lum2 > 200)
      {warningShow("pbProdPS2");warning=true;warningPS=true;warningPS2=true;}
  else warningHide("pbProdPS2");

  if (prodPS3 < prodMinPS && lum3 > 200)
      {warningShow("pbProdPS3");warning=true;warningPS=true;warningPS3=true;}
  else warningHide("pbProdPS3");

  if (prodPS4 < prodMinPS && lum4 > 200)
      {warningShow("pbProdPS4");warning=true;warningPS=true;warningPS4=true;}
  else warningHide("pbProdPS4");

  if (vitBateau > 10 && hydroH240DansEau)
      {warningShow("pbVitHYD1");warning=true;warningHYD=true;warningHYD1=true;}
  else warningHide("pbVitHYD1");

  if (vitBateau > 12 && hydroPOD600DansEau)
      {warningShow("pbVitHYD2");warning=true;warningHYD=true;warningHYD2=true;}
  else warningHide("pbVitHYD2");

  if (tempPileHG > 45)
      {warningShow("surchauffePileHG");warning=true;warningPHG=true;}
  else warningHide("surchauffePileHG");

  if (tempPileHG < 5)
      {warningShow("tropFroidPileHG");warning=true;warningPHG=true;}
  else warningHide("tropFroidPileHG");

  if (tensionPileHG < 52 || tensionPileHG > 80)
      {warningShow("pbProdPileHG");warning=true;warningPHG=true;}
  else warningHide("pbProdPileHG");

  if (consoPileHG > 65)
      {warningShow("pbConsoPileHG");warning=true;warningPHG=true;}
  else warningHide("pbConsoPileHG");

  if (consoEquip > consoMaxEquip)
      {warningShow("pbConsosEquip");warning=true;}
  else warningHide("pbConsosEquip");

  //Changement des icones
  if (warning * warningEOL * warningPS * warningHYD * warningPHG){
    document.getElementById("warningImg").setAttribute("src", "img/warning.gif");
    warningHide("warningOK");
  }
  else {
    document.getElementById("warningImg").setAttribute("src", "img/green_check.png");
    warningShow("warningOK");
  }

  if (warningEOL)
       document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne_alerte.gif");
  else document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne.png");

  if (warningEOL1)
       document.getElementById("IMGeolienne1").setAttribute("src", "img/eolienne_alerte.gif");
  else document.getElementById("IMGeolienne1").setAttribute("src", "img/eolienne.png");

  if (warningEOL2)
       document.getElementById("IMGeolienne2").setAttribute("src", "img/eolienne_alerte.gif");
  else document.getElementById("IMGeolienne2").setAttribute("src", "img/eolienne.png");

  if (warningPS)
       document.getElementById("IMGpanneauxSolaires").setAttribute("src", "img/panneaux_solaire_alerte.gif");
  else document.getElementById("IMGpanneauxSolaires").setAttribute("src", "img/panneaux_solaire.png");

  if (warningPS1)
       document.getElementById("IMGpanneauSolaire1").setAttribute("src", "img/panneaux_solaire_alerte.gif");
  else document.getElementById("IMGpanneauSolaire1").setAttribute("src", "img/panneaux_solaire.png");

  if (warningPS2)
       document.getElementById("IMGpanneauSolaire2").setAttribute("src", "img/panneaux_solaire_alerte.gif");
  else document.getElementById("IMGpanneauSolaire2").setAttribute("src", "img/panneaux_solaire.png");

  if (warningPS3)
       document.getElementById("IMGpanneauSolaire3").setAttribute("src", "img/panneaux_solaire_alerte.gif");
  else document.getElementById("IMGpanneauSolaire3").setAttribute("src", "img/panneaux_solaire.png");

  if (warningPS4)
       document.getElementById("IMGpanneauSolaire4").setAttribute("src", "img/panneaux_solaire_alerte.gif");
  else document.getElementById("IMGpanneauSolaire4").setAttribute("src", "img/panneaux_solaire.png");

  if (warningHYD)
       document.getElementById("IMGhydrolienne").setAttribute("src", "img/hydrolienne_alerte.gif");
  else document.getElementById("IMGhydrolienne").setAttribute("src", "img/hydrolienne.png");

  if (warningHYD1)
       document.getElementById("IMGhydrolienne1").setAttribute("src", "img/hydrolienne_alerte.gif");
  else document.getElementById("IMGhydrolienne1").setAttribute("src", "img/hydrolienne.png");

  if (warningHYD2)
       document.getElementById("IMGhydrolienne2").setAttribute("src", "img/hydrolienne_alerte.gif");
  else document.getElementById("IMGhydrolienne2").setAttribute("src", "img/hydrolienne.png");

  if (warningPHG)
       document.getElementById("IMGpileHydrogene").setAttribute("src", "img/pilehydrogene_alerte.gif");
  else document.getElementById("IMGpileHydrogene").setAttribute("src", "img/pilehydrogene.png");
}


/////////////////////////////////////
//////// Gestion des données ////////
/////////////////////////////////////

function get(data, path){
  try {
    let pathArray = path.split(".");
    let object = data;

    pathArray.forEach(function(item){
      object = object[item];
    });

    return object;

  } catch (error) {
        console.warn("Not found : " + path);
    return "-";
  }
}

function updatePages(data) {

  console.log(data);

  sommePanneauxSolaires = get(data, "electrical.solar.panneauSolaire1.power.value")
                        + get(data, "electrical.solar.panneauSolaire2.power.value")
                        + get(data, "electrical.solar.panneauSolaire3.power.value")
                        + get(data, "electrical.solar.panneauSolaire4.power.value");
  if (isNaN(sommePanneauxSolaires)) sommePanneauxSolaires = "-";

  sommeEoliennes = get(data, "electrical.windTurbine.windTurbine1.power.value")
                 + get(data, "electrical.windTurbine.windTurbine2.power.value");
  if (isNaN(sommeEoliennes)) sommeEoliennes = "-";

  sommeHydroliennes = get(data, "electrical.waterTurbine.waterTurbine1.power.value")
                    + get(data, "electrical.waterTurbine.waterTurbine2.power.value");
  if (isNaN(sommeHydroliennes)) sommeHydroliennes = "-";

  sommeGroupeElectrogene = get(data, "electrical.generators.generator1.power.value");
  sommeAlternateur = get(data, "electrical.alternators.alternator1.power.value");
  sommePileHydrogene = get(data, "electrical.pileHydrogene.power.value");

  sommeMoteurs = get(data, "moteur.value");
  sommeEquipements = get(data, "equipements.value");

  sommeSources = sommePanneauxSolaires + sommeEoliennes + sommeHydroliennes + sommeGroupeElectrogene + sommeAlternateur + sommePileHydrogene;
  if (isNaN(sommeSources)) sommeSources = "-";

  sommeConsos = sommePanneauxSolaires + sommeEquipements;
  if (isNaN(sommeConsos)) sommeConsos = "-";

  if (isNaN(sommeSources + sommeConsos)){//si pas nombre valide
    sourcesVersConsos    ="-";
    batteriesVersConsos  ="-";
    sourcesVersBatteries ="-";
  }
  else {
    if (sommeSources == 0){
      sourcesVersConsos    = 0.0;
      batteriesVersConsos  = - sommeConsos;
      sourcesVersBatteries = 0.0;
    }
    else if (sommeSources > - sommeConsos){
      sourcesVersConsos    = - sommeConsos;
      batteriesVersConsos  = 0.0;
      sourcesVersBatteries = sommeSources + sommeConsos;
    }
    else {
      sourcesVersConsos    = sommeSources;
      batteriesVersConsos  = - sommeConsos - sommeSources;
      sourcesVersBatteries = 0.0;
    }
  }

  //Page menu
  document.getElementById("panneauxsolaires").innerHTML = sommePanneauxSolaires;
  document.getElementById("eoliennes").innerHTML        = sommeEoliennes;
  document.getElementById("hydroliennes").innerHTML     = sommeHydroliennes;
  document.getElementById("groupeEletrogene").innerHTML = sommeGroupeElectrogene;
  document.getElementById("alternateur").innerHTML      = sommeAlternateur;
  document.getElementById("pilehydrogene").innerHTML    = sommePileHydrogene;

  document.getElementById("sommeSources").innerHTML     = sommeSources;
  document.getElementById("sommeConsos").innerHTML      = sommeConsos;

  document.getElementById("moteur").innerHTML           = sommeMoteurs;
  document.getElementById("equipements").innerHTML      = sommeEquipements;

  document.getElementById("sourcesVersConsos").innerHTML    = sourcesVersConsos;
  document.getElementById("batteriesVersConsos").innerHTML  = batteriesVersConsos;
  document.getElementById("sourcesVersBatteries").innerHTML = sourcesVersBatteries;

  document.getElementById("batterie1").innerHTML        = get(data, "electrical.batteries.0.capacity.stateOfCharge.value");
  document.getElementById("batterie2").innerHTML        = get(data, "electrical.batteries.1.capacity.stateOfCharge.value");
  document.getElementById("batterie3").innerHTML        = get(data, "electrical.batteries.2.capacity.stateOfCharge.value");

  if (sourcesVersConsos == 0)
    document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/grey_arrow_right.png");
  else document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/green_arrow_right.png");

  if (batteriesVersConsos == 0)
    document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/grey_arrow_up.png");
  else document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/green_arrow_up.png");

  if (sourcesVersBatteries == 0)
    document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/grey_arrow_right.png");
  else document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/green_arrow_right.png");

  //Page menu prevision
  document.getElementById("panneauxsolairesPrev").innerHTML = get(data, "electrical.solar.solarPanel.prev.meanPower.value");
  document.getElementById("eoliennesPrev").innerHTML        = get(data, "electrical.windTurbines.windTurbine.prev.meanPower.value");
  document.getElementById("hydroliennesPrev").innerHTML     = get(data, "electrical.prev.solar.waterTurbine.power.value");
  document.getElementById("groupeEletrogenePrev").innerHTML = get(data, "electrical.prev.solar.generators.power.value");
  document.getElementById("alternateurPrev").innerHTML      = get(data, "electrical.prev.solar.alternators.power.value");
  document.getElementById("pilehydrogenePrev").innerHTML    = get(data, "electrical.prev.solar.pileHydrogene.power.value");

  sommeSourcesPrev = get(data, "electrical.solar.solarPanel.prev.meanPower.value")
                   + get(data, "electrical.windTurbines.windTurbine.prev.meanPower.value")
                   + get(data, "electrical.prev.solar.waterTurbine.power.value")
                   + get(data, "electrical.prev.solar.generators.power.value")
                   + get(data, "electrical.prev.solar.alternators.power.value")
                   + get(data, "electrical.prev.solar.pileHydrogene.power.value");
  if (isNaN(sommeSourcesPrev)) sommeSourcesPrev = "-";
  document.getElementById("sommeSourcesPrev").innerHTML   = sommeSourcesPrev;

  //Page panneaux solaires
  document.getElementById("PANInclinaison1").innerHTML    = get(data, "electrical.solar.panneauSolaire1.tilt.value");
  document.getElementById("PANProduction1").innerHTML     = get(data, "electrical.solar.panneauSolaire1.power.value");
  document.getElementById("PANEnsoleillement1").innerHTML = get(data, "electrical.solar.panneauSolaire1.illuminance.value");
  document.getElementById("PANTemperature1").innerHTML    = get(data, "electrical.solar.panneauSolaire1.temperature.value");

  document.getElementById("PANInclinaison2").innerHTML    = get(data, "electrical.solar.panneauSolaire2.tilt.value");
  document.getElementById("PANProduction2").innerHTML     = get(data, "electrical.solar.panneauSolaire2.power.value");
  document.getElementById("PANEnsoleillement2").innerHTML = get(data, "electrical.solar.panneauSolaire2.illuminance.value");
  document.getElementById("PANTemperature2").innerHTML    = get(data, "electrical.solar.panneauSolaire2.temperature.value");

  document.getElementById("PANInclinaison3").innerHTML    = get(data, "electrical.solar.panneauSolaire3.tilt.value");
  document.getElementById("PANProduction3").innerHTML     = get(data, "electrical.solar.panneauSolaire3.power.value");
  document.getElementById("PANEnsoleillement3").innerHTML = get(data, "electrical.solar.panneauSolaire3.illuminance.value");
  document.getElementById("PANTemperature3").innerHTML    = get(data, "electrical.solar.panneauSolaire3.temperature.value");

  document.getElementById("PANInclinaison4").innerHTML    = get(data, "electrical.solar.panneauSolaire4.tilt.value");
  document.getElementById("PANProduction4").innerHTML     = get(data, "electrical.solar.panneauSolaire4.power.value");
  document.getElementById("PANEnsoleillement4").innerHTML = get(data, "electrical.solar.panneauSolaire4.illuminance.value");
  document.getElementById("PANTemperature4").innerHTML    = get(data, "electrical.solar.panneauSolaire4.temperature.value");

  //Page Eoliennes
  document.getElementById("EOLProduction1").innerHTML     = get(data, "electrical.windTurbine.windTurbine1.power.value");
  document.getElementById("EOLVitesse1").innerHTML        = get(data, "electrical.windTurbine.windTurbine1.windTurbineSpeed.value");
  
  document.getElementById("EOLProduction2").innerHTML     = get(data, "electrical.windTurbine.windTurbine2.power.value");
  document.getElementById("EOLVitesse2").innerHTML        = get(data, "electrical.windTurbine.windTurbine2.windTurbineSpeed.value");
  
  document.getElementById("ANMVitesse").innerHTML         = get(data, "environment.wind.speedTrue.value");

  //Page Hydroliennes
  document.getElementById("HYDProduction1").innerHTML     = get(data, "electrical.waterTurbine.waterTurbine1.power.value");
  document.getElementById("HYDVitesse1").innerHTML        = get(data, "electrical.waterTurbine.waterTurbine1.waterTurbineSpeed.value");
  
  document.getElementById("HYDProduction2").innerHTML     = get(data, "electrical.waterTurbine.waterTurbine2.power.value");
  document.getElementById("HYDVitesse2").innerHTML        = get(data, "electrical.waterTurbine.waterTurbine2.waterTurbineSpeed.value");
  
  //Page Groupe electrogene
  document.getElementById("GREProduction1").innerHTML     = get(data, "electrical.generators.generator1.power.value");
  document.getElementById("GRETemperature1").innerHTML    = get(data, "electrical.generators.generator1.temperature.value");
  
  //Page Alternateur
  document.getElementById("ALTProduction1").innerHTML     = get(data, "electrical.alternators.alternator1.power.value");

  document.getElementById("ALTProduction2").innerHTML     = get(data, "electrical.alternators.alternator2.power.value");
  
  //Page Pile à hydrogene
  document.getElementById("PHDProduction1").innerHTML     = get(data, "electrical.pileHydrogene.power.value");
  document.getElementById("PHDTemperature1").innerHTML    = get(data, "electrical.pileHydrogene.temperature.value");

  //Page Equipements
  equipementPage(data);

  }

function updateDisplay(event) {
  const json = event.target.responseText;

  const data = JSON.parse(json);

  updatePages(data);
  console.log("Data updated successfully.");

  checkWarnings(data);
  console.log("Warnings checked.");

  warningHide("warningERR");//Si on reussi jusque la sans erreur c'est bon signe

  setTimeout(fetchDataFromRestApi, 3000);
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
  let tmp;
  settings.forEach(function(element, index, array) {
    tmp = 'settingsVal' + index;
    localStorage.setItem(tmp, element[2]);
    console.log(tmp + " <- " + element[2] + " (ecriture)");
  });
}

function updateSlider(slider) {
  const id = slider.id.replace( /^\D+/g, '');
  const val = slider.value;
  const name = settings[id][3];

  document.getElementById("sliderTxt" + id).innerHTML = name + " : " + val;
  const IDname = 'settingsVal' + id;
  localStorage.setItem(IDname, val);

  console.log(IDname + " <- " + val + " (ecriture)");
}

function pullSettings() {
  console.log("Recuperation des parametres actuels");
  settings.forEach(function(element, index, array) {
    const IDname = 'settingsVal' + index;
    const val = localStorage.getItem(IDname);
    const min = settings[index][0];
    const max = settings[index][1];

    document.getElementById("sliderTxt" + index).innerHTML = element[3] + " : " + val;
    document.getElementById("slider" + index).value = val;
    document.getElementById("slider" + index).min   = min;
    document.getElementById("slider" + index).max   = max;

    console.log("settingsVal" + index + " : " + val + " (lecture)");
  });
}

///////////////////// Page equipement /////////////////////
json = {
  "equipement_lourd": {
    "equipement_lourd_1":"1",
    "equipement_lourd_2":"2",
    "equipement_lourd_3":"3"
  },
  "equipement_leger": {
    "equipement_leger_1":"1",
    "equipement_leger_2":"2",
    "equipement_leger_3":"3"
  },"equipement_classique": {
    "equipement_classique_1":"1",
    "equipement_classique_2":"2",
    "equipement_classique_3":"3"
  },"equipement_generateur": {
    "equipement_generateur_1":"1",
    "equipement_generateur_2":"2",
    "equipement_generateur_3":"3"
  }
 }

function appareilClassique(data)
{
  myObj = get(data, "electrical.consumers.appareilClassique")
  for (x in myObj) {
        var div = document.getElementById("classique");
        console.log(div);
        var p = document.createElement("p");
        var span = document.createElement("span");
        var node = document.createTextNode(x.name + " : ");
        p.appendChild(node);
        p.innerHTML += '<span id="'+x+'.span ">'+ x.power +'</span> W'
        p.setAttribute('id',x);
        div.appendChild(p);
    }
}


function appareilLeger(data)
{
  myObj = get(data, "electrical.consumers.appareilLeger")
  for (x in myObj) {
        var div = document.getElementById("leger");
        var p = document.createElement("p");
        var span = document.createElement("span");
        var node = document.createTextNode(x.name +" : ");
        p.appendChild(node);
        p.innerHTML += '<span id="'+x+'.span ">-</span> W'
        p.setAttribute('id',x);
        div.appendChild(p);

    }

}

function appareilLourd(data)
{
  myObj = get(data, "electrical.consumers.appareilLourd")
  for (x in myObj) {
  var div = document.getElementById("lourd");
  var p = document.createElement("p");
  var span = document.createElement("span");
  var node = document.createTextNode(x+" : ");
  p.appendChild(node);
  p.innerHTML += '<span id="'+x+'.span ">-</span> W'
  p.setAttribute('id',x);
  div.appendChild(p);
}

}

function appareilGenerateur(data)
{
  myObj = get(data, "electrical.consumers.generateur")
  for (x in myObj) {
  var div = document.getElementById("generateur");
  var p = document.createElement("p");
  var span = document.createElement("span");
  var node = document.createTextNode(x+" : ");
  p.appendChild(node);
  p.innerHTML += '<span id="'+x+'.span ">-</span> W'
  p.setAttribute('id',x);
  div.appendChild(p);

}
}


function equipementPage(data)
{

    let consumers = get(data, "electrical.consumers");
    
    for(categorie in consumers){
        // On récupère le div avec le id qui contient le nom de la catégorie
        let div_categorie = document.getElementById(categorie);

        for(appareil in consumers[categorie]){
            
            let element = document.getElementById("consumer_" + appareil);

            //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
            if(typeof(element) != 'undefined' && element != null){
                //Si elle existe on modifie son contenu
                element.innerHTML = get(consumers, categorie + "." + appareil + ".name.value") + " : " + '<span id="consumer_'+ appareil +'.span">'+ get(consumers, categorie + "." + appareil + ".power.value") +'</span> W';
            }else{
                //Sinon on l'ajoute
                let p = document.createElement("p");
                p.setAttribute('id', "consumer_" + appareil);
                let node = document.createTextNode(get(consumers, categorie + "." + appareil + ".name.value") + " : ");
        
                p.appendChild(node);
                p.innerHTML += '<span id="consumer_'+ appareil +'.span">'+ get(consumers, categorie + "." + appareil + ".power.value") +'</span> W';
                div_categorie.appendChild(p);
            }
        }
    }
}

//   appareilGenerateur(data);
//   appareilLourd(data);
//   appareilLeger(data);
//   appareilClassique(data);










///////////////////////////////////
//////// Gestion page Menu ////////
///////////////////////////////////

function hidePrev(){
  let elements = document.getElementsByClassName("prev");
  for (let elem of elements) {
    elem.setAttribute("style", "display:none");
  }
}

function showPrev(){
  let elements = document.getElementsByClassName("prev");
  for (let elem of elements) {
    elem.setAttribute("style", "display:block");
  }
}

var prev = false; 
function togglePrev(){
  if (prev) {
    hidePrev();
    prev = false; 
  }
  else {
    showPrev();
    prev = true; 
  }
}