
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
            "production":5,
            "inclinaison":6,
            "rendement":4,
            "ensoleillement":8
         },
         "hydrolienne":{
            "production":8,
            "vitesse":0,
            "temperature":0
         },
         "eolienne":{
            "production":5,
            "vitesse":8,
            "temperature":4
         }
      },
      "consos":{
         "moteur":{
            "conso":-1,
            "vitesse":2
         },
         "equipements":{
            "conso":-5,
            "duree":4
         }
      },
      "sommes":{
         "sommeSources":18,
         "sommeConsos":-6,
         "sommeTotale":12
      }
   }
}
```
