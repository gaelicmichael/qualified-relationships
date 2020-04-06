/*** QR Management System
 *** Function closure that manages entities and relationships
 *** INPUT
 ***  entities: array of
 ***    id: String
 ***    label: String
 ***    type: String
 ***    start: Number
 ***    end: Number
 ***
 ***  relationDefs: object of
 ***    [id]: {
 ***      label: String
 ***      color: String
 ***      roles: [ String ]
 ***      roleColors: [ String ]
 ***    }
 ***
 ***  relations: array of
 ***    id: String
 ***    type: String (corresponds to name of relationDef)
 ***    role1: String
 ***    role2: String
 ***    id1: String
 ***    id2: String
 ***    start: Number
 ***    end: Number
 ***/

function QRManager(entityDefs, entities, relationDefs, relations) {

  function fetchEntityLabel(id) {
    let e = entities.find(e => (e.id === id));
    return e ? e.label : '';
  }

  function fetchExpandedRelation(thisRelation) {
    let thisRelationDef = relationDefs[thisRelation.type];

    return {
      id: thisRelation.id,
      type: thisRelationDef.label,
      typeColor: thisRelationDef.color,
      role1: thisRelation.role1,
      role2: thisRelation.role2,
      entity1: fetchEntityLabel(thisRelation.entity1),
      entity2: fetchEntityLabel(thisRelation.entity2),
      start: thisRelation.start,
      end: thisRelation.end,
    }
  }

  return {
    getEntityLabel: function(id) {
      return fetchEntityLabel(id);
    }, // getEntityLabel()

    // RETURN: array of { id, label }
    getEntities: function(apply, timeVal) {
      if (!apply) {
        return entities;
      }
      return entities.filter(e => (e.start <= timeVal && timeVal <= e.end));
    }, // getEntities()

    getRelations: function(apply, timeVal) {
      if (!apply) {
        return relations;
      }
      return relations.filter(r => (r.start <= timeVal && timeVal <= r.end));
    },

    getEntityRelations: function(theEntity, expand) {
      let id = theEntity.id;
      if (expand) {
        let er = [];
        relations.forEach(function(thisRelation) {
          if ((thisRelation.entity1 === id) || (thisRelation.entity2 === id)) {
            er.push(fetchExpandedRelation(thisRelation));
          }
        });
        return er;
      } else {
        return relations.filter(r => (r.entity1 === id) || (r.entity2 === id));
      }
    },
  
    // RETURN: object with expanded fields
    expandRelation: function(thisRelation) {
      return fetchExpandedRelation(thisRelation);
    },
  }

} // QRManager()

export default QRManager;