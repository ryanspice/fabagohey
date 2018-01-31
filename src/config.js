//@flow

//region interfaces

interface ISettingsCollision {

	masks:boolean;
	maskAlpha:number;

}

interface ISettingsBorder {

	tryToFillEdges:boolean;

}

//endregion

//region settings

const collision:ISettingsCollision = {

	'masks':false,
	'maskAlpha':0.15

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
