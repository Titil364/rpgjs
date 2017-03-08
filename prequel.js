
//Renvoie un nombre aléatoire entre deux entier
function rand(min, max){
	return Math.floor((Math.random() * max) + min);
}

class Objet{

	constructor(x, y, collide, spriteName){
		this.x = x;
		this.y = y;
		this.collide = collide;
		this.estAfficher = false;
		this.sprite = document.createElement("img");
		this.id = spriteName;
		this.sprite.style.display="none";
		this.sprite.setAttribute("id", spriteName);
		this.sprite.setAttribute("src", dossierImages+spriteName+".png");
		this.tailleNormale();
		this.sprite.style.zIndex = "1";
	}

	setX(x){ this.x = x;}
	setY(y){ this.y = y;}
	getX(){return this.x;}
	getY(){return this.y;}
	getCollide(){return this.collide;}
	
	afficher(){
		if(!this.estAfficher){
			this.sprite.style.position = "absolute";
			this.sprite.style.display = "inline";
			this.sprite.style.top = this.y*pas+"px";
			this.sprite.style.left = this.x*pas+"px";
			this.estAfficher = true;
		}
	}
	
	desafficher(){
		this.sprite.style.display = "none";
		this.estAfficher = false;
	}

	tailleInventaire(){
		this.sprite.style.width = "33px";
		this.sprite.style.height = "33px";
	}	
	tailleNormale(){
		this.sprite.style.width = "16px";
		this.sprite.style.height = "16px";
	}	
}
class Arme extends Objet{
	constructor(x, y, degat, spriteName){
		super(x, y, false, spriteName);
		this.degat = degat;
	}
	getDegat(){return this.degat;}
}
class Armure extends Objet{
	constructor(x, y, armor, spriteName){
		super(x, y, false, spriteName);
		this.armure = armor;
	}
}
class Entite{
	constructor(x, y, vie){
		this.x = x;
		this.y = y;
		this.vie = vie;
		this.mort = false;
		//Undifined, à fixe;
		this.armure = new Armure(0, 0, 1, "ArmorBadass");
		this.arme = new Arme(0, 0, 1, "ArmeBadass");
		this.estAfficher = false;
	}
	attaquer(e){
		if(this.estAfficher && e instanceof Entite){
			e.prendreDegats(this.arme.getDegat());
		}
	}
	prendreDegats(degat){
		if(this.estAfficher){
			this.vie -= degat*(1-armure.getArmor()/100);
			if(this.vie <= 0){
				this.mort = true;
				this.estMort();
			}
		}
	}
	estMort(){
	}
	setX(x){ this.x = x;}
	setY(y){ this.y = y;}
	getX(){return this.x;}
	getY(){return this.y;}
}
class Inventaire{
	constructor(nbItemMax){
		this.max = nbItemMax;
		this.objets = [];
		this.estAfficher = false;

		//Container de l'inventaire (limiter l'affichage)
		this.div = document.createElement("div");
		this.div.setAttribute("id", "inventaireContainer");
		this.div.style.display = "none";
		this.div.style.position = "absolute";
		this.div.style.width = "138px";
		this.div.style.height = "105px";
		this.div.style.top = "160px";
		this.div.style.left = "160px";
		this.id = "inventaire";
		this.x = 10;
		this.y = 10;
		this.div.style.zIndex = "1000";
		this.div.style.background = "url("+dossierImages+"inventaire.jpg) -8px -30px";
		//this.div.style.top = this.y*pas+"px";
		//this.div.style.left = this.x*pas+"px";
		

		//Actions
		this.containerListe = document.createElement("div");
		this.containerListe.setAttribute("id", "containerListe");
		this.containerListe.style.height = "30px";
		this.containerListe.style.width = "50px";
		this.containerListe.style.position = "absolute";
		this.rem = document.createElement("rem");
		this.rem.setAttribute("id", "rem");
		this.rem.innerHTML = "Jeter";
		this.containerListe.appendChild(this.rem);
		
		this.containerListe.style.display = "none";
		this.div.appendChild(this.containerListe);

	}
	
