import { environment } from '../../environments/environment';

export namespace Assert {

  export function NotEqual<T>(expected: T, actual: T) {
    True(expected != actual);
  }

  export function RefNotEqual<T>(expected: T, actual: T) {
    True(expected !== actual);
  }

  export function Equal<T>(expected: T, actual: T) {
    True(expected == actual);
  }

  export function WeakEqual<T>(expected: T, actual: T) {
    True(expected == actual);
  }

  export function RefEqual<T>(expected: T, actual: T) {
    True(expected === actual);
  }

  export function False(expression: boolean) {
    True(!expression);
  }

  export function True(expression: boolean) {
    if (!expression) {
      Fail();
    }
  }

  export function Fail() {
    if (!environment.production) {
      throw new Error('Assertion error!');
    }
  }

}
