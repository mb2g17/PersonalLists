<template>

    <b-modal id="password-modal" hide-footer>

        <template slot="modal-title">
            Type in the password
        </template>

        <div class="d-block text-center">

            <!-- Password box -->
            <b-form-input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    @keydown.native.enter="done"
            ></b-form-input>

        </div>

        <!-- Buttons -->
        <b-container>
            <b-row>
                <b-col>
                    <b-button class="mt-3" block variant="primary" @click="done">Done</b-button>
                </b-col>
                <b-col>
                    <b-button class="mt-3" block variant="danger" @click="forgetIt">Forget it</b-button>
                </b-col>
            </b-row>
        </b-container>

    </b-modal>

</template>

<script>
    export default {
        name: "PasswordPanel",
        data: function() {
            return {
                password: "", // The inputted password
                callback: undefined // The callback function; passes in a promise
            };
        },
        methods: {
            /**
             * The parent wants to show this panel
             */
            show(callback) {
                // Store the callback
                this.callback = callback;

                // Show the dialog
                this.$bvModal.show('password-modal');
            },
            /**
             * The user has put in their password
             */
            done() {
                // Callback
                this.callback(new Promise((resolve, reject) => {
                    resolve(this.password);
                }));

                // Close dialog
                this.$bvModal.hide('password-modal');
            },
            /**
             * The user wants to abort
             */
            forgetIt() {
                // Callback
                this.callback(new Promise((resolve, reject) => {
                    reject("User cancelled");
                }));

                // Close dialog
                this.$bvModal.hide('password-modal');
            }
        }
    }
</script>

<style scoped>

</style>