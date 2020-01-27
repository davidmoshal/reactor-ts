import {Reactor, InPort, Reaction, Readable, Triggers, Args, State, Present} from '../core/reactor';

function print(this:Reaction<any>, i: Readable<unknown>, expected: State<unknown>) {
    const received = i.get();
    if (received) {
        console.log("Logging: " + received);
        if(received == expected.get()) {
            this.util.exec.success();
        } else {
            this.util.exec.failure();
        }
    } else {
        throw new Error("Log had no input available. This shouldn't happen because the logging reaction is triggered by the input");
    }
}

export class Logger extends Reactor {

    i = new InPort(this);

    constructor(parent:Reactor, expected:Present) {
        super(parent);
        this.addReaction(new Triggers(this.i), new Args(this.i, new State(expected)), print);
    }

}