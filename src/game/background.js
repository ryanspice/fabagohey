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
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoBatchDataValidation
} from './core/interfaces';

/**/

export default class ParallaxBackground {

	sprites:Array<ISprite>;
	speed:number = 0;

	/**/

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals, speed:number){

		this.speed = speed;

		this.sprites = [
			new Sprite(data,x,y,s,a,c,xx,yy,w,h,visuals),
			new Sprite(data,x,y,s,a,c,xx-320/s,yy,w,h,visuals)
		];

		this.sprites.forEach(sprite => sprite.type='_image_part');

	}

	/**/

	update(item:ISprite) {

		item.xx+=0.05 + 0.05*this.speed;
		if (item.xx>320/item.s){
			item.xx = -320/item.s;
		}

	}

	/**/

	updateAll():void {

		this.sprites.forEach(sprite => this.update(sprite));

	}

}

/**/

export class BackgroundController {

	backgrounds:Array<ParallaxBackground> = [];
	images:Array<ISprite> = [];
	stats:dtoBatchDataValidation;

	visuals:IVisuals;
	app:IApp;

	/**/

	constructor(stats:dtoBatchDataValidation, visuals:IVisuals){

		//Extract references
		this.visuals = visuals;
		this.app = this.visuals.app;

		this.images = [
			this.app.client.loader.getImageReference('./parallax-forest-back-trees'),
			this.app.client.loader.getImageReference('./parallax-forest-lights'),
			this.app.client.loader.getImageReference('./parallax-forest-middle-trees'),
			this.app.client.loader.getImageReference('./parallax-forest-front-trees'),
		];

		this.stats = stats;

		let i = 3;
		for(i; i >= 0; i--){

			let obj = new ParallaxBackground(this.images[i],0,0,1.2,1,0,0,0,272,160,this.visuals,i);

			//obj.sprites[0].priority = 5;
			//obj.sprites[1].priority = 5;
			//obj.id = i;

			this.backgrounds.push(obj);

		}

	}

	/* Update all parallax backgrounds */

	updateAll(){

		if (this.app.client.graphics.getErrors()===0)
		this.backgrounds.forEach(background => background.updateAll());

	}

	/* Update all parallax backgrounds */

	updatePositionBasedOnPlayer(player:any){

		this.backgrounds.forEach(background => background.sprites.forEach(sprite => sprite.xx = player.x));

	}
}
