	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		//Use to insert data
		client.query();
		//Use to read data
		const query = client.query();

		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			done();
			return res.json(results);
		});
	});