//@flow

export interface IState {

	init:Function;

}

export type dtoSpriteDataList = string[];
export type dtoBatchDataValidation = dtoBatchData|HTMLImageElement|number|string;
export type dtoBatchData = dtoDrawData|Image;
export type dtoBatch = Array<dtoDrawData>;

export type dtoDrawData = {
	img:dtoBatchDataValidation,
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
