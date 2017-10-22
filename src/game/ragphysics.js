//@flow

declare var Vector;

import {
	Sprite
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import type {
	dtoDrawData,
	dtoBatchDataValidation
} from './core/interfaces';

/* Import types from SpiceJS */

import {
	IVector,
	IState,
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import Player from './player';

export default class RagPhysics extends Sprite {

	/* TODO: figure out how to pass my own type? */
	constructor(...args:Array<any>){

		//TODO: move into SpiceJS Sprite
		if (args.length>1){

			super(...args);

		} else {

			let vas:dtoDrawData = args[0];
			let img:dtoBatchDataValidation = vas.img;
			let x:number = vas.x;
			let y:number = vas.y;
			let s:number = vas.s;
			let a:number = vas.a;
			let c:number = vas.c;
			let xx:number = vas.xx;
			let yy:number = vas.yy;
			let w:number = vas.w;
			let h:number = vas.h;
			let visuals:IVisuals = vas.visuals;

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

	move(vector:IVector){

		this.position = Vector.Combine(this.position,vector);

	}

	set state(val:IState){
		this._state = val;
	}

	get state():IState {

		return this._state;
	}

}
