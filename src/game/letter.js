//@flow

import {
	Sprite
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	ISprite,
	IVector,
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

declare var Vector;

/**/

export default class Letter extends Sprite {

	off:IVector = new Vector(2,0);
	character:string;
	characterNum:number;
	///WARNING possible priority sorting bug!			setting this to 9 fucks up royally
	priority:number = 26;

	/**/

	constructor(data:ISprite,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals){

		super(data,x,y,s,a,c,xx,yy,w,h,visuals);

		this.character = '';
		this.characterNum = 0;

	}

	/**/

	getX():number {

		return this.position.x;
	}

	/**/

	getY():number {

		return this.position.y;
	}

	/**/

	getPosition():IVector {

		return new Vector(this.getX(),this.getY());
	}

	/**/

	draw():void {

		this.visuals._image_part(this.img,this.x,this.y+this.off.y-this.h/1.5,this.s,this.a,this.c,this.xx+this.characterNum*9,this.yy,this.w,this.h)

	}

}
