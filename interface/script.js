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


(function () {
  var updateValues = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost/values');

    xhr.onreadystatechange = function () {
      if (xhr.status === 200) {
        const json = xhr.responseText;
        const obj = JSON.parse(json);

        //Page menu
        document.getElementById("panneauxsolaires").innerHTML = "+" + obj.data.sources.panneauxSolaires + " kW";
        document.getElementById("eoliennes").innerHTML        = "+" + obj.data.sources.eoliennes + " kW";
        document.getElementById("hydroliennes").innerHTML     = "+" + obj.data.sources.hydroliennes + " kW";
        document.getElementById("groupeEletrogene").innerHTML = "+" + obj.data.sources.groupeElectrogene.production + " kW";
        document.getElementById("alternateur").innerHTML      = "+" + obj.data.sources.alternateur.production + " kW";
        document.getElementById("moteur").innerHTML           = obj.data.consos.moteur.conso + " kW";
        document.getElementById("equipements").innerHTML      = obj.data.consos.equipements.conso + " kW";
        document.getElementById("sommeSources").innerHTML     = obj.data.sommes.sommeSources + " kW";
        document.getElementById("sommeConsos").innerHTML      = obj.data.sommes.sommeConsos + " kW";
        document.getElementById("sommeTotale").innerHTML      = obj.data.sommes.sommeTotale + " kW";
        document.getElementById("batterie1").innerHTML        = obj.data.batteries.batterie1 + " %";
        document.getElementById("batterie2").innerHTML        = obj.data.batteries.batterie2 + " %";
        document.getElementById("batterie3").innerHTML        = obj.data.batteries.batterie3 + " %";

        //Page panneaux solaires
        document.getElementById("PSProduction1").innerHTML     = "Production : " + obj.data.sources.panneauSolaire1.production + " kW";
        document.getElementById("PSInclinaison1").innerHTML    = "Inclinaison : " + obj.data.sources.panneauSolaire1.inclinaison + " °";
        document.getElementById("PSRendement1").innerHTML      = "Rendement : " + obj.data.sources.panneauSolaire1.rendement + " %";
        document.getElementById("PSEnsoleillement1").innerHTML = "Ensoleillement : " + obj.data.sources.panneauSolaire1.ensoleillement + " %";

        document.getElementById("PSProduction2").innerHTML     = "Production : " + obj.data.sources.panneauSolaire2.production + " kW";
        document.getElementById("PSInclinaison2").innerHTML    = "Inclinaison : " + obj.data.sources.panneauSolaire2.inclinaison + " °";
        document.getElementById("PSRendement2").innerHTML      = "Rendement : " + obj.data.sources.panneauSolaire2.rendement + " %";
        document.getElementById("PSEnsoleillement2").innerHTML = "Ensoleillement : " + obj.data.sources.panneauSolaire2.ensoleillement + " %";

        document.getElementById("PSProduction3").innerHTML     = "Production : " + obj.data.sources.panneauSolaire3.production + " kW";
        document.getElementById("PSInclinaison3").innerHTML    = "Inclinaison : " + obj.data.sources.panneauSolaire3.inclinaison + " °";
        document.getElementById("PSRendement3").innerHTML      = "Rendement : " + obj.data.sources.panneauSolaire3.rendement + " %";
        document.getElementById("PSEnsoleillement3").innerHTML = "Ensoleillement : " + obj.data.sources.panneauSolaire3.ensoleillement + " %";

        document.getElementById("PSProduction4").innerHTML     = "Production : " + obj.data.sources.panneauSolaire4.production + " kW";
        document.getElementById("PSInclinaison4").innerHTML    = "Inclinaison : " + obj.data.sources.panneauSolaire4.inclinaison + " °";
        document.getElementById("PSRendement4").innerHTML      = "Rendement : " + obj.data.sources.panneauSolaire4.rendement + " %";
        document.getElementById("PSEnsoleillement4").innerHTML = "Ensoleillement : " + obj.data.sources.panneauSolaire4.ensoleillement + " %";

        //Page Eoliennes
        document.getElementById("EOLProduction1").innerHTML     = "Production : " + obj.data.sources.eolienne1.production + " kW";
        document.getElementById("EOLVitesse1").innerHTML    = "Vitesse : " + obj.data.sources.eolienne1.vitesse + " m/s";
        document.getElementById("EOLTemperature1").innerHTML      = "Temperature : " + obj.data.sources.eolienne1.temperature + " °C";
        
        document.getElementById("EOLProduction2").innerHTML     = "Production : " + obj.data.sources.eolienne2.production + " kW";
        document.getElementById("EOLVitesse2").innerHTML    = "Vitesse : " + obj.data.sources.eolienne2.vitesse + " m/s";
        document.getElementById("EOLTemperature2").innerHTML      = "Temperature : " + obj.data.sources.eolienne2.temperature + " °C";

        //Page Hydroliennes
        document.getElementById("HYDProduction1").innerHTML     = "Production : " + obj.data.sources.hydrolienne1.production + " kW";
        document.getElementById("HYDVitesse1").innerHTML    = "Vitesse : " + obj.data.sources.hydrolienne1.vitesse + " m/s";
        document.getElementById("HYDTemperature1").innerHTML      = "Temperature : " + obj.data.sources.hydrolienne1.temperature + " °C";
        
        document.getElementById("HYDProduction2").innerHTML     = "Production : " + obj.data.sources.hydrolienne2.production + " kW";
        document.getElementById("HYDVitesse2").innerHTML    = "Vitesse : " + obj.data.sources.hydrolienne2.vitesse + " m/s";
        document.getElementById("HYDTemperature2").innerHTML      = "Temperature : " + obj.data.sources.hydrolienne2.temperature + " °C";

      }
    };
    xhr.send();
  };

  window.setInterval(updateValues, 1000);
  updateValues();
})();