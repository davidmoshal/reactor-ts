import {Args, Parameter, State, Variable, Priority, Mutation, Util, Readable, Schedulable, Triggers, Writable, Named, Reaction, Action, Startup, Scheduler, Timer, Reactor, Port, OutPort, InPort, App } from "./core/reactor";
import {TimeUnit,TimeInterval, UnitBasedTimeInterval, TimeInstant, Origin, getCurrentPhysicalTime } from "./core/time"
// Code generated by the Lingua Franca compiler for reactor Source in Deadline
// =============== START reactor class Source
export class Source extends Reactor {
    t: Timer;
    period: Parameter<TimeInterval>;
    count: State<number>;
    y: OutPort<number>;
    constructor (parent:Reactor, period: TimeInterval = new UnitBasedTimeInterval(1, TimeUnit.sec)) {
        super(parent);
        this.t = new Timer(this, 0, period);
        this.period = new Parameter(period); // Parameter
        this.count = new State(0);
        this.y = new OutPort<number>(this);
        this.addReaction(
            new Triggers(this.t),
            new Args(this.t, this.getWritable(this.y), this.period, this.count),
            function(this, t: Readable<TimeInstant>, y: Writable<number>, period: Parameter<TimeInterval>, count: State<number>) {
                if (2 * Math.floor(count.get() / 2) != count.get()){
                    // The count variable is odd.
                    // Busy wait 0.2 sconds to cause a deadline violation.
                    let initialElapsedTime = this.util.time.getElapsedPhysicalTime();
                    while ( this.util.time.getElapsedPhysicalTime().isSmallerThan(initialElapsedTime.add( new UnitBasedTimeInterval(200, TimeUnit.msec))));
                }
                console.log("Source sends: " + count.get());
                y.set(count.get());
                count.set(count.get() + 1);
            }
        );
    }
}
// =============== END reactor class Source

// Code generated by the Lingua Franca compiler for reactor Destination in Deadline
// =============== START reactor class Destination
export class Destination extends Reactor {
    timeout: Parameter<TimeInterval>;
    count: State<number>;
    x: InPort<number>;
    constructor (parent:Reactor, timeout: TimeInterval = new UnitBasedTimeInterval(1, TimeUnit.sec)) {
        super(parent);
        this.timeout = new Parameter(timeout); // Parameter
        this.count = new State(0);
        this.x = new InPort<number>(this);
        this.addReaction(
            new Triggers(this.x),
            new Args(this.x, this.timeout, this.count),
            function(this, x: Readable<number>, timeout: Parameter<TimeInterval>, count: State<number>) {
                console.log("Destination receives: " + x.get());
                if (2 * Math.floor(count.get() / 2) != count.get()) {
                    // The count variable is odd, so the deadline should have been violated.
                    console.log("ERROR: Failed to detect deadline.");
                    this.util.exec.failure()
                    //throw new Error("ERROR: Failed to detect deadline.");
                }
                count.set(count.get() + 1);
            },
            this.timeout.get(),
            function(this, x: Readable<number>, timeout: Parameter<TimeInterval>, count: State<number>) {
                console.log("Destination deadline handler receives: " + x.get());
                if (2 * Math.floor(count.get() / 2) == count.get()) {
                    // The count variable is even, so the deadline should not have been violated.
                    console.log("ERROR: Deadline miss handler invoked without deadline violation.");
                    this.util.exec.failure()
                    //throw new Error("ERROR: Deadline miss handler invoked without deadline violation.");
                }
                count.set(count.get() + 1);
            }
        );
    }
}
// =============== END reactor class Destination

// Code generated by the Lingua Franca compiler for reactor Deadline in Deadline
// =============== START reactor class Deadline
export class Deadline extends App {
    s: Source
    d: Destination
    constructor(name: string, timeout: TimeInterval | undefined = undefined, keepAlive: boolean = false, success?: () => void, fail?: () => void) {
        super(timeout, keepAlive, success, fail);
        this.s = new Source(this, undefined)
        this.d = new Destination(this, new UnitBasedTimeInterval(100, TimeUnit.msec))
        this._connect(this.s.y, this.d.x);
    }
}
// =============== END reactor class Deadline

// ************* Instance Deadline of class Deadline
let _app = new Deadline('Deadline', new UnitBasedTimeInterval(2, TimeUnit.sec))
// ************* Starting Runtime for Deadline of class Deadline
_app._start();
