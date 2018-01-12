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

/* Parallaxing Multilayer Background (X and Y) */

export default class ParallaxBackground {

	sprites:Array<ISprite>;
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

/* Background Object Controller */

export class BackgroundController {

	backgrounds:Array<ParallaxBackground> = [];
	backgroundsSize:number = 3;

	images:Array<ISprite> = [];
	stats:dtoBatchDataValidation;

	visuals:IVisuals;
	app:IApp;

	/* Create References */

	constructor(stats:dtoBatchDataValidation, visuals:IVisuals){

		//Extract references
		this.visuals = visuals;
		this.app = this.visuals.app;
		this.stats = stats;
		this.images = [
			this.app.client.loader.getImageReference('./parallax-forest-back-trees'),
			this.app.client.loader.getImageReference('./parallax-forest-lights'),
			this.app.client.loader.getImageReference('./parallax-forest-middle-trees'),
			this.app.client.loader.getImageReference('./parallax-forest-front-trees'),
		];

		//Create parallax backgrounds
		let i = this.backgroundsSize;
		for(i; i >= 0; i--){

			if (i===2){
				this.backgrounds.push(new ParallaxBackground(this.images[i],0,0,1.2,1,0,0,0,272,176,this.visuals,i));
			}
			else{
				this.backgrounds.push(new ParallaxBackground(this.images[i],0,0,1.2,1,0,0,0,272,160,this.visuals,i));
			}

		}

	}

	/* Update all parallax backgrounds */

	updateAll(){

		//console.log(this.sprites,this.backgrounds)
		if ((!this.app.client.graphics.getErrors()===0)){

			return;
		}

		let background = this.backgroundsSize;
		for(background;background>=0;background--){
			this.backgrounds[background].updateAll();
		}

	}

	/* Update all parallax backgrounds */

	updatePositionBasedOnPlayer(player:any){

		//Background offsets
		let a = player.velocity.x*0.25;
		let b = -(player.velocity.y)*0.8;

		let background = this.backgroundsSize;
		for(background;background>=0;background--){

			let bg = this.backgrounds[background];
			let sprites = bg.sprites;
			sprites[0].yy += b/(4-bg.speed+1);
			sprites[0].xx += a/(4-bg.speed+1);
			sprites[1].yy += b/(4-bg.speed+1);
			sprites[1].xx += a/(4-bg.speed+1);

		}

	}

}
