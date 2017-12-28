var heapdump = require('heapdump');
heapdump.writeSnapshot('/home/ubuntu/software/heapdump/' + Date.now() + '.heapsnapshot');