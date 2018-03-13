module.exports = function(RED) {
    function RootReducer(config) {
        RED.nodes.createNode(this, config);
        const context = this.context();
        const node = this;
        this.on('input', function(msg) {

          const substateName = msg.substateName;
          const substate = msg.substate;
          let currentSubstate = {};

          if (global.state === undefined) {
            global.state = {};
          }

          let currentState = global.state;

          if (substateName !== undefined && substate !== undefined) {
              currentState[substateName] = substate;
              global.state = currentState;
              currentSubstate[substateName] = substate;
              currentSubstate.topic = 'state/' + substateName;
          } else {
              node.error("Please use a Reducer Node as input for this Node.");
          }
          node.send([ {state: currentState, topic: '/state'} , currentSubstate]);
        });
    }
    RED.nodes.registerType("RootReducer", RootReducer);
};
