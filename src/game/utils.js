//@flow

import type {
	dtoBatchDataValidation
} from './core/interfaces';

export const reverseString = (str:string)=>{ return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);};

export class StatsBuffer {

	img:dtoBatchDataValidation;
	x:number;
	y:number;
	s:number;
	a:number;
	c:number;
	xx:number;
	yy:number;
	w:number;
	h:number;
	visuals:any;

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:any){

		this.img = data;
		this.x = x;
		this.y = y;
		this.s = s;
		this.a = a;
		this.c = c;
		this.xx = xx;
		this.yy = yy;
		this.w = w;
		this.h = h;
		this.visuals = visuals;

		return (this:dtoBatchDataValidation);
	}

}

export const Within = (a:number,b:number,c:number):boolean=> {
	return (a>b&&a<c);
}

const utils = {

	reverseString,
	Within,

}

export default utils;
