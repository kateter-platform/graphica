import EventEmitter from "eventemitter3";

const STATE_CHANGE_EVENT = "stateChange";

type StateOptions = {
  inLegend?: boolean;
};

const defaultStateOptions = {
  inLegend: true,
};

class State<T> {
  private stateName: string;
  private state: T;
  private emitter: EventEmitter;
  public inLegend: boolean;

  constructor(stateName: string, initialState: T, options?: StateOptions) {
    const { inLegend } = {
      ...defaultStateOptions,
      ...options,
    };
    this.stateName = stateName;
    this.state = initialState;
    this.inLegend = inLegend;
    this.emitter = new EventEmitter();
  }

  getState(): T {
    return this.state;
  }

  getStateName(): string {
    return this.stateName;
  }

  setState(newState: T): void {
    this.state = newState;
    this.emitter.emit(STATE_CHANGE_EVENT, this.state);
  }

  addObserver(callback: (state: T) => void): void {
    this.emitter.on(STATE_CHANGE_EVENT, callback);
  }

  removeObserver(callback: (state: T) => void): void {
    this.emitter.off(STATE_CHANGE_EVENT, callback);
  }
}

export default State;
