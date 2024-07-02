import EventEmitter from "eventemitter3";

// Define the event name for state changes
const STATE_CHANGE_EVENT = "stateChange";

class State<T> {
  private stateName: string;
  private state: number;
  private emitter: EventEmitter;

  constructor(stateName: string, initialState: number) {
    this.stateName = stateName;
    this.state = initialState;
    this.emitter = new EventEmitter();
  }

  getState(): number {
    return parseFloat(this.state.toFixed(1));
  }

  getStateName(): string {
    return this.stateName;
  }

  // Method to set a new state and notify observers
  setState(newState: number): void {
    this.state = newState;
    this.emitter.emit(STATE_CHANGE_EVENT, this.state);
  }

  // Method to add an observer
  addObserver(callback: (state: number) => void): void {
    this.emitter.on(STATE_CHANGE_EVENT, callback);
  }

  // Method to remove an observer
  removeObserver(callback: (state: number) => void): void {
    this.emitter.off(STATE_CHANGE_EVENT, callback);
  }
}

export default State;
