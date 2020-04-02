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

function QRManager(entities, relationDefs, relations) {

  function fetchEntityLabel(id) {
    let e = entities.find(e => e.id === id)
    return e ? e.label : ''
  }

  return {
    getEntityLabel: function(id) {
      return fetchEntityLabel(id)
    }, // getEntityLabel()

    // RETURN: array of { id, label }
    getEntities: function(apply, timeVal) {
      if (!apply) {
        return entities;
      }
      return entities.filter(e => e.start <= timeVal && timeVal <= e.end)
    }, // getEntities()

    getRelations: function(apply, timeVal) {
      if (!apply) {
        return relations;
      }
      return relations.filter(r => r.start <= timeVal && timeVal <= r.end)
    },

    // RETURN: object with expanded fields:
    //          type, entity1 and entity2 with full labels
    expandRelation: function(relation) {
      return {
        id: relation.id,
        type: relationDefs[relation.type].label,
        role1: relation.role1,
        role2: relation.role2,
        entity1: fetchEntityLabel(relation.entity1),
        entity2: fetchEntityLabel(relation.entity2),
        start: relation.start,
        end: relation.end,
      }
    },
  }
} // QRManager()

export default QRManager;