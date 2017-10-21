//@flow
import utils from './utils.js';
import _CHARMAP_ from './maps';

/* Imports from SpiceJS */

import {
	State,
	Sprite,
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

/* Import types from SpiceJS */

import {
	IState
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

/* TODO: export properly from spicejs */

declare var Vector;

import Time from './time';
import Player from './player';
import Skeleton from './skeleton';
import Letter from './letter';

//rename these
let s = 1.125 + 0.2;
let xx = 0;
let xxx = 0;

const Game:IState = {

	init:async function(){

		this.debug = true;

		await (this.loadImages = ()=>{

			let loader = this.app.client.loader;
			this.font = loader.getImageReference('./Cursive1_MyEdit');
			this.line = loader.getImageReference('./Untitled');

			this.bg = [
				loader.getImageReference('./parallax-forest-back-trees'),
				loader.getImageReference('./parallax-forest-lights'),
				loader.getImageReference('./parallax-forest-middle-trees'),
				loader.getImageReference('./parallax-forest-front-trees'),
			];

			this.sprSkeleton = [
				loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Idle'),
				loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Walk'),
				loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Attack'),
				loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Hit'),
				loader.getImageReference('./Skeleton/Sprite Sheets/skeleton_parts'),
				loader.getImageReference('./Skeleton/Sprite Sheets/Skeleton_Dead')
			];

			this.sprKnight = [
				loader.getImageReference('./knight_3_improved_slash_animation_2'),
				loader.getImageReference('./knight_walk_animation'),
				loader.getImageReference('./knight_3_block'),
				loader.getImageReference('./knight_3_idle')
			];

		})();

		this.bgItems = [];
		this.bgItems2 = [];
		this.bgItems3 = [];

		this.enemies = [];

		for(let i = 3; i>=0;i--) {
			let item;
			(this.bgItems.push(item = this.visuals.createMapObject('Tile',this.bg[i],-272,-30,s,1,xx,0,0,xxx+272,160,-3+i)));
			item.priority = -3+ i;
			(this.bgItems.push(item = this.visuals.createMapObject('Tile',this.bg[i],0,-30,s,1,xx,0,0,xxx+272,160,-3+i)));
			item.priority = -2 + i;
			(this.bgItems.push(item = this.visuals.createMapObject('Tile',this.bg[i],272,-30,s,1,xx,0,0,xxx+272,160,-3+i)));
			item.priority = -1	 + i;
		}

		this.player = new Player(this.sprKnight[0],-20,165,1,1,1,0,0,(167/4),46,this.visuals)
		this.player.pState = 'walk';

		this.player.sprWalk = this.sprKnight[1];
		this.player.sprBlock = this.sprKnight[2];
		this.player.sprAttack = this.sprKnight[0];
		this.player.sprIdle = this.sprKnight[3];

		Skeleton.sprSkeleton = this.sprSkeleton;
		Skeleton.sprIdle = this.sprSkeleton[0];
		Skeleton.sprWalk = this.sprSkeleton[1];

		for (var i = 14; i>=0;i--){
			let count = 0;
			for (let j = 0; j < Math.floor(Math.random() * 70); j++) {
		    	count++;
			}
			let s = new Skeleton(this.sprSkeleton[0],300,130,-1,1,1,0,-3,(264/11),35,this.visuals);
			s.priority = 5;
			this.enemies.push(s);
			/*
			setTimeout(()=>{

				let y = 160 + count;
				y = 60;
				let s = new Skeleton(this.sprSkeleton[0],300 + i*20*(y/100),y,-1,1,1,0,-3,(264/11),35,this.visuals);
				s.priority = 5;
				this.enemies.push(s);

			},	100*i)
			*/
		}

		this.visuals.bufferIndex = 0;

		this.initUI = await (()=>{
		this.characters = _CHARMAP_;

		this.characterList=(string,xx,yy,s=1)=>{

			let arr = [];

			for (var i = string.length-1; i>=0;i--){

				if (string[i]==" ")
					continue;

				let x = (this.characters.indexOf(string[i]));

				let y = 0;
				let l = new Letter(this.font,xx+9*i*s,yy,s,1,0,0,0,9,9,this.visuals);
				l.priority = 27;
				l.characterNum = x;
				arr.push(l);

			}

			return arr;
		};

		this.updateCharacterList=(list,string, xx,yy)=>{

			for (var i = list.length-1;i>=0;i--){
					list[i].characterNum = String(this.characters.indexOf('0'));
			}
			for (var ii = 0;ii<string.length;ii++){

				let x = (this.characters.indexOf(string[ii]));

				list[ii].character = string[ii];
				list[ii].characterNum = String(x);
				//for (var i = list.length-1; i>=0;i--){
				//}
			}

		}

		for (let i = 10;i>=0;i--){
			let t = new Sprite(this.line,0,0+i,1,0.5,0,0,0,320,1,this.visuals);
			t.priority = 8;
			t.type = '_image_part';
		}

		this.score = '000000';
		this.multiplier = 'x';

		let best = '010000';
		let yourbest = '000000';


			this.UI_ScoreNumbers = this.characterList(String(this.score),0,5,0.5);
			this.UI_Multiplier = this.characterList((this.multiplier),0,10,0.5);
			this.UI_Time = this.characterList('00',320/2-(8*2),5);

			this.UI_Best = this.characterList('Best '+best,378-108	,5,0.5);
			this.UI_Your = this.characterList('You '+yourbest,378-103.5	,10,0.5);

		})();

		this.time =	new Time();

		this.getTime = ()=>{

			let time = this.time.seconds;	//this.time.minutes;// +""+ (this.time.seconds);
			if (this.time.seconds<10)
				time = "0" + this.time.seconds;
			if (Number(time)<60)
			return String(Number(60-time));
			else
			return "XX";

		}

		this.ready = true;
	}
,
	draw:function(){
if (!this.ready)
	return;
			this.updateCharacterList(this.UI_ScoreNumbers,utils.reverseString(this.score),0,15);
			this.updateCharacterList(this.UI_Time,utils.reverseString(this.getTime()),0,15);

			if (this.app.client.graphics.getErrors()!==0)
				this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#000000");

			let col = "#FFFFFF";
			this.hits = [];

			let pos = Player.position;
			let a = this.debug?1:0;//0.1;
			pos.y-=25;

			for (var i = this.enemies.length-1; i>=0;i--){

				let Enemy = this.enemies[i];
				var collision = false;

				for (var i2 = this.enemies.length-1; i2>=0;i2--){

					let Enemy2 = this.enemies[i2];
					let diff2 = Vector.Difference(Enemy.getPosition(), Enemy2.getPosition());

					if (Enemy2.pState == 'dead')
						continue;
					if (Enemy2==Enemy)
						continue;

					if (diff2.x<15)
					if (diff2.x>0)
					Enemy2.position.x--,collision = true;

					if (diff2.x>-15)
					if (diff2.x<0)
					Enemy2.position.y++,collision = true;
				}

				if (Enemy.pState != 'dead')
				if (collision)
					Enemy.position.offset(-1*Enemy.s,0);

				let diff = Vector.Difference(pos, Enemy.getPosition());

				Enemy.collision = 0;
				if ((diff.x>0))
				Enemy.s = 1;
				if ((diff.x<0))
				Enemy.s = -1;

				if (Enemy.pState != 'dead')
				if ((diff.y>-125)&&(diff.y<125)){


					if ((diff.x>-this.player.w/1.25)&&(diff.x<this.player.w/1.25))
						col = "#FFFF00";


					if ((diff.x>-this.player.w/5)&&(diff.x<this.player.w/5))
						Enemy.position.offset(-1*Enemy.s,0);


					if ((diff.x>-this.player.w/1.95)&&(diff.x<this.player.w/1.95)){
						col = "#FF4444";
						let dir = this.player.dir*-2;
						if (
							((dir<0)&&(Enemy.s<0))||
							((dir>0)&&(Enemy.s>0))
						){
							if (this.player.pState =="attack")
							if (Enemy.pState !="dead"){
								if (this.player.getIndex()==5)
									col = "#FF00FF",this.hits.push(Enemy);

								if (this.player.getIndex()==8)
									col = "#FF00FF",this.hits.push(Enemy);
							}
						}
					}

					if ((diff.x>-15)&&(diff.x<15))
					this.visuals.rect_ext(Enemy.getX(),Enemy.getY()+4,25,25,1,a,1,"#FF0000"),Enemy.collision = 2;
					else
					if ((diff.x>-25)&&(diff.x<25))
					this.visuals.rect_ext(Enemy.getX(),Enemy.getY()+4,25,25,1,a,1,"#FFFF00"),Enemy.collision = 1;
					else
					this.visuals.rect_ext(Enemy.getX(),Enemy.getY()+4,25,25,1,a,1,"#FFFFFF")
				}

			}

			for (var i = this.hits.length-1; i>=0;i--){
				let Hits = this.hits[i];
				Hits.hit = true;
				Hits.pState = 'hit';
				Hits.index = 0;
			}

			this.visuals.rect_ext(Player.position.x,Player.position.y,this.player.w/1.25,25,1,a,1,col)


	}
,
	update:function(){

		if (!this.ready)
			return;

		this.player.update();

		if (this.app.client.graphics.getErrors()!==0) {

			console.log('loading'+this.app.client.graphics.getErrors());

		}

		this.player.update();
		return;
		Player.position = this.player.position;
		let pox = -this.player.x*15;
		for (var i = this.bgItems.length-1; i>=0;i--){
			let item = this.bgItems[i];
			item.y = -25// -this.player.y/6- (15*i/1);
			item.x = pox * ((2-i)/100);
			//if (i==0){
			Player.offset.x = -item.x;
			Player.offset.y = item.y;
			//}
		}

		for (var i = 0; i < this.bgItems2.length;i++){
			let item = this.bgItems2[i];
			item.y = -25// -this.player.y/6- (15*i/1);
			item.x = -item.w + pox * ((2-i)/100);
		}

		for (var i = 0; i < this.bgItems3.length;i++){
			let item = this.bgItems3[i];
			item.y = -25// -this.player.y/6- (15*i/1);
			item.x = item.w + pox * ((2-i)/100);
		}

	}

}

export default new State(Game);
