"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_tracker_1 = require("./transactions-tracker");
const transaction_1 = require("./transaction");
var AccountType;
(function (AccountType) {
    AccountType["HD"] = "HD";
    AccountType["LOOSE"] = "LOOSE";
    AccountType["HARDWARE"] = "HARDWARE";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
var HWDevice;
(function (HWDevice) {
    HWDevice["LEDGER"] = "LEDGER";
})(HWDevice = exports.HWDevice || (exports.HWDevice = {}));
class GenericAccount {
    /**
     * Creates an instance of generic account.
     * @param accountOptions
     */
    constructor(accountOptions) {
        this.address = "";
        this.publicKey = "";
        this.privateKey = "";
        this.accountIndex = "";
        this.derivationIndex = "";
        this.derivationPath = "";
        this.supportsCancel = false;
        this.transactions = [];
        this.disabled = false;
        this.node = accountOptions.node;
        switch (accountOptions.type) {
            case AccountType.HD:
                if (!accountOptions.hd) {
                    throw new Error("accountOptions.hd parameter missing");
                }
                this.hd = accountOptions.hd;
                break;
            case AccountType.LOOSE:
                if (!accountOptions.privateKey) {
                    throw new Error("accountOptions.privateKey parameter missing");
                }
                this.privateKey = accountOptions.privateKey;
                break;
            case AccountType.HARDWARE:
                if (!accountOptions.deviceType) {
                    throw new Error("accountOptions.deviceType parameter missing");
                }
                this.deviceType = accountOptions.deviceType;
                if (!accountOptions.address) {
                    throw new Error("accountOptions.address parameter missing");
                }
                this.address = accountOptions.address;
                if (!accountOptions.accountIndex) {
                    throw new Error("accountOptions.accountIndex parameter missing");
                }
                this.accountIndex = accountOptions.accountIndex;
                if (!accountOptions.derivationIndex) {
                    throw new Error("accountOptions.derivationIndex parameter missing");
                }
                this.derivationIndex = accountOptions.derivationIndex;
                this.publicKey = accountOptions.publicKey;
                this.derivationPath = accountOptions.derivationPath;
                break;
            default:
                throw new Error("accountOptions.type '" + accountOptions.type + "' not found");
        }
        this.type = accountOptions.type;
        this.addressFormats = {
            default: this.address
        };
    }
    static getImplementedClassName(name) {
        name = name.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1) + "Account";
    }
    /**
     * Trys hd wallet setup
     */
    tryWalletSetup() {
        if (this.type === AccountType.HD && this.hd !== undefined) {
            this.privateKey = this.utils.bufferToHex(this.hd.getPrivateKey());
            this.publicKey = this.utils.bufferToHex(this.utils.privateToPublic(this.hd.getPrivateKey()));
            this.address = this.utils.toChecksumAddress(this.utils.privateToAddress(this.hd.getPrivateKey()).toString("hex"));
        }
        else if (this.type === AccountType.LOOSE) {
            this.publicKey = this.utils.bufferToHex(this.utils.privateToPublic(Buffer.from(this.privateKey, "hex")));
            this.address = this.utils.toChecksumAddress(this.utils.privateToAddress(Buffer.from(this.privateKey, "hex")).toString("hex"));
        }
        this.addressFormats.default = this.address;
    }
    /**
     * Gets transactions
     * @returns transactions
     */
    getTransactions() {
        return this.transactions;
    }
    /**
     * Sends transaction
     * @param transaction
     * @param [cb]
     * @param [cbtype]
     * @returns send
     */
    send(transaction) {
        this.transactions.push(transaction);
        if (transaction.status === transaction_1.TransactionStatus.SIGNED) {
            transaction.setPending();
            return this.node.send(transaction).then((txndata) => {
                transaction.setTxn(txndata);
                transactions_tracker_1.TransactionTracker.register(this, transaction);
                // kaya does not throw this error properly..
                if (txndata === "Invalid Tx Json") {
                    throw new Error("Invalid Tx Json");
                }
                // load extra transaction details
                return this.node.getTransactionReceipt(transaction).then(receiptdata => {
                    return Promise.resolve({ txn: txndata, receipt: receiptdata });
                }).catch(error => {
                    return Promise.resolve({ txn: txndata, receipt: undefined });
                });
            }).catch((error) => {
                return Promise.reject(new Error(error));
            });
        }
        return Promise.reject(new Error("Transaction status needs to be SIGNED"));
    }
}
exports.GenericAccount = GenericAccount;
//# sourceMappingURL=account.js.map