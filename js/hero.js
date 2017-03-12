class Hero extends Entite{
	constructor(nomJ){
		super("hero", rand(0,20), rand(0,20), 3);
		this.nomJoueur = nomJ;
		this.inventaire = new Inventaire(12);
		this.estAfficher = false;
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
			var d1 = document.createElement("div");
			d1.innerHTML = "Armure : "+this.armure.getArmure();
			s.appendChild(d1);
				
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
			d.nextSibling.innerHTML = "Armure : "+this.armure.getArmure();
		}
	}
	afficher(){
		super.afficher();
		this.afficherStats();
	}
	prendreDegats(degats){
		var currentVie = this.vie;
		super.prendreDegats(degats);
		if(currentVie > this.vie && this.vie >= 0){
			for(var i = 0; i < currentVie-this.vie; i++){
				var s = document.getElementById("stats").lastChild;
				s.removeChild(s.lastChild);				
			}

		}else{
			this.afficherStats();
		}
	}
	pick(o){
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
		super.estMort();
		if(document.createEvent) {
			document.body.dispatchEvent(gameover);
		} else {
			document.body.fireEvent(gameover.eventType, gameover);
		}		
	}
	recupererVie(o){
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
				return currentArmure;
			}
		}
		return false;
	}
	attaquer(o){
		if(o != null){
			if(o instanceof Entite)
				o.prendreDegats(this.arme.getDegat());	
			if(o instanceof Tile){
				o.abimer(this.arme.getDegat());	
			}
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