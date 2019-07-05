<template>
    <div id="app">

        <!--
        <div id="nav">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        -->

        <!-- API panel -->
        <APIPanel class="apipanel"></APIPanel>

        <!-- Edit delete panel -->
        <EditDeletePanel class="editdeletepanel"></EditDeletePanel>

        <router-view/>
    </div>
</template>

<script>
    import APIPanel from '@/components/APIPanel.vue';
    import EditDeletePanel from '@/components/EditDeletePanel.vue';

    export default {
        name: 'App',
        components: {
            APIPanel,
            EditDeletePanel
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    #nav {
        padding: 30px;
        a {
            font-weight: bold;
            color: #2c3e50;
            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }

    // Panels
    .editdeletepanel {
        position:fixed !important;
        top: 10px;
        right: 10px;
        z-index: 99;
    }
    .apipanel {
        position:fixed;
        top: 60px;
        right: 10px;
        z-index: 99;
    }
</style>
