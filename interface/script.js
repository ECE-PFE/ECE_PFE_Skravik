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

        //Page panneaux solaires
        document.getElementById("PSProduction1").innerHTML     = "Production : " + obj.data.sources.panneauSolaire1.production + " kW";
        document.getElementById("PSInclinaison1").innerHTML    = "Inclinaison : " + obj.data.sources.panneauSolaire1.inclinaison + " °";
        document.getElementById("PSRendement1").innerHTML      = "Rendement : " + obj.data.sources.panneauSolaire1.rendement + " %";
        document.getElementById("PSEnsoleillement1").innerHTML = "Ensoleillement : " + obj.data.sources.panneauSolaire1.ensoleillement + " %";

      }
    };
    xhr.send();
  };

  window.setInterval(updateValues, 1000);
  updateValues();
})();