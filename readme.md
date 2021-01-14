

# (ECE) PFE Skravik

Note : 
- On notera `%SignalK%` le dossier d'installation de signalK
- On notera `%git%` le dossier contenant ce repo

## Installation de signalK (Windows)
- [Telecharger l'installeur de signalK server ici](https://github.com/SignalK/signalk-server-windows)
- Dans `%git%\signalk_interface`, executez `npm link` dans un terminal de commande. Vous pouvez le fermer ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik`. Vous pouvez le fermer ensuite.
- Dans `%git%\signalk_sim`, lancer `npm link`. Vous pouvez le fermer ensuite.
- Dans le dossier `%SignalK%\signalkhome\.signalk\`, lancez `npm link skravik_sim`. Vous pouvez le fermer ensuite.
- Aller sur `http://localhost:3000` dans le navigateur internet.
	- Si la page de répond pas (donc que le serveur signalK ne tourne pas déjà) : 
		- Dans le dossier `%SignalK%\tools`, lancez le racourci `SignalK-CLI`, puis executez dans la fenetre qui s'ouvre : `signalk-server.cmd`. Si tout se passe bien il devrait y avoir de nombreuses lignes commencant par GET.
	- Si la page répond et que vous arrivez sur une interface de SignalK, l'installation est terminée.

## Utilisation de la simulation
- Dans l'interface de SignalK, aller dans `Webapps`, ouvrir dans deux nouveaux onglets `Skravik` et `Skravik_sim`
	- L'onglet Skravik contient l'interface fonctionelle.
	- L'onglet Skravik_sim servira à controler les données générées pour la simulation.
