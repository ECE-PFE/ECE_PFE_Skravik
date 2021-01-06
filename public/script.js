
  function panneauSolaire(){

    var triple_fleche = document.getElementById('triple_fleche');   
    var panneaux_solaire = document.getElementById('panneaux_solaire');
    var eolienne = document.getElementById('eolienne');   
    var hydro = document.getElementById('hydro');     
    var div1 = document.getElementById('div1');   
    var newElement = document.createElement('div');
    //logo
    var rectangle_base = document.getElementById('rectangle_base');
    var rectangle_fleche= document.getElementById('rectangle_fleche');
    var arrow_box= document.getElementById('arrow_box');
    var rectangle_fleche2= document.getElementById('rectangle_fleche2');
    var rectangle_fleche3= document.getElementById('rectangle_fleche3');

    newElement.style.marginTop = "10px";


    if (panneaux_solaire.getAttribute('value')=="Afficher1")
    {
    //triple_fleche.style.display="none";
    document.getElementById("sans").style.display = "none";

    var ligne1 = document.createElement('P');
    var ligne2 = document.createElement('P');
    var ligne3 = document.createElement('P');
    var ligne4 = document.createElement('P');

    ligne1.append("Ensoleillement:")
    ligne2.append("Temperature:")
    ligne3.append("Rendement:")
    ligne4.append("Inclinaison:")

    //var ligne1 = "Ensoleillement:"
    //var ligne2 = "Temperature:"
    //var ligne3 =  "Rendement:"
    //var ligne4 =  "Inclinaison:"
    newElement.innerHTML += '<p id="panneau_solaire_ensoleillement">' + ligne1.textContent +'</p>' 
    //+ '<p id="panneau_solaire_temperature">' + ligne2.textContent +'</p>' 
    + '<p id="panneau_solaire_rendement">' + ligne3.textContent +'</p>' 
    + '<p id="panneau_solaire_inclinaison">' + ligne4.textContent +'</p>'

      div1.appendChild(newElement)
      panneaux_solaire.setAttribute("value","Cacher1")

      // Affichage de la bonne image des fleches triples

      if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Afficher3" )
      {
        console.log("il y a que le détail du premier")
        rectangle_base.style.height = "320px";
        rectangle_fleche.style.top = "-328px"
        arrow_box.style.top = "-324.5px";
        rectangle_fleche2.style.top ="-160px";

      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du premier et du deuxieme")
          rectangle_base.style.height = "355px";
          rectangle_fleche.style.top = "-363px";
          arrow_box.style.top = "-359.5px";
          rectangle_fleche2.style.top ="-190px";
      }

       else if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du premier et du troisieme")
          rectangle_base.style.height = "320px";
          rectangle_fleche.style.top = "-328px"
          arrow_box.style.top = "-324.5px";
          rectangle_fleche2.style.top ="-160px";
      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Cacher3")
      {
        //triple_fleche.setAttribute('src',"img/triple_fleche_verte_123.png")
        //triple_fleche.setAttribute('height',"450px")
        console.log("il y a que le détail de tout")
        rectangle_base.style.height = "355px";
        rectangle_fleche.style.top = "-363px";
        arrow_box.style.top = "-359.5px";
        rectangle_fleche2.style.top ="-190px";
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
        console.log("il y a R1")
        rectangle_base.style.height = "265px";
        rectangle_fleche.style.top = "-273px"
        arrow_box.style.top = "-269.5px";
        rectangle_fleche2.style.top ="-160px";



      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du deuxieme")
          rectangle_base.style.height = "295px";
          rectangle_fleche.style.top = "-303px"
          arrow_box.style.top = "-299.5px";
          rectangle_fleche2.style.top ="-190px";      }

       else if(eolienne.getAttribute('value')=="Afficher2" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du troisieme")
          rectangle_base.style.height = "265px";
        rectangle_fleche.style.top = "-273px"
        arrow_box.style.top = "-269.5px";
        rectangle_fleche2.style.top ="-160px";
      }

      else if(eolienne.getAttribute('value')=="Cacher2" && hydro.getAttribute('value')=="Cacher3")
      {
        console.log("il y a que le détail du deuxieme et du troisieme")
        rectangle_base.style.height = "295px";
        rectangle_fleche.style.top = "-303px"
        arrow_box.style.top = "-299.5px";
        rectangle_fleche2.style.top ="-190px";
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
    var ligne1 = document.createElement('P');
    var ligne2 = document.createElement('P');
    
    ligne1.append("Vitesse:")
    ligne2.append("Temperature:")
    

    newElement.innerHTML += '<p id="eolienne_vitesse">' + ligne1.textContent +'</p>' 
    //+ '<p id="panneau_solaire_temperature">' + ligne2.textContent +'</p>' 
    + '<p id="eolienne_temperature">' + ligne2.textContent +'</p>';
   


      div2.appendChild(newElement)
      eolienne.setAttribute("value","Cacher2")


      if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Afficher3" )
      {
        console.log("il y a que le détail du deuxieme")
        rectangle_base.style.height = "295px";
        rectangle_fleche.style.top = "-303px"
        arrow_box.style.top = "-299.5px";
        rectangle_fleche2.style.top ="-190px";

      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du premier et du deuxieme")
          rectangle_base.style.height = "355px";
          rectangle_fleche.style.top = "-363px";
          arrow_box.style.top = "-359.5px";
          rectangle_fleche2.style.top ="-190px";



      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du deuxieme et du troisieme")
          rectangle_base.style.height = "295px";
          rectangle_fleche.style.top = "-303px"
          arrow_box.style.top = "-299.5px";
          rectangle_fleche2.style.top ="-190px";
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Cacher3")
      {
        //triple_fleche.setAttribute('src',"img/triple_fleche_verte_123.png")
        //triple_fleche.setAttribute('height',"450px")
        console.log("il y a que le détail de tout")
        rectangle_base.style.height = "355px";
        rectangle_fleche.style.top = "-363px";
        arrow_box.style.top = "-359.5px";
        rectangle_fleche2.style.top ="-190px";
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
        rectangle_base.style.height = "265px";
        rectangle_fleche.style.top = "-273px"
        arrow_box.style.top = "-269.5px";
        rectangle_fleche2.style.top ="-160px";

      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Afficher3")
      {
          console.log("il y a que le détail du premier")
          rectangle_base.style.height = "320px";
          rectangle_fleche.style.top = "-328px"
          arrow_box.style.top = "-324.5px";
          rectangle_fleche2.style.top ="-160px";
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && hydro.getAttribute('value')=="Cacher3")
      {
          console.log("il y a que le détail du troisieme")
        rectangle_base.style.height = "265px";
        rectangle_fleche.style.top = "-273px"
        arrow_box.style.top = "-269.5px";
        rectangle_fleche2.style.top ="-160px";

      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && hydro.getAttribute('value')=="Cacher3")
      {
        console.log("il y a que le détail du premier et du troisieme")
        rectangle_base.style.height = "320px";
        rectangle_fleche.style.top = "-328px"
        arrow_box.style.top = "-324.5px";
        rectangle_fleche2.style.top ="-160px";
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
    var ligne1 = document.createElement('P');
    var ligne2 = document.createElement('P');
    
    ligne1.append("Vitesse:")
    ligne2.append("Temperature:")
    

    newElement.innerHTML += '<p id="hydro_vitesse">' + ligne1.textContent +'</p>' 
    //+ '<p id="panneau_solaire_temperature">' + ligne2.textContent +'</p>' 
    + '<p id="hydro_temperature">' + ligne2.textContent +'</p>';

      div3.appendChild(newElement)
      hydro.setAttribute("value","Cacher3")

      if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Afficher2" )
      {
        console.log("il y a que le détail du troisieme")
        rectangle_base.style.height = "265px";
        rectangle_fleche.style.top = "-273px"
        arrow_box.style.top = "-269.5px";
        rectangle_fleche2.style.top ="-160px";

      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Afficher2")
      {
          console.log("il y a que le détail du premier et du troisieme")
          rectangle_base.style.height = "320px";
          rectangle_fleche.style.top = "-328px"
          arrow_box.style.top = "-324.5px";
          rectangle_fleche2.style.top ="-160px";
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Cacher2")
      {
          console.log("il y a que le détail du deuxieme et du troisieme")
          rectangle_base.style.height = "295px";
          rectangle_fleche.style.top = "-303px"
          arrow_box.style.top = "-299.5px";
          rectangle_fleche2.style.top ="-190px";
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Cacher2")
      {
        //triple_fleche.setAttribute('src',"img/triple_fleche_verte_123.png")
        //triple_fleche.setAttribute('height',"460px")
        console.log("il y a que le détail de tout")
        rectangle_base.style.height = "355px";
        rectangle_fleche.style.top = "-363px";
        arrow_box.style.top = "-359.5px";
        rectangle_fleche2.style.top ="-190px";
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
        rectangle_base.style.height = "265px";
        rectangle_fleche.style.top = "-273px"
        arrow_box.style.top = "-269.5px";
        rectangle_fleche2.style.top ="-160px";

      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Afficher2")
      {
          console.log("il y a que le détail du premier")
          rectangle_base.style.height = "320px";
          rectangle_fleche.style.top = "-328px"
          arrow_box.style.top = "-324.5px";
          rectangle_fleche2.style.top ="-160px";
      }

       else if(panneaux_solaire.getAttribute('value')=="Afficher1" && eolienne.getAttribute('value')=="Cacher2")
      {
          console.log("il y a que le détail du deuxieme ")
          rectangle_base.style.height = "295px";
          rectangle_fleche.style.top = "-303px"
          arrow_box.style.top = "-299.5px";
          rectangle_fleche2.style.top ="-190px";
      }

      else if(panneaux_solaire.getAttribute('value')=="Cacher1" && eolienne.getAttribute('value')=="Cacher2")
      {
        console.log("il y a que le détail du premier et du deuxieme")
        rectangle_base.style.height = "355px";
        rectangle_fleche.style.top = "-363px";
        arrow_box.style.top = "-359.5px";
        rectangle_fleche2.style.top ="-190px";
      }

    }
  }


 function Electric(){
  
    var equipements = document.getElementById('equipements');   
    var div4 = document.getElementById('div4');   
    var newElement = document.createElement('div');
    newElement.style.marginLeft = "170px";

    if (equipements.getAttribute('value')=="Afficher4")
    {

    document.getElementById("sans3").style.display = "none";

    var ligne1 = document.createElement('P');
    ligne1.append("Duree:")
    
    newElement.innerHTML += '<p id="electric_duree">' + ligne1.textContent +'</p>' 
    
      div4.appendChild(newElement)
      equipements.setAttribute("value","Cacher4")
      }
      else 
    {
    document.getElementById("sans3").style.display = "block";
    var child = div4.getElementsByTagName("div")[0]
    console.log(child)
    div4.removeChild(child)
    equipements.setAttribute("value","Afficher4")
    }
  }

  function Moteur(){
    var moteur_image = document.getElementById('moteur_image');   
    var div5 = document.getElementById('div5');   
    var newElement = document.createElement('div');
    newElement.style.marginLeft = "170px";

    if (moteur_image.getAttribute('value')=="Afficher5")
    {
    var ligne1 = document.createElement('P');
    ligne1.append("Vitesse:") ;
    newElement.innerHTML += '<p id="moteur_vitesse">' + ligne1.textContent +'</p>' 

      div5.appendChild(newElement)
      moteur_image.setAttribute("value","Cacher5")
      }
      
      else 
    {
    var child = div5.getElementsByTagName("div")[0]
    console.log(child)
    div5.removeChild(child)
    moteur_image.setAttribute("value","Afficher5")
    }
  }



(function(){
    //On va vérifier si l'utilisateur a bien appyer
    
    var updateValues = function() {
    var xhr = new XMLHttpRequest(); 
    xhr.open('GET', 'http://localhost/values');

    xhr.onreadystatechange = function() {
      if (xhr.status === 200) {
        const json = xhr.responseText;
        const obj = JSON.parse(json);
        var panneaux_solaire = document.getElementById('panneaux_solaire');
        var eolienne = document.getElementById('eolienne');
        var hydro = document.getElementById('hydro');
        var equipements = document.getElementById('equipements');  

         if(panneaux_solaire.getAttribute('value')=="Cacher1")
        {
        document.getElementById("panneau_solaire_ensoleillement").innerHTML ="Ensoleillement: " + obj.data.sources.panneauxSolaires.ensoleillement + " ";
        //document.getElementById("panneau_solaire_temperature").innerHTML = obj.data.sources.panneauxSolaires.temperature + " ";
        document.getElementById("panneau_solaire_rendement").innerHTML = "Rendement: " + obj.data.sources.panneauxSolaires.rendement + " ";
        document.getElementById("panneau_solaire_inclinaison").innerHTML = "Inclinaison: " + obj.data.sources.panneauxSolaires.inclinaison + " ";
        }

        if (eolienne.getAttribute('value')=="Cacher2")
        {
        document.getElementById("eolienne_vitesse").innerHTML ="Vitesse: " + obj.data.sources.eoliennes.vitesse + " ";
        document.getElementById("eolienne_temperature").innerHTML = "Temperature: " + obj.data.sources.eoliennes.temperature + " ";
        }

         if (hydro.getAttribute('value')=="Cacher3")
        {
        document.getElementById("hydro_vitesse").innerHTML ="Vitesse: " + obj.data.sources.hydroliennes.vitesse + " ";
        document.getElementById("hydro_temperature").innerHTML = "Temperature: " + obj.data.sources.hydroliennes.temperature + " ";
        }

        if (equipements.getAttribute('value')=="Cacher4")
        {
        document.getElementById("electric_duree").innerHTML ="Duree: " + obj.data.consos.equipements.duree + " ";
        
        }

        if (moteur_image.getAttribute('value')=="Cacher5")
        {
        document.getElementById("moteur_vitesse").innerHTML ="Vitesse: " + obj.data.consos.moteur.vitesse + " ";
        
        }

        document.getElementById("panneausolaire").innerHTML = obj.data.sources.panneauxSolaires.production + " kW";
        document.getElementById("eoliennes").innerHTML = obj.data.sources.eoliennes.production + " kW";
        document.getElementById("hydroliennes").innerHTML = obj.data.sources.hydroliennes.production + " kW";
        document.getElementById("moteur").innerHTML = obj.data.consos.moteur.conso + " kW";
        document.getElementById("equip").innerHTML = obj.data.consos.equipements.conso + " kW";
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






















 