	add(o){
		//On vérifie que l'objet est un objet
		if(o instanceof Objet){
			//On vérifie que l'inventaire n'est pas plein
			if(this.objets.length < this.max){
				this.objets.push(o);
				if(this.estAfficher){
					this.desafficher();
					this.afficher();
				}
			}
			return true;
		}
		return false;
	}
	remove(o){
		if(o instanceof Objet){
			if(this.objets.includes(o)){
				let index = 0;
				while(index < this.objets.length && this.objets[index] != o){
					index++;
				}
				 this.objets.splice(index, 1);
				return o;
			}
		}
		return null;
	}
	contains(o){
		if(o instanceof Objet){
			return this.objets.includes(o);
		}
		return false;
	}
	get(i){
		return this.objets[i];
	}
	afficher(){
		if(!this.estAfficher){
			hero.peutBouger = false;
			hero.currentStage.stage.appendChild(this.div);
			this.div.style.display = "inline";

			this.estAfficher = true;
			for(var i = 0; i < this.objets.length; i++){
				var o = this.get(i);
				o.tailleInventaire();
				o.setX(this.x);
				o.setY(this.y);
				o.afficher();
				o.sprite.style.zIndex = "1005";
				o.sprite.style.top =  parseInt(o.sprite.style.top, 10)+"px";
				o.sprite.style.left = parseInt(o.sprite.style.left, 10)+i*35+"px";
				
			}
		}
	}
	desafficher(){
		hero.peutBouger = true;
		this.estAfficher = false;
		this.div.style.display = "none";
		for(var i = 0; i < this.objets.length; i++){
			var o = this.get(i);
			o.tailleNormale();
			o.desafficher();
		}
		
	}
	afficherActions(y, x){
		if(this.estAfficher){
			alert(x);
			alert(y);
			this.containerListe.className = "actions";
			this.containerListe.style.display = "inline";
			this.containerListe.style.top = y+"px";
			this.containerListe.style.left = x+"px";
		}
	}
	desaficherActions(){
		if(this.estAfficher){
			this.containerListe.className = "actions";
			this.containerListe.style.display = "none";
		}
	}
	changeStage(){
		hero.currentStage.stage.appendChild(this.div);
	}
	removeStage(){
		hero.currentStage.stage.removeChild(this.div);
	}
}

class Hero extends Entite{
	constructor(nom){
		super(0, 0, 100);
		this.nom = nom;
		this.inventaire = new Inventaire(15);
		this.vitesse = 1;
		this.estAfficher = false;
		this.peutBouger = true;
		/*this.sprite = document.createElement("img");
		this.sprite.setAttribute("id", "hero");
		this.sprite.setAttribute("src", dossierImages+"hero.png");
		this.sprite.style.position = "relative";
		*/
		this.currentStage = "";
		this.div = document.createElement("div");
		this.div.setAttribute("id", "heroContainer");
		this.div.style.display = "none";
		this.div.style.width = "16px";
		this.div.style.height = "16px";
		this.div.style.position = "absolute";
		this.div.style.zIndex = "666";
		this.div.style.background = "url("+dossierImages+"hero.png) -3px -16px"; 
//		this.div.appendChild(this.sprite);
	}
	
