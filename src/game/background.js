//@flow

import {
	Sprite
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	ISprite,
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoBatchDataValidation
} from './core/interfaces';

export default class ParallaxBackground {

	sprites:Array<ISprite>;
	speed:number = 0;

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals, speed:number){

		this.speed = speed;

		this.sprites = [
			new Sprite(data,x,y,s,a,c,xx,yy,w,h,visuals),
			new Sprite(data,x,y,s,a,c,xx-320/s,yy,w,h,visuals)
		];

		this.sprites.forEach(sprite => sprite.type='_image_part');

	}

	update(item:ISprite){

		item.xx+=0.05 + 0.05*this.speed;
		if (item.xx>320/item.s){
			item.xx = -320/item.s;
		}

	}

	/**/

	updateAll(){

		this.sprites.forEach(sprite => this.update(sprite));

	}


}
