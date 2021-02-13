import moment from "moment";
import { MormoTable } from "./components/mormoTable";
import { MovableObject } from "./components/movableObject";

const bg = new MormoTable(document.getElementsByTagName('body')[0],{size:{width:1400,height:500},colorschema:{text:'black',background:'lightblue',borders:'red'}});
bg.render();

bg.setTable([{id:1,length:50,content:{text:'asd'},start:0}, {id:2,length:50,content:{text:'asd'},start:5}])
bg.updateTable({1:{length:50,content:{text:'asdff'},start:0},2:{length:500,content:{text:'asdf'},start:5}})
