# (ECE) PFE Skravik

- Open a terminal in the project's folder
- Run `python restApi/main.py`
- Open the file `Interface/interface.html` in your browser.

## Dev notes
Raw data can be found at [http://localhost/values](http://localhost/values), and will contain this kind of json :
```
{
   "Status":"success",
   "data":{
      "sources":{
         "panneauxSolaires":{
            "production":4,
            "inclinaison":45,
            "rendement":7,
            "ensoleillement":71
         },
         "hydrolienne":{
            "production":1,
            "vitesse":33,
            "temperature":19
         },
         "eolienne":{
            "production":4,
            "vitesse":43,
            "temperature":21
         }
      },
      "consos":{
         "moteur":{
            "conso":-5,
            "vitesse":10
         },
         "equipements":{
            "conso":0,
            "duree":10
         }
      },
      "sommes":{
         "sommeSources":9,
         "sommeConsos":-5,
         "sommeTotale":4
      }
   }
}
```
