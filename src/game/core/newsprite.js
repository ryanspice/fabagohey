//@flow

declare var Vector;

import {
	Sprite
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	IVector,
	IState,
	IVisuals
	// $FlowFixMe
} from '../../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoBatch,
	dtoDrawData,
	dtoBatchDataValidation
} from '../core/interfaces';

import debug from '../../config';

import Player from '../player';

/*
	Sprite class override, handles all physics for moving characterlike objects
*/

export default class NewSprite extends Sprite {

	delete:boolean = false;
	off:IVector = new Vector(); //TODO: remove
	vel:IVector = new Vector(); //TODO: remove

	index:number;
	img:any;

	_state:IState;

	position:IVector;
	velocity:IVector;
	offset:IVector;

	visuals:IVisuals;


	/* TODO: figure out how to pass my own type? */

	constructor(...args:dtoBatch){

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
		this.off = new Vector();

	}

	/* returns true if the object is invalid */

	invalidate(e:any|null){

	   	if (this.pState =='dead')
	   		return true;
	   	if (this==e)
	   		return true;
	   	return false;

   }

	/*TODO: bring into SpiceJS */

	drawDebug(){

		if (this.invalidate())
			return;

		if (this.collision==2)
			this.visuals.rect_ext(this.getX(),this.getY()+4,25,25,1,debug.collision.maskAlpha,1,"#FF0000");
		else
		if (this.collision==1)
			this.visuals.rect_ext(this.getX(),this.getY()+4,25,25,1,debug.collision.maskAlpha,1,"#FFFF00");
		else
			this.visuals.rect_ext(this.getX(),this.getY()+4,25,25,1,debug.collision.maskAlpha,1,"#FFFFFF");

	}

	//TODO: add get collision mask

	/**/

	getX(){

		return this.position.x-Player.offset.x+this.off.x;
	}

	/**/

	getY(){

		return this.position.y+Player.offset.y+this.off.y;
	}

	/**/

	getPosition(){

		return new Vector(this.getX(),this.getY());
	}


	/**/

	getWidth(){

		return (this.img.width*.75);
	}

	/**/

	getIndex(){

		return this.index.toFixed(0);
	}

	/**/

	intersects1d(a:number,b:number,c:number){
		return (a>b&&a<c);
	}


	/**/

	move(vector:IVector){

		this.position = Vector.Combine(this.position,vector);

	}

	/* TODO: move to spiceJS */

	set image_index(img:HTMLImageElement){

		if (this.img!=img)
			this.img = img;

	}


	/**/

	set state(val:IState){
		this.index = 0;
		this._state = val;
	}

	/**/

	get state():IState {
		return this._state;
	}

}