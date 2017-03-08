let dossierImages = "images/";
let ecranJeu = document.createElement("div");
ecranJeu.setAttribute("id", "ecranJeu");
ecranJeu.style.width = "320px";
ecranJeu.style.height = "320px";
document.body.appendChild(ecranJeu);
class Objet{

	constructor(x, y, collide, spriteName){
		this.x = x;
		this.y = y;
		this.collide = collide;
		this.pas = 16;
		this.estAficher = false;
		this.sprite = document.createElement("img");
		this.id = spriteName;
		this.sprite.style.display="none";
		this.sprite.setAttribute("id", spriteName);
		this.sprite.setAttribute("src", dossierImages+spriteName+".png");
		this.tailleNormale();
		this.sprite.style.zIndex = "1";
		ecranJeu.appendChild(this.sprite);
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
			this.sprite.style.top = this.y*this.pas+"px";
			this.sprite.style.left = this.x*this.pas+"px";
			this.estAfficher = true;
		}
	}
	desafficher(){
		this.sprite.style.display = "none";
		this.estAfficher = false;
	}

	tailleInventaire(){
		this.sprite.style.width = "24px";
		this.sprite.style.height = "24px";
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
		this.div.style.background = "url("+dossierImages+this.id+".jpg) -7px -29px"; 

		ecranJeu.appendChild(this.div);

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
			this.div.style.display = "inline";
			this.div.style.top = this.y*this.pas+"px";
			this.div.style.left = this.x*this.pas+"px";
			this.estAfficher = true;
			for(var i = 0; i < this.objets.length; i++){
				var o = this.get(i);
				o.tailleInventaire();
				o.setX(this.x);
				o.setY(this.y);
				o.sprite.style.zIndex = "1001";
				o.afficher();
				o.sprite.style.top =  parseInt(o.sprite.style.top, 10)+5+"px";
				o.sprite.style.left = parseInt(o.sprite.style.left, 10)+5+i*35+"px";
				
			}
		}
	}
	desafficher(){
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
			this.containerListe.className = "actions";
			this.containerListe.style.top = y+"px";
			this.containerListe.style.left = x+"px";
		}
	}
}

class Hero extends Entite{
	constructor(nom){
		super(0, 0, 100);
		this.nom = nom;
		this.inventaire = new Inventaire(15);
		this.vitesse = 1;
		this.pas = 16;
		this.estAfficher = false;
		/*this.sprite = document.createElement("img");
		this.sprite.setAttribute("id", "hero");
		this.sprite.setAttribute("src", dossierImages+"hero.png");
		this.sprite.style.position = "relative";
		*/

		this.div = document.createElement("div");
		this.div.setAttribute("id", "heroContainer");
		this.div.style.display = "none";
		this.div.style.width = "16px";
		this.div.style.height = "16px";
		this.div.style.position = "absolute";
		this.div.style.zIndex = "666";
		this.div.style.background = "url("+dossierImages+"hero.png) -3px -16px"; 
			ecranJeu.appendChild(this.div);
//		this.div.appendChild(this.sprite);
	}
	
	move(direction){
		/* Déplace le joueur dans la direction donnée
		 * 0 - gauche
		 * 1 - haut
		 * 2 - droite
		 * 3 - bas
		 */
		if(this.estAfficher){
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
				this.div.style.top = this.y*this.vitesse*this.pas+"px";
				this.div.style.left = this.x*this.vitesse*this.pas+"px";
			}
		}
	}
	pick(o){
		if(!this.estAfficher)
			return false;
		if(!this.inventaire.contains(o)){
			o.desafficher();
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
			this.div.style.top = this.y*this.pas+"px";
			this.div.style.left = this.x*this.pas+"px";
	//		this.sprite.style.width = "16px";
	//		this.sprite.style.height = "16px";
			this.estAfficher = true;
		}
	}
}

let o = new Objet(10, 10, true, "sword");
o.afficher();
let arme = new Arme(5, 5, 15, "sword");
let arme2 = new Arme(7, 7, 15, "sword");
let arme3 = new Arme(6, 6, 15, "sword");
arme2.afficher();
arme3.afficher();
//let armor = new Armure(0, 0, 15);
let objets = [] 
objets.push(arme);
objets.push(arme2);
objets.push(arme3);

objetsCollision = []
objetsCollision.push(o)

objets[0].afficher();
let hero = new Hero("Teub");
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

document.body.addEventListener("contextmenu", actionInventaire);


//######################################################################
function actionInventaire(event){
	hero.inventaire.afficherActions();
}
function drop(event){
	
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


function deplacementGauche(event){
	/* Touche - sens
	 * 37 - gauche
	 * 38 - haut
	 * 39 - droite
	 * 40 - bas 
	 */
	var touche = event.keyCode;
	if(touche == 37){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX()-1 && objetsCollision[i].getY() == hero.getY()){
			}
			else
				hero.move(0);
		}
	}
}
function deplacementHaut(event){
	var touche = event.keyCode;
	if(touche == 38){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX() && objetsCollision[i].getY() == hero.getY()-1){
			}else
				hero.move(1);
		}
	}
}
function deplacementDroite(event){
	var touche = event.keyCode;
	if(touche == 39){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX()+1 && objetsCollision[i].getY() == hero.getY()){
			}else
				hero.move(2);
		}
	}
}
function deplacementBas(event){
	var touche = event.keyCode;
	if(touche == 40){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX() && objetsCollision[i].getY() == hero.getY()+1){
			}
			else
				hero.move(3);
		}
	}
}
function displayInventaire(){
	hero.inventaire.afficher();
}
function pick(event){
	var touche = event.keyCode;
	//bar d'espace = 32
	if(touche == 32){
		for(var i = 0; i < objets.length; i++){
			if(objets[i].getX() == hero.getX() && objets[i].getY() == hero.getY()){
				hero.pick(objets[i]);
			}
		}
	}
}
		
