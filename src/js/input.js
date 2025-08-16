export const keys = {};

export function handleInput(event, isDown) {
  keys[event.key] = isDown;
  event.preventDefault();
}
