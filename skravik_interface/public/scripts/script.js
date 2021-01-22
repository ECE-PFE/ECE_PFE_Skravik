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

    let sourcesTotales = sommeSources;
    let consosTotales = sommeConsos;
    let prodVersBat = sourcesVersBatteries;

    let chargeBat1 = get(data,"electrical.batteries.0.capacity.stateOfCharge.value");// a changer pour la charge totale ?

    let tempMaxPS = localStorage.getItem('settingsVal1');

    let prodMinPS = localStorage.getItem('settingsVal3');

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
    let warningPS = false;
    let warningHYD = false;
    let warningPHG = false;

    //Verification de chaque alerte possible
    for(elmt in EOL) {
        EOL[elmt].warning = false;
        if (vitesseVent > 2.5 && get(EOL[elmt],"power.value") == 0 && vitesseVent < ventMax)
        {
            warningShow("pbProdEol");
            warning = true;
            warningEOL = true;
            EOL[elmt].warning = true;
        }
        else{
            warningHide("pbProdEol");
        }
    }

    if (vitesseVent > ventMax)
        {warningShow("tropDeVent");warning=true;warningEOL=true;}
    else warningHide("tropDeVent");

    if (sourcesTotales > consosTotales && prodVersBat == 0 && chargeBat1 == 1){
        warningShow("pbChargeBat");
        warning=true;
    }else{
        warningHide("pbChargeBat");
    }

    for(elmt in PS){
        PS[elmt].warning = false;
        if (get(PS[elmt],"temperature.value") > tempMaxPS){
            warningShow("chauffePS");
            warning=true;
            warningPS=true;
            PS[elmt].warning = true;
        }else{
            warningHide("chauffePS");
        }

        if (get(PS[elmt],"temperature.value") > 85){
            warningShow("surchauffePS");
            warning=true;
            warningPS=true;
            PS[elmt].warning = true;
        }else{ 
            warningHide("surchauffePS");
        }

        if (get(PS[elmt],"power.value") < prodMinPS && get(PS[elmt],"illuminance.value") > 200){
            warningShow("pbProdPS");
            warning=true;
            warningPS=true;
            PS[elmt].warning = true;
        }else{
            warningHide("pbProdPS");
        }

    }

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

    ////////////////////////////////
    ///  Changement des icones   ///
    ////////////////////////////////

    if (warning || warningEOL || warningPS || warningHYD || warningPHG){
        document.getElementById("warningImg").setAttribute("src", "img/warning.gif");
        warningHide("warningOK");
    }else {
        document.getElementById("warningImg").setAttribute("src", "img/green_check.png");
        warningShow("warningOK");
    }

    // Affichage warning EOL
    if (warningEOL)
        document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne_alerte.gif");
    else document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne.png");

    for(elmt in EOL){
        if(EOL[elmt].warning){
            document.getElementById("IMGeolienne" + elmt).setAttribute("src", "img/eolienne_alerte.gif");
        }else{
            document.getElementById("IMGeolienne" + elmt).setAttribute("src", "img/eolienne.png");
        }
    }

    // Affichage warning PS
    if (warningPS)
        document.getElementById("IMGpanneauxSolaires").setAttribute("src", "img/panneaux_solaire_alerte.gif");
    else document.getElementById("IMGpanneauxSolaires").setAttribute("src", "img/panneaux_solaire.png");

    for(elmt in PS){
        if(PS[elmt].warning){
            document.getElementById("IMGpanneauSolaire" + elmt).setAttribute("src", "img/panneaux_solaire_alerte.gif");
        }else{
            document.getElementById("IMGpanneauSolaire" + elmt).setAttribute("src", "img/panneaux_solaire.png");
        }
    }
    
    // Affichage warning HYD
    if (warningHYD)
        document.getElementById("IMGhydrolienne").setAttribute("src", "img/hydrolienne_alerte.gif");
    else document.getElementById("IMGhydrolienne").setAttribute("src", "img/hydrolienne.png");

    for(elmt in HYD){
        if(HYD[elmt].warning){
            document.getElementById("IMGhydrolienne" + elmt).setAttribute("src", "img/hydrolienne_alerte.gif");
        }else{
            document.getElementById("IMGhydrolienne" + elmt).setAttribute("src", "img/hydrolienne.png");
        }
    }

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

    PS = get(data, "electrical.solar");
    EOL = get(data, "electrical.windTurbines");
    HYD = get(data, "electrical.waterTurbines");
    PHG = get(data, "electrical.fuelCells");
    ALT = get(data, "electrical.alternators");
    GE = get(data, "electrical.generators");
    EQP = get(data, "electrical.consumers");
    //console.log(data);

    sommePanneauxSolaires = 0;
    for(solar in PS){
        sommePanneauxSolaires = sommePanneauxSolaires + get(PS[solar], "power.value");
    }
    if (isNaN(sommePanneauxSolaires)) sommePanneauxSolaires = "-";

    sommeEoliennes = 0;
    for(windTurbine in EOL){
        sommeEoliennes = sommeEoliennes + get(EOL[windTurbine], "power.value");
    }
    if (isNaN(sommeEoliennes)) sommeEoliennes = "-";

    sommeHydroliennes = 0;
    for(waterTurbine in HYD){
        sommeHydroliennes = sommeHydroliennes + get(HYD[waterTurbine], "power.value");
    }
    if (isNaN(sommeHydroliennes)) sommeHydroliennes = "-";

    sommeGroupeElectrogene = 0;
    for(generator in GE){
        sommeGroupeElectrogene = sommeGroupeElectrogene + get(GE[generator], "power.value");
    }
    if (isNaN(sommeGroupeElectrogene)) sommeGroupeElectrogene = "-";

    sommeAlternateur = 0;
    for(alternator in ALT){
        sommeAlternateur = sommeAlternateur + get(ALT[alternator], "power.value");
    }
    if (isNaN(sommeAlternateur)) sommeAlternateur = "-";
    
    sommePileHydrogene = 0;
    for(fuelCell in PHG){
        sommePileHydrogene = sommePileHydrogene + get(PHG[fuelCell], "power.value");
    }
    if (isNaN(sommePileHydrogene)) sommePileHydrogene = "-";

    sommeMoteurs = get(data, "moteur.value");

    sommeEquipements = 0;
    for(appareil in EQP){
        sommeEquipements = sommeEquipements - get(EQP[appareil], "power.value");
    }
    if (isNaN(sommeEquipements)) sommeEquipements = "-";

    sommeSources = sommePanneauxSolaires + sommeEoliennes + sommeHydroliennes + sommeGroupeElectrogene + sommeAlternateur + sommePileHydrogene;
    if (isNaN(sommeSources)) sommeSources = "-";

    sommeConsos = sommeMoteurs + sommeEquipements;
    if (isNaN(sommeConsos)) sommeConsos = "-";

    if (isNaN(sommeSources + sommeConsos)){//si pas nombre valide
        sourcesVersConsos    = "-";
        batteriesVersConsos  = "-";
        sourcesVersBatteries = "-";
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
    else 
        document.getElementById("IMGSourcesVersConsos").setAttribute("src", "img/green_arrow_right.png");

    if (batteriesVersConsos == 0)
        document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/grey_arrow_up.png");
    else 
        document.getElementById("IMGBatteriesVersConsos").setAttribute("src", "img/green_arrow_up.png");

    if (sourcesVersBatteries == 0)
        document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/grey_arrow_right.png");
    else 
        document.getElementById("IMGSourcesVersBatteries").setAttribute("src", "img/green_arrow_right.png");

    //Page menu prevision
    forecastPage(data);

    //Page panneaux solaires
    solarPanelsPage(data);

    //Page Eoliennes
    windTurbinesPage(data);

    //Page Hydroliennes
    waterTurbinesPage(data);

    //Page Groupe electrogene
    generatorsPage(data);

    //Page Alternateur
    alternatorsPage(data);

    //Page Pile à hydrogene
    fuelCellsPage(data);

    //Page Equipements
    equipementsPage(data);

    //Page Moteurs
    moteursPage(data);
}

