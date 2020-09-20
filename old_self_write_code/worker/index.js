const keys = require('./keys');
const redis = require('redis');

//creating a Redis Client
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: ()=> 1000
});

//creating a duplicate client of redis
const sub = redisClient.duplicate();

//function to calculate fibannoci values

function fib(index) {
	if(index<2) return 1;
	return fib(index-1)+fib(index-2);
}

//we are using duplicate redis client to get subscribed messages

sub.on('message', (channel,message)=>{
	redisClient.hset('values',message, fib(parseInt(message)));
});
sub.sunscribe('insert');