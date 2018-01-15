//@flow

declare var require: {
	(id: string): any;
	ensure(ids: Array<string>, callback?: { (require: typeof require): Promise<any> }, chunk?: string): Promise<any>
}

declare module "ryanspice2016-spicejs" {

	declare class SJS{

	}
	declare export default typeof SJS;

	declare export class State{
		constructor:any
	}
}
