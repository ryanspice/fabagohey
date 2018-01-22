//@flow

import {
	State,
	Sprite,
	// $FlowFixMe
} from 'ryanspice2016-spicejs';


import {
	IState
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';


import Time from './time';
import Player from './player';
import Skeleton from './skeleton';
import Letter from './letter';

import UI from './ui/ui';

import utils from './utils';
import debug from '../config';

/* TODO: export properly from spicejs */

declare var require;
declare var Vector;

//import _CHARMAP_ from './maps';

let _CHARMAP_= require.ensure(['../require/maps'],()=>{
   _CHARMAP_ = require('../require/maps').default;
},'maps');

//rename these
let s = 1.125 + 0.2;
let xx = 0;
let xxx = 0;

//TODO: move into the respectable class
const checkEnemy = (e:Sprite,e2:Sprite|null)=>{

	if (e.pState === 'dead' || e === e2){

		return true;
	}

	return false;
}

let _SCORE_ = 0;
//let _LIVES_ = 0;


/* Game state */

class Game extends State {

	//Static game properties
	//static skeletonCount:number = 32;
	static skeletonCount:number = 2;

	static enemies:Array<any>;
	static debug:boolean;
	static debugAlpha:number;
	static debugColour:string;

	static app:any;
	static loader:any;
	static visuals:any;

	static player:any;
	static font:any;
	static line:any;
	static bg:Array<any>;

	static time:any;
	static sprSkeleton:Array<any>;
	static sprKnight:Array<any>;

	static UI:UI;

	/* Pass self into Sprite for secure inheritence ( SS ) */

	constructor(){

		super(Game);
	}

	/* Asyncronous initilization of the state.
	*	SpiceJS will wait to run update and draw until this is done.
	*/

	static async init():Promise<void> {

		//Assign object references.
		this.enemies = [];
		this.debug = debug.collision.masks;
		this.debugAlpha = debug.collision.maskAlpha;
		this.debugColour = '#FFFFFF'
		this.loader = this.app.client.loader;

		//TODO: do not use line, draw a rectangle lol
		//this.line = this.loader.getImageReference('./Untitled');

		this.sprSkeleton = new Array(6);
		this.sprSkeleton = [
			this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Idle'),
			this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Walk'),
			this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Attack'),
			this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Hit'),
			this.loader.getImageReference('./Skeleton/Sprite Sheets/skeleton_parts'),
			this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Dead')
		];

		this.sprKnight = new Array(4);
		this.sprKnight = [
			this.loader.getImageReference('./knight_3_improved_slash_animation_2'),
			this.loader.getImageReference('./knight_walk_animation'),
			this.loader.getImageReference('./knight_3_block'),
			this.loader.getImageReference('./knight_3_idle')
		];

		//Instantiate new player.
		this.player = await new Player(this.sprKnight[0],-20,185,1,1,1,0,0,(167/4),46,this.visuals);



		this.bg = new Array(4);
		this.bg = [
			this.loader.getImageReference('./parallax-forest-back-trees'),
			this.loader.getImageReference('./parallax-forest-lights'),
			this.loader.getImageReference('./parallax-forest-middle-trees'),
			this.loader.getImageReference('./parallax-forest-front-trees'),
		];
		for(let i = 3; i>=0;i--) {
			let item;
			///WARNING: Memory Leak Occurs when not creating these objects.... ???

			((item = this.visuals.createMapObject('Tile',this.bg[i],-this.bg[i].width*s,-30,s,0,xx,0,0,xxx+272,160,3+i)));
			((item = this.visuals.createMapObject('Tile',this.bg[i],0,-30,s,0,xx,0,0,xxx+272,160,3+i)));
			((item = this.visuals.createMapObject('Tile',this.bg[i],this.bg[i].width*s,-30,s,0,xx,0,0,xxx+272,160,3+i)));
		}

		this.player.pState = 'walk';

		this.player.sprWalk = this.sprKnight[1];
		this.player.sprBlock = this.sprKnight[2];
		this.player.sprAttack = this.sprKnight[0];
		this.player.sprIdle = this.sprKnight[3];

		//Set skeleton sprite references
		Skeleton.sprSkeleton = this.sprSkeleton;
		Skeleton.sprIdle = this.sprSkeleton[0];
		Skeleton.sprWalk = this.sprSkeleton[1];

		//Try to randomize skeleton placement
		for (let i = Game.skeletonCount; i>=0;i--){

			//Create skeleton
			let tempSkeleton:Skeleton = await new Skeleton(this.sprSkeleton[0],175+i*(Math.random()*25),130 + Math.random()*45,-1,1,1,0,-3,(264/11),35,this.visuals);
			tempSkeleton.priority = 5;
			tempSkeleton.game = this;
			this.enemies.push(tempSkeleton);

		}
		this.visuals.bufferIndex = 0;

		this.UI = new UI(this.loader.getImageReference('./Cursive1_MyEdit'),this.visuals);


		this.drawBorders = ()=>{

			if (!debug.borders)
				return;

			if (this.app.client.graphics.getErrors()!==0)
				this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#000000");
				else
				this.visuals.rect(0,0,-600/this.app.scale,400,"#000000"),
			this.visuals.rect(this.app.client.setWidth,0,600/this.app.scale,400,"#000000");
			//this.visuals.rect(0,-50,this.app.client.setWidth,50,"#000000");


			//			this.visuals.rect(-1,0,this.app.client.setWidth+2,15,"#000000");
			//		this.visuals.rect(-1,this.app.client.setHeight-15,this.app.client.setWidth+2,15,"#000000");

		}

		//trigger the sprites debug draw event TODO: bring into SpiceJS

		this.drawDebug = ()=> {

			if (!this.debug)
				return;

			let i = this.enemies.length-1
			for (i; i>=0;i--){
				this.enemies[i].drawDebug();
			}

			return;
		}


		this.ready = true;

		//TODO: bring into SpiceJS
		await this.visuals.PrioirtySort();
		await this.visuals.PriorityRegistry.reverse();

	}

	static draw(){

				document.title = 'Demo - ' + this.visuals.app.fps;
		//TODO: put this into spicejs state class
		if (!this.ready)
			return;

		this.drawBorders();
		this.drawDebug();

		let col = "#FFFFFF";
		this.hits = [];

		//debug TODO: move to player
		//if (this.debug)
		//this.visuals.rect_ext(this.player.getX(), this.player.getY()-25,this.player.w/1.25,25,1, this.debugAlpha ,1,col)

	}

	static update() {

		//TODO: put this into spicejs state class
		if (!this.ready){

			return;
		}

		if (this.app.client.graphics.getErrors()!==0) {

			//TODO: logg in SpiceJS. Test.
			console.log('loading'+this.app.client.graphics.getErrors());
		}


		let OffsetX = 0;

		//region Collision
		/*
		var i = this.enemies.length-1;

		//for each enemy
		for (i; i>=0;i--){

			//enemy in enemies
			let Enemy:Sprite = this.enemies[i];

			if (!Enemy.player)
				Enemy.player = this.player;
			Enemy.off.x = OffsetX;
			//validate enemy for collision
			if (checkEnemy(Enemy, null))
				continue;

			//this collide with any other?
			var collision = false;

			//compare enemy to enemies
			for (let i2 = this.enemies.length-1; i2>=0;i2--){

				//compared enemy in enemies
				let compare_enemy = this.enemies[i2];

				//get vector difference
				let compare_difference = Vector.Difference(Enemy.getPosition(), compare_enemy.getPosition());

				//validate compared enemy for collision
				if (checkEnemy(compare_enemy,Enemy))
					continue;

				if (utils.Within(compare_difference.x,-20,20))
					collision = true, compare_enemy.position.x-=compare_difference.x/100 - Math.random()*1/100;//compare_enemy.velocity.x+=Enemy.dir/1.5,collision = true; //TODO tweak
					//(compare_difference.x-Enemy.dir/1.5)*(Math.random()*-1+0.5)
			}

			//if collision with enemy
			//if (collision)
			//				Enemy.position.offset(1*Enemy.s,0);

			//Collision with PLAYER
			let diff = Vector.Difference(this.player.getPosition(), Enemy.getPosition());

			//reset enemy collision state
			Enemy.collision = 0;

			//set enemy s based on diff.x
			Enemy.s = diff.x>0?1:-1;

			//reduce area of checking
			let HCollisionDetectionDistance = new Vector(-40,40);
			let VCollisionDetectionDistance = new Vector(-1,1);

			if ((!utils.Within(diff.y,HCollisionDetectionDistance.x,HCollisionDetectionDistance.y))&&(!utils.Within(diff.x,HCollisionDetectionDistance.x,HCollisionDetectionDistance.y))){

				continue;
			}


			//set warning colour
			if (utils.Within(diff.x,-this.player.w/1.25,this.player.w/1.25)){
				//col = "#FFFF00";
				//trigger player collision event
				this.player.collideWithEnemy(Enemy);
			} else {

			}

			//move enemy (collision)
			if (utils.Within(diff.x,-this.player.w/5,this.player.w/5)){

				Enemy.position.offset(-1*Enemy.s,0);

			} else {

			}

			//check attacking then enemy (collision)
			if (utils.Within(diff.x,-this.player.w/1.95,this.player.w/1.95)){

				//Check player facing direction
				if (((diff.x>0)===(this.player.velocity.x<0))&&(this.player.isAttacking)){

					//Push a hit
					if (this.player.getIndex()===5||8) {
						Enemy.hit=true;
						Enemy.pState='hit';
						Enemy.index=0;
						_SCORE_+=10;
						//this.hits.push(Enemy);
					}

				}

			}

			//Set collision
			if (utils.Within(diff.x,-15,15)){

				Enemy.collision = 2;

			}else{

				if (utils.Within(diff.x,-25,25)){

					Enemy.collision = 1;
				}

			}

		}
		*/
		//endregion collision



		this.player.update();
		if (this.player.x>20){
			this.UI.update();
		}

		if (this.visuals.app.Loading){
			this.visuals.app.Loading.BackgroundManager.updatePositionBasedOnPlayer(this.player);
		}

		return;

	}

}
export {_SCORE_};
export default new Game();
