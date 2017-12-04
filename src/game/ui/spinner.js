//@flow

import {
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

/* TODO: fix imports from spicejs */

declare var Vector;
declare var Circle;

import {
	ISprite,
	IVisuals,
	IApp
	// $FlowFixMe
} from '../../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

/* Generic Spinner class for loading spinner graphic */

export default class Spinner {

	app:IApp;

	sprites:Array<ISprite> = [];

	x:number;
	shortx:number;

	speed:number = 0;
	width:number = 12;
	radius:number = 1.6;

	colour:string = "#EE3333";

	/**/

	constructor(visuals:IVisuals, speed:number = 1){

		this.app = visuals.app;

		//circular offset
		this.x =0;
		this.shortx = this.x/1080;

		//create circles to be drawn
		let i=8;
		let x = -7+visuals.app.client.width/2;

		for(i;i>=0;--i){

			let obj = new Circle((x+Math.cos((this.shortx+i)*7)*this.width),visuals.app.client.height/1.5+Math.sin((this.shortx+i)*7)*this.width,this.radius,"#33FF33",1,visuals);

			obj.priority = 5;
			obj.id = i;

			this.sprites.push(obj);

		}

		this.speed = speed;

	}

	/**/

	update(item:ISprite){

		item.a = 0.5-Math.sin(((this.shortx+item.id)*(1*7))+360*(-Math.sin(this.x/1080)*0.1))*0.5;
		item.position = new Vector((-7+this.app.client.setWidth/2+Math.cos((this.shortx+item.id)*7)*this.width),this.app.client.setHeight/1.5+Math.sin((this.shortx+item.id)*7)*this.width);
		item.col = this.colour;

		if (this.app.client.graphics.getErrors()!==0) {

			this.shortx = this.x/1080;
			this.colour = "#EE3333";

		} else {

			this.colour = "#33FF33";

		}

	}

	/**/

	updateAll(){

		this.x+=this.speed;
		this.sprites.forEach(sprite => this.update(sprite));

	}

}
