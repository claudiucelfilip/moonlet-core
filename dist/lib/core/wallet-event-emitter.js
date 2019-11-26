"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WalletEventType;
(function (WalletEventType) {
    WalletEventType["TRANSACTION_UPDATE"] = "TRANSACTION_UPDATE";
})(WalletEventType = exports.WalletEventType || (exports.WalletEventType = {}));
class WalletEventEmitter {
    static emit(type, data) {
        setTimeout(() => WalletEventEmitter.subscribers.map(callback => {
            if (typeof callback === 'function') {
                callback(type, data);
            }
        }));
    }
    ;
    static subscribe(callback) {
        if (typeof callback === 'function') {
            WalletEventEmitter.subscribers.push(callback);
        }
        return () => {
            WalletEventEmitter.subscribers.splice(WalletEventEmitter.subscribers.indexOf(callback), 1);
        };
    }
    ;
}
WalletEventEmitter.subscribers = [];
exports.WalletEventEmitter = WalletEventEmitter;
//# sourceMappingURL=wallet-event-emitter.js.map