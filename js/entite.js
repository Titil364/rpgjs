
class Entite{
	constructor(name, x, y, vie){
		this.img = name;
		this.x = x;
		this.y = y;
		this.vie = vie;
		this.sens = HAUT;
		this.vitesse = 1;
		this.peutBouger = true;
		this.mort = false;
		this.currentStage = "";
		this.armure = new Armure(0, 0, 1, "ArmorBadass");
		this.arme = new Arme(0, 0, 1, "ArmeBadass");
		this.estAfficher = false;
	}
	//Attaque une entite
	attaquer(e){
		if(this.estAfficher && e instanceof Entite){
			e.prendreDegats(this.arme.getDegat());
			e.move(this.sens);
		}
	}
	//Prend des degats
	prendreDegats(degat){
		if(this.estAfficher && this.vie > 0){
			var currentVie = this.vie;
			//L'armure se détériore en prenant des dégats et le joueur ne perd pas de vie tant qu'il lui reste de l'armure
			((this.armure.getArmure() == degat)?this.vie-=1:(degat-this.armure.getArmure() < 0)?null:this.vie-= (degat-this.armure.getArmure()));
			this.armure.deterioration(degat);
			if(this.vie <= 0){
				this.estMort();
			}
				//On fait clignoter l'entite si elle prend des dégats
				var self = this;
				var t = setInterval(function(){self.blink();}, 125);
				setTimeout(function(){clearInterval(t);}, 1500)	
		}
	}
	//L'entite est morte, on la desaffiche et on la supprime du body/code html
	estMort(){
		if(this.vie <= 0){
			this.desafficher();
			this.currentStage.cases[this.y][this.x]["ENTITE"] = null;
			var s = document.getElementsByClassName("stage");
			s[0].removeChild(this.div);
		}
			
	}
	setX(x){ this.x = x;}
	setY(y){ this.y = y;}
	getX(){return this.x;}
	getY(){return this.y;}
	
	//Change le sprite pour rentre le déplacement dynamique, l'entite se tourne vers un coté
	tourner(direction){
		var x;
		var y;
		var nom;
		//Mauvaise conception, si this est le héros ces coordonnées est le nom de son image, si c'est autre chose (un monstre), c'est son nom
		if(this instanceof Hero?nom = this.img:nom=this.nom);
		if(direction == GAUCHE || direction == 0){
			var x = - (3+16*ent[nom]["GAUCHE"]["x"]);
			var y = - (ent[nom]["GAUCHE"]["y"]*16);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = GAUCHE;
		}
		else if(direction == HAUT || direction == 1){
			var x = - (3+16*ent[nom]["HAUT"]["x"]);
			var y = - (ent[nom]["HAUT"]["y"]*16);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = HAUT;
		}
		else if(direction == DROITE || direction == 2){
			var x = - (3+16*ent[nom]["DROITE"]["x"]);
			var y = - (16*ent[nom]["DROITE"]["y"]);
			this.div.style.background = "url("+dossierImages+this.img+".png) "+x+"px "+y+"px"; 
			this.sens = DROITE;
		}
		else if(direction == BAS || direction == 3){
			var x = - (3+16*ent[nom]["BAS"]["x"]);
			var y = - (ent[nom]["BAS"]["y"]*16);
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
			var x = this.x;
			var y = this.y;
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
				//Les sprites font 16px, on décale donc d'une case on fait * le pas donc * 16
				this.div.style.top = this.y*this.vitesse*pas+"px";
				this.div.style.left = this.x*this.vitesse*pas+"px";
				//On change l'entite de cases pour les collisions
				this.currentStage.cases[y][x]["ENTITE"] = null;
				this.currentStage.cases[this.y][this.x]["ENTITE"] = this;
			}
		}
	}
	drop(o){
		//Si on est pas afficher ou la case contient déjà un objet on ne fait rien
		if(!this.estAfficher || this.currentStage.get(this.getX(), this.getY())["OBJET"] != null)
			return false;
		
		//Si l'inventaire contient bien l'objet on le drop
		if(o instanceof Objet && this.inventaire.contains(o)){
			let obj = this.inventaire.remove(o);
			//On vérifie bien qu'on a bien récupérer le bonne objet
			if(o == obj){
				let aff = this.inventaire.estAfficher;
				//On raffraichi l'affichage de l'inventaire s'il est affiché et on désaffiche l'objet
				if(aff){
					this.inventaire.desafficher()
					obj.desafficher();
				}
				//On change les coordonnées de l'objet pour le mettre à nos pieds
				obj.setX(this.x);
				obj.setY(this.y);
				obj.tailleNormale();
				obj.afficher();
				
				//Si l'inventaire était affiché on le réaffiche
				if(aff){
					this.inventaire.afficher();
				}
				//On met l'objet dans sa case et on le change de plan pour qu'il s'affiche derriere
				this.currentStage.cases[o.getY()][o.getX()]["OBJET"] = o;
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
		}
	}
	desafficher(){
		this.div.style.display = "none";
		this.estAfficher = false;
	}
	changeStage(stage){
		inventaire.removeStage();
		this.stage = stage;
		inventaire.changeStage();
	}
	//Si on tombe dans une direction, on est replacé dans la case d'avant
	tomber(direction){
		/* Déplace le joueur dans la direction donnée
		 * 0 - gauche
		 * 1 - haut
		 * 2 - droite
		 * 3 - bas
		 */
		// on change le css, pour une annimation de rétrécicement de sprite
		this.div.className = "tomber";
		var sens;
		if(direction == GAUCHE){
			this.move(0);
			sens = 2;
		} 
		else if(direction == HAUT){
			this.move(1);
			sens = 3;
		}
		else if(direction == DROITE){
			this.move(2);
			sens = 0;
		}
		else if(direction == BAS){
			this.move(3);
			sens = 1;
		}
		this.peutBouger = false;
		var self = this;
		setTimeout(function(){self.peutBouger = true; self.move(sens); }, 1100);
		//On prend des dégâts
		setTimeout(function(){ self.prendreDegats(1); self.div.className = "";}, 1200);
	}
	//On affiche et désaffiche le background, donc le sprite de l'entite
	blink(){
		var bg = this.div.style.background;
		var self = this;
		setTimeout(function(){self.div.style.background="";}, 100);
		setTimeout(function(){self.div.style.background = bg;}, 110);
	}
}