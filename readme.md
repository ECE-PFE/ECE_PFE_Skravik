


# ECE-PFE Skravik
## Installation du serveur signalK (Windows)
- [Telecharger l'installeur de signalK server ici](https://github.com/SignalK/signalk-server-windows/releases/latest/download/signalk-server-setup.exe)
- Executez ce fichier pour installer signalK sur votre ordinateur. (Notez bien le dossier d'installation de signalK, cela servira pour demarrer le serveur ensuite)

## Démarrage du serveur signalK (Windows)
Note : 
- On notera `%SignalK%` le dossier d'installation de signalK
- On notera `%git%` le dossier contenant ce repo

Démarrage du serveur :
- Pour utiliser notre préconfiguration : copiez le fichier `skravik-admin-plugin.json` dans le dossier `%signalk%/signalkhome/.signalk/plugin-config-data/`.
- Dans `%git%\skravik_interface`, executez `npm link` dans un terminal de commande. Vous pouvez fermer la console ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik`. Gardez la console ouverte (une commande similaire sera à executer au même endroit plus tard).
- Dans `%git%\skravik_sim`, lancez `npm link`. Vous pouvez fermer la console ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik_sim`. Vous pouvez fermer la console ensuite.
- Dans `%git%\skravik_admin`, lancer `npm link`. Vous pouvez fermer la console ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik_admin`. Vous pouvez fermer la console ensuite.
- Aller sur `http://localhost:3000` dans le navigateur internet.
	- Si la page ne répond pas (et donc que le serveur signalK ne tourne pas déjà) : 
		- Dans le dossier `%SignalK%\tools`, lancez le racourci `SignalK-CLI.lnk`, puis executez dans la fenetre qui s'ouvre : `signalk-server.cmd`. Si tout se passe bien il devrait y avoir de nombreuses lignes commencant par GET.
		- Actualisez la page.
	- Si la page répond et que vous arrivez sur une interface de SignalK, l'installation est terminée.

## Utilisation de la simulation
- Après avoir démarré SignalK, dans l'interface allez dans `Webapps`, ouvrez dans deux nouveaux onglets `Skravik_sim` et `Skravik`.
	- L'onglet Skravik_sim permet de controler les données générées pour la simulation.
	- L'onglet Skravik contient l'interface fonctionelle.

## Sources
- [Github de SignalK](https://github.com/SignalK/signalk-server-windows)
