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

def a():
    return np.random.randint(0,10)

def values(self):
    #Productions
    panneauxSolaires={"production": a(),
                      "inclinaison": a(),
                      "rendement": a(),
                      "ensoleillement": a()}

    hydrolienne={"production": a(),
                 "vitesse": a(),
                 "temperature": a()}

    eolienne={"production": a(),
              "vitesse": a(),
              "temperature": a()}

    #Consommations
    moteur={"conso": -a(),
            "vitesse": a()}

    equipements={"conso": -a(),
                "duree": a()}

    #Combinaisons des elements
    sources={"panneauxSolaires": panneauxSolaires,
             "hydrolienne": hydrolienne,
             "eolienne": eolienne}

    consos={"moteur": moteur,
            "equipements": equipements}

    #Sommes
    sommeSources = panneauxSolaires["production"] + hydrolienne["production"] + eolienne["production"]

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