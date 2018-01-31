//@flow

import {
	IState
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import NewSprite from './core/newsprite';

declare var Vector;

/*
	handles all physics for moving characterlike objects
*/

export default class RagPhysics extends NewSprite {

	hit:boolean = false;
	collision:boolean = false;

	constructor(...args:Array<any>){

		super(...args);

		this.index = 0;

		this.velocity = new Vector();
	}

	bounds(){

		this.velocity.x*=0.94;

		//if (this.position.y<130)
//			this.position.y=130, this.diry = 0;

		/*
		if (this.position.y>175)
			this.position.y=175;

		if (this.position.y<165)
			this.position.y = 165;//this.position.y=165;// this.diry = 0;

			*/
		//if (this.position.y>this.visuals.app.client.setHeight+6)
			//this.position.y=this.visuals.app.client.setHeight+6;

		//this.position.x = this.app.client.math.Clamp(0,1)

		//if (this.position.x<-120)
//			this.position.x=-120;//, this.pState = 'idle';

		//if (this.position.x>300)
		//	this.position.x=300, this.pState = 'idle';

	}


	_boundingBoxWidth:number;
	_boundingBoxHeight:number;

	/**/

	getBoundingBoxWidth(){

		return this._boundingBoxWidth || this.getWidth();
	}

	/**/

	getBoundingBoxHeight(){

		return this._boundingBoxHeight || this.getHeight();
	}

	/**/

	get minX(){

				return this.getX()-this.getBoundingBoxWidth();
	}

	/**/

	get minY(){

				return this.getY()-this.getBoundingBoxHeight();
	}
	/**/

	get maxX(){

		return this.getX()+this.getBoundingBoxWidth();
	}

	/**/

	get maxY(){

		return this.getY()+this.getBoundingBoxHeight();
	}

}
