import { SourceModule } from '@mochiapp/js';
import './core';

type ConstructorInitializer<T> = new () => T;

const runner = <T extends SourceModule>(
  constructor: ConstructorInitializer<T>
): T => {
  // Stub
  return new constructor();
};

export default runner;
