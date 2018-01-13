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

import ParallaxBackground from './background/parallax';
export default ParallaxBackground;

/* Background Object Controller */

export class BackgroundController {

	//References
	visuals:IVisuals;
	app:IApp;

	//Data passed to images
	stats:dtoBatchDataValidation;

	//Pre-Allocate Arrays
	images:Array<ISprite> = new Array(4);
	backgrounds:Array<ParallaxBackground> = new Array(4);
	backgroundsSize:number;

	//

	constructor(stats:dtoBatchDataValidation, visuals:IVisuals){

		//Extract references
		this.visuals = visuals;
		this.app = this.visuals.app;
		this.stats = stats;

			//Image references
			this.images[0] = this.app.client.loader.getImageReference('./parallax-forest-back-trees');
			this.images[1] = this.app.client.loader.getImageReference('./parallax-forest-lights');
			this.images[2] = this.app.client.loader.getImageReference('./parallax-forest-middle-trees');
			this.images[3] = this.app.client.loader.getImageReference('./parallax-forest-front-trees');

			//Create parallax backgrounds
			let i = this.backgroundsSize = this.backgrounds.length-1;
			for(i; i >= 0; i--){

				if (i===2){
					this.backgrounds[i] = (new ParallaxBackground(this.images[i],0,0,1.2,1,0,0,0,272,176,this.visuals,i));
				}else{
					this.backgrounds[i] = (new ParallaxBackground(this.images[i],0,0,1.2,1,0,0,0,272,160,this.visuals,i));
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

			let image = this.backgrounds[background];

			if (image){

				image.updateAll();

			} else {


			}

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
