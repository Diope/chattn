<h1 align="center">Welcome to Chattn 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/diope/chattn#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/diope/chattn/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/diope/chattn/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

A small twitter-esque app created as a playground to teach myself/learn Vue/Vuex.

>Technologies:
 
> * Vue
> * Vuex
> * Firestore / Google Storage
> * Jest

> Features added so far:

> * User auth flow
> * Create new posts with option to attach an image
> * Delete posts
> * Bookmark feature
> * Modal to see full image
> * Update account in settings
> * Upload both profile photo and profile banner, changes are propagated through all posts and comments
> * Commenting
> * Likes
> * User Profile page (displays: handle, display name, profile pic, birthday, location, list of all posts made by a particular user)


> TODO:

> * Followers/Following
> * Make an account private
> * The continued refactoring of various components
> * Major CSS refactoring and consolidation so much duplication it's humilating tbh.

> Notes:

Note to self, use a CSS framework next time instead of doing it all from scratch, regardless it's a fun exercise!

Having worked on this for a while, there are quite a few things I realize I need to do. There is heavy code reuse in some places which I need to address, and to break more things out into their own components. I also need to make some of the methods global as they're being used a lot (ex: delete pane), I've already moved my filters to global. A lot needs to be done but the progress is nice. I feel much more productive with Vue than React but I do still find myself doing things the React way in lieu of not really knowing how to do them the Vue way.



### 🏠 [Homepage](https://github.com/diope/chattn)

## Install

```sh
yarn install
yarn serve
```

## Author

👤 **Dion Pettaway**

* Twitter: [@SoMiskeen](https://twitter.com/SoMiskeen)
* Github: [@diope](https://github.com/diope)

## 🤝 Contributing

Contributions, issues and feature requests are welcome !<br />Feel free to check [issues page](https://github.com/diope/chattn/issues).

## Show your support

Give a ⭐️ if this project helped you !

## 📝 License

Copyright © 2019 [Dion Pettaway](https://github.com/diope).<br />
This project is [MIT](https://github.com/diope/chattn/blob/master/LICENSE) licensed.
