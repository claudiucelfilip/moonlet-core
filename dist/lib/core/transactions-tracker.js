"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("./transaction");
class TransactionTracker {
    static register(account, transaction) {
        if (transaction.status !== transaction_1.TransactionStatus.SUCCESS && transaction.status !== transaction_1.TransactionStatus.FAILED) {
            TransactionTracker.transactions.push({ account, transaction });
            TransactionTracker.run();
        }
    }
    static stop() {
        if (TransactionTracker.timeoutRef) {
            clearTimeout(TransactionTracker.timeoutRef);
            TransactionTracker.timeoutRef = undefined;
        }
    }
    static run(interval) {
        TransactionTracker.stop();
        TransactionTracker.timeoutRef = setTimeout(() => {
            TransactionTracker.transactions.map((tx) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (tx.transaction.status !== transaction_1.TransactionStatus.SUCCESS && tx.transaction.status !== transaction_1.TransactionStatus.FAILED) {
                        let receipt = yield tx.account.node.getTransactionReceipt(tx.transaction);
                        //console.log(receipt);
                        tx.transaction.updateData(receipt);
                    }
                    else {
                        let index = TransactionTracker.transactions.indexOf(tx);
                        TransactionTracker.transactions.splice(index, 1);
                    }
                }
                catch (_a) {
                    // TODO handle errors
                }
            }));
            if (TransactionTracker.transactions.length > 0) {
                TransactionTracker.run();
            }
            else {
                TransactionTracker.stop();
            }
        }, interval || TransactionTracker.TIME_INTERVAL);
    }
}
TransactionTracker.TIME_INTERVAL = 30000; // 30 sec
TransactionTracker.transactions = [];
exports.TransactionTracker = TransactionTracker;
//# sourceMappingURL=transactions-tracker.js.map