"use strict";
exports.__esModule = true;
var mormoTable_1 = require("./components/mormoTable");
var bg = new mormoTable_1.MormoTable(document.getElementsByTagName('body')[0], { size: { width: 1400, height: 500 }, colorschema: { text: 'black', background: 'lightblue', borders: 'red' } });
bg.render();
bg.setTable([{ id: 1, length: 50, content: { text: 'asd' }, start: 0 }, { id: 2, length: 50, content: { text: 'asd' }, start: 5 }]);
bg.updateTable({ 1: { length: 50, content: { text: 'asdff' }, start: 0 }, 2: { length: 500, content: { text: 'asdf' }, start: 5 } });
