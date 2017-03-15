
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
	//Fonction de test
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
	
	//Ajoute un objet sur une case, s'il n'y a pas de tile bloquante
	add(o){
			while(this.cases[o.getY()][o.getX()]["TILE"].getCollide()){
					var r = rand(0 ,1);
					if(r == 0){
						o.x++;
					}else{
						o.y++;
					}
			}
			var t = this.cases[o.getY()][o.getX()];
			if(o instanceof Objet){
				t["OBJET"] = o;
				this.stage.appendChild(o.sprite);
				o.afficher();
			}
			if(o instanceof Entite){
				t["ENTITE"] = o;
				this.stage.appendChild(o.div);
				o.currentStage = this;
			}
			

	}
	//renvoie le triplet de la case 
	get(x, y){
		if(x >= 0 && x < this.width && y >= 0 && y < this.height){
			var t = this.cases[y][x];
			return t;
		}

		return null;
	}
	//Supprimer un objet, entite ou une tile
	remove(o){
		o.desafficher();
		if(o instanceof Objet){
			this.cases[o.getY()][o.getX()]["OBJET"] = null;	
		}
		else if (o instanceof Entite){
			this.cases[o.getY()][o.getX()]["ENTITE"] = null;	
		}
		else if (o instanceof Tile){
			this.cases[o.getY()][o.getX()]["TILE"] = null;	
		}
		
	}
}