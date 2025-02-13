import { Scene } from 'phaser';

export class Game extends Scene
{
    platforms: Phaser.Physics.Arcade.StaticGroup;
    player : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    cursor : Phaser.Types.Input.Keyboard.CursorKeys;
    stars : Phaser.Physics.Arcade.Group;
    score = 0;
    scoreText: any;

    constructor ()
    {
        super('Game');
    }

    preload()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );

        
    }

    create ()
    {
        this.cursor = this.input.keyboard!.createCursorKeys();
       
        this.add.image(400,300,'sky')
       // made centered! 800/2, 600/2 = 400, 300 
       // top left orientation is this.add.image(0, 0, 'sky').setOrigin(0, 0)
       this.add.image(400,300, 'star')

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        //not static group because its not static!
        // curly braces creates object
        // properties = labels for values, labels generally strings
        this.stars = this.physics.add.group({
            key: 'star',
                //tells us to determine image we create
            repeat: 11,
                // tells us how many times- e.g.; 1, repeat 11 times, = 12
            setXY: {
                // object within object!
                x: 12,
                y: 0,
                stepX: 70,
            }
        });

        // choses random bounce between two numbers
        this.stars.children.iterate( (star:any) => {
            star.setBounceY(Phaser.Math.FloatBetween(0.4,0.8))
            return null;
        })

        this.player = this.physics.add.sprite(100,450, 'dude')

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // sets thing effected by collider, & collider object
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.player, this.platforms);
        //call back = function that calls another func
        this.physics.add.overlap(
            this.player,
            this.stars,
            (player: any, star: any) => { 
                star.disableBody(true,true);
                this.score += 1;
                this.scoreText.setText('score: ' + this.score);
             },
            undefined, 
            this
        );
    this.scoreText = this.add.text (16, 16, 'score: 0', {fontSize: '48px', fill:'#000'});

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    
    }

    update()
    {
        if (this.cursor.left.isDown) { 
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);}

            else if (this.cursor.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);}

            else {   
                this.player.setVelocityX(0);
                this.player.anims.play('turn');}
            
            if (this.cursor.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);}

    }
}
