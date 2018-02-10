//@flow

//region interfaces

type TCollision = 'rtree'|'quadtree';

interface ISettingsCollision {

	masks:boolean;
	maskAlpha:number;
	type:TCollision;
	rtree_nodes:number;
	object_memorybuffer:number;

}

interface ISettingsBorder {

	tryToFillEdges:boolean;

}

//endregion

//region settings

const collision:ISettingsCollision = {

	'masks':false,
	'maskAlpha':0.15,
	'type':'rtree',
	'rtree_nodes':15,
	'object_memorybuffer':32,

}

const borders:ISettingsBorder = {

	'tryToFillEdges':true

}

//endregion settings

//region exports

export default class debug {

	static get collision():ISettingsCollision { return collision;}
	static get borders():boolean { return borders.tryToFillEdges;}

}

//endregion
