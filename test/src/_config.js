const WAIT_FOR_INPUT_TIME = 500;
const testsConfig = [{
  name: 'G S',
  keyCodes: [71, 83]
}, {
  name: 'G S P',
  keyCodes: [71, 83, 80]
}, {
  name: 'COMMAND ENTER G S P',
  keyCodes: [91, 13, 71, 83, 80]
}, {
  name: 'COMMAND ENTER',
  keyCodes: [91, 13]
}, {
  name: 'up up down down left right left right b a',
  keyCodes: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
}];