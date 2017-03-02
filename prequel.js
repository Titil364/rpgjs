class Objet{

	constructor(x, y, collide){
		this.x = x;
		this.y = y;
		this.collide = collide;
	}

	setX(x){ this.x = x;}
	setY(y){ this.y = y;}
	getX(){return this.x;}
	getY(){return this.y;}
	getCollide(){return this.collide;}
	
}
class Arme extends Objet{
	constructor(x, y, degat){
		super(x, y, false);
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
				this.x-=this.vitesse*this.pas;
			}
			else if(direction == 1){
				this.y-=this.vitesse*this.pas;
			}
			else if(direction == 2){
				this.x+=this.vitesse*this.pas;
			}
			else if(direction == 3){
				this.y+=this.vitesse*this.pas;
			}

			if(direction >= 0 && direction <= 3){
				this.sprite.style.top = this.y+"px";
				this.sprite.style.left = this.x+"px";
			}
		}
	}
	pick(o){
		if(!this.estAfficher)
			return false;
		if(!this.inventaire.contains(o)){
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
			this.sprite.style.top = this.y;
			this.sprite.style.left = this.x;
			this.sprite.style.width = "16px";
			this.sprite.style.height = "16px";
			this.estAfficher = true;
			document.body.appendChild(this.sprite);
		}
	}
}

let o = new Objet(0, 0, true);
let arme = new Arme(0, 0, 15);
let armor = new Armure(0, 0, 15);
let hero = new Hero("Teub");
//######################################################################
// Gestion des evenements
//######################################################################

document.body.addEventListener("keydown", start);
document.body.addEventListener("keydown", deplacement);

//######################################################################
function start(event){
	var touche = event.keyCode;
	if(touche == 32){
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
		hero.move(0);
	}
	if(touche == 38){
		hero.move(1);
	}
	if(touche == 39){
		hero.move(2);
	}
	if(touche == 40){
		hero.move(3);
	}
}
