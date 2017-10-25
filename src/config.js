//@flow

interface ISettingsCollision {

	masks:boolean;

}

const collision:ISettingsCollision = {

	masks:false

}

export default class debug {

	static get collision():ISettingsCollision { return collision;}

}
