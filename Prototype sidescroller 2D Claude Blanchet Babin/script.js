// configuration du moteur Phaser
var config = {
    type: Phaser.AUTO,
    width: 1600, height: 1600,
    physics: {
        default: 'arcade',
        arcade: {
        gravity: { y: 0 },
        debug: true
    }},
    scene: {preload: preload, create: create, update: update }
};

new Phaser.Game(config);

// préchrgement de tous les éléments nécessaires au fonctionnement du jeu
function preload(){

    // chargement de la carte
    this.load.image("Phaser_tuilesdejeu","assetsjeu/images/tuile.png");
    this.load.tilemapTiledJSON("carte","assetsjeu/carte.json")

    // chargement de l'interface utilisateur
    this.load.image("interface","assetsjeu/images/ui.png")
    this.load.image("dessus","assetsjeu/images/dessus.png")
    this.load.spritesheet("niveauVie","assetsjeu/images/temperature.png",
    {frameWidth : 20, frameHeight: 79});

    // chargement de personnage
    this.load.spritesheet("perso","assetsjeu/images/perso.png",
    { frameWidth: 32, frameHeight: 64 });

    // chragement des plans du background
    this.load.image("background","assetsjeu/images/background_complet.png")
    this.load.image("fond1","assetsjeu/images/fond_1.png")
    this.load.image("fond2","assetsjeu/images/fond_2.png")
    this.load.image("fond3","assetsjeu/images/fond_3.png")
    this.load.image("fond4","assetsjeu/images/fond_4.png")
    this.load.image("fond5","assetsjeu/images/fond_5.png")

    // chargement des ennemis
    this.load.image("poisson","assetsjeu/images/poisson.png")
    this.load.image("faucon","assetsjeu/images/faucon.png")
    this.load.image("renard","assetsjeu/images/renard.png")

    // chargement de l'interface et du collectable
    this.load.image("piece","assetsjeu/images/piece.png")
    this.load.image("ui","assetsjeu/images/ui.png")
    //ajouter piolet ici
}

// création des variables

// variables joueur
var player;
var playerLife = 5 ;
var playerOpacity ;
var playerDegat = false ;
var playerVitesse = 1 ;
var playerGravity = 500;
var playerSaut = 325;

// autres variables
var platforms;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;

