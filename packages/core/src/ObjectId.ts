export class ObjectId{
   private _index: number;
   private _id: string;
   constructor(id: string, index: number){
      this._id = id;
      this._index = index;
   }
}