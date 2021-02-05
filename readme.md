


# ECE-PFE Skravik
## Installation du serveur signalK (Windows)
- [Telecharger l'installeur de signalK server ici](https://github.com/SignalK/signalk-server-windows/releases/latest/download/signalk-server-setup.exe)
- Executez ce fichier pour installer signalK sur votre ordinateur. (Notez bien le dossier d'installation de signalK, cela servira pour demarrer le serveur ensuite)

## Démarrage du serveur signalK (Windows)
Note : 
- On notera `%SignalK%` le dossier d'installation de signalK
- On notera `%git%` le dossier contenant ce repo

Installation pour le développement de l'interface:

- Pour utiliser notre préconfiguration : copiez le fichier `skravik-interface-plugin.json` dans le dossier `%signalk%/signalkhome/.signalk/plugin-config-data/`.
- Dans `%git%\skravik_interface`, executez `npm link` dans un terminal de commande. Vous pouvez fermer la console ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik_interface`. Gardez la console ouverte (une commande similaire sera à executer au même endroit plus tard).
- Dans `%git%\skravik_sim`, lancez `npm link`. Vous pouvez fermer la console ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik_sim`. Vous pouvez fermer la console ensuite.
- Aller sur `http://localhost:3000` dans le navigateur internet.
	- Si la page ne répond pas (et donc que le serveur signalK ne tourne pas déjà) : 
		- Dans le dossier `%SignalK%\tools`, lancez le racourci `SignalK-CLI.lnk`, puis executez dans la fenetre qui s'ouvre : `signalk-server.cmd`. Si tout se passe bien il devrait y avoir de nombreuses lignes commencant par GET.
		- Actualisez la page.
	- Si la page répond et que vous arrivez sur une interface de SignalK, l'installation est terminée.

Installation normale :

- Pour utiliser notre préconfiguration : copiez le fichier `skravik-interface-plugin.json` dans le dossier `%signalk%/signalkhome/.signalk/plugin-config-data/`.
- Copier `%git%\skravik_interface` et `%git%\skravik_sim` dans le dossier `%SignalK%\signalkhome\.signalk\node_modules\` (Créez le dossier `node_modules` s'il n'est pas présent)
- Aller sur `http://localhost:3000` dans le navigateur internet.
	- Si la page ne répond pas (et donc que le serveur signalK ne tourne pas déjà) : 
		- Dans le dossier `%SignalK%\tools`, lancez le racourci `SignalK-CLI.lnk`, puis executez dans la fenetre qui s'ouvre : `signalk-server.cmd`. Si tout se passe bien il devrait y avoir de nombreuses lignes commencant par GET.
		- Actualisez la page.
	- Si la page répond et que vous arrivez sur une interface de SignalK, l'installation est terminée.

## Configuration du plugin
- A partir de l'interface de SignalK (`http://localhost:3000/`), cliquez sur "Server" à gauche de l'écran puis sur "Plugin Config"
- Ensuite, cliquez sur Skravik Admin. Ici, vous pouvez ajouter des producteurs, consommateurs et batteries en cliquant sur "+".
- Le paramètre "API Key OpenWeatherMap" permet de saisir la clé API de OpenWeatherMap qui permet de fournir les prévisions météos. Cette clé est obtenu en s'inscrivant sur `https://openweathermap.org/`. Aussi, les sections "Paramètres panneaux solaires" et "Paramètres eolien" sont utiles pour la calculer la prévisions de production.
- Chaque section concernant l'ajout d'équipements permet d'ajouter ou supprimer un élément. La position de l'élément définit le numéro d'identifiant au sein de sa catégorie (panneaux solaire, éoliennes, hydroliennes, consommateurs, batteries, ...) comme décrit par l'image ci-dessous : 
## Utilisation de la simulation
- Après avoir démarré SignalK, ouvrez ces 2 pages :
	- La page de controle des données générées pour la simulation : [http://localhost:3000/skravik_sim/](http://localhost:3000/skravik_sim/)
	- La page de l'interface : [http://localhost:3000/skravik/](http://localhost:3000/skravik/)


## Sources
- [Github de SignalK](https://github.com/SignalK/signalk-server-windows)