function forecastPage(data){
    document.getElementById("panneauxsolairesPrev").innerHTML = get(data, "electrical.prev.solar.meanPower.value");
    document.getElementById("eoliennesPrev").innerHTML        = get(data, "electrical.prev.windTurbines.meanPower.value");
    document.getElementById("hydroliennesPrev").innerHTML     = get(data, "electrical.prev.waterTurbines.power.value");
    document.getElementById("groupeEletrogenePrev").innerHTML = get(data, "electrical.prev.generators.power.value");
    document.getElementById("alternateurPrev").innerHTML      = get(data, "electrical.prev.alternators.power.value");
    document.getElementById("pilehydrogenePrev").innerHTML    = get(data, "electrical.prev.fuelCells.power.value");

    sommeSourcesPrev = get(data, "electrical.prev.solar.meanPower.value")
                    + get(data, "electrical.prev.windTurbines.meanPower.value")
                    + get(data, "electrical.prev.waterTurbine.power.value")
                    + get(data, "electrical.prev.generators.power.value")
                    + get(data, "electrical.prev.alternators.power.value")
                    + get(data, "electrical.prev.fuelCells.power.value");
    if (isNaN(sommeSourcesPrev)) sommeSourcesPrev = "-";
    document.getElementById("sommeSourcesPrev").innerHTML   = sommeSourcesPrev;
}

