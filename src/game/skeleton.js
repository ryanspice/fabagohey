//@flow

declare var Vector;

import Player from './player';

import RagPhysics from './ragphysics';

import {
	ISprite,
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoDrawData,
	dtoBatchDataValidation
} from './core/interfaces';

import {
	StatsBuffer,
	Timer
} from './utils';

//const _AgilityIncrease_ = 0.05;
const _AgilityIncrease_ = 0.15;


let date = new Date();
export default class Skeleton extends RagPhysics {

	tick:Timer = new Timer(120);
	collision:number;

	s:number;
	a:number;
	c:number;
	xx:number;
	yy:number;
	w:number;
	h:number;
	pState:string;
	dS:number;
	timeoutmax:number;
	timeout:number;

	hits:number;
	agility:number;
	index:number;

	off:Vector = new Vector(0,0);

	_boundingBoxWidth:number = 12;
	_boundingBoxHeight:number = 16;

	game:any;

	/**/

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals){

		super(new StatsBuffer(data,x,y,s,a,c,xx,yy,w,h,visuals));

		this.dS = 0;
		this.timeoutmax = 120;
		this.timeout = this.timeoutmax;
		this.off.x = 1000;
		this.index = 0;
		this.index+=Math.round(Math.random()*25);

		this.agility = 4;
		this.agility+=Math.round(Math.random()*0.1);
		this.respawn();
		this.setState('walk');

	}

	/**/

	respawn(){

		if (this.tick.next()){

			return;
		}

		this.agility = 4;
		this.hits = 0;

		this.index+=Math.round(Math.random()*25);
		this.agility+=Math.random()*_AgilityIncrease_*(this.position.x/1000);

		this.setState('idle');
		this.position.x = (this.game.player.position.x + ( (Math.random() < 0.5 ? -0.25 : 1)*380) ) - this.off.x;

	}

	/**/

	collision(){



	}

	/* Assign state and image for the state */

	setState(str:string){

		switch(str){

			case 'idle':

			this.pState = 'idle';
			this.image_index = (Skeleton:any).sprIdle;

			break;

			case 'walk':

			this.pState = 'walk';
			this.image_index = (Skeleton:any).sprWalk;

			break;
			case 'dead':

			this.pState = 'dead';

			this.image_index = (Skeleton:any).sprSkeleton[5];

			break;
			case 'attack':

			this.pState = 'attack';
			this.image_index = (Skeleton:any).sprSkeleton[2];

			break;
			case 'hit':

			this.pState = 'hit';
			this.image_index = (Skeleton:any).sprSkeleton[3];

			break;

		}

	}

	/**/

	update(){

		let t = date.getTime();
		let z = 0;

		if (this.game.player){

			this.move(new Vector(-((this.game.player.velocity.x)*0.25)/(4-2.25),((this.game.player.velocity.y)*0.8)/(4-2.25)));

		}

		switch(this.pState){

			case 'idle':

				//
				z = (264/11);
				this.w = (264/11);
				this.xx =z*Math.round(this.index);
				this.index = 5+Math.sin(t/1080)*5;

				//
				if (this.collision>0){

					this.setState('idle');
					return;
				}

				//
				if (!this.game.player)
					return;

				//
				if (this.getX()>this.game.player.getX())
				if (this.getX()<this.game.player.getX()){

					this.setState('idle');
					return;
				}

				//
				this.setState('walk');

			break;

			case 'walk':

				if (!this.game.player){

					this.setState('idle');
					return;

				}

				z = (286/13);
				this.w = (286/13);
				this.xx =z*Math.round(this.index);

				if (this.index<12)
					this.index+=0.15;
					else
					this.index = 0;

				let xdir = this.s;

				let velX = 0;
				let velY = 0;
				if (this.getX()<this.game.player.getX())
				this.s = 1,velX += Math.sin(this.index/360) * this.agility;
				else
				if (this.getX()>this.game.player.getX())
				this.s = -1,velX -= Math.sin(this.index/360) * this.agility;

				this.move(new Vector(velX,velY))

			break;

			case 'attack':

				this.image_index = Skeleton.sprSkeleton[2];

				z = (774/18);
				this.xx =-8+z*Math.round(this.index);
				this.yy =3;
				this.w = (774/18);
				this.h = 37;
				if (this.index<18){
					this.index+=0.25;
				} else {
					this.w = (264/11);
					this.h = 35;
					this.xx = 0;
					this.yy = 0;
					this.index = 0;
					this.pState = 'idle';
				}

			break;

			case 'hit':

				this.image_index = Skeleton.sprSkeleton[3];
				z = (240/8);
				this.xx =z*Math.round(this.index);
				this.w = (240/8);

				this.dS = this.s;
				this.index = 7;

				if (this.index<7){
					this.index+=0.25;
				}else{

					/*
					if (this.hits<25){

						this.hits++;
						this.velocity.x = 0;

					}else {
					*/
						this.velocity.x = 0;
						this.index = 0;
						this.setState('dead');

					//}

					//this.delete = true;
					//this.x+=800;

				}
				this.x-=((7-this.index)/10)*this.s;
				this.hit = false;

			break;

			case 'dead':

				z = (495/15);
				this.xx =z*Math.round(this.index);
				this.w = (495/15);
				if (this.index<14){
					this.index+=0.25;
				} else {
					this.respawn();
				}
					//this.x-=((7-this.index)/10)*this.s;
					//this.hit = false;

			break;

		}

		this.bounds();

		if (this.pState!='attack')
		if (this.collision>=1){

			this.setState('attack');
			this.index = 3;
			return;
		}

	}

	/**/

	checkActive(e2:ISprite|null, camera:any){
		
		if (this.pState === 'dead' || this === e2 || this.delete==true){

			return null;
		}

		return this;
	}

	/**/

	draw(){

		//this.update();

		if ((this.getX()>330||(this.getX()<-10)))
			return;

		if (this.pState == 'dead'){

			if (this.dS<0){
				this.visuals.image_flip(-1 + this.getX(),1);
				this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
			} else {
				this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
			} if (this.dS<0) {
				this.visuals.image_flip(-1 + this.getX(),1);
			}

			return;
		}

		if (this.s<0)
			this.visuals.image_flip(-1 + this.getX(),1),this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)
		else
			this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
		if (this.s<0)
			this.visuals.image_flip(-1 + this.getX(),1);

	}

}
