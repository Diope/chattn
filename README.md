# Chattn

A small Twitter-esque app, nothing new or novel ideas wise but not every app has to be.

Technologies:
* Vue
* Vuex
* Firestore / Google Storage
* Jest

Features added so far:
* User auth flow
* Create new posts with option to attach an image
* Modal to see full image
* Update account in settings
* Upload both profile photo and profile banner, changes are propagated through all posts and comments
* Comments
* Likes
* User Profile page (displays: handle, display name, profile pic, birthday, location, list of all posts made by a particular user)

TODO:
* Followers/Following
* Delete a post
* Make an account private


## Post project notes:

I am very much a fan of Vuex, and it feels MUCH more straightforward and easy to wrap one's head around over Redux, but I fully admit this could be because I've learned the Flux architecture by bashing my head on Redux for months (and honestly, I'm still not a guru or even remotely spectacular at Redux, I still have to look up a lot even on more obvious things. As an example, different actions for call to a backend API and for React actions was something that JUST clicked with me barely a month ago...)

Accessing store state from different components feels so much more simple than Redux, and Vue as a UI rendering layer gels so well with it.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```
