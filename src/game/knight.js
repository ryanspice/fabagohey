//@flow

import RagPhysics from './ragphysics';

import type {
	dtoDrawData
} from './core/interfaces';

export default class Knight extends RagPhysics {

	constructor(...args:Array<any>){

		super(...args);

		this.type = "e"

		this.type = '';

		this.velocity = new Vector();

		this.dir = 1;
		this.diry = 1;
		this.agility = 5;
		this.priority = 6;
		this.thyme = new Date();
		this.off = {y:-2};
		this.vel = {y:1};
	}

	draw(){

		if (this.velocity.x<0)
		this.visuals.image_flip(-1 + this.x,1)
		this.visuals._image_part(this.img,this.x,this.y+this.off.y-this.h/1.5,this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)
		if (this.velocity.x<0)
		this.visuals.image_flip(-1 + this.x,1)

	}



	update(){

		let t = new Date().getTime();
		let z;
		this.position.x+=this.velocity.x;
		this.velocity.x*=0.94;
		if (this.velocity.x>0)
		if (this.velocity.x<0.2)
			this.velocity.x = 0,this.pState = 'idle';
		if (this.velocity.x<0)
		if (this.velocity.x>-0.2)
			this.velocity.x = -0.001,this.pState = 'idle';

		this.controls();
		this.bounds();

		if (this.x<20)
			this.velocity.x+=0.21,this.index+=0.05,this.pState = 'walk';
		if (this.velocity.x>19)
		if (this.velocity.x<=21)
			this.velocity.x = 0,this.index=0,this.pState = 'idle';

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

				if ((this.visuals.app.input.pressed)||(this.visuals.app.input.keyController.keyboardCheck('space')))
				if (this.index<3)
					this.index +=0.1;

				//if (!this.visuals.app.input.pressed)
				if (this.index<3)
					this.index +=0.1;
				else {

					if ((this.visuals.app.input.pressed)||(this.visuals.app.input.keyController.keyboardCheck('space')))
					if (this.index<7)
					this.index +=0.1;
					else
					this.pState = 'idle';

				}

				if (this.index>3)
				if (this.index<7)
					this.index +=0.1;
				else
					this.pState = 'idle';

			break;

		}

	}
}
