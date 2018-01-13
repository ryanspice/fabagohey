//@flow

import {
	Sprite
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	ISprite,
	IVisuals,
	IApp
	// $FlowFixMe
} from '../../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoBatchDataValidation
} from '../core/interfaces';

/* Parallaxing Multilayer Background (X and Y) */

export default class ParallaxBackground {

	sprites:Array<ISprite> = new Array(2);
	spritesSize:number = 1;
	speed:number = 0;

	xx:number;
	s:number;

	/* Create References */

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals, speed:number){

		//References
		this.speed = speed;
		this.sprites = [
			new Sprite(data,x,y,s,a,c,xx,yy+20,w,h,visuals),
			new Sprite(data,x,y,s,a,c,xx-320/s,yy+20,w,h,visuals)
		];

		//Assign sprite-types to the sprites
		for(let i = this.spritesSize; i>=0; i--){
			this.sprites[i].type = '_image_part';
		}

	}

	/* Update sprite item */

	update(item:ISprite) {

		item.xx+=0.05 + 0.05*this.speed;

		if (item.xx>272)
			item.xx = -272+25;


		//if (item.xx>0/this.s){
//			item.xx = -320/this.s;
	//	}
		//console.log(item.xx);

	}

	/**/

	updateAll():void {
		//console.log(this.sprites)
		let i = this.spritesSize;
		for(i; i>=0; i--){

			//this.sprites[i].xx+=0.1;
			this.update(this.sprites[i]);

		}

	}

}
