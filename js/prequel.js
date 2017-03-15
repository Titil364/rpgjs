
//Renvoie un nombre aléatoire entre deux entier
function rand(min, max){
	return Math.floor((Math.random() * max) + min);
}
	
//######################################################################
// Gestion des evenements
//######################################################################


//Creation evenement personaliser
//On créé 2 événements, la manière de créer l'event depend du navigateur

//Evenement permettant de redonner à notre héro son apparence normale
var aNormale;
if (document.createEvent) {
    aNormale = document.createEvent("HTMLEvents");
    aNormale.initEvent("apparenceNormale", true, true);
} else {
	aNormale = document.createEventObject();
	aNormale.eventType = "apparenceNormale";
}
aNormale.eventName = "apparenceNormale";


//Evenement affichant la fin du jeu
var gameover;
if (document.createEvent) {
    gameover = document.createEvent("HTMLEvents");
    gameover.initEvent("gameover", true, true);
} else {
	gameover = document.createEventObject();
	gameover.eventType = "gameover";
}
gameover.eventName = "gameover";

//######################################################################
//EVENEMENT DE DEPARTS

//On lance la fonction start chargement de la page
window.onload = start;

//En suivant les instructions de l'écran de titre
//Appuyer sur entré pour lancer le jeu
document.body.addEventListener("keydown", begin);

//evenement associé à un événement personnalisé
document.body.addEventListener("gameover", gameOver);


//######################################################################
//Affiche l'écran de titre de début de partie. 
function start(){
	var s = document.createElement("div");
	s.setAttribute("id", "ecranTitre");
	var text = document.createElement("div");
	text.innerHTML = "Appuyer sur entrée";
	document.body.appendChild(s);	
	s.appendChild(text);
}
//Affiche l'écran de game over
function gameOver(){
	
	var s = document.createElement("div");
	s.setAttribute("id", "ecranGameover");
	var text = document.createElement("div");
	text.innerHTML = "Vous êtes mort";
	s.appendChild(text);
	text = document.createElement("div");
	text.innerHTML = "Appuyer sur entrée pour recommencer";
	text.style.fontStyle = "italic";
	s.appendChild(text);
	document.body.appendChild(s);
	
	//Ajout evenement begin pour recommencer
	document.body.addEventListener("keydown", begin);
}

//Lance le jeu au début et lors du restart de la partie
function begin(event){
	var touche = event.keyCode;
	//Touche Entrée - 13
	
	if(touche == 13){
		//On charge toutes les armes
		chargerArmes(traitement);
		
		//On supprime l'écran de titre
			var s = document.getElementById("ecranTitre");
		if(s != null)
			document.body.removeChild(s);
		//on supprime tous les enfants si le titre n'est pas présent
		//Titre pas présent = fin de la partie, le joueur recommence
		//On vide le stage
		else{
			while (document.body.firstChild) {
				document.body.removeChild(document.body.firstChild);
			}
		}
		//Création du terrain 
		terrain = new Stage("Stage1", longueurTerrain, largeurTerrain);
		//Créer le terrain aléatoirement
		terrain.createRandom();
		//Création du héro
		hero = new Hero("Piccolo");
		hero.afficher();
		

	terrain.add(hero);
		
		//Plus besoin de l'événement begin, on l'enlève
		document.body.removeEventListener("keydown", begin);
	//On fait apparaitre des coeurs et des monstres à intervalle régulier	
	setInterval(function(){spawnerObjet("coeur");},10000);
	setInterval(function(){spawnerMonstre();},5000);
	setInterval(function(){spawnerArmeEquipement();},20000);
	
	
		//On rajoute les événements liés au joueur
		document.body.addEventListener("keydown", afficherInventaire);
		document.body.addEventListener("keydown", deplacementGauche);
		document.body.addEventListener("keydown", deplacementHaut);
		document.body.addEventListener("keydown", deplacementDroite);
		document.body.addEventListener("keydown", deplacementBas);
		document.body.addEventListener("keydown", action);
		document.body.addEventListener("keydown", attaquer);
		//evenement personnalisé
		document.body.addEventListener("apparenceNormale", apparenceNormale);

		hero.div.addEventListener("click", danser);
	}
		
}
//Permet de jeter un objet par terre en cliquant dessus depuis l'inventaire
function drop(event){
	var o = hero.inventaire.selectionner(event.clientX, event.clientY);
	hero.drop(o);
}

//Fais danser le joueur en cliquant successivement sur le joueur avec la souris
function danser(event){
	if(hero.sens == GAUCHE){
		hero.tourner(HAUT);
	}
	else if(hero.sens == HAUT){
		hero.tourner(DROITE);
	}
	else if(hero.sens == DROITE){
		hero.tourner(BAS);
	}
	else if(hero.sens == BAS){
		hero.tourner(GAUCHE);
	}
}

