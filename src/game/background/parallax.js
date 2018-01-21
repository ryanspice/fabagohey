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

	//Data
	speed:number = 0;
	xx:number;
	s:number;

	//Pre-Allocate Arrays
	sprites:Array<ISprite> = new Array(2);

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals, speed:number){

		this.speed = speed;

		//References
		this.sprites[0] = new Sprite(data,x,y,s,a,c,xx,yy+20,w,h,visuals);
		this.sprites[0].type = '_image_part';
		this.sprites[0].priority = 0;
		this.sprites[1] = new Sprite(data,x,y,s,a,c,xx-320/s,yy+20,w,h,visuals);
		this.sprites[1].type = '_image_part';
		this.sprites[1].priority = 0;

	}

	/* Update sprite item */

	update(item:ISprite) {

		item.xx += 0.05 + 0.05*this.speed;

		if (item.xx>272-5){
			item.xx = -272+1;
		}

	}

	/**/

	updateAll():void {

		for(let i = this.sprites.length-1; i>=0; i--){
			this.update(this.sprites[i]);
		}

	}

}
