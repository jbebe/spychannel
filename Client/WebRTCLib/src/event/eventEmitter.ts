export interface Listener<T> {
	(event: T): any;
}

export interface Disposable {
	dispose(): void;
}

/** passes through events as they happen. You will not get events from before you start listening */
export class EventEmitter<T> {

	private listeners: Listener<T>[] = [];
	private listenersOnce: Listener<T>[] = [];

	public on = (listener: Listener<T>): Disposable => {
		this.listeners.push(listener);
		return {
			dispose: () => this.off(listener)
		};
	};

	public once = (listener: Listener<T>): void => {
		this.listenersOnce.push(listener);
	};

	public off = (listener: Listener<T>) => {
		var callbackIndex = this.listeners.indexOf(listener);
		if (callbackIndex > -1) this.listeners.splice(callbackIndex, 1);
	};

	public emit = (event: T) => {
		/** Update any general listeners */
		this.listeners.forEach((listener) => listener(event));

		/** Clear the `once` queue */
		this.listenersOnce.forEach((listener) => listener(event));
		this.listenersOnce = [];
	};

	public pipe = (te: EventEmitter<T>): Disposable => {
		return this.on((e) => te.emit(e));
	};
}