class Context {
  constructor(definitions) {
    this.definitions = definitions;
    this.instances = new Map();
  }

  getComponent(componentId) {
    if (this.instances.has(componentId)) {
      return this.instances.get(componentId);
    }
    if (this.definitions.has(componentId)) {
      console.log(`Instantiating component '${componentId}'`);
      const definition = this.definitions.get(componentId);
      const names = definition.componentMeta.paramNames;
      const components = Array.from(names, (name) => {
        return this.getComponent(name);
      });

      const prototype = definition.component.prototype;
      definition.methodHandlers.forEach((handler, methodName) => {
        if (prototype.hasOwnProperty(methodName)) {
          const methodDescriptor = Object.getOwnPropertyDescriptor(prototype, methodName);
          const method = new Proxy(methodDescriptor.value, handler);
          Object.defineProperty(definition.component.prototype, methodName, {
            value: method,
            writable: true,
            configurable: true
          });
        }
      });

      const instance = new definition.component(...components);
      this.instances.set(componentId, instance);
      return instance;
    } else {
      throw new Error(`Component '${componentId}' does not exist`);
    }
  }
}

module.exports = Context;