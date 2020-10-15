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
    response={}

    response["sources"]={"panneausolaire": a(),
                         "eolienne": a()}

    response["consos"]={"moteur": -a(),
                        "equipements": -a()}

    #Calcul des sommes
    sommeSources=0
    for source in response["sources"]:
        sommeSources += response["sources"][source]

    sommeConsos=0
    for conso in response["consos"]:
        sommeConsos += response["consos"][conso]

    sommeTotale=sommeSources+sommeConsos

    sommesDict={}
    sommesDict["sommesources"]=sommeSources
    sommesDict["sommeconsos"]=sommeConsos
    sommesDict["sommetotale"]=sommeTotale
    response["sommes"]=sommesDict

    try:
        self.sendContent("success", response)
    except:
        self.sendContent("error", "Error during computation")