	move(direction){
		/* Déplace le joueur dans la direction donnée
		 * 0 - gauche
		 * 1 - haut
		 * 2 - droite
		 * 3 - bas
		 */
		if(this.estAfficher && this.peutBouger){
			this.tourner(direction);
			if(direction == 0){
				this.x-=1;
			}
			else if(direction == 1){
				this.y-=1;
			}
			else if(direction == 2){
				this.x+=1;
			}
			else if(direction == 3){
				this.y+=1;
			}
			if(direction >= 0 && direction <= 3){
				this.div.style.top = this.y*this.vitesse*pas+"px";				
				this.div.style.left = this.x*this.vitesse*pas+"px";
			}
		}
	}
	faceaface(){
		var x = - (3+3*16);
		var y = - (5*16);
		this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
	}
	tourner(direction){
		var x;
		var y;
		if(direction == 0){
			var x = - (3);
			var y = - (7*16);
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
		}
		else if(direction == 1){
			var x = - (3);
			var y = - (16);
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
		}
		else if(direction == 2){
			var x = - (3);
			var y = - (3*16);
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
		}
		else if(direction == 3){
			var x = - (3);
			var y = - (5*16);
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
		}
	}
	pick(o){
		if(!this.estAfficher)
			return false;
		if(!this.inventaire.contains(o)){
			this.currentStage.remove(o);
			return this.inventaire.add(o);
		}
		return false;
	}
	drop(o){
		if(!this.estAfficher)
			return false;
		if(o instanceof Objet && this.inventaire.contains(o)){
			let obj = this.inventaire.remove(o);
			if(o == obj){
				let aff = this.inventaire.estAfficher;
				if(aff){
					this.inventaire.desafficher()
					obj.desafficher();
				}
				obj.setX(this.x);
				obj.setY(this.y);
				obj.tailleNormale();
				obj.afficher();
				if(aff){
					this.inventaire.afficher();
				}
				return true;
			}
			return false;
		}
		return false;
	}
	estMort(){
		//game over
	}
	equiper(equipement){
		if(!this.estAfficher)
			return false;
		if(equipement instanceof Objet){
			if(equipement instanceof Arme && this.inventaire.contains(equipement)){
				let currentArme = this.arme;
				this.arme = equipement;
			}
			else if(equipement instanceof Armure && this.inventaire.contains(equipement)){
				let currentArmure = this.armure;
				this.armure = equipement;
			}
		}
		return false;
	}
	afficher(){
		if(!this.estAfficher){
			this.div.style.display = "inline";
			this.div.style.top = this.y*pas+"px";
			this.div.style.left = this.x*pas+"px";
	//		this.sprite.style.width = "16px";
	//		this.sprite.style.height = "16px";
			this.estAfficher = true;
		}
	}
	changeStage(stage){
		inventaire.removeStage();
		this.stage = stage;
		inventaire.changeStage();
	}
}
const typeTiles = {
	"HERBE1" : {x:10, y:0},
	"HERBE2" : {x:11, y:0},
	"HERBE3" : {x:12, y:0},
	"HERBE4" : {x:10, y:1},
	"HERBE5" : {x:11, y:1},
	"HERBE6" : {x:12, y:1},
	"HERBE7" : {x:10, y:2},
	"HERBE8" : {x:11, y:2},
	"HERBE9" : {x:12, y:2}
	
}
class Tile{
	constructor(nom, x, y){
		this.name = nom;
		this.img = document.createElement("div");
		var i = this.img;
		i.setAttribute("class", nom);
		let a = -(16*typeTiles[nom]["x"]);
		let b = -(16*typeTiles[nom]["y"]);
		i.style.background = "url(tiles/base.png) "+a+"px "+b+"px";
		i.style.zIndex = "0";
		i.style.width = "16px";
		i.style.height = "16px";
		i.style.position = "absolute";
		this.x = x;
		this.y = y;
		i.style.left = this.x*pas+"px";
		i.style.top = this.y*pas+"px";
	}
	append(stage){
		if(stage == null){
			document.body.appendChild(this.img);
		}
		else{
			stage.appendChild(this.img);
		}
	}
}
class Stage{
	constructor(name, longueur, largeur){
		this.height = longueur;
		this.width = largeur;
		
		this.stage = document.createElement("div");
		this.stage.setAttribute("id", name);
		this.stage.setAttribute("class", "stage");
		this.stage.style.height = longueur*16+"px";
		this.stage.style.width = largeur*16+"px";
		
		this.cases = new Array();
		for(var n = 0; n < this.height; n++){
			this.cases[n] = new Array();
			for(var i = 0; i < this.width; i++){
				this.cases[n][i] = null;
			}
		}
		
		document.body.appendChild(this.stage);
	}
	create(){
		new Tile("HERBE1", 0, 0).append(this.stage);
		new Tile("HERBE2", 1, 0).append(this.stage);
		new Tile("HERBE3", 2, 0).append(this.stage);
		new Tile("HERBE4", 0, 1).append(this.stage);
		new Tile("HERBE5", 1, 1).append(this.stage);
		new Tile("HERBE6", 2, 1).append(this.stage);
		new Tile("HERBE7", 0, 2).append(this.stage);
		new Tile("HERBE8", 1, 2).append(this.stage);
		new Tile("HERBE9", 2, 2).append(this.stage);
	}
	add(o){
		if(o instanceof Objet){
			this.cases[o.getX()][o.getY()] = o;
			this.stage.appendChild(o.sprite);
			o.afficher();
		}
		else if(o instanceof Hero){
			this.stage.appendChild(o.div);
			o.currentStage = this;
		}
	}
	get(x, y){
		if(x > 0 && y > 0)
			return this.cases[x][y];
		return null;
	}
	remove(o){
		o.desafficher();
		this.cases[o.getX()][o.getY()] = null;
	}
}

//######################################################################
//Initialisation des variables globales
//######################################################################

