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

  function binarySearch(value, theArray) {
    let start=0, end=theArray.length-1, index, item;

    if (theArray.length === 0) {
      return { found: false, index: 0 }
    }

    // Iterate while start not meets end 
    while (start <= end) {
        // Find the mid index 
        index = Math.floor((start + end)/2);
        item = theArray[index];
        // If element is present at mid, return True
        if (item === value) {
          return { found: true, index }
        // Else look in left or right half accordingly 
        } else if (item < value) {
          start = index + 1;
        } else {
          end = index - 1;
        }
    }

    // if current item is less than desired, then desired item goes after it
    if (item < value) {
      return { found: false, index: index + 1 };
    }
    return { found: false, index };
  } // binarySearch()

  function fetchEntityByID(id) {
    return entities.find(e => (e.id === id));
  }

  function fetchEntityLabel(id) {
    let e = fetchEntityByID(id);
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

  // RETURNS: Array of relations involving this entity
  function fetchRelationsFor(entityID) {
    return relations.filter(r => ((r.entity1 === entityID) || (r.entity2 === entityID)));
  } // fetchRelationsFor()

  // PURPOSE: Do the next level of tree growth in tree rooted in top node if
  //           not reached bottom, keeping track of relations used in usedIDs.
  //        { name, entity, children: [] }
  function growRecursiveTree(treeNode, usedIDs, curDepth, maxDepth, apply, timeVal) {
    if (curDepth >= maxDepth) {
      return;
    }
    let penultimateLevel = ((curDepth + 1) === maxDepth);
    let thisID = treeNode.entity.id;
    let curRelations = fetchRelationsFor(thisID);

    curRelations.forEach(function(thisRelation) {
      let isUsed, index;

      // Ignore if other entity has already appeared
      let otherEntityID = (thisRelation.entity1 === thisID) ? thisRelation.entity2 : thisRelation.entity1;
      let result = binarySearch(otherEntityID, usedIDs);
      isUsed = result.found;
      index = result.index;

      if (!isUsed) {
        let otherEntity = fetchEntityByID(otherEntityID);
        if (!otherEntity) {
          console.log("Data error in relation [non-existing entity reference] ", thisRelation);
        }
        // Apply time constraints
        if (!apply || (thisRelation.start <= timeVal && timeVal <= thisRelation.end)) {
          let newNode = penultimateLevel ? { name: otherEntityID, entity: otherEntity } :
                                            { name: otherEntityID, entity: otherEntity, children: [] };
          // Add this node to current children
          treeNode.children.push(newNode);
          // Add this relation to list of used
          if (usedIDs.length === 0) {
            usedIDs.push(otherEntityID);
          } else {
            usedIDs.splice(index, 0, otherEntityID);
          }
        }
      }
    });
    // recurse through all new children (breath not depth recusion)
    if (treeNode.children) {
      treeNode.children.forEach(function(thisChild) {
        // depth recurse on new child
        growRecursiveTree(thisChild, usedIDs, curDepth + 1, maxDepth, apply, timeVal);
      });
    }
  } // growRecursiveTree()

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

    // RETURN: D3 hierarchy centered on theEntity, applying time constraints
    //        { name, entity, children: [] }
    // NOTES:  Need to recurse down to # of max depth; usedIDs maintains a list
    //          of entity IDs (in order) to ensure we don’t retraverse the
    //          same relations back and forth
    getEntityHierarchy: function(theEntity, maxDepth, apply, timeVal) {
      let usedIDs = [theEntity.id];
      let tree = { name: theEntity.id, entity: theEntity, children: [] };
      growRecursiveTree(tree, usedIDs, 0, maxDepth, apply, timeVal);
      return tree;
    }
  } // return

} // QRManager()

export default QRManager;