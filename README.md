# Node Red Contribution: Reducere State Management

[![Build Status](https://travis-ci.org/doemski/node-red-contrib-reducere.svg?branch=master)](https://travis-ci.org/doemski/node-red-contrib-reducere)
[![npm version](https://badge.fury.io/js/node-red-contrib-reducere.svg)](https://badge.fury.io/js/node-red-contrib-reducere)

A State Management solution for [Node-RED](https://nodered.org/) heavily inspired by the popular JavaScript state container library [Redux](https://redux.js.org/). Just like in Redux, one consistent ('Single source of truth') application state is maintained in form of a JSON object.

This project was developed within the context of the [ProFi](http://prototyping4innovation.de/) research project funded by the German [Federal Ministry of Education and Research](https://www.bmbf.de/).

## Project status

This is an early but usable version which has been used for keeping a consistent state in a sizable scenario, where each of the components of the scenario communicated via MQTT. Bugs will probably occur. Most everything is subject for change, backwards compatibility is not the biggest concern at this stage.

## Installation

This assumes you have Node-RED already installed and working, if you need to install Node-RED see [here](http://nodered.org/docs/getting-started/installation).

Navigate to your Node-RED user directory:

```shell
# Windows default path
$ cd 'C:\Users\YOUR_USER_NAME\.node-red'

# Linux default path
$ cd ~/.node-red
```

Then install via [Node Package Manager](https://www.npmjs.com/):
```shell
$ npm install node-red-contrib-reducere
```
After the installation is complete restart Node-RED. There should be a new section 'Reducere State Management' in the Nodes-pane on the left.

## Future

If there is expressed interest in this project, the following list of features will be implemented:
- [ ] Proper testing
- [ ] Immutability checks for the substates and entire state
- [ ] Checks for side effects in Reducer functions
- [ ] In-project implementation for middlewares
- [ ] Better documentation
- [ ] A working example flow for better understanding

## Included nodes
Currently three nodes are included in this project:
- ActionCreator
- Reducer
- RootReducer

An explanation and example is given below. To obtain a better understanding for the concept behind a specific node please refer to the Redux documentation.

### ActionCreator
Node that receives an event message and outputs an action.

#### Example
Possible received event message when a user hits a light switch:
```js
{
  topic: "state/lightSwitch",
  payload: {
    lightSwitchStatus: "on"
  },
  _msgid: "6f907ddb.fdf2c4"  
}
```

Output action:
```js
{
  type: "LIGHTSWITCH_ACTIVATED",
  status: "on"
}
```

#### Fields
- __Name__: The name shown in the Node-RED workplace.
- __Type__: The identifying type of the action. Choose a unique name that is descriptive of the event that occurred (E.g. LIGHTSWITCH_ACTIVATED).
- __Data Source__: The name of the field in the incoming message's payload that contains the relevant data of the occurred event (E.g. 'lightSwitchStatus', which could contain the values 'on' or 'off').

### Reducer
A node that takes an action and a current substate and returns a new substate.

**Note**: It is recommended to have an ActionCreator which creates an initialization action ('INIT') at the start of the application. This way the Reducer can return the initial substate it is responsible for.

#### Example
Possible initial state of a reducer:
```js
{
  color: "red",
  status: "off"
}
```
Possible reducer function:
```js
const reduce = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return state;
    case 'LIGHTSWITCH_ACTIVATED':
      const newLightSwitchStatus = action.status;

      const updatedState = {
        ...state,
        status: newLightSwitchStatus
      }
      return updatedState;
    default:
      return state;
  }
}
```

#### Fields
- __Name__: The name shown in the Node-RED workplace.
- __Initial State__: The initial state of the substate this reducer is responsible for (E.g. {color: "green", status: "off"}).
- __Substate__: The name of the substate this reducer is responsible for (E.g. "light").
- __Function__: The actual reducer function that determines the new state.

### RootReducer
A node that combines all Reducer nodes and sends out the full state on Output 1 and the current substate on Output 2. This way the relevant part of an application can simply listen to changes to the slice of the state that it is concerned with.

Simply route all the outputs of your Reducer nodes into the RootReducer's input. No further configuration is required.

#### Example
Possible full state for a simple IoT scenario:
```js
{
  light: {
    color: "green",
    status: "off"
  },
  officeWindow: {
    open: "false"
  }
}
```
Each of the substates (light, officeWindow) are provided by a Reducer node.
#### Fields
- __Name__: The name shown in the Node-RED workplace.
