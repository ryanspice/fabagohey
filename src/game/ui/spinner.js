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

type StateColour = 'Red' | 'Green';

/* Generic Spinner class for loading spinner graphic */

export default class Spinner {

	asyncDoneLoading:boolean = false;

	app:IApp;

	sprites:Array<ISprite> = [];

	x:number;
	shortx:number;

	speed:number = 0;
	width:number = 12;
	radius:number = 1.6;

	//TODO: if we include this in spicejs, change default colour
	Colours = {
		'Red':'#EE3333',
		'Green':'#33FF33',
	};

	getColour(col:StateColour){

		return this.Colours[col];
	};

	colour:string;

	/**/

	constructor(visuals:IVisuals, speed:number = 1){

		this.app = visuals.app;

		this.colour = this.getColour('Red');

		//circular offset
		this.x =0;
		this.shortx = this.x/1080;

		//create circles to be drawn
		let i=8;
		let x = -7+visuals.app.client.width/2;

		for(i;i>=0;--i){

			let obj = new Circle((x+Math.cos((this.shortx+i)*7)*this.width),visuals.app.client.height/1.5+Math.sin((this.shortx+i)*7)*this.width,this.radius,this.colour,1,visuals);

			obj.priority = 0;
			obj.id = i;
			obj.colour = this.colour;

			this.sprites.push(obj);

		}

		this.speed = speed;

		this.asyncDoneLoading = true;
	}

	/* Update a Circle Item */

	updateCircle(item:ISprite){

		item.a = 0.5-Math.sin(((this.shortx+item.id)*(1*7))+360*(-Math.sin(this.x/1080)*0.1))*0.5;
		item.position = new Vector((-7+this.app.client.setWidth/2+Math.cos((this.shortx+item.id)*7)*this.width),this.app.client.setHeight/1.5+Math.sin((this.shortx+item.id)*7)*this.width);
		item.col = this.colour;

	}

	/* Update position and Circles*/

	updateAll(){

		this.x+=this.speed;
		for(let i = 8; i>=0; i--){
			this.updateCircle(this.sprites[i]);
		}

	}

}
