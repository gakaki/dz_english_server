"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var STATUS;
(function (STATUS) {
    STATUS[STATUS["MULTIDEVICE"] = -4] = "MULTIDEVICE";
    STATUS[STATUS["HFDENY"] = -3] = "HFDENY";
    STATUS[STATUS["TIMEOUT"] = -2] = "TIMEOUT";
    STATUS[STATUS["FAILED"] = -1] = "FAILED";
    STATUS[STATUS["OK"] = 0] = "OK";
    STATUS[STATUS["DELAY_RESPOND"] = 10000] = "DELAY_RESPOND";
    STATUS[STATUS["REST_NEED_RELISTEN"] = 10001] = "REST_NEED_RELISTEN";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var StatusError = /** @class */ (function (_super) {
    __extends(StatusError, _super);
    function StatusError(code, msg) {
        var _this = _super.call(this, msg) || this;
        _this.code = code;
        return _this;
    }
    return StatusError;
}(Error));
exports.StatusError = StatusError;