//Affiche ou desaffiche l'inventaire en appuyant sur échap - 27
function afficherInventaire(event){
	var touche = event.keyCode;
//			console.log(event.keyCode);
	if(touche == 27){
		//Si le héro est sur le terrain et que l'inventaire n'est pas affiché on l'affiche
		if(hero.estAfficher && !hero.inventaire.estAfficher){
			displayInventaire();
			//On ajoute l'événement pour équiper un équipement.
			document.body.addEventListener("keydown", equiper);
		}
		else if(hero.inventaire.estAfficher){
			hero.inventaire.desafficher();
			//On enlève l'événement pour équiper un équipement
			document.body.removeEventListener("keydown", equiper);
		}
	}
}
//Depuis l'inventaire, équipe un équipement selectionner par le curseur de l'inventaire en appuyant sur entré -13
function equiper(event){
	var touche = event.keyCode;
	if(touche == 13){
		//On récupère l'objet situé sur le curseur de l'inventaire
		var o = hero.inventaire.selectionner(0, 0, hero.inventaire.posCursor);
		//Si on a trouvé un objet
		if(o){
			//La fonction equiper(o) équipe l'objet o et renvoie l'equipement aniennement porté
			var currentArme = hero.equiper(o);
			//On raffraichi l'affichage
			hero.inventaire.desafficher();
			//On supprime l(objet o de l'inventaire
			hero.inventaire.remove(o);
			//On ajoute l'ancienne arme
			hero.inventaire.add(currentArme);
			//On réaffiche 
			hero.inventaire.afficher();
			//L'équipement influe sur les statistiques du personnage, on les met à jour
			hero.afficherStats();
		}
	}
}

function apparenceNormale(){
	//On remet l'apparence normale après une attaque
	//On attend que l'animation se termine
		setTimeout(function(){
				hero.div.style.width = "16px";
				hero.div.style.height = "16px";
				hero.div.style.top = hero.y*hero.vitesse*pas+"px";				
				hero.div.style.left = hero.x*hero.vitesse*pas+"px";
				hero.tourner(hero.sens);
		},180);
}
//##########################################################################

//Attaque devant soi en appuyant sur la touche & - 65
function attaquer(event){
	var touche = event.keyCode;
	//Touche a - 65
	if(touche == 65){
		//checkCollision renvoie une Tile, une Entite ou false si rien ne peut être attaqué
		var col = checkCollision(hero.sens, hero.currentStage, hero);
		if(col == false)
			col = null;
		//Enlevant de la vie à l'entité, et abimant le décors génant 
		hero.attaquer(col);
	}
}
//#######################################################
//Fonction de déplacements 
//#######################################################

//Les fonctions de déplacements marchent toutes de la même manière
//On vérifie que la bonne touche est pressée pour la direction donnée

function deplacementGauche(event){
	/* Touche - sens
	 * 37 - gauche
	 * 38 - haut
	 * 39 - droite
	 * 40 - bas 
	 */
	var touche = event.keyCode;
	if(touche == GAUCHE){
		//Si le héro peut bouger (inventaire pas ouvert)
		if(hero.peutBouger){
			//On change l'apparence du personnage en le tournant vers la gauche
			hero.tourner(GAUCHE);
			//On check s'il y a collision grace à checkCollision
			//renvoie Tile, Entite ou false
			var o = checkCollision(GAUCHE, hero.currentStage, hero);
			
			//Si c'est false, pas de collision on bouge
			if(!o)
				hero.move(0);
			//Si c'est une Tile et que c'es tun trou, on tombe
			if(o instanceof Tile && o.nom == "TROU"){
				hero.tomber(GAUCHE);	
			}
			//Si l'on marche sur un coeur, on le ramasse automatiquement gagnant une vie
			var t = hero.currentStage.get(hero.x, hero.y)["OBJET"];
			if(t != null && t.id == "coeur"){
				hero.recupererVie(t);
			}
		}
		//Si l'inventaire est ouvert, on bouge le curseur de l'inventaire
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(GAUCHE);
	}
}
function deplacementHaut(event){
	var touche = event.keyCode;
	if(touche == HAUT){
		
		if(hero.peutBouger){
			hero.tourner(HAUT);			
			var o = checkCollision(HAUT, hero.currentStage, hero);

			if(!o)
				hero.move(1);
			if(o instanceof Tile && o.nom == "TROU"){
				hero.tomber(HAUT);
			}
			var t = hero.currentStage.get(hero.x, hero.y)["OBJET"];
			if(t != null && t.id == "coeur"){
				hero.recupererVie(t);
			}
		}
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(HAUT);
	}
}
function deplacementDroite(event){
	var touche = event.keyCode;
	if(touche == DROITE){

		if(hero.peutBouger){
			hero.tourner(DROITE);
			var o = checkCollision(DROITE, hero.currentStage, hero);
			
			if(!o){
				hero.move(2);
			}
			if(o instanceof Tile && o.nom == "TROU"){
				hero.tomber(DROITE);
			}
			var t = hero.currentStage.get(hero.x, hero.y)["OBJET"];
			if(t != null && t.id == "coeur"){
				hero.recupererVie(t);
			}
		}
			
			
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(DROITE);
	}
}
function deplacementBas(event){
	var touche = event.keyCode;
	if(touche == BAS){
		if(hero.peutBouger){
			hero.tourner(BAS);
			var o = checkCollision(BAS, hero.currentStage, hero);
			
			if(!o)
				hero.move(3);
			if(o instanceof Tile && o.nom == "TROU"){
				hero.tomber(BAS);
			}
			var t = hero.currentStage.get(hero.x, hero.y)["OBJET"];
			if(t != null && t.id == "coeur"){
				hero.recupererVie(t);
			}
		}
			
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(BAS);
	}
}