function solarPanelsPage(data){
    let pageDiv = document.getElementById("PagePanneauxSolaires");

    let solarPanels = get(data, "electrical.solar");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let solarPanel in solarPanels){

        let element = document.getElementById("panneauSolaire_" + solarPanel);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.solar." + solarPanel + ".name.value") + '</p>' +
                            '<img id="IMGpanneauSolaire' + solarPanel + '" class="icone" src="img/panneaux_solaire.png">' +
                            '</br>' +
                            '<p>Production : <span id="PANProduction' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".power.value") + '</span> W</p>' +
                            '<p>Inclinaison : <span id="PANInclinaison' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".tilt.value") + '</span> °</p>' +
                            '<p>Ensoleillement : <span id="PANEnsoleillement' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".illuminance.value") + '</span> %</p>' +
                            '<p>Temperature : <span id="PANTemperature' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".temperature.value") + '</span> %</p>';
        }else{
            let solarPanelDiv = document.createElement("div"); 
            solarPanelDiv.setAttribute('id', 'panneauSolaire_' + solarPanel);
            solarPanelDiv.setAttribute('class', 'w3-quarter w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            solarPanelDiv.innerHTML = 
                                '<p>' + get(data, "electrical.solar." + solarPanel + ".name.value") + '</p>' +
                                '<img id="IMGpanneauSolaire' + solarPanel + '" class="icone" src="img/panneaux_solaire.png">' +
                                '</br>' +
                                '<p>Production : <span id="PANProduction' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".power.value") + '</span> W</p>' +
                                '<p>Inclinaison : <span id="PANInclinaison' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".tilt.value") + '</span> °</p>' +
                                '<p>Ensoleillement : <span id="PANEnsoleillement' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".illuminance.value") + '</span> %</p>' +
                                '<p>Temperature : <span id="PANTemperature' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".temperature.value") + '</span> %</p>';
            
            if(k%4 == 0) {
                // Si le numero du panneau solaire est un multiple de 4, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(solarPanelDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
}

function windTurbinesPage(data){
    let pageDiv = document.getElementById("PageEoliennes");

    let windTurbines = get(data, "electrical.windTurbines");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let windTurbine in windTurbines){

        let element = document.getElementById("eolienne_" + windTurbine);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.windTurbines." + windTurbine + ".name.value") + '</p>' +
                            '<img id="IMGeolienne' + windTurbine + '" class="icone" src="img/eolienne.png">' +
                            '</br>' +
                            '<p>Production : <span id="EOLProduction' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".power.value") + '</span> W</p>' +
                            '<p>Vitesse : <span id="EOLVitesse' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".windTurbineSpeed.value") + '</span> tr/min</p>';
        }else{
            let windTurbineDiv = document.createElement("div"); 
            windTurbineDiv.setAttribute('id', 'eolienne_' + windTurbine);
            windTurbineDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            windTurbineDiv.innerHTML = 
                            '<p>' + get(data, "electrical.windTurbines." + windTurbine + ".name.value") + '</p>' +
                            '<img id="IMGeolienne' + windTurbine + '" class="icone" src="img/eolienne.png">' +
                            '</br>' +
                            '<p>Production : <span id="EOLProduction' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".power.value") + '</span> W</p>' +
                            '<p>Vitesse : <span id="EOLVitesse' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".windTurbineSpeed.value") + '</span> tr/min</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'éolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(windTurbineDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
    
    document.getElementById("ANMVitesse").innerHTML         = get(data, "environment.wind.speedTrue.value");
}

