const Glob = require('glob');
const Path = require('path');
const CamelCase = require('camelcase');

const JsReflection = require('../reflection/js_reflection');
const Context = require('./context');

class ContextLoader {
  constructor(dir, includePattern, methodHandlers) {
    this.dir = dir;
    this.includePattern = includePattern;
    this.methodHandlers = methodHandlers;
    this.definitions = new Map();
  }

  /**
   * Reads files and creates definitions
   *
   * @returns {Context}
   */
  createContext() {
    Glob.sync(Path.join(Path.resolve(this.dir), this.includePattern))
      .forEach((filePath) => {
        const definition = this.createDefinition(filePath);
        this.definitions.set(definition.componentId, definition);
      });

    return new Context(this.definitions)
  }

  createDefinition(filePath) {
    const extracted = this.loadComponent(filePath);
    console.log(`Loading component '${extracted.componentId}' definition`);
    if (this.definitions.has(extracted.componentId)) {
      throw new Error(`Bean duplicate found: '${extracted.componentId}'`)
    }

    const __ret = this.findMethodsHandler(extracted);
    let selectedHandlers = __ret.selectedHandlers;
    const component = __ret.component;

    const componentMeta = JsReflection(component);
    return {
      componentId: extracted.componentId,
      component: component,
      methodHandlers: selectedHandlers,
      componentMeta: componentMeta
    }
  }

  findMethodsHandler(extracted) {
    let selectedHandlers = new Map();

    const component = extracted.component;
    const componentName = extracted.component.name;

    this.methodHandlers.forEach(handler => {
      handler.classPatterns.forEach((classPattern) => {
        const classRegex = new RegExp(classPattern);
        if (componentName.match(classRegex)) {
          const methodNames = this.getAllMethods(new component());
          console.log(methodNames);
          handler.methodPatterns.forEach((methodPattern) => {
            methodNames.forEach((methodName) => {
              const methodRegex = new RegExp(methodPattern);
              if (methodName.match(methodRegex)) {
                console.log("MATCH");
                selectedHandlers.set(methodName, handler.handler);
              }
            });
          });
        }
      });
    });
    return {selectedHandlers, component};
  }

  getAllMethods(obj) {
    let props = [];

    do {
      const l = Object.getOwnPropertyNames(obj)
        .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
        .sort()
        .filter((p, i, arr) =>
          typeof obj[p] === 'function' &&  //only the methods
          p !== 'constructor' &&           //not the constructor
          (i === 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
          props.indexOf(p) === -1          //not overridden in a child
        );
      props = props.concat(l);
    }
    while (
      (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
      Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
      );

    return props
  }

  loadComponent(filePath) {
    const component = require(filePath);
    const componentName = component.name;
    let componentId = CamelCase(componentName);
    if (!componentId) {
      const fileNameWithExtension = Path.basename(filePath);
      const fileName = fileNameWithExtension.substring(0, fileNameWithExtension.length - 3);
      componentId = CamelCase(fileName)
    }
    return {component, componentId};
  }
}

module.exports = ContextLoader;