// création du niveau
function create(){

    // chargement de la carte 
    carteDuNiveau = this.add.tilemap("carte");

    // chargement du jeu de tuile
    tileset = carteDuNiveau.addTilesetImage(
        "Tileset premier niveau partie 2",
        "Phaser_tuilesdejeu"
    );
    
    // affichage du background
    this.add.image(0,0,"fond1").setOrigin(0,0);
    this.add.image(0,0,"fond2").setOrigin(0,0);
    this.add.image(0,0,"fond3").setOrigin(0,0);
    this.add.image(0,0,"fond4").setOrigin(0,0);
    this.add.image(0,0,"fond5").setOrigin(0,0);

    // affichage du background en prenant en compte la parllaxe
    // la parallaxe n'intervient pas sur le premier plan car celui n'est pas compatible
    // en effet le décor d'un biome se retrouve dans celui d'u autre biome
    this.backgroundPrallax = this.add.tileSprite(0,0,1600,1600,"fond1");
    this.backgroundPrallax.setOrigin(0,0);
    this.backgroundPrallax.setScrollFactor(1,1);

    this.quatriemePlanPrallax = this.add.tileSprite(0,0,1600,1600,"fond2");
    this.quatriemePlanPrallax.setOrigin(0,0);
    this.quatriemePlanPrallax.setScrollFactor(0.82,1);

    this.troisiemePlanPrallax = this.add.tileSprite(0,0,1600,1600,"fond3");
    this.troisiemePlanPrallax.setOrigin(0,0);
    this.troisiemePlanPrallax.setScrollFactor(0.8,1);

    this.secondPlanPrallax = this.add.tileSprite(0,0,1600,1600,"fond4");
    this.secondPlanPrallax.setOrigin(0,0);
    this.secondPlanPrallax.setScrollFactor(0.65,1);

    this.premierPlanPrallax = this.add.tileSprite(0,0,1600,1600,"fond5");
    this.premierPlanPrallax.setOrigin(0,0);
    this.premierPlanPrallax.setScrollFactor(1,1);
    

    // affichage des calques interactifs

    calque_pente = carteDuNiveau.createLayer(
        "pente",
        tileset
    );

    calque_grotte = carteDuNiveau.createLayer(
        "grotte",
        tileset
    );

    calque_glace = carteDuNiveau.createLayer(
        "glace",
        tileset
    );

    calque_mur_glace = carteDuNiveau.createLayer(
        "mur glace",
        tileset
    );

    calque_decor_glace = carteDuNiveau.createLayer(
        "decor glace",
        tileset
    );

    calque_decor_glace_bis = carteDuNiveau.createLayer(
        "decor glace bis",
        tileset
    );

    calque_support_neige = carteDuNiveau.createLayer(
        "support neige",
        tileset
    );

    calque_neige = carteDuNiveau.createLayer(
        "neige",
        tileset
    );

    calque_plateforme = carteDuNiveau.createLayer(
        "plateforme",
        tileset
    );

    calque_danger = carteDuNiveau.createLayer(
        "danger",
        tileset
    );

    calque_mortel = carteDuNiveau.createLayer(
        "mortel",
        tileset
    );

    // affichage du personnage
    player = this.physics.add.sprite(64, 576, 'perso');
    player.setGravityY(playerGravity); 

    // affichage de l'ennemi
    // préparation de l'emplacement des différents ennemis
    ennemi1 = this.add.image(750,375,"faucon").setOrigin(0);

    ennemi2 = this.add.image(1075,180,"faucon").setOrigin(0);

    ennemi3 = this.add.image(1090,1530,"poisson").setOrigin(0);

    ennemi4 = this.add.image(1360,1245,"poisson").setOrigin(0);

    ennemi5 = this.add.image(1287,896,"renard").setOrigin(0);

    ennemi6 = this.add.image(325,1120,"renard").setOrigin(0);

    ennemi7 = this.add.image(485,896,"renard").setOrigin(0);

    // affichage de l'ennemi interactif
    fauconA = this.physics.add.image(750,375,"faucon");

    // faire en sorte que l'ennemi se déplace en ligne et qu'il fasse des allers-retours
    this.tweens.add({
        targets : fauconA,
        x: 500,
        duration: 3000,
        repeat : -1,
        yoyo : true
    });

    // faire en sorte que l'ennemi se retourne lorsqu'il est au bout de son parcours
    this.time.addEvent({
        delay: 3000,
        repeat: -1,
        callback : function (){
            fauconA.scaleX *=-1;
        }
    });

    // reprise de l'affichage des calques
    // affichage des calques décoratifs

    calque_decor_eau = carteDuNiveau.createLayer(
        "decor eau",
        tileset
    );

    calque_decor = carteDuNiveau.createLayer(
        "decor",
        tileset
    );

    calque_decor_bis = carteDuNiveau.createLayer(
        "decor bis",
        tileset
    );

    calque_collectable = carteDuNiveau.createLayer(
        "collectable",
        tileset
    );

    calque_eau = carteDuNiveau.createLayer(
        "eau",
        tileset
    );

    // collision des plateformes
    calque_pente.setCollisionByProperty({ estSolide: true });
    calque_grotte.setCollisionByProperty({ estSolide: true });
    calque_glace.setCollisionByProperty({ estSolide: true });
    calque_mur_glace.setCollisionByProperty({ estSolide: true });
    calque_neige.setCollisionByProperty({ estSolide: true });
    calque_plateforme.setCollisionByProperty({ estSolide: true });
    calque_danger.setCollisionByProperty({ estSolide: true });
    calque_mortel.setCollisionByProperty({ estSolide: true });
    

    // affiche un texte à l’écran, pour le score
    scoreText=this.add.text(16,16,'score: 0',{fontSize:'32px',fill:'#000'});
        
    // création de la détéction du clavier
    cursors = this.input.keyboard.createCursorKeys();
    // intégration de la barre espace
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // faire en sorte que le joueur collide avec les bords du monde
    // n'est pas compatible avec le fait que le personnage doit pouvoir sauter par dessus l'écran pour avancer à certains endroits
    // voir les premières lignes de la fonction update pour plus d'informations
    /*
    player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0,0,1600,1600);
    */

    // faire en sorte que le joueur collide avec les platformes
    this.physics.add.collider(player, calque_pente, classique, null, this);
    this.physics.add.collider(player, calque_grotte, classique, null, this);
    this.physics.add.collider(player, calque_mur_glace, classique, null, this);
    this.physics.add.collider(player, calque_plateforme, classique, null, this);

    // afficher les animations du personnage lorsqu'il se déplace
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', {start:0,end:11}),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'perso', frame: 12 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('perso', {start:13,end:25}),
        frameRate: 15,
        repeat: -1
    });

    // création de la caméra
    // taille de la caméra
    this.cameras.main.setSize(708,400);

    // faire en sorte que la caméra suive le personnage et qu'elle ne sorte pas de l'écran
    this.cameras.main.startFollow(player);
    this.cameras.main.setDeadzone(100,100);
    this.cameras.main.setBounds(0,0,1600,1600);
    
    // affichage de l'interface utilisateur
    this.add.sprite(0,0,"interface").setOrigin(0,0).setScrollFactor(0);
    lifeUI = this.add.sprite(14,87, "niveauVie").setOrigin(0,0).setScrollFactor(0);
    this.add.sprite(0,0,"dessus").setOrigin(0,0).setScrollFactor(0);

    // séparation des calques selon l'effet que recevra le personnage
    // Le personnage recevra des dégâts s'il touche le calque danger
    this.physics.add.collider(player, calque_danger, degat, null, this);

    // le personnage avancera doucement s'il est dans la neige
    this.physics.add.collider(player, calque_neige, ralentir, null, this);

    // le personnage aura de l'inertie s'il se déplace sur la glace
    this.physics.add.collider(player, calque_glace,glisse, null, this);

    // le personnage sera ralentit s'il est dans l'eau


    // le joueur perd immédiatement la partie s'il touche un danger mortel (grande pique et grande algue)
    this.physics.add.collider(player, calque_mortel,mort, null, this);


    // le personnage perd de la vie s'il touche un ennemi
    this.physics.add.overlap(player,fauconA,collisionfauconA,null,this);


    // création des différents niveaux de vie dans le thermomètre
    this.anims.create({
        key: 'vie5',
        frames: [{ key: 'niveauVie' , frame :  0}],
    })

    this.anims.create({
        key: 'vie4',
        frames: [{ key: 'niveauVie' , frame :  1}],
    })

    this.anims.create({
        key: 'vie3',
        frames: [{ key: 'niveauVie' , frame :  2}],
    })

    this.anims.create({
        key: 'vie2',
        frames: [{ key: 'niveauVie' , frame :  3}],
    })

    this.anims.create({
        key: 'vie1',
        frames: [{ key: 'niveauVie' , frame :  4}],
    })

    this.anims.create({
        key: 'vie0',
        frames: [{ key: 'niveauVie' , frame :  5}],
    })
}

