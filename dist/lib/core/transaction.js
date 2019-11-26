"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["CREATED"] = "CREATED";
    TransactionStatus["SIGNED"] = "SIGNED";
    TransactionStatus["SUBMITTED"] = "SUBMITTED";
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["FAILED"] = "FAILED";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
class GenericTransaction {
    constructor(from, to, amount, nonce, options) {
        this.id = "";
        // public receipt: any;
        this.raw = Buffer.from("");
        this.status = TransactionStatus.CREATED;
        this.times = [];
        this.from = from;
        this.to = to;
        this.nonce = nonce;
        this.options = options;
        this.amount = amount;
        this.addTime(TransactionStatus.CREATED);
    }
    static getImplementedClassName(name) {
        name = name.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1) + "Transaction";
    }
    /**
     * Sets transaction status to signed, adds raw data and indexes event
     * @param data
     */
    setSignedResult(data) {
        this.addTime(TransactionStatus.SIGNED);
        this.status = TransactionStatus.SIGNED;
        this.raw = data;
    }
    /**
     * Sets transaction status to pending and indexes event
     * @param data
     */
    setPending() {
        this.addTime(TransactionStatus.PENDING);
        this.status = TransactionStatus.PENDING;
    }
    setStatus(status) {
        this.addTime(status);
        this.status = status;
    }
    ;
    /**
   * Sets transaction status to final, adds txn and indexes event
   * @param data
   */
    setTxn(txn) {
        this.addTime(TransactionStatus.SUBMITTED);
        this.status = TransactionStatus.PENDING;
    }
    /**
     * Converts number to hex string
     * @param num
     * @returns hex representation
     */
    getNumberToHex(num) {
        return "0x" + num.toString(16);
    }
    /**
     * Adds time to current event
     * @param eventName
     */
    addTime(eventName) {
        this.times.push({
            name: eventName,
            unixtime: Math.round((new Date()).getTime() / 1000),
        });
    }
}
exports.GenericTransaction = GenericTransaction;
//# sourceMappingURL=transaction.js.map