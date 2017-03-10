
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
		this.sprite.style.position = "absolute";
		var s = document.getElementsByClassName("stage");
		s[0].appendChild(this.sprite);
	}

	setX(x){ this.x = x;}
	setY(y){ this.y = y;}
	getX(){return this.x;}
	getY(){return this.y;}
	getCollide(){return this.collide;}
	
	afficher(){
		if(!this.estAfficher){
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
		this.sprite.style.width = "32px";
		this.sprite.style.height = "32px";
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
	constructor(name, x, y, vie){
		this.img = name;
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
			this.vie -= degat;
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
	
	tourner(direction){
		var x;
		var y;
		if(direction == GAUCHE || direction == 0){
			var x = - (3);
			var y = - (7*16);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = GAUCHE;
		}
		else if(direction == HAUT || direction == 1){
			var x = - (3);
			var y = - (16);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = HAUT;
		}
		else if(direction == DROITE || direction == 2){
			var x = - (3);
			var y = - (3*16);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = DROITE;
		}
		else if(direction == BAS || direction == 3){
			var x = - (3);
			var y = - (5*16);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = BAS;
		}
	}
	move(direction){
		/* Déplace le joueur dans la direction donnée
		 * 0 - gauche
		 * 1 - haut
		 * 2 - droite
		 * 3 - bas
		 */
		if(this.estAfficher && this.peutBouger){
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
	drop(o){
		if(!this.estAfficher || this.currentStage.get(this.getX(), this.getY()) instanceof Objet )
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
				this.currentStage.cases[o.getY()][o.getX()] = o;
				o.sprite.style.zIndex = "0";
				return true;
			}
			return false;
		}
		return false;
	}
	afficher(){
		if(!this.estAfficher){
			this.div.style.display = "inline";
			this.div.style.top = this.y*pas+"px";
			this.div.style.left = this.x*pas+"px";
			this.estAfficher = true;
			this.afficherStats();
		}
	}
	changeStage(stage){
		inventaire.removeStage();
		this.stage = stage;
		inventaire.changeStage();
	}
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
		this.div.style.width = "136px";
		this.div.style.height = "102px";
		this.div.style.top = "160px";
		this.div.style.left = "160px";
		this.id = "inventaire";
		this.x = 10;
		this.y = 10;
		this.div.style.zIndex = "1000";
		this.div.style.background = "url("+dossierImages+"inventaire.jpg) -8px -30px";
		//this.div.style.top = this.y*pas+"px";
		//this.div.style.left = this.x*pas+"px";
		this.posCursor = 0;	

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
		
		this.cursor = document.createElement("div");
		let c = this.cursor;
		c.setAttribute("id", "inventaireCursor");
		this.div.appendChild(c);
		c.style.top = "0px";
		c.style.left = "0px";
	}
	
	add(o){
		//On vérifie que l'objet est un objet
		if(o instanceof Objet){
			//On vérifie que l'inventaire n'est pas plein
			if(this.objets.length < this.max){
				o.sprite.addEventListener("click", drop);
				this.objets.push(o);
				if(this.estAfficher){
					this.desafficher();
					this.afficher();
				}
				return true;
			}
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
				o.sprite.removeEventListener("click", drop);
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
			var x = 0;
			var y = 0;
			var o;
			this.estAfficher = true;
			for(var i = 0; i < this.objets.length; i++){
				if(i!=0 && i%4 == 0){
					x = 0;
					y++;
				}
				o = this.get(i);
				o.tailleInventaire();
				o.setX(this.x);
				o.setY(this.y);
				o.afficher();
				o.sprite.style.zIndex = "1005";
				o.sprite.style.top =  parseInt(o.sprite.style.top, 10)+y*35+"px";
				o.sprite.style.left = parseInt(o.sprite.style.left, 10)+x*35+"px";

				x++;
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
	selectionner(x, y, pos){
		if(typeof pos === "undefined"){
			pos = -1;
		}
		if(this.estAfficher){
			console.log(pos);
			if(pos > -1 && pos < this.max){
				return this.get(pos);
			}
			var i = 0;
			var n = 0;
			var decalX = parseInt(this.div.style.left, 10);
			var decalY = parseInt(this.div.style.top, 10);
			x = x - decalX;
			y = y - decalY;
			var compteur = 0;
			//console.log("x : "+x+" | y : "+y);
			while(i < 3){
				n = 0;
				while(n < 4){
					if(35*n < x && 35*(n+1) > x && 35*i < y  && 35*(i+1) > y){
				//		console.log(this.get(compteur));
						return this.get(compteur);
					}
					compteur++;
					n++;
				}
				i++;
			}
			
		}
		return null;
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
	moveCursor(direction){
		if(direction == GAUCHE){
			var x = (parseInt(this.cursor.style.left, 10)-33);
			var y = parseInt(this.cursor.style.top, 10);
			if(x < 0){
				var x = (33*3);
				this.posCursor+=3; 
			}
			else{
				this.posCursor-=1;
			}
			this.cursor.style.top = y+"px";
			this.cursor.style.left = x+"px";

		}
		else if(direction == HAUT){
			var x = parseInt(this.cursor.style.left, 10);
			var y = (parseInt(this.cursor.style.top, 10)-33);
			if(y < 0){
				var y = (33*2);
				this.posCursor+=8;
			}
			else{
				this.posCursor-=4;
			}
			this.cursor.style.top = y+"px";
			this.cursor.style.left = x+"px";
		}
		else if(direction == DROITE){
			var x = (parseInt(this.cursor.style.left, 10)+33);
			var y = parseInt(this.cursor.style.top, 10);
			if(x > 33*3){
				var x = 0;
				this.posCursor-= 3;
			}
			else{
				this.posCursor+=1;
			}
			this.cursor.style.top = y+"px";
			this.cursor.style.left = x+"px";
		}
		else if(direction == BAS){
			var x = parseInt(this.cursor.style.left, 10);
			var y = (parseInt(this.cursor.style.top, 10)+33);
			if(y > 33*2){
				var y = 0;
				this.posCursor -=8;
			}
			else{
				this.posCursor += 4;
			}
			this.cursor.style.top = y+"px";
			this.cursor.style.left = x+"px";
		}
	}
}

class Hero extends Entite{
	constructor(nomJ){
		super("hero", rand(0,20), rand(0,20), 3);
		this.nomJoueur = nomJ;
		this.inventaire = new Inventaire(12);
		this.vitesse = 1;
		this.sens = HAUT;
		this.estAfficher = false;
		this.peutBouger = true;
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
	afficherStats(){
		var s = document.getElementById("stats");
		if(s == null){
			s = document.createElement("div");
			s.setAttribute("id", "stats");
			s.style.top = (longueurTerrain+1)*16+"px";
			
			var d = document.createElement("div");
			d.innerHTML = "Attaque : "+this.arme.getDegat();
			s.appendChild(d);
				
			var containerCoeur = document.createElement("div");
			containerCoeur.setAttribute("id", "containerCoeur");
			containerCoeur.innerHTML = "Vie :  ";

			var coeur;
			for(var i = 0; i < this.vie; i++){
				coeur = document.createElement("img");
				coeur.setAttribute("class", "coeur");
				coeur.setAttribute("src", dossierImages+"coeur.png");
				containerCoeur.appendChild(coeur);
			}
			s.appendChild(containerCoeur);
			document.body.appendChild(s);
		}else{
			var d = s.firstChild;
			d.innerHTML = "Attaque : "+this.arme.getDegat();
		}
	}
	prendreDegats(degats){
		super.prendreDegats(degats);
		if(this.vie >= 0){
			var s = document.getElementById("stats").lastChild;
			s.removeChild(s.lastChild);
		}
	}
	pick(o){
		if(o instanceof Objet && o.id == "coeur"){
			this.vie++;
			var coeur = document.createElement("img");
			coeur.setAttribute("class", "coeur");
			coeur.setAttribute("src", dossierImages+"coeur.png");
			var s = document.getElementById("stats").lastChild;
			s.appendChild(coeur);
			this.currentStage.remove(o);
			return true;
		}
		if(!this.estAfficher)
			return false;
		if(!this.inventaire.contains(o)){
			if(this.inventaire.add(o)){
				this.currentStage.remove(o);
			}
			return true;
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
				return currentArme;
			}
			else if(equipement instanceof Armure && this.inventaire.contains(equipement)){
				let currentArmure = this.armure;
				this.armure = equipement;
				return true;
			}
		}
		return false;
	}
	attaquer(o){
		if(o != null){
			if(o instanceof Entite)
				o.prendreDegats(this.arme.getDegat());	
			if(o instanceof Tile)
				o.abimer(this.arme.getDegat());
		}
		
		if(this.sens == GAUCHE){
			var x = - (67);
			var y = - (7*16);
			this.div.style.width = "28px";
			this.div.style.left = (parseInt(this.div.style.left, 10)-15)+"px";
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
		}
		else if(this.sens == HAUT){
			var x = - (3+72);
			var y = 0;
			this.div.style.height = "30px";
			this.div.style.top = (parseInt(this.div.style.top, 10)-16)+"px";
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px";
		}
		else if(this.sens == DROITE){
			var x = - 118;
			var y = - (3*16);
			this.div.style.width = "30px";
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px"; 
		}
		else if(this.sens == BAS){
			var x = - 125;
			var y = - (4*16);
			this.div.style.height = "30px";
			this.div.style.top = parseInt(this.div.style.top, 10)+ +"px";
			this.div.style.background = "url("+dossierImages+"hero.png) "+x+"px "+y+"px";
		}
		if(document.createEvent) {
			document.body.dispatchEvent(aNormale);
		} else {
			document.body.fireEvent(aNormale.eventType, aNormale);
		}
	}
}
const typeTiles = {
	"SOL1" : {x:10, y:0, collide:null},
	"SOL2" : {x:11, y:0, collide:null},
	"SOL3" : {x:12, y:0, collide:null},
	"SOL4" : {x:10, y:1, collide:null},
	"SOL5" : {x:11, y:1, collide:null},
	"SOL6" : {x:12, y:1, collide:null},
	"SOL7" : {x:10, y:2, collide:null},
	"SOL8" : {x:11, y:2, collide:null},
	"SOL9" : {x:12, y:2, collide:null},
	"SOL10" : {x:12, y:2, collide:null}, //sol rocheux 2
	"SOL11" : {x:12, y:2, collide:null}, //sol rocheux 3
	"HERBE" : {x:10, y:7, collide:null},
	"HERBEACOUPE" : {x:10, y:5, collide:true},
	"HERBECOUPE" : {x:11, y:5, collide:null},
	"TROUBOUCHE" : {x:10, y:8, collide:null},
	"TROU" : {x:11, y:8, collide:null},
	"ECHELLE" : {x:17, y:7, collide:null},
	"STATUE" : {x:10, y:6, collide:true},
	"ARBRE" : {x:14, y:2, collide:true},
	"ARBRE1" : {x:15, y:2, collide:true},
	"ARBRE2" : {x:16, y:2, collide:true},
	"ARBRE3" : {x:14, y:3, collide:true},
	"ARBRE4" : {x:15, y:3, collide:true},
	"ARBRE5" : {x:16, y:3, collide:true},
	"ARBRE6" : {x:14, y:4, collide:true},
	"ARBRE7" : {x:15, y:5, collide:true},
	"ARBRE8" : {x:16, y:4, collide:true},
	
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
		this.collide = typeTiles[nom]["collide"];
		this.vie = 0;
		if(nom == "HERBEACOUPE")
			this.vie = 1;

	}
	append(stage, follow){
		if(follow === "undefined")
			follow = 0;
		if(follow == 0){
			if(stage == null){
				document.body.appendChild(this.img);
			}
			else{
				stage.cases[this.y][this.x] = this.collide;
				stage.stage.appendChild(this.img);
			}
		}
		else{
			var n = 0;
			var i = 0;
			var add = false;
			while(n < stage.height && !add){
				i = 0;
				if(stage.cases[n][stage.width-1] == -1){
					while(i < stage.width){
						if(stage.cases[n][i] == -1){
							this.move(i, n);
							stage.stage.appendChild(this.img);
							if(this.collide){
								stage.cases[n][i] = this;
							}
							else{
								stage.cases[n][i] = this.collide;
							}
							add = true;
							break;
						}
						i+=1;
					}
				}
				n+=1;
			}
		}
	}
	move(x, y){
		this.x = x;
		this.y = y;
		this.img.style.left = this.x*pas+"px";
		this.img.style.top = this.y*pas+"px";
	}
	getCollide(){
		return this.collide;
	}
	abimer(degat){
		if(this.name == "HERBEACOUPE"){
			if(degat >= this.vie){
				this.nom = "HERBECOUPE";
				this.collide = typeTiles[this.nom]["collide"];
				let a = -(16*typeTiles[this.nom]["x"]);
				let b = -(16*typeTiles[this.nom]["y"]);
				this.img.style.background = "url(tiles/base.png) "+a+"px "+b+"px";

			}
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
				this.cases[n][i] = -1;
			}
		}
		document.body.appendChild(this.stage);
	}
	create(){
		new Tile("SOL1", 0, 0).append(this);
		new Tile("SOL2", 1, 0).append(this);
		new Tile("SOL3", 2, 0).append(this);
		new Tile("SOL4", 0, 1).append(this);
		new Tile("SOL5", 1, 1).append(this);
		new Tile("SOL6", 2, 1).append(this);
		new Tile("SOL7", 0, 2).append(this);
		new Tile("SOL8", 1, 2).append(this);
		new Tile("SOL9", 2, 2).append(this, 1);
	}
	createRandom(){
		for(var n = 0; n < this.height; n++){
			for(var i = 0; i < this.width; i++){
				if(this.cases[n][i] == -1){
				//	var nom = Object.keys(typeTiles)[rand(0, Object.keys(typeTiles).length)];
					var nom = Object.keys(typeTiles)[rand(0, 18)];
					new Tile(nom, 0, 0).append(this, 1);
				}
			}
		}
	
	}
	add(o){
		if(o instanceof Objet){
			if(o.id =="coeur")
			this.cases[o.getY()][o.getX()] = o;
			this.stage.appendChild(o.sprite);
			o.afficher();
		}
		else if(o instanceof Hero){
			this.stage.appendChild(o.div);
			o.currentStage = this;
		}
	}
	get(x, y){
		if(x >= 0 && y >= 0)
			return this.cases[y][x];
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


//Creation evenement personaliser
var aNormale;
if (document.createEvent) {
    aNormale = document.createEvent("HTMLEvents");
    aNormale.initEvent("apparenceNormale", true, true);
} else {
	aNormale = document.createEventObject();
	aNormale.eventType = "apparenceNormale";
}
aNormale.eventName = "apparenceNormale";



const pas = 16;
const GAUCHE = 37;
const HAUT = 38;
const DROITE = 39;
const BAS = 40;

var longueurTerrain = 25;
var largeurTerrain = 30;

var terrain = new Stage("Stage1", longueurTerrain, largeurTerrain);
let hero = new Hero("Teub");
	


	
//######################################################################
// Gestion des evenements
//######################################################################

document.body.addEventListener("keydown", afficherInventaire);
document.body.addEventListener("keydown", deplacementGauche);
document.body.addEventListener("keydown", deplacementHaut);
document.body.addEventListener("keydown", deplacementDroite);
document.body.addEventListener("keydown", deplacementBas);
document.body.addEventListener("keydown", action);
document.body.addEventListener("keydown", begin);
document.body.addEventListener("keydown", attaquer);

//evenement personnalisé
document.body.addEventListener("apparenceNormale", apparenceNormale);

hero.div.addEventListener("click", danser);

window.onload = start;

//######################################################################

function begin(event){
	var touche = event.keyCode;
	//Touche Entrée - 13
	if(touche == 13){
		var s = document.getElementById("ecranTitre");
		document.body.removeChild(s);
		terrain.createRandom()
	let arme = new Arme(5, 5, 15, "sword");
	let arme2 = new Arme(6, 6, 15, "sword");
	let arme3 = new Arme(7, 7, 15, "sword");
	let arme4 = new Arme(8, 8, 15, "sword");
	let arme5 = new Arme(9, 9, 15, "sword");
	terrain.add(arme);
	terrain.add(arme2);
	terrain.add(arme3);
	terrain.add(arme4);
	terrain.add(arme5);
	terrain.add(hero);
		hero.afficher();
		document.body.removeEventListener("keydown", begin);
	spawn("coeur");
	}
		
}
function start(){
	var s = document.createElement("div");
	s.setAttribute("id", "ecranTitre");
	var text = document.createElement("div");
	text.innerHTML = "Appuyer sur entrée";
	document.body.appendChild(s);	
	s.appendChild(text);
}
function drop(event){
	var o = hero.inventaire.selectionner(event.clientX, event.clientY);
	hero.drop(o);
}
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

function afficherInventaire(event){
	var touche = event.keyCode;
//			console.log(event.keyCode);
	if(touche == 27){
		if(hero.estAfficher && !hero.inventaire.estAfficher){
			displayInventaire();
			document.body.addEventListener("keydown", equiper);
		}
		else if(hero.inventaire.estAfficher){
			hero.inventaire.desafficher();
			document.body.removeEventListener("keydown", equiper);
		}
	}
}
function equiper(event){
	var touche = event.keyCode;
	if(touche == 13){
		var o = hero.inventaire.selectionner(0, 0, hero.inventaire.posCursor);
		if(o){
			var currentArme = hero.equiper(o);
			hero.inventaire.desafficher();
			hero.inventaire.remove(o);
			hero.inventaire.add(currentArme);
			hero.inventaire.afficher();
			hero.afficherStats();
		}
	}
}

function apparenceNormale(){
	//On remet l'apparence normale après une attaque
		setTimeout(function(){
				hero.div.style.width = "16px";
				hero.div.style.height = "16px";
				hero.div.style.top = hero.y*hero.vitesse*pas+"px";				
				hero.div.style.left = hero.x*hero.vitesse*pas+"px";
				hero.tourner(hero.sens);
		},180);
		setTimeout(function(){
		},250);
}
//##########################################################################

function attaquer(event){
	var touche = event.keyCode;
	//Touche a - 65
	if(touche == 65){
		var col = checkCollision(hero.sens, hero.currentStage, hero);
		if(col == false)
			col = null;
		
		hero.attaquer(col);
	}
}


function deplacementGauche(event){
	/* Touche - sens
	 * 37 - gauche
	 * 38 - haut
	 * 39 - droite
	 * 40 - bas 
	 */
	var touche = event.keyCode;
	if(touche == GAUCHE){
		if(hero.peutBouger)	
			hero.tourner(GAUCHE);
		if(!checkCollision(GAUCHE, hero.currentStage, hero))
			hero.move(0);
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(GAUCHE);
	}
}
function deplacementHaut(event){
	var touche = event.keyCode;
	if(touche == HAUT){
		if(hero.peutBouger)
			hero.tourner(HAUT);
		if(!checkCollision(HAUT, hero.currentStage, hero))
			hero.move(1);
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(HAUT);
	}
}
function deplacementDroite(event){
	var touche = event.keyCode;
	if(touche == DROITE){
		if(hero.peutBouger)
			hero.tourner(DROITE);
		if(!checkCollision(DROITE, hero.currentStage, hero))
				hero.move(2);
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(DROITE);
	}
}
function deplacementBas(event){
	var touche = event.keyCode;
	if(touche == BAS){
		if(hero.peutBouger)
			hero.tourner(BAS);
		if(!checkCollision(BAS, hero.currentStage, hero))
			hero.move(3);
		if(hero.inventaire.estAfficher)
			hero.inventaire.moveCursor(BAS);
	}
}
function displayInventaire(){
	hero.inventaire.afficher();
}
function action(event){
	var touche = event.keyCode;
	//bar d'espace = 32
	if(touche == 32){
		//Ramasser objet
		if(!hero.inventaire.estAfficher && hero.estAfficher){
			var o = hero.currentStage.get(hero.getX(), hero.getY());
			console.log(o);
			if(o != null)
				hero.pick(o);
		}
		//action inventaire
		else if(hero.inventaire.estAfficher){
			
		}
	}
}
function checkCollision(direction, stage, e){
	var o;
	if(direction == GAUCHE){
		if(e.getX()-1 < 0)
			return true;
		o = stage.get(e.getX()-1, e.getY());
	} 
	else if(direction == HAUT){
		if(e.getY()-1 < 0)
			return true;
		o = stage.get(e.getX(), e.getY()-1);
	}
	else if(direction == DROITE){
		if(e.getX()+1 > largeurTerrain-1)
			return true;
		o = stage.get(e.getX()+1, e.getY());
	}
	else if(direction == BAS){
		if(e.getY()+1 > longueurTerrain-1)
			return true;
		o = stage.get(e.getX(), e.getY()+1);
	}
	if(o == true)
		return true;
	if(o != null && o != -1){
		if((o instanceof Objet || o instanceof Tile) && o.getCollide())
			return o;
	}
	return false;
}
function spawn(nom){
	var x;
	var y;
	var stage = hero.currentStage;
	console.log(stage);
		x = rand(0, 24);
		y = rand(0, 29);
	if(stage.cases[y][x] == null){
		var o = new Objet(x, y, false, nom);
		stage.add(o);
	}
	terrain.add(o);
}

	

