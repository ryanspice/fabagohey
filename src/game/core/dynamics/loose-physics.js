//@flow

import {
	IState,
	IVector,
	ISprite
	// $FlowFixMe
} from '../../../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import NewSprite from '../newsprite';

import debug from '../../../config';

declare var Vector;

/*

	LoosePhysics

*/

export default class LoosePhysics extends NewSprite {

	// Velocity which thei sprite is moving

	velocity:Vector = new Vector();

	// Sprite Draw Offset

	off:Vector = new Vector(0,0);

	// Is Hit

	hit:boolean = false;

	// Collision State

	collision:number = 0;

	// Is Player

	isPlayer:boolean = false;

	// Count

	constructor(...args:Array<any>){

		super(...args);

		this.velocity = new Vector();

	}

	/* Level bounds */

	bounds(){

	this.velocity.x*=0.94;

	this.velocity.y+=0.1 * Number((this.velocity.y<3) && (this.getY()<115));
	this.velocity.y-=0.1 * Number((this.velocity.y>-3) && (this.getY()>175));

	this.velocity.x+=0.1 * Number((this.velocity.x<3) && (this.getX()<0));
	this.velocity.x-=0.1 * Number((this.velocity.x>-3) && (this.getX()>180));

	//if (this.position.y<130)
	//			this.position.y=130, this.diry = 0;

	/*
	if (this.position.y>175)
		this.position.y=175;

	if (this.position.y<165)
		this.position.y = 165;//this.position.y=165;// this.diry = 0;

		*/
	//if (this.position.y>this.visuals.app.client.setHeight+6)
		//this.position.y=this.visuals.app.client.setHeight+6;

	//this.position.x = this.app.client.math.Clamp(0,1)

	//if (this.position.x<-120)
	//			this.position.x=-120;//, this.pState = 'idle';

	//if (this.position.x>300)
	//	this.position.x=300, this.pState = 'idle';

	}

	/**/

	move(vector?:IVector = this.velocity){

		this.position = Vector.Combine(this.position,vector);

	}

	/**/

	updateMovement(){

		this.move(this.velocity);

		//Temp as skeleton wasnt built to use this method
		this.velocity.x = 0;
		this.velocity.y = 0;
	}


	/*TODO: bring into SpiceJS */

	drawDebug(){

		if (this.invalidate())
			return;

		let x = this.getX();
		let y = this.getY();

		if (x>320)
			return;
		if (x<0)
			return;

		if (!debug.collision.masks)
			return;


		let width = this._boundingBoxWidth*1.25;
		let height = this._boundingBoxHeight*1.25;
		let colours = [
			'FF0000',
			'FFFF00',
			'00FFFF',
			'00FF00',
			'FFFF00',
			'FF2200'
		];

		if (this.collision==2)
			this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha,1,"#FF0000");
		else
		if (this.collision==1)
			this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha,1,"#FFFF00");


			switch(this.collision){

				case 0.1:
				this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha,1,"#"+colours[1]);

				case 0.2:
				this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha,1,"#"+colours[2]);

				break;
				case 0.3:
				this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha+0.1,1,"#"+colours[3]);

				break;

				case 0.4:
				this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha+0.2,1,"#"+colours[4]);

				break;


				default:
					//this.visuals.rect_ext(x,y+4,width,height,1,debug.collision.maskAlpha,1,"#FFFFFF");

			}

	}

}
