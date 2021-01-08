import numpy as np

def round(n):
    return np.round(n*10)/10

def rnd(min, max):
    return round(np.random.uniform(low=min, high=max))

def generateValues():
    #Productions
    panneauSolaire1={"production"     : rnd(0,5),#KW
                      "inclinaison"   : rnd(30,45),#°
                      "rendement"     : rnd(5,20),#%
                      "ensoleillement": rnd(60,80)}#%

    panneauSolaire2={"production"     : rnd(0,5),#KW
                      "inclinaison"   : rnd(30,45),#°
                      "rendement"     : rnd(5,20),#%
                      "ensoleillement": rnd(60,80)}#%

    panneauSolaire3={"production"     : rnd(0,5),#KW
                      "inclinaison"   : rnd(30,45),#°
                      "rendement"     : rnd(5,20),#%
                      "ensoleillement": rnd(60,80)}#%

    panneauSolaire4={"production"     : rnd(0,5),#KW
                      "inclinaison"   : rnd(30,45),#°
                      "rendement"     : rnd(5,20),#%
                      "ensoleillement": rnd(60,80)}#%

    panneauxSolaires = round(panneauSolaire1["production"] + panneauSolaire2["production"] + panneauSolaire3["production"] + panneauSolaire4["production"])

    eolienne1={"production" : rnd(0,3),#KW
               "vitesse"    : rnd(15,45),#km/h
               "temperature": rnd(17,25)}#°C

    eolienne2={"production" : rnd(0,3),#KW
               "vitesse"    : rnd(15,45),#km/h
               "temperature": rnd(17,25)}#°C

    eoliennes = round(eolienne1["production"] + eolienne2["production"])

    hydrolienne1={"production" : rnd(0,5),#KW
                  "vitesse"    : rnd(15,40),#km/h
                  "temperature": rnd(17,25)}#°C

    hydrolienne2={"production" : rnd(0,5),#KW
                  "vitesse"    : rnd(15,40),#km/h
                  "temperature": rnd(17,25)}#°C

    hydroliennes = round(hydrolienne2["production"] + hydrolienne2["production"])

    alternateur={"production" : rnd(0,5),#KW
                 "vitesse"    : rnd(15,40),#tour/s
                 "temperature": rnd(17,25)}#°C

    groupeElectrogene={"production" : rnd(0,5),#KW
                       "temperature": rnd(17,25)}#°C

    #Consommations
    moteur={"conso"  : -rnd(5,20),#KW
            "vitesse": rnd(10,20)}#km/h

    equipements={"conso": -rnd(0,10),#KW
                "duree" : rnd(7,10)}#h

    #Stockage
    batteries={"batterie1": rnd(80,100),#%
               "batterie2": rnd(15,25),#%
               "batterie3": rnd(40,60)}#%

    #Combinaisons des elements
    sources={"panneauSolaire1": panneauSolaire1,
             "panneauSolaire2": panneauSolaire2,
             "panneauSolaire3": panneauSolaire3,
             "panneauSolaire4": panneauSolaire4,
             "panneauxSolaires": panneauxSolaires,
             "eolienne1": eolienne1,
             "eolienne2": eolienne2,
             "eoliennes": eoliennes,
             "hydrolienne1": hydrolienne1,
             "hydrolienne2": hydrolienne2,
             "hydroliennes": hydroliennes,
             "alternateur": alternateur,
             "groupeElectrogene": groupeElectrogene}

    consos={"moteur": moteur,
            "equipements": equipements}

    #Sommes
    sommeSources = round(panneauxSolaires + hydroliennes + eoliennes + alternateur["production"] + groupeElectrogene["production"])
    sommeConsos  = round(moteur["conso"] + equipements["conso"]) #Valeur négative
    sommeTotale  = round(sommeSources + sommeConsos)

    if sommeSources > - sommeConsos:
      sourcesVersConsos    = - sommeConsos
      batteriesVersConsos  = 0
      sourcesVersBatteries = round(sommeSources + sommeConsos)
    else:
      sourcesVersConsos    = sommeSources
      batteriesVersConsos  = round(- sommeConsos - sommeSources)
      sourcesVersBatteries = 0

    #Combinaison des sommes
    sommes={"sommeSources": sommeSources,
            "sommeConsos" : sommeConsos,
            "sommeTotale" : sommeTotale}

    #Transferts
    transferts={"sourcesVersConsos"   : sourcesVersConsos,
                "batteriesVersConsos" : batteriesVersConsos,
                "sourcesVersBatteries": sourcesVersBatteries}
    #print(sommes)
    #²print(transferts)
    #Construction de la réponse
    response={"sources"   : sources,
              "consos"    : consos,
              "sommes"    : sommes,
              "transferts": transferts,
              "batteries" : batteries}

    return response