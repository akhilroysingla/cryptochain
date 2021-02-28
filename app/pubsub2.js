const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-84fe1f34-6958-48b9-b9b5-21cf4b68cf65',
    subscribeKey: 'sub-c-5e7cd3d2-6635-11eb-81bb-860280fa0f6a',
    secretKey: 'sec-c-MzU4YmZlYmItYTdlYi00MDEwLWE2MjEtOTUyMDllNWNiMzgy' 
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;

        this.transactionPool = transactionPool;

        this.wallet = wallet;

        this.pubnub = new PubNub(credentials);
        
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                
                console.log(`Message Received. Channel: ${channel}, Message: ${message}.`);

                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parsedMessage, true, () => {
                            this.transactionPool.clearBlockchainTransactions({
                                chain: parsedMessage
                            })
                        });
                        break;
                    case CHANNELS.TRANSACTION:
                        // if (!this.transactionPool.existingTransaction({
                        //     inputAddress: this.wallet.publicKey
                        // })) {
                        const transaction = parsedMessage
                        if (this.wallet.publicKey !== transaction.input.address) {
                            this.transactionPool.setTransaction(parsedMessage);
                          }
                        // this.transactionPool.setTransaction(parsedMessage);
                        break;
                    default:
                        return;
                }
            }
        };
    }

    publish({ channel, message }) {
        // this.pubnub.unsubscribe(channel, () => {
        //     this.pubnub.publish(channel, message, () => {
        //         this.pubnub.subscribe(channel);
        //     });    
        // })
        this.pubnub.publish({ channel, message });
    }
}

// const testPubSub = new PubSub();
// testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;