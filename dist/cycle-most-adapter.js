(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cycleMosAdapter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var most_subject_1 = (typeof window !== "undefined" ? window['mostSubject'] : typeof global !== "undefined" ? global['mostSubject'] : null);
function logToConsoleError(err) {
    var target = err.stack || err;
    if (console && console.error) {
        console.error(target);
    } else if (console && console.log) {
        console.log(target);
    }
}
var MostAdapter = {
    adapt: function adapt(originStream, originStreamSubscribe) {
        if (MostAdapter.isValidStream(originStream)) {
            return originStream;
        }
        ;
        var dispose;
        var stream = most_subject_1.subject();
        dispose = originStreamSubscribe(originStream, {
            next: function next(x) {
                return stream.next(x);
            },
            error: function error(err) {
                return stream.error(err);
            },
            complete: function complete(x) {
                stream.complete(x);
                if (typeof dispose === 'function') {
                    dispose();
                }
            }
        });
        return stream;
    },
    dispose: function dispose(sinks, sinkProxies, sources) {
        Object.keys(sinkProxies).forEach(function (k) {
            sinkProxies[k].observer.complete();
        });
    },
    makeSubject: function makeSubject() {
        var stream = most_subject_1.subject();
        var observer = {
            next: function next(x) {
                stream.next(x);
            },
            error: function error(err) {
                logToConsoleError(err);
                stream.error(err);
            },
            complete: function complete(x) {
                stream.complete(x);
            }
        };
        return { observer: observer, stream: stream };
    },
    isValidStream: function isValidStream(stream) {
        return typeof stream.drain === 'function' && typeof stream.subscribe === 'function';
    },
    streamSubscribe: function streamSubscribe(stream, observer) {
        var subscription = stream.subscribe(observer);
        return function () {
            return subscription.unsubscribe();
        };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MostAdapter;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});