//Ramasse un objet en appuyant sur bar d'espace
function action(event){
	var touche = event.keyCode;
	//bar d'espace = 32
	if(touche == 32){
		//Ramasser objet
		if(!hero.inventaire.estAfficher && hero.estAfficher){
			var o = hero.currentStage.get(hero.getX(), hero.getY());
			if(o["OBJET"] != null)
				hero.pick(o["OBJET"]);
		}
	}
}

function checkCollision(direction, stage, e){
	var o;
	//Dans la direction associé, on récupère l'objet dans la case où l'on doit aller
	//stage.get(x, y) renvoie une entite en priorité si elle existe
	//une tile si elle bloque le déplacement
	//null
	if(direction == GAUCHE){
		//Vérification du bord gauche de la map
		if(e.getX()-1 < 0)
			return true;
		o = stage.get(e.getX()-1, e.getY());
	} 
	else if(direction == HAUT){
		//Vérification du bord supérieur de la map
		if(e.getY()-1 < 0)
			return true;
		o = stage.get(e.getX(), e.getY()-1);
	}
	else if(direction == DROITE){
		//Vérification du bord droit de la map
		if(e.getX()+1 > largeurTerrain-1)
			return true;
		o = stage.get(e.getX()+1, e.getY());
	}
	else if(direction == BAS){
		//Vérification du bord inférieur de la map
		if(e.getY()+1 > longueurTerrain-1)
			return true;
		o = stage.get(e.getX(), e.getY()+1);
	}
	
	//Si o n'est pas null
	if(o != null && o != -1){
		//si c'est une tile qui bloque ou si c'est un trou, on renvoie la tile
		if(o["TILE"].getCollide() || o["TILE"].nom == "TROU"){
			return o["TILE"];
		}
		//si c'est une entité, on renvoie l'entité
		if(o["ENTITE"] != null){
			return o["ENTITE"];
		}		
	}
	return false;
}

//Fais apparaitre un objet passé en paramètre
//Principalement utilisé pour faire apparaitre des coeurs, mais possibilité de faire apparaitre d'autres objets
//A la même manière que la fonction d'apparition des monstres, des objets aléatoires 
function spawnerObjet(nom){
	var x;
	var y;
	var stage = hero.currentStage;
		x = rand(0, 29);
		y = rand(0, 24);
		var o = new Objet(x, y, false, nom);
		stage.add(o);
}

//Fais apparaitre des equipements aléatoirements
function spawnerArmeEquipement(nom){
	var x;
	var y;
	var stage = hero.currentStage;
		x = rand(0, 29);
		y = rand(0, 24);
	var r = rand(0, 2);
	if(r == 0){
		var nom = Object.keys(armes)[rand(0, Object.keys(armes).length-1)]
		var o = new Arme(x, y, armes[nom],nom);
		stage.add(o);	
	}
	else if (r == 1){
		var nom = Object.keys(armures)[rand(0, Object.keys(armures).length-1)]
		var o = new Armure(x, y, armures[nom],nom);
		stage.add(o);
	}

}

//Fais apparaitre 1 monstre a des coordonnées aléatoires.
function spawnerMonstre(){
	var x;
	var y;
	var stage = hero.currentStage;
	//On sélectionne un monstre au hasard parmi les monstres disponibles et renseignés dans le tableau
	var nom = Object.keys(ent)[rand(1, Object.keys(ent).length-1)];
//	console.log(nom);
		x = rand(0, 29);
		y = rand(0, 24);
		var o = new Monstre(nom);
		//La fonction add de stage se chargera de déplacer le monstre s'il n'est pas sur le sol
		//collide == true 
		stage.add(o);
		//On affiche le monstre
		o.afficher();
		//On le met en marche (déplacement avec collision et attaque sur le joueur)
		o.moveAuto();
}


//On va chercher à télécharger toutes les armes du jeu depuis la base de données
//Plus précisément, construire un tableau similaire aux tableaux présents dans constantes sous le format:
// armes = { "nomarme":"degats"} (les dégâts étant des entiers)
function chargerArmes(callback) {
	//
    var requete = new XMLHttpRequest();
	var url = "equipement.php";
    requete.open("GET", url, true);
    requete.addEventListener("load", function () {
        callback(requete);
    });
    requete.send(null);
}

//Le résultat de la requête php est encodé en JSON
//Le résultat est converti ensuite en objet Javascript et ranger dans la variable globale armes contenant
// toutes les armes
function traitement(req) {
	var message = req.response;
	armes = JSON.parse(message);
	//console.log(req.responseText);
}


