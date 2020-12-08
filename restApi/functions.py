import numpy as np

def getParams(self,paramList):
    valuesList=[None]*len(paramList)

    for index, paramName in enumerate(paramList):
        try:
            value=self.params[paramName][0]
            valuesList[index]=value
        except:
            msg="Parameter " + paramName + " is missing"
            self.sendContent("fail", msg)
            return [False] + valuesList

    return [True] + valuesList

def rnd(min, max):
    return np.random.randint(min, max+1)

def values(self):
    #Productions
    panneauxSolaires={"production": rnd(0,5),#KW
                      "inclinaison": rnd(30,45),#°
                      "rendement": rnd(5,20),#%
                      "ensoleillement": rnd(60,80)}#%

    hydroliennes={"production": rnd(0,5),#KW
                  "vitesse": rnd(15,40),#km/h
                  "temperature": rnd(17,25)}#°C

    eoliennes={"production": rnd(0,10),#KW
               "vitesse": rnd(15,45),#km/h
               "temperature": rnd(17,25)}#°C

    #Consommations
    moteur={"conso": -rnd(5,15),#KW
            "vitesse": rnd(10,20)}#km/h

    equipements={"conso": -rnd(0,5),#KW
                "duree": rnd(7,10)}#h

    #Combinaisons des elements
    sources={"panneauxSolaires": panneauxSolaires,
             "hydroliennes": hydroliennes,
             "eoliennes": eoliennes}

    consos={"moteur": moteur,
            "equipements": equipements}

    #Sommes
    sommeSources = panneauxSolaires["production"] + hydroliennes["production"] + eoliennes["production"]

    sommeConsos = moteur["conso"] + equipements["conso"]

    sommeTotale = sommeSources + sommeConsos

    #Combinaison des sommes
    sommes={"sommeSources": sommeSources,
            "sommeConsos": sommeConsos,
            "sommeTotale": sommeTotale}

    #Construction de la réponse
    response={"sources": sources,
              "consos": consos,
              "sommes": sommes}

    try:
        self.sendContent("success", response)
    except:
        self.sendContent("error", "Error during computation")