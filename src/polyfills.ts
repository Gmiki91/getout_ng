// in modern JavaScript/TypeScript environments like Angular, the global object, 
// which is typically available in Node.js or older JavaScript environments, 
// is not defined by default. @stomp/rx-stomp library needs the global object to run
(window as any).global = window;