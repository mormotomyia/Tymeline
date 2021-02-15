import dayjs from "dayjs";

import { MormoTable } from "./components/mormoTable";
import { MovableObject } from "./components/model/TableData";

const bg = new MormoTable(document.getElementsByTagName('body')[0],{size:{width:1400,height:500},colorschema:{text:'black',background:'lightblue',borders:'red'}});
bg.start();

bg.setTable([{id:1,length:3600*48,content:{text:'asd'},start:dayjs().subtract(5,'day')}, {id:2,length:50,content:{text:'asd'},start:dayjs().subtract(2,'day')}])
bg.updateTable({1:{length:3600*48,content:{text:'asdff'},start:0},2:{length:500,content:{text:'asdf'},start:5}})