// mise à jour des éléments au fil de l'avancement du joueur dans le niveau
function update(){

    // faire en sorte que le personnage ne puisse pas dépasser les bords gauche et droit
    // inutile pour le bord inférieur car déjà bloquer par les plateformes
    // inutile pour le bord supérieur car doit pouvoir sauter
    if (player.x <= 16){ player.x=16}
    if (player.x >= 1584){ player.x=1584}

    // vérifier la position du personnage pour changer sa gravité s'il est dans l'eau
    if (player.x >=1408 && player.y >= 672){
        player.setGravityY(100);
        playerSaut = 150;
        playerVitesse = 150;
    }

    if (player.y >= 1184){
        player.setGravityY(100);
        playerSaut = 150;
        playerVitesse = 150;
    }

    // remettre la gravité standard lorsqu'il sort de l'eau
    if (player.x <= 1280 && player.y <= 1152){
        player.setGravityY(500);
        playerSaut = 325;
    }


    // mise en place du game over
    if (playerLife == -1){
        gameOver = true;
    }

    if(gameOver){
        perdu=this.add.text(175,80, "GAME OVER",{fontSize:'75px',fill:'#FF0000'}).setScrollFactor(0);
        relace=this.add.text(115,150, "appuyer sur F5 pour recommencer",{fontSize:'30px',fill:'#FF0000'}).setScrollFactor(0);
        lifeUI.destroy();
        return;
    }



    // ajout des moyens de déplacement du personnage
    if (cursors.left.isDown){ //si la touche gauche est appuyée
        player.setVelocityX(- playerVitesse); //alors vitesse négative en X
        player.anims.play('left', true); //et animation => gauche
    }
    else if (cursors.right.isDown){ //sinon si la touche droite est appuyée
        player.setVelocityX(playerVitesse); //alors vitesse positive en X
        player.anims.play('right', true); //et animation => droite
    }
    else{ // sinon
        player.setVelocityX(0); //vitesse nulle
        player.anims.play('turn'); //animation fait face caméra
    }
    if (cursors.up.isDown && (player.body.blocked.down || player.body.blocked.right || player.body.blocked.left)){
        //si touche haut appuyée ET que le perso touche le sol
        player.setVelocityY(-playerSaut); //alors vitesse verticale négative
        //(on saute)
    }

    // animation de la jauge de vie
    if (playerLife == 5){
        lifeUI.anims.play('vie5', true);
    }
    if (playerLife == 4){
        lifeUI.anims.play('vie4', true);
    }
    if (playerLife == 3){
        lifeUI.anims.play('vie3', true);
    }
    if (playerLife == 2){
        lifeUI.anims.play('vie2', true);
    }
    if (playerLife == 1){
        lifeUI.anims.play('vie1', true);
    }
    if (playerLife == 0){
        lifeUI.anims.play('vie0', true);
    }

    // WALLJUMP

}

