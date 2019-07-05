<template>

    <div class="home">

        <!-- JSON editor -->
        <JSONEditor ref="jsonEditor"></JSONEditor>

        <!-- Title -->
        <h1>Lists</h1>

        <!-- Score scale -->
        <b-button id="scorescale" variant="primary">Score Scale</b-button>
        <b-popover target="scorescale" triggers="hover focus" placement="bottom">
            <template slot="title">Score Scale</template>
            <ol reversed start="10">
                <li>Masterpiece</li>
                <li>Godly</li>
                <li>Awesome</li>
                <li>Good</li>
                <li>Alright</li>
                <li>Meh</li>
                <li>Bad</li>
                <li>Terrible</li>
                <li>Trash</li>
                <li>Burn it</li>
                <li>Not Applicable</li>
            </ol>
        </b-popover>

        <!-- List blocks -->
        <b-container>
            <b-row>

                <!-- List links -->
                <b-col v-for="(list, listID) in $store.state.lists" :key="list.name" style="margin-bottom:15px" @click="listClick(listID)">
                    <b-card
                            class="pointerHover"
                            :title="list.name"
                            :bg-variant="$store.state.mode === 0 ? 'primary' : $store.state.mode === 1 ? 'warning' : 'danger'"
                            :text-variant="$store.state.mode === 1 ? 'black' : 'white'"
                    >
                        <b-card-text>
                            {{ list.description }}
                        </b-card-text>
                    </b-card>
                </b-col>

                <!-- Add a new link -->
                <b-col class="pointerHover" @click="newListClick()">
                    <b-card
                            title="+"
                            bg-variant="success"
                            text-variant="white"
                    >
                        <b-card-text>
                            Add a new list
                        </b-card-text>
                    </b-card>
                </b-col>

            </b-row>
        </b-container>


    </div>

</template>

<script>
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue';
    import JSONEditor from "@/components/JSONEditor";
    import _ from "lodash";
    import * as misc from "@/misc.js";

    export default {
        name: 'home',
        components: {
            JSONEditor,
            HelloWorld,
        },
        data: function() {
            return {
            };
        },
        methods: {
            /**
             * User wants to create a new list
             */
            newListClick() {
                this.$store.commit('addNewList');
                this.$store.state.mode = 1;
                this.listClick(this.$store.state.lists.length - 1);
                this.$store.state.mode = 0;
            },
            /**
             * User clicks on a list
             * @param listID - the list the user wants to go to
             */
            listClick(listID) {
                // Gets list
                let list = this.$store.getters.getList(listID);

                switch (this.$store.state.mode)
                {
                    case 0: // NORMAL
                        // Go to list URL
                        this.$router.push(listID + "");
                        break;
                    case 1: // EDIT
                        // Gets JSON to edit
                        let JSONToEdit = {
                            "name": list.name,
                            "columns": list.columns,
                            "description": list.description
                        };

                        // Opens up JSON editor to edit
                        this.$refs.jsonEditor.show(list.name, JSON.stringify(JSONToEdit, null, 2), function(json) {
                            // Checks if the name property exists
                            if (!('name' in json.columns)) {
                                alert("You do not have the name property! Adding it now...");
                                json.columns.name = 8;
                            }

                            // Checks if list name already exists
                            if (this.$store.getters.checkListDuplicate(listID, json.name)) {
                                alert("List name already exists! Changing name to something random...");
                                json.name = misc.randomString(16);
                            }

                            // Updates list
                            this.$store.commit('updateList', {list: json, listID: listID});
                        });
                        break;
                    case 2: // DELETE
                        // Delete list
                        this.$store.commit('deleteList', listID);
                        break;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    // Makes a pointer cursor appear when hover
    .pointerHover:hover {
        cursor:pointer;
    }

    // Puts score scale at the top
    #scorescale {
        position:fixed;
        left: 10px;
        top: 10px;
    }
</style>