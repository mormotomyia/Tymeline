import dayjs from "dayjs";

import { MormoTable } from "./components/mormoTable";


const bg = new MormoTable(document.getElementsByTagName('body')[0],{size:{width:1400,height:400},colorschema:{text:'black',background:'lightblue',borders:'red'}});
bg.start();

bg.setTable([
    {id:1,length:3600*48,content:{text:'OHH YES'},start:dayjs().subtract(5,'day'),canChangeLength:true,canMove:false}, 
     {id:2,length:543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day'),canChangeLength:false,canMove:true},
{id:3,length:334*3600,content:{text:'asd'},start:dayjs().subtract(47,'hour'),canChangeLength:false,canMove:false},
{id:4,length:243*3600,content:{text:'asd'},start:dayjs().subtract(123,'hour'),canChangeLength:true,canMove:true},
{id:5,length:234*3600,content:{text:'asd'},start:dayjs().subtract(52,'hour'),canChangeLength:true,canMove:false},
{id:6,length:26*3600,content:{text:'asd'},start:dayjs().subtract(54,'hour'),canChangeLength:true,canMove:true}

])




// bg.updateTable({1:{length:3600*48,content:{text:'asdff'},start:0},2:{length:500*3600,content:{text:'asdf'},start:5}})

