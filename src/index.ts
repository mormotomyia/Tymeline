import dayjs from "dayjs";

import { MormoTable } from "./components/mormoTable";


const bg = new MormoTable(document.getElementsByTagName('body')[0],{size:{width:1400,height:500},colorschema:{text:'black',background:'lightblue',borders:'red'}});
bg.start();

bg.setTable([
    {id:1,length:3600*48,content:{text:'OHH YES'},start:dayjs().subtract(5,'day')}, 
    {id:2,length:543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:3,length:334*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:4,length:243*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:5,length:234*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:6,length:26*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:212,length:3543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:122,length:353*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:12,length:3543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:1122,length:243*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:1232,length:243*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:542,length:756*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:8762,length:456*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:7682,length:54*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:962,length:76*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:8972,length:56*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:2876,length:58*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:57682,length:96*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:25678,length:68*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:25456,length:86*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:2876,length:643*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:24567,length:534*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:29876,length:75*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:985472,length:35*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:98762,length:243*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:2342352,length:34*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:234252,length:756*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:1091232,length:543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:12312522,length:354*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:1252,length:354*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:1652,length:543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:17652,length:354*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
{id:12312,length:543*3600,content:{text:'asd'},start:dayjs().subtract(2,'day')},
])




// bg.updateTable({1:{length:3600*48,content:{text:'asdff'},start:0},2:{length:500*3600,content:{text:'asdf'},start:5}})

