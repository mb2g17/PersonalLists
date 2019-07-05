<template>

    <div class="apipanel">

        <!-- Password panel for saving -->
        <PasswordPanel ref="passwordPanel"></PasswordPanel>

        <p v-if="enabled">API is enabled!</p>
        <p v-else>API is disabled.</p>

        <b-button-group>

            <!-- Saves data -->
            <b-button variant="primary" :disabled="performing.length > 0" @click="saveData">Save</b-button>

            <!-- Reloads data -->
            <b-button variant="primary" :disabled="performing.length > 0" @click="reloadData">Reload</b-button>

        </b-button-group>

        <p v-if="performing.length > 0">{{ performing }}</p>

    </div>

</template>

<script>
    import axios from "axios";
    import PasswordPanel from "./PasswordPanel";

    export default {
        name: "APIPanel",
        components: {
            PasswordPanel
        },
        data: function() {
            return {
                enabled: false, // If API is enabled, or works
                performing: "" // If we're doing some API call
            };
        },
        methods: {
            /**
             * The user wants to save data
             */
            saveData() {
                // We are now performing
                this.performing = true;

                // Function that promises to clear data, then uses a callback promise function
                // to make a new callback promise to run afterwards
                function clearPromise(thisObj, password, callbackPromise) {
                    new Promise(resolve => {

                        // Logs that we're clearing
                        thisObj.performing = "Clearing";

                        // Sets up POST params
                        const params = new URLSearchParams();
                        params.append('password', password);

                        // Does request
                        axios.post('api/clear.php', params)
                            .then(response => {
                                // If we succeeded
                                if (response.data === "success") {
                                    console.log("Successfully cleared!");
                                    return callbackPromise();
                                } else {
                                    // State error
                                    alert("Error: " + response.data.error);
                                }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                });
            }

            // Function that chains all the table update promises
            function f(thisObj, arr, password) {
                if (arr.length === 0)
                    return new Promise( () => {
                        // Closes log and states we're done
                        thisObj.performing = "";
                        alert("Successfully saved!");
                    } );
                else
                {
                    return new Promise(resolve => {

                        // Logs that we're writing
                        thisObj.performing = "Writing " + arr[0].name;

                        // Sets up parameters
                        const params = new URLSearchParams();
                        params.append('data', JSON.stringify(arr[0]));
                        params.append('password', password);

                        // Write API
                        axios.post('api/write.php', params)
                            .then(response => {
                                // If we succeeded
                                if (response.data === "success") {
                                    console.log("Successfully written " + arr[0].name + " !");

                                    arr.splice(0, 1);
                                    return f(thisObj, arr, password);
                                } else {
                                    // State error
                                    alert("Error: " + response.data.error);
                                    console.log(response.data);
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    });
                }
            }

            // Gets a password
            this.$refs.passwordPanel.show(promise => {
                promise
                    .then(password => {

                        // Clears and updates tables
                        clearPromise(
                            this,
                            password,
                            () => f(this,
                                JSON.parse(JSON.stringify(this.$store.state.lists)),
                                password)
                        );

                    })
                    .catch(error => {})
                    .finally(() => {
                        // No longer performing
                        this.performing = false;
                    });
                });
            },
            /**
             * The user wants to reload data (discard changes)
             */
            reloadData() {
                // We are now performing
                this.performing = true;

                // Read API
                axios.get('api/read.php')
                    .then(response => {
                        // Set response data to state data
                        this.$store.commit('setAll', response.data);
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        // No longer performing
                        this.performing = false;
                    });
            }
        },
        mounted() {
            // Try to access API
            axios.get('api/test.php')
                .then(response => {
                    // If we were successful
                    if (response.data === "success")
                    {
                        // Enable API
                        this.enabled = true;

                        // Reload data
                        this.reloadData();
                    }
                });
        }
    }
</script>

<style scoped>
    .apipanel {
        background-color: #BFF;
        border-radius: 5px;
    }
</style>