import {Variable, Priority, VarList, Mutations, Util, Readable, Schedulable, Writable, Named, Reaction, Deadline, Action, Startup, Scheduler, Timer, Reactor, Port, OutPort, InPort, App } from "./reactor";
import {TimeUnit,TimeInterval, UnitBasedTimeInterval, TimeInstant, Origin, getCurrentPhysicalTime } from "./time"
// Code generated by the Lingua Franca compiler for reactor Printer in SendingInside
// =============== START reactor class Printer
class Printer extends Reactor {
    count: number; // State
    x: InPort<number>;
    constructor(parent:Reactor) {
        super(parent);
        this.count = 1; // State
        this.x = new InPort<number>(this);
        this.addReaction(new class<T> extends Reaction<T> {
            //@ts-ignore
            react(x: Readable<number>, ) {
                var self = this.parent as Printer;
                console.log("Inside reactor received: "
                  + x.get());
                if ((x.get() as number) != self.count) {
                    console.log("FAILURE: Expected " + self.count);
                    self.util.failure();
                    //throw new Error("FAILURE: Expected " + (this.state as any).count);
                }
                self.count++;
            }
        }(this, this.check(this.x, ), this.check(this.x, )));
    }
}
// =============== END reactor class Printer

// Code generated by the Lingua Franca compiler for reactor SendingInside in SendingInside
// =============== START reactor class SendingInside
class SendingInside extends App {
    p: Printer
    t: Timer;
    count: number; // State
    constructor(name: string, timeout: TimeInterval | null, success?: ()=> void, fail?: ()=>void) {
        super(timeout, success, fail);
        this.p = new Printer(this)
        this.t = new Timer(this, new UnitBasedTimeInterval(0, TimeUnit.msec), new UnitBasedTimeInterval(1, TimeUnit.sec));
        this.count = 0; // State
        this.addReaction(new class<T> extends Reaction<T> {
            //@ts-ignore
            react(p: { x: Writable,  }, ) {
                var self = this.parent as SendingInside;
                self.count++;
                p.x.set(self.count);
            }
        }(this, this.check(this.t, ), this.check({ x: this.getWritable(this.p.x),  }, )));
    }
}
// =============== END reactor class SendingInside

// ************* Instance SendingInside of class SendingInside
let _app = new SendingInside('SendingInside', new UnitBasedTimeInterval(2, TimeUnit.sec))
// ************* Starting Runtime for SendingInside of class SendingInside
_app._start();