function waterTurbinesPage(data){
    let pageDiv = document.getElementById("PageHydroliennes");

    let waterTurbines = get(data, "electrical.waterTurbines");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let waterTurbine in waterTurbines){

        let element = document.getElementById("hydrolienne_" + waterTurbine);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.waterTurbines." + waterTurbine + ".name.value") + '</p>' +
                            '<img id="IMGhydrolienne' + waterTurbine + '" class="icone" src="img/hydrolienne.png">' +
                            '</br>' +
                            '<p>Production : <span id="HYDProduction' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".power.value") + '</span> W</p>' +
                            '<p>Vitesse : <span id="HYDVitesse' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".waterTurbineSpeed.value") + '</span> tr/min</p>';
        }else{
            let waterTurbineDiv = document.createElement("div"); 
            waterTurbineDiv.setAttribute('id', 'hydrolienne_' + waterTurbine);
            waterTurbineDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            waterTurbineDiv.innerHTML = 
                            '<p>' + get(data, "electrical.waterTurbines." + waterTurbine + ".name.value") + '</p>' +
                            '<img id="IMGhydrolienne' + waterTurbine + '" class="icone" src="img/hydrolienne.png">' +
                            '</br>' +
                            '<p>Production : <span id="HYDProduction' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".power.value") + '</span> W</p>' +
                            '<p>Vitesse : <span id="HYDVitesse' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".windTurbineSpeed.value") + '</span> tr/min</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'hydrolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(waterTurbineDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
}

