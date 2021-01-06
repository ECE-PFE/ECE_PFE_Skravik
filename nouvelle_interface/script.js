function panneauSolairePage() {
  alert("panneau solaire cliqué");
}

function eoliennesPage() {
  alert("eolienne cliquée");
}

function hydroliennesPage() {
  alert("hydrolienne cliquée");
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
        
      }
    };
    xhr.send();
  };

  window.setInterval(updateValues, 1000);
  updateValues();
})();