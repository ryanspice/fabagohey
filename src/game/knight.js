//@flow

declare var Vector;

import RagPhysics from './ragphysics';

import type {
	dtoDrawData
} from './core/interfaces';

export default class Knight extends RagPhysics {

	type:string;
	dir:number;
	diry:number;
	agility:number;
	priority:number;
	thyme:Date;
	off:Vector = new Vector();
	vel:Vector = new Vector();

	constructor(...args:Array<any>){

		super(...args);

		this.type = "e"

		this.type = '';

		this.lastDir = 1;

		this.dir = 1;
		this.diry = 1;
		this.agility = 7;
		this.priority = 6;
		this.thyme = new Date();
		this.off.y = -2;
		this.vel.y = 1;
	}

	/**/

	get isAttacking():boolean {

		return ((this.visuals.app.input.pressed)||(this.visuals.app.input.keyController.keyboardCheck('space')));
	}

	/* override sprite draw */

	draw(){

		const direction = (this.pState=="block")?(this.lastDir):(this.lastDir = (this.velocity.x<0));

		const flip = (-1 + this.x);

		if (direction) {

			this.visuals.image_flip(flip,1);
			this.visuals._image_part(this.img,this.x,this.y+this.off.y-this.h/1.5,this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)
			this.visuals.image_flip(flip,1);

		} else {

			this.visuals._image_part(this.img,this.x,this.y+this.off.y-this.h/1.5,this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)

		}

	}

	/* override sprite update */

	update(){

		let t = new Date().getTime();
		let z;

		this.move(this.velocity);

		if ((this.velocity.x>0)&&(this.velocity.x<0.2))
			this.velocity.x = 0,this.pState = 'idle';

		if ((this.velocity.x<-0.001)&&(this.velocity.x>-0.2))
			this.velocity.x = -0.001,this.pState = 'idle';

		this.controls();
		this.bounds();

		if (this.x<20)
			this.velocity.x=0.3,this.index+=0.005,this.pState = 'walk';

		if ((this.velocity.x>19) && (this.velocity.x<=21))
			this.velocity.x = 0,this.index=0,this.pState = 'idle';

		this.off.y = -2;

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

			break;

			case 'attack':

				this.h = 80;
				this.w = (800/10);
				this.img = this.sprAttack;
				z = (800/10);
				this.xx =-20 + z*Math.round(this.index);

				this.off.y = 3;

				if (this.isAttacking){
					this.index += (Number(this.index<3)) * 0.1;
				}

				if (this.index<3)
					this.index +=0.1;
				else {

					if (this.isAttacking)
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
