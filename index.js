import { Worker } from 'worker_threads';
import os from 'os';

function runService(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./threads/worker.js', { workerData });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
    });
}

async function run() {
    const cpuCount = os.cpus().length / 2;
    const startTime = performance.now();
    const workerPromises = [];
    console.info(`MAX THREADS: ${cpuCount}`);

    for (let i = 0; i < cpuCount; i++) {
        workerPromises.push(runService(`Worker ${i + 1}`));
    }

    (await Promise.allSettled(workerPromises)).forEach((result, index) => {
        if (index === 0) {
            console.info(`TOTAL WORKERS: ${workerPromises.length}`);
            console.info(`TOTAL EXECUTION TIME: ${(performance.now() - startTime).toFixed(2)}ms`);
        }


        if (result.status === 'fulfilled') {
            console.log(`Result from Worker ${index + 1}:`, result.value);
        } else {
            console.error(`Error from Worker ${index + 1}:`, result.reason);
        }
    });
}

run().catch(err => console.error(err))