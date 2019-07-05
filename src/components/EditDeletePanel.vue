<template>

    <b-button-group>
        <b-button variant="primary" :disabled="$store.state.mode === 0" @click="$store.commit('setMode', 0)">Normal</b-button>
        <b-button variant="warning" :disabled="$store.state.mode === 1" @click="$store.commit('setMode', 1)">Edit</b-button>
        <b-button variant="danger" :disabled="$store.state.mode === 2" @click="$store.commit('setMode', 2)">Delete</b-button>
    </b-button-group>

</template>

<script>
    /**
     * Allows user to toggle from normal, edit and delete
     */
    export default {
        name: "EditDeletePanel"
    }
</script>

<style scoped>
</style>