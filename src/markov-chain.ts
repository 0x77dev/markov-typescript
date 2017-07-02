import * as Collections from "typescript-collections";

import { ChainState } from "./chain-state";
import { MarkovChainItems } from "./markov-chain-items";
import { MarkovTerminalItems } from "./markov-terminal-items";
import * as utils from "./utils";
import { WeightedDictionary } from "./weighted-dictionary";

export class MarkovChain<T> {
    public readonly order: number;
    public readonly items: MarkovChainItems<T> = new MarkovChainItems<T>()
    public readonly terminals: MarkovTerminalItems<T> = new MarkovTerminalItems<T>();

    constructor(order: number = 2) {
        if (order < 0) { throw new RangeError("Order must not be less than 0."); }
        this.order = order;
    }

    learnAll(items: T[][]): void {
        items.forEach(item => this.learn(item));
    }

    learn(items: T[]): void {
        if (!items || items.length === 0) { return; }

        const previous: Collections.Queue<T> = new Collections.Queue<T>();
        items.forEach(item => {
            const key = ChainState.fromQueue<T>(previous);
            this.learnWithPrevious(key, item);
            previous.enqueue(item);
            if (previous.size() > this.order) {
                previous.dequeue();
            }
        });

        const terminalKey = ChainState.fromQueue<T>(previous);
        this.terminals.incrementValue(terminalKey, 1);
    }

    private learnWithPrevious(previous: ChainState<T>, next: T): void {
        let weights: WeightedDictionary<T>;
        if (!this.items.containsKey(previous)) {
            weights = new WeightedDictionary<T>();
            this.items.setValue(previous, weights);
        } else {
            weights = this.items.getValue(previous);
        }

        weights.incrementValue(next, 1);
    }

    walk(): T[] {
        return this.walkWithPrevious([]);
    }

    walkWithPrevious(previous: T[]): T[] {
        const retVal: T[] = new Array();
        const state: Collections.Queue<T> = new Collections.Queue<T>();
        previous.forEach(x => state.add(x));

        while (true) {
            while (state.size() > this.order) {
                state.dequeue();
            }

            const key = ChainState.fromQueue<T>(state);

            if (!this.items.containsKey(key)) { break; }

            const weights: WeightedDictionary<T> = this.items.getValue(key);

            let terminalWeight = 0;
            if (this.terminals.containsKey(key)) {
                terminalWeight = this.terminals.getValue(key);
            }

            const value = utils.randomNumberBetween(1, weights.totalWeight + terminalWeight);

            // Represents a terminal.
            if (value > weights.totalWeight) { break; }

            // Get the value that corresponds to.
            let currentWeight = 0;
            weights.forEach((k, v) => {
                currentWeight += v;
                if (currentWeight >= value) {
                    retVal.push(k);
                    state.enqueue(k);
                    return false;
                }
                return true;
            });
        }

        return retVal;
    }
};