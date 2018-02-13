//@flow

import NewState from "./core/newstate";
import {
	//State,
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
const collision = debug.collision;

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

class Game extends NewState {

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

	static allObjects:Array<any>;
	static objectA:any;
	static objectB:any;
	static rtreeGroupA:Array<any>;
	static rtreeGroupB:Array<any>;

	static EnemyToCompareDifference:Vector;
	static HCollisionDetectionDistance:Vector;
	static VCollisionDetectionDistance:Vector;

	static camera:Rectangle;

	static drawBorders:any;
	static drawDebug:any;

	static workingBoundingBox:Vector;

	/* Pass self into Sprite for secure inheritence ( SS ) */

	constructor(){

		super(Game);
	}

	/* Asyncronous initilization of the state.
	*	SpiceJS will wait to run update and draw until this is done.
	*/

	static async init():Promise<void> {

		this.objectA = null;
		this.objectB = null;

		this.workingBoundingBox = new Vector();
		this.workingComparison = new Vector();

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
			let tempSkeleton:Skeleton = await new Skeleton(this.sprSkeleton[0],175+i*(Math.random()*25),120 + Math.random()*55,-1,1,1,0,-3,(264/11),35,this.visuals);
			//tempSkeleton.priority = 1000;
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

		//Set CollisionNodes
		this.rtree = new RTree(collision.rtree_nodes);

		this.EnemyToCompareDifference = new Vector(0,0);
		this.HCollisionDetectionDistance = new Vector(0,0);
		this.VCollisionDetectionDistance = new Vector(0,0);

		this.allObjects = new Array(collision.object_memorybuffer);
		this.camera = new Rectangle((0),(0), (320),(180));

	}

	static draw(){

		//TODO: put this into spicejs state class
		if (!this.ready){

			return;
		}

		this.drawBorders();
		this.drawDebug();

		//debug TODO: move to player
		//if (this.debug)
		//this.visuals.rect_ext(this.player.getX(), this.player.getY()-25,this.player.w/1.25,25,1, this.debugAlpha ,1,col)

	}


	static update() {

		document.title = 'Demo - ' + this.visuals.app.fps;

		//TODO: put this into spicejs state class
		if (!this.ready)
			return;

		//Background
		if (this.visuals.app.Loading){
			this.visuals.app.Loading.BackgroundManager.updatePositionBasedOnPlayer(this.player);
		}

		//Players
		this.player.update();

		if (this.player.x>20){
			this.UI.update();
		}

		//region Collision

		// Task here is to filter and retrieve all objects from the enemies queue such that:
		//		is alive
		//		is in view

		this.allObjects = new Array(this.enemies.length-1);
		this.allObjects[this.enemies.length] = this.player;


		let i = this.enemies.length-1;
		for(i; i>=0; i--){

			let item = this.enemies[i];
			if (item.checkActive(null)==null){
				continue;
			}
			item.update();

			if (((item:any).delete==false)&&(item.x<320)&&(item.x>0)) {
				this.allObjects[i] = item;
			}

		}

		//TODO: properly extend array types
		this.allObjects = (this.allObjects:any).clean();

		//clear and reload list of objects to check
		this.rtree.clear();
		this.rtree.load(this.allObjects);

		//return if objects are not inside camera TODO: use mins?
		if (!this.rtree.collides(this.camera.mins))
			return;

		//find objects that are inside camera object
		this.rtreeGroupA = this.rtree.search(this.camera.mins);

		//loop camera objects
		i = this.rtreeGroupA.length-1;
		for(i; i>=0;i--){

			//return if this object does collide
			if (!this.rtree.collides(this.rtreeGroupA[i]))
				continue;

			//get working object
			this.objectA = this.rtreeGroupA[i];
			this.objectA.collision = 0;
			//this.objectA.priority = 100 - Math.floor(-this.objectA.getY()/100);

			this.workingBoundingBox.position = new Vector(
				this.objectA._boundingBoxWidth+(this.objectA._boundingBoxWidth/360),
				this.objectA._boundingBoxHeight+(this.objectA._boundingBoxHeight/360)
			);

			//find objects that collide with objects in view TODO: possibly create new RTREE for these? no maybe? idk
			this.rtreeGroupB = this.rtree.search(this.objectA);

			//loop colliding objects
			for(let i = 0; i<= this.rtreeGroupB.length-1;i++){
				//region collision

				//get working object
				this.objectB = this.rtreeGroupB[i];
				this.objectB.collision = 0.2;

				//calculate difference between objects
				this.diff = Vector.Difference(this.objectA, this.objectB);
				this.workingComparison = Vector.Difference(this.objectA, this.objectB);

				//objects intersect
				if (this.objectB.intersects1d(this.workingComparison.x,-this.workingBoundingBox.x,this.workingBoundingBox.x))
				if (this.objectB.intersects1d(this.workingComparison.y,-this.workingBoundingBox.y,this.workingBoundingBox.y)){

					this.objectB.move(new Vector(-this.workingComparison.x/100,0))
					this.objectB.collision = 0.3;
					this.objectA.collision = 0.3;
					// - Math.random()*1/100;//compare_enemy.velocity.x+=Enemy.dir/1.5,collision = true;
				}else{

					//If overlapping
					if (this.workingComparison.x>-0.5)
					if (this.workingComparison.x<0.5){
						this.objectB.move(new Vector(1,0))
						this.objectB.collision = 0.4;
						this.objectA.collision = 0.4;
					}
				}
				continue;
				if (this.workingComparison.x<d)
				if (this.workingComparison.x>-d)
				if (this.workingComparison.y<d2)
				if (this.workingComparison.y>-d2){

					this.objectB.move(new Vector((this.workingComparison.x)/-75 ,(this.workingComparison.y)/-200));
					//this.objectA.move(new Vector((this.diff.x)/75 ,(this.diff.y)/200));

					this.objectB.collision = 0.3;
					this.objectA.collision = 0.3;

					//this.rtreeGroupB[i].priority = 1000 + this.rtreeGroupB[i].y/this.rtreeGroupB[i].x;
					//this.rtreeGroupA[i].priority = 1000 + this.rtreeGroupA[i].y/this.rtreeGroupA[i].x;
				}
				d /=2;
				if (this.workingComparison.x<d)
				if (this.workingComparison.x>-d)
				if (this.workingComparison.y<d)
				if (this.workingComparison.y>-d){

					this.objectB.collision = 0.4;
					this.objectA.collision = 0.4;
				}

				this.workingComparison = null;

				//endregion collision
			}



		}

		//endregion rtree

		/*
		let isEmpty = (list, position) => {

			let item;
			for(let i = 0; i<= list.length-1;i++){

				item = list[i];

				if (position.x>item.x-item.width)
				if (position.x<item.x+item.width)
				if (position.y<item.y+item.width)
				if (position.y>item.y-item.width) {

					return true;

				}

			}

			return false;
		};
		*/

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




		return;

	}

}

export {_SCORE_};

export default new Game();

//region quad code
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
//endregion quad code
