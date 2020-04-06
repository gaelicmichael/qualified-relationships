export const dataTimeSettings = {
  start: 1000,
  end: 1700,
  step: 10,
  initial: 1300,
  active: false,
  current: 1300,
}

export const dataEntities = [
  { id:   1, label: 'Kingdom of Scotland', type: 'Institution', start: 1000, end: 2020 },
  { id:   3, label: 'Clann Domhnaill', type: 'Institution', start: 1150, end: 2020 },
  { id:   4, label: 'Clann Caimbeul', type: 'Institution', start: 1150, end: 2020 },

  { id:  10, label: 'Aonghus Óg MacDomhnaill', type: 'Person', start: 1280, end: 1330 },
  { id:  11, label: 'Aonghus Mór mac Domhnaill', type: 'Person', start: 1235, end: 1293 },
  { id:  12, label: 'Alasdair Óg MacDomhnaill', type: 'Person', start: 1255, end: 1299 },
  { id:  15, label: 'Eòin (Ìle) MacDomhnaill', type: 'Person', start: 1320, end: 1386 },
  { id:  19, label: 'Dómhnall (Rìgh nan Eilean) MacDomhnuill', type: 'Person', start: 1350, end: 1423, note: 'Birth year unknown' },
  { id:  21, label: 'Mary Leslie, Countess of Ross', type: 'Person', start: 1375, end: 1440, note: 'Birth year unknown' },

  { id:  30, label: 'Robert II (Stewart)', type: 'Person', start: 1316, end: 1390 },
  { id:  31, label: 'Margaret (Stewart) of Scotland', type: 'Person', start: 1345, end: 1390, note: 'Birth and death years unknown' }
]

export const entityDefs = {
  Institution: {
    color: 'purple'
  },
  Person: {
    color: 'pink'
  }
}

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
    color: 'aqua',
    roles: [ 'Lord', 'Client' ],
    roleColors: [ 'aquamarine', 'azure' ]
  },
  patronage: {
    label: 'Patronage',
    color: 'yellow',
    roles: [ 'Patron', 'Artisan' ],
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
  { id:   2, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 10, entity2: 3, start: 1299, end: 1330, note: 'Aonghus Óg chieftain of Clan Donald' },
  { id:   3, type: 'descent', role1: 'Father', role2: 'Son', entity1: 11, entity2: 10, start: 1235, end: 1293, note: 'Aonghus Mór father of Óg' },
  { id:   4, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 11, entity2: 3, start: 1269, end: 1293, note: 'Aonghus Mór chieftain of Clan Donald' },
  { id:   5, type: 'descent', role1: 'Father', role2: 'Son', entity1: 11, entity2: 12, start: 1255, end: 1293, note: 'Aonghus Mór father of Alasdair' },
  { id:   6, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 12, entity2: 3, start: 1293, end: 1299, note: 'Alasdair chieftain of Clan Donald' },
  { id:   7, type: 'descent', role1: 'Father', role2: 'Son', entity1: 10, entity2: 15, start: 1320, end: 1330, note: 'Aonghus Òg father of Eòin' },
  { id:   8, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 15, entity2: 3, start: 1336, end: 1386, note: 'Eòin chieftain of Clan Donald' },
  { id:   9, type: 'descent', role1: 'Father', role2: 'Son', entity1: 15, entity2: 19, start: 1350, end: 1386, note: 'Eòin father of Domhnall' },
  { id:  10, type: 'chieftaincy', role1: 'Chieftain', role2: 'Clan', entity1: 19, entity2: 3, start: 1386, end: 1423, note: 'Domhnall chieftain of Clan Donald' },
  { id:  11, type: 'marriage', role1: 'Spouse', role2: 'Spouse', entity1: 19, entity2: 21, start: 1400, end: 1423, note: 'Domhnall married to Mary Leslie (wedding date unknown)' },
  { id:  12, type: 'kingship', role1: 'King', role2: 'Kingdom', entity1: 30, entity2: 1, start: 1371, end: 1390, note: 'Robert II king of Scots' },
  { id:  13, type: 'descent', role1: 'Father', role2: 'Daughter', entity1: 30, entity2: 31, start: 1345, end: 1390, note: 'Robert II father of Margaret' },
  { id:  14, type: 'marriage', role1: 'Spouse', role2: 'Spouse', entity1: 15, entity2: 31, start: 1345, end: 1386, note: 'Eòin (Ìle) married to Margaret -- dates unknown' },
  { id:  15, type: 'descent', role1: 'Mother', role2: 'Son', entity1: 31, entity2: 19, start: 1350, end: 1390, note: 'Margaret mother of Domhnall' },
]