/*
Module provides a function that returns the display name of a component
Note: this module is currently dormant
*/

/**
 * Function returns the display name of a component
 * @param {component} wrapped component - returns display name of wrapped component
 */
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default getDisplayName
