const Firestore = require('@google-cloud/firestore');
const db = new Firestore({
	projectId: 'counteatapi',
	keyFilename: './credentials.json',
});

// add data
const addDataUsers = async (data) => {
	const { username, email, password, tinggibadan, beratbadan, umur } = data;
	const docRef = db.collection('users').doc();
	await docRef.set({
		username,
		email,
		password,
		tinggibadan,
		beratbadan,
		umur
	});
};

// get all data
const showData = async () => {
	const snapshot = await db.collection('users').get();
	snapshot.forEach((doc) => {
		console.log(doc.id, '=>', doc.data());
	});
	return snapshot;
};

// get data by id
const getDataById = async (id) => {
	const snapshot = await db.collection('users').doc(id).get();
	if (snapshot.empty) {
		console.log('No such document!');
	} else {
		console.log('Document data:', snapshot.data());
	}
};

const getDataByKey = async (key, value) => {
	const usersRef = db.collection('users');
	const snapshot = await usersRef.where(key, '==', value).get();
	if (snapshot.empty) {
		return false;
	} else {
		return snapshot.docs[0].data();
	}
};

//update data
const updateData = async (data) => {
	const { id, email, password, username, tinggibadan, beratbadan, umur } = data;
	await db
		.collection('users')
		.doc(id)
		.update({
			email,
			password,
			username,
			tinggibadan,
			beratbadan,
			umur
		})
		.then((res) => console.log(res))
		.catch((err) => console.log(err));
};

module.exports = { addDataUsers, getDataByKey };
