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
  [0,  200, 200,   "Prod panneau solaire minimale"],
  [0,  100, 100,   "Seuil batterie faible"]
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

    let sourcesTotales = sommeSources;
    let consosTotales = sommeConsos;
    let prodVersBat = sourcesVersBatteries;

    let chargeBat1 = get(data,"electrical.batteries.0.capacity.stateOfCharge.value");// a changer pour la charge totale ?

    let ventMax = localStorage.getItem('settingsVal0');
    let tempMaxPS = localStorage.getItem('settingsVal1');
    let consoMaxEquip = localStorage.getItem('settingsVal2');
    let prodMinPS = localStorage.getItem('settingsVal3');
    let seuilMinBatteries = localStorage.getItem('settingsVal4');

    let vitBateau = get(data, "navigation.speedThroughWater.value");
    let consoEquip = sommeEquipements;

    let warning = false;
    let warningEOL = false;
    let warningPS = false;
    let warningHYD = false;
    let warningPHG = false;
    let warningGE = false;
    let warningALT = false;

    //Verification de chaque alerte possible

    //Verification alertes EOL
    warningHide("pbProdEol");
    for(let elmt in EOL) {
        EOL[elmt].warning = false;
        if (vitesseVent > 2.5 && get(EOL[elmt],"power.value") == 0 && vitesseVent < ventMax)
        {
            warningShow("pbProdEol");
            warning = true;
            warningEOL = true;
            EOL[elmt].warning = true;
        }
    }

    if (sourcesTotales < - consosTotales)
        {warningShow("pbConsoVSProd");warning=true;}
    else warningHide("pbConsoVSProd");

    if (vitesseVent > ventMax)
        {warningShow("tropDeVent");warning=true;warningEOL=true;}
    else warningHide("tropDeVent");

    if (sourcesTotales > consosTotales && prodVersBat == 0 && chargeBat1 == 1){
        warningShow("pbChargeBat");
        warning=true;
    }else{
        warningHide("pbChargeBat");
    }

    //Verification alertes PS
    warningHide("chauffePS");
    warningHide("surchauffePS");
    warningHide("pbProdPS");
    for(let elmt in PS){
        PS[elmt].warning = false;
        if (get(PS[elmt],"temperature.value") > tempMaxPS){
            warningShow("chauffePS");
            warning=true;
            warningPS=true;
            PS[elmt].warning = true;
        }

        if (get(PS[elmt],"temperature.value") > 85){
            warningShow("surchauffePS");
            warning=true;
            warningPS=true;
            PS[elmt].warning = true;
        }

        if (get(PS[elmt],"power.value") < prodMinPS && get(PS[elmt],"irradiance.value") > 200){
            warningShow("pbProdPS");
            warning=true;
            warningPS=true;
            PS[elmt].warning = true;
        }

    }

    //Verification alertes HYD
    warningHide("pbVitHYD");
    for(let elmt in HYD){
        if (vitBateau > 10 && get(HYD[elmt], "isUnderWater.value"))
        {
            warningShow("pbVitHYD");
            warning=true;
            warningHYD=true;
            HYD[elmt].warning = true;
        }
            
    }

    //Verification alertes PHG
    warningHide("surchauffePileHG");
    warningHide("tropFroidPileHG");
    warningHide("pbConsoPileHG");
    warningHide("pbProdPileHG");
    for(let elmt in PHG){
        if (get(PHG[elmt], "temperature.value") > 45){
            warningShow("surchauffePileHG");
            warning=true;
            warningPHG=true;
            PHG[elmt].warning = true;
        }

        if (get(PHG[elmt], "temperature.value") < 5){
            warningShow("tropFroidPileHG");
            warning=true;
            warningPHG=true;
            PHG[elmt].warning = true;
        }

        /*if (tensionPileHG < 52 || tensionPileHG > 80){
            warningShow("pbProdPileHG");
            warning=true;
            warningPHG=true;
            PHG[elmt].warning = true;
        }
        else warningHide("pbProdPileHG");*/

        if (get(PHG[elmt], "fuelConsumption.value") > 65){
            warningShow("pbConsoPileHG");
            warning=true;
            warningPHG=true;
            PHG[elmt].warning = true;
        }
    }

    if (consoEquip > consoMaxEquip){
        warningShow("pbConsosEquip");
        warning=true;
    }else 
        warningHide("pbConsosEquip");

    warningHide("pbBattFaible");
    for(let elmt in BATTERY){
        if (get(BATTERY[elmt], "charge.value") < seuilMinBatteries){
            warningShow("pbBattFaible");
            warning=true;
            BATTERY[elmt].warning=true;
        }
    }

    ////////////////////////////////
    ///  Changement des icones   ///
    ////////////////////////////////
    if (warning || warningEOL || warningPS || warningHYD || warningPHG || warningALT || warningGE){
        document.getElementById("warningImg").setAttribute("src", "img/warning.gif");
        warningHide("warningOK");
    }else {
        document.getElementById("warningImg").setAttribute("src", "img/green_check.png");
        warningShow("warningOK");
    }

    // Affichage warning batteries
    for(let elmt in BATTERY){
        if(BATTERY[elmt].warning){
            document.getElementById("IMGbatterie" + elmt).setAttribute("src", "img/batterie_alerte.gif");
        }else{
            document.getElementById("IMGbatterie" + elmt).setAttribute("src", "img/batterie.png");
        }
    }

    // Affichage warning EOL
    if (warningEOL)
        document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne_alerte.gif");
    else document.getElementById("IMGeolienne").setAttribute("src", "img/eolienne.png");

    for(let elmt in EOL){
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

    for(let elmt in PS){
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

    for(let elmt in HYD){
        if(HYD[elmt].warning){
            document.getElementById("IMGhydrolienne" + elmt).setAttribute("src", "img/hydrolienne_alerte.gif");
        }else{
            document.getElementById("IMGhydrolienne" + elmt).setAttribute("src", "img/hydrolienne.png");
        }
    }

    // Affichage warning PHG
    if (warningPHG)
        document.getElementById("IMGpileHydrogene").setAttribute("src", "img/pilehydrogene_alerte.gif");
    else document.getElementById("IMGpileHydrogene").setAttribute("src", "img/pilehydrogene.png");

    for(let elmt in PHG){
        if(PHG[elmt].warning){
            document.getElementById("IMGpileHydrogene" + elmt).setAttribute("src", "img/pilehydrogene_alerte.gif");
        }else{
            document.getElementById("IMGpileHydrogene" + elmt).setAttribute("src", "img/pilehydrogene.png");
        }
    }

    // Affichage warning ALT
    if (warningALT)
        document.getElementById("IMGalternateur").setAttribute("src", "img/alternateur_alerte.gif");
    else document.getElementById("IMGalternateur").setAttribute("src", "img/alternateur.png");

    for(let elmt in ALT){
        if(ALT[elmt].warning){
            document.getElementById("IMGalternateur" + elmt).setAttribute("src", "img/alternateur_alerte.gif");
        }else{
            document.getElementById("IMGalternateur" + elmt).setAttribute("src", "img/alternateur.png");
        }
    }

    // Affichage warning GE
    if (warningGE)
        document.getElementById("IMGgroupe_electrogene").setAttribute("src", "img/groupe_electrogene_alerte.gif");
    else document.getElementById("IMGgroupe_electrogene").setAttribute("src", "img/groupe_electrogene.png");

    for(let elmt in GE){
        if(GE[elmt].warning){
            document.getElementById("IMGgroupe_electrogene" + elmt).setAttribute("src", "img/hydrolienne_alerte.gif");
        }else{
            document.getElementById("IMGgroupe_electrogene" + elmt).setAttribute("src", "img/hydrolienne.png");
        }
    }
}

function minBatteries(){
    let min=100;

    for(let battery in BATTERY){
        let val = get(BATTERY[battery], "electrical.batteries." + battery + ".charge.value");
        if (val<min) min=val;
    }

    return min;
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
    BATTERY = get(data, "electrical.batteries");

    EQP = JSON.parse(JSON.stringify(get(data, "electrical.consumers"))); // Astuce pour obtenir une copie de l'objet au lieu de récupérer sa référence
    for(let eqp in EQP){
        if(get(EQP[eqp], "category.value") == "moteur_electrique"){
            delete EQP[eqp];
        }
    }

    MOT = JSON.parse(JSON.stringify(get(data, "electrical.consumers"))); // Astuce pour obtenir une copie de l'objet au lieu de récupérer sa référence
    for(let mot in MOT){
        if(get(MOT[mot], "category.value") != "moteur_electrique"){
            delete MOT[mot];
        }
    }

    sommePanneauxSolaires = 0;
    for(let solar in PS){
        sommePanneauxSolaires = sommePanneauxSolaires + get(PS[solar], "power.value");
    }
    if (isNaN(sommePanneauxSolaires)) sommePanneauxSolaires = "-";

    sommeEoliennes = 0;
    for(let windTurbine in EOL){
        sommeEoliennes = sommeEoliennes + get(EOL[windTurbine], "power.value");
    }
    if (isNaN(sommeEoliennes)) sommeEoliennes = "-";

    sommeHydroliennes = 0;
    for(let waterTurbine in HYD){
        sommeHydroliennes = sommeHydroliennes + get(HYD[waterTurbine], "power.value");
    }
    if (isNaN(sommeHydroliennes)) sommeHydroliennes = "-";

    sommeGroupeElectrogene = 0;
    for(let generator in GE){
        sommeGroupeElectrogene = sommeGroupeElectrogene + get(GE[generator], "power.value");
    }
    if (isNaN(sommeGroupeElectrogene)) sommeGroupeElectrogene = "-";

    sommeAlternateur = 0;
    for(let alternator in ALT){
        sommeAlternateur = sommeAlternateur + get(ALT[alternator], "power.value");
    }
    if (isNaN(sommeAlternateur)) sommeAlternateur = "-";
    
    sommePileHydrogene = 0;
    for(let fuelCell in PHG){
        sommePileHydrogene = sommePileHydrogene + (get(PHG[fuelCell], "power.value") == "-")?0:get(PHG[fuelCell], "power.value");
    }
    if (isNaN(sommePileHydrogene)) sommePileHydrogene = "-";

    sommeMoteurs = 0;
    for(let motor in MOT){
        sommeMoteurs = sommeMoteurs - get(MOT[motor], "power.value");
    }
    if (isNaN(sommeMoteurs)) sommeMoteurs = "-";

    sommeEquipements = 0;
    for(let appareil in EQP){
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

    //Panneau Batteries
    batteriesPanel(data);
}

function forecastPage(data){
    prodChart.data.datasets[0].data = get(data, "electrical.prev.windTurbines.produceTomorrow.hourly.value");
    prodChart.data.datasets[1].data = get(data, "electrical.prev.solar.produceTomorrow.hourly.value");
    prodChart.update();

    document.getElementById("panneauxsolairesPrev").innerHTML = get(data, "electrical.prev.solar.meanPowerTomorrow.value");
    document.getElementById("eoliennesPrev").innerHTML        = get(data, "electrical.prev.windTurbines.meanPowerTomorrow.value");

    sommeSourcesPrev = 0;
    sommeSourcesPrev = get(data, "electrical.prev.solar.meanPowerTomorrow.value") + 
                        get(data, "electrical.prev.windTurbines.meanPowerTomorrow.value");
    if (isNaN(sommeSourcesPrev)) sommeSourcesPrev = "-";

    document.getElementById("sommeSourcesPrev").innerHTML = sommeSourcesPrev;
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
                            '<p>Ensoleillement : <span id="PANEnsoleillement' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".irradiance.value") + '</span> W/m²</p>' +
                            '<p>Temperature : <span id="PANTemperature' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".temperature.value") + '</span> °C</p>';
        }else{
            let solarPanelDiv = document.createElement("div"); 
            solarPanelDiv.setAttribute('id', 'panneauSolaire_' + solarPanel);
            solarPanelDiv.setAttribute('class', 'w3-quarter w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            solarPanelDiv.innerHTML = 
                                '<p>' + get(data, "electrical.solar." + solarPanel + ".name.value") + '</p>' +
                                '<img id="IMGpanneauSolaire' + solarPanel + '" class="icone" src="img/panneaux_solaire.png">' +
                                '</br>' +
                                '<p>Production : <span id="PANProduction' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".power.value") + '</span> W</p>' +
                                '<p>Ensoleillement : <span id="PANEnsoleillement' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".irradiance.value") + '</span> W/m²</p>' +
                                '<p>Temperature : <span id="PANTemperature' + solarPanel + '">' + get(data, "electrical.solar." + solarPanel + ".temperature.value") + '</span> °C</p>';
            
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
                            '<p>Vitesse : <span id="EOLVitesse' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".speed.value") + '</span> tr/min</p>';
        }else{
            let windTurbineDiv = document.createElement("div"); 
            windTurbineDiv.setAttribute('id', 'eolienne_' + windTurbine);
            windTurbineDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            windTurbineDiv.innerHTML = 
                            '<p>' + get(data, "electrical.windTurbines." + windTurbine + ".name.value") + '</p>' +
                            '<img id="IMGeolienne' + windTurbine + '" class="icone" src="img/eolienne.png">' +
                            '</br>' +
                            '<p>Production : <span id="EOLProduction' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".power.value") + '</span> W</p>' +
                            '<p>Vitesse : <span id="EOLVitesse' + windTurbine + '">' + get(data, "electrical.windTurbines." + windTurbine + ".speed.value") + '</span> tr/min</p>';
            
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
                            '<p>Vitesse : <span id="HYDVitesse' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".speed.value") + '</span> tr/min</p>';
        }else{
            let waterTurbineDiv = document.createElement("div"); 
            waterTurbineDiv.setAttribute('id', 'hydrolienne_' + waterTurbine);
            waterTurbineDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            waterTurbineDiv.innerHTML = 
                            '<p>' + get(data, "electrical.waterTurbines." + waterTurbine + ".name.value") + '</p>' +
                            '<img id="IMGhydrolienne' + waterTurbine + '" class="icone" src="img/hydrolienne.png">' +
                            '</br>' +
                            '<p>Production : <span id="HYDProduction' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".power.value") + '</span> W</p>' +
                            '<p>Vitesse : <span id="HYDVitesse' + waterTurbine + '">' + get(data, "electrical.waterTurbines." + waterTurbine + ".speed.value") + '</span> tr/min</p>';
            
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
                            '<img id="IMGgroupe_electrogene' + generator + '" class="icone" src="img/groupe_electrogene.png">' +
                            '</br>' +
                            '<p>Production : <span id="GREProduction' + generator + '">' + get(data, "electrical.generators." + generator + ".power.value") + '</span> W</p>' +
                            '<p>Temperature : <span id="GRETemperature' + generator + '">' + get(data, "electrical.generators." + generator + ".temperature.value") + '</span> °C</p>';
        }else{
            let generatorDiv = document.createElement("div"); 
            generatorDiv.setAttribute('id', 'groupeElectrogene_' + generator);
            generatorDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            generatorDiv.innerHTML = 
                            '<p>' + get(data, "electrical.generators." + generator + ".name.value") + '</p>' +
                            '<img id="IMGgroupe_electrogene' + generator + '" class="icone" src="img/groupe_electrogene.png">' +
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
                            '<img id="IMGalternateur' + alternator + '" class="icone" src="img/alternateur.png">' +
                            '</br>' +
                            '<p>Production : <span id="ALTProduction' + alternator + '">' + get(data, "electrical.alternators." + alternator + ".power.value") + '</span> W</p>';
        }else{
            let alternatorDiv = document.createElement("div"); 
            alternatorDiv.setAttribute('id', 'alternateur_' + alternator);
            alternatorDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            alternatorDiv.innerHTML = 
                            '<p>' + get(data, "electrical.alternators." + alternator + ".name.value") + '</p>' +
                            '<img id="IMGalternateur' + alternator + '" class="icone" src="img/alternateur.png">' +
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
                            '<img id="IMGpileHydrogene' + fuelCell + '" class="icone" src="img/pilehydrogene.png">' +
                            '</br>' +
                            '<p>Production : <span id="PHDProduction' + fuelCell + '">' + get(data, "electrical.fuelCells." + fuelCell + ".power.value") + '</span> W</p>' +
                            '<p>Temperature : <span id="PHDTemperature' + fuelCell + '">' + get(data, "electrical.fuelCells." + fuelCell + ".temperature.value") + '</span> °C</p>';
        }else{
            let fuelCellDiv = document.createElement("div"); 
            fuelCellDiv.setAttribute('id', 'pileHydrogene_' + fuelCell);
            fuelCellDiv.setAttribute('class', 'w3-container w3-border w3-round-xlarge w3-pale-green w3-border-green case');

            fuelCellDiv.innerHTML = 
                            '<p>' + get(data, "electrical.fuelCells." + fuelCell + ".name.value") + '</p>' +
                            '<img id="IMGpileHydrogene' + fuelCell + '" class="icone" src="img/pilehydrogene.png">' +
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
        if(div_categorie === null){
            continue;
        }

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

function batteriesPanel(data){
    let panelDiv = document.getElementById("batteriesPanel");

    let batteries = get(data, "electrical.batteries");

    let ligneDiv; // Stocke le bloc de la ligne actuelle
    let k = 0; // Compteur de panneaux solaires disponibles
    for(let battery in batteries){

        let element = document.getElementById("divBatterie" + battery);

        //On vérifie si un bloc p avec l'id contenant le numéro de l'appareil existe ou non
        if(typeof(element) != 'undefined' && element != null){
            ligneDiv = element.parentNode;

            element.innerHTML = 
                        '<p><strong>' + get(data, "electrical.batteries." + battery + ".name.value") + '</strong></p>' +
                        '<img id="IMGbatterie' + battery + '" class="icone" src="img/batterie.png">' +
                        '<p><span id="batterie' + battery + '">' + get(data, "electrical.batteries." + battery + ".charge.value") + '</span> %</p>';
        }else{
            let batterieDiv = document.createElement("div"); 
            batterieDiv.setAttribute('id', 'divBatterie' + battery);
            batterieDiv.setAttribute('class', 'w3-third w3-container');

            batterieDiv.innerHTML = 
                '<p><strong>' + get(data, "electrical.batteries." + battery + ".name.value") + '</strong></p>' +
                '<img id="IMGbatterie' + battery + '" class="icone" src="img/batterie.png">' +
                '<p><span id="batterie' + battery + '">' + get(data, "electrical.batteries." + battery + ".charge.value") + '</span> %</p>';
            
            if(k%3 == 0) {
                // Si le numero de l'hydrolienne est un multiple de 3, on crée une nouvelle ligne
                let newLigneDiv = document.createElement("div");
                newLigneDiv.classList.add("w3-col");

                // La ligne actuelle devient la nouvelle ligne fraichement créée
                ligneDiv = newLigneDiv;
            }

            ligneDiv.appendChild(batterieDiv);

            // On ajoute le nouveau bloc dans la ligne actuelle
            panelDiv.appendChild(batterieDiv);
        }

        k = k + 1;
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
  showSaved();
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

function showSaved() {
    $("#saved").show();
    setTimeout(hideSaved, 1000);
}

function hideSaved() {
    $("#saved").fadeOut();
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

function showMsgMap() {
    $("#msgMap").show();
    setTimeout(hideMsgMap, 3000);
}

function hideMsgMap() {
    $("#msgMap").fadeOut();
}

function initMap(){
    // Créer l'objet "map" et l'insèrer dans l'élément HTML qui a l'ID "map"
    map = L.map('map').setView([46.76761686478674, 2.7685546875000004], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", { 
        attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
        minZoom: 1,
        maxZoom: 20
    }).addTo(map);

    let theMarker = {};

    map.on('click',function(e){
        showMsgMap();
        let lat = e.latlng.lat;
        let lon = e.latlng.lng;

        //Clear existing marker, 
        if (theMarker != undefined) {
                map.removeLayer(theMarker);
        };

        //Add a marker to show where you clicked.
        theMarker = L.marker([lat,lon]).addTo(map);

        let msg = [
            {
                "path" : "navigation.tomorrow.position",
                "value": {
                    "latitude" : lat,
                    "longitude" : lon
                }
            }
        ];

        document.getElementById('inlineFormLatitude').value = lat
        document.getElementById('inlineFormLongitude').value = lon;


        let oReq = new XMLHttpRequest();
        oReq.open("POST", "/skServer/plugins/skravik-admin-plugin/api");
        oReq.setRequestHeader("Content-Type", "application/json");
        oReq.send(JSON.stringify(msg));
    });

    let buttonSubmit = document.getElementById('inlineFormSubmitButton');
    buttonSubmit.onclick = function() {
        showMsgMap();
        let lat = document.getElementById('inlineFormLatitude').value;
        let lon = document.getElementById('inlineFormLongitude').value;

        //Vérification latitude et longitude correctes
        if(lat < -90 || lat > 90 || lon < -180 || lon > 180)
            return;

        //Clear existing marker, 
        if (theMarker != undefined) {
                map.removeLayer(theMarker);
        };

        //Add a marker to show where you clicked.
        theMarker = L.marker([lat,lon]).addTo(map);

        let msg = [
            {
                "path" : "navigation.tomorrow.position",
                "value": {
                    "latitude" : lat,
                    "longitude" : lon
                }
            }
        ];


        let oReq = new XMLHttpRequest();
        oReq.open("POST", "/skServer/plugins/skravik-admin-plugin/api");
        oReq.setRequestHeader("Content-Type", "application/json");
        oReq.send(JSON.stringify(msg));
    }
}

$(document).ready(function(){
    initMap();
    fetchDataFromRestApi();

    var ctx1 = document.getElementById('previsionChart').getContext('2d');
    prodChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: [...Array(48).keys()].map(k => "+" + (k+1)),
            datasets: [{
                label: 'Production horaire eolien',
                data: [],
                backgroundColor: 'rgba(132, 99, 255, 0.5)',
                borderColor: 'rgba(132, 99, 255, 1)',
                borderWidth: 1
            },
            {
                label: 'Production horaire solaire',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Energie produite (kWh)"
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],

                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Temps (h)"
                    }
                }]
            }
        }
    });

});