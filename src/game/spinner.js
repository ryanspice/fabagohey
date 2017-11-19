//@flow

import {
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

declare var Vector;
declare var Circle;

import {
	ISprite,
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';


export default class Spinner {
	sprites:Array<ISprite>;
	speed:number = 0;
	x:number;
	app:any;
	width:number = 12;


	constructor(visuals:IVisuals, speed:number){

		this.app = visuals.app;

		this.x =0;
		let r= 1.6;
		let b = this.x/1080;

		this.sprites = [];

		for(let i=8;i>=0;--i){

			let obj = new Circle((-7+visuals.app.client.width/2+Math.cos((b+i)*7)*this.width),visuals.app.client.height/1.5+Math.sin((b+i)*7)*this.width,r,"#33FF33",1,visuals);
			obj.priority = 5;
			obj.id = i;
			this.sprites.push(obj);

		}


		this.speed = 3;//speed;

		//this.sprites.forEach(sprite => sprite.type='_image_part');

	}

		update(item:ISprite){

		let b = this.x/1080;
		let i = item.id;

		let colour = "#EE3333";
		if (this.app.client.graphics.getErrors()!==0) {
			colour = "#EE3333";
		} else {
			colour = "#33FF33";
		}

		item.a = 0.5-Math.sin(((b+i)*(1*7))+360*(-Math.sin(this.x/1080)*0.1))*0.5;
		item.position = new Vector((-7+this.app.client.setWidth/2+Math.cos((b+i)*7)*this.width),this.app.client.setHeight/1.5+Math.sin((b+i)*7)*this.width);
		item.col = colour;

	}

	/**/

	updateAll(){

		this.x+=this.speed;
		this.sprites.forEach(sprite => this.update(sprite));

	}


}
