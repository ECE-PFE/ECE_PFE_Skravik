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

def values(self):
    print(1)
    sources = np.random.randint(0, 10, size=3)
    consos  = np.random.randint(-9, 1, size=3)
    sommeSources = np.sum(sources)
    sommeConsos  = np.sum(consos)
    sommeTotale=sommeSources+sommeConsos

    response={}

    sourcesDict={}
    for i in range(len(sources)):
        key="source" + str(i+1)
        sourcesDict[key]=str(sources[i])
    response["sources"]=sourcesDict

    consosDict={}
    for i in range(len(consos)):
        key="conso" + str(i+1)
        consosDict[key]=str(consos[i])
    response["consos"]=consosDict

    sommesDict={}
    sommesDict["sommeSources"]=str(sommeSources)
    sommesDict["sommeConsos"]=str(sommeConsos)
    sommesDict["sommeTotale"]=str(sommeTotale)
    response["sommes"]=sommesDict

    print(response)

    try:
        self.sendContent("success", response)
    except:
        self.sendContent("error", "Error during computation")