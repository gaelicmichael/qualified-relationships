export const dataEntities = [
  { id:   1, label: 'Kingdom of Scotland', type: 'Institution', start: 1000, end: 2020 },
  { id:   3, label: 'Clann Domhnaill', type: 'Institution', start: 1150, end: 2020 },
  { id:   4, label: 'Clann Caimbeul', type: 'Institution', start: 1150, end: 2020 },

  { id:  10, label: 'Aonghus Óg MacDomhnaill', type: 'Person', start: 1280, end: 1330 },
  { id:  11, label: 'Aonghus Mór mac Domhnaill', type: 'Person', start: 1235, end: 1293 },
  { id:  12, label: 'Alasdair Óg MacDomhnaill', type: 'Person', start: 1255, end: 1299 },
  { id:  15, label: 'Eòin MacDomhnuill', type: 'Person', start: 1320, end: 1386 },
]

export const dataRelationDefs = {
  descent: {
    label: 'Descent',
    color: 'red',
    roles: [ 'Father', 'Mother', 'Son', 'Daughter' ],
    roleColors: [ 'lightred', 'lightred', 'darkred', 'darkred' ],
  },
  marriage: {
    label: 'Marriage',
    color: 'blue',
    roles: [ 'Spouse' ],
    roleColors: [ 'lightblue' ]
  },
  fosterage: {
    label: 'Fosterage',
    color: 'green',
    roles: [ 'Fosterparent', 'Fosterling' ],
    roleColors: [ 'darkgreen', 'lightgreen' ],
  },
  clientage: {
    label: 'Clientage',
    color: 'yellow',
    roles: [ 'Lord', 'Client' ],
    roleColors: [ 'gold', 'goldenrod' ]
  },
  chieftaincy: {
    label: 'Chieftaincy',
    color: 'blue',
    roles: [ 'Chieftain', 'Clan' ],
    roleColors: [ 'darkblue', 'lightblue' ]
  },
  kingship: {
    label: 'Kingship',
    color: 'Purple',
    roles: [ 'King', 'Queen', 'Kingdom' ],
    roleColors: [ 'Indigo', 'Indigo', 'Lavendar' ]
  },
} // dataRelationDefs

export const dataRelations = [
  { id:   1, type: 'descent', role1: 'Father', role2: 'Son', entity1: 10, entity2: 15, start: 1320, end: 1330, note: 'Aonghus Óg father of Eóin' },
  { id:   2, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 10, entity2: 3, start: 1299, end: 1330, note: 'Aonghus Óg chieftaincy of Clan Donald' },
  { id:   3, type: 'descent', role1: 'Father', role2: 'Son', entity1: 11, entity2: 10, start: 1235, end: 1293, note: 'Aonghus Mór father of Óg' },
  { id:   4, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 11, entity2: 3, start: 1269, end: 1293, note: 'Aonghus Mór chieftaincy of Clan Donald' },
  { id:   5, type: 'descent', role1: 'Father', role2: 'Son', entity1: 11, entity2: 12, start: 1255, end: 1293, note: 'Aonghus Mór father of Alasdair' },
  { id:   6, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 12, entity2: 3, start: 1293, end: 1299, note: 'Alasdair chieftaincy of Clan Donald' },
]