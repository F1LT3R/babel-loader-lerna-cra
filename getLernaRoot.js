const path = require('path');
const findUp = require('find-up');
 
module.exports = () => path.parse(findUp.sync('lerna.json')).dir;
