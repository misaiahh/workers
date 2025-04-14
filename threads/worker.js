import { workerData, parentPort } from 'worker_threads';
import process from '../lib/process.js';

parentPort.postMessage({ hello: process(workerData) });