<template>
    <div :class="`${$options.name}__appTitle`">
                    <router-link to="/timeline" exact><div class="title">Chattn</div></router-link>
                </div>
                <div :class="`${$options.name}__userInfoWrapper`">
                    <div @click="isDropDownOpen=!isDropDownOpen">
                        <div :class="`${$options.name}__userInfo`">
                            <div :class="`${$options.name}__userInfo-avatar`">
                                <img src="../assets/images/default.png" alt="avatar" style="height: 100%; width: 100%; object-fit: cover;">
                            </div>
                            {{userProfile.displayName}}
                            <i :class="{ 'fa-caret-up': showDropDown, 'fa-caret-down': !showDropDown }" class="fa" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div>
</template>

<div class="my-dropdown">
    <!-- On click we call the toggle method -->
                    <div class="selected" @click="toggle">{{userProfile.displayName}}</div>
                    <div class="options" v-show="isOpen">
                <!-- v-for loops trough `options` -->
                <!-- and renders a div containing the `option`s value. -->
                        <div class="option" v-show="isOpen">
                            <ul class="">
                                <li>
                                    <router-link to="/timeline" exact>Timeline</router-link>
                                </li>
                                <li>
                                    <router-link to="settings" exact>Settings</router-link>
                                </li>
                                <li>
                                    <a @click="logout">logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>