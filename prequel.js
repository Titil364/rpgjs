class Objet{

	constructor(x, y, collide, spriteName){
		this.x = x;
		this.y = y;
		this.collide = collide;
		this.pas = 16;
		this.estAficher = false;
		this.sprite = document.createElement("img");
		this.sprite.setAttribute("id", spriteName);
		this.sprite.setAttribute("src", spriteName+".png");
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
			this.sprite.style.top = this.y*this.pas+"px";
			this.sprite.style.left = this.x*this.pas+"px";
			this.sprite.style.width = "16px";
			this.sprite.style.height = "16px";
			this.estAfficher = true;
			document.body.appendChild(this.sprite);
		}
	}
	desafficher(){
		this.sprite.style.display = "none";
		this.estAfficher = false;
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
	constructor(x, y, armor){
		super(x, y, false);
		this.armure = armor;
	}
}
class Entite{
	constructor(x, y, vie){
		this.x = x;
		this.y = y;
		this.vie = vie;
		this.mort = false;
		this.armure = new Armure(0, 0, 1);
		this.arme = new Arme(0, 0, 1);
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
	}
	add(o){
		//On vérifie que l'objet est un objet
		if(o instanceof Objet){
			//On vérifie que l'inventaire n'est pas plein
			if(this.objets.length < this.max){
				this.objets.push(o);
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
				this.objets[index] = null;
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
}

class Hero extends Entite{
	constructor(nom){
		super(0, 0, 100);
		this.nom = nom;
		this.inventaire = new Inventaire(15);
		this.vitesse = 1;
		this.pas = 16;
		this.estAfficher = false;
		this.sprite = document.createElement("img");
		this.sprite.setAttribute("id", "hero");
		this.sprite.setAttribute("src", "hero.png");
		this.sprite.style.zIndex = "666";
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
				this.sprite.style.top = this.y*this.vitesse*this.pas+"px";
				this.sprite.style.left = this.x*this.vitesse*this.pas+"px";
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
				obj.setX(this.x);
				obj.setY(this.y);
				obj.afficher();
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
			this.sprite.style.position = "absolute";
			this.sprite.style.top = this.y*this.pas+"px";
			this.sprite.style.left = this.x*this.pas+"px";
			this.sprite.style.width = "16px";
			this.sprite.style.height = "16px";
			this.estAfficher = true;
			document.body.appendChild(this.sprite);
		}
	}
}

let o = new Objet(10, 10, true, "sword");
o.afficher();
let arme = new Arme(5, 5, 15, "sword");
//let armor = new Armure(0, 0, 15);
let objets = [] 
objets.push(arme);

objetsCollision = []
objetsCollision.push(o)

objets[0].afficher();
let hero = new Hero("Teub");
//######################################################################
// Gestion des evenements
//######################################################################

document.body.addEventListener("keydown", start);
document.body.addEventListener("keydown", deplacement);
document.body.addEventListener("keydown", pick);

//######################################################################
function start(event){
	var touche = event.keyCode;
	if(touche == 27){
		hero.afficher();
	}

}

function deplacement(event){
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
	if(touche == 38){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX() && objetsCollision[i].getY() == hero.getY()-1){
			}else
				hero.move(1);
		}
	}
	if(touche == 39){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX()+1 && objetsCollision[i].getY() == hero.getY()){
			}else
				hero.move(2);
		}
	}
	if(touche == 40){
		for(var i = 0; i < objetsCollision.length; i++){
			if(objetsCollision[i].getCollide() && objetsCollision[i].getX() == hero.getX() && objetsCollision[i].getY() == hero.getY()+1){
			}
			else
				hero.move(3);
		}
	}
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
