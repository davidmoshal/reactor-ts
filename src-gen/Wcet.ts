import {Variable, Priority, VarList, Mutations, Util, Readable, Schedulable, Writable, Named, Reaction, Deadline, Action, Startup, Scheduler, Timer, Reactor, Port, OutPort, InPort, App } from "./reactor";
import {TimeUnit,TimeInterval, UnitBasedTimeInterval, TimeInstant, Origin, getCurrentPhysicalTime } from "./time"
// Code generated by the Lingua Franca compiler for reactor Source in Wcet
// =============== START reactor class Source
class Source extends Reactor {
    t: Timer;
    out1: OutPort<number>;
    out2: OutPort<number>;
    constructor(parent:Reactor) {
        super(parent);
        this.t = new Timer(this, 0, 0);
        this.out1 = new OutPort<number>(this);
        this.out2 = new OutPort<number>(this);
        this.addReaction(new class<T> extends Reaction<T> {
            //@ts-ignore
            react(out1: Writable<number>, out2: Writable<number>, ) {
                var self = this.parent as Source;
                out1.set(5);
                out2.set(10);
            }
        }(this, this.check(this.t, ), this.check(this.getWritable(this.out1),this.getWritable(this.out2),)));
    }
}
// =============== END reactor class Source

// Code generated by the Lingua Franca compiler for reactor Work in Wcet
// =============== START reactor class Work
class Work extends Reactor {
    in1: InPort<number>;
    in2: InPort<number>;
    out: OutPort<number>;
    constructor(parent:Reactor) {
        super(parent);
        this.in1 = new InPort<number>(this);
        this.in2 = new InPort<number>(this);
        this.out = new OutPort<number>(this);
        this.addReaction(new class<T> extends Reaction<T> {
            //@ts-ignore
            react(in1: Readable<number>, in2: Readable<number>, out: Writable<number>, ) {
                var self = this.parent as Work;
                let ret:number;
                if ((in1.get() as number) > 10) {
                    ret = (in2.get() as number) * (in1.get() as number);
                } else {
                    ret = (in2.get() as number) + (in1.get() as number);
                }
                out.set(ret);
            }
        }(this, this.check(this.in1, this.in2, ), this.check(this.in1, this.in2, this.getWritable(this.out),)));
    }
}
// =============== END reactor class Work

// Code generated by the Lingua Franca compiler for reactor Print in Wcet
// =============== START reactor class Print
class Print extends Reactor {
    x: InPort<number>;
    constructor(parent:Reactor) {
        super(parent);
        this.x = new InPort<number>(this);
        this.addReaction(new class<T> extends Reaction<T> {
            //@ts-ignore
            react(x: Readable<number>, ) {
                var self = this.parent as Print;
                console.log("Received: " + x.get());
            }
        }(this, this.check(this.x, ), this.check(this.x, )));
    }
}
// =============== END reactor class Print

// Code generated by the Lingua Franca compiler for reactor Wcet in Wcet
// =============== START reactor class Wcet
class Wcet extends App {
    source: Source
    work: Work
    print: Print
    constructor(name: string, timeout: TimeInterval | null, success?: ()=> void, fail?: ()=>void) {
        super(timeout, success, fail);
        this.source = new Source(this)
        this.work = new Work(this)
        this.print = new Print(this)
        this._connect(this.source.out1, this.work.in1);
        this._connect(this.source.out2, this.work.in2);
        this._connect(this.work.out, this.print.x);
    }
}
// =============== END reactor class Wcet

// ************* Instance Wcet of class Wcet
let _app = new Wcet('Wcet', null)
// ************* Starting Runtime for Wcet of class Wcet
_app._start();