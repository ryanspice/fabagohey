//@flow

declare var require: {
	(id: string): any;
	ensure(ids: Array<string>, callback?: { (require: typeof require): Promise<any> }, chunk?: string): Promise<any>
}