function generatorsPage(data){
    let pageDiv = document.getElementById("PageGroupeElectrogene");

    let generators = get(data, "electrical.generators");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let generator in generators){

        let element = document.getElementById("groupeElectrogene_" + generator);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.generators." + generator + ".name.value") + '</p>' +
                            '<img id="IMGGroupeElectrogene' + generator + '" class="icone" src="img/groupe_electrogene.png">' +
                            '</br>' +
                            '<p>Production : <span id="GREProduction' + generator + '">' + get(data, "electrical.generators." + generator + ".power.value") + '</span> W</p>' +
                            '<p>Temperature : <span id="GRETemperature' + generator + '">' + get(data, "electrical.generators." + generator + ".temperature.value") + '</span> °C</p>';
        }else{
            let generatorDiv = document.createElement("div"); 
            generatorDiv.setAttribute('id', 'groupeElectrogene_' + generator);
            generatorDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            generatorDiv.innerHTML = 
                            '<p>' + get(data, "electrical.generators." + generator + ".name.value") + '</p>' +
                            '<img id="IMGGroupeElectrogene' + generator + '" class="icone" src="img/groupe_electrogene.png">' +
                            '</br>' +
                            '<p>Production : <span id="GREProduction' + generator + '">' + get(data, "electrical.generators." + generator + ".power.value") + '</span> W</p>' +
                            '<p>Temperature : <span id="GRETemperature' + generator + '">' + get(data, "electrical.generators." + generator + ".temperature.value") + '</span> °C</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'hydrolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(generatorDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
}

function alternatorsPage(data){
    let pageDiv = document.getElementById("PageAlternateur");

    let alternators = get(data, "electrical.alternators");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let alternator in alternators){

        let element = document.getElementById("alternateur_" + alternator);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.alternators." + alternator + ".name.value") + '</p>' +
                            '<img id="IMGAlternateur' + alternator + '" class="icone" src="img/alternateur.png">' +
                            '</br>' +
                            '<p>Production : <span id="ALTProduction' + alternator + '">' + get(data, "electrical.alternators." + alternator + ".power.value") + '</span> W</p>';
        }else{
            let alternatorDiv = document.createElement("div"); 
            alternatorDiv.setAttribute('id', 'alternateur_' + alternator);
            alternatorDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            alternatorDiv.innerHTML = 
                            '<p>' + get(data, "electrical.alternators." + alternator + ".name.value") + '</p>' +
                            '<img id="IMGAlternateur' + alternator + '" class="icone" src="img/alternateur.png">' +
                            '</br>' +
                            '<p>Production : <span id="ALTProduction' + alternator + '">' + get(data, "electrical.alternators." + alternator + ".power.value") + '</span> W</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'hydrolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(alternatorDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
}

function fuelCellsPage(data){
    let pageDiv = document.getElementById("PagePileHydrogene");

    let fuelCells = get(data, "electrical.fuelCells");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let fuelCell in fuelCells){

        let element = document.getElementById("pileHydrogene_" + fuelCell);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.fuelCells." + fuelCell + ".name.value") + '</p>' +
                            '<img id="IMGPileHydrogene' + fuelCell + '" class="icone" src="img/pilehydrogene.png">' +
                            '</br>' +
                            '<p>Production : <span id="PHDProduction' + fuelCell + '">' + get(data, "electrical.fuelCells." + fuelCell + ".power.value") + '</span> W</p>' +
                            '<p>Temperature : <span id="PHDTemperature' + fuelCell + '">' + get(data, "electrical.fuelCells." + fuelCell + ".temperature.value") + '</span> °C</p>';
        }else{
            let fuelCellDiv = document.createElement("div"); 
            fuelCellDiv.setAttribute('id', 'pileHydrogene_' + fuelCell);
            fuelCellDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            fuelCellDiv.innerHTML = 
                            '<p>' + get(data, "electrical.fuelCells." + fuelCell + ".name.value") + '</p>' +
                            '<img id="IMGPileHydrogene' + fuelCell + '" class="icone" src="img/pilehydrogene.png">' +
                            '</br>' +
                            '<p>Production : <span id="PHDProduction' + fuelCell + '">' + get(data, "electrical.fuelCells." + fuelCell + ".power.value") + '</span> W</p>' +
                            '<p>Temperature : <span id="PHDTemperature' + fuelCell + '">' + get(data, "electrical.fuelCells." + fuelCell + ".temperature.value") + '</span> °C</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'hydrolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(fuelCellDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
}

function moteursPage(data){
    let pageDiv = document.getElementById("PageMoteurs");

    let motors = get(data, "electrical.consumers");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let motor in motors){

        // On ignore les équipements
        if(get(motors[motor], "category.value") != "moteur_electrique"){
            continue;
        }

        let element = document.getElementById("moteur_electrique" + motor);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                            '<p>' + get(data, "electrical.consumers." + motor + ".name.value") + '</p>' +
                            '<img id="IMGMoteur' + motor + '" class="icone" src="img/moteur.png">' +
                            '</br>' +
                            '<p>Consommation : <span id="MOTConsommation' + motor + '">' + get(data, "electrical.consumers." + motor + ".power.value") + '</span> W</p>';
        }else{
            let motorDiv = document.createElement("div"); 
            motorDiv.setAttribute('id', 'moteur_electrique' + motor);
            motorDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            motorDiv.innerHTML = 
                            '<p>' + get(data, "electrical.consumers." + motor + ".name.value") + '</p>' +
                            '<img id="IMGMoteur' + motor + '" class="icone" src="img/moteur.png">' +
                            '</br>' +
                            '<p>Consommation : <span id="MOTConsommation' + motor + '">' + get(data, "electrical.consumers." + motor + ".power.value") + '</span> W</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'hydrolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");
                newLigneDiv.classList.add("ligne");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(motorDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            pageDiv.appendChild(ligneDiv);
        }

        k = k + 1;
    }
}

function equipementsPage(data)
{
    let consumers = get(data, "electrical.consumers");

    for(let appareil in consumers){

        // On ignore les moteurs
        if(get(consumers[appareil], "category.value") == "moteur_electrique"){
            continue;
        }

        // On récupère le div avec le id qui contient le nom de la catégorie
        let div_categorie = document.getElementById(get(consumers[appareil], "category.value"));

        let element = document.getElementById("consumer_" + appareil);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            //Si elle existe on modifie son contenu
            element.innerHTML = get(consumers, appareil + ".name.value") + " : " + '<span id="consumer_'+ appareil +'.span">'+ get(consumers, appareil + ".power.value") +'</span> W';
        }else{
            //Sinon on l'ajoute
            let p = document.createElement("p");
            p.setAttribute('id', "consumer_" + appareil);
            let node = document.createTextNode(get(consumers, appareil + ".name.value") + " : ");
    
            p.appendChild(node);
            p.innerHTML += '<span id="consumer_'+ appareil +'.span">'+ get(consumers, appareil + ".power.value") +'</span> W';
            div_categorie.appendChild(p);
        }
    }
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