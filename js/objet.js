
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
	deterioration(degat){
		this.armure -= degat;
		if(this.armure <= 0)
			this.armure = 1;
	}
	getArmure(){return this.armure;}
}