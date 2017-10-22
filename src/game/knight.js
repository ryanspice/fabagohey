//@flow

import RagPhysics from './ragphysics';

import type {
	dtoDrawData
} from './core/interfaces';

export default class Knight extends RagPhysics {

	constructor(...args:dtoDrawData[]){

		super(...args);

		this.type = "e"

		this.type = '';
		this.dir = 1;
		this.diry = 1;
		this.agility = 5;
		this.priority = 6;
		this.thyme = new Date();
		this.off = {y:-2};
		this.vel = {y:1};
	}

	draw(){

		if (this.dir<0)
		this.visuals.image_flip(-1 + this.x,1)
		this.visuals._image_part(this.img,this.x,this.y+this.off.y-this.h/1.5,this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)
		if (this.dir<0)
		this.visuals.image_flip(-1 + this.x,1)

	}
	controls(){
		console.log(this)
		console.log(this.visuals)
		let gamepad =  this.visuals.app.input.gamepads
		if (gamepad){


			if (gamepad.a)
				this.dir=this.dir/1000,this.diry=this.diry/10000,this.pState = 'block',this.index+=0.1;

			if ((gamepad.left)||(gamepad.right))
			if (gamepad.x)
				this.position.x+=this.dir, this.index+=0.1;

			if (gamepad.left)
				this.position.x+=this.dir,this.pState = 'walk', this.dir = -0.5;
			if (gamepad.right)
				this.position.x+=this.dir,this.pState = 'walk', this.dir = 0.5;


			if (gamepad.up)
				this.position.y+=this.diry,this.pState = 'walk', this.diry = -0.5;
			if (gamepad.down)
				this.position.y+=this.diry,this.pState = 'walk', this.diry = 0.5;

			if (gamepad.a)
				this.pState = 'block',this.index+=0.1;


			if (gamepad.y){

				this.dir = this.dir/10000, this.diry = this.diry/10000, this.pState = 'attack';


			}


		}

	}


	update(){
		let t = new Date().getTime();
		let z;

		this.pState = 'idle';

		this.controls();
		this.bounds();

		if (this.x<20)
			this.x+=1,this.pState = 'walk';


		this.off = {y:-2};

		if (this.pState != 'attack'){

			this.yy = 0;
			this.h = 42;
			this.xx=0;
			this.w = (167/4);

		}


		switch(this.pState){

			case 'walk':

				this.img = this.sprWalk;
				z = (336/8);
				this.xx =z*Math.round(this.index);


				if (this.index<7)
					this.index+=0.1;
					else
					this.index = -0.5;

			break;

			case 'block':

				this.img = this.sprBlock;
				z = (294/7);
				this.xx =z*Math.round(this.index);

				if (this.index<5.4)
					this.index+=0.1;
					else
					this.index = 6;

			break;

			case 'idle':

				this.img = this.sprIdle;
				z = (168/4);
				this.xx =z*Math.round(this.index);
				this.index = 1+Math.sin(t/360)*1;
				/*
				if (this.index<3.4)
					this.index+=0.05;
					else
					this.index = -0.5;
				*/
			break;

			case 'attack':

				this.h = 80;
				this.w = (800/10);
				this.img = this.sprAttack;
				z = (800/10);
				this.xx =-20 + z*Math.round(this.index);

				this.off = {y:3};
				this.index = 4+Math.sin(t/(360-this.agility))*4;
				/*
				if (this.index<3.4)
					this.index+=0.05;
					else
					this.index = -0.5;
				*/
			break;

		}

	}
}