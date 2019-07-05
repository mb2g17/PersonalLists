<template>

    <div @click="show = !show">

        <!-- If we should show the text -->
        <template v-if="show">
            Click to show/hide
        </template>

        <template v-else>

            <!-- If text is empty -->
            <template v-if="text">
                {{ text }}
            </template>
            <template v-else>
                Empty!
            </template>

        </template>

    </div>

</template>

<script>
    /**
     * Hides text. Click to reveal.
     */
    export default {
        name: "HiddenText",
        props: [
            "text"
        ],
        data: function() {
            return {
                show: true
            };
        }
    }
</script>

<style scoped>
    div:hover {
        cursor:pointer;
    }
</style>