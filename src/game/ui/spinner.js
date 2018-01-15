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

/* Constants */

type StateColour = 'Red' | 'Green';

const _SPINNER_SPEED_ = 3;

/* Generic Spinner class for loading spinner graphic */

export default class Spinner {

	//Data
	x:number;
	shortx:number;

	speed:number;
	colour:string;

	count:number = 8;
	width:number = 12;
	radius:number = 1.6;

	//References
	app:IApp;

	//Pre-Allocating Arrays
	sprites:Array<ISprite> = new Array(8);

	//Colours ENUMthing
	//TODO: if we include this in spicejs, change default colour
	Colours = {
		'Red':'#EE3333',
		'Green':'#33FF33',
	};

	/**/

	getX(i:number){
		return (-7+this.app.width/2  +Math.cos((this.shortx+i)*7)*this.width);
	}

	/**/

	getY(i:number){
		return (this.app.height/1.5+Math.sin((this.shortx+i)*7)*this.width);
	}

	/**/

	getAlpha(i:number,b:number){
		return (0.5-Math.sin(((b+i)*(1*7))+360*(-Math.sin(this.x/1080)*0.1))*0.5);
	}

	/**/

	getColour(col:StateColour){

		return this.Colours[col];
	};

	/**/

	constructor(visuals:IVisuals, speed:number = _SPINNER_SPEED_){

		//assign references
		this.app = visuals.app;
		this.speed = speed;

		//set colour
		this.colour = this.getColour('Red');

		//circular offsets
		this.x =0;
		this.shortx = this.x/1080;

		//create circles to be drawn
		for(let i = this.count;i>=0;--i){

			//For each sprite created assign additional properties
			Object.assign(this.sprites[i] = new Circle(this.getX(i),this.getY(i),this.radius,this.colour,this.getAlpha(i,this.shortx),visuals),
				{
					priority:-32,
					id:i,
					colour:this.colour
				});

		}

	}


	/* Update a Circle Item */

	updateCircle(item:ISprite){

		item.position = new Vector(this.getX(item.id),this.getY(item.id));
		item.a = this.getAlpha(item.id,this.x/1080);
		item.col = this.colour;

	}

	/* Update position and Circles*/

	updateAll(){

		this.x+=this.speed;
		for(let i = this.count; i>=0; i--){
			this.updateCircle(this.sprites[i]);
		}

	}

}