function degat (){

    // vérifier que le cooldown de degat est disponible
    if (playerDegat == false){

        // retirer de la vie au joueur
        // répercuter directement dans la jauge de vie
        playerLife = playerLife - 1;
        playerDegat = true;
        playerOpacity = true;

        // montrer l'invulnérabilité du personnage ne le faisant clignoter avec l'opacité
        this.time.addEvent({        
            delay : 100,
            callback : () => {
                if(playerOpacity){
                    player.alpha = 0.25;
                    playerOpacity = false
                }
                else {
                    player.alpha = 1;
                    playerOpacity = true;
                }
            },
            repeat : 19
        })

        // activation du cooldown de degat
        this.time.delayedCall(2000, () => {
            playerDegat = false;
            player.alpha = 1;
        });  
    }
}

// fonction intervenant dans le biome neige en extérieur
// montrer que le personnage a du mal à avancer en le ralentissant
function ralentir (){
    playerVitesse = 150
}

// fonction permettant de faire glisser le personnage avec de l'inertie lorsqu'il se trouve dans le biome glace (sauf plateforme car cela rendrait le déplacement beaucoup trop difficile)
function glisse (){
    playerVitesse = 300
    player.setFriction(0.05);
    player.body.setFriction(0.05);
}

// fonction permettent de remettre les valeurs par défaut lorsque le personnage se trouve sur un calque sans altération
function classique (){
    playerVitesse = 300
}

