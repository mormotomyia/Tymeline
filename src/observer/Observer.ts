export interface IObserver{
    emit: (keyword:string,data:any) => void
}


export class Observer implements IObserver{



    emit(keyword:string,data:any):void{
        // console.log(`${keyword}:`)
        // console.log(data)
    }
}