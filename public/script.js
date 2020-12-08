
  function panneauSolaire(){

    var triple_fleche = document.getElementById('triple_fleche');   
    var panneaux_solaire = document.getElementById('panneaux_solaire');
    var eolienne = document.getElementById('eolienne');   
    var hydro = document.getElementById('hydro');     
    var div1 = document.getElementById('div1');   
    var newElement = document.createElement('div');
    newElement.style.marginTop = "10px";

    if (panneaux_solaire.getAttribute('value')=="Afficher1")
    {
    //triple_fleche.style.display="none";
    document.getElementById("sans").style.display = "none";
    var ligne1 = "Ensoleillement:"
    var ligne2 = "Temperature:"
    var ligne3 =  "Rendement:"
    var ligne4 =  "Inclinaison:"
    newElement.innerHTML += ligne1 + '<br/>' 
                            + ligne2+  '<br/>'
                            + ligne3 + '<br/>'
                            + ligne4;

      div1.appendChild(newElement)
      panneaux_solaire.setAttribute("value","Cacher1")

      // Affichage de la bonne image des fleches triples

      if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Afficher3" )
      {
        console.log("il y a que le détail du premier")
        //triple_fleche.style.display="none";
        triple_fleche.setAttribute('src',"img/triple_fleche_verte_1.png")
        triple_fleche.setAttribute('height',"380px")

      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du premier et du deuxieme")
      }

       else if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du premier et du troisieme")
      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Cacher3")
      {
        //triple_fleche.setAttribute('src',"img/triple_fleche_verte_123.png")
        //triple_fleche.setAttribute('height',"450px")
        console.log("il y a que le détail de tout")
      }

      }
      else 
    {

    document.getElementById("sans").style.display = "block";
    var child = div1.getElementsByTagName("div")[0]
    div1.removeChild(child)
    panneaux_solaire.setAttribute("value","Afficher1")

     if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Afficher3" )
      {
        console.log("il y a R")
        triple_fleche.setAttribute('src',"img/test7.png")
        triple_fleche.setAttribute('height',"300px")

      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du deuxieme")
      }

       else if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du troisieme")
      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Cacher3")
      {
        console.log("il y a que le détail du deuxieme et du troisieme")
      }



    }
  }



  function Eolienne(){
    
    var panneaux_solaire = document.getElementById('panneaux_solaire');
    var eolienne = document.getElementById('eolienne');   
    var hydro = document.getElementById('hydro');    
    var div2 = document.getElementById('div2');   
    var newElement = document.createElement('div');
    newElement.style.marginTop = "10px";

    if (eolienne.getAttribute('value')=="Afficher2")
    {
    document.getElementById("sans2").style.display = "none";
    var ligne1 = "Vent:"
    var ligne2 = "Temperature:"
    var ligne3 =  "Rendement:"
    newElement.innerHTML += ligne1 + '<br/>' 
                            + ligne2+  '<br/>'
                            + ligne3;
      div2.appendChild(newElement)
      eolienne.setAttribute("value","Cacher2")


      if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Afficher3" )
      {
        console.log("il y a que le détail du deuxieme")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du premier et du deuxieme")
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du deuxieme et du troisieme")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Cacher3")
      {
        //triple_fleche.setAttribute('src',"img/triple_fleche_verte_123.png")
        //triple_fleche.setAttribute('height',"450px")
        console.log("il y a que le détail de tout")
      }


      }
      else 
    {
    document.getElementById("sans2").style.display = "block";
    var child = div2.getElementsByTagName("div")[0]
    div2.removeChild(child)
    eolienne.setAttribute("value","Afficher2")

     if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Afficher3" )
      {
        console.log("il y a R")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du premier")
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du troisieme")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Cacher3")
      {
        console.log("il y a que le détail du premier et du troisieme")
      }


    }
  }


 function Hydro(){
    var panneaux_solaire = document.getElementById('panneaux_solaire');
    var eolienne = document.getElementById('eolienne');   
    var hydro = document.getElementById('hydro'); 
    var div3 = document.getElementById('div3');   
    var newElement = document.createElement('div');
    newElement.style.marginTop = "10px";

    if (hydro.getAttribute('value')=="Afficher3")
    {
    var ligne1 = "Courant:"
    var ligne2 = "Temperature:"
    var ligne3 =  "Rendement:"
    newElement.innerHTML += ligne1 + '<br/>' 
                            + ligne2+  '<br/>'
                            + ligne3;
      div3.appendChild(newElement)
      hydro.setAttribute("value","Cacher3")

      if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Afficher2" )
      {
        console.log("il y a que le détail du troisieme")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Afficher2")
      {
          console.log("il y a que le détail du premier et du troisieme")
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Cacher2")
      {
          console.log("il y a que le détail du deuxieme et du troisieme")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Cacher2")
      {
        //triple_fleche.setAttribute('src',"img/triple_fleche_verte_123.png")
        //triple_fleche.setAttribute('height',"460px")
        console.log("il y a que le détail de tout")
      }



      }
      else 
    {
    var child = div3.getElementsByTagName("div")[0]
    div3.removeChild(child)
    hydro.setAttribute("value","Afficher3")

      if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Afficher2" )
      {
        console.log("il y a R")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Afficher2")
      {
          console.log("il y a que le détail du premier")
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Cacher2")
      {
          console.log("il y a que le détail du deuxieme ")
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Cacher2")
      {
        console.log("il y a que le détail du premier et du deuxieme")
      }

    }
  }


 function Electric(){
  
    var electric = document.getElementById('electric');   
    var div4 = document.getElementById('div4');   
    var newElement = document.createElement('div');
    newElement.style.marginLeft = "170px";

    if (electric.getAttribute('value')=="Afficher")
    {
    document.getElementById("sans3").style.display = "none";
    var ligne1 = "Conso:"
    newElement.innerHTML += ligne1 
      div4.appendChild(newElement)
      electric.setAttribute("value","Cacher")
      }
      else 
    {
    document.getElementById("sans3").style.display = "block";
    var child = div4.getElementsByTagName("div")[0]
    div4.removeChild(child)
    electric.setAttribute("value","Afficher")
    }
  }

  function Moteur(){
    var moteur = document.getElementById('moteur');   
    var div5 = document.getElementById('div5');   
    var newElement = document.createElement('div');
    newElement.style.marginLeft = "170px";

    if (moteur.getAttribute('value')=="Afficher")
    {
    var ligne1 = "Courant:"
    newElement.innerHTML += ligne1 
      div5.appendChild(newElement)
      moteur.setAttribute("value","Cacher")
      }
      else 
    {
    var child = div5.getElementsByTagName("div")[0]
    div5.removeChild(child)
    moteur.setAttribute("value","Afficher")
    }
  }



(function(){
    var updateValues = function() {
    var xhr = new XMLHttpRequest(); 
    xhr.open('GET', 'http://localhost/values');

    xhr.onreadystatechange = function() {
      if (xhr.status === 200) {
        const json = xhr.responseText;
        const obj = JSON.parse(json);
        document.getElementById("panneausolaire").innerHTML = obj.data.sources.panneauxSolaires.production + " kW";
        document.getElementById("eoliennes").innerHTML = obj.data.sources.eoliennes.production + " kW";
        document.getElementById("hydroliennes").innerHTML = obj.data.sources.hydroliennes.production + " kW";
        document.getElementById("moteur").innerHTML = obj.data.consos.moteur.conso + " kW";
        document.getElementById("equipements").innerHTML = obj.data.consos.equipements.conso + " kW";
        document.getElementById("sommesources").innerHTML = obj.data.sommes.sommeSources + " kW";
        document.getElementById("sommeconsos").innerHTML = obj.data.sommes.sommeConsos + " kW";
        document.getElementById("sommetotale").innerHTML = obj.data.sommes.sommeTotale + " kW";
        }
    };
    xhr.send();
   };

   window.setInterval(updateValues, 1000);
   updateValues();
})();






















 