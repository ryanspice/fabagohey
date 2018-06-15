
import Skeleton from "./skeleton";

import LoosePhysics from "./core/dynamics/loose-physics";

export default class Enemy extends LoosePhysics {

	game:any;

	pState:string;

	hits:number;
	agility:number;
	index:number;

	constructor(...args){

		super(args);
	}

	/**/

	respawn(){

		if (this.tick.next()){

			return;
		}

		this.agility = 4;
		this.hits = 0;

		this.index+=Math.round(Math.random()*25);
		this.agility+=Math.random()*_AgilityIncrease_*(this.position.x/1000);

		this.setState('idle');
		this.position.x = (this.game.player.position.x + ( (Math.random() < 0.5 ? -0.25 : 1)*380) ) - this.off.x;

	}

	/* return self if active */

	checkActive(e2:any, camera:any):any {

		//
		if (this.pState === 'dead' || this === e2 || this.delete==true){

			return null;
		}

		return this;
	}

	/* Assign state and image for the state */

	setState(str:string){

		switch(str){

			case 'idle':

			this.pState = 'idle';
			this.image_index = (Skeleton:any).sprIdle;

			break;

			case 'walk':

			this.pState = 'walk';
			this.image_index = (Skeleton:any).sprWalk;

			break;
			case 'dead':

			this.pState = 'dead';

			this.image_index = (Skeleton:any).sprSkeleton[5];

			break;
			case 'attack':

			this.pState = 'attack';
			this.image_index = (Skeleton:any).sprSkeleton[2];

			break;
			case 'hit':

			this.pState = 'hit';
			this.image_index = (Skeleton:any).sprSkeleton[3];

			break;

		}

	}

	/**/

	draw(){

		//this.update();

		if ((this.getX()>330||(this.getX()<-10)))
			return;

		if (this.pState == 'dead'){

			if (this.dS<0){
				this.visuals.image_flip(-1 + this.getX(),1);
				this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
			} else {
				this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
			} if (this.dS<0) {
				this.visuals.image_flip(-1 + this.getX(),1);
			}

			return;
		}

		if (this.s<0)
			this.visuals.image_flip(-1 + this.getX(),1),this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h)
		else
			this.visuals._image_part(this.img,this.getX(),this.getY(),this.s,this.a,this.c,this.xx,this.yy,this.w,this.h);
		if (this.s<0)
			this.visuals.image_flip(-1 + this.getX(),1);

	}

}
