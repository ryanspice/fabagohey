
import {
	Sprite
} from 'ryanspice2016-spicejs';

export default class Letter extends Sprite {

	constructor(img,x,y,s,a,c,xx,yy,w,h,visuals){

		super(img,x,y,s,a,c,xx,yy,w,h,visuals);
		this.off = {y:2};
		this.character = '';
		this.characterNum = 0;
	}

	getX(){

		return this.position.x;

	}
	getY(){

		return this.position.y;

	}

	getPosition(){

		return new Vector(this.getX(),this.getY());
	}

	draw(){

		this.visuals._image_part(this.img,this.x,this.y+this.off.y-this.h/1.5,this.s,this.a,this.c,this.xx+this.characterNum*9,this.yy,this.w,this.h)

	}

}
