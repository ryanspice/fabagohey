//@flow

import {
	Sprite
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	dtoDrawData,
	dtoBatchData
} from './core/interfaces';

/* Import types from SpiceJS */

import {
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import Player from './player';



export default class RagPhysics extends Sprite {

	constructor(...args:Array<any>){

		let s = args.length;

		if (s>1){

			super(...args);
		}
		else {

			let vas = args[0];
			let img = vas.img;
			let x = vas.x;
			let y = vas.y;
			let s = vas.s;
			let a = vas.a;
			let c = vas.c;
			let xx = vas.xx;
			let yy = vas.yy;
			let w = vas.w;
			let h = vas.h;
			let visuals = vas.visuals;

			super(img,x,y,s,a,c,xx,yy,w,h,visuals);
			
		}

		this.collision = false;
		this.hit = false;
		this.index = 0;
	}

	getX(){

		return this.position.x-Player.offset.x;

	}
	getY(){

		return this.position.y+Player.offset.y;

	}

	getPosition(){

		return new Vector(this.getX(),this.getY());
	}

	getIndex(){

		return this.index.toFixed(0);
	}

	bounds(){





		if (this.position.y<130)
			this.position.y=130, this.diry = 0;
/*
		if (this.position.y>175)
			this.position.y=175;

		if (this.position.y<165)
			this.position.y = 165;//this.position.y=165;// this.diry = 0;

			*/
		//if (this.position.y>this.visuals.app.client.setHeight+6)
			//this.position.y=this.visuals.app.client.setHeight+6;

		//this.position.x = this.app.client.math.Clamp(0,1)


		if (this.position.x<-120)
			this.position.x=-120;//, this.pState = 'idle';

		//if (this.position.x>300)
		//	this.position.x=300, this.pState = 'idle';

	}

	move(vector){

		this.position = Vector.Combine(this.position,vector);

	}

	set state(val){
		this._state = val;
	}

	get state(){

		return this._state;

	}

}
