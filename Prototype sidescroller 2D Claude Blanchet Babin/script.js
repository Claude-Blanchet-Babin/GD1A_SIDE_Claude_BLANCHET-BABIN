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
}

// création des variables
var platforms;

var player;
var playerLife = 5 ;
var playerOpacity ;
var playerDegat = false ;
var playerVitesse = 1 ;
var hit = false;



var wallJumpGauche = false;
var wallJumpDroite = false;
var sautDispo = true;
var hauteurSaut = -380;

var cursors;
var score = 0;
var scoreText;
var gameOver = false;

function create(){

    //this.style.border = "thick solid #0000FF";

    // Chargement de la carte 
    carteDuNiveau = this.add.tilemap("carte");

    // Chargement du jeu de tuile
    tileset = carteDuNiveau.addTilesetImage(
        "Tileset premier niveau partie 2",
        "Phaser_tuilesdejeu"
    );
    
    // Affichage du background

    this.add.image(0,0,"fond1").setOrigin(0,0);
    this.add.image(0,0,"fond2").setOrigin(0,0);
    this.add.image(0,0,"fond3").setOrigin(0,0);
    this.add.image(0,0,"fond4").setOrigin(0,0);
    this.add.image(0,0,"fond5").setOrigin(0,0);

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
    

    // Affichage des calques interactifs

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

    // Affichage du personnage
    player = this.physics.add.sprite(64, 576, 'perso');

    player.setGravityY(500);

    // Affichage de l'ennemi

    ennemi1 = this.add.image(750,375,"faucon").setOrigin(0);

    ennemi2 = this.add.image(1075,180,"faucon").setOrigin(0);

    ennemi3 = this.add.image(1090,1530,"poisson").setOrigin(0);

    ennemi4 = this.add.image(1360,1245,"poisson").setOrigin(0);

    ennemi5 = this.add.image(1287,896,"renard").setOrigin(0);

    ennemi6 = this.add.image(325,1120,"renard").setOrigin(0);

    ennemi7 = this.add.image(485,896,"renard").setOrigin(0);



    fauconA = this.physics.add.image(750,375,"faucon");

    let enemy2 = this.physics.add.image(500,500,"faucon");




    this.tweens.add({
        targets : fauconA,
        x: 500,
        duration: 3000,
        repeat : -1,
        yoyo : true
    });


    this.time.addEvent({
        delay: 3000,
        repeat: -1,
        callback : function (){
            fauconA.scaleX *=-1;
        }
    });








    // Affichage des calques décoratifs

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

    // Collision des plateformes
    calque_pente.setCollisionByProperty({ estSolide: true });
    calque_grotte.setCollisionByProperty({ estSolide: true });
    calque_glace.setCollisionByProperty({ estSolide: true });
    calque_mur_glace.setCollisionByProperty({ estSolide: true });
    calque_neige.setCollisionByProperty({ estSolide: true });
    calque_plateforme.setCollisionByProperty({ estSolide: true });
    calque_danger.setCollisionByProperty({ estSolide: true });
    calque_mortel.setCollisionByProperty({ estSolide: true });
    

    // Affiche un texte à l’écran, pour le score
    scoreText=this.add.text(16,16,'score: 0',{fontSize:'32px',fill:'#000'});
        
    // Création de la détéction du clavier

    cursors = this.input.keyboard.createCursorKeys();
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Faire en sorte que le joueur collide avec les bords du monde
    /*player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0,0,1600,1600);
    */

    // Faire en sorte que le joueur collide avec les platformes
    this.physics.add.collider(player, calque_pente, classique, null, this);
    this.physics.add.collider(player, calque_grotte, classique, null, this);
    this.physics.add.collider(player, calque_mur_glace, classique, null, this);
    this.physics.add.collider(player, calque_plateforme, classique, null, this);
    this.physics.add.collider(player, calque_mortel);

    


    // afficher les animations du personnage lorsqu'il se déplace
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', {start:0,end:11}),
        frameRate: 10,
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
        frameRate: 10,
        repeat: -1
    });

    
    // création de la caméra
    // taille de la caméra
    this.cameras.main.setSize(708,400);


    // faire en sorte que la caméra suive le personnage
    this.cameras.main.startFollow(player);

    this.cameras.main.setDeadzone(100,100);
    this.cameras.main.setBounds(0,0,1600,1600);
    

    // affichage de l'interface utilisateur
    this.add.sprite(0,0,"interface").setOrigin(0,0).setScrollFactor(0);
    lifeUI = this.add.sprite(14,87, "niveauVie").setOrigin(0,0).setScrollFactor(0);
    this.add.sprite(0,0,"dessus").setOrigin(0,0).setScrollFactor(0);

    // Le personnage recevra des dégâts s'il touche le calque danger
    this.physics.add.collider(player, calque_danger, degat, null, this);

    // le personnage avancera doucement s'il est dans la neige
    this.physics.add.collider(player, calque_neige, ralentir, null, this);

    // le personnage glissera s'il se déplace sur la glace
    this.physics.add.collider(player, calque_glace, glisse, null, this);

    // le personnage sera ralentit s'il est dans l'eau


    // le joueur perd immédiatement la partie s'il touche un danger mortel (grande pique et grande algue)


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


