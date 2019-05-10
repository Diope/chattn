import Vue from "vue";
import Vuex from "vuex";

const fb = require("./FirebaseConfig");

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		currentUser: null,
		userProfile: {}
	},
	mutations: {
		setCurrentUser(state, value) {
			state.currentUser = value;
		},
		setUserProfile(state, value) {
			state.userProfile = value;
		}
	},
	actions: {
		fetchUserProfile({ commit, state }) {
			fb.userCollection
				.doc(state.currentUser.uid)
				.get()
				.then(res => {
					commit("setUserProfile", res.data());
				})
				.catch(err => console.log(err));
		}
	}
});
