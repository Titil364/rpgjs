<?php

class Conf {

    static private $debug = true;
    static private $databases = array(
        // Le nom d'hote est infolimon a l'IUT
        // ou localhost sur votre machine
        'hostname' => 'infolimon.iutmontp.univ-montp2.fr',
        // A l'IUT, vous avez une BDD nommee comme votre login
        // Sur votre machine, vous devrez creer une BDD
        'database_name' => 'govinc',
        // A l'IUT, c'est votre login
        // Sur votre machine, vous avez surement un compte 'root'
        'login' => 'govinc',
        // A l'IUT, c'est votre mdp (INE par defaut)
        // Sur votre machine personelle, vous avez creez ce mdp a l'installation
        'password' => 'mbfnedTEFGqQrv46'
    );

    static public function getDebug() {
        return self::$debug;
    }

    static public function getLogin() {
        //en PHP l'indice d'un tableau n'est pas forcement un chiffre.
        return self::$databases['login'];
    }

    static public function getHostName() {
        return self::$databases['hostname'];
    }

    static public function getDatabaseName() {
        return self::$databases['database_name'];
    }

    static public function getPassword() {
        return self::$databases['password'];
    }

}

class Model{
	
    public static $pdo;
    private static $hostname;
    private static $database_name;
    private static $login;
    private static $password;
	
	public static function init(){
        $hostname = Conf::getHostName();
        $database_name = Conf::getDatabaseName();
        $login = Conf::getLogin();
        $password = Conf::getPassword();
        try {
            self::$pdo = new PDO("mysql:host=$hostname;dbname=$database_name", $login, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            // On active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            if (Conf::getDebug()) {
                echo $e->getMessage(); // affiche un message d'erreur
            } else {
                echo 'Une erreur est survenue <a href=""> retour a la page d\'accueil </a>';
            }
            die();
        }
	}	
}
Model::init();

class Arme{
	private $nom;
	private $x;
	private $y;
	private $degats;
	
	public function __construct($n = NULL, $x = NULL, $y = NULL, $d = NULL){
		if(!is_null($n)&&!is_null($x) && !is_null($y)&&!is_null($d)){
			$this->nom = $n;
			$this->x = $x;
			$this->y = $y;
			$this->degats = $d;
		}
	}
	
	public static function getArme(){
		 try {
            $sql = "SELECT * FROM Arme;";
            $req_prep = Model::$pdo->query($sql);
            $req_prep->setFetchMode(PDO::FETCH_CLASS, "Arme");
            $tab_p = $req_prep->fetchAll();
            if (empty($tab_p)) {
                return false;
            }
            return $tab_p;
        }catch (PDOException $ex) {
            if (Conf::getDebug()) {
                echo $ex->getMessage();
            } else {
                echo "une erreur est survenue lors de la sélection des objets.";
            }
            return false;
        }
    }
	
	public function getDegat(){
		return $this->degats;
	}
	public function getNom(){
		return $this->nom;
	}
}

$tab = Arme::getArme();
$arr = array();
foreach($tab as $a){
	$n = $a->getNom();
	$d = intval($a->getDegat(), 10);
	$arr[$n] = $d;
}
echo json_encode($arr);
?>
