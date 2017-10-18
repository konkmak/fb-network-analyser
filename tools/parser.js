const fs = require('fs');
const _ = require('underscore');

const parseData = function(userId, network) {
  const nodes = [];
  const links = [];
  
  const linkMap = [];
  
  for (node of network) {
      nodes.push({id: node.id, name: node.name, degree: node.friends.length});
  }
  
  for (node of network) {
    
    // Check if all node's friends are actually mutual friends
    const isDataCorrect = _.every(node.friends, friend => nodes.find(n => n.id === friend));

    if (isDataCorrect) {
      for (friend of node.friends) {
        if (friend !== node.id) {
          const id = [friend, node.id].sort().join('');
          if (linkMap.indexOf(id) === -1) {
            linkMap.push(id);
            links.push({source: node.id, target: friend})
          }
        }
      }
    } else {
      console.log(`Found invalid entry with ${node.name}, cleaning...`)
      if (userId !== node.id) {
        const id = [userId, node.id].sort().join('');

        // No friends in common
        const nodeIndex = nodes.findIndex(n => n.id === node.id);
        if (nodeIndex !== -1) {
          nodes[nodeIndex].degree = 1;
        }

        if (linkMap.indexOf(id) === -1) {
          linkMap.push(id);
          links.push({source: node.id, target: userId})
        }
      }
    }

  }
  
  const stringifiedNodes = JSON.stringify(nodes);
  fs.writeFile(__dirname + '/../src/data/nodes.json', stringifiedNodes, function (err) {
    if (err) 
        return console.log(err);
        console.log(`Created list of ${nodes.length} nodes.`);
  });
  
  const stringifiedLinks = JSON.stringify(links);
  fs.writeFile(__dirname + '/../src/data/links.json', stringifiedLinks, function (err) {
    if (err) 
        return console.log(err);
        console.log(`Created list of ${links.length} edges.`);
  });
}

module.exports = {
  parseData: parseData
}