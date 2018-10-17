import { Assert } from '../../utils/assert';
import { HubConnection } from '@aspnet/signalr';

export function RemoteFunction() {
  return (methodObj, methodName: string, descriptor: PropertyDescriptor) => {

    Assert.True(methodName.endsWith('Async'));

    const remoteMethodName = methodName.substr(0, methodName.length - 'Async'.length);
    descriptor.value = async function (...args: any[]): Promise<any> {
      return await (<HubConnection>this.connection).invoke(
        remoteMethodName,
        ...args.map((e) => {
          if (typeof(e) === 'object') {
            return JSON.stringify(e);
          } else {
            return e;
          }
        }));
    };
  };
}

export function RemoteAction() {
  return (methodObj, methodName: string, descriptor: PropertyDescriptor) => {

    Assert.True(methodName.endsWith('Async'));

    const remoteMethodName = methodName.substr(0, methodName.length - 'Async'.length);
    descriptor.value = async function (...args: any[]): Promise<void> {
      return (<HubConnection>this.connection).send(
        remoteMethodName,
        ...args.map((e) => {
          if (typeof(e) === 'object') {
            return JSON.stringify(e);
          } else {
            return e;
          }
        }));
    };
  };
}
