export interface IState {

	init:Function;

}

export type dtoDrawData = {
	img:HTMLImageElement|Image,
	x:number,
	y:number,
	s:number,
	a:number,
	c:number,
	xx:number,
	yy:number,
	w:number,
	h:number,
	visuals:any,
	map?:Function,
}

export type dtoBatchData = dtoDrawData|Image;
