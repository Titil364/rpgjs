
//######################################################################
//Initialisation des variables globales
//######################################################################

var dossierImages = "images/";

const pas = 16;
const GAUCHE = 37;
const HAUT = 38;
const DROITE = 39;
const BAS = 40;

var longueurTerrain = 25;
var largeurTerrain = 30;

var terrain;
var hero;
//######################################################################
//Initialisation des constantes
//######################################################################

//Constante donnant les coordonnées des entités sur leur image pour le changement de sens au déplacement
//donne aussi la vie du monstre
const ent = {
	"hero" : {
		"GAUCHE" : {x:0, y:7},
		"HAUT" : {x:0, y:1},
		"DROITE" : {x:0, y:3},
		"BAS" : {x:0, y:5}
		},
	"M1" : {
		"vie" : 2,
		"GAUCHE" : {x:0, y:15},
		"HAUT" : {x:0, y:9},
		"DROITE" : {x:0, y:11},
		"BAS" : {x:0, y:13}
		},
	"M2" : {
		"vie" : 4,
		"GAUCHE" : {x:0, y:7},
		"HAUT" : {x:0, y:1},
		"DROITE" : {x:0, y:3},
		"BAS" : {x:0, y:5}
	}
}
var armures = {
	"armorBadass" : 5,
	"armor" : 15
}
var armes;

const typeTiles = {
	"SOL1" : {x:10, y:0, collide:null},
	"SOL2" : {x:11, y:0, collide:null},
	"SOL3" : {x:12, y:0, collide:null},
	"SOL4" : {x:10, y:1, collide:null},
	"SOL5" : {x:11, y:1, collide:null},
	"SOL6" : {x:12, y:1, collide:null},
	"SOL7" : {x:10, y:2, collide:null},
	"SOL8" : {x:11, y:2, collide:null},
	"SOL9" : {x:12, y:2, collide:null},
	"SOL10" : {x:12, y:2, collide:null}, //sol rocheux 2
	"SOL11" : {x:12, y:2, collide:null}, //sol rocheux 3
	"HERBE" : {x:10, y:7, collide:null},
	"HERBEACOUPE" : {x:10, y:5, collide:true},
	"HERBECOUPE" : {x:11, y:5, collide:null},
	"STATUE" : {x:10, y:6, collide:true},
	"TROUBOUCHE" : {x:10, y:8, collide:null},
	"TROU" : {x:11, y:8, collide:true},
	"ECHELLE" : {x:17, y:7, collide:null},
	"ARBRE" : {x:14, y:2, collide:true},
	"ARBRE1" : {x:15, y:2, collide:true},
	"ARBRE2" : {x:16, y:2, collide:true},
	"ARBRE3" : {x:14, y:3, collide:true},
	"ARBRE4" : {x:15, y:3, collide:true},
	"ARBRE5" : {x:16, y:3, collide:true},
	"ARBRE6" : {x:14, y:4, collide:true},
	"ARBRE7" : {x:15, y:5, collide:true},
	"ARBRE8" : {x:16, y:4, collide:true}
}
