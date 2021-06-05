from typing import List
import random

class DataObject:
    def __init__(self,start,end):
        self.start = start
        self.end = end

    def __repr__(self):
        return f"({self.start} {self.end})"

class Row:
    def __init__(self):
        self.elements = []

    @property
    def start(self):
        return min(self.elements,key= lambda x: x.start,default=None).start

    @property
    def end(self):
        return max(self.elements,key= lambda x: x.end, default=None).end

    def can_insert(self,element:DataObject):
        if self.start is not None and self.end is not None:
            return self.start > element.end or self.end < element.start
        else: return True

    def insert(self,element:DataObject):
        self.elements.append(element)

    def __repr__(self):
        return f"({self.elements=})"




def createSomeDataObjects():
    dataobjects = []
    for i in range(10):
        start = random.randint(0, 20)
        for j in range(1,5):
            end = random.randint(1, 10)
            dataobjects.append(DataObject(start, start+end))
    return dataobjects



def createDeterministicObjects():
    dataObjects = []
    dataObjects.append(DataObject(1,2))
    dataObjects.append(DataObject(3,4))
    dataObjects.append(DataObject(3,6))
    dataObjects.append(DataObject(7,9))
    dataObjects.append(DataObject(5,7))
    dataObjects.append(DataObject(8,12))
    dataObjects.append(DataObject(8,10))
    return dataObjects

def place_data_objects_in_rows(dataObjects:List[DataObject]):
    """
    return deterministic rows for dataObjects
    0. sort by end
    1. sort by start
    2. take first element in first row without overlap
    3. remove element from entries
    
    repeat (2,3)
    
    """

    rowList = list()

    dataObjects.sort(key=lambda do: do.end,reverse=True)
    dataObjects.sort(key=lambda do: do.start)
    for dataObject in dataObjects:
        insert_element_in_table(dataObject, rowList)
    return rowList

      
    
        


def insert_element_in_table(element,table=None):
    if table is None:
        table = list()

    for row in table:
        if row.can_insert(element):
            row.insert(element)
            break
    else:
        row = Row()
        row.insert(element)
        table.append(row)
    # return table

def remove_element_from_table(element,table):
    for row in table:
        if table in row.elements:
            row.elements.remove(element)



if __name__ == "__main__":

    objects = createDeterministicObjects()
    rowList = place_data_objects_in_rows(objects)
    print(rowList)
    insert_element_in_table(DataObject(5,7),rowList)
    print(rowList)