// fonction faisant perdre immédiatement le joueur
function mort(){
    playerLife = -1

    // comme pour le reste des sources de dégât
    // montrer malgré tout que le joueur prend des dégâts en le faisant clignoter

    this.time.addEvent({        
        delay : 100,
        callback : () => {
            if(playerOpacity){
                player.alpha = 0.25;
                playerOpacity = false
            }
            else {
                player.alpha = 1;
                playerOpacity = true;
            }
        },
        repeat : 19
    })
}

// gérer l'interaction entre le joueur et le faucon A
function collisionfauconA() {

    // repérer le bord des hitbox du joueur et de l'ennemi
    var boundsPlayer = player.getBounds();
    var boundsEnemy = fauconA.getBounds();

    // repérer si le personnage touche le dessous de l'ennemi
    if (fauconA.body.touching.down) {

        // lancement de la fonction degat
        if (playerDegat == false){

            playerLife = playerLife - 1;
            playerDegat = true;
            playerOpacity = true;
    
            this.time.addEvent({        
                delay : 100,
                callback : () => {
                    if(playerOpacity){
                        player.alpha = 0.25;
                        playerOpacity = false
                    }
                    else {
                        player.alpha = 1;
                        playerOpacity = true;
                    }
                },
                repeat : 19
            })
    
            this.time.delayedCall(2000, () => {
                playerDegat = false;
                player.alpha = 1;
            });

            // repousser légèrement le personnage dans la direction opposée
            player.setVelocityY(50)
            
        }
    }
    
    // savoir si le bord gauche touche le bord gauche (nécessaire suite au retournement de l'ennemi selon un axe de symétrie)
    // en prenant compte de la hit box, mettre les deux en >
    // en prenant compte du problème de hit box mettre le deuxième en <
    if (boundsPlayer.left >= boundsEnemy.right && boundsPlayer.left >= boundsEnemy.right + 1) {
        
        if (playerDegat == false){

            playerLife = playerLife - 1;
            playerDegat = true;
            playerOpacity = true;
    
            this.time.addEvent({        
                delay : 100,
                callback : () => {
                    if(playerOpacity){
                        player.alpha = 0.25;
                        playerOpacity = false
                    }
                    else {
                        player.alpha = 1;
                        playerOpacity = true;
                    }
                },
                repeat : 19
            })
    
            this.time.delayedCall(2000, () => {
                playerDegat = false;
                player.alpha = 1;
            });
        }
    }
    
    // savoir si le bord droit du joueur touche le bord gauche de l'ennemi
    // avec le deuxième en < on ne prend pas de degat si on se déplace à travers l'ennemi
    // on prend des degats si on est fixe
    // si le deuxième est en > on prend des degats en passant au travers mais aussi lorsque l'on saute sur l'ennemi pour l'éliminer
    if (boundsPlayer.right >= boundsEnemy.left && boundsPlayer.right >= boundsEnemy.left + 1) {
        
        if (playerDegat == false){

            playerLife = playerLife - 1;
            playerDegat = true;
            playerOpacity = true;
    
            this.time.addEvent({        
                delay : 100,
                callback : () => {
                    if(playerOpacity){
                        player.alpha = 0.25;
                        playerOpacity = false
                    }
                    else {
                        player.alpha = 1;
                        playerOpacity = true;
                    }
                },
                repeat : 19
            })
    
            this.time.delayedCall(2000, () => {
                playerDegat = false;
                player.alpha = 1;
            });
        }
    }
    
    // vérifier que le dessous du personnage vient frapper le dessus de l'ennemi
    if (boundsPlayer.bottom >= boundsEnemy.top && boundsPlayer.bottom <= boundsEnemy.top + 1){

        playerLife = playerLife + 1;

        // montrer la victoire du personnage en faisant disparaitre l'ennemi
        fauconA.destroy();

        // montrer le fait que le personnage vient de marcher sur l'ennemi en le faisant légèrement rebondir
        player.setVelocityY(-50)
    }

}
