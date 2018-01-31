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

import Rectangle from "./core/rectangle";
//import QuadTree from './core/quadtree';
import RTree from './core/rtree';

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
	//static skeletonCount:number = 512;
	static skeletonCount:number = 512;

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
	static hits:any;
	static quad:any;
	static rtree:any;


	static EnemyToCompareDifference:Vector;
	static HCollisionDetectionDistance:Vector;
	static VCollisionDetectionDistance:Vector;

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
			let tempSkeleton:Skeleton = await new Skeleton(this.sprSkeleton[0],175+i*(Math.random()*25),110 + Math.random()*75,-1,1,1,0,-3,(264/11),35,this.visuals);
			tempSkeleton.priority = 5;
			tempSkeleton.game = this;
			tempSkeleton.off.x = 0;
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
		//this.quad = new QuadTree(0,new Rectangle(0,80,320,160));

		//this.quad = window.QuadController.FIND_EMPTY_QUAD(0, new Rectangle(0,80,320,160));

		this.rtree = new RTree(3);

		this.EnemyToCompareDifference = new Vector(0,0);
		this.HCollisionDetectionDistance = new Vector(0,0);
		this.VCollisionDetectionDistance = new Vector(0,0);
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

		//Players
		this.player.update();

		if (this.player.x>20){
			this.UI.update();
		}

		let OffsetX = 0;

		//region Collision


		//region quad


		//let allObjects = this.enemies.filter((item)=>{return !item.delete&&item.getX()<320&&item.getX()>0?true:false;});
		let allObjects = new Array(this.enemies.length-1);
		//console.log(allObjects);
		for(let i = this.enemies.length-1; i>=0; i--){
			let item = this.enemies[i];
			if (((item:any).delete==false)&&(item.getX()<320)&&(item.getX()>0)) {
				allObjects[i] = item;
			}

		}
		allObjects = (allObjects:any).clean();
		//console.log(allObjects);


		let allObjectsLength = allObjects.length-1;

		//var i2 = i;
		let Enemy:Vector|null;
		let	EnemyToCompare:Vector|null;
		let diff;
		//region rtree

		this.rtree.clear();
		this.rtree.load(allObjects);

		//let cC = {minX:0,minY:0, maxX:320, maxY:320};
		let cC = this.player;
		let pC = this.rtree.collides(cC);
		if (pC) {
			console.log(this.rtree.search(cC));

			//console.log(this.rtree.collides(cC));

		}


		//endregion rtree

/*
		this.quad.clear();

		let i = allObjectsLength;
		for (i; i>0; i--) {
		  this.quad.insert(this.enemies[i]);
		}

		let returnObjects = [];
		i = allObjectsLength;
		for (i; i>0; i--) {
		  returnObjects = [];
		  this.quad.retrieve(returnObjects, allObjects[i]);
		  //window.RO = returnObjects;
		  for (let x = 0; x < returnObjects.length-1; x++) {
			  	//console.log(returnObjects[x]);
		    // Run collision detection algorithm between objects
		  }
		}
		*/
		//endregion quad

return;

		//for each enemy
		for (i; i>=0;i--){
			continue;
			Enemy = this.enemies[i].checkActive(null);
			if (Enemy==null){

				continue;
			}

			//compare enemy to enemies
			for (i2; i2>=0;i2--){

				EnemyToCompare = this.enemies[i2].checkActive(Enemy);
				if (EnemyToCompare==null){

					//reset compare
					this.EnemyToCompareDifference.x = 0;
					this.EnemyToCompareDifference.y = 0;
					continue;
				}

				//get difference
				this.EnemyToCompareDifference = Vector.Difference(Enemy, EnemyToCompare);
				if (EnemyToCompare.intersects1d(this.EnemyToCompareDifference.x,-20,20)){
					EnemyToCompare.move(new Vector(-this.EnemyToCompareDifference.x/100,0))
					// - Math.random()*1/100;//compare_enemy.velocity.x+=Enemy.dir/1.5,collision = true;
				}else{

					//If overlapping
					if (this.EnemyToCompareDifference.x>-0.5)
					if (this.EnemyToCompareDifference.x<0.5)
						EnemyToCompare.move(new Vector(1,0))

				}

			}

			//Collision with PLAYER
			diff = Vector.Difference(this.player, Enemy);

			//reset enemy collision state
			Enemy.collision = 0;

			//set enemy s based on diff.x
			//Enemy.s = diff.x>0?1:-1;

			//reduce area of checking
			this.HCollisionDetectionDistance = new Vector(-30,30);
			this.VCollisionDetectionDistance = new Vector(-1,1);

			if ((!EnemyToCompare.intersects1d(diff.y,this.HCollisionDetectionDistance.x,this.HCollisionDetectionDistance.y))&&(!EnemyToCompare.intersects1d(diff.x,this.HCollisionDetectionDistance.x,this.HCollisionDetectionDistance.y))){

				continue;
			}


			//set warning colour
			if (EnemyToCompare.intersects1d(diff.x,-this.player.w/1.25,this.player.w/1.25)){
				//col = "#FFFF00";
				//trigger player collision event
				this.player.collideWithEnemy(Enemy);
			} else {

			}

			//move enemy (collision)
			if (EnemyToCompare.intersects1d(diff.x,-this.player.w/5,this.player.w/5)){

				Enemy.position.offset(-1*Enemy.s,0);

			} else {

			}

			//check attacking then enemy (collision)
			if (EnemyToCompare.intersects1d(diff.x,-this.player.w/1.95,this.player.w/1.95)){

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
			if (EnemyToCompare.intersects1d(diff.x,-15,15)){

				Enemy.collision = 2;

			}else{

				if (EnemyToCompare.intersects1d(diff.x,-25,25)){

					Enemy.collision = 1;
				}

			}

		}

		//endregion collision



		if (this.visuals.app.Loading){
			this.visuals.app.Loading.BackgroundManager.updatePositionBasedOnPlayer(this.player);
		}

		return;

	}

}
export {_SCORE_};
export default new Game();
