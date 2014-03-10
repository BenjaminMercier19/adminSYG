# AdminTerraGIS

Ici se trouve le code source de l'application d'administration des applications SYG ! 

[Voir le site ici](https://sygdev.systra.info/adminSYG)

## Généralités
* C'est une application qui permet de gérer la partie administrative des projets SYG (excepté la création de web services cartographiques)
* Création d'une nouvelle configuration
* Visualisation / Modification de la hiérarchie des projets existants
* Gestion des utilisateurs associés à l'application

## Nouvelle Configuration

Le premier onglet permet de mettre en place une nouvelle configuration et d'intégrer les résultats dans la base de données usersSYG. Cette base de données stock l'ensemble des informations relatives à l'utilisation de la plateforme SYG depuis les utilisateurs jusqu'aux projets, rôles et configurations.
La création d'une nouvelle configuration se passe en 4 partie:

1. L'utilisateur:
	* Choisir un utilisateur existant permet d'ouvrir la liste des utilisateurs présents dans la base de données
	* Ajouter un nouvel utilisateur permet d'en créer une dans la BDD. Cela ouvre un formulaire avec 2 choix possibles:
		i.	Cette personne ne fait pas partie de SYSTRA (client ou prestataire). On doit remplir l'ensemble des champs du formulaire
		ii. Cette personne à un compte windows chez SYSTRA. Ainsi on ne rentre que son login (première lettre prénom + nom de famille). Attention aux noms composés. Le reste des informations comme le nom, prénom et mail seront récupérés à l'aide de l'annuaire d'entreprise
2. Le projet:
	* Créer un nouveau projet permet d'en rajouter un dans la BDD. On doit donner un nom au projet, nom qui sera disponible dans la liste déroulante ors de l'authentification à la plateforme SYG.
	* On choisit parmis la liste déroulante des projets existants
3. Choix du rôle, associe un rôle à l'utilisateur choisit sur le projet choisit. Il n'y a que 3 rôles disponibles: Client, Prestataire ou Validateur
4. Choix des services ou remplissage du fichier de configuration:
	i.	 On doit choisir dans la liste déroulante 'Services List' le web service dans lequel sont publiées les tables correspondantes à la configuration choisit.
	ii.	 Dans la liste 'Layers List' se trouve les couches à déplacer dans les champs 'Hole in edition' et 'Hole Validated'. Il suffit de faire un 'cliquer-glisser' pour mettre la couche dans le champs associé. Pour s'informer sur la couche il est possible de cliquer dessus afin de l'ouvrir dans l'API Rest d'ArcGIS Server.
	iii. Le reste des champs permettent de mettre un titre à notre application, un sous-titre voire plus si l'on est dans le cas d'un prestataire. On rajoute aussi le nom du responsable (validateur de SYSTRA) et son mail afin de pouvoir le contacter automatiquement lors du remplissage dans l'appli SYG.

	Attention: Ne pas oublier de cliquer sur enregistrer à la fin !!!			


Un tableau de résumer permet de mettre en avant les choix effectués pour la configuration.

Le fichier xml ainsi créer aura un nom normalisé: https://sygdev.systra.info/config/NomDuProjet/NomDuRole/config_LoginUser_Role_Projet.xml ce qui veut dire que sur le web serveur IIS134 se trouve un dossier nommé config qui est hiérarchisé comme cet exemple:
	-> projet
		-> Rôle
			-> fichier xml de configuration
			-> fichier xml de configuration
		-> Rôle
			-> fichier xml de configuration
	-> projet
		-> Rôle
			-> fichier xml de configuration


## Gérer les dossiers & configurations

Le 2ème onglet permet de visualiser la hiérarchie du dossier 'config' contenant l'ensemble des fichiers de configuration.
Avec un click droit sur l'arbre il est possible de supprimer le noeud sélectionner et ses enfants, ou alors ouvrir le fichier si le noeud sélectionner est un fichier.xml. Il y a aussi une barre de recherche, on peut ainsi taper le login d'un user pour voir dans quel projets il évolue

## Gérer les utilisateurs

Le dernier onglet permet d'afficher une table qui contient l'ensemble des informations d'un utilisateur relatives à ses projets.

Nom de l'utilisateur | Projet(s) | Rôle sur le projet | Le fichier de config xml associé | Un bouton pour supprimer la ligne
_____________________|___________|____________________|__________________________________|__________________________________

Si un utilisateur à plusieurs projets le bouton Delete ne supprime que le projet + config de la ligne en question. Si l'utilisateur n'a qu'un projet cela supprime aussi l'utilisateur

## Améliorations

* Il est possible d'envoyer un mail automatique pour prévenir l'utilisateur qu'il est associé à une nouvelle configuration

## Développement

* [Développement Front en Javascript & framework JQuery version 1.10.4](http://jquery.com)
* [Design avec l'API twitter bootstrap v3](http://getbootstrap.com/)
* [Back-end en PHP5 et le plugin sqlsrv](http://www.php.net/manual/fr/book.sqlsrv.php)
* [Persistance des données sur SQLServer 2012](http://www.microsoft.com/france/serveur-cloud/sql/2012/)
