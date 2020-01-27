import {Args, Present, Parameter, State, Variable, Priority, Mutation, Util, Readable, Schedulable, Triggers, Writable, Named, Reaction, Action, Startup, Scheduler, Timer, Reactor, Port, OutPort, InPort, App } from "./reactor";
import {TimeUnit,TimeInterval, UnitBasedTimeInterval, TimeInstant, Origin, getCurrentPhysicalTime } from "./time"
// Code generated by the Lingua Franca compiler for reactor HelloWorldInside in HelloWorld
// =============== START reactor class HelloWorldInside
export class HelloWorldInside extends Reactor {
    t: Timer;
    constructor (parent:Reactor) {
        super(parent);
        this.t = new Timer(this, 0, 0);
        this.addReaction(
            new Triggers(this.t),
            new Args(this.t),
            function (this, t: Readable<TimeInstant>) {
                console.log("Hello World.");
            }
        );
    }
}
// =============== END reactor class HelloWorldInside

// Code generated by the Lingua Franca compiler for reactor HelloWorld in HelloWorld
// =============== START reactor class HelloWorld
export class HelloWorld extends App {
    a: HelloWorldInside
    constructor (name: string, timeout: TimeInterval | undefined = undefined, keepAlive: boolean = false, success?: () => void, fail?: () => void) {
        super(timeout, keepAlive, success, fail);
        this.a = new HelloWorldInside(this)
    }
}
// =============== END reactor class HelloWorld

// ************* Instance HelloWorld of class HelloWorld
let _app = new HelloWorld('HelloWorld')
// ************* Starting Runtime for HelloWorld of class HelloWorld
_app._start();