import socketIo from 'socket.io';
import { fetchAllMembers } from './routes/users';

const reportError = (client, err, msg) => {
	client.emit('error', err, msg);
};

export const io = (server) => {
	
	const io = socketIo(server);

	io.on('connection', function(client) {  
		console.log('Client connected...');

		client.on('join', function(data) {
			console.log(`join: ${data}`);
			client.emit('joined', 'Greetings program');
		});

		client.on('fetchAllMembers', function(data) {
			console.log(`fetchAllMembers: ${data}`, fetchAllMembers);
			fetchAllMembers ((err, rows) => {
				if (err) reportError(client, err);
				client.emit('fetchAllMembers:done', {json: {rows}, status: 200});
			});
			
		});
	});

};
