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

const _AgilityIncrease_ = 0.05;



export default class Skeleton extends RagPhysics {

	agility:number;

	tick:Timer = new Timer(120);

	/**/

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals){

		super(new StatsBuffer(data,x,y,s,a,c,xx,yy,w,h,visuals));

		this.pState = 'walk';
		this.dS = 0;
		this.timeoutmax = 120;
		this.timeout = this.timeoutmax;
		this.agility = 7;
		this.off.x = 1000;
		this.hits = 0;

	}

	/**/

	respawn(){

		if (this.tick.next()){

			return;
		}

		this.hits = 0;
		this.index = 0;
		this.pState = 'idle';
		this.agility+=Math.random()*_AgilityIncrease_;
		this.position.x = (Player.position.x + ( (Math.random() < 0.5 ? -0.25 : 1)*380) ) - this.off.x;

	}

	/**/

	update(){

		let t = new Date().getTime();
		let z = 0;

						if (this.player){
		//let b = (this.player.velocity.y)*0.25;

		let b = (this.player.velocity.y)*0.4;

		this.position.y += b;}

		switch(this.pState){

			case 'idle':

				this.image_index = Skeleton.sprIdle;
				z = (264/11);
				this.w = (264/11);
				this.xx =z*Math.round(this.index);
				this.index = 5+Math.sin(t/1080)*5;



				if (this.collision>0){
					this.pState = 'idle';
					return;
				}

				if (!this.player)
					return;

				if (this.getX()>this.player.getX())
				if (this.getX()<this.player.getX()){


						this.pState = 'idle';
						return;
				}
				this.pState = 'walk';
				/*
				if (this.index<3.4)
					this.index+=0.05;
					else
					this.index = -0.5;
				*/
			break;

			case 'walk':

				if (!this.player){

					this.pState = 'idle';
					return;

				}

				this.image_index = Skeleton.sprWalk;
				z = (286/13);
				this.w = (286/13);
				this.xx =z*Math.round(this.index);
				if (this.index<12)
					this.index+=0.15;
					else
					this.index = 0;


					let xdir = this.s;

				//if (this.position.y<Player.position.y+5)
				//if (this.position.y>Player.position.y-5)


				let velX = 0;
				let velY = 0;
				if (this.getX()<this.player.getX())
				this.s = 1,velX += Math.sin(this.index/360) * this.agility;
				else
				if (this.getX()>this.player.getX())
				this.s = -1,velX -= Math.sin(this.index/360) * this.agility;

				if (this.getY()>this.player.getY()-25)
					velY += Math.sin(this.index/360) * -1;
					else
					velY += Math.sin(this.index/360) * 1;


				this.move(new Vector(velX,velY))



				/*
				if (this.index<3.4)
					this.index+=0.05;
					else
					this.index = -0.5;
				*/
			break;
			case 'attack':

				this.image_index = Skeleton.sprSkeleton[2];

				z = (774/18);
				this.xx =-8+z*Math.round(this.index);
				this.yy =3;
				this.w = (774/18);
				this.h = 37;
				if (this.index<18)
					this.index+=0.25;
					else{
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

				if (this.index<7)
					this.index+=0.25;
					else{

						/*
						if (this.hits<25){

							this.hits++;
							this.velocity.x = 0;

						}else {
						*/
							this.velocity.x = 0;
							this.index = 0;
							this.pState = 'dead';

						//}

						//this.delete = true;
						//this.x+=800;

					}
					this.x-=((7-this.index)/10)*this.s;
					this.hit = false;
			break;
			case 'dead':

				this.image_index = Skeleton.sprSkeleton[5];

				z = (495/15);
				this.xx =z*Math.round(this.index);
				this.w = (495/15);
				if (this.index<14)
					this.index+=0.25;
					else{

						this.respawn();
						//this.index = 0;
						//this.pState = 'idle';
						//this.delete = true;
						//this.x+=800;

					}
					//this.x-=((7-this.index)/10)*this.s;
					//this.hit = false;
			break;

		}
		this.bounds();


		if (this.pState!='attack')
		if (this.collision>=1){


				this.pState = 'attack';
				this.index = 3;
				return;
		}

	}

	/**/

	draw(){

		this.update();


		if (this.getX()>320)
			return;

		if (this.getX()<0)
			return;

		if (this.pState == 'dead'){
			if (this.dS<0)
				this.visuals.image_flip(-1 + this.getX(),1),this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)
			else
				this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
			if (this.dS<0)
				this.visuals.image_flip(-1 + this.getX(),1);
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
