<template>

    <div>
        <a v-if="link" :href="link">
            <slot></slot>
        </a>
        <slot v-else></slot>
    </div>

</template>

<script>
    /**
     * Optional link. If link provided is empty, no a tag.
     * If there is a link, an a tag is used.
     */
    export default {
        name: "OptionalLink",
        props: {
            "link": String
        }
    }
</script>

<style scoped>

</style>