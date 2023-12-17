const Firestore = require("@google-cloud/firestore");
const db = new Firestore({
  projectId: "count-eat-406314",
  keyFilename: "./credentials.json",
  ignoreUndefinedProperties: true,
});

// Add Data
const addDataUsers = async (data) => {
  const {
    username,
    email,
    password,
    tinggibadan,
    beratbadan,
    umur,
    gender,
    bmr,
  } = data;
  const docRef = db.collection("users").doc();
  await docRef.set({
    username,
    email,
    password,
    tinggibadan,
    beratbadan,
    umur,
    gender,
    bmr,
  });
};

// Get All Data
const showData = async () => {
  const snapshot = await db.collection("users").get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
  return snapshot;
};

// Get Data By Id
const getDataById = async (id) => {
  const snapshot = await db.collection("users").doc(id).get();
  if (snapshot.empty) {
    console.log("No such document!");
  } else {
    console.log("Document data:", snapshot.data());
  }
};

const getDataByKey = async (key, value) => {
  if (key === undefined || value === undefined) {
    console.error("Invalid key or value:", key, value);
    return false;
  }

  const usersRef = db.collection("users");
  const snapshot = await usersRef.where(key, "==", value).get();

  console.log("Query:", key, "==", value);

  if (snapshot.empty) {
    console.log("No matching documents.");
    return false;
  } else {
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];
  }
};

// Add existing data
const updateDetail = async (data) => {
  try {
    const { username, tinggibadan, beratbadan, umur } = data;
    console.log("Update Detail Data:", data);
    const existingUser = await getDataByKey("username", username);
    if (!existingUser) {
      console.log("User not found");
      return;
    }
    var bmr;
    if (existingUser.gender.toLowerCase() === "pria") {
      bmr = 66 + 13.7 * beratbadan + 5 * tinggibadan - 6.8 * umur;
    } else if (existingUser.gender.toLowerCase() === "wanita") {
      bmr = 665 + 9.6 * beratbadan + 1.8 * tinggibadan - 4.7 * umur;
    }
    console.log(bmr);
    if (!isNaN(bmr)) {
      // Update the document with the new data and BMR
      await db
        .collection("users")
        .doc(existingUser.id)
        .set(
          {
            tinggibadan,
            beratbadan,
            umur,
            bmr: Math.round(bmr),
          },
          { merge: true }
        );
      console.log("Update Successful");
    } else {
      console.log("Invalid BMR value");
    }
  } catch (err) {
    console.error("Update Failed:", err);
    throw err;
  }
};

module.exports = { addDataUsers, getDataByKey, updateDetail };


