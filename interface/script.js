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

        document.getElementById("panneauxsolaires").innerHTML = "+" + obj.data.sources.panneauxSolaires.production + " kW";
        document.getElementById("eoliennes").innerHTML = "+" + obj.data.sources.eoliennes.production + " kW";
        document.getElementById("hydroliennes").innerHTML = "+" + obj.data.sources.hydroliennes.production + " kW";
        document.getElementById("moteur").innerHTML = obj.data.consos.moteur.conso + " kW";
        document.getElementById("equipements").innerHTML = obj.data.consos.equipements.conso + " kW";
        document.getElementById("sommeSources").innerHTML = obj.data.sommes.sommeSources + " kW";
        document.getElementById("sommeConsos").innerHTML = obj.data.sommes.sommeConsos + " kW";
        document.getElementById("sommeTotale").innerHTML = obj.data.sommes.sommeTotale + " kW";

      }
    };
    xhr.send();
  };

  window.setInterval(updateValues, 1000);
  updateValues();
})();




 function panneauSolaire(detailId,Affiche,panneauxSolaire){
    var panneaux_solaire = document.getElementById(panneauxSolaire);  
    //var detail = document.getElementById(detailId);
    var newElement = document.createElement('div');
    if (panneauxSolaire.getAttribute('value')==Affiche)
    {
    var ligne1 = document.createElement('P');
    var ligne2 = document.createElement('P');
    var ligne3 = document.createElement('P');
    var ligne4 = document.createElement('P');
    ligne1.append("Ensoleillement:")
    ligne2.append("Temperature:")
    ligne3.append("Rendement:")
    ligne4.append("Inclinaison:")
    newElement.innerHTML += '<p id="panneau_solaire_ensoleillement">' + ligne1.textContent +'</p>' 
    //+ '<p id="panneau_solaire_temperature">' + ligne2.textContent +'</p>' 
    + '<p id="panneau_solaire_rendement">' + ligne3.textContent +'</p>' 
    + '<p id="panneau_solaire_inclinaison">' + ligne4.textContent +'</p>'
    detailId.appendChild(newElement)
    panneauxSolaire.setAttribute("value","Cacher")
    }
      else 
    {
    var child = detailId.getElementsByTagName("div")[0]
    detailId.removeChild(child)
    panneauxSolaire.setAttribute("value",Affiche)
    }
  }



















