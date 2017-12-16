//@flow

import {
	State,
	Sprite,
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

/* $FlowFixMe
import {
	IState
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';
*/

import Time from './time';
import Player from './player';
import Skeleton from './skeleton';
import Letter from './letter';

import utils from './utils';
import debug from '../config';

declare var require;
/* TODO: export properly from spicejs */
declare var Vector;

//import _CHARMAP_ from './maps';

let _CHARMAP_= require.ensure(['./maps'],()=>{
   _CHARMAP_ = require('./maps').default;
},'maps');

//rename these
//let s = 1.125 + 0.2;
//let xx = 0;
//let xxx = 0;

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
	static skeletonCount:Number = 12;

	/* Pass self into Sprite for secure inheritence ( SS ) */

	constructor(){

		super(Game);
	}

	/* Asyncronous initilization of the state.
	*	SpiceJS will wait to run update and draw until this is done.
	*/

	static async init():Promise<void> {

		this.enemies = [];

		//Assign object references.
		this.debug = debug.collision.masks;
		this.loader = this.app.client.loader;

		//Assign image references: TODO: use own function
		await (()=>{

			this.font = this.loader.getImageReference('./Cursive1_MyEdit');

			//TODO: do not use line, draw a rectangle lol
			this.line = this.loader.getImageReference('./Untitled');

			this.bg = [
				this.loader.getImageReference('./parallax-forest-back-trees'),
				this.loader.getImageReference('./parallax-forest-lights'),
				this.loader.getImageReference('./parallax-forest-middle-trees'),
				this.loader.getImageReference('./parallax-forest-front-trees'),
			];

			this.sprSkeleton = [
				this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Idle'),
				this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Walk'),
				this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Attack'),
				this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Hit'),
				this.loader.getImageReference('./Skeleton/Sprite Sheets/skeleton_parts'),
				this.loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Dead')
			];

			this.sprKnight = [
				this.loader.getImageReference('./knight_3_improved_slash_animation_2'),
				this.loader.getImageReference('./knight_walk_animation'),
				this.loader.getImageReference('./knight_3_block'),
				this.loader.getImageReference('./knight_3_idle')
			];

		})();

		//Instantiate new player.
		this.player = await new Player(this.sprKnight[0],-20,185,1,1,1,0,0,(167/4),46,this.visuals);

		this.time = await new Time();

		//Set player sprites referencse
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
			this.enemies.push(tempSkeleton);

		}

		this.visuals.bufferIndex = 0;

		//Initalize UI functions and objects
		this.initUI = await (()=>{

			this.characters = _CHARMAP_;

			this.characterList=(string,xx,yy,s=1)=>{

				let arr = [];

				for (let i = string.length-1; i>=0;i--){

					if (string[i]===" "){
						continue;
					}

					let x = (this.characters.indexOf(string[i]));

					let y = 2;
					let l = new Letter(this.font,xx+9*i*s,yy+y,s,1,0,0,0,9,9,this.visuals);
					l.priority = 9;
					l.characterNum = x;
					arr.push(l);

				}

				return arr;
			};

			this.updateCharacterList=(list,string/*, xx, yy*/)=>{

				for (let i = list.length-1;i>=0;i--){
						list[i].characterNum = String(this.characters.indexOf('0'));
				}
				for (let ii = 0;ii<string.length;ii++){

					let x = (this.characters.indexOf(string[ii]));

					list[ii].character = string[ii];
					list[ii].characterNum = String(x);
					//for (var i = list.length-1; i>=0;i--){
					//}
				}

			}

			for (let i = 0;i>=0;i--){
				let t = new Sprite(this.line,0,0+i*3,12,0.5,0,0,0,320,1,this.visuals);
				t.priority = 8;
				t.type = '_image_part';
			}

			this.score = '000000';
			this.multiplier = 'xxx';

			let best = '012345';
			let yourbest = (Number(this.score)||Number('001234'));
			if (yourbest<10000){
				yourbest = '0' + yourbest;
			}
			if (Number(yourbest)<100000){
				yourbest= '0' + yourbest;
			}

			this.UI_ScoreNumbers = this.characterList(String(this.score),0,5,0.5);
			this.UI_Multiplier = this.characterList((this.multiplier),0,10,0.5);
			this.UI_Time = this.characterList('60',320/2-(8*2),5);

			this.UI_Best = this.characterList('Best '+best,378-108	,5,0.5);
			this.UI_Your = this.characterList('You '+yourbest,378-103.5	,10,0.5);

		})();

		//Helper functions

		this.getTime = ()=>{

			let time = this.time.seconds;	//this.time.minutes;// +""+ (this.time.seconds);

			if (this.time.seconds<10){

				time = "0" + this.time.seconds;
			}

			if (Number(time)<60){

				return String(Number(60-Number(time)));
			} else {

				return "XX";
			}

		}

		//Helper: Draw left and right borders

		this.drawBorders = ()=>{

			if (!debug.borders){

				return;
			}

			if (this.app.client.graphics.getErrors()!==0){
				this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#000000");
			}else{
				this.visuals.rect(0,0,-600/this.app.scale,400,"#000000");
				this.visuals.rect(this.app.client.setWidth,0,600/this.app.scale,400,"#000000");
			}

			//this.visuals.rect(0,-50,this.app.client.setWidth,50,"#000000");
			//this.visuals.rect(0,this.app.client.setHeight,this.app.client.setWidth,50,"#000000");

		}

		//Helper: trigger the sprites debug draw event TODO: bring into SpiceJS

		this.drawDebug = ()=> {

			if (!this.debug){

				return;
			}

			for (let i = this.enemies.length-1; i>=0;i--){

				this.enemies[i].drawDebug();
			}

			return;
		}

		//Helper: update character lists

		this.updateUI = ()=>{

			this.updateCharacterList(this.UI_ScoreNumbers,utils.reverseString(this.score),0,15);
			this.updateCharacterList(this.UI_Time,utils.reverseString(this.getTime()),0,15);

			this.score = _SCORE_ || 0;
			this.score = String(this.score);

		}

		this.ready = true;

	}

	/**/

	static draw() {

		//TODO: put this into spicejs state class
		if (!this.ready){

			return;
		}

		this.drawBorders();
		this.drawDebug();

		this.hits = [];

		//debug TODO: move to player
		//this.visuals.rect_ext(Player.position.x,Player.position.y,this.player.w/1.25,25,1,a,1,"#FFFFFF")

	}

	/**/

	static update() {


		//TODO: put this into spicejs state class
		if (!this.ready){

			return;
		}

		if (this.app.client.graphics.getErrors()!==0) {

			//TODO: logg in SpiceJS. Test.
			console.log('loading'+this.app.client.graphics.getErrors());
		}

		this.player.update();

		let OffsetX = 0;

		/*
		for(let i = this.bgItems.length-1; i>=0;i--) {


			let item = (this.bgItems[i]);

			let px = this.player.position.x*0.25;

			let a = this.app.client.setWidth/2-px/(i+1);
			OffsetX = a;
			item.position.x = a;

			item = (this.bgItems2[i]);

			a = -this.app.client.setWidth/2-px/(i+1);
			item.position.x = a;

			item = (this.bgItems3[i]);

			a = -px/(i+1);
			item.position.x = a;
		}
		*/

		//for each enemy
		let i = this.enemies.length-1;
		for (i; i>=0;i--){

			//enemy in enemies
			let Enemy:Sprite = this.enemies[i];

			if (!Enemy.player){
				Enemy.player = this.player;
			}

			Enemy.off.x = OffsetX;

			//validate enemy for collision
			if (checkEnemy(Enemy, null)){
				continue;
			}

			//compare enemy to enemies
			for (let i2 = this.enemies.length-1; i2>=0;i2--){

				//compared enemy in enemies
				let compare_enemy = this.enemies[i2];

				//get vector difference
				let compare_difference = Vector.Difference(Enemy.getPosition(), compare_enemy.getPosition());

				//validate compared enemy for collision
				if (checkEnemy(compare_enemy,Enemy)){
					continue;
				}

				if (utils.Within(compare_difference.x,-20,20)){
					compare_enemy.position.x-=compare_difference.x/100 - Math.random()*1/100;//compare_enemy.velocity.x+=Enemy.dir/1.5,collision = true; //TODO tweak
				}
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
			if (!utils.Within(diff.y,-75,75)){
			if (!utils.Within(diff.x,-75,75)){
				continue;
			}}


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
				//TODO: not use enemy.DS
				if (((diff.x>0)===(this.player.velocity.x<0))&&(this.player.isAttacking)){

					//Push a hit
					if (this.player.getIndex()===5||8){
						(Enemy.hit=true,Enemy.pState='hit',Enemy.index=0,_SCORE_+=10);//this.hits.push(Enemy);
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


		if (this.player.x>20){
			this.updateUI();
		}

		if (this.visuals.app.Loading){
			this.visuals.app.Loading.BackgroundManager.updatePositionBasedOnPlayer(this.player);
		}

		return;

	}

}

export default new Game();