function update(){

    if (player.x <= 16){ player.x=16}
    if (player.x >= 1584){ player.x=1584}


    if (gameOver){return;}

    if (cursors.left.isDown){ //si la touche gauche est appuyée
        player.setVelocityX(-220 / playerVitesse); //alors vitesse négative en X
        player.anims.play('left', true); //et animation => gauche
    }
    else if (cursors.right.isDown){ //sinon si la touche droite est appuyée
        player.setVelocityX(220 / playerVitesse); //alors vitesse positive en X
        player.anims.play('right', true); //et animation => droite
    }
    else{ // sinon
        player.setVelocityX(0); //vitesse nulle
        player.anims.play('turn'); //animation fait face caméra
    }
    if (cursors.up.isDown && (player.body.blocked.down || player.body.blocked.right || player.body.blocked.left)){
        //si touche haut appuyée ET que le perso touche le sol
        player.setVelocityY(-325); //alors vitesse verticale négative
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


    //Interaction murs
    //déverouillage des touches
    function lockTouches(){toucheLock = true;}
    //déverouillage du wall jump
    function lockWallJump(){wallJumpLock = true;}
    //Optimisé, latéralisation finie!
    function wallGrab(){
    //grimpe si le gameplay 3 est débloqué                    
    if ((clavier.left.isDown ||clavier.right.isDown) && gameplayLevel >=3){
        player.setVelocityY(-55);
        player.setVelocityX(0);
    } 
    else{
        player.setVelocityY(-5);
        player.setVelocityX(0);
    }
    //saute si le gameplay 2 est débloqué
    if (clavier.up.isDown && wallJumpLock){
        //bloquage des touches pour éviter interférence 
        toucheLock = false;
        //début cooldown wall jump    
        wallJumpLock = false;
        //paramètres d'éjection
        if (clavier.right.isDown){player.setVelocityX(-150);}
        else {player.setVelocityX(150);} 

        player.setVelocityY(-300); 
        //fin bloquage des touches          
        setTimeout(lockTouches, 200)
        //fin du cooldown wall jump
        setTimeout(lockWallJump, 1000)
    }
                }


    /*

    // SAUT

    if(cursors.up.isUp && playerCanJump==false){
        playerCanJump = true;
    }

    if (cursors.up.isDown && player.body.blocked.down && playerCanJump){
        //si touche haut appuyée ET que le perso touche le sol
        player.setVelocityY(-playerJump); //alors vitesse verticale négative
        //(on saute)
        playerCanJump = false;
    }

    // WALLJUMP

    if (player.body.onWall() && !player.body.blocked.down &&  !keySpace.isDown){                //Si le joueur est contre un mur

        player.setVelocityY(50);

        if(cursors.up.isDown && playerCanJump){                      //Et qu'il appuit sur SAUTER,
            player.setVelocityY(-playerJump);
            playerCanJump = false;
            if(customPlayerBound.blocked.right){
                player.setVelocityX(-100);
                playerCanRight = false;

                this.time.delayedCall(250, () => {
                    playerCanRight = true;
                });
            }                                       // Il est repoussé dans la direction opposé et ne
            if(customPlayerBound.blocked.left){     // et ne peut qu'aller dans cette dernière pendant
                player.setVelocityX(100);           // un certain temps court
                playerCanLeft = false;

                this.time.delayedCall(250, () => {
                    playerCanLeft = true;
                });
            }
        }
    }
    else {
        player.body.setGravityY(100);
    }

    // ESCALADE

    if (player.body.onWall() && keySpace.isDown){       //Si le joueur est contre un mur et appuyer sur SPACE

        if(cursors.up.isDown){
             player.setVelocityY(-75);
        }
        else if(cursors.down.isDown){
            player.setVelocityY(175);
        }
        else{
            player.setVelocityY(0);
            player.body.setAllowGravity(false);
        }
    }
    else {
        player.body.setGravityY(100);
        player.body.setAllowGravity(true);
    }

    */



}

function degat (){

    if (playerDegat == false){

        playerLife = playerLife - 1;
     
        playerDegat = true;
        playerOpacity = true;

        // pendant ce temps, son opacité est modifié tous les 100ms pour montrer qu'il est invulnérable.
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

function ralentir (){

    playerVitesse = 2

}

function glisse (){

    playerVitesse = 1

}

function classique (){
    playerVitesse = 1
}

// Gestion de l'intéraction Joueur Ennemi
function collisionfauconA() {

    var boundsPlayer = player.getBounds();
    var boundsEnemy = fauconA.getBounds();

    if (fauconA.body.touching.down) {
        if (playerDegat == false){

            playerLife = playerLife - 1;
         
            playerDegat = true;
            playerOpacity = true;
    
            // pendant ce temps, son opacité est modifié tous les 100ms pour montrer qu'il est invulnérable.
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

            player.setVelocityY(50)
            
        }
    }
    
    // savoir si le bord gauche touche le bord gauche
    // en prenant de la hit box, mettre les deux en >
    // en prenant compte du problème de hit box mettre le deuxième en <


    if (boundsPlayer.left >= boundsEnemy.right && boundsPlayer.left >= boundsEnemy.right + 1) {
        if (playerDegat == false){

            playerLife = playerLife - 1;
         
            playerDegat = true;
            playerOpacity = true;
    
            // pendant ce temps, son opacité est modifié tous les 100ms pour montrer qu'il est invulnérable.
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


    if (boundsPlayer.right >= boundsEnemy.left && boundsPlayer.right <= boundsEnemy.left + 1) {
        if (playerDegat == false){

            playerLife = playerLife - 1;
         
            playerDegat = true;
            playerOpacity = true;
    
            // pendant ce temps, son opacité est modifié tous les 100ms pour montrer qu'il est invulnérable.
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
    
    if (boundsPlayer.bottom >= boundsEnemy.top && boundsPlayer.bottom <= boundsEnemy.top + 1){

        fauconA.destroy();
        player.setVelocityY(-50)
    }

}
