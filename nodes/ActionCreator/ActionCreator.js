module.exports = function(RED){
    function actionCreator(config) {
      RED.nodes.createNode(this, config);
      const context = this.context();
      let node = this;
      this.on('input', function(msg) {
        let action = {
          type: config.actionType
        }

        if (config.dataSource === '') {
            msg.action = action;
        } else {
          if (msg[config.dataSource] === undefined) {
            node.error('Message object did not contain field specified in Data Source field');
          } else {
            action[config.dataSource] = msg[config.dataSource];
            msg.action = action;
          }
        }

        node.send(msg);
      });
    }
    RED.nodes.registerType("ActionCreator", actionCreator);
};
