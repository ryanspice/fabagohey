//@flow

/* TODO: implement class features to SpiceJS */

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
	IVisuals,
	IStatsBuffer
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import Player from './player';

/*
	handles all physics for moving characterlike objects
*/

export default class NewSprite extends Sprite {

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

	}

	/**/

	getX(){

		return this.position.x-Player.offset.x;
	}

	/**/

	getY(){

		return this.position.y+Player.offset.y;
	}

	/**/

	getPosition(){

		return new Vector(this.getX(),this.getY());
	}

	/**/

	getIndex(){

		return this.index.toFixed(0);
	}

	/**/

	move(vector:IVector){

		this.position = Vector.Combine(this.position,vector);

	}

}
