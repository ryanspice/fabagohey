//@flow

interface ISettingsCollision {

	masks:boolean;
	maskAlpha:number;

}

const collision:ISettingsCollision = {

	masks:true,
	maskAlpha:0.15

}

export default class debug {

	static get collision():ISettingsCollision { return collision;}

}
