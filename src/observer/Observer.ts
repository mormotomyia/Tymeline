export interface IObserver{
    emit: (keyword:string,data:Object) => void
}


export class Observer implements IObserver{



    emit(keyword:string,data:Object):void{
        console.log(`${keyword}:`)
        console.log(data)
    }
}