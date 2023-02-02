var config = {
    type: Phaser.AUTO,
    width: 1600, height: 1600,
    physics: {
        default: 'arcade',
        arcade: {
        gravity: { y: 500 },
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

var speed1;
var speed2;

var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;
var round = 1;

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
    player = this.physics.add.sprite(100, 450, 'perso');


    // Affichage de l'ennemi
    ennemy1 = this.add.image(400,375,"poisson").setOrigin(0);

    ennemy2 = this.add.image(400,350,"faucon").setOrigin(0);
    
    ennemy3 = this.add.image(400,325,"renard").setOrigin(0);

    speed1 = Phaser.Math.GetSpeed(300,3);
    speed2 = Phaser.Math.GetSpeed(-300,3);

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

    // Faire en sorte que le joueur collide avec les bords du monde
    player.setCollideWorldBounds(true);

    // Faire en sorte que le joueur collide avec les platformes
    this.physics.add.collider(player, calque_pente);
    this.physics.add.collider(player, calque_grotte);
    this.physics.add.collider(player, calque_glace);
    this.physics.add.collider(player, calque_mur_glace);
    this.physics.add.collider(player, calque_neige);
    this.physics.add.collider(player, calque_plateforme);
    this.physics.add.collider(player, calque_danger);
    this.physics.add.collider(player, calque_mortel);
    


    // afficher les animations du personnage lorsqu'il se déplace
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('perso', {start:0,end:3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'perso', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('perso', {start:5,end:8}),
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


}


function update(time,delta){

    if (gameOver){return;}

    if (cursors.left.isDown){ //si la touche gauche est appuyée
        player.setVelocityX(-220); //alors vitesse négative en X
        player.anims.play('left', true); //et animation => gauche
    }
    else if (cursors.right.isDown){ //sinon si la touche droite est appuyée
        player.setVelocityX(220); //alors vitesse positive en X
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

    ennemy1.x += speed1 * delta;

    if (ennemy1.x > 500)
    {
        ennemy1.x = 64;
        
    }

    this.ennemiTween = this.tweens.add({
        targets: this.ennemy3,
        x: 700,
        duration: 2000,
        ease: 'Linear',
        yoyo: true,
        repeat: -1
    });
    
}
