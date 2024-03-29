import { async } from "@firebase/util";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  SET_USER,
  SET_LOADING_STATUS,
  GET_ARTICLES,
  GET_LAST_ITEM,
} from "./actionType";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import db from "../firebase";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  loading: status,
});

export const getArticles = (payload, lastItem) => ({
  type: GET_ARTICLES,
  articles: payload,
  lastItem: lastItem,
});

export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        dispatch(setUser(payload.user));
      })
      .catch((error) => alert(error.message));
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    signOut(auth)
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => alert(error.message));
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));
    if (payload.image !== "") {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, payload.image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progress: ${progress}`);
          if (snapshot.state === "RUNNING") {
            console.log(`Progress: ${progress}`);
          }
        },
        (error) => console.log(error.code),

        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          addDoc(collection(db, "articles"), {
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            sharedImg: downloadURL,
            comments: 0,
            description: payload.description,
          });
          dispatch(setLoading(false));
        }
      );
    } else {
      addDoc(collection(db, "articles"), {
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoURL,
        },
        video: payload.video,
        sharedImg: "",
        comments: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticlesAPI(loadNumber = 0) {
  return (dispatch) => {
    let payload;
    let lastItem;
    let initNumber = 30;
    let limitNumber = initNumber + loadNumber;

    console.log(loadNumber)

    if (limitNumber === 3) {
      onSnapshot(
        query(
          collection(db, "articles"),
          orderBy("actor.date", "desc"),
          limit(initNumber)
        ),
        (snapshot) => {
          payload = snapshot.docs.map((doc) => doc.data());
          lastItem = snapshot.docs.length;
          dispatch(getArticles(payload, lastItem));
        }
      );
    } else if (limitNumber > 3) {
      onSnapshot(
        query(
          collection(db, "articles"),
          orderBy("actor.date", "desc"),
          limit(limitNumber)
        ),
        (snapshot) => {
          payload = snapshot.docs.map((doc) => doc.data());
          lastItem = snapshot.docs.length;
          dispatch(getArticles(payload, lastItem));
        }
      );
    }
  };
}