var dossierImages = "images/";
/*var ecranJeu = document.createElement("div");
	ecranJeu.setAttribute("id", "ecranJeu");
	ecranJeu.style.width = "320px";
	ecranJeu.style.height = "320px";
	document.body.appendChild(ecranJeu);
	*/

const pas = 16;

var longueurTerrain = 40;
var largeurTerrain = 50;
var terrain = new Stage("Stage1", longueurTerrain, largeurTerrain);

	let hero = new Hero("Teub");
		terrain.add(hero);
		
	let o = new Objet(10, 10, true, "sword");
//	o.afficher();
	let arme = new Arme(5, 5, 15, "sword");
	let arme2 = new Arme(6, 6, 15, "sword");
	let arme3 = new Arme(7, 7, 15, "sword");
	//arme2.afficher();
	//arme3.afficher();
	//let armor = new Armure(0, 0, 15);

	
	terrain.add(arme);
	terrain.add(arme2);
	terrain.add(arme3);
	terrain.add(o);



	
//######################################################################
// Gestion des evenements
//######################################################################

document.body.addEventListener("keydown", start);
document.body.addEventListener("keydown", deplacementGauche);
document.body.addEventListener("keydown", deplacementHaut);
document.body.addEventListener("keydown", deplacementDroite);
document.body.addEventListener("keydown", deplacementBas);
document.body.addEventListener("keydown", pick);
document.body.addEventListener("keydown", drop);

hero.inventaire.div.addEventListener("click", actionInventaire);
hero.inventaire.containerListe.addEventListener("mouseout", desafficherActions);

hero.div.addEventListener("click", changerImage);

//######################################################################
function changerImage(event){
	hero.faceaface();
}
function actionInventaire(event){
	var x = event.clientX;
	var y = event.clientY;
	if(x < 265 && x > 160 && y < 298 && y > 160)
		hero.inventaire.afficherActions(x, y);
}
function drop(event){
	
}
function desafficherActions(event){
	hero.inventaire.desafficherActions();
}

function start(event){
	var touche = event.keyCode;
	if(touche == 27){
		if(hero.estAfficher && !hero.inventaire.estAfficher)
			displayInventaire();
		else if(hero.inventaire.estAfficher)
			hero.inventaire.desafficher();
		hero.afficher();
	}
}

const GAUCHE = 37;
const HAUT = 38;
const DROITE = 39;
const BAS = 40;

function deplacementGauche(event){
	/* Touche - sens
	 * 37 - gauche
	 * 38 - haut
	 * 39 - droite
	 * 40 - bas 
	 */
	var touche = event.keyCode;
	if(touche == GAUCHE){
		if(!checkCollision(GAUCHE, hero.currentStage))
			hero.move(0);
	}
}
function deplacementHaut(event){
	var touche = event.keyCode;
	if(touche == HAUT){
		if(!checkCollision(HAUT, hero.currentStage))
			hero.move(1);
	}
}
function deplacementDroite(event){
	var touche = event.keyCode;
	if(touche == DROITE){
		if(!checkCollision(DROITE, hero.currentStage))
				hero.move(2);
	}
}
function deplacementBas(event){
	var touche = event.keyCode;
	if(touche == BAS){
		if(!checkCollision(BAS, hero.currentStage))
			hero.move(3);
	}
}
function displayInventaire(){
	hero.inventaire.afficher();
}
function pick(event){
	var touche = event.keyCode;
	//bar d'espace = 32
	if(touche == 32){
		if(hero.estAfficher){
			var o = hero.currentStage.get(hero.getX(), hero.getY());
			if(o != null)
				hero.pick(o);
		}
	}
}
function checkCollision(direction, stage){
	if(direction == GAUCHE){
		var o = stage.get(hero.getX()-1, hero.getY());
		if(o != null && o.getCollide()){
			return true;
		}
		return false;
	}
	else if(direction == HAUT){
		var o = stage.get(hero.getX(), hero.getY()-1);
		if(o != null && o.getCollide()){
			return true;
		}
		return false;
	}
	else if(direction == DROITE){
		var o = stage.get(hero.getX()+1, hero.getY());
		if(o != null && o.getCollide()){
			return true;
		}
		return false;
	}
	else if(direction == BAS){
		var o = stage.get(hero.getX(), hero.getY()+1);
		if(o != null && o.getCollide()){
			return true;
		}
		return false;
	}
	return false;
}
