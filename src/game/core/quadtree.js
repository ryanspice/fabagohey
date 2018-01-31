//@flow


declare var Vector;
import Rectangle from "./rectangle";



class QuadController {

	static MAX_OBJECTS:number = 10;//10;
	static MAX_LEVELS:number = 5;
	static QUAD_LIST:Array<any> = new Array(256);
	static QUAD_LIST_COUNT:number = 0;

	static RECT_LIST:Array<any> = new Array(256);
	static RECT_LIST_COUNT:number = 0;

	static FIND_EMPTY_QUAD(level:number, rect:any){

		let quad;
		let i = QuadController.QUAD_LIST_COUNT-1;

		for(i;i>=0;i--){
			let quadinlist = QuadController.QUAD_LIST[i];
			//if (quad==null){
				//quad = quadinlist;
				//break;
			//} else {

			if (quadinlist){

				if (quadinlist.reuse){

					console.log('reused')
					quad = quadinlist;
					quad.reuse = false;
					quad.level = level;
					quad.bounds = rect;

					return quad;
				}

			}

		//}
		}
		if (!quad)
			console.warn(':: No Quad Found', + QuadController.QUAD_LIST_COUNT++);
			else
			console.warn(':: Quad Found', + QuadController.QUAD_LIST_COUNT++);

		return -1;
	}

	static FIND_EMPTY_RECT(left, top, width, height){

		let rect;
		let i = QuadController.RECT_LIST_COUNT-1;

		for(i;i>=0;i--){
			let rectinlist = QuadController.RECT_LIST[i];
			//if (quad==null){
				//quad = quadinlist;
				//break;
			//} else {

			if (rect){

				if (rect.reuse){

					console.log('reused')
					rect = rectinlist;
					rect.reuse = false;
					rect.set(left, top, width, height);

					return rect;
				}

			}

		//}
		}
		if (!rect)
			console.warn(':: No Rect Found', + QuadController.RECT_LIST_COUNT++);
			else
			console.warn(':: Rect Found', + QuadController.RECT_LIST_COUNT++);

		return -1;
	}

}

let list = QuadController.RECT_LIST;
let listLength = list.length-1;
for(let i = listLength;i>=0;i--){

	setTimeout(()=>{
		list[i] = new Rectangle(0,0,1,1);
		list[i].reuse = true;
	});

}

list = QuadController.QUAD_LIST;
listLength = list.length-1;
for(let i = listLength;i>=0;i--){

	setTimeout(()=>{list[i] = new QuadTree(0,QuadController.FIND_EMPTY_RECT(0,0,1,1));
		list[i].reuse = true;
	});

}


export default class QuadTree {

	id:number;
	reuse:boolean = false;

	MAX_OBJECTS:number = QuadController.MAX_OBJECTS;
	MAX_LEVELS:number = QuadController.MAX_LEVELS;

	level:number;
	objects:Array<any>;
	bounds:any;
	list:Array<Vector>;
	nodes:Array<any>;

	constructor(level:number, rect:any){

		this.level = level;
		this.objects = [];
		this.bounds = rect;
		this.nodes = [];

		this.id = QuadController.QUAD_LIST_COUNT;
		QuadController.QUAD_LIST[QuadController.QUAD_LIST_COUNT++] = this;




	}

	clear(){

		this.objects = [];
		let i = this.nodes.length-1;
		for (i; i>0; i--) {

			if (this.nodes[i]!=null){
				this.nodes[i].clear();
				//this.nodes[i] = [];
			}

		}

	}

	split(){

		let subWidth = (this.bounds.width() / 2);
		let subHeight = (this.bounds.height() / 2);

		let x = this.bounds.left;
		let y = this.bounds.top;

		this.nodes[0] = QuadController.FIND_EMPTY_QUAD(this.level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
		this.nodes[1] = QuadController.FIND_EMPTY_QUAD(this.level+1, new Rectangle(x, y, subWidth, subHeight));
		this.nodes[2] = QuadController.FIND_EMPTY_QUAD(this.level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
		this.nodes[3] = QuadController.FIND_EMPTY_QUAD(this.level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));

		/*
	   this.nodes[0] = new QuadTree(this.level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
	   this.nodes[1] = new QuadTree(this.level+1, new Rectangle(x, y, subWidth, subHeight));
	   this.nodes[2] = new QuadTree(this.level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
	   this.nodes[3] = new QuadTree(this.level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));
	   */



	}

	getIndex(pRect:any){

		let index = -1;
	    let verticalMidpoint = this.bounds.top + (this.bounds.height() / 2);
		let  horizontalMidpoint = this.bounds.left + (this.bounds.width() / 2);

		//console.log(pRect.top);
		const height = 32; //pRect.height()
		const width = 64; //pRect.width()
		const y = pRect.y;
		const x = pRect.x;

	    // Object can completely fit within the top quadrants
	    let topQuadrant = ((y < horizontalMidpoint) && ((y + height) < horizontalMidpoint));
	    // Object can completely fit within the bottom quadrants
	    let bottomQuadrant = (y > horizontalMidpoint);

		   if (topQuadrant) {
			 index = 1;
		   }
		   else if (bottomQuadrant) {
			 index = 2;
		   }

		return index;
	    // Object can completely fit within the left quadrants
	    if ((x < verticalMidpoint) && ((x + width) < verticalMidpoint) ){
	       if (topQuadrant) {
	         index = 1;
	       }
	       else if (bottomQuadrant) {
	         index = 2;
	       }
	     }
	     // Object can completely fit within the right quadrants
	     else if (x > verticalMidpoint) {
	      if (topQuadrant) {
	        index = 0;
	      }
	      else if (bottomQuadrant) {
	        index = 3;
	      }
	    }

	    return index;
	}

	insert(pRect:any){

		let length = this.objects.length-1;
		let index:number = -1;

	   if (this.nodes[0] != null) {
	     index = this.getIndex(pRect);

	     if (index != -1) {
			   	//console.log(this.nodes[index]);
	       	this.nodes[index].insert(pRect);

	       return;
	     }
	   }

	   this.objects.push(pRect);
	   if (((length) > this.MAX_OBJECTS) && (this.level < this.MAX_LEVELS)) {
	      if (this.nodes[0] == null) {
	         this.split();
	      }

	     let i = length;
 		for (i; i>0; i--) {

		   let index = this.getIndex(this.objects[i]);
		   if (index != -1) {

			   	//console.log(this.nodes[index])
		 	this.nodes[index].insert(this.objects.slice(i));
		   }

		 }


/*
	     while (i < this.objects.length-1) {
	       let index = this.getIndex(this.objects[i]);
	       if (index != -1) {
	         this.nodes[index].insert(this.objects.slice(i));
	       }
	       else {
	         i++;
	       }
	     }
*/





	   }
	}

	retrieve(returnObjects:Array<Rectangle>, pRect) {

		let index = this.getIndex(pRect);
		if (index != -1 && this.nodes[0] != null) {
		 this.nodes[index].retrieve(returnObjects, pRect);
		}

		//		returnObjects.concat(this.objects);
		//return [...returnObjects, ...this.objects];
		return (returnObjects:any).extend(this.objects);
	}

}
