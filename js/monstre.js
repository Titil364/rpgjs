
class Monstre extends Entite{
	constructor(name){
		super("monstre", rand(0, 20), rand(0, 20), ent[name]["vie"]);
		this.inventaire = new Inventaire(1);
		this.estAfficher = false;
		this.div = document.createElement("div");
		var i = this.div;
		i.setAttribute("id", name);
		i.style.display = "none";
		i.style.width = "16px";
		i.style.height = "16px";
		i.style.position = "absolute";
		i.style.zIndex = "666";
		var a = -(16*ent[name]["HAUT"]["x"]+4)
		var b = -(16*ent[name]["HAUT"]["y"])
		i.style.left = this.x*pas+"px";
		i.style.top = this.y*pas+"px";
		this.div.style.background = "url("+dossierImages+"monstre.png) "+a+"px "+b+"px"; 
		this.nom = name;
	}
	estMort(){
		super.estMort();
		if(this.inventaire.objets.length == 1){
			this.drop(this.inventaire.get(0));
		}
	}
	moveAuto(){
		var self = this;
		setInterval(function(){
			var o = checkCollision(37, self.currentStage, self);
			var o1 = checkCollision(38, self.currentStage, self);
			var o2 = checkCollision(39, self.currentStage, self);
			var o3 = checkCollision(40, self.currentStage, self);
			var i = rand(0, 4); 
			if(o instanceof Hero){
				i = 0;
			}else if(o1 instanceof Hero){
				i = 1;
			}else if(o2 instanceof Hero){
				i = 2;
			}else if(o3 instanceof Hero){
				i = 3;
			}
			if(i == 0){
				if(self.peutBouger){
					self.tourner(37);
					
					if(!o || o instanceof Hero){
						self.move(0);
					}
					if(o instanceof Tile && o.nom == "TROU"){
						self.tomber(37);
					}
					if(o instanceof Hero && o.x == self.x && o.y == self.y){
						self.attaquer(o);
					}
				}
			}
			else if(i == 1){
				if(self.peutBouger){
					self.tourner(38);
					
					if(!o1 || o1 instanceof Hero){
						self.move(1);
					}
					if(o1 instanceof Tile && o1.nom == "TROU"){
						self.tomber(38);
					}
					if(o1 instanceof Hero && o1.x == self.x && o1.y == self.y){
						self.attaquer(o1);
					}
				}
			}
			else if(i == 2){
				if(self.peutBouger){
					self.tourner(39);
					
					if(!o2 || o2 instanceof Hero){
						self.move(2);
					}
					if(o2 instanceof Tile && o2.nom == "TROU"){
						self.tomber(39);
					}
					if(o2 instanceof Hero && o2.x == self.x && o2.y == self.y){
						self.attaquer(o2);
					}
				}
			}else if(i == 3){
				if(self.peutBouger){
					self.tourner(40);
					
					if(!o3 || o3 instanceof Hero){
						self.move(3);
					}
					if(o3 instanceof Tile && o3.nom == "TROU"){
						self.tomber(40);
					}
					if(o3 instanceof Hero && o3.x == self.x && o3.y == self.y){
						self.attaquer(o3);
					}
				}
			}
		},rand(500, 1000));
	
	}
}