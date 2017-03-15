
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
	//Renvoie renvoie l'objet s'il est contenu dans l'inventaire sinon false
	contains(o){
		if(o instanceof Objet){
			return this.objets.includes(o);
		}
		return false;
	}
	//renvoie l'objet à l'indice donné
	get(i){
		return this.objets[i];
	}
	//Affiche l'inventaire
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
	//Sélectionne un objet à sa position donné en priorité, si elle n'est pas définie
	//Renvoie l'objet à ses coordonnées x et y de la souris
	selectionner(x, y, pos){
		if(typeof pos === "undefined"){
			pos = -1;
		}
		if(this.estAfficher){
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
	
	//Sers principalements à se mettre devant le stage
	changeStage(){
		hero.currentStage.stage.appendChild(this.div);
	}
	removeStage(){
		hero.currentStage.stage.removeChild(this.div);
	}
	
	//Bouge le curseur de selection d'objet
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
