
class Tile{
	constructor(nom, x, y){
		this.nom = nom;
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
		if(nom == "STATUE")
			this.vie = 99;

	}
	//Ajoute une tile à la suite
	append(stage, follow){
		if(follow === "undefined")
			follow = 0;
		if(follow == 0){
			if(stage == null){
				document.body.appendChild(this.img);
			}
			else{
				stage.cases[this.y][this.x] = {
					"TILE": this,
					"ENTITE": null,
					"OBJET" : null
				}
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
							stage.cases[n][i] = {
								"TILE": this,
								"ENTITE": null,
								"OBJET" : null
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
	
	//On change le tile courant si les degats sont >= à la vie de la tile
	//Permet de couper des herbes ;)
	abimer(degat){
		if(this.collide != null && this.collide){
			if(this.nom != "TROU" && degat >= this.vie){
				this.nom = Object.keys(typeTiles)[Object.keys(typeTiles).indexOf(this.nom)+1];
				this.collide = typeTiles[this.nom]["collide"];
				let a = -(16*typeTiles[this.nom]["x"]);
				let b = -(16*typeTiles[this.nom]["y"]);
				this.img.style.background = "url(tiles/base.png) "+a+"px "+b+"px";
				this.vie = 0;
			}
		}
	}
}