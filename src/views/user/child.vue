<template>
    <div>
        child
        <input type="text" v-model="parentMsg.a">
    </div>
</template>

<script>
    export default {
        name: 'child',
        data () {
            return {

            }
        },
        props:['parentMsg']
    };
</script>

<style scoped>

</style>
