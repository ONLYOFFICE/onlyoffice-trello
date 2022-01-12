import { Injectable } from "@nestjs/common";
import { EventEmitter } from "events";
import { fromEvent } from "rxjs";

/**
 * A handy wrapper over event emitter (SSE)
 */
@Injectable()
export class EventService {
    private readonly emitter: EventEmitter;
    private readonly eventName = 'DOCUMENT_KEY';

    constructor() {
        this.emitter = new EventEmitter();
    }

    /**
     *
     * @returns
     */
    subscribe() {
        return fromEvent(this.emitter, this.eventName);
    }

    /**
     *
     * @param id
     */
    async emit(id: string) {
        this.emitter.emit(this.eventName, id);
    }
}
