const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'initial' });
// console.log('difficulty:', blockchain.chain[1].timestamp - blockchain.chain[0].timestamp, blockchain.chain[1].difficulty);
// console.log('first block', blockchain.chain[blockchain.chain.length-1]);

let prevTimestamp, nexTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let i=0; i<1000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    
    blockchain.addBlock({ data: `block ${i}` });
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    // console.log('nextBlock', nextBlock);

    nexTimestamp = nextBlock.timestamp;
    timeDiff = nexTimestamp - prevTimestamp;
    times.push(timeDiff);

    average = times.reduce((total, num) => (total + num))/times.length;

    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`);
}