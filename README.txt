
Par GOVIN Cyril G1

Explication du projet


Fonctionnalité : 

Différents événements (click, keydown, evenements personnalisés)
	- click + clientX, clientY utilisé dans drop pour l'inventaire
	- deplacements joueurs et changement de sprite
	- attaquer et changement de sprite
	- curseur dans l'invetaire pour équiper un objet
	- objet ramassable par terre
	- coeur se ramassant automatiquement
	- affichage de statistiques (attaque et vie) du personnage se mettant à jour (Coeur + et -, changement équipement)
	- game over et restart
JSON simple - récupération d'information d'une base de données puis encodage et parsage en array

(Class Stage)
Le terrain est en 25*30 cases. Une case étant en 16*16. 
Chaque case étant un triplet contenant un tableau associatif :
	"OBJET" : obj,
	"TILE" : t,
	"ENTITE": e
	
Permettant ainsi de supperposer plusieurs choses sans problèmes et de gérer les collisions. 


Le jeu n'a pas vraiment de but pour l'instant, le terrain se gère aléatoirement mais il détient les fonctionnalités de bases
si on oublie les NPCs et les dialogues. 

