import socketIo from 'socket.io';
import { fetchAllFamilies, fetchMembers, fetchAllFamiliesWithMembers, fetchAllHohs } from './routes/users';

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

		client.on('fetchAllFamilies', function(data) {
			console.log(`fetchAllFamilies:`, data);
			fetchAllFamilies ((err, rows) => {
				if (err) reportError(client, err);
				client.emit('fetchAllFamilies:done', {json: {rows}, status: 200});
			});
		});

		client.on('fetchAllFamiliesWithMembers', function(data) {
			console.log(`fetchAllFamiliesWithMembers:`, data);
			fetchAllFamiliesWithMembers ((err, rows) => {
				if (err) reportError(client, err);
				client.emit('fetchAllFamiliesWithMembers:done', {json: {rows}, status: 200});
			});
		});

		client.on('fetchAllHohs', function(data) {
			console.log(`fetchAllHohs:`, data);
			fetchAllHohs ((err, rows) => {
				if (err) reportError(client, err);
				client.emit('fetchAllHohs:done', {json: {rows}, status: 200});
			});
		});

		client.on('fetchMembers', function(data) {
			console.log(`fetchMembers:`, data);
			fetchMembers (data.family_id, data.ldscookie, (err, json) => {
				if (err) reportError(client, err);
				client.emit(`fetchMembers:done:${data.family_id}`, {...json, status: 200});
			});
			
		});
